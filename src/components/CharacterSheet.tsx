import React, { useState, useRef } from 'react';
import { Character, EquipmentItem } from '../types/morkborg';
import { playDiceSound } from '../utils/audio';
import { roll, rollDice } from '../utils/dice';
import { UNCLEAN_SCROLLS, SACRED_SCROLLS, ARCANE_CATASTROPHES } from '../data/morkborgTables';
import html2canvas from 'html2canvas';
import {
  Skull,
  Heart,
  Sparkles,
  Coins,
  Shield,
  Swords,
  Backpack,
  Scroll,
  Plus,
  Trash2,
  Edit2,
  Check,
  BookmarkPlus,
  Copy,
  Download,
  Printer,
  Dices,
  Utensils,
  AlertTriangle,
  TrendingUp,
  X
} from 'lucide-react';

interface CharacterSheetProps {
  character: Character;
  onUpdateCharacter: (updated: Character) => void;
  onSaveToRoster: (char: Character) => void;
  isSavedInRoster: boolean;
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({
  character,
  onUpdateCharacter,
  onSaveToRoster,
  isSavedInRoster,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(character.name);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemSlots, setNewItemSlots] = useState(1);
  const [activeRollResult, setActiveRollResult] = useState<{ title: string; roll: number; mod: number; total: number; detail?: string } | null>(null);
  const [gettingBetterResult, setGettingBetterResult] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

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

  // Add Custom Equipment
  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: EquipmentItem = {
      id: `custom_${Date.now()}`,
      name: newItemName.trim(),
      description: newItemDesc.trim(),
      slots: newItemSlots
    };

    onUpdateCharacter({
      ...character,
      customEquipment: [...character.customEquipment, newItem]
    });

    setNewItemName('');
    setNewItemDesc('');
    setNewItemSlots(1);
  };

  // Remove Equipment
  const handleRemoveCustomItem = (id: string) => {
    onUpdateCharacter({
      ...character,
      customEquipment: character.customEquipment.filter(i => i.id !== id)
    });
  };

  const handleRemoveGearItem = (id: string) => {
    onUpdateCharacter({
      ...character,
      gear: character.gear.filter(i => i.id !== id)
    });
  };

  // Ability Roll (d20 + mod)
  const rollAbilityTest = (abilityName: string, mod: number) => {
    playDiceSound();
    const effectiveMod = isOverburdened && (abilityName === 'Сила' || abilityName === 'Спритність') ? mod - 2 : mod;
    const d20 = roll(20);
    const total = d20 + effectiveMod;
    let detail = '';
    if (d20 === 20) detail = 'КРИТИЧНИЙ УСПІХ! (20)';
    else if (d20 === 1) detail = 'КРИТИЧНА НЕВДАЧА! (1)';
    else if (total >= 12) detail = 'УСПІХ (DR12 досягнуто)';
    else detail = 'НЕВДАЧА (DR12 не досягнуто)';

    setActiveRollResult({
      title: `Перевірка: ${abilityName}${isOverburdened && (abilityName === 'Сила' || abilityName === 'Спритність') ? ' (Перевантаження -2 DR)' : ''}`,
      roll: d20,
      mod: effectiveMod,
      total: total,
      detail: detail
    });
  };

  // Weapon Roll
  const rollWeaponDamage = (weaponName: string, damageExpr: string) => {
    playDiceSound();
    let rolledDamage = 0;
    if (damageExpr.includes('2d6')) rolledDamage = roll(6) + roll(6);
    else if (damageExpr.includes('2d4')) rolledDamage = roll(4) + roll(4);
    else if (damageExpr.includes('d10')) rolledDamage = roll(10);
    else if (damageExpr.includes('d8')) rolledDamage = roll(8);
    else if (damageExpr.includes('d6')) rolledDamage = roll(6);
    else if (damageExpr.includes('d4')) rolledDamage = roll(4);
    else rolledDamage = roll(2);

    setActiveRollResult({
      title: `Шкода зброєю (${weaponName})`,
      roll: rolledDamage,
      mod: 0,
      total: rolledDamage,
      detail: `Завдано ${rolledDamage} шкоди ворогу`
    });
  };

  // Armor Roll
  const rollArmorDefense = (armorValue: string) => {
    playDiceSound();
    let reduction = 0;
    if (armorValue.includes('d6')) reduction = roll(6);
    else if (armorValue.includes('d4')) reduction = roll(4);
    else if (armorValue.includes('d2')) reduction = roll(2);
    else reduction = 0;

    setActiveRollResult({
      title: `Поглинання шкоди бронєю`,
      roll: reduction,
      mod: 0,
      total: reduction,
      detail: `Броня зменшує шкоду на ${reduction} ед.`
    });
  };

