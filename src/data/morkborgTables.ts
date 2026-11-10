import { CharacterClassId, ScrollItem, EquipmentItem } from '../types/morkborg';

export interface ClassDefinition {
  id: CharacterClassId;
  name: string;
  nameUk: string;
  title: string;
  description: string;
  hpDie: number;
  omensDie: number;
  silverMultiplier: number;
  silverDiceCount: number;
  silverDiceSides: number;
  
  // Ability Modifiers applied to 3d6
  strBonus: number;
  agiBonus: number;
  preBonus: number;
  touBonus: number;

  weaponDie: number; // d4, d6, d8, d10
  armorDie: number;  // d2, d3, d4

  abilityName: string;
  abilityDescription: string;

  origins: string[];
  uniqueStarters: { name: string; description: string }[];
}

export const CLASSES_DATA: Record<CharacterClassId, ClassDefinition> = {
  fanged_deserter: {
    id: 'fanged_deserter',
    name: 'Fanged Deserter',
    nameUk: 'Ікластий дезертир',
    title: 'Дикий втікач з усіх армій світу з небезпечними зубами',
    description: 'Має близько тридцяти вірних друзів, які ніколи не зраджували: власні гострі зуби. Дикий, неконтрольований втікач з усіх армій.',
    hpDie: 10,
    omensDie: 2,
    silverMultiplier: 10,
    silverDiceCount: 2,
    silverDiceSides: 6,
    strBonus: 2,
    agiBonus: -1,
    preBonus: -1,
    touBonus: 0,
    weaponDie: 10,
    armorDie: 4,
    abilityName: 'Атака іклами (Bite Attack)',
    abilityDescription: 'DR10 на атаку впритул, d6 шкоди. При результаті 1–2 на d6 супротивник робить вільну контратаку. Неграмотний: нездатний читати сувої (якщо починає з сувоєм — перекидає, з\'їдає або використовує як підтирку). Звичайні тести Спритності мають DR14 замість DR12 (окрім захисту в бою).',
    origins: [
      'Згарище будівлі в Саркаші. Твій рідний дім?',
      'Гнилий корабель, що безкінечно хитався сірим морем.',
      'Бордель у Шлезвігу. Доволі привітне місце.',
      'Ночівля з собаками в кутку шинку в очікуванні, що хтось повернеться.',
      'Обоз армії у східному Вестланді (Wästland).',
      'Вигодуваний вовчицею в диких нетрях Берген Хріпт (Bergen Chrypt).'
    ],
    uniqueStarters: [
      { name: 'Пом\'ята маска чудовиська (Monster Mask)', description: 'Вселяє первісний страх у дрібних істот (гобліни, діти, ґноми) — вони щораунду перевіряють Мораль.' },
      { name: 'Бурий ятаган Ґальґенбека (Brown Scimitar of Galgenbeck)', description: 'd6 шкоди. Витягнутий з вигрібної ями гарнізону. DR10 на атаку й захист. 1 з 6 шанс, що поранений ворог гине від сепсису за 10 хвилин.' },
      { name: 'Зуби чаклуна (Wizard Teeth)', description: '4 зуби в мішечку. Перед боєм кинь d6 за кожен. Кожна «6» дає одній твоїй атаці максимальну шкоду.' },
      { name: 'Праща старого Сіґюрда (Old Sigürd\'s Sling)', description: 'Плетена з його сивого волосся. Завдає 2d4 шкоди, вимагає каміння розміром з кулак.' },
      { name: 'Древній гончак-м\'ясник (Ancient Gore-hound)', description: 'Хрипкий, недоумкуватий пес (10 HP, атака DR10 укус d6, захист DR12). Чує скарби в найогиднішому смітті. Шаленіє від гоблінів та берсерків.' },
      { name: 'Підкова коня Смерті (Shoe of Death\'s Horse)', description: 'При атаці DR10, d4 шкоди. 1 з 6 шанс миттєво розтрощити череп істоті малого або середнього розміру. Повертається в руку, як бумеранг.' }
    ]
  },
  gutterborn_scum: {
    id: 'gutterborn_scum',
    name: 'Gutterborn Scum',
    nameUk: 'Поріддя нетрів',
    title: 'Злодій, дитя багнюки та криміналу',
    description: 'Народжений під лихою зіркою, вихований багнюкою і криміналом. Бритва та безмісячна ніч варті цілого тижня рабської праці.',
    hpDie: 6,
    omensDie: 2,
    silverMultiplier: 10,
    silverDiceCount: 1,
    silverDiceSides: 6,
    strBonus: -2,
    agiBonus: 0,
    preBonus: 0,
    touBonus: 0,
    weaponDie: 6,
    armorDie: 2,
    abilityName: 'Природна непомітність (Stealthy)',
    abilityDescription: 'Усі перевірки Спритності та Присутності мають полегшену складність — знижені на 2 (базовий DR10 замість DR12). Кидає d6 на таблиці зброї та d2 на таблиці броні.',
    origins: [
      'Викинений у віз із гноєм ще в плодовому міхурі.',
      'Матір повісили під стінами Ґальґенбека; ти випав уже з її мертвого тіла.',
      'Вигодуваний щурами в стічних ровах Ґріфта.',
      'Побитий під столом пекаря в Шлезвігу.',
      'Утік із твеландського сиротинця.',
      'Навчений грабіжниками в халупі на південь від Алліанса.'
    ],
    uniqueStarters: [
      { name: 'Підлий випад (Coward\'s Jab)', description: 'Атака із засідки/зненацька — тест Спритності DR10. У разі успіху автоматичне влучання легкою одноручною зброєю з бонусом +3 до шкоди.' },
      { name: 'Мерзенний щипач (Filthy Fingersmith)', description: 'Обкрадає кишені та зламує замки тестом Спритності DR8. Починає з відмичками.' },
      { name: 'Огидний плювок (Abominable Gob Lobber)', description: 'В\'язке мокротиння на короткій дистанції (d2 рази за бій). Тест Присутності DR8. Цілі сліпнуть і блюють d4 раунди. Усі свідки мають пройти перевірку Витривалості, щоб не знудитися.' },
      { name: 'Втеча від долі (Escaping Fate)', description: 'Кожного разу при використанні Знамення є 50% шанс, що воно не витратиться.' },
      { name: 'Вигрібна скритність (Excretal Stealth)', description: 'Здатність ховатися в помиях і фекаліях так, що для виявлення потрібен тест Присутності DR16.' },
      { name: 'Обман смерті (Dodging Death)', description: 'При смерті є 50% шанс вижити. За 10 раундів підводиться з d4 HP і абсурдним поясненням порятунку.' }
    ]
  },
  esoteric_hermit: {
    id: 'esoteric_hermit',
    name: 'Esoteric Hermit',
    nameUk: 'Езотеричний самітник',
    title: 'Хранитель заборонених знань та сувоїв',
    description: 'Камінь печери був єдиним зі зорями. Тепер хаос вмираючого світу дратує і порушує ритуали самотності.',
    hpDie: 4,
    omensDie: 4,
    silverMultiplier: 10,
    silverDiceCount: 1,
    silverDiceSides: 6,
    strBonus: -2,
    agiBonus: 0,
    preBonus: 2,
    touBonus: 0,
    weaponDie: 4,
    armorDie: 2,
    abilityName: 'Майстерність сувоїв (Wise)',
    abilityDescription: 'Починає з одним випадковим сувоєм (священним або нечистим). Має d4 Знамень. Присутність 3d6+2, Сила 3d6-2. Зброя d4, броня d2.',
    origins: [
      'Прокинувся дорослим у ритуальному колі під північним мостом Ґріфта.',
      'Вийшов без пам\'яті з печери на скелях Теріону.',
      'Єдина дитина, що вижила після інциденту в Долині Нещасних Мерців.',
      'Помираючи від чуми в нетрях Берген Хріпт, торкнувся «чогось ззовні».',
      'Був звичайною людиною, доки не зустрів щось на галявині в Саркаші.',
      'Виріс на самотньому острові озера Онда, про який ніхто не чув і куди немає вороття.'
    ],
    uniqueStarters: [
      { name: 'Володар долі (Master of Fate)', description: 'Пізнання причинності. Тест Присутності DR8 відкриває правильний шлях.' },
      { name: 'Книга киплячої крові (Book of Boiling Blood)', description: 'Раз на день ворог має пройти перевірку DR12, інакше виринають d2 берсерки-вбивці. На 1–4 вони б\'ються за тебе, на 5–6 нападають на тебе.' },
      { name: 'Мовець істин (Speaker of Truths)', description: 'Двічі на день знижує DR наступного тесту обраної істоти на 4.' },
      { name: 'Адепт Невидимого Коледжу (Initiate of the Invisible College)', description: 'Раз на день прикликає d2 сувої (на 1-2 священні, на 3-4 нечисті; зникають на світанку).' },
      { name: 'Бард Невмирущих (Bard of the Undying)', description: 'Гра на арфі дає +d4 до кидків реакції ворогів/NPC.' },
      { name: 'Бойовий яструб (Hawk as Weapon)', description: 'Вірний птах-розвідник (8 HP, атака/захист DR10, пазурі d4).' }
    ]
  },
  wretched_royalty: {
    id: 'wretched_royalty',
    name: 'Wretched Royalty',
    nameUk: 'Злиденна шляхта',
    title: 'Зламаний аристократ зі спадком та багатством',
    description: 'Зламаний спогадами про минулу велич, гордий аристократ, змушений вештатися багнюкою серед плебеїв.',
    hpDie: 6,
    omensDie: 2,
    silverMultiplier: 10,
    silverDiceCount: 4,
    silverDiceSides: 6,
    strBonus: 0,
    agiBonus: 0,
    preBonus: 0,
    touBonus: 0,
    weaponDie: 8,
    armorDie: 4,
    abilityName: 'Шляхетний посаг (Painfully Average)',
    abilityDescription: 'Починає з великим статком (4d6×10 срібла) та отриманням ДВОХ унікальних предметів зі шляхетської спадщини. Зброя d8, броня d4 (перекидає важку броню, якщо випадає).',
    origins: [
      'Палац у Вестланді перетворено на руїни.',
      'Караванне королівство в Твеланді скотилося в злидні.',
      'Дядько (король Фахму IX) убив твого батька Зіґмунда.',
      'Південна імперія Зюдґланс пішла на дно моря.',
      'Кривава графиня Антелія зажадала заручника благородної крові.',
      'Двоє юних принців зникли в чорній розколині східних схилів.'
    ],
    uniqueStarters: [
      { name: 'Клинок предків (Blade of Your Ancestors)', description: 'Магічний балакучий меч (атака/захист DR10, d6+1 шкоди). При невдачах має шанс 1 з 6 вдарити власника чи союзника.' },
      { name: 'Блазень Полтрон (\'Poltroon\' Court Jester)', description: 'Жалюгідний скиглій. Його кривляння відволікають ворогів: у перші два раунди бою персонаж та союзники мають +2 до атаки й захисту.' },
      { name: 'Неймовірний кінь Барбарістер (Barbarister the Incredible Horse)', description: 'Балакучий, пихатий кінь. Часом дає +2 до перевірок Присутності на логіку та інтелект.' },
      { name: 'Зброєносець Гамфунд (Hamfund the Squire)', description: 'Боягуз, що носить проклятий меч Еврика (2d6 шкоди). Щоразу при помаху мечем кинь d6: при «1» зброєносець гине, а меч зникає назавжди.' },
      { name: 'Зміїний дарунок (Snake-skin Gift)', description: 'Сандалова шкатулка з кинджалом (d4). При викиданні «1» на шкоду жертва миттєво помирає від смертоносної отрути.' },
      { name: 'Ріг володарів Шлезвіга (Horn of Schleswig Lords)', description: 'Раз на день сурмить (Присутність DR12). Дає обраній істоті автоматичний успіх на наступний небойовий тест.' }
    ]
  },
  heretical_priest: {
    id: 'heretical_priest',
    name: 'Heretical Priest',
    nameUk: 'Єретичний жрець',
    title: 'Вигнанець Двоголового Василіска',
    description: 'Вигнанець, якого переслідує інквізиція Двоголового Василіска. Блукає руїнами й паплюжить собори ночами.',
    hpDie: 8,
    omensDie: 4,
    silverMultiplier: 10,
    silverDiceCount: 3,
    silverDiceSides: 6,
    strBonus: -2,
    agiBonus: 0,
    preBonus: 2,
    touBonus: 0,
    weaponDie: 8,
    armorDie: 3, // Light or medium armor
    abilityName: 'Єретичне благословення (Insightful)',
    abilityDescription: 'Присутність 3d6+2, Сила 3d6-2. Зброя d8. Може використовувати сувої й сили, носячи СЕРЕДНЮ броню.',
    origins: [
      'Ґальґенбек, підніжжя собору Двоголових Василісків.',
      'Єдиний вцілілий після різанини в культі Алліанса.',
      'Катакомби Ґріфта.',
      'Руїни храму в Долині Нещасних Мерців.',
      'Злодійські тунелі Ґравен-Тоска.',
      'Таємна церква в надрах Берген Хріпт.'
    ],
    uniqueStarters: [
      { name: 'Посох священного пастиря (Sacred Shepherd\'s Crook)', description: 'Гак з людської кістки (2d4 шкоди всім, окрім людей, що втратили віру).' },
      { name: 'Крадена митра (Stolen Mitre)', description: 'Захист DR10 у бою. За межами бою непомітність перевіряється з DR8.' },
      { name: 'Сувій гріхів (List of Sins)', description: 'Присутність DR10 виявляє невидиме зло. Захист +2 проти викритих істот.' },
      { name: 'Богохульна біблія Нехрубеля (Blasphemous Nechrubel Bible)', description: 'Читається раз на день. Парний результат: всі ПК лікують d4 HP за 5 хв відпочинку. Непарний: демонічні галюцинації у жерця до світанку.' },
      { name: 'Камені з загубленого храму Тель-Емас (Stones from Thel-Emas)', description: 'Кидок камінців виявляє небезпеку в сусідній кімнаті (Присутність DR10).' },
      { name: 'Розп\'яття «Не того Ісуса» ((Wrong Jesus) Crucifix)', description: 'Відлякує нежить, тролів і гоблінів (перевірка їхньої Моралі з модифікатором Присутності жерця).' }
    ]
  },
  occult_herbmaster: {
    id: 'occult_herbmaster',
    name: 'Occult Herbmaster',
    nameUk: 'Окультний травник',
    title: 'Зіллявар та виращувач отруйних грибниць',
    description: 'Народжений з грибниці, зрощений на лісовій галявині під поглядом місяця в чорній воді.',
    hpDie: 6,
    omensDie: 2,
    silverMultiplier: 10,
    silverDiceCount: 2,
    silverDiceSides: 6,
    strBonus: -2,
    agiBonus: 0,
    preBonus: 0,
    touBonus: 2,
    weaponDie: 6,
    armorDie: 2,
    abilityName: 'Портативна лабораторія (Tough as Wood)',
    abilityDescription: 'Витривалість 3d6+2, Сила 3d6-2. Зброя d6, броня d2. Носить лабораторію та створює щодня 2 випадкові відвари (d4 доз загалом, зникають через 24 години).',
    origins: [
      'Спокійна ізоляція в темряві хащ Саркашу.',
      'Опівнічні чорні ринки Шлезвіга.',
      'Єретичний острів Крелют біля Ґріфта.',
      'Крижані руїни поблизу Алліанса.',
      'Хатинка відьми в Ґальґенбеку.',
      'Руїни маєтку Тіньового Короля.'
    ],
    uniqueStarters: [
      { name: 'Червона отрута', description: 'Витривалість DR12 або -d10 HP.' },
      { name: 'Пара Езуміеля', description: 'Тест DR14 або важкі галюцинації на d4 години.' },
      { name: 'Юшка з південної жаби', description: 'Невпинна блювота на d4 години (тест DR14, щоб зробити хоч щось).' },
      { name: 'Життєдайний еліксир', description: 'Лікує d6 HP, зупиняє інфекцію.' },
      { name: 'Суп із павука-сови', description: 'Бачення в темряві та лазіння по стінах на 30 хвилин.' },
      { name: 'Олива Фернора', description: 'Капається в око. Знімає інфекцію, +2 до тестів Присутності на d4 години.' },
      { name: 'Бадьорий тютюн Гіпфоса', description: 'Лють! 2 атаки за раунд, але захист DR14 на один бій.' },
      { name: 'Чорна отрута', description: 'Витривалість DR14 або -d6 HP і сліпота на одну годину.' }
    ]
  },
  classless_drifter: {
    id: 'classless_drifter',
    name: 'Classless Drifter',
    nameUk: 'Безкласовий волоцюга',
    title: 'Звичайний вигнанець без професії та привілеїв',
    description: 'Жодного спеціального вишколу чи шляхетської крові. Лише гола жага вижити в умираючому світі.',
    hpDie: 8,
    omensDie: 2,
    silverMultiplier: 10,
    silverDiceCount: 2,
    silverDiceSides: 6,
    strBonus: 0,
    agiBonus: 0,
    preBonus: 0,
    touBonus: 0,
    weaponDie: 10,
    armorDie: 4,
    abilityName: 'Гнучкість виживання',
    abilityDescription: 'Для двох характеристик на вибір кидається 4d6 з відкиданням найменшого результату. 2d6x10s срібла, d2 Знамень, HP: Витривалість + d8.',
    origins: [
      'Утік з безнадійної ферми, де вимерла вся худоба.',
      'Сирота, що виросла на дорогах між Ґальґенбеком та Шлезвігом.',
      'Колишній каторжник, що втік під час чумного бунту.',
      'Забутий сторож зруйнованої вежі на межі Саркашу.',
      'Торговець, що втратив усе через напад гоблінів.',
      'Вигнанчик з невідомого селища, яке згоріло вночі.'
    ],
    uniqueStarters: [
      { name: 'Старий щасливий кулон', description: 'Дозволяє один раз за гру повністю перекинути клятий невдалий результат.' },
      { name: 'Саморобна мапа казематів', description: 'Показує таємний хід у найближчі підземелля.' },
      { name: 'Заіржавілий замок з ключем', description: 'Важкий та надійний замок для блокування дверей.' },
      { name: 'Точильний камінь', description: 'Дає +1 до шкоди на перший удар ближнього бою після відпочинку.' },
      { name: 'Жменя кісток мерців', description: 'Амулет, що дає підказку від духів при кидку Присутності DR12.' },
      { name: 'Мішечок із сіллю та сажею', description: 'Захищає від дрібних духів та примар при розсипанні.' }
    ]
  }
};

