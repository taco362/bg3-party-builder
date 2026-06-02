import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 3. 동시성 제어 트랜잭션을 적용한 파티 참가 로직 (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { partyId, userName, characterRace, characterClass } = body;

    // Supabase 클라우드 데이터베이스에 직접 작성한 안정적인 내부 트랜잭션 함수(RPC)를 트리거합니다.
    // 💡 왜 RPC를 쓰나요? 
    // 백엔드 서버와 DBMS 간의 네트워크 왕복 도중 다른 요청이 끼어드는 것을 원천 차단하고,
    // PostgreSQL 내부에서 `SELECT ... FOR UPDATE`로 해당 파티 로우에 '락(Lock)'을 걸어 완벽한 동시성 트랜잭션을 수행하기 위함입니다!
    
    const { data, error } = await supabase.rpc('safe_join_party', {
      p_party_id: partyId,
      p_user_name: userName,
      p_character_race: characterRace,
      p_character_class: characterClass
    });

    if (error) throw error;

    // Postgres 함수가 리턴한 결과에 따른 예외 처리
    if (data === 'PARTY_FULL') {
      return NextResponse.json({ error: '파티 정원이 이미 초과되었습니다!' }, { status: 409 });
    }
    if (data === 'PARTY_NOT_FOUND') {
      return NextResponse.json({ error: '존재하지 않는 파티입니다.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}