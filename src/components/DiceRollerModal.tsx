import React, { useState } from 'react';
import { roll } from '../utils/dice';
import confetti from 'canvas-confetti';
import { Dices, X } from 'lucide-react';

interface DiceRollerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RollLogItem {
  id: string;
  dice: string;
  rawRoll: number;
  modifier: number;
  total: number;
  drTarget?: number;
  isSuccess?: boolean;
  isCrit?: boolean;
  isFumble?: boolean;
  timestamp: string;
}

export const DiceRollerModal: React.FC<DiceRollerModalProps> = ({ isOpen, onClose }) => {
  const [selectedDice, setSelectedDice] = useState<number>(20);
  const [modifier, setModifier] = useState<number>(0);
  const [targetDr, setTargetDr] = useState<number>(12);
  const [history, setHistory] = useState<RollLogItem[]>([]);
  const [lastRoll, setLastRoll] = useState<RollLogItem | null>(null);

  if (!isOpen) return null;

  const handleRoll = () => {
    const raw = roll(selectedDice);
    const total = raw + modifier;
    const isCrit = selectedDice === 20 && raw === 20;
    const isFumble = selectedDice === 20 && raw === 1;
    const isSuccess = selectedDice === 20 ? total >= targetDr : true;

    if (isCrit) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    const newItem: RollLogItem = {
      id: `roll_${Date.now()}`,
      dice: `d${selectedDice}`,
      rawRoll: raw,
      modifier: modifier,
      total: total,
      drTarget: selectedDice === 20 ? targetDr : undefined,
      isSuccess,
      isCrit,
      isFumble,
      timestamp: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setLastRoll(newItem);
    setHistory((prev) => [newItem, ...prev.slice(0, 19)]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#121212] border-3 md:border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0px_#ff0055] w-full max-w-xl relative text-[#e0dfd5] max-h-[90vh] overflow-y-auto my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 bg-[#ff0055] text-white hover:bg-[#e0004c] border-2 border-black shadow-[2px_2px_0px_#000] min-h-[40px] min-w-[40px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 border-b-2 border-black pb-3 mb-4 pr-10">
          <div className="p-1.5 bg-[#fee715] text-black border-2 border-black font-black shrink-0">
            <Dices className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-heading font-black tracking-wider uppercase text-[#fee715]">
              Генератор Кубиків MÖRK BORG
            </h2>
            <p className="text-[10px] sm:text-xs font-mono text-gray-400">
              Стандартний тест складності: DR12
            </p>
          </div>
        </div>

        {/* Dice Selector */}
        <div className="space-y-4 mb-5">
          <div>
            <label className="text-xs font-heading font-bold uppercase text-gray-300 mb-1.5 block">
              Тип Кубика:
            </label>
            <div className="grid grid-cols-7 gap-1">
              {[4, 6, 8, 10, 12, 20, 100].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDice(d)}
                  className={`py-2 text-xs font-heading font-black border-2 border-black transition-all min-h-[40px] ${
                    selectedDice === d
                      ? 'bg-[#fee715] text-black shadow-[2px_2px_0px_#000]'
                      : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#252525]'
                  }`}
                >
                  d{d}
                </button>
              ))}
            </div>
          </div>

          {/* DR Target & Modifier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold uppercase text-gray-300 mb-1 block">
                Складність (DR):
              </label>
              <select
                value={targetDr}
                onChange={(e) => setTargetDr(Number(e.target.value))}
                className="w-full bg-[#1a1a1a] text-xs font-mono text-white p-2 border-2 border-black focus:outline-none min-h-[40px]"
              >
                <option value={8}>DR8 — Легко</option>
                <option value={10}>DR10 — Полегшено</option>
                <option value={12}>DR12 — Стандартно</option>
                <option value={14}>DR14 — Важко</option>
                <option value={16}>DR16 — Екстремально</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-heading font-bold uppercase text-gray-300 mb-1 block">
                Модифікатор:
              </label>
              <div className="grid grid-cols-7 gap-0.5">
                {[-3, -2, -1, 0, 1, 2, 3].map((m) => (
                  <button
                    key={m}
                    onClick={() => setModifier(m)}
                    className={`py-2 text-xs font-mono font-bold border border-black min-h-[40px] ${
                      modifier === m ? 'bg-[#ff0055] text-white' : 'bg-[#1a1a1a] text-gray-400'
                    }`}
                  >
                    {m >= 0 ? `+${m}` : m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Roll Button */}
          <button
            onClick={handleRoll}
            className="w-full py-3 bg-[#fee715] hover:bg-[#ffe000] text-black font-heading font-black text-base sm:text-lg uppercase border-3 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 min-h-[48px]"
          >
            <Dices className="w-5 h-5" />
            <span>Кинути d{selectedDice} {modifier !== 0 && (modifier >= 0 ? `+${modifier}` : modifier)}</span>
          </button>
        </div>

        {/* Display Last Roll Result */}
        {lastRoll && (
          <div className={`p-3.5 border-3 border-black shadow-[3px_3px_0px_#000] mb-5 text-center ${
            lastRoll.isCrit
              ? 'bg-[#fee715] text-black'
              : lastRoll.isFumble
              ? 'bg-red-950 text-white'
              : lastRoll.isSuccess
              ? 'bg-[#182818] text-emerald-200'
              : 'bg-[#281818] text-red-200'
          }`}>
            <div className="text-[10px] font-mono uppercase opacity-75">Результат ({lastRoll.dice})</div>
            <div className="text-3xl sm:text-4xl font-heading font-black my-1">
              {lastRoll.total}
            </div>
            <div className="text-xs font-mono">
              d{selectedDice}: {lastRoll.rawRoll} | Мод: {lastRoll.modifier >= 0 ? `+${lastRoll.modifier}` : lastRoll.modifier}
            </div>
            {lastRoll.isCrit && (
              <div className="text-xs sm:text-sm font-heading font-black uppercase text-black mt-1">
                ★ КРИТИЧНИЙ УСПІХ! (20) ★
              </div>
            )}
            {lastRoll.isFumble && (
              <div className="text-xs sm:text-sm font-heading font-black uppercase text-red-400 mt-1">
                ☠ КРИТИЧНА НЕВДАЧА! (1) ☠
              </div>
            )}
          </div>
        )}

        {/* History Log */}
        {history.length > 0 && (
          <div>
            <h4 className="text-xs font-heading font-bold uppercase text-gray-400 mb-1.5">Історія кидків</h4>
            <div className="max-h-28 overflow-y-auto space-y-1 pr-1 font-mono text-[10px] sm:text-[11px]">
              {history.map((h) => (
                <div key={h.id} className="p-1 bg-[#181818] border border-black flex items-center justify-between">
                  <span>{h.timestamp} — {h.dice} (кубик: {h.rawRoll}, мод: {h.modifier >= 0 ? `+${h.modifier}` : h.modifier})</span>
                  <span className="font-bold text-[#fee715]">= {h.total}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