// Transport & Carrying capacity (d6) - Bare Bones Page 21
export const CARRYING_CONTAINERS = [
  { roll: [1, 2], name: 'Нічого (перенесення в руках)', capacityBonus: 0, description: 'Перенесення в руках та кишенях. Макс. предметів: Сила + 8.' },
  { roll: [3], name: 'Рюкзак (Backpack)', capacityBonus: 7, description: 'Містить до 7 додаткових предметів.' },
  { roll: [4], name: 'Мішок (Sack)', capacityBonus: 10, description: 'Містить до 10 додаткових предметів.' },
  { roll: [5], name: 'Малий візок (Small Wagon)', capacityBonus: 15, description: 'Вміщує до 15 додаткових предметів (або замініть на рюкзак/мішок).' },
  { roll: [6], name: 'Віслюк (Donkey)', capacityBonus: 20, description: 'Вперта тварина. Вміщує до 20 додаткових предметів.' }
];

// Small gear Table 1 (d12) - Bare Bones Page 22
export const GEAR_TABLE_1: { name: string; description: string; slots: number }[] = [
  { name: 'Мотузка (Rope, 30 ft)', description: '30 футів (9 м) міцної мотузки.', slots: 1 },
  { name: 'Смолоскипи (Torches)', description: 'Присутність + 4 смолоскипи (мінемум 1). Освітлюють темряву.', slots: 1 },
  { name: 'Ліхтар з оливою (Lantern & Oil)', description: 'Запас оливи на Присутність + 6 годин (мінемум 1 год).', slots: 1 },
  { name: 'Магнієва стрічка (Magnesium strip)', description: 'Яскраво спалахує для розпалювання вогню.', slots: 1 },
  { name: 'Випадковий нечистий сувій', description: 'Темна магія з таблиці Нечистих сувоїв.', slots: 1 },
  { name: 'Гостра голка (Sharp needle)', description: 'Для шиття, катувань чи медичних дій.', slots: 1 },
  { name: 'Аптечка (Medicine chest)', description: 'Присутність + 4 використання. Зупиняє кровотечу/інфекцію та лікує d6 HP.', slots: 1 },
  { name: 'Напилок та відмички (File & Lockpicks)', description: 'Для зламу кайданів, ґрат та замків.', slots: 1 },
  { name: 'Капкан на ведмедя (Bear trap)', description: 'Присутність DR14 щоб помітити. Завдає d8 шкоди.', slots: 1 },
  { name: 'Бомба (Bomb)', description: 'Запечатана пляшка з порохом, завдає d10 шкоди.', slots: 1 },
  { name: 'Червона отрута (Red poison)', description: 'd4 дози. Витривалість DR12 або d10 шкоди.', slots: 1 },
  { name: 'Срібне розп\'яття (Silver crucifix)', description: 'Священна реліквія. Відлякує нежить.', slots: 1 }
];

