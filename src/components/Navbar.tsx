import React, { useState } from 'react';
import { CharacterClassId } from '../types/morkborg';
import { ClassSelector } from './ClassSelector';
import {
  Skull,
  Users,
  BookOpen,
  Dices,
  Volume2,
  VolumeX,
  Plus,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import { toggleAmbientSound } from '../utils/audio';

interface NavbarProps {
  currentTab: 'single' | 'batch' | 'roster' | 'rules' | 'gm';
  setCurrentTab: (tab: 'single' | 'batch' | 'roster' | 'rules' | 'gm') => void;
  selectedClass: CharacterClassId | 'random';
  onSelectClass: (cId: CharacterClassId | 'random') => void;
  onGenerateNew: () => void;
  onGettingBetter: () => void;
  onCopyText: () => void;
  copySuccess: boolean;
  savedCount: number;
  openDiceModal: () => void;
  characterName: string;
  characterClassName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  selectedClass,
  onSelectClass,
  onGenerateNew,
  onGettingBetter,
  onCopyText,
  copySuccess,
  savedCount,
  openDiceModal,
  characterName,
  characterClassName,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);

  const handleAudioToggle = () => {
    const newState = toggleAmbientSound();
    setIsAudioOn(newState);
  };

  return (
    <header className="no-print bg-[#0d0d0d] border-b-2 border-black sticky top-0 z-40 shadow-2xl">
      {/* Sleek Top Bar (Always Visible) */}
      <div className="max-w-7xl mx-auto px-3 py-1.5 flex items-center justify-between gap-2">
        {/* Left: Brand + Active Character Summary */}
        <div className="flex items-center gap-2 truncate">
          <div className="bg-[#fee715] text-black p-1 font-black border border-black rotate-[-2deg] shrink-0">
            <Skull className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="truncate flex items-center gap-2">
            <h1 className="text-base font-heading font-black tracking-wider text-[#fee715] uppercase whitespace-nowrap">
              SCVMBIRTHER <span className="text-[#ff0055] text-xs font-mono">UA</span>
            </h1>
            {characterName && (
              <div className="hidden sm:flex items-center gap-1.5 border-l border-gray-800 pl-2 text-xs font-mono truncate">
                <span className="text-[#ff0055] font-bold uppercase truncate">{characterClassName}</span>
                <span className="text-gray-400 font-heading font-bold text-white truncate">{characterName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Center/Right Controls: Curtain Toggle & Quick New */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className={`px-2.5 py-1 text-xs font-heading font-bold uppercase border border-black shadow-[1px_1px_0px_#000] flex items-center gap-1.5 transition-all ${
              isDrawerOpen
                ? 'bg-[#ff0055] text-white'
                : 'bg-[#1e1e1e] text-[#fee715] hover:bg-[#2a2a2a]'
            }`}
          >
            <span>Опції та Класи</span>
            {isDrawerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <button
            onClick={openDiceModal}
            className="p-1 bg-[#ff0055] text-white hover:bg-[#e0004c] border border-black shadow-[1px_1px_0px_#000] min-h-[30px] min-w-[30px] flex items-center justify-center font-bold text-xs uppercase"
            title="Кубики"
          >
            <Dices className="w-4 h-4" />
          </button>

          <button
            onClick={onGenerateNew}
            className="px-2.5 py-1 bg-[#fee715] text-black font-heading text-xs font-bold uppercase border border-black shadow-[1px_1px_0px_#000] hover:bg-[#ffe000] transition-all flex items-center gap-1 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Новий</span>
          </button>
        </div>
      </div>

      {/* Collapsible Top Curtain (Шторка) */}
      {isDrawerOpen && (
        <div className="bg-[#121212] border-t-2 border-[#fee715] p-3 shadow-2xl space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto space-y-3">
            {/* 1. Class Selection Section */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-heading font-black text-[#fee715] uppercase tracking-wider">
                  Вибір Класу Персонажа
                </span>
                <span className="text-[10px] font-mono text-gray-400">Натисніть клас для миттєвої генерації</span>
              </div>
              <ClassSelector
                selectedClass={selectedClass}
                onSelectClass={(cId) => {
                  onSelectClass(cId);
                  setIsDrawerOpen(false);
                }}
              />
            </div>

            {/* 2. Character Operations Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-800">
              {/* Left Action Buttons: Level Up & Copy */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    onGettingBetter();
                    setIsDrawerOpen(false);
                  }}
                  className="px-3 py-1.5 bg-purple-800 hover:bg-purple-700 text-white font-heading font-bold text-xs uppercase border border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 transition-all"
                  title="Покращення персонажа за правилами Bare Bones"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Покращити (Level Up)</span>
                </button>

                <button
                  onClick={onCopyText}
                  className="px-3 py-1.5 bg-[#222] text-gray-200 hover:bg-[#333] border border-black shadow-[2px_2px_0px_#000] text-xs font-bold uppercase flex items-center gap-1.5 transition-all"
                >
                  {copySuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copySuccess ? 'Скопійовано!' : 'Скопіювати текст'}</span>
                </button>

                <button
                  onClick={handleAudioToggle}
                  className={`px-3 py-1.5 border border-black shadow-[2px_2px_0px_#000] text-xs font-bold uppercase flex items-center gap-1.5 transition-all ${
                    isAudioOn ? 'bg-[#fee715] text-black' : 'bg-[#222] text-gray-300 hover:bg-[#333]'
                  }`}
                >
                  {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>{isAudioOn ? 'Звук Увімк' : 'Звук Вимк'}</span>
                </button>
              </div>

              {/* Right: Main Navigation Tabs */}
              <nav className="flex items-center gap-1 bg-[#1a1a1a] p-1 border border-black">
                <button
                  onClick={() => {
                    setCurrentTab('single');
                    setIsDrawerOpen(false);
                  }}
                  className={`px-2.5 py-1 text-xs font-heading tracking-wide uppercase transition-all flex items-center gap-1 ${
                    currentTab === 'single'
                      ? 'bg-[#fee715] text-black font-bold'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Skull className="w-3.5 h-3.5" />
                  <span>Картка</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentTab('batch');
                    setIsDrawerOpen(false);
                  }}
                  className={`px-2.5 py-1 text-xs font-heading tracking-wide uppercase transition-all flex items-center gap-1 ${
                    currentTab === 'batch'
                      ? 'bg-[#fee715] text-black font-bold'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Загін (4)</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentTab('roster');
                    setIsDrawerOpen(false);
                  }}
                  className={`px-2.5 py-1 text-xs font-heading tracking-wide uppercase transition-all flex items-center gap-1 ${
                    currentTab === 'roster'
                      ? 'bg-[#fee715] text-black font-bold'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>Реєстр ({savedCount})</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentTab('gm');
                    setIsDrawerOpen(false);
                  }}
                  className={`px-2.5 py-1 text-xs font-heading tracking-wide uppercase transition-all flex items-center gap-1 ${
                    currentTab === 'gm'
                      ? 'bg-[#fee715] text-black font-bold'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Майстер</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentTab('rules');
                    setIsDrawerOpen(false);
                  }}
                  className={`px-2.5 py-1 text-xs font-heading tracking-wide uppercase transition-all flex items-center gap-1 ${
                    currentTab === 'rules'
                      ? 'bg-[#fee715] text-black font-bold'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Правила</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
