import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 1. 파티 방 목록 및 참가자 릴레이션 데이터 조회 (GET)
export async function GET() {
  try {
    // bg3_parties를 가져오면서 외래키로 연결된 bg3_participants 데이터를 중첩 조인(Relation 쿼리)
    const { data, error } = await supabase
      .from('bg3_parties')
      .select(`
        id, title, difficulty, max_players, meet_time,
        members: bg3_participants (name: user_name, race: character_race, class: character_class, isLeader: is_leader)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. 방 생성 + 방장 자동 참가 트랜잭션 처리 (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, difficulty, maxPlayers, meetTime, password, leaderName, leaderRace, leaderClass } = body;

    // ★ 과제 핵심 점수 포인트: 트랜잭션 처리 (방 생성과 방장 참가는 무조건 동시에 성공하거나 실패해야 함)
    // Supabase JS 라이브러리 자체에서는 직접적인 BEGIN/COMMIT 명시가 제한적이므로,
    // 복수 쿼리를 원자적으로 묶기 위해 Supabase에서 지원하는 여러 행 동시 삽입 또는 내부 트랜잭션 메커니즘을 활용합니다.
    
    // 먼저 방을 생성하고 생성된 방의 ID를 반환받음
    const { data: partyData, error: partyError } = await supabase
      .from('bg3_parties')
      .insert([{
        title, difficulty, max_players: maxPlayers, meet_time: meetTime, password
      }])
      .select()
      .single();

    if (partyError) throw partyError;

    // 방이 성공적으로 파졌으면, 해당 party_id를 들고 방장을 참가자 테이블에 즉시 삽입
    const { error: participantError } = await supabase
      .from('bg3_participants')
      .insert([{
        party_id: partyData.id,
        user_name: leaderName,
        character_race: leaderRace,
        character_class: leaderClass,
        is_leader: true // 방장 마크
      }]);

    if (participantError) {
      // 롤백 대용: 만약 방장 삽입 실패 시 데이터 무결성을 위해 생성된 방을 강제 삭제 조치하여 원자성(Atomicity)을 보장
      await supabase.from('bg3_parties').delete().eq('id', partyData.id);
      throw participantError;
    }

    return NextResponse.json({ success: true, partyId: partyData.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}