// Small gear Table 2 (d12) - Bare Bones Page 22
export const GEAR_TABLE_2: { name: string; description: string; slots: number }[] = [
  { name: 'Еліксир життя (Life elixir)', description: 'd4 дози. Лікує d6 HP та знімає інфекцію.', slots: 1 },
  { name: 'Випадковий священний сувій', description: 'Свята молитва з таблиці Священних сувоїв.', slots: 1 },
  { name: 'Малий лютий пес (Small vicious dog)', description: 'd6+2 HP, укус d4 шкоди. Слухається лише вас.', slots: 1 },
  { name: 'd4 мавп (Monkeys)', description: 'd4+2 HP, удар/укус d4. Ігнорують накази, але люблять вас.', slots: 1 },
  { name: 'Вишукані парфуми (Perfume)', description: 'Коштують 25 срібла чи маскують сморід.', slots: 1 },
  { name: 'Набір інструментів (Toolbox)', description: '10 цвяхів, обломи, молоток, мала пилка та дриль.', slots: 1 },
  { name: 'Важкий ланцюг (Heavy chain, 15 ft)', description: '15 футів (4.5 м) залізних ланок.', slots: 1 },
  { name: 'Абордажний гак (Grappling hook)', description: 'Залізний кіготь для лазіння.', slots: 1 },
  { name: 'Щит (Shield)', description: '-1 шкоди або ламається для повного блоку однієї атаки.', slots: 1 },
  { name: 'Ломик (Crowbar)', description: 'Завдає d4 шкоди або ламає двері.', slots: 1 },
  { name: 'Смалець (Lard)', description: 'Заменяє 5 порцій їжі у скруті.', slots: 1 },
  { name: 'Намет (Tent)', description: 'Захищає від лютої негоди.', slots: 1 }
];