  // Roll Broken Table d4 (Bare Bones p. 29)
  const rollBrokenTable = () => {
    playDiceSound();
    const d4 = roll(4);
    let outcome = '';
    if (d4 === 1) outcome = '1: Непритомність на d4 раундів. Прокинувся з d4 HP.';
    else if (d4 === 2) {
      const d6 = roll(6);
      const sub = d6 <= 5 ? 'Зламано чи ампутовано кінцівку!' : 'Втрачено око!';
      outcome = `2: ${sub} Не здатен діяти d4 раундів, потім опритомнює з d4 HP.`;
    } else if (d4 === 3) outcome = '3: Крововилив! Смерть через d2 години, якщо не надати допомоги (всі тести DR16 в 1-шу годину, DR18 надалі).';
    else outcome = '4: МЕРТВИЙ.';

    setActiveRollResult({
      title: 'Таблиця Зламане тіло (Broken d4)',
      roll: d4,
      mod: 0,
      total: d4,
      detail: outcome
    });
  };

  // Roll Arcane Catastrophe d20 (Bare Bones p. 43)
  const rollArcaneCatastrophe = () => {
    playDiceSound();
    const d20 = roll(20);
    const cat = ARCANE_CATASTROPHES[d20 - 1];
    setActiveRollResult({
      title: `Аркана Катастрофа (d20 = ${d20})`,
      roll: d20,
      mod: 0,
      total: d20,
      detail: cat
    });
  };

  // "Getting Better" / Level Up (Bare Bones p. 33)
  const handleGettingBetter = () => {
    playDiceSound();
    let report = '=== ПОКРАЩЕННЯ ПЕРСОНАЖА (GETTING BETTER) ===\n\n';

    // 1. More HP (6d10 vs current Max HP)
    const hp6d10 = rollDice(6, 10);
    let hpBonus = 0;
    if (hp6d10 >= character.maxHp) {
      hpBonus = roll(6);
      report += `• 6d10 = ${hp6d10} (>= ${character.maxHp} макс HP) -> HP збільшено на +${hpBonus}!\n`;
    } else {
      report += `• 6d10 = ${hp6d10} (< ${character.maxHp} макс HP) -> HP без змін.\n`;
    }

    // 2. Found in Debris (d6)
    const debrisRoll = roll(6);
    let debrisItem = '';
    let addSilver = 0;
    let newScrollList = [...character.scrolls];

    if (debrisRoll <= 3) debrisItem = 'Нічого не знайдено в уламках.';
    else if (debrisRoll === 4) {
      addSilver = rollDice(3, 10);
      debrisItem = `Знайдено ${addSilver} срібла!`;
    } else if (debrisRoll === 5) {
      const scroll = UNCLEAN_SCROLLS[roll(10) - 1];
      newScrollList.push(scroll);
      debrisItem = `Знайдено нечистий сувій: ${scroll.name}!`;
    } else {
      const scroll = SACRED_SCROLLS[roll(10) - 1];
      newScrollList.push(scroll);
      debrisItem = `Знайдено священний сувій: ${scroll.name}!`;
    }
    report += `• Уламки (d6 = ${debrisRoll}): ${debrisItem}\n`;

    // 3. Ability changes (d6 for each ability)
    const updatedAbilities = { ...character.abilities };
    const abilitiesList: ('strength' | 'agility' | 'presence' | 'toughness')[] = [
      'strength', 'agility', 'presence', 'toughness'
    ];

    abilitiesList.forEach((abKey) => {
      const currentVal = updatedAbilities[abKey].modifier;
      const d6 = roll(6);
      let newMod = currentVal;

      if (currentVal <= 1) {
        if (d6 === 1) newMod = Math.max(-3, currentVal - 1);
        else newMod = Math.min(6, currentVal + 1);
      } else {
        if (d6 >= currentVal) newMod = Math.min(6, currentVal + 1);
        else newMod = Math.max(-3, currentVal - 1);
      }

      const diff = newMod - currentVal;
      const sign = diff >= 0 ? `+${diff}` : `${diff}`;
      report += `• ${abKey.toUpperCase()} (d6=${d6}): ${currentVal >= 0 ? '+' : ''}${currentVal} -> ${newMod >= 0 ? '+' : ''}${newMod} (${sign})\n`;

      updatedAbilities[abKey] = {
        raw: updatedAbilities[abKey].raw,
        modifier: newMod
      };
    });

    // Apply updates to character
    const updatedHp = character.maxHp + hpBonus;
    onUpdateCharacter({
      ...character,
      maxHp: updatedHp,
      currentHp: character.currentHp + hpBonus,
      silver: character.silver + addSilver,
      scrolls: newScrollList,
      abilities: updatedAbilities
    });

    setGettingBetterResult(report);
  };

