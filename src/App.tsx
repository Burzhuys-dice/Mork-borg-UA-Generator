import React, { useState, useEffect } from 'react';
import { Character, CharacterClassId } from './types/morkborg';
import { generateCharacter } from './utils/generator';
import { Navbar } from './components/Navbar';
import { ClassSelector } from './components/ClassSelector';
import { CharacterSheet } from './components/CharacterSheet';
import { BatchGenerator } from './components/BatchGenerator';
import { Roster } from './components/Roster';
import { RulesReferenceModal } from './components/RulesReferenceModal';
import { DiceRollerModal } from './components/DiceRollerModal';

const ROSTER_LOCAL_KEY = 'mork_borg_scvmbirther_roster_v2';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'single' | 'batch' | 'roster' | 'rules'>('single');
  const [selectedClass, setSelectedClass] = useState<CharacterClassId | 'random'>('random');
  
  // Current active single character
  const [character, setCharacter] = useState<Character>(() => generateCharacter('random'));
  
  // Roster saved characters
  const [roster, setRoster] = useState<Character[]>(() => {
    try {
      const saved = localStorage.getItem(ROSTER_LOCAL_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDiceModalOpen, setIsDiceModalOpen] = useState(false);

  // Sync roster to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ROSTER_LOCAL_KEY, JSON.stringify(roster));
    } catch (e) {
      console.error('Failed to save roster to localStorage:', e);
    }
  }, [roster]);

  // Generate new character
  const handleGenerateNew = () => {
    const newChar = generateCharacter(selectedClass);
    setCharacter(newChar);
    setCurrentTab('single');
  };

  // Class Selection Handler
  const handleSelectClass = (cId: CharacterClassId | 'random') => {
    setSelectedClass(cId);
    const newChar = generateCharacter(cId);
    setCharacter(newChar);
    setCurrentTab('single');
  };

  // Save character to roster
  const handleSaveToRoster = (charToSave: Character) => {
    setRoster((prev) => {
      const exists = prev.some((c) => c.id === charToSave.id);
      if (exists) {
        return prev.map((c) => (c.id === charToSave.id ? charToSave : c));
      }
      return [charToSave, ...prev];
    });
  };

  // Remove character from roster
  const handleRemoveFromRoster = (id: string) => {
    setRoster((prev) => prev.filter((c) => c.id !== id));
  };

  // Import full roster
  const handleImportRoster = (imported: Character[]) => {
    setRoster(imported);
  };

  // Clear roster
  const handleClearRoster = () => {
    if (window.confirm('Ви дійсно бажаєте очистити увесь реєстр збережених персонажів?')) {
      setRoster([]);
    }
  };

  // Select character from Roster or Batch into main view
  const handleSelectFromRosterOrBatch = (char: Character) => {
    setCharacter(char);
    setCurrentTab('single');
  };

  const isCurrentSaved = roster.some((c) => c.id === character.id);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-[#e0dfd5] font-mono selection:bg-[#ff0055] selection:text-white">
      {/* Top Bar Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onGenerateNew={handleGenerateNew}
        savedCount={roster.length}
        openDiceModal={() => setIsDiceModalOpen(true)}
      />

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Class Selector Bar (Shown on Single view) */}
        {currentTab === 'single' && (
          <ClassSelector
            selectedClass={selectedClass}
            onSelectClass={handleSelectClass}
          />
        )}

        {/* Tab Content Views */}
        {currentTab === 'single' && (
          <CharacterSheet
            character={character}
            onUpdateCharacter={setCharacter}
            onSaveToRoster={handleSaveToRoster}
            isSavedInRoster={isCurrentSaved}
          />
        )}

        {currentTab === 'batch' && (
          <BatchGenerator
            onSelectCharacter={handleSelectFromRosterOrBatch}
            onSaveToRoster={handleSaveToRoster}
          />
        )}

        {currentTab === 'roster' && (
          <Roster
            roster={roster}
            onSelectCharacter={handleSelectFromRosterOrBatch}
            onRemoveFromRoster={handleRemoveFromRoster}
            onImportRoster={handleImportRoster}
            onClearRoster={handleClearRoster}
          />
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