// Weapons Table (d10) - Bare Bones Page 23
export const WEAPONS_TABLE: EquipmentItem[] = [
  { id: 'w1', name: 'Стегнова кістка (Femur)', isWeapon: true, damage: 'd4', slots: 1, description: 'Важка людська кістка.' },
  { id: 'w2', name: 'Посох (Staff)', isWeapon: true, damage: 'd4', slots: 1, description: 'Дерев\'яна палиця.' },
  { id: 'w3', name: 'Короткий меч (Shortsword)', isWeapon: true, damage: 'd4', slots: 1, description: 'Легкий одноручний меч.' },
  { id: 'w4', name: 'Ніж (Knife)', isWeapon: true, damage: 'd4', slots: 1, description: 'Гострий ніж.' },
  { id: 'w5', name: 'Бойовий молот (Warhammer)', isWeapon: true, damage: 'd6', slots: 1, description: 'Дробить броньовані черепи.' },
  { id: 'w6', name: 'Меч (Sword)', isWeapon: true, damage: 'd6', slots: 1, description: 'Класичний меч.' },
  { id: 'w7', name: 'Лук (Bow)', isWeapon: true, damage: 'd6', slots: 2, description: 'Лук з (Присутність + 10) стрілами.' },
  { id: 'w8', name: 'Ціп (Flail)', isWeapon: true, damage: 'd8', slots: 1, description: 'Залізний ціп на ланцюгу.' },
  { id: 'w9', name: 'Арбалет (Crossbow)', isWeapon: true, damage: 'd8', slots: 2, description: 'Арбалет з (Присутність + 10) болтами.' },
  { id: 'w10', name: 'Дворучний меч (Zweihänder)', isWeapon: true, damage: 'd10', slots: 2, description: 'Величезний меч (2 слоти). Унеможливлює використання сувоїв!' }
];

