import React from 'react';
import { BookOpen, Shield, Swords, Sparkles, Skull, Heart, Backpack, Zap } from 'lucide-react';

export const RulesReferenceModal: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#121212] border-3 border-black p-4 md:p-5 shadow-[4px_4px_0px_#000]">
        <div className="flex items-center gap-3 border-b-2 border-black pb-3 mb-2">
          <div className="p-2 bg-[#fee715] text-black font-black border-2 border-black">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg md:text-2xl font-heading font-black tracking-wider uppercase text-[#fee715]">
              Правила MÖRK BORG (Bare Bones Edition)
            </h2>
            <p className="text-xs font-mono text-gray-400">
              Повний визвірений довідник правил для гравця та GM
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Rules Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* 1. Core Mechanics & DR */}
        <div className="bg-[#121212] border-3 border-black p-4 md:p-5 shadow-[4px_4px_0px_#000]">
          <h3 className="text-sm md:text-base font-heading font-black uppercase text-[#fee715] mb-3 flex items-center gap-2 border-b border-gray-800 pb-2">
            <Sparkles className="w-4 h-4 text-[#fee715]" />
            <span>Перевірки & Складність (DR)</span>
          </h3>
          <div className="space-y-2 text-xs font-mono text-gray-300">
            <p>
              Всі перевірки робить <strong className="text-white">гравець</strong>. Кидається <strong className="text-[#fee715]">d20 ± Модифікатор характеристики</strong> проти складності (DR). Потворам характеристики не додаються.
            </p>
            <ul className="space-y-1 bg-[#1a1a1a] p-3 border border-black text-[11px]">
              <li><strong className="text-emerald-400">DR 6:</strong> Неймовірно легко (люди сміються з провалу)</li>
              <li><strong className="text-emerald-300">DR 8:</strong> Рутинно (є незначний шанс невдачі)</li>
              <li><strong className="text-blue-400">DR 10:</strong> Доволі просто (наприклад, атака із засідки)</li>
              <li><strong className="text-[#fee715]">DR 12:</strong> Стандарт (звичайна атака, захист, тест)</li>
              <li><strong className="text-amber-400">DR 14:</strong> Важко (виявити капкан, втриматись на скелі)</li>
              <li><strong className="text-red-400">DR 16:</strong> Дуже важко (справжнє випробування)</li>
              <li><strong className="text-red-600">DR 18:</strong> Майже неможливо</li>
            </ul>
          </div>
        </div>

        {/* 2. Combat Rules & Crits/Fumbles */}
        <div className="bg-[#121212] border-3 border-black p-4 md:p-5 shadow-[4px_4px_0px_#000]">
          <h3 className="text-sm md:text-base font-heading font-black uppercase text-[#ff0055] mb-3 flex items-center gap-2 border-b border-gray-800 pb-2">
            <Swords className="w-4 h-4 text-[#ff0055]" />
            <span>Бой, Критичні Влучання та Провали</span>
          </h3>
          <div className="space-y-2 text-xs font-mono text-gray-300">
            <p><strong className="text-white">Ініціатива (d6):</strong> 1-3 — вороги перші; 4-6 — гравці перші. (Або Спритність + d6 для індивідуальної).</p>
            <p><strong className="text-white">Ближній бій:</strong> Тест Сили DR12.</p>
            <p><strong className="text-white">Дальній бій:</strong> Тест Присутності DR12.</p>
            <p><strong className="text-white">Захист (Ухилення):</strong> Тест Спритності DR12. При невдачі ворог завдає шкоду.</p>
            <div className="bg-[#1a1a1a] p-3 border border-black space-y-1 text-[11px] mt-2">
              <div><strong className="text-[#fee715]">КРИТ (20 на d20):</strong> Атака: подвійна шкода + зниження броні цілі на 1 рівень. Захист: гравець отримує вільну контратаку!</div>
              <div><strong className="text-[#ff0055]">ПРОВАЛ (1 на d20):</strong> Атака: зброя ламається чи губиться. Захист: гравець отримує подвійну шкоду, а броня знижується на 1 рівень!</div>
            </div>
          </div>
        </div>

        {/* 3. Carrying Capacity & Overburden */}
        <div className="bg-[#121212] border-3 border-black p-4 md:p-5 shadow-[4px_4px_0px_#000]">
          <h3 className="text-sm md:text-base font-heading font-black uppercase text-amber-300 mb-3 flex items-center gap-2 border-b border-gray-800 pb-2">
            <Backpack className="w-4 h-4 text-amber-300" />
            <span>Місткість (Carrying Capacity)</span>
          </h3>
          <div className="space-y-2 text-xs font-mono text-gray-300">
            <p>
              Без штрафу можна переносити <strong className="text-white">Сила + 8</strong> звичайних предметів.
            </p>
            <p>
              При перевищенні цієї кількості складність (DR) усіх тестів <strong className="text-amber-400">Сили та Спритності зростає на +2</strong> (наприклад, з DR12 до DR14).
            </p>
            <p className="text-red-400">
              Неможливо переносити більше ніж <strong className="text-white">2 × (Сила + 8)</strong> предметів.
            </p>
          </div>
        </div>

        {/* 4. Powers & Scrolls */}
        <div className="bg-[#121212] border-3 border-black p-4 md:p-5 shadow-[4px_4px_0px_#000]">
          <h3 className="text-sm md:text-base font-heading font-black uppercase text-purple-400 mb-3 flex items-center gap-2 border-b border-gray-800 pb-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>Магія та Сувої (Powers)</span>
          </h3>
          <div className="space-y-2 text-xs font-mono text-gray-300">
            <p><strong className="text-white">Використання в день:</strong> Щоранку кидається <strong className="text-purple-300">Присутність + d4</strong> — це загальна кількість використання магії на день.</p>
            <p><strong className="text-white">Тест магії:</strong> Тест Присутності DR12.</p>
            <p className="text-red-300">
              При ПРОВАЛІ: Сила не спрацьовує, гравець втрачає d2 HP та отримує запаморочення на 1 годину (в цей час магія завжди фейлиться найгіршим чином або кидається по таблиці Аркана Катастрофа d20).
            </p>
            <p className="text-gray-400 italic text-[11px]">
              Примітка: Магія не працює у середній/важкій броні або з дворучною зброєю!
            </p>
          </div>
        </div>

        {/* 5. Omens */}
        <div className="bg-[#121212] border-3 border-black p-4 md:p-5 shadow-[4px_4px_0px_#000]">
          <h3 className="text-sm md:text-base font-heading font-black uppercase text-[#fee715] mb-3 flex items-center gap-2 border-b border-gray-800 pb-2">
            <Sparkles className="w-4 h-4 text-[#fee715]" />
            <span>Знамення (Omens)</span>
          </h3>
          <div className="space-y-2 text-xs font-mono text-gray-300">
            <p>Відновлюються після 6 годин відпочинку. Витрачаються на:</p>
            <ul className="list-disc pl-4 space-y-1 bg-[#1a1a1a] p-3 border border-black text-[11px]">
              <li>Завдання максимальної шкоди своєю атакою.</li>
              <li>Повний перекид будь-якого кубика (свого чи чужого).</li>
              <li>Зменшення отриманої шкоди на d6.</li>
              <li>Нейтралізацію критичної невдачі чи критичного влучання.</li>
              <li>Зниження DR одного тесту на -4.</li>
            </ul>
          </div>
        </div>

        {/* 6. Broken & Death */}
        <div className="bg-[#121212] border-3 border-black p-4 md:p-5 shadow-[4px_4px_0px_#000]">
          <h3 className="text-sm md:text-base font-heading font-black uppercase text-red-500 mb-3 flex items-center gap-2 border-b border-gray-800 pb-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span>0 HP: Зламане Тіло (Broken d4)</span>
          </h3>
          <div className="space-y-2 text-xs font-mono text-gray-300">
            <p>При 0 HP кидається <strong className="text-white">d4</strong>:</p>
            <ol className="list-decimal pl-4 space-y-1 bg-[#1a1a1a] p-3 border border-black text-[11px]">
              <li><strong className="text-blue-300">1: Непритомність</strong> на d4 раундів, опритомнює з d4 HP.</li>
              <li><strong className="text-amber-400">2: Каліка.</strong> (1-5 зламано кінцівку, 6 втрачено око). Не здатен діяти d4 раундів, далі active з d4 HP.</li>
              <li><strong className="text-red-400">3: Крововилив!</strong> Смерть за d2 години (тести DR16 1-шу годину, DR18 далі).</li>
              <li><strong className="text-red-600 font-bold">4: МЕРТВИЙ.</strong></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
