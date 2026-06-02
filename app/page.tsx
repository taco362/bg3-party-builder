'use client';

import React, { useState, useEffect } from 'react';
import PartyCard from './components/PartyCard';
import CreatePartyModal from './components/CreatePartyModal';

export default function Home() {
  const [parties, setParties] = useState<any[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // DB 실시간 데이터 바인딩 함수
  const fetchParties = async () => {
    try {
      const res = await fetch('/api/parties');
      const data = await res.json();
      if (Array.isArray(data)) {
        setParties(data);
      }
    } catch (err) {
      console.error("데이터 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);

  return (
    <main className="min-h-screen bg-[#F7F4EF] text-[#4A443C] p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* 상단 헤더 영역 */}
        <header className="flex flex-col sm:flex-row items-center justify-between border-b border-[#EFECE6] pb-6 mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#4A443C]">🎲 BG3 Party Builder</h1>
            <p className="text-sm text-[#9C9284] mt-1">발더스 게이트 3 캠페인을 함께할 완벽한 파티원을 매칭하세요.</p>
          </div>
          <button onClick={() => setIsCreateOpen(true)} className="px-5 py-2.5 bg-[#8A7A65] text-white font-semibold rounded-xl shadow-sm hover:bg-[#766754] transition-colors text-sm">
            ➕ 파티 모집 생성
          </button>
        </header>

        {/* 파티 리스트 보드 영역 */}
        <section>
          <h2 className="text-xl font-bold text-[#6B6155] mb-4">현재 모집 중인 파티 목록</h2>
          
          {loading ? (
            <p className="text-center py-10 text-[#9C9284]">데이터베이스 연결 중...</p>
          ) : parties.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#EFECE6] p-8">
              <p className="text-[#9C9284] mb-2">개설된 파티 모집 세션이 없습니다.</p>
              <p className="text-xs text-[#AFA493]">우측 상단의 버튼을 눌러 첫 번째 파티를 개설해 보세요!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parties.map((party) => (
                <PartyCard 
                  key={party.id}
                  id={party.id}
                  title={party.title} 
                  difficulty={party.difficulty} 
                  meetTime={party.meet_time} 
                  maxPlayers={party.max_players} 
                  members={party.members}
                  onRefresh={fetchParties}
                />
              ))}
            </div>
          )}
        </section>

      </div>

      {/* 방 만들기 팝업 모달 */}
      <CreatePartyModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onRefresh={fetchParties} />
    </main>
  );
}