// Armor Table (d4) - Bare Bones Page 23
export const ARMOR_TABLE: EquipmentItem[] = [
  { id: 'a1', name: 'Без броні (Tier 0)', isArmor: true, tier: 0, armorValue: '0', slots: 0, description: 'Шмаття чи брудний одяг.' },
  { id: 'a2', name: 'Легка броня (Tier 1)', isArmor: true, tier: 1, armorValue: '-d2', slots: 1, description: 'Хутро, шкіра чи стьобанка. Зменшує шкоду на d2. Коштує 20s.' },
  { id: 'a3', name: 'Середня броня (Tier 2)', isArmor: true, tier: 2, armorValue: '-d4', slots: 2, description: 'Кольчуга чи луска. Зменшує шкоду на d4. DR+2 на тести Спритності (включаючи захист). Коштує 100s. Забороняє сувої!' },
  { id: 'a4', name: 'Важка броня (Tier 3)', isArmor: true, tier: 3, armorValue: '-d6', slots: 3, description: 'Пластинчасті обладунки. Зменшує шкоду на d6. DR+4 на тести Спритності, Захист DR+2. Коштує 200s. Забороняє сувої!' }
];

// Unclean Scrolls (d10) - Bare Bones Page 34-35
export const UNCLEAN_SCROLLS: ScrollItem[] = [
  { name: 'Долоні відчиняють південну браму (Palms Open The Southern Gate)', type: 'unclean', effect: 'Вогняна куля вражає d2 істот, завдаючи d8 шкоди кожній.' },
  { name: 'Язик Еріди (Tongue of Eris)', type: 'unclean', effect: 'Обрана істота впадає в замішання на 10 хвилин.' },
  { name: 'Телекінез (Te-Le-Kin-Esis)', type: 'unclean', effect: 'Переміщує предмет вагою до d10×10 футів на d6 хвилин.' },
  { name: 'Левітація Люсі-Файрс (Lucy-Fires Levitation)', type: 'unclean', effect: 'Зависнення у повітрі на (Присутність + d10) раундів.' },
  { name: 'Демон капілярів (Daemon of Capillaries)', type: 'unclean', effect: 'Істота удушається d6 раундів, втрачаючи d4 HP щораунду.' },
  { name: 'Дев\'ять фіолетових знаків (Nine Violet Signs)', type: 'unclean', effect: 'Викликає d2 блискавки, що завдають d6 шкоди кожна.' },
  { name: 'Метцхуотль засліплює око (Metzhuotl Blind Your Eye)', type: 'unclean', effect: 'Істота стає невидимою на d6 раундів або до першої шкоди (атака/захист DR6).' },
  { name: 'Мерзенний психопомп (Foul Psychompomp)', type: 'unclean', effect: 'Викликає (d6): 1-3 -> d4 скелетів; 4-6 -> d4 зомбі.' },
  { name: 'Повіки затьмарюють розум (Eyelid Blinds The Mind)', type: 'unclean', effect: 'd4 істот засинають на 1 годину (тест DR14 щоб уникнути).' },
  { name: 'Смерть (Death)', type: 'unclean', effect: 'Усі істоти в радіусі 30 футів (9 м) втрачають загалом 4d10 HP.' }
];

