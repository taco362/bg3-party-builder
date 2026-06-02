'use client';

import React, { useState } from 'react';

interface JoinPartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  partyTitle: string;
}

export default function JoinPartyModal({ isOpen, onClose, partyTitle }: JoinPartyModalProps) {
  const [userName, setUserName] = useState('');
  const [characterRace, setCharacterRace] = useState('Human');
  const [characterClass, setCharacterClass] = useState('Fighter');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`가짜 데이터 모드: '${userName}'님이 파티에 참가 신청되었습니다!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#FAF8F5] p-6 rounded-2xl shadow-xl border border-[#EFECE6]">
        <h2 className="text-xl font-bold text-[#4A443C] mb-2 text-center">⚔️ 파티 참가 신청</h2>
        <p className="text-xs text-center text-[#9C9284] mb-6 truncate px-4">대상 방: {partyTitle}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#6B6155] mb-1">플레이어 닉네임</label>
            <input type="text" required placeholder="닉네임을 입력하세요" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white border border-[#E5E0D8] text-[#4A443C] focus:outline-none focus:border-[#C2B49A]" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#6B6155] mb-1">나의 종족(Race)</label>
            <select value={characterRace} onChange={(e) => setCharacterRace(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white border border-[#E5E0D8] text-[#4A443C] focus:outline-none">
              <option value="Human">Human (인간)</option>
              <option value="Elf">Elf (엘프)</option>
              <option value="Dwarf">Dwarf (드워프)</option>
              <option value="Githyanki">Githyanki (기스양키)</option>
              <option value="Tiefling">Tiefling (티프링)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#6B6155] mb-1">나의 직업(Class)</label>
            <select value={characterClass} onChange={(e) => setCharacterClass(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white border border-[#E5E0D8] text-[#4A443C] focus:outline-none">
              <option value="Fighter">Fighter (파이터)</option>
              <option value="Wizard">Wizard (위저드)</option>
              <option value="Rogue">Rogue (로그)</option>
              <option value="Cleric">Cleric (클레릭)</option>
              <option value="Bard">Bard (바드)</option>
              <option value="Paladin">Paladin (팔라딘)</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl bg-[#EFECE6] text-[#6B6155] font-medium hover:bg-[#E5E0D8] transition-colors">취소</button>
            <button type="submit" className="flex-1 py-2 rounded-xl bg-[#8A7A65] text-white font-medium hover:bg-[#766754] transition-colors shadow-sm">참가 완료</button>
          </div>
        </form>
      </div>
    </div>
  );
}