import { Character, CharacterClassId, EquipmentItem, ScrollItem } from '../types/morkborg';
import {
  CLASSES_DATA,
  CARRYING_CONTAINERS,
  GEAR_TABLE_1,
  GEAR_TABLE_2,
  WEAPONS_TABLE,
  ARMOR_TABLE,
  UNCLEAN_SCROLLS,
  SACRED_SCROLLS,
  HERBMASTER_POTIONS,
  TERRIBLE_TRAITS,
  BROKEN_BODIES,
  BAD_HABITS,
  TROUBLING_TALES,
  OFFICIAL_NAMES_D6_D8
} from '../data/morkborgTables';
import { roll, rollDice, rollAbilitiesForClass } from './dice';

export function generateCharacter(selectedClassId?: CharacterClassId | 'random'): Character {
  // 1. Determine Class
  let classId: CharacterClassId;
  const classList: CharacterClassId[] = [
    'fanged_deserter',
    'gutterborn_scum',
    'esoteric_hermit',
    'wretched_royalty',
    'heretical_priest',
    'occult_herbmaster',
    'classless_drifter'
  ];

  if (!selectedClassId || selectedClassId === 'random') {
    const rollChoice = roll(6); // Standard d6 class roll
    classId = classList[rollChoice - 1];
  } else {
    classId = selectedClassId;
  }

  const classDef = CLASSES_DATA[classId];

  // 2. Roll Abilities
  const abilities = rollAbilitiesForClass(classId);

  // 3. Roll HP (Min 1)
  const hpRoll = roll(classDef.hpDie);
  const maxHp = Math.max(1, abilities.toughness.modifier + hpRoll);

  // 4. Roll Omens
  const omens = roll(classDef.omensDie);

  // 5. Roll Silver
  const silverRollSum = rollDice(classDef.silverDiceCount, classDef.silverDiceSides);
  const silver = silverRollSum * classDef.silverMultiplier;

  // 6. Food & Waterskin
  const foodDays = roll(4);
  const hasWaterskin = true;

  // 7. Carrying Container
  const containerRoll = roll(6);
  const matchedContainer = CARRYING_CONTAINERS.find(c => c.roll.includes(containerRoll)) || CARRYING_CONTAINERS[0];
  const carryingContainer = {
    name: matchedContainer.name,
    capacityBonus: matchedContainer.capacityBonus,
    description: matchedContainer.description
  };

  // 8. Gear Table 1 & Table 2
  const gearList: EquipmentItem[] = [];
  const scrollList: ScrollItem[] = [];

  // Table 1
  const t1Index = roll(12) - 1;
  const t1Item = GEAR_TABLE_1[t1Index];
  if (t1Item.name === 'Випадковий нечистий сувій') {
    const uncleanScroll = UNCLEAN_SCROLLS[roll(10) - 1];
    scrollList.push(uncleanScroll);
  } else {
    let desc = t1Item.description;
    if (t1Item.name.includes('Смолоскипи')) {
      const count = Math.max(1, abilities.presence.modifier + 4);
      desc = `Кількість: ${count} шт. ${t1Item.description}`;
    } else if (t1Item.name.includes('Ліхтар')) {
      const hours = Math.max(1, abilities.presence.modifier + 6);
      desc = `Запас оливи: ${hours} год. ${t1Item.description}`;
    } else if (t1Item.name.includes('Аптечка')) {
      const uses = Math.max(1, abilities.presence.modifier + 4);
      desc = `Запас: ${uses} використ. Лікує d6 HP і спиняє інфекцію.`;
    }
    gearList.push({
      id: `gear_t1_${Date.now()}_${Math.random()}`,
      name: t1Item.name,
      description: desc,
      slots: t1Item.slots
    });
  }

  // Table 2
  const t2Index = roll(12) - 1;
  const t2Item = GEAR_TABLE_2[t2Index];
  if (t2Item.name === 'Випадковий священний сувій') {
    const sacredScroll = SACRED_SCROLLS[roll(10) - 1];
    scrollList.push(sacredScroll);
  } else {
    let desc = t2Item.description;
    if (t2Item.name.includes('мавп')) {
      const count = roll(4);
      desc = `Кількість: ${count} шт. Ігнорують накази, але дуже люблять вас.`;
    }
    gearList.push({
      id: `gear_t2_${Date.now()}_${Math.random()}`,
      name: t2Item.name,
      description: desc,
      slots: t2Item.slots
    });
  }

  // Hermit starts with 1 free scroll if none rolled yet
  if (classId === 'esoteric_hermit' && scrollList.length === 0) {
    const isSacred = roll(2) === 1;
    const scroll = isSacred ? SACRED_SCROLLS[roll(10) - 1] : UNCLEAN_SCROLLS[roll(10) - 1];
    scrollList.push(scroll);
  }

  // If character starts with a scroll, max weapon die is d6, max armor die is d2! (Bare Bones p. 23)
  const hasScrollAtStart = scrollList.length > 0;
  const maxWeaponDie = hasScrollAtStart ? Math.min(6, classDef.weaponDie) : classDef.weaponDie;
  const maxArmorDie = hasScrollAtStart ? Math.min(2, classDef.armorDie) : classDef.armorDie;

  // 9. Weapon Roll
  const weaponIndex = Math.min(WEAPONS_TABLE.length, roll(maxWeaponDie)) - 1;
  const weapon = { ...WEAPONS_TABLE[weaponIndex] };

  // 10. Armor Roll
  const armorIndex = Math.min(ARMOR_TABLE.length, roll(maxArmorDie)) - 1;
  const armor = { ...ARMOR_TABLE[armorIndex] };

  // 11. Class Specific Starters & Traits
  const originRoll = roll(classDef.origins.length) - 1;
  const origin = classDef.origins[originRoll];

  let uniqueStarterItemOrTrait: { name: string; description: string };

  if (classId === 'wretched_royalty') {
    const u1Index = roll(classDef.uniqueStarters.length) - 1;
    let u2Index = roll(classDef.uniqueStarters.length) - 1;
    while (u2Index === u1Index) {
      u2Index = roll(classDef.uniqueStarters.length) - 1;
    }
    const u1 = classDef.uniqueStarters[u1Index];
    const u2 = classDef.uniqueStarters[u2Index];
    uniqueStarterItemOrTrait = {
      name: `${u1.name} ТА ${u2.name}`,
      description: `1. ${u1.name}: ${u1.description}\n2. ${u2.name}: ${u2.description}`
    };
  } else {
    const uIndex = roll(classDef.uniqueStarters.length) - 1;
    uniqueStarterItemOrTrait = classDef.uniqueStarters[uIndex];
  }

  // Herbmaster gets Portable Lab and Potion Doses
  if (classId === 'occult_herbmaster') {
    const potionDoses = roll(4);
    const p1 = HERBMASTER_POTIONS[roll(8) - 1];
    const p2 = HERBMASTER_POTIONS[roll(8) - 1];
    gearList.push({
      id: `herb_lab_${Date.now()}`,
      name: 'Портативна лабораторія травника',
      description: `Запас на ${potionDoses} доз відварів:\n• ${p1.name}: ${p1.effect}\n• ${p2.name}: ${p2.effect}`,
      slots: 1
    });
  }

  // 12. Personality Traits & Troubling Tale
  const t1Idx = roll(20) - 1;
  let t2Idx = roll(20) - 1;
  while (t2Idx === t1Idx) {
    t2Idx = roll(20) - 1;
  }
  const terribleTraits: [string, string] = [TERRIBLE_TRAITS[t1Idx], TERRIBLE_TRAITS[t2Idx]];

  const brokenBody = BROKEN_BODIES[roll(20) - 1];
  const badHabit = BAD_HABITS[roll(20) - 1];
  const troublingTale = TROUBLING_TALES[roll(20) - 1];

  // 13. Name Generation from 48 Bare Bones official names
  const d6Row = roll(6) - 1;
  const d8Col = roll(8) - 1;
  const fullName = OFFICIAL_NAMES_D6_D8[d6Row][d8Col];

  return {
    id: `mork_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    createdAt: new Date().toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    name: fullName,
    classId: classId,
    className: classDef.nameUk,
    classDescription: classDef.description,
    abilities,
    currentHp: maxHp,
    maxHp: maxHp,
    omens,
    maxOmens: omens,
    silver,
    foodDays,
    hasWaterskin,
    carryingContainer,
    weapon,
    armor,
    gear: gearList,
    scrolls: scrollList,
    origin,
    troublingTale,
    classAbilityName: classDef.abilityName,
    classAbilityDescription: classDef.abilityDescription,
    uniqueStarterItemOrTrait,
    terribleTraits,
    brokenBody,
    badHabit,
    notes: '',
    customEquipment: []
  };
}