// Sacred Scrolls (d10) - Bare Bones Page 35
export const SACRED_SCROLLS: ScrollItem[] = [
  { name: 'Милість мертвого святого (Grace of a Dead Saint)', type: 'sacred', effect: 'd2 істот відновлюють d10 HP кожна.' },
  { name: 'Прощення грішника (Grace for a Sinner)', type: 'sacred', effect: 'Обрана істота отримує +d6 на один кидок (шкода, тести тощо).' },
  { name: 'Шепіт крізь браму (Whispers Pass The Gate)', type: 'sacred', effect: 'Поставити три запитання померлій істоті.' },
  { name: 'Егіда смутку (Aegis of Sorrow)', type: 'sacred', effect: 'Обрана істота отримує 2d6 тимчасових HP на 10 раундів.' },
  { name: 'Невідворота доля (Unmet Fate)', type: 'sacred', effect: 'Воскрешає істоту (померлу не більше тижня тому) з жахливими спогадами.' },
  { name: 'Звірина мова (Bestial Speech)', type: 'sacred', effect: 'Можливість розмовляти з тваринами протягом d20 хвилин.' },
  { name: 'Несправжній світанок (False Dawn / Night\'s Chariot)', type: 'sacred', effect: 'Створює яскраве світло або кромішню темряву на 3d10 хвилин.' },
  { name: 'Герметичний крок (Hermetic Step)', type: 'sacred', effect: 'Виявляє всі пастки на вашому шляху протягом 2d10 хвилин.' },
  { name: 'Нищівне сяйво Роско (Roskoe\'s Consuming Glare)', type: 'sacred', effect: 'd4 істот втрачають d8 HP кожна.' },
  { name: 'Енохіанський синтаксис (Enochian Syntax)', type: 'sacred', effect: 'Одна істота сліпо виконує один ваш наказ.' }
];

