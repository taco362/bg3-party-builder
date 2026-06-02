'use client';

import React, { useState } from 'react';
import JoinPartyModal from './JoinPartyModal';

interface Member {
  name: string;
  race: string;
  class: string;
  isLeader?: boolean;
}

interface PartyCardProps {
  id: number;
  title: string;
  difficulty: string;
  meetTime: string;
  maxPlayers: number;
  members: Member[];
  onRefresh: () => void;
}

export default function PartyCard({ id, title, difficulty, meetTime, maxPlayers, members = [], onRefresh }: PartyCardProps) {
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const currentPlayers = members.length;
  const isFull = currentPlayers >= maxPlayers;

  const getDifficultyColor = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case 'honour': return 'bg-[#F2DEDE] text-[#A94442] border-[#EBCCD1]';
      case 'tactician': return 'bg-[#FCF8E3] text-[#8A6D3B] border-[#FAEBCC]';
      default: return 'bg-[#D9EDF7] text-[#31708F] border-[#BCE8F1]';
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#EFECE6] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-3 gap-2">
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
          <span className="text-sm font-bold text-[#8A7A65]">
            👥 {currentPlayers} / {maxPlayers}
          </span>
        </div>

        <h3 className="text-lg font-bold text-[#4A443C] mb-2 line-clamp-1">{title}</h3>
        <p className="text-xs text-[#9C9284] mb-4">📅 출발: {new Date(meetTime).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        
        <div className="space-y-2 mb-6">
          <p className="text-xs font-semibold text-[#6B6155]">현재 구성원:</p>
          <div className="flex flex-wrap gap-1.5">
            {members && members.map((member, index) => (
              <div key={index} className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 border ${member.isLeader ? 'bg-[#FDFBF7] border-[#DED9CF] text-[#4A443C]' : 'bg-[#FAF8F5] border-[#EFECE6] text-[#6B6155]'}`}>
                {member.isLeader && <span className="text-[10px]">👑</span>}
                <span className="font-semibold">{member.name}</span>
                <span className="text-[10px] text-[#AFA493]">({member.race} / {member.class})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button onClick={() => setIsJoinOpen(true)} disabled={isFull} className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors ${isFull ? 'bg-[#EFECE6] text-[#AFA493] cursor-not-allowed' : 'bg-[#FAF8F5] text-[#6B6155] border border-[#DED9CF] hover:bg-[#F3EFE9]'}`}>
        {isFull ? '모집 완료' : '파티 참가 신청'}
      </button>

      <JoinPartyModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} partyId={id} partyTitle={title} onRefresh={onRefresh} />
    </div>
  );
}