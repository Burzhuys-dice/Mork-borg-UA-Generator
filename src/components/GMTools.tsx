import React, { useState } from 'react';
import { D66_ARRIVING_ENTRIES, getArrivingDescriptionByRoll, getRandomArrivingDescription } from '../data/d66Arriving';
import { generateName } from '../utils/generator';
import { Dices, Copy, Check, UserPlus, Skull, Sparkles, BookOpen } from 'lucide-react';

export const GMTools: React.FC = () => {
  const [newPCName, setNewPCName] = useState<string>('');
  const [oldPCName, setOldPCName] = useState<string>('');
  const [selectedRoll, setSelectedRoll] = useState<string>('random');
  const [currentResult, setCurrentResult] = useState<{ roll: string; title: string; text: string } | null>(() => 
    getRandomArrivingDescription('Новий Персонаж', 'Загиблий Побратим')
  );
  const [copied, setCopied] = useState<boolean>(false);

  const handleRoll = () => {
    let res;
    if (selectedRoll === 'random') {
      res = getRandomArrivingDescription(newPCName || 'Новий Персонаж', oldPCName || 'Загиблий Побратим');
    } else {
      res = getArrivingDescriptionByRoll(selectedRoll, newPCName || 'Новий Персонаж', oldPCName || 'Загиблий Побратим');
    }
    setCurrentResult(res);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!currentResult) return;
    const fullText = `[d66: ${currentResult.roll}] ${currentResult.title.toUpperCase()}\n${currentResult.text}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRandomizeNewName = () => {
    setNewPCName(generateName());
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-stone-900 border-2 border-yellow-500/40 p-4 sm:p-6 rounded-lg shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-3 border-b border-yellow-500/20 pb-3 mb-4">
          <BookOpen className="w-7 h-7 text-yellow-400" />
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wider text-yellow-400 font-serif">
              Інструментарій Ведучого (GM)
            </h1>
            <p className="text-xs text-stone-400 font-mono">
              Генератори подій, описи та таблиці для темних пригод у світі MÖRK BORG
            </p>
          </div>
        </div>

        {/* Section: d66 Arriving PC */}
        <div className="bg-stone-950/80 border border-stone-800 p-4 sm:p-5 rounded-md space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-bold text-yellow-300 font-serif flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              З'явлення Нового Персонажа (d66)
            </h2>
            <span className="text-xs font-mono px-2.5 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded">
              Таблиця d66
            </span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed font-sans">
            Коли попередній персонаж гине або до групи приєднується новий гравець, використайте цю таблицю для ефектної, зловісної чи химерної появи нового героя.
          </p>

          {/* Controls Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* New PC Name input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-stone-400 flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5 text-yellow-400" />
                Ім'я нового ПК:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPCName}
                  onChange={(e) => setNewPCName(e.target.value)}
                  placeholder="Наприклад: Галген"
                  className="flex-1 bg-stone-900 border border-stone-700 focus:border-yellow-500 rounded px-3 py-2 text-sm text-stone-100 placeholder-stone-600 focus:outline-none font-mono"
                />
                <button
                  onClick={handleRandomizeNewName}
                  title="Згенерувати ім'я"
                  className="bg-stone-800 hover:bg-stone-700 text-yellow-400 px-3 py-2 rounded border border-stone-700 text-xs font-mono transition-colors"
                >
                  Випадкове
                </button>
              </div>
            </div>

            {/* Old PC Name input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-stone-400 flex items-center gap-1.5">
                <Skull className="w-3.5 h-3.5 text-red-400" />
                Ім'я загиблого ПК:
              </label>
              <input
                type="text"
                value={oldPCName}
                onChange={(e) => setOldPCName(e.target.value)}
                placeholder="Наприклад: Загиблий побратим"
                className="w-full bg-stone-900 border border-stone-700 focus:border-yellow-500 rounded px-3 py-2 text-sm text-stone-100 placeholder-stone-600 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Roll selection & trigger */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-mono text-stone-400">Оберіть кидок або випадково:</label>
              <select
                value={selectedRoll}
                onChange={(e) => setSelectedRoll(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 text-stone-200 text-sm rounded px-3 py-2 focus:outline-none focus:border-yellow-500 font-mono"
              >
                <option value="random">🎲 Випадковий кидок d66</option>
                {Object.values(D66_ARRIVING_ENTRIES).map((entry) => (
                  <option key={entry.roll} value={entry.roll}>
                    d66 {entry.roll}: {entry.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:self-end">
              <button
                onClick={handleRoll}
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-stone-950 font-black px-6 py-2.5 rounded shadow-lg flex items-center justify-center gap-2 transition-all font-mono uppercase text-sm"
              >
                <Dices className="w-5 h-5" />
                Згенерувати Появу
              </button>
            </div>
          </div>

          {/* Result Box */}
          {currentResult && (
            <div className="mt-6 bg-stone-900 border-2 border-yellow-500/60 rounded-md p-5 relative space-y-3 shadow-2xl">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-500 text-stone-950 font-black font-mono px-2.5 py-0.5 rounded text-xs">
                    d66: {currentResult.roll}
                  </span>
                  <h3 className="text-lg font-black text-yellow-400 font-serif uppercase tracking-wide">
                    {currentResult.title}
                  </h3>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-mono bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 px-3 py-1.5 rounded transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      Скопійовано!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-yellow-400" />
                      Скопіювати
                    </>
                  )}
                </button>
              </div>

              <div className="text-stone-200 font-serif text-sm sm:text-base leading-relaxed whitespace-pre-line p-2 bg-stone-950/40 rounded border border-stone-800/60">
                {currentResult.text}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
