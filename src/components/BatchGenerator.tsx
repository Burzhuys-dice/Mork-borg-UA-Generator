import React, { useState } from 'react';
import { Character } from '../types/morkborg';
import { generateCharacter } from '../utils/generator';
import { RefreshCw, Users, BookmarkPlus, Eye } from 'lucide-react';

interface BatchGeneratorProps {
  onSelectCharacter: (char: Character) => void;
  onSaveToRoster: (char: Character) => void;
}

export const BatchGenerator: React.FC<BatchGeneratorProps> = ({
  onSelectCharacter,
  onSaveToRoster,
}) => {
  const [batch, setBatch] = useState<Character[]>(() => [
    generateCharacter('random'),
    generateCharacter('random'),
    generateCharacter('random'),
    generateCharacter('random'),
  ]);

  const handleRegenerateAll = () => {
    setBatch([
      generateCharacter('random'),
      generateCharacter('random'),
      generateCharacter('random'),
      generateCharacter('random'),
    ]);
  };

  const handleRegenerateOne = (index: number) => {
    const updated = [...batch];
    updated[index] = generateCharacter('random');
    setBatch(updated);
  };

  const handleSaveAll = () => {
    batch.forEach((char) => onSaveToRoster(char));
  };

  return (
    <div className="space-y-6">
      {/* Batch Header Toolbar */}
      <div className="bg-[#121212] border-3 border-black p-3.5 md:p-4 shadow-[4px_4px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-heading font-black tracking-wider uppercase text-[#fee715] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#ff0055]" />
            <span>Загін Гарматного М'яса (4 волоцюги)</span>
          </h2>
          <p className="text-[11px] font-mono text-gray-400 mt-0.5">
            Згенеровано 4 волоцюг для негайної заміни загиблих у підземеллі
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleRegenerateAll}
            className="w-1/2 sm:w-auto px-3 py-2 min-h-[42px] bg-[#fee715] text-black font-heading font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#ffe000] flex items-center justify-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Перекинути (4)</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="w-1/2 sm:w-auto px-3 py-2 min-h-[42px] bg-[#ff0055] text-white font-heading font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#e0004c] flex items-center justify-center gap-1.5 transition-all"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>Зберегти всіх</span>
          </button>
        </div>
      </div>

      {/* 4-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {batch.map((char, idx) => (
          <div
            key={char.id}
            className="bg-[#121212] border-3 border-black p-4 shadow-[4px_4px_0px_#000] flex flex-col justify-between relative group hover:border-[#fee715] transition-colors"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between border-b-2 border-black pb-2 mb-3">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase bg-[#ff0055] text-white px-2 py-0.5">
                    {char.className}
                  </span>
                  <h3 className="text-lg md:text-xl font-heading font-black text-[#fee715] uppercase mt-1">
                    {char.name}
                  </h3>
                </div>

                <button
                  onClick={() => handleRegenerateOne(idx)}
                  className="p-2 bg-[#1a1a1a] hover:bg-[#fee715] hover:text-black text-gray-400 border border-black transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                  title="Замінити лише цього персонажа"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-4 gap-1.5 mb-3 text-center">
                <div className="bg-[#1a1a1a] p-1 border border-black">
                  <div className="text-[9px] font-mono text-gray-400 uppercase">HP</div>
                  <div className="text-sm font-heading font-black text-red-400">{char.maxHp}</div>
                </div>
                <div className="bg-[#1a1a1a] p-1 border border-black">
                  <div className="text-[9px] font-mono text-gray-400 uppercase">Знаки</div>
                  <div className="text-sm font-heading font-black text-[#fee715]">{char.omens}</div>
                </div>
                <div className="bg-[#1a1a1a] p-1 border border-black">
                  <div className="text-[9px] font-mono text-gray-400 uppercase">Срібло</div>
                  <div className="text-sm font-heading font-black text-amber-300">{char.silver}с</div>
                </div>
                <div className="bg-[#1a1a1a] p-1 border border-black">
                  <div className="text-[9px] font-mono text-gray-400 uppercase">Сила</div>
                  <div className="text-sm font-heading font-black text-white">
                    {char.abilities.strength.modifier >= 0 ? `+${char.abilities.strength.modifier}` : char.abilities.strength.modifier}
                  </div>
                </div>
              </div>

              {/* Equipment Brief */}
              <div className="space-y-1 text-xs font-mono text-gray-300 mb-3 bg-[#181818] p-2.5 border border-black">
                <div>
                  <span className="text-gray-500 uppercase text-[10px]">Зброя:</span> <span className="text-white font-bold">{char.weapon.name}</span> ({char.weapon.damage})
                </div>
                <div>
                  <span className="text-gray-500 uppercase text-[10px]">Броня:</span> <span className="text-white font-bold">{char.armor.name}</span>
                </div>
                <div className="line-clamp-2">
                  <span className="text-gray-500 uppercase text-[10px]">Спорядження:</span> {char.gear.map(g => g.name).join(', ')}
                </div>
                {char.scrolls.length > 0 && (
                  <div className="text-purple-300 line-clamp-1">
                    <span className="text-purple-500 uppercase text-[10px]">Сувій:</span> {char.scrolls.map(s => s.name).join(', ')}
                  </div>
                )}
              </div>

              {/* Personality */}
              <div className="text-[11px] font-mono text-gray-400 italic mb-3">
                "Вада: {char.brokenBody}"
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
              <button
                onClick={() => onSelectCharacter(char)}
                className="w-full py-2 min-h-[40px] bg-[#fee715] text-black font-heading font-bold text-xs uppercase border border-black shadow-[2px_2px_0px_#000] hover:bg-[#ffe000] flex items-center justify-center gap-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>Відкрити картку</span>
              </button>

              <button
                onClick={() => onSaveToRoster(char)}
                className="py-2 px-3 min-h-[40px] bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] font-heading font-bold text-xs uppercase border border-black shadow-[2px_2px_0px_#000]"
                title="Зберегти персонажа"
              >
                <BookmarkPlus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