  // Copy character text
  const handleCopyText = () => {
    const text = `
=== MÖRK BORG PERONAJ: ${character.name} ===
Клас: ${character.className}
HP: ${character.currentHp}/${character.maxHp} | Знамення: ${character.omens}/${character.maxOmens} | Срібло: ${character.silver}с

[ХАРАКТЕРИСТИКИ]
• Сила: ${character.abilities.strength.modifier >= 0 ? '+' : ''}${character.abilities.strength.modifier}
• Спритність: ${character.abilities.agility.modifier >= 0 ? '+' : ''}${character.abilities.agility.modifier}
• Воля: ${character.abilities.presence.modifier >= 0 ? '+' : ''}${character.abilities.presence.modifier}
• Витривалість: ${character.abilities.toughness.modifier >= 0 ? '+' : ''}${character.abilities.toughness.modifier}

[ЗБРОЯ ТА БРОНЯ]
• Зброя: ${character.weapon.name} (${character.weapon.damage})
• Броня: ${character.armor.name} (${character.armor.armorValue})

[СПОРАДЖЕННЯ]
• Транспорт: ${character.carryingContainer.name}
• Сухпайок: на ${character.foodDays} дн.
${character.gear.map(g => `• ${g.name}: ${g.description}`).join('\n')}
${character.customEquipment.map(g => `• ${g.name}: ${g.description}`).join('\n')}

[СУВОЇ]
${character.scrolls.length > 0 ? character.scrolls.map(s => `• ${s.name} (${s.type}): ${s.effect}`).join('\n') : 'Немає'}

[ФОН ТА ОСОБЛИВОСТІ]
• Походження: ${character.origin}
• Тривожна історія: ${character.troublingTale}
• Здатність: ${character.classAbilityName}
• Реліквія/Старт: ${character.uniqueStarterItemOrTrait.name}
• Риси: ${character.terribleTraits.join(', ')}
• Вада: ${character.brokenBody} | Звичка: ${character.badHabit}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Download card PNG
  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0d0d0d',
        scale: 2
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `MORK_BORG_${character.name.replace(/\s+/g, '_')}.png`;
      link.click();
    } catch (err) {
      console.error('PNG export failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-2 bg-[#121212] p-2.5 border-3 border-black shadow-[4px_4px_0px_#000]">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSaveToRoster(character)}
            className={`px-3 py-2 min-h-[42px] font-heading font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 transition-all ${
              isSavedInRoster
                ? 'bg-emerald-500 text-black'
                : 'bg-[#fee715] text-black hover:bg-[#ffe000]'
            }`}
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>{isSavedInRoster ? 'В Реєстрі' : 'Зберегти'}</span>
          </button>

          <button
            onClick={handleGettingBetter}
            className="px-3 py-2 min-h-[42px] bg-purple-700 hover:bg-purple-600 text-white font-heading font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 transition-all"
            title="Покращення персонажа за правилами Bare Bones"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Покращити (Level Up)</span>
          </button>

          <button
            onClick={handleCopyText}
            className="px-3 py-2 min-h-[42px] bg-[#1f1f1f] text-gray-200 hover:bg-[#2f2f2f] border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-bold uppercase flex items-center gap-1.5 transition-all"
          >
            <Copy className="w-4 h-4" />
            <span>{copySuccess ? 'Скопійовано!' : 'Текст'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCard}
            className="px-3 py-2 min-h-[42px] bg-[#ff0055] text-white hover:bg-[#e0004c] border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-bold uppercase flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>PNG</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 min-h-[42px] bg-[#2a2a2a] text-gray-200 hover:bg-[#3a3a3a] border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-bold uppercase flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Друк</span>
          </button>
        </div>
      </div>

      {/* Main Character Sheet Card */}
      <div
        ref={cardRef}
        className="bg-[#121212] text-[#e0dfd5] border-3 md:border-4 border-black p-4 md:p-8 shadow-[6px_6px_0px_#000] md:shadow-[10px_10px_0px_#000] relative overflow-hidden"
      >
        <div className="h-2 bg-gradient-to-r from-[#fee715] via-[#ff0055] to-[#fee715] -mx-4 -mt-4 md:-mx-8 md:-mt-8 mb-6 border-b-2 border-black" />

        {/* 1. Header Block: Name, Class, Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 pb-6 border-b-4 border-black">
          {/* Character Name & Class */}
          <div className="lg:col-span-2 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#ff0055] text-white text-[10px] md:text-xs font-mono font-bold uppercase px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
                {character.className}
              </span>
              <span className="text-[10px] font-mono text-gray-400">Створено: {character.createdAt}</span>
            </div>

            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-[#1a1a1a] text-xl md:text-3xl font-heading font-black text-[#fee715] border-2 border-[#fee715] px-2 py-1 uppercase w-full focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-2 bg-[#fee715] text-black border-2 border-black shadow-[2px_2px_0px_#000] shrink-0 min-h-[44px]"
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <h2 className="text-2xl min-[400px]:text-3xl md:text-5xl font-heading font-black tracking-wide uppercase text-[#fee715] drop-shadow-[2px_2px_0px_#000] break-words">
                  {character.name}
                </h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="no-print opacity-60 group-hover:opacity-100 p-1 hover:text-[#fee715] transition-opacity shrink-0 min-h-[44px]"
                  title="Редагувати ім'я"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}

            <p className="text-xs md:text-sm font-serif-gothic italic text-gray-300 leading-snug">
              "{character.classDescription}"
            </p>
          </div>

          {/* Core Status Controls: HP, Omens, Silver */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
            {/* HP Box */}
            <div className={`p-2.5 border-3 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between ${
              character.currentHp === 0 ? 'bg-[#3d0000] text-red-200' : 'bg-[#1a1a1a]'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-heading font-bold uppercase text-red-400 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-current" /> HP
                </span>
                <span className="text-[10px] font-mono text-gray-400">макс {character.maxHp}</span>
              </div>

              <div className="text-center my-1">
                <span className="text-2xl md:text-3xl font-heading font-black text-white">
                  {character.currentHp}
                </span>
                <span className="text-xs font-mono text-gray-400">/{character.maxHp}</span>
              </div>

              <div className="no-print flex items-center justify-between gap-1">
                <button
                  onClick={() => handleHpChange(-1)}
                  className="w-full py-1 bg-red-950 hover:bg-red-900 border border-black font-mono font-bold text-xs min-h-[36px]"
                >
                  -1
                </button>
                <button
                  onClick={() => handleHpChange(1)}
                  className="w-full py-1 bg-emerald-950 hover:bg-emerald-900 border border-black font-mono font-bold text-xs min-h-[36px]"
                >
                  +1
                </button>
              </div>
            </div>

            {/* Omens Box */}
            <div className="p-2.5 bg-[#1a1a1a] border-3 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-heading font-bold uppercase text-[#fee715] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-current" /> Знамення
                </span>
                <span className="text-[10px] font-mono text-gray-400">макс {character.maxOmens}</span>
              </div>

              <div className="text-center my-1">
                <span className="text-2xl md:text-3xl font-heading font-black text-[#fee715]">
                  {character.omens}
                </span>
                <span className="text-xs font-mono text-gray-400">/{character.maxOmens}</span>
              </div>

              <div className="no-print flex items-center justify-between gap-1">
                <button
                  onClick={() => handleOmensChange(-1)}
                  className="w-full py-1 bg-[#333] hover:bg-[#444] border border-black font-mono font-bold text-xs min-h-[36px]"
                >
                  -1
                </button>
                <button
                  onClick={() => handleOmensChange(1)}
                  className="w-full py-1 bg-[#333] hover:bg-[#444] border border-black font-mono font-bold text-xs min-h-[36px]"
                >
                  +1
                </button>
              </div>
            </div>

            {/* Silver Box */}
            <div className="p-2.5 bg-[#1a1a1a] border-3 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-heading font-bold uppercase text-amber-400 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 fill-current" /> Срібло
                </span>
                <span className="text-[10px] font-mono text-gray-400">мон.</span>
              </div>

              <div className="text-center my-1">
                <span className="text-2xl md:text-3xl font-heading font-black text-amber-300">
                  {character.silver}
                </span>
                <span className="text-xs font-mono text-amber-500 ml-0.5">с</span>
              </div>

              <div className="no-print flex items-center justify-between gap-1">
                <button
                  onClick={() => handleSilverChange(-10)}
                  className="w-full py-1 bg-[#333] hover:bg-[#444] border border-black font-mono font-bold text-[10px] min-h-[36px]"
                >
                  -10
                </button>
                <button
                  onClick={() => handleSilverChange(10)}
                  className="w-full py-1 bg-[#333] hover:bg-[#444] border border-black font-mono font-bold text-[10px] min-h-[36px]"
                >
                  +10
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 0 HP Alert Banner & Broken Table Trigger */}
        {character.currentHp === 0 && (
          <div className="mb-6 p-4 bg-[#ff0055] text-white border-3 border-black shadow-[4px_4px_0px_#000] space-y-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 shrink-0 animate-pulse" />
              <div>
                <h3 className="font-heading font-black text-lg uppercase leading-tight">ПЕРСОНАЖ ЗЛАМАНИЙ (0 HP)!</h3>
                <p className="text-xs font-mono">
                  За правилами Bare Bones необхідно зробити кидок d4 за таблицею Зламане тіло.
                </p>
              </div>
            </div>

            <button
              onClick={rollBrokenTable}
              className="no-print px-4 py-2 bg-black text-[#fee715] hover:bg-[#1a1a1a] font-heading font-bold text-xs uppercase border border-white shadow-[2px_2px_0px_#000] transition-all flex items-center gap-2"
            >
              <Dices className="w-4 h-4" />
              <span>Кинути за таблицею Зламане тіло (Broken d4)</span>
            </button>
          </div>
        )}

        {/* Getting Better Level Up Report Banner */}
        {gettingBetterResult && (
          <div className="mb-6 p-4 bg-[#231536] border-3 border-purple-500 shadow-[6px_6px_0px_#000] relative">
            <button
              onClick={() => setGettingBetterResult(null)}
              className="absolute top-2 right-2 p-1 bg-black text-gray-400 hover:text-white border border-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
            <pre className="text-xs font-mono text-purple-200 whitespace-pre-wrap leading-relaxed">
              {gettingBetterResult}
            </pre>
          </div>
        )}

        {/* Active Roll Result Popup Banner */}
        {activeRollResult && (
          <div className="mb-6 p-4 bg-[#1a1a1a] border-3 border-[#fee715] shadow-[6px_6px_0px_#000] relative">
            <button
              onClick={() => setActiveRollResult(null)}
              className="absolute top-2 right-2 text-xs font-mono font-bold text-gray-400 hover:text-white p-1 bg-black border border-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#fee715] text-black font-black text-2xl font-mono border-2 border-black shrink-0">
                {activeRollResult.total}
              </div>
              <div>
                <h4 className="text-sm font-heading font-bold uppercase text-[#fee715]">{activeRollResult.title}</h4>
                <p className="text-xs font-mono text-gray-300">
                  Кидок d20: <span className="text-white font-bold">{activeRollResult.roll}</span>
                  {activeRollResult.mod !== 0 && (
                    <span> | Модифікатор: <span className="text-white font-bold">{activeRollResult.mod >= 0 ? `+${activeRollResult.mod}` : activeRollResult.mod}</span></span>
                  )}
                </p>
                {activeRollResult.detail && (
                  <p className="text-xs font-mono font-bold text-[#ff0055] mt-0.5">{activeRollResult.detail}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. Ability Scores Block */}
        <div className="mb-8">
          <h3 className="text-sm font-heading font-black uppercase tracking-wider text-[#fee715] mb-3 flex items-center justify-between border-b-2 border-black pb-1">
            <span>Характеристики (Abilities)</span>
            <span className="text-[10px] font-mono text-gray-400 hidden sm:inline">DR12 - стандартний тест</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 md:gap-3">
            {/* Strength */}
            <div className="p-2.5 bg-[#181818] border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-heading font-bold uppercase text-gray-200">Сила</span>
                  <span className="text-[9px] font-mono text-gray-500">3d6: {character.abilities.strength.raw}</span>
                </div>
                <div className="text-2xl font-heading font-black text-[#fee715] my-0.5">
                  {character.abilities.strength.modifier >= 0 ? `+${character.abilities.strength.modifier}` : character.abilities.strength.modifier}
                </div>
                <p className="text-[9px] font-mono text-gray-400 line-clamp-1">Удари, підйом, руйнування</p>
              </div>
              <button
                onClick={() => rollAbilityTest('Сила', character.abilities.strength.modifier)}
                className="no-print mt-2 py-1.5 bg-[#282828] hover:bg-[#ff0055] hover:text-white border border-black font-mono text-xs font-bold transition-colors flex items-center justify-center gap-1 min-h-[36px]"
              >
                <Dices className="w-3.5 h-3.5" /> DR12
              </button>
            </div>

            {/* Agility */}
            <div className="p-2.5 bg-[#181818] border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-heading font-bold uppercase text-gray-200">Спритність</span>
                  <span className="text-[9px] font-mono text-gray-500">3d6: {character.abilities.agility.raw}</span>
                </div>
                <div className="text-2xl font-heading font-black text-[#fee715] my-0.5">
                  {character.abilities.agility.modifier >= 0 ? `+${character.abilities.agility.modifier}` : character.abilities.agility.modifier}
                </div>
                <p className="text-[9px] font-mono text-gray-400 line-clamp-1">Захист, ухилення, стелс</p>
              </div>
              <button
                onClick={() => rollAbilityTest('Спритність', character.abilities.agility.modifier)}
                className="no-print mt-2 py-1.5 bg-[#282828] hover:bg-[#ff0055] hover:text-white border border-black font-mono text-xs font-bold transition-colors flex items-center justify-center gap-1 min-h-[36px]"
              >
                <Dices className="w-3.5 h-3.5" /> DR12
              </button>
            </div>

            {/* Presence / Volya */}
            <div className="p-2.5 bg-[#181818] border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-heading font-bold uppercase text-gray-200">Воля</span>
                  <span className="text-[9px] font-mono text-gray-500">3d6: {character.abilities.presence.raw}</span>
                </div>
                <div className="text-2xl font-heading font-black text-[#fee715] my-0.5">
                  {character.abilities.presence.modifier >= 0 ? `+${character.abilities.presence.modifier}` : character.abilities.presence.modifier}
                </div>
                <p className="text-[9px] font-mono text-gray-400 line-clamp-1">Увага, сувої, дальній бій</p>
              </div>
              <button
                onClick={() => rollAbilityTest('Воля', character.abilities.presence.modifier)}
                className="no-print mt-2 py-1.5 bg-[#282828] hover:bg-[#ff0055] hover:text-white border border-black font-mono text-xs font-bold transition-colors flex items-center justify-center gap-1 min-h-[36px]"
              >
                <Dices className="w-3.5 h-3.5" /> DR12
              </button>
            </div>

            {/* Toughness */}
            <div className="p-2.5 bg-[#181818] border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-heading font-bold uppercase text-gray-200">Витривалість</span>
                  <span className="text-[9px] font-mono text-gray-500">3d6: {character.abilities.toughness.raw}</span>
                </div>
                <div className="text-2xl font-heading font-black text-[#fee715] my-0.5">
                  {character.abilities.toughness.modifier >= 0 ? `+${character.abilities.toughness.modifier}` : character.abilities.toughness.modifier}
                </div>
                <p className="text-[9px] font-mono text-gray-400 line-clamp-1">Здоров'я, отрути, стійкість</p>
              </div>
              <button
                onClick={() => rollAbilityTest('Витривалість', character.abilities.toughness.modifier)}
                className="no-print mt-2 py-1.5 bg-[#282828] hover:bg-[#ff0055] hover:text-white border border-black font-mono text-xs font-bold transition-colors flex items-center justify-center gap-1 min-h-[36px]"
              >
                <Dices className="w-3.5 h-3.5" /> DR12
              </button>
            </div>
          </div>
        </div>

        {/* 3. Class Ability & Origins Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-8">
          {/* Ability */}
          <div className="p-3.5 bg-[#181818] border-2 border-black shadow-[3px_3px_0px_#000]">
            <h4 className="text-xs font-heading font-bold uppercase text-[#ff0055] tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Особлива здатність: {character.classAbilityName}
            </h4>
            <p className="text-xs font-mono text-gray-300 leading-relaxed">
              {character.classAbilityDescription}
            </p>
          </div>

          {/* Unique Starter */}
          <div className="p-3.5 bg-[#181818] border-2 border-black shadow-[3px_3px_0px_#000]">
            <h4 className="text-xs font-heading font-bold uppercase text-[#fee715] tracking-wider mb-1 flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Реліквія / Унікальний старт
            </h4>
            <div className="text-xs font-heading font-bold uppercase text-white mb-0.5">
              {character.uniqueStarterItemOrTrait.name}
            </div>
            <p className="text-xs font-mono text-gray-300 leading-relaxed whitespace-pre-line">
              {character.uniqueStarterItemOrTrait.description}
            </p>
          </div>
        </div>

        {/* 4. Weapons & Armor Combat Block */}
        <div className="mb-8">
          <h3 className="text-sm font-heading font-black uppercase tracking-wider text-[#fee715] mb-3 flex items-center gap-2 border-b-2 border-black pb-1">
            <Swords className="w-4 h-4 text-[#ff0055]" />
            <span>Бойове спорядження</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* Weapon Card */}
            <div className="p-3.5 bg-[#1a1a1a] border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-gray-400">Зброя ({character.weapon.slots || 1} слот)</span>
                  <span className="text-[10px] font-mono font-bold bg-[#ff0055] text-white px-2 py-0.5">
                    Шкода: {character.weapon.damage}
                  </span>
                </div>
                <h4 className="text-sm md:text-base font-heading font-bold uppercase text-white">
                  {character.weapon.name}
                </h4>
                <p className="text-xs font-mono text-gray-400 mt-1">
                  {character.weapon.description}
                </p>
              </div>

              <button
                onClick={() => rollWeaponDamage(character.weapon.name, character.weapon.damage || 'd6')}
                className="no-print mt-3 py-2 bg-[#ff0055] hover:bg-[#e0004c] text-white font-heading text-xs font-bold uppercase border border-black shadow-[2px_2px_0px_#000] transition-all flex items-center justify-center gap-2 min-h-[40px]"
              >
                <Dices className="w-4 h-4" />
                <span>Атакувати та кинути шкоду ({character.weapon.damage})</span>
              </button>
            </div>

            {/* Armor Card */}
            <div className="p-3.5 bg-[#1a1a1a] border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-gray-400">Броня ({character.armor.slots || 0} слоти)</span>
                  <span className="text-[10px] font-mono font-bold bg-[#fee715] text-black px-2 py-0.5">
                    Захист: {character.armor.armorValue}
                  </span>
                </div>
                <h4 className="text-sm md:text-base font-heading font-bold uppercase text-white">
                  {character.armor.name}
                </h4>
                <p className="text-xs font-mono text-gray-400 mt-1">
                  {character.armor.description}
                </p>
              </div>

              {character.armor.armorValue !== '0' && (
                <button
                  onClick={() => rollArmorDefense(character.armor.armorValue || 'd2')}
                  className="no-print mt-3 py-2 bg-[#fee715] hover:bg-[#ffe000] text-black font-heading text-xs font-bold uppercase border border-black shadow-[2px_2px_0px_#000] transition-all flex items-center justify-center gap-2 min-h-[40px]"
                >
                  <Shield className="w-4 h-4" />
                  <span>Поглинати шкоду ({character.armor.armorValue})</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 5. Scrolls Block (If any) */}
        <div className="mb-8">
          <div className="flex items-center justify-between border-b-2 border-black pb-1 mb-3">
            <h3 className="text-sm font-heading font-black uppercase tracking-wider text-purple-300 flex items-center gap-2">
              <Scroll className="w-4 h-4 text-purple-400" />
              <span>Сувої Магії ({character.scrolls.length})</span>
            </h3>
            <button
              onClick={rollArcaneCatastrophe}
              className="no-print text-[10px] font-mono font-bold bg-purple-900 hover:bg-purple-800 text-purple-200 px-2 py-1 border border-black"
            >
              Аркана Катастрофа (d20)
            </button>
          </div>

          {character.scrolls.length === 0 ? (
            <div className="p-3 bg-[#181818] border border-black text-xs font-mono text-gray-500 italic">
              Персонаж не має сувоїв на старті. (Використання сувоїв заборонено у середній/важкій броні чи з дворучною зброєю).
            </div>
          ) : (
            <div className="space-y-2">
              {character.scrolls.map((s, idx) => (
                <div key={idx} className="p-2.5 bg-[#1d132b] border border-purple-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 mr-2 ${
                      s.type === 'sacred' ? 'bg-amber-400 text-black' : 'bg-red-600 text-white'
                    }`}>
                      {s.type === 'sacred' ? 'Священний' : 'Нечистий'}
                    </span>
                    <span className="text-xs font-heading font-bold uppercase text-purple-200">{s.name}</span>
                  </div>
                  <p className="text-xs font-mono text-purple-300">{s.effect}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. Inventory & Carrying Capacity */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2 border-b-2 border-black pb-1">
            <h3 className="text-sm font-heading font-black uppercase tracking-wider text-[#fee715] flex items-center gap-2">
              <Backpack className="w-4 h-4 text-[#fee715]" />
              <span>Спорядження ({usedSlots} / {totalContainerCapacity} слотів)</span>
            </h3>
            <span className="text-xs font-mono text-gray-400">
              Базова місткість без штрафів: <span className="text-white font-bold">{baseCapacityWithoutPenalty}</span> (Сила+8)
            </span>
          </div>

          {/* Overburden Warning Notice */}
          {isOverburdened && (
            <div className="mb-3 p-2 bg-amber-950 text-amber-200 border border-amber-600 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Увага: Перевантаження ({usedSlots} {'>'} {baseCapacityWithoutPenalty}). Складність (DR) тестів Сили та Спритності зростає на +2!
              </span>
            </div>
          )}

          {/* Slots capacity bar */}
          <div className="w-full bg-[#222] border border-black h-3 mb-3 p-0.5">
            <div
              className={`h-full transition-all ${
                isOverburdened ? 'bg-amber-500' : 'bg-[#fee715]'
              }`}
              style={{ width: `${Math.min(100, (usedSlots / totalContainerCapacity) * 100)}%` }}
            />
          </div>

          {/* Guaranteed Ration */}
          <div className="p-2.5 bg-[#181818] border border-black mb-3 flex items-center justify-between text-xs font-mono text-gray-300">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-amber-400" />
              <span>Бурдюк з водою + Сухпайок ({character.foodDays} дн.)</span>
            </div>
            <span className="text-[10px] text-gray-400">Спецсумка: {character.carryingContainer.name}</span>
          </div>

          {/* Items List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            {character.gear.map((item) => (
              <div key={item.id} className="p-2 bg-[#181818] border border-black flex items-start justify-between gap-2 group">
                <div>
                  <div className="text-xs font-heading font-bold uppercase text-white flex items-center gap-1.5">
                    <span>{item.name}</span>
                    <span className="text-[9px] font-mono text-gray-500">({item.slots || 1} слот)</span>
                  </div>
                  {item.description && (
                    <p className="text-[11px] font-mono text-gray-400 mt-0.5">{item.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveGearItem(item.id)}
                  className="no-print opacity-60 group-hover:opacity-100 text-gray-500 hover:text-red-400 p-1 min-h-[36px]"
                  title="Видалити"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {character.customEquipment.map((item) => (
              <div key={item.id} className="p-2 bg-[#1b2416] border border-emerald-900 flex items-start justify-between gap-2 group">
                <div>
                  <div className="text-xs font-heading font-bold uppercase text-emerald-300 flex items-center gap-1.5">
                    <span>{item.name}</span>
                    <span className="text-[9px] font-mono text-emerald-500">({item.slots || 1} слот)</span>
                  </div>
                  {item.description && (
                    <p className="text-[11px] font-mono text-emerald-400 mt-0.5">{item.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveCustomItem(item.id)}
                  className="no-print opacity-60 group-hover:opacity-100 text-gray-500 hover:text-red-400 p-1 min-h-[36px]"
                  title="Видалити"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Form to add custom item */}
          <form onSubmit={handleAddEquipment} className="no-print p-2.5 bg-[#181818] border-2 border-black flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              placeholder="Назва предмета..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="bg-[#101010] text-xs font-mono text-white px-2.5 py-2 border border-black w-full sm:w-1/3 focus:outline-none focus:border-[#fee715]"
            />
            <input
              type="text"
              placeholder="Опис / Ефект..."
              value={newItemDesc}
              onChange={(e) => setNewItemDesc(e.target.value)}
              className="bg-[#101010] text-xs font-mono text-white px-2.5 py-2 border border-black w-full sm:w-1/2 focus:outline-none focus:border-[#fee715]"
            />
            <select
              value={newItemSlots}
              onChange={(e) => setNewItemSlots(Number(e.target.value))}
              className="bg-[#101010] text-xs font-mono text-white px-2 py-2 border border-black focus:outline-none w-full sm:w-auto"
            >
              <option value={1}>1 слот</option>
              <option value={2}>2 слоти</option>
              <option value={3}>3 слоти</option>
            </select>
            <button
              type="submit"
              className="px-3 py-2 bg-[#fee715] text-black font-heading font-bold text-xs uppercase border border-black shadow-[2px_2px_0px_#000] shrink-0 hover:bg-[#ffe000] w-full sm:w-auto min-h-[40px]"
            >
              <Plus className="w-4 h-4 inline mr-1" /> Додати
            </button>
          </form>
        </div>

        {/* 7. Background, Troubling Tale & Traits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8">
          {/* Origin & Troubling Tale */}
          <div className="p-3 bg-[#181818] border-2 border-black space-y-2">
            <div>
              <h4 className="text-xs font-heading font-bold uppercase text-[#fee715]">Походження</h4>
              <p className="text-xs font-mono text-gray-300 mt-0.5">{character.origin}</p>
            </div>
            <div className="border-t border-gray-800 pt-2">
              <h4 className="text-xs font-heading font-bold uppercase text-amber-400">Тривожна історія</h4>
              <p className="text-xs font-mono text-gray-300 mt-0.5">{character.troublingTale}</p>
            </div>
          </div>

          {/* Traits */}
          <div className="p-3 bg-[#181818] border-2 border-black">
            <h4 className="text-xs font-heading font-bold uppercase text-[#fee715] mb-1">Жахливі риси (D20)</h4>
            <p className="text-xs font-mono text-gray-300 leading-relaxed">
              1. {character.terribleTraits[0]}<br />
              2. {character.terribleTraits[1]}
            </p>
          </div>

          {/* Broken Body & Habit */}
          <div className="p-3 bg-[#181818] border-2 border-black">
            <h4 className="text-xs font-heading font-bold uppercase text-[#fee715] mb-1">Вада та Звичка</h4>
            <p className="text-xs font-mono text-gray-300 leading-relaxed">
              <span className="text-gray-400">Тіло:</span> {character.brokenBody}<br />
              <span className="text-gray-400">Звичка:</span> {character.badHabit}
            </p>
          </div>
        </div>

        {/* 8. Notes Section */}
        <div className="border-t-2 border-black pt-4">
          <h4 className="text-xs font-heading font-bold uppercase text-[#fee715] mb-2">Нотатки гравця / Пригоди</h4>
          <textarea
            value={character.notes}
            onChange={(e) => onUpdateCharacter({ ...character, notes: e.target.value })}
            placeholder="Записуйте знайдені мапи, прокляття, імена супутників чи шрами..."
            className="w-full h-24 bg-[#101010] text-xs font-mono text-gray-200 p-2.5 border border-black focus:outline-none focus:border-[#fee715]"
          />
        </div>

        {/* Footer Lore Watermark */}
        <div className="mt-6 pt-3 border-t border-gray-800 text-[10px] font-mono text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-1">
          <span>MÖRK BORG є © Ockult Örtmästare Games & Stockholm Kartell.</span>
          <span>Bare Bones Edition verified v2.1</span>
        </div>
      </div>
    </div>
  );
};
