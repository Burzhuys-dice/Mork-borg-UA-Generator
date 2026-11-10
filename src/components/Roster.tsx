import React, { useState } from 'react';
import { Character } from '../types/morkborg';
import { BookmarkCheck, Search, Trash2, Eye, Download, Upload, Skull } from 'lucide-react';

interface RosterProps {
  roster: Character[];
  onSelectCharacter: (char: Character) => void;
  onRemoveFromRoster: (id: string) => void;
  onImportRoster: (imported: Character[]) => void;
  onClearRoster: () => void;
}

export const Roster: React.FC<RosterProps> = ({
  roster,
  onSelectCharacter,
  onRemoveFromRoster,
  onImportRoster,
  onClearRoster,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');

  const filteredRoster = roster.filter((char) => {
    const matchesSearch =
      char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      char.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      char.weapon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'all' || char.classId === classFilter;
    return matchesSearch && matchesClass;
  });

  // Export JSON backup
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(roster, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `MORK_BORG_ROSTER_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onImportRoster(parsed);
          }
        } catch (err) {
          alert('Помилка читання JSON файлу реєстру!');
        }
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Roster Controls */}
      <div className="bg-[#121212] border-3 border-black p-4 shadow-[6px_6px_0px_#000] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-black tracking-wider uppercase text-[#fee715] flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-emerald-400" />
            <span>Реєстр Збережених Волоцюг ({roster.length})</span>
          </h2>
          <p className="text-xs font-mono text-gray-400 mt-0.5">
            Збережені у вашому браузері персонажі для кампанії MÖRK BORG
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportJSON}
            disabled={roster.length === 0}
            className="px-3 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] disabled:opacity-50 text-white font-heading font-bold text-xs uppercase border border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Експорт JSON</span>
          </button>

          <label className="px-3 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-heading font-bold text-xs uppercase border border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Імпорт</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          {roster.length > 0 && (
            <button
              onClick={onClearRoster}
              className="px-3 py-2 bg-red-950 hover:bg-red-900 text-red-200 font-heading font-bold text-xs uppercase border border-black shadow-[2px_2px_0px_#000]"
            >
              Очистити все
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      {roster.length > 0 && (
        <div className="bg-[#121212] border-2 border-black p-3 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-1/2">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Пошук за ім'ям, класом або зброєю..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#1a1a1a] text-xs font-mono text-white border border-black focus:outline-none focus:border-[#fee715]"
            />
          </div>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-full sm:w-1/2 bg-[#1a1a1a] text-xs font-mono text-white p-2 border border-black focus:outline-none"
          >
            <option value="all">Усі класи</option>
            <option value="fanged_deserter">Ікластий дезертир</option>
            <option value="gutterborn_scum">Поріддя нетрів</option>
            <option value="esoteric_hermit">Езотеричний самітник</option>
            <option value="wretched_royalty">Злиденна шляхта</option>
            <option value="heretical_priest">Єретичний жрець</option>
            <option value="occult_herbmaster">Окультний травник</option>
            <option value="classless_drifter">Безкласовий волоцюга</option>
          </select>
        </div>
      )}

      {/* Roster Cards Grid */}
      {filteredRoster.length === 0 ? (
        <div className="bg-[#121212] border-3 border-black p-12 text-center shadow-[6px_6px_0px_#000]">
          <Skull className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-heading font-black text-gray-300 uppercase">
            {roster.length === 0 ? 'Реєстр порожній' : 'Нікого не знайдено за фільтрами'}
          </h3>
          <p className="text-xs font-mono text-gray-500 mt-1">
            {roster.length === 0
              ? 'Згенеруйте нових персонажів та натисніть "Зберегти у Реєстр"'
              : 'Спробуйте змінити пошуковий запит'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoster.map((char) => (
            <div
              key={char.id}
              className="bg-[#121212] border-3 border-black p-4 shadow-[4px_4px_0px_#000] flex flex-col justify-between hover:border-[#fee715] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase bg-[#ff0055] text-white px-2 py-0.5">
                    {char.className}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">{char.createdAt}</span>
                </div>

                <h3 className="text-lg font-heading font-black text-[#fee715] uppercase mb-1">
                  {char.name}
                </h3>

                <div className="grid grid-cols-3 gap-1 my-2 text-center text-xs font-mono">
                  <div className="bg-[#1a1a1a] p-1 border border-black text-red-400 font-bold">
                    HP {char.currentHp}/{char.maxHp}
                  </div>
                  <div className="bg-[#1a1a1a] p-1 border border-black text-[#fee715] font-bold">
                    Знамення {char.omens}
                  </div>
                  <div className="bg-[#1a1a1a] p-1 border border-black text-amber-300 font-bold">
                    {char.silver}с
                  </div>
                </div>

                <div className="text-xs font-mono text-gray-300 space-y-1 mb-3">
                  <div>
                    <span className="text-gray-500">Зброя:</span> {char.weapon.name} ({char.weapon.damage})
                  </div>
                  <div>
                    <span className="text-gray-500">Броня:</span> {char.armor.name}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                <button
                  onClick={() => onSelectCharacter(char)}
                  className="w-full py-1.5 bg-[#fee715] text-black font-heading font-bold text-xs uppercase border border-black shadow-[2px_2px_0px_#000] hover:bg-[#ffe000] flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Відкрити
                </button>

                <button
                  onClick={() => onRemoveFromRoster(char.id)}
                  className="p-1.5 bg-red-950 text-red-300 hover:bg-red-900 border border-black"
                  title="Видалити"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
