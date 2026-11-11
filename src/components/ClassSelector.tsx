import React from 'react';
import { CharacterClassId } from '../types/morkborg';
import { CLASSES_DATA } from '../data/morkborgTables';
import { Shield, Sparkles, Wand2, Crown, Church, FlaskConical, Dices, Ghost, Eye, Flame, Music, BookOpen } from 'lucide-react';

interface ClassSelectorProps {
  selectedClass: CharacterClassId | 'random';
  onSelectClass: (classId: CharacterClassId | 'random') => void;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({ selectedClass, onSelectClass }) => {
  const getIcon = (id: CharacterClassId | 'random') => {
    switch (id) {
      case 'fanged_deserter': return <Shield className="w-3.5 h-3.5 text-[#ff0055] shrink-0" />;
      case 'gutterborn_scum': return <Sparkles className="w-3.5 h-3.5 text-[#fee715] shrink-0" />;
      case 'esoteric_hermit': return <Wand2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
      case 'wretched_royalty': return <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'heretical_priest': return <Church className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'occult_herbmaster': return <FlaskConical className="w-3.5 h-3.5 text-lime-400 shrink-0" />;
      case 'cursed_skinwalker': return <Ghost className="w-3.5 h-3.5 text-red-500 shrink-0" />;
      case 'pale_one': return <Eye className="w-3.5 h-3.5 text-cyan-300 shrink-0" />;
      case 'dead_gods_prophet': return <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />;
      case 'sacrilegious_songbird': return <Music className="w-3.5 h-3.5 text-pink-400 shrink-0" />;
      case 'forlorn_philosopher': return <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
      default: return <Dices className="w-3.5 h-3.5 text-[#fee715] shrink-0" />;
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
    'dead_gods_prophet',
    'sacrilegious_songbird',
    'pale_one',
    'cursed_skinwalker',
    'forlorn_philosopher'
  ];

  return (
    <div className="bg-[#121212] border-2 border-black p-1.5 shadow-[2px_2px_0px_#000] mb-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
        {classKeys.map((cKey) => {
          const isSelected = selectedClass === cKey;
          const isRandom = cKey === 'random';
          const classDef = !isRandom ? CLASSES_DATA[cKey as CharacterClassId] : null;

          return (
            <button
              key={cKey}
              onClick={() => onSelectClass(cKey)}
              className={`px-2 py-1.5 text-left border border-black transition-all flex items-center justify-between min-h-[38px] relative ${
                isSelected
                  ? 'bg-[#fee715] text-black font-bold shadow-[1px_1px_0px_#000]'
                  : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#252525] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                {getIcon(cKey)}
                <span className="text-[10px] leading-tight font-heading font-black uppercase whitespace-normal break-words">
                  {isRandom ? 'Випадковий' : classDef?.nameUk}
                </span>
              </div>
              <span className="text-[9px] font-mono opacity-60 ml-1 shrink-0 self-start">
                {isRandom ? 'd11' : `d${classDef?.hpDie}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
