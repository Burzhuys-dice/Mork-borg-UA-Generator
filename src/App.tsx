import React, { useState } from 'react';
import { Character, CharacterClassId } from './types/morkborg';
import { generateCharacter } from './utils/generator';
import { roll, rollDice } from './utils/dice';
import { UNCLEAN_SCROLLS, SACRED_SCROLLS } from './data/morkborgTables';
import { Navbar } from './components/Navbar';
import { CharacterSheet } from './components/CharacterSheet';
import { RulesReferenceModal } from './components/RulesReferenceModal';
import { DiceRollerModal } from './components/DiceRollerModal';
import { GMTools } from './components/GMTools';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'single' | 'rules' | 'gm'>('single');
  const [selectedClass, setSelectedClass] = useState<CharacterClassId | 'random'>('random');
  
  // Active character state
  const [character, setCharacter] = useState<Character>(() => generateCharacter('random'));
  const [gettingBetterResult, setGettingBetterResult] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const [isDiceModalOpen, setIsDiceModalOpen] = useState(false);

  // Generate new character
  const handleGenerateNew = () => {
    const newChar = generateCharacter(selectedClass);
    setCharacter(newChar);
    setGettingBetterResult(null);
    setCurrentTab('single');
  };

  // Class Selection Handler
  const handleSelectClass = (cId: CharacterClassId | 'random') => {
    setSelectedClass(cId);
    const newChar = generateCharacter(cId);
    setCharacter(newChar);
    setGettingBetterResult(null);
    setCurrentTab('single');
  };

  // Level Up / Покращення (Bare Bones p. 33)
  const handleGettingBetter = () => {
    let report = '=== ПОКРАЩЕННЯ ПЕРСОНАЖА (GETTING BETTER) ===\n';

    // 1. More HP (6d10 vs current Max HP)
    const hp6d10 = rollDice(6, 10);
    let hpBonus = 0;
    if (hp6d10 >= character.maxHp) {
      hpBonus = roll(6);
      report += `• 6d10 = ${hp6d10} (>= ${character.maxHp} макс HP) -> HP +${hpBonus}!\n`;
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
    report += `• Уламки (d6=${debrisRoll}): ${debrisItem}\n`;

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
      report += `• ${abKey.toUpperCase()}: ${currentVal >= 0 ? '+' : ''}${currentVal} -> ${newMod >= 0 ? '+' : ''}${newMod} (${sign})\n`;

      updatedAbilities[abKey] = {
        raw: updatedAbilities[abKey].raw,
        modifier: newMod
      };
    });

    const updatedHp = character.maxHp + hpBonus;
    setCharacter({
      ...character,
      maxHp: updatedHp,
      currentHp: character.currentHp + hpBonus,
      silver: character.silver + addSilver,
      scrolls: newScrollList,
      abilities: updatedAbilities
    });

    setGettingBetterResult(report);
  };

  // Copy text handler
  const handleCopyText = () => {
    const text = `
=== MÖRK BORG ПЕРСОНАЖ: ${character.name} ===
Клас: ${character.className}
HP: ${character.currentHp}/${character.maxHp} | Знаки: ${character.omens}/${character.maxOmens} | Срібло: ${character.silver}с

[ХАРАКТЕРИСТИКИ]
• Сила: ${character.abilities.strength.modifier >= 0 ? '+' : ''}${character.abilities.strength.modifier}
• Спритність: ${character.abilities.agility.modifier >= 0 ? '+' : ''}${character.abilities.agility.modifier}
• Свідомість: ${character.abilities.presence.modifier >= 0 ? '+' : ''}${character.abilities.presence.modifier}
• Витривалість: ${character.abilities.toughness.modifier >= 0 ? '+' : ''}${character.abilities.toughness.modifier}

[ЗБРОЯ ТА БРОНЯ]
• Зброя: ${character.weapon.name} (${character.weapon.damage})
• Броня: ${character.armor.name} (${character.armor.armorValue})

[СПОРАДЖЕННЯ]
• Контейнер: ${character.carryingContainer.name}
• Сухпайок: на ${character.foodDays} дн.
${character.gear.map(g => `• ${g.name}: ${g.description}`).join('\n')}

[СУВОЇ]
${character.scrolls.length > 0 ? character.scrolls.map(s => `• ${s.name} (${s.type}): ${s.effect}`).join('\n') : 'Немає'}

[ОСОБЛИВОСТІ]
• Здатність: ${character.classAbilityName}
• Реліквія: ${character.uniqueStarterItemOrTrait.name}
• Тривожна історія: ${character.troublingTale}
• Риси: ${character.terribleTraits.join(', ')}
• Вада: ${character.brokenBody} | Звичка: ${character.badHabit}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-[#e0dfd5] font-mono selection:bg-[#ff0055] selection:text-white">
      {/* Collapsible Top Curtain Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedClass={selectedClass}
        onSelectClass={handleSelectClass}
        onGenerateNew={handleGenerateNew}
        onGettingBetter={handleGettingBetter}
        onCopyText={handleCopyText}
        copySuccess={copySuccess}
        openDiceModal={() => setIsDiceModalOpen(true)}
        characterName={character.name}
        characterClassName={character.className}
      />

      {/* Main Content Viewport */}
      <main className="max-w-7xl mx-auto px-2 py-2">
        {currentTab === 'single' && (
          <CharacterSheet
            character={character}
            onUpdateCharacter={setCharacter}
            gettingBetterResult={gettingBetterResult}
            onClearGettingBetterResult={() => setGettingBetterResult(null)}
          />
        )}

        {currentTab === 'gm' && (
          <GMTools />
        )}

        {currentTab === 'rules' && (
          <RulesReferenceModal />
        )}
      </main>

      {/* Dice Roller Popup Modal */}
      <DiceRollerModal
        isOpen={isDiceModalOpen}
        onClose={() => setIsDiceModalOpen(false)}
      />
    </div>
  );
}
