import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 1. 3개 테이블 조인(Join) 데이터 조회 (GET)
export async function GET() {
  try {
    // 3개 테이블을 엮어서 프론트엔드가 원래 원하던 { name, race, class } 구조로 맵핑하여 가져옴
    const { data, error } = await supabase
      .from('bg3_parties')
      .select(`
        id, title, difficulty, max_players, meet_time,
        bg3_participants (
          is_leader,
          bg3_characters (user_name, character_race, character_class)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // 프론트엔드 컴포넌트가 깨지지 않도록 가공 (어댑터 패턴)
    const formattedData = data.map((party: any) => ({
      id: party.id,
      title: party.title,
      difficulty: party.difficulty,
      max_players: party.max_players,
      meet_time: party.meet_time,
      members: party.bg3_participants.map((p: any) => ({
        name: p.bg3_characters?.user_name,
        race: p.bg3_characters?.character_race,
        class: p.bg3_characters?.character_class,
        isLeader: p.is_leader
      }))
    }));

    return NextResponse.json(formattedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. 방 생성 + 방장 캐릭터 생성 및 참가 복합 로직 (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, difficulty, maxPlayers, meetTime, password, leaderName, leaderRace, leaderClass } = body;

    // 1단계: 방 생성
    const { data: partyData, error: partyError } = await supabase
      .from('bg3_parties')
      .insert([{ title, difficulty, max_players: maxPlayers, meet_time: meetTime, password }])
      .select().single();

    if (partyError) throw partyError;

    // 2단계: 방장 캐릭터 생성
    const { data: charData, error: charError } = await supabase
      .from('bg3_characters')
      .insert([{ user_name: leaderName, character_race: leaderRace, character_class: leaderClass }])
      .select().single();

    if (charError) {
      await supabase.from('bg3_parties').delete().eq('id', partyData.id);
      throw charError;
    }

    // 3단계: 매칭 맵핑 테이블에 연결 정보 삽입 (참조 무결성 보장)
    const { error: participantError } = await supabase
      .from('bg3_participants')
      .insert([{ party_id: partyData.id, character_id: charData.id, is_leader: true }]);

    if (participantError) {
      await supabase.from('bg3_characters').delete().eq('id', charData.id);
      await supabase.from('bg3_parties').delete().eq('id', partyData.id);
      throw participantError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}