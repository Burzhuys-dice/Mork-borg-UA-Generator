/**
 * MÖRK BORG Character Types (Bare Bones Edition)
 */

export type CharacterClassId =
  | 'fanged_deserter'
  | 'gutterborn_scum'
  | 'esoteric_hermit'
  | 'wretched_royalty'
  | 'heretical_priest'
  | 'occult_herbmaster'
  | 'cursed_skinwalker'
  | 'pale_one'
  | 'dead_gods_prophet'
  | 'sacrilegious_songbird'
  | 'forlorn_philosopher';

export interface AbilityScore {
  raw: number;
  modifier: number;
}

export interface Abilities {
  strength: AbilityScore;
  agility: AbilityScore;
  presence: AbilityScore;
  toughness: AbilityScore;
}

export interface EquipmentItem {
  id: string;
  name: string;
  description?: string;
  quantity?: number;
  slots?: number; // How many inventory slots it occupies
  isWeapon?: boolean;
  isArmor?: boolean;
  damage?: string;
  tier?: number;
  armorValue?: string;
  specialEffect?: string;
}

export interface ScrollItem {
  name: string;
  type: 'unclean' | 'sacred';
  effect: string;
}

export interface Character {
  id: string;
  createdAt: string;
  name: string;
  classId: CharacterClassId;
  className: string;
  classDescription: string;
  
  // Base Stats
  abilities: Abilities;
  currentHp: number;
  maxHp: number;
  omens: number;
  maxOmens: number;
  silver: number;

  // Inventory & Equipment
  foodDays: number;
  hasWaterskin: boolean;
  carryingContainer: {
    name: string;
    capacityBonus: number; // Extra item slots provided by bag
    description: string;
  };
  weapon: EquipmentItem;
  armor: EquipmentItem;
  gear: EquipmentItem[];
  scrolls: ScrollItem[];

  // Class Features & Lore
  origin: string;
  troublingTale: string; // From Troubling Tales table (p. 41-42)
  classAbilityName: string;
  classAbilityDescription: string;
  uniqueStarterItemOrTrait: {
    name: string;
    description: string;
  };

  // Personality & Physical
  terribleTraits: [string, string];
  brokenBody: string;
  badHabit: string;

  // Custom User Fields
  notes: string;
  customEquipment: EquipmentItem[];
}
