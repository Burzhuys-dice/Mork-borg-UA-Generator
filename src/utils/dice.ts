import { Abilities, AbilityScore, CharacterClassId } from '../types/morkborg';

// Basic random roll between 1 and sides
export function roll(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

// Roll multiple dice and sum
export function rollDice(count: number, sides: number): number {
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += roll(sides);
  }
  return total;
}

// Roll multiple dice, drop lowest, sum remaining
export function rollKeepHighest(count: number, sides: number, keepCount: number): number {
  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(roll(sides));
  }
  rolls.sort((a, b) => b - a); // Descending
  return rolls.slice(0, keepCount).reduce((sum, val) => sum + val, 0);
}

// Convert 3d6 total score into MÖRK BORG Ability Modifier (-3 to +3)
export function getAbilityMod(score: number): number {
  if (score <= 4) return -3;
  if (score <= 6) return -2;
  if (score <= 8) return -1;
  if (score <= 12) return 0;
  if (score <= 14) return 1;
  if (score <= 16) return 2;
  return 3;
}

// Roll abilities respecting class rules
export function rollAbilitiesForClass(classId: CharacterClassId): Abilities {
  let strMod = 0;
  let agiMod = 0;
  let preMod = 0;
  let touMod = 0;

  if (classId === 'fanged_deserter') {
    strMod = 2;
    agiMod = -1;
    preMod = -1;
  } else if (classId === 'gutterborn_scum') {
    strMod = -2;
  } else if (classId === 'esoteric_hermit') {
    preMod = 2;
    strMod = -2;
  } else if (classId === 'heretical_priest') {
    preMod = 2;
    strMod = -2;
  } else if (classId === 'occult_herbmaster') {
    touMod = 2;
    strMod = -2;
  }

  let strRaw: number;
  let agiRaw: number;
  let preRaw: number;
  let touRaw: number;

  if (classId === 'classless_drifter') {
    // Classless drifter: 4d6 keep 3 for TWO chosen stats, 3d6 for other two
    const keys = ['str', 'agi', 'pre', 'tou'];
    // Shuffle array to pick 2 at random
    const boosted = [...keys].sort(() => Math.random() - 0.5).slice(0, 2);

    strRaw = boosted.includes('str') ? rollKeepHighest(4, 6, 3) : rollDice(3, 6);
    agiRaw = boosted.includes('agi') ? rollKeepHighest(4, 6, 3) : rollDice(3, 6);
    preRaw = boosted.includes('pre') ? rollKeepHighest(4, 6, 3) : rollDice(3, 6);
    touRaw = boosted.includes('tou') ? rollKeepHighest(4, 6, 3) : rollDice(3, 6);
  } else {
    strRaw = rollDice(3, 6) + strMod;
    agiRaw = rollDice(3, 6) + agiMod;
    preRaw = rollDice(3, 6) + preMod;
    touRaw = rollDice(3, 6) + touMod;
  }

  return {
    strength: { raw: strRaw, modifier: getAbilityMod(strRaw) },
    agility: { raw: agiRaw, modifier: getAbilityMod(agiRaw) },
    presence: { raw: preRaw, modifier: getAbilityMod(preRaw) },
    toughness: { raw: touRaw, modifier: getAbilityMod(touRaw) },
  };
}
