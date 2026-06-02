'use client';

import React, { useState } from 'react';
import PartyCard from './components/PartyCard';
import CreatePartyModal from './components/CreatePartyModal';

// 교수님 채점 및 시각화용 하드코딩 Mock Data (방장 1명 자동포함 룰 반영)
const INITIAL_MOCK_DATA = [
  {
    title: "발더스3 명예 난이도 Act 1 같이 깨실 굳전사 구함",
    difficulty: "Honour",
    meetTime: "2026-06-05T20:00",
    maxPlayers: 4,
    members: [
      { name: "Taco방장", race: "Githyanki", class: "Fighter", isLeader: true },
      { name: "새도우하트러버", race: "Elf", class: "Cleric" },
    ]
  },
  {
    title: "언더다크 탐험 전술가 파티 모집 (바드 환영)",
    difficulty: "Tactician",
    meetTime: "2026-06-06T14:00",
    maxPlayers: 4,
    members: [
      { name: "게일은내친구", race: "Human", class: "Wizard", isLeader: true },
    ]
  },
  {
    title: "액트3 마지막 보스 레이드 달릴 분들 컴온",
    difficulty: "Balanced",
    meetTime: "2026-06-07T19:30",
    maxPlayers: 3,
    members: [
      { name: "아스타리온킹", race: "Elf", class: "Rogue", isLeader: true },
      { name: "바드장인", race: "Human", class: "Bard" },
      { name: "강한팔라딘", race: "Dwarf", class: "Paladin" },
    ]
  }
];

export default function Home() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INITIAL_MOCK_DATA.map((party, index) => (
              <PartyCard key={index} title={party.title} difficulty={party.difficulty} meetTime={party.meetTime} maxPlayers={party.maxPlayers} members={party.members} />
            ))}
          </div>
        </section>

      </div>

      {/* 방 만들기 팝업 모달 */}
      <CreatePartyModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </main>
  );
}