import React from 'react';
import { CharacterClassId } from '../types/morkborg';
import { CLASSES_DATA } from '../data/morkborgTables';
import { Shield, Sparkles, Wand2, Crown, Church, FlaskConical, Dices, HelpCircle } from 'lucide-react';

interface ClassSelectorProps {
  selectedClass: CharacterClassId | 'random';
  onSelectClass: (classId: CharacterClassId | 'random') => void;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({ selectedClass, onSelectClass }) => {
  const getIcon = (id: CharacterClassId | 'random') => {
    switch (id) {
      case 'fanged_deserter': return <Shield className="w-3.5 h-3.5 text-[#ff0055]" />;
      case 'gutterborn_scum': return <Sparkles className="w-3.5 h-3.5 text-[#fee715]" />;
      case 'esoteric_hermit': return <Wand2 className="w-3.5 h-3.5 text-purple-400" />;
      case 'wretched_royalty': return <Crown className="w-3.5 h-3.5 text-amber-400" />;
      case 'heretical_priest': return <Church className="w-3.5 h-3.5 text-emerald-400" />;
      case 'occult_herbmaster': return <FlaskConical className="w-3.5 h-3.5 text-lime-400" />;
      case 'classless_drifter': return <HelpCircle className="w-3.5 h-3.5 text-blue-400" />;
      default: return <Dices className="w-3.5 h-3.5 text-[#fee715]" />;
    }
  };

  const classKeys: (CharacterClassId | 'random')[] = [
    'random',
    'fanged_deserter',
    'gutterborn_scum',
    'esoteric_hermit',
    'wretched_royalty',
    'heretical_priest',
    'occult_herbmaster',
    'classless_drifter'
  ];

  return (
    <div className="bg-[#121212] border-2 border-black px-2 py-1.5 shadow-[2px_2px_0px_#000] mb-2">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1 overflow-x-auto no-scrollbar">
        {classKeys.map((cKey) => {
          const isSelected = selectedClass === cKey;
          const isRandom = cKey === 'random';
          const classDef = !isRandom ? CLASSES_DATA[cKey as CharacterClassId] : null;

          return (
            <button
              key={cKey}
              onClick={() => onSelectClass(cKey)}
              className={`px-2 py-1 text-left border border-black transition-all flex items-center justify-between h-9 min-w-[110px] sm:min-w-0 shrink-0 relative ${
                isSelected
                  ? 'bg-[#fee715] text-black font-bold shadow-[1px_1px_0px_#000]'
                  : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#252525] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                {getIcon(cKey)}
                <span className="text-[10px] font-heading font-black uppercase truncate">
                  {isRandom ? 'Випадковий' : classDef?.nameUk}
                </span>
              </div>
              <span className="text-[8px] font-mono opacity-60 ml-1">
                {isRandom ? 'd6' : `d${classDef?.hpDie}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