// Herbmaster Potions (d8) - Bare Bones Page 57
export const HERBMASTER_POTIONS = [
  { name: 'Червона отрута (Red Poison)', effect: 'Витривалість DR12 або -d10 HP.' },
  { name: 'Пара Езуміеля (Ezumiels Vapor)', effect: 'Тест DR14 або важкі галюцинації на d4 години.' },
  { name: 'Юшка з південної жаби (Southern Frog Stew)', effect: 'Блювота на d4 години (тест DR14 щоб щось зробити).' },
  { name: 'Життєдайний еліксир (Elixir Vitalis)', effect: 'Лікує d6 HP та зупиняє інфекцію.' },
  { name: 'Суп із павука-сови (Spider-Owl Soup)', effect: 'Бачення в темряві та лазіння по стінах на 30 хвилин.' },
  { name: 'Олива Фернора (Fernor\'s Philtre)', effect: 'Крапля в око. Знімає інфекцію, +2 до тестів Присутності на d4 години.' },
  { name: 'Бадьорий тютюн Гіпфоса (Hyphos\' Snuff)', effect: 'Лють! 2 атаки за раунд, але захист DR14 на один бій.' },
  { name: 'Чорна отрута (Black Poison)', effect: 'Витривалість DR14 або -d6 HP і сліпота на 1 годину.' }
];

// Troubling Tales (d20) - Bare Bones Page 41-42
export const TROUBLING_TALES = [
  'Переслідується за вбивство. За голову призначено нагороду.',
  'У величезних боргах, які перепродано безжальним бандитам.',
  'Володіє рідкісним, жаданим багатьма предметом.',
  'Має прокляту рану, яка ніколи не гоїться.',
  'Мав аморальний таємний зв\'язок із членом королівської родини. Є докази.',
  'Колишній культист-втікач. Параноїк, якому всюди вбачаються сектанти.',
  'Крадій особистості, який нещодавно вбив і заступив цю людину.',
  'Вигнаний і зречений родиною за незазначені жахливі гріхи.',
  'Дезертирував з армії після різанини. Переслідується колишніми побратимами.',
  'Зовсім нещодавно вбив близького родича. Зовсім нещодавно.',
  'Невірно налаштована головоломка-куб пробудила сплячу потвору.',
  'Потвори чують солодкий запах вашої крові та йдуть слідом.',
  'Осколок металу в грудях щодня на 2% наближається до серця.',
  'Божеволіє від самотності та чує шепіт дерев у лісі.',
  'Проклятий ділити чужі нічні жахи, тому спить подалі від людей.',
  'У вічній війні з усіма круками. Будь-який контакт завершується бійкою.',
  'Після сну про підземний храм розуміє мову хробаків та комах.',
  'За вами стежить голем через забуту угоду з минулого.',
  'Прийняв долю «Згори або спали інших».',
  'Плоть затягується вдвічі швидше, але супутники лікуються вдвічі повільніше. Бачить багатоокого ангела.'
];

// Arcane Catastrophes (d20) - Bare Bones Page 43-45
export const ARCANE_CATASTROPHES = [
  'Зуби випадають один за одним, а на їх місці ростуть гострі ламкі нігті. Потворна посмішка.',
  'Зараження магічною хворобою. Всі інтимні партнери гинуть за d4 дні та встають як зомбі.',
  'Скелет одержимий і намагається вбити вас та втекти. Тест Сили DR10 або d4 шкоди.',
  'Бачення безодні за небесною сферою. Погляд на нічне небо викликає божевільний страх.',
  'Навколо падає чорна попеляста хуртовина. Питна вода викликає нудоту, вгамовує спрагу лише попіл.',
  'Земля під ногами гниє. Ви провалюєтесь на 3 фути та обсідаєтесь d4 напівпрозорими раками з вашим обличчям (3 HP, укус d4).',
  'Шкіра злазить папером, м\'язи тануь воском. Ви перетворюєтесь на рухомий скелет.',
  'На шиї роздирається зубатий рот, що викрикує ваші таємниці. Замовкає лише від свіжої крові.',
  'Зорі кружляють. Вас викидає на 1 день у майбутнє, ви блюєте срібною жовчю.',
  'Світло зневажає вас. Будь-яка свічка, смолоскип чи ліхтар гасне при погляді.',
  'Через d4 дні з землі вилізає ваш повний кокон-клон, що сіє хаос та лихо.',
  'Очі випадають із кривавих очних ямок, але ви продовжуєте бачити крізь них де б вони не були.',
  'Ви непритомнієте та міняєтесь душами з найближчою істотою.',
  'З спини проростають 5 кістлявих скелетних рук, що діють самі по собі.',
  'Шкіра випромінює хворобливе зеленкувате світло, від якого хворіють та лисіють оточуючі.',
  'Магія спрацьовує, але демон перекручує результат на вашу абсолютну шкоду.',
  'Сувій розсипається чорним порошком, що лізе в ніс та рот (тест Витривалості DR14 або d10 шкоди).',
  'Сила випиває вашу душу. При відпочинку відновлюється лише половина HP.',
  'Провал у вимір Куб-Фіолет (Cube-Violet). Щоб вийти, треба виконати квест (d4).',
  'З тіні виходить Двоголовий Василіск та негайно поглинає вас.'
];

