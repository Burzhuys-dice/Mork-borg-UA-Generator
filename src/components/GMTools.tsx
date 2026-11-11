import React, { useState } from 'react';
import { D66_ARRIVING_ENTRIES, getArrivingDescriptionByRoll, getRandomArrivingDescription } from '../data/d66Arriving';
import { OCCULT_TREASURES, TRAPS_AND_DEVILRY, CORPSE_PLUNDERING_ENTRIES, GMTblEntry } from '../data/gmTables';
import { generateName } from '../utils/generator';
import { Dices, Copy, Check, UserPlus, Skull, Sparkles, BookOpen, ShieldAlert, Coins } from 'lucide-react';

export const GMTools: React.FC = () => {
  // d66 Arriving State
  const [newPCName, setNewPCName] = useState<string>('');
  const [oldPCName, setOldPCName] = useState<string>('');
  const [selectedRoll, setSelectedRoll] = useState<string>('random');
  const [currentResult, setCurrentResult] = useState<{ roll: string; title: string; text: string } | null>(() => 
    getRandomArrivingDescription('Новий Персонаж', 'Загиблий Побратим')
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Occult Treasures State
  const [treasureResult, setTreasureResult] = useState<GMTblEntry | null>(null);

  // Traps State
  const [trapResult, setTrapResult] = useState<GMTblEntry | null>(null);

  // Corpse Plundering State
  const [corpseResult, setCorpseResult] = useState<GMTblEntry | null>(null);

  const handleRollArriving = () => {
    let res;
    if (selectedRoll === 'random') {
      res = getRandomArrivingDescription(newPCName || 'Новий Персонаж', oldPCName || 'Загиблий Побратим');
    } else {
      res = getArrivingDescriptionByRoll(selectedRoll, newPCName || 'Новий Персонаж', oldPCName || 'Загиблий Побратим');
    }
    setCurrentResult(res);
    setCopied(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRandomizeNewName = () => {
    setNewPCName(generateName());
  };

  // Roll Occult Treasures (d10)
  const handleRollTreasure = (rollVal?: string) => {
    if (rollVal) {
      const found = OCCULT_TREASURES.find(t => t.roll === rollVal);
      if (found) setTreasureResult(found);
    } else {
      const idx = Math.floor(Math.random() * OCCULT_TREASURES.length);
      setTreasureResult(OCCULT_TREASURES[idx]);
    }
  };

  // Roll Traps (d12)
  const handleRollTrap = (rollVal?: string) => {
    if (rollVal) {
      const found = TRAPS_AND_DEVILRY.find(t => t.roll === rollVal);
      if (found) setTrapResult(found);
    } else {
      const idx = Math.floor(Math.random() * TRAPS_AND_DEVILRY.length);
      setTrapResult(TRAPS_AND_DEVILRY[idx]);
    }
  };

  // Roll Corpse Plundering (d66)
  const handleRollCorpse = (rollKey?: string) => {
    const keys = Object.keys(CORPSE_PLUNDERING_ENTRIES);
    const key = rollKey || keys[Math.floor(Math.random() * keys.length)];
    const entry = CORPSE_PLUNDERING_ENTRIES[key] || CORPSE_PLUNDERING_ENTRIES['11'];
    // If silver result (61-66), add random silver value
    if (key.startsWith('6')) {
      const silverAmount = Math.floor(Math.random() * 6 + 1) * 10;
      setCorpseResult({
        roll: entry.roll,
        title: `${entry.title} (${silverAmount}с)`,
        description: `Знайдено ${silverAmount} срібних монет у кишенях загиблого.`
      });
    } else {
      setCorpseResult(entry);
    }
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
              Офіційні генератори та таблиці з книги правил MÖRK BORG (Bare Bones Edition)
            </p>
          </div>
        </div>

        {/* 1. Section: d66 Arriving PC */}
        <div className="bg-stone-950/80 border border-stone-800 p-4 sm:p-5 rounded-md space-y-4 mb-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
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
                onClick={handleRollArriving}
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-stone-950 font-black px-6 py-2.5 rounded shadow-lg flex items-center justify-center gap-2 transition-all font-mono uppercase text-sm"
              >
                <Dices className="w-5 h-5" />
                Згенерувати Появу
              </button>
            </div>
          </div>

          {currentResult && (
            <div className="mt-4 bg-stone-900 border-2 border-yellow-500/60 rounded-md p-4 relative space-y-2 shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-500 text-stone-950 font-black font-mono px-2 py-0.5 rounded text-xs">
                    d66: {currentResult.roll}
                  </span>
                  <h3 className="text-base font-black text-yellow-400 font-serif uppercase tracking-wide">
                    {currentResult.title}
                  </h3>
                </div>

                <button
                  onClick={() => handleCopy(`[d66: ${currentResult.roll}] ${currentResult.title.toUpperCase()}\n${currentResult.text}`)}
                  className="flex items-center gap-1 text-xs font-mono bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 px-2.5 py-1 rounded transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-yellow-400" />}
                  <span>{copied ? 'Скопійовано!' : 'Копіювати'}</span>
                </button>
              </div>

              <div className="text-stone-200 font-serif text-sm leading-relaxed p-2 bg-stone-950/40 rounded border border-stone-800/60">
                {currentResult.text}
              </div>
            </div>
          )}
        </div>

        {/* 2. Section: Occult Treasures (d10) */}
        <div className="bg-stone-950/80 border border-stone-800 p-4 sm:p-5 rounded-md space-y-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-bold text-purple-300 font-serif flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Окультні Скарби (Occult Treasures — d10)
            </h2>
            <button
              onClick={() => handleRollTreasure()}
              className="bg-purple-700 hover:bg-purple-600 text-white font-black px-4 py-1.5 rounded shadow flex items-center gap-1.5 font-mono uppercase text-xs"
            >
              <Dices className="w-4 h-4" /> Кинути d10
            </button>
          </div>
          <p className="text-xs text-stone-300">
            Унікальні містичні артефакти з дивними та небезпечними властивостями.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1">
            {OCCULT_TREASURES.map((t) => (
              <button
                key={t.roll}
                onClick={() => handleRollTreasure(t.roll)}
                className={`p-2 text-left border rounded text-xs font-mono transition-all ${
                  treasureResult?.roll === t.roll
                    ? 'bg-purple-950 border-purple-400 text-purple-200 font-bold'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                }`}
              >
                d10: {t.roll} — {t.title}
              </button>
            ))}
          </div>

          {treasureResult && (
            <div className="mt-3 bg-stone-900 border border-purple-500/50 rounded p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono bg-purple-900 text-purple-200 px-2 py-0.5 rounded">
                  d10: {treasureResult.roll}
                </span>
                <span className="text-sm font-bold text-purple-300 uppercase font-serif">
                  {treasureResult.title}
                </span>
              </div>
              <p className="text-xs font-serif text-stone-200 leading-relaxed">
                {treasureResult.description}
              </p>
            </div>
          )}
        </div>

        {/* 3. Section: Traps and Devilry (d12) */}
        <div className="bg-stone-950/80 border border-stone-800 p-4 sm:p-5 rounded-md space-y-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-bold text-red-400 font-serif flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              Пастки та Підступність (Traps and Devilry — d12)
            </h2>
            <button
              onClick={() => handleRollTrap()}
              className="bg-red-800 hover:bg-red-700 text-white font-black px-4 py-1.5 rounded shadow flex items-center gap-1.5 font-mono uppercase text-xs"
            >
              <Dices className="w-4 h-4" /> Кинути d12
            </button>
          </div>
          <p className="text-xs text-stone-300">
            Смертельні пастки у темних коридорах та підземеллях.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-1.5 pt-1">
            {TRAPS_AND_DEVILRY.map((tr) => (
              <button
                key={tr.roll}
                onClick={() => handleRollTrap(tr.roll)}
                className={`p-2 text-left border rounded text-xs font-mono transition-all ${
                  trapResult?.roll === tr.roll
                    ? 'bg-red-950 border-red-500 text-red-200 font-bold'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                }`}
              >
                d12: {tr.roll} — {tr.title}
              </button>
            ))}
          </div>

          {trapResult && (
            <div className="mt-3 bg-stone-900 border border-red-500/50 rounded p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono bg-red-900 text-red-200 px-2 py-0.5 rounded">
                  d12: {trapResult.roll}
                </span>
                <span className="text-sm font-bold text-red-400 uppercase font-serif">
                  {trapResult.title}
                </span>
              </div>
              <p className="text-xs font-serif text-stone-200 leading-relaxed">
                {trapResult.description}
              </p>
            </div>
          )}
        </div>

        {/* 4. Section: Corpse Plundering (d66) */}
        <div className="bg-stone-950/80 border border-stone-800 p-4 sm:p-5 rounded-md space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-bold text-amber-300 font-serif flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" />
              Мародерство Трупів (Corpse Plundering — d66)
            </h2>
            <button
              onClick={() => handleRollCorpse()}
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-black px-4 py-1.5 rounded shadow flex items-center gap-1.5 font-mono uppercase text-xs"
            >
              <Dices className="w-4 h-4" /> Кинути d66
            </button>
          </div>
          <p className="text-xs text-stone-300">
            Що вдається знайти в кишенях і речах мертвих мешканців цього світу.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <select
              onChange={(e) => handleRollCorpse(e.target.value)}
              defaultValue=""
              className="w-full bg-stone-900 border border-stone-700 text-stone-200 text-sm rounded px-3 py-2 focus:outline-none focus:border-amber-500 font-mono"
            >
              <option value="" disabled>Оберіть результат d66 або натисніть кнопку зверху</option>
              {Object.values(CORPSE_PLUNDERING_ENTRIES).filter((v, i, arr) => arr.findIndex(x => x.roll === v.roll) === i).map((entry) => (
                <option key={entry.roll} value={entry.roll.replace(/–.+/, '')}>
                  d66 {entry.roll}: {entry.title}
                </option>
              ))}
            </select>
          </div>

          {corpseResult && (
            <div className="mt-3 bg-stone-900 border border-amber-500/50 rounded p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono bg-amber-900/80 text-amber-200 px-2 py-0.5 rounded">
                  d66: {corpseResult.roll}
                </span>
                <span className="text-sm font-bold text-amber-300 uppercase font-serif">
                  {corpseResult.title}
                </span>
              </div>
              <p className="text-xs font-serif text-stone-200 leading-relaxed">
                {corpseResult.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
