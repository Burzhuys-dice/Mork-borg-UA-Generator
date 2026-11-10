import React, { useState, useRef } from 'react';
import { Character } from '../types/morkborg';
import {
  Heart,
  Sparkles,
  Coins,
  Shield,
  Swords,
  Backpack,
  Scroll,
  Edit2,
  Check,
  Utensils,
  AlertTriangle,
  X
} from 'lucide-react';

interface CharacterSheetProps {
  character: Character;
  onUpdateCharacter: (updated: Character) => void;
  gettingBetterResult?: string | null;
  onClearGettingBetterResult?: () => void;
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({
  character,
  onUpdateCharacter,
  gettingBetterResult,
  onClearGettingBetterResult,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(character.name);

  // Base carrying capacity limit without penalty = Strength + 8
  const baseCapacityWithoutPenalty = Math.max(1, character.abilities.strength.modifier + 8);
  const containerBonus = character.carryingContainer.capacityBonus || 0;
  const totalContainerCapacity = baseCapacityWithoutPenalty + containerBonus;

  // Calculate occupied item slots
  const usedSlots = (character.weapon.slots || 1) +
    (character.armor.slots || 0) +
    character.gear.reduce((acc, item) => acc + (item.slots || 1), 0) +
    character.customEquipment.reduce((acc, item) => acc + (item.slots || 1), 0);

  const isOverburdened = usedSlots > baseCapacityWithoutPenalty;

  // HP Handlers
  const handleHpChange = (delta: number) => {
    const newHp = Math.max(0, character.currentHp + delta);
    onUpdateCharacter({ ...character, currentHp: newHp });
  };

  // Omens Handlers
  const handleOmensChange = (delta: number) => {
    const newOmens = Math.max(0, Math.min(character.maxOmens, character.omens + delta));
    onUpdateCharacter({ ...character, omens: newOmens });
  };

  // Silver Handlers
  const handleSilverChange = (delta: number) => {
    const newSilver = Math.max(0, character.silver + delta);
    onUpdateCharacter({ ...character, silver: newSilver });
  };

  // Name Edit Handler
  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateCharacter({ ...character, name: nameInput.trim() });
    }
    setIsEditingName(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Main Single-Screen High-Density Character Sheet Card */}
      <div
        ref={cardRef}
        className="bg-[#121212] text-[#e0dfd5] border-2 md:border-3 border-black p-3 md:p-4 shadow-[4px_4px_0px_#000] relative overflow-hidden"
      >
        <div className="h-1.5 bg-gradient-to-r from-[#fee715] via-[#ff0055] to-[#fee715] -mx-3 -mt-3 md:-mx-4 md:-mt-4 mb-3 border-b border-black" />

        {/* Level Up Banner Notification */}
        {gettingBetterResult && (
          <div className="mb-2 p-2 bg-[#231536] border-2 border-purple-500 shadow-[3px_3px_0px_#000] relative">
            {onClearGettingBetterResult && (
              <button
                onClick={onClearGettingBetterResult}
                className="absolute top-1.5 right-1.5 p-0.5 bg-black text-gray-400 hover:text-white border border-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <pre className="text-[10px] font-mono text-purple-200 whitespace-pre-wrap leading-tight">
              {gettingBetterResult}
            </pre>
          </div>
        )}

        {/* 1. Compact Header Row: Class, Name, HP, Omens, Silver */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 mb-3 pb-2.5 border-b-2 border-black items-center">
          {/* Character Name & Class (Lg 6 cols) */}
          <div className="lg:col-span-6 flex items-center gap-2">
            <span className="bg-[#ff0055] text-white text-[10px] font-mono font-bold uppercase px-2 py-0.5 border border-black shrink-0">
              {character.className}
            </span>

            {isEditingName ? (
              <div className="flex items-center gap-1.5 flex-1">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-[#1a1a1a] text-lg font-heading font-black text-[#fee715] border border-[#fee715] px-1.5 py-0.5 uppercase w-full focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-1 bg-[#fee715] text-black border border-black shrink-0"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 group flex-1">
                <h2 className="text-xl md:text-2xl font-heading font-black tracking-wide uppercase text-[#fee715] drop-shadow-[1px_1px_0px_#000] truncate">
                  {character.name}
                </h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="no-print opacity-60 group-hover:opacity-100 p-0.5 hover:text-[#fee715] transition-opacity shrink-0"
                  title="Редагувати ім'я"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Core Counters: HP, Omens, Silver (Lg 6 cols) */}
          <div className="lg:col-span-6 grid grid-cols-3 gap-1.5">
            {/* HP */}
            <div className={`px-2 py-1 border border-black flex items-center justify-between ${
              character.currentHp === 0 ? 'bg-[#3d0000] text-red-200' : 'bg-[#181818]'
            }`}>
              <div className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-red-400 fill-current shrink-0" />
                <span className="text-[10px] font-heading font-bold uppercase text-red-400">HP</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-base font-heading font-black text-white">{character.currentHp}</span>
                <span className="text-[10px] font-mono text-gray-400">/{character.maxHp}</span>
                <div className="no-print flex flex-col ml-1">
                  <button onClick={() => handleHpChange(1)} className="text-[8px] leading-none bg-[#333] hover:bg-emerald-800 px-1 py-0.5 text-white font-bold border border-black">+</button>
                  <button onClick={() => handleHpChange(-1)} className="text-[8px] leading-none bg-[#333] hover:bg-red-900 px-1 py-0.5 text-white font-bold border border-black">-</button>
                </div>
              </div>
            </div>

            {/* Omens */}
            <div className="px-2 py-1 bg-[#181818] border border-black flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#fee715] fill-current shrink-0" />
                <span className="text-[10px] font-heading font-bold uppercase text-[#fee715]">Знамення</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-base font-heading font-black text-[#fee715]">{character.omens}</span>
                <span className="text-[10px] font-mono text-gray-400">/{character.maxOmens}</span>
                <div className="no-print flex flex-col ml-1">
                  <button onClick={() => handleOmensChange(1)} className="text-[8px] leading-none bg-[#333] hover:bg-amber-600 px-1 py-0.5 text-white font-bold border border-black">+</button>
                  <button onClick={() => handleOmensChange(-1)} className="text-[8px] leading-none bg-[#333] hover:bg-amber-950 px-1 py-0.5 text-white font-bold border border-black">-</button>
                </div>
              </div>
            </div>

            {/* Silver */}
            <div className="px-2 py-1 bg-[#181818] border border-black flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-400 fill-current shrink-0" />
                <span className="text-[10px] font-heading font-bold uppercase text-amber-400">Срібло</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-base font-heading font-black text-amber-300">{character.silver}</span>
                <span className="text-[10px] font-mono text-amber-500">с</span>
                <div className="no-print flex flex-col ml-1">
                  <button onClick={() => handleSilverChange(10)} className="text-[8px] leading-none bg-[#333] hover:bg-amber-800 px-0.5 py-0.5 text-white font-bold border border-black">+10</button>
                  <button onClick={() => handleSilverChange(-10)} className="text-[8px] leading-none bg-[#333] hover:bg-amber-950 px-0.5 py-0.5 text-white font-bold border border-black">-10</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 0 HP Alert Banner (If Broken) */}
        {character.currentHp === 0 && (
          <div className="mb-2 p-2 bg-[#ff0055] text-white border border-black text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse" />
            <span className="font-bold uppercase">ПЕРСОНАЖ ЗЛАМАНИЙ (0 HP)! Киньте d4 за таблицею Зламане тіло у правилах.</span>
          </div>
        )}

        {/* 2. Compact 4 Abilities Horizontal Bar */}
        <div className="mb-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {/* Strength */}
            <div className="p-1.5 bg-[#181818] border border-black flex items-center justify-between">
              <div>
                <span className="text-[10px] font-heading font-bold uppercase text-gray-300">Сила</span>
                <p className="text-[9px] font-mono text-gray-500 leading-none">Удари/руйнування</p>
              </div>
              <div className="text-lg font-heading font-black text-[#fee715]">
                {character.abilities.strength.modifier >= 0 ? `+${character.abilities.strength.modifier}` : character.abilities.strength.modifier}
              </div>
            </div>

            {/* Agility */}
            <div className="p-1.5 bg-[#181818] border border-black flex items-center justify-between">
              <div>
                <span className="text-[10px] font-heading font-bold uppercase text-gray-300">Спритність</span>
                <p className="text-[9px] font-mono text-gray-500 leading-none">Захист/стелс</p>
              </div>
              <div className="text-lg font-heading font-black text-[#fee715]">
                {character.abilities.agility.modifier >= 0 ? `+${character.abilities.agility.modifier}` : character.abilities.agility.modifier}
              </div>
            </div>

            {/* Volya (Presence) */}
            <div className="p-1.5 bg-[#181818] border border-black flex items-center justify-between">
              <div>
                <span className="text-[10px] font-heading font-bold uppercase text-gray-300">Воля</span>
                <p className="text-[9px] font-mono text-gray-500 leading-none">Увага/сувої/стрільба</p>
              </div>
              <div className="text-lg font-heading font-black text-[#fee715]">
                {character.abilities.presence.modifier >= 0 ? `+${character.abilities.presence.modifier}` : character.abilities.presence.modifier}
              </div>
            </div>

            {/* Toughness */}
            <div className="p-1.5 bg-[#181818] border border-black flex items-center justify-between">
              <div>
                <span className="text-[10px] font-heading font-bold uppercase text-gray-300">Витривалість</span>
                <p className="text-[9px] font-mono text-gray-500 leading-none">HP/стійкість</p>
              </div>
              <div className="text-lg font-heading font-black text-[#fee715]">
                {character.abilities.toughness.modifier >= 0 ? `+${character.abilities.toughness.modifier}` : character.abilities.toughness.modifier}
              </div>
            </div>
          </div>
        </div>

        {/* 3. High-Density 3-Column Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-3">
          {/* Column 1: Combat Equipment & Magic Scrolls */}
          <div className="space-y-2">
            {/* Combat Box */}
            <div className="p-2 bg-[#181818] border border-black space-y-1.5">
              <h3 className="text-xs font-heading font-black uppercase text-[#fee715] flex items-center gap-1 border-b border-gray-800 pb-1">
                <Swords className="w-3.5 h-3.5 text-[#ff0055]" /> Бойове Спорядження
              </h3>

              {/* Weapon */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-heading font-bold text-white uppercase">{character.weapon.name}</span>
                  <p className="text-[10px] font-mono text-gray-400">{character.weapon.description}</p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#ff0055] text-white px-1.5 py-0.5 shrink-0 ml-1">
                  {character.weapon.damage}
                </span>
              </div>

              {/* Armor */}
              <div className="flex items-center justify-between text-xs border-t border-gray-800 pt-1">
                <div>
                  <span className="font-heading font-bold text-white uppercase">{character.armor.name}</span>
                  <p className="text-[10px] font-mono text-gray-400">{character.armor.description}</p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#fee715] text-black px-1.5 py-0.5 shrink-0 ml-1">
                  Захист: {character.armor.armorValue}
                </span>
              </div>
            </div>

            {/* Scrolls Box */}
            <div className="p-2 bg-[#181818] border border-black">
              <h3 className="text-xs font-heading font-black uppercase text-purple-300 flex items-center gap-1 border-b border-gray-800 pb-1 mb-1">
                <Scroll className="w-3.5 h-3.5 text-purple-400" /> Сувої Магії ({character.scrolls.length})
              </h3>
              {character.scrolls.length === 0 ? (
                <p className="text-[10px] font-mono text-gray-500 italic">Сувої відсутні при старті.</p>
              ) : (
                <div className="space-y-1">
                  {character.scrolls.map((s, idx) => (
                    <div key={idx} className="p-1 bg-[#1d132b] border border-purple-800 text-[11px]">
                      <div className="font-heading font-bold text-purple-200 uppercase flex items-center justify-between">
                        <span>{s.name}</span>
                        <span className="text-[8px] font-mono uppercase bg-purple-900 text-purple-200 px-1">{s.type}</span>
                      </div>
                      <p className="text-[10px] font-mono text-purple-300 leading-tight">{s.effect}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Class Ability & Starter Relic */}
          <div className="space-y-2">
            {/* Class Ability */}
            <div className="p-2 bg-[#181818] border border-black">
              <h3 className="text-xs font-heading font-black uppercase text-[#ff0055] flex items-center gap-1 border-b border-gray-800 pb-1 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#ff0055]" /> Класова здатність: {character.classAbilityName}
              </h3>
              <p className="text-[11px] font-mono text-gray-300 leading-snug">
                {character.classAbilityDescription}
              </p>
            </div>

            {/* Starter Relic */}
            <div className="p-2 bg-[#181818] border border-black">
              <h3 className="text-xs font-heading font-black uppercase text-[#fee715] flex items-center gap-1 border-b border-gray-800 pb-1 mb-1">
                <Shield className="w-3.5 h-3.5 text-[#fee715]" /> Реліквія / Старт: {character.uniqueStarterItemOrTrait.name}
              </h3>
              <p className="text-[11px] font-mono text-gray-300 leading-snug">
                {character.uniqueStarterItemOrTrait.description}
              </p>
            </div>
          </div>

          {/* Column 3: Inventory & Capacity */}
          <div className="p-2 bg-[#181818] border border-black space-y-1.5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-1">
              <h3 className="text-xs font-heading font-black uppercase text-[#fee715] flex items-center gap-1">
                <Backpack className="w-3.5 h-3.5 text-[#fee715]" /> Спорядження ({usedSlots}/{totalContainerCapacity})
              </h3>
              {isOverburdened && (
                <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-950 px-1 border border-amber-600">
                  Перевантаження +2 DR
                </span>
              )}
            </div>

            {/* Rations & Carrying Container */}
            <div className="text-[10px] font-mono text-gray-400 flex items-center justify-between bg-[#111] p-1 border border-gray-800">
              <span className="flex items-center gap-1 text-gray-300">
                <Utensils className="w-3 h-3 text-amber-400" /> Сухпайок: {character.foodDays} дн.
              </span>
              <span>Транспорт: {character.carryingContainer.name}</span>
            </div>

            {/* Items List */}
            <div className="space-y-1 max-h-44 overflow-y-auto pr-1 no-scrollbar">
              {character.gear.map((item) => (
                <div key={item.id} className="p-1 bg-[#141414] border border-gray-800 text-[11px] flex items-start justify-between">
                  <div>
                    <span className="font-heading font-bold text-gray-200 uppercase">{item.name}</span>
                    {item.description && <p className="text-[10px] font-mono text-gray-400">{item.description}</p>}
                  </div>
                  <span className="text-[9px] font-mono text-gray-500 shrink-0 ml-1">{item.slots || 1} с.</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Bottom Compact Grid: Background, Traits, Body & Habit */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 bg-[#181818] border border-black">
          {/* Origin & Tale */}
          <div>
            <span className="text-[10px] font-heading font-bold uppercase text-[#fee715] block">Походження та Історія</span>
            <p className="text-[10px] font-mono text-gray-300 leading-tight">
              <span className="text-gray-400">Походження:</span> {character.origin}<br />
              <span className="text-gray-400">Історія:</span> {character.troublingTale}
            </p>
          </div>

          {/* Terrible Traits */}
          <div>
            <span className="text-[10px] font-heading font-bold uppercase text-[#fee715] block">Жахливі риси</span>
            <p className="text-[10px] font-mono text-gray-300 leading-tight">
              1. {character.terribleTraits[0]}<br />
              2. {character.terribleTraits[1]}
            </p>
          </div>

          {/* Broken Body & Habit */}
          <div>
            <span className="text-[10px] font-heading font-bold uppercase text-[#fee715] block">Вада та Звичка</span>
            <p className="text-[10px] font-mono text-gray-300 leading-tight">
              <span className="text-gray-400">Зламане тіло:</span> {character.brokenBody}<br />
              <span className="text-gray-400">Звичка:</span> {character.badHabit}
            </p>
          </div>
        </div>

        {/* MÖRK BORG Footer Copyright */}
        <div className="mt-2 pt-1 border-t border-gray-800 text-[9px] font-mono text-gray-500 flex items-center justify-between">
          <span>MÖRK BORG є © Ockult Örtmästare Games & Stockholm Kartell</span>
          <span>Scvmbirther UA — Bare Bones Edition</span>
        </div>
      </div>
    </div>
  );
};
