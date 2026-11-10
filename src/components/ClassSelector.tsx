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
      case 'fanged_deserter': return <Shield className="w-4 h-4 text-[#ff0055]" />;
      case 'gutterborn_scum': return <Sparkles className="w-4 h-4 text-[#fee715]" />;
      case 'esoteric_hermit': return <Wand2 className="w-4 h-4 text-purple-400" />;
      case 'wretched_royalty': return <Crown className="w-4 h-4 text-amber-400" />;
      case 'heretical_priest': return <Church className="w-4 h-4 text-emerald-400" />;
      case 'occult_herbmaster': return <FlaskConical className="w-4 h-4 text-lime-400" />;
      case 'classless_drifter': return <HelpCircle className="w-4 h-4 text-blue-400" />;
      default: return <Dices className="w-4 h-4 text-[#fee715]" />;
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
    <div className="bg-[#121212] border-3 border-black p-3 md:p-4 shadow-[4px_4px_0px_#000] mb-6">
      <div className="flex items-center justify-between mb-2.5 border-b-2 border-black pb-1.5">
        <h2 className="text-xs md:text-sm font-heading font-black tracking-wider uppercase text-[#fee715] flex items-center gap-1.5">
          <span>Оберіть Клас (d6)</span>
        </h2>
        <span className="text-[10px] font-mono text-gray-400">Натисніть для вибору</span>
      </div>

      {/* Grid on tablet/desktop, horizontal scroll bar on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 overflow-x-auto pb-1 no-scrollbar">
        {classKeys.map((cKey) => {
          const isSelected = selectedClass === cKey;
          const isRandom = cKey === 'random';
          const classDef = !isRandom ? CLASSES_DATA[cKey as CharacterClassId] : null;

          return (
            <button
              key={cKey}
              onClick={() => onSelectClass(cKey)}
              className={`p-2 text-left border-2 border-black transition-all flex flex-col justify-between h-20 min-w-[130px] sm:min-w-0 shrink-0 relative ${
                isSelected
                  ? 'bg-[#fee715] text-black font-bold shadow-[3px_3px_0px_#000] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#252525] hover:text-white shadow-[2px_2px_0px_#000]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                {getIcon(cKey)}
                <span className="text-[9px] font-mono opacity-60">
                  {isRandom ? 'd6' : `HP d${classDef?.hpDie}`}
                </span>
              </div>

              <div>
                <div className="text-[11px] font-heading font-black uppercase leading-tight line-clamp-1">
                  {isRandom ? 'Випадковий' : classDef?.nameUk}
                </div>
                <div className={`text-[9px] font-mono leading-none mt-0.5 line-clamp-1 ${isSelected ? 'text-black/80' : 'text-gray-400'}`}>
                  {isRandom ? 'За долею' : classDef?.title}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
