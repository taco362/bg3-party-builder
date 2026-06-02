'use client';

import React, { useState } from 'react';

interface CreatePartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export default function CreatePartyModal({ isOpen, onClose, onRefresh }: CreatePartyModalProps) {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('Balanced');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [meetTime, setMeetTime] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderRace, setLeaderRace] = useState('Human');
  const [leaderClass, setLeaderClass] = useState('Fighter');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/parties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, difficulty, maxPlayers, meetTime, password, leaderName, leaderRace, leaderClass
        }),
      });

      if (!res.ok) throw new Error('방 생성 실패');

      alert('👑 방 생성 및 방장 자동 참가 완료!');
      onRefresh(); // 메인 화면 리스트 새로고침
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#FAF8F5] p-8 rounded-2xl shadow-xl border border-[#EFECE6] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-[#4A443C] mb-6 text-center">🎲 새 파티 모집 세션 생성</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#6B6155] mb-1">파티 제목</label>
            <input type="text" required placeholder="예: 명예 난이도 액트1 카그하 처치 팟" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white border border-[#E5E0D8] text-[#4A443C] focus:outline-none focus:border-[#C2B49A]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#6B6155] mb-1">게임 난이도</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white border border-[#E5E0D8] text-[#4A443C] focus:outline-none">
                <option value="Explorer">Explorer (개척자)</option>
                <option value="Balanced">Balanced (균형)</option>
                <option value="Tactician">Tactician (전술가)</option>
                <option value="Honour">Honour (명예)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#6B6155] mb-1">최대 인원 수</label>
              <select value={maxPlayers} onChange={(e) => setMaxPlayers(Number(e.target.value))} className="w-full px-4 py-2 rounded-xl bg-white border border-[#E5E0D8] text-[#4A443C] focus:outline-none">
                <option value={2}>2명</option>
                <option value={3}>3명</option>
                <option value={4}>4명</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#6B6155] mb-1">시작 날짜 / 시간</label>
            <input type="datetime-local" required value={meetTime} onChange={(e) => setMeetTime(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white border border-[#E5E0D8] text-[#4A443C] focus:outline-none" />
          </div>

          <div className="p-4 bg-[#F3EFE9] rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-[#5A5045]">👑 방장(나) 캐릭터 설정</h3>
            <div>
              <input type="text" required placeholder="방장 닉네임" value={leaderName} onChange={(e) => setLeaderName(e.target.value)} className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E5E0D8] text-[#4A443C] text-sm focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select value={leaderRace} onChange={(e) => setLeaderRace(e.target.value)} className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E5E0D8] text-[#4A443C] text-sm focus:outline-none">
                <option value="Human">Human (인간)</option>
                <option value="Elf">Elf (엘프)</option>
                <option value="Dwarf">Dwarf (드워프)</option>
                <option value="Githyanki">Githyanki (기스양키)</option>
                <option value="Tiefling">Tiefling (티프링)</option>
              </select>
              <select value={leaderClass} onChange={(e) => setLeaderClass(e.target.value)} className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E5E0D8] text-[#4A443C] text-sm focus:outline-none">
                <option value="Fighter">Fighter (파이터)</option>
                <option value="Wizard">Wizard (위저드)</option>
                <option value="Rogue">Rogue (로그)</option>
                <option value="Cleric">Cleric (클레릭)</option>
                <option value="Bard">Bard (바드)</option>
                <option value="Paladin">Paladin (팔라딘)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#6B6155] mb-1">방 비밀번호 (4자리)</label>
            <input type="password" required maxLength={4} placeholder="1234" value={password} onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-2 rounded-xl bg-white border border-[#E5E0D8] text-[#4A443C] focus:outline-none" />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-[#EFECE6] text-[#6B6155] font-medium hover:bg-[#E5E0D8] transition-colors">취소</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-[#8A7A65] text-white font-medium hover:bg-[#766754] transition-colors shadow-sm disabled:opacity-50">
              {loading ? '생성 중...' : '생성하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}