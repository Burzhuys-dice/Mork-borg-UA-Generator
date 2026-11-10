import React, { useState } from 'react';
import { Skull, Users, BookOpen, Dices, Volume2, VolumeX, Plus, BookmarkCheck, Printer } from 'lucide-react';
import { toggleAmbientSound } from '../utils/audio';

interface NavbarProps {
  currentTab: 'single' | 'batch' | 'roster' | 'rules';
  setCurrentTab: (tab: 'single' | 'batch' | 'roster' | 'rules') => void;
  onGenerateNew: () => void;
  savedCount: number;
  openDiceModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onGenerateNew,
  savedCount,
  openDiceModal,
}) => {
  const [isAudioOn, setIsAudioOn] = useState(false);

  const handleAudioToggle = () => {
    const newState = toggleAmbientSound();
    setIsAudioOn(newState);
  };

  return (
    <header className="no-print bg-[#0d0d0d] border-b-3 border-black sticky top-0 z-40 shadow-xl max-h-[12vh]">
      <div className="max-w-7xl mx-auto px-3 py-2 flex items-center justify-between gap-2">
        {/* Brand Zone */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-[#fee715] text-black p-1.5 font-black border-2 border-black rotate-[-2deg] shadow-[2px_2px_0px_#000]">
            <Skull className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="hidden min-[400px]:block">
            <h1 className="text-lg md:text-2xl font-heading font-black tracking-wider text-[#fee715] uppercase leading-tight whitespace-nowrap">
              SCVMBIRTHER <span className="text-[#ff0055] text-sm font-mono">UA</span>
            </h1>
            <p className="text-[10px] text-[#a0a0a0] font-mono leading-none hidden sm:block">
              MÖRK BORG Bare Bones
            </p>
          </div>
        </div>

        {/* Navigation Tabs - Horizontally scrollable on small screens */}
        <nav className="flex items-center gap-1 bg-[#1a1a1a] p-1 border-2 border-black overflow-x-auto max-w-[50vw] sm:max-w-none no-scrollbar">
          <button
            onClick={() => setCurrentTab('single')}
            className={`px-2.5 py-1.5 min-h-[38px] text-xs font-heading tracking-wide uppercase transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
              currentTab === 'single'
                ? 'bg-[#fee715] text-black font-bold border border-black shadow-[2px_2px_0px_#000]'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Skull className="w-3.5 h-3.5" />
            <span className="inline">Картка</span>
          </button>

          <button
            onClick={() => setCurrentTab('batch')}
            className={`px-2.5 py-1.5 min-h-[38px] text-xs font-heading tracking-wide uppercase transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
              currentTab === 'batch'
                ? 'bg-[#fee715] text-black font-bold border border-black shadow-[2px_2px_0px_#000]'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="inline">Загін (4)</span>
          </button>

          <button
            onClick={() => setCurrentTab('roster')}
            className={`px-2.5 py-1.5 min-h-[38px] text-xs font-heading tracking-wide uppercase transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
              currentTab === 'roster'
                ? 'bg-[#fee715] text-black font-bold border border-black shadow-[2px_2px_0px_#000]'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span className="inline">Реєстр ({savedCount})</span>
          </button>

          <button
            onClick={() => setCurrentTab('rules')}
            className={`px-2.5 py-1.5 min-h-[38px] text-xs font-heading tracking-wide uppercase transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
              currentTab === 'rules'
                ? 'bg-[#fee715] text-black font-bold border border-black shadow-[2px_2px_0px_#000]'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="inline">Правила</span>
          </button>
        </nav>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={openDiceModal}
            className="p-2 bg-[#ff0055] text-white hover:bg-[#e0004c] border-2 border-black shadow-[2px_2px_0px_#000] min-h-[38px] min-w-[38px] flex items-center justify-center font-bold text-xs uppercase"
            title="Відкрити кубики"
          >
            <Dices className="w-4 h-4" />
          </button>

          <button
            onClick={handleAudioToggle}
            className={`p-2 border-2 border-black shadow-[2px_2px_0px_#000] min-h-[38px] min-w-[38px] flex items-center justify-center font-bold text-xs uppercase ${
              isAudioOn ? 'bg-[#fee715] text-black' : 'bg-[#222] text-gray-300 hover:bg-[#333]'
            }`}
            title="Увімкнути/вимкнути ембієнт"
          >
            {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onGenerateNew}
            className="px-2.5 py-1.5 min-h-[38px] bg-[#fee715] text-black font-heading text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#ffe000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden min-[480px]:inline">Новий</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-2 bg-[#2a2a2a] text-gray-200 hover:bg-[#3a3a3a] border-2 border-black shadow-[2px_2px_0px_#000] min-h-[38px] min-w-[38px] hidden md:flex items-center justify-center text-xs font-bold uppercase"
            title="Друкувати картку"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