// Terrible Traits (d20) - Bare Bones Page 38
export const TERRIBLE_TRAITS = [
  'Вічно роздратований (Endlessly aggravated)',
  'Комплекс меншовартості (Inferiority complex)',
  'Бунтар проти будь-якої влади (Problems with authority)',
  'Пащекуватий (Loud mouth)',
  'Жорстокий (Cruel)',
  'Егоцентрик (Egocentric)',
  'Нігіліст (Nihilistic)',
  'Схильний до речовин (Prone to substance abuse)',
  'Сповнений суперечностей (Conflicted)',
  'Пронозливий (Shrewd)',
  'Мстивий (Vindictive)',
  'Боягузливий (Cowardly)',
  'Ледачий (Lazy)',
  'Підозріливий (Suspicious)',
  'Безжальний (Ruthless)',
  'Тривожний (Worried)',
  'Сповнений гіркоти (Bitter)',
  'Брехливий (Deceitful)',
  'Марнотратний (Wasteful)',
  'Пихатий (Arrogant)'
];

// Broken Bodies (d20) - Bare Bones Page 39
export const BROKEN_BODIES = [
  'Немигаючий маніакальний погляд (Staring manic gaze)',
  'Вкритий богохульними татуюваннями (Blasphemous tattoos)',
  'Гниле обличчя, носить маску (Rotting face, wears mask)',
  'Кульгає, бракує пальців на нозі (Lost toes, limps)',
  'Виснажений, худий і блідий (Starved, gaunt and pale)',
  'Замість кисті — іржавий гак (Rusting hook, d6 damage)',
  'Згнилі зуби (Decaying teeth)',
  'Примарно вродливий, чистоплотний (Unnervingly clean)',
  'Руки вкриті струпами (Hands caked with sores)',
  'Катаракта на обох очах (Cataracts spreading)',
  'Заплутане волосся з тарганом (Tangled hair with cockroach)',
  'Зламані, сплющені вуха (Broken, crushed ears)',
  'Нервовий розлад та заїкання (Juddering and stuttering)',
  'Гладкий, ненажерливий, слинявий (Corpulent, drooling)',
  'Рука мов клешня без пальців (Grips like a lobster)',
  'Червоний роздутий ніс п\'яниці (Alcoholic\'s nose)',
  'Обличчя маніяка у спокої (Resting maniac face)',
  'Смердючий грибок на стопах (Athlete\'s foot)',
  'Смердюча пов\'язка на оці (Slashed eye with patch)',
  'Почорнілі потріскані нігті (Black cracked nails)'
];

// Bad Habits (d20) - Bare Bones Page 40
export const BAD_HABITS = [
  'Збирає гострі камінці (Obsessively collect stones)',
  'Ріже власні руки перед боєм (Won\'t use blade without self-test)',
  'Запійний п\'яниця (Can\'t stop drinking)',
  'Запеклий гравець (Gambling addict)',
  'Впадає в істерику від критики (Intolerant to criticism)',
  'Ніколи не договорює історію (Unable to get to the point)',
  'Носить з собою череп друга (Best friend is a skull)',
  'Копирсається в носі до крові (Picks nose deep)',
  'Сміється з власних жартів (Laughs at own jokes)',
  'Усім доводить, що він нігіліст (Insists he is nihilist)',
  'Їсть комах (Inveterate bug eater)',
  'При стресі вбирається як чепурун (Aesthetic display under stress)',
  'Постійно кашляє та харкає (Permanent phlegm in throat)',
  'Піроман (Pyromaniac)',
  'Губить важливі речі (Loses important items)',
  'Пліткує за спиною (Insecure shit-stirrer)',
  'Заїкається, коли бреше (Stutters when lying)',
  'Хихотить у страшні моменти (Giggles at worst times)',
  'Свистить, коли ховається (Whistles while hiding)',
  'Робить намиста із зубів мерців (Jewelry from dead teeth)'
];

// 48 Official Names from Bare Bones Edition Page 2 (d6 x d8)
export const OFFICIAL_NAMES_D6_D8: string[][] = [
  ['Aerg-Tval', 'Agn', 'Arvant', 'Belsum', 'Belum', 'Brint', 'Börda', 'Daeru'],
  ['Eldar', 'Felban', 'Gotven', 'Graft', 'Grin', 'Grittr', 'Haerü', 'Hargha'],
  ['Harmug', 'Jotna', 'Karg', 'Karva', 'Katla', 'Keftar', 'Klort', 'Kratar'],
  ['Kutz', 'Kvetin', 'Lygan', 'Margar', 'Merkari', 'Nagl', 'Niduk', 'Nifehl'],
  ['Prügl', 'Qillnach', 'Risten', 'Svind', 'Theras', 'Therg', 'Torvul', 'Törn'],
  ['Urm', 'Urvarg', 'Vagal', 'Vatan', 'Von', 'Vrakh', 'Vresi', 'Wemut']
];
