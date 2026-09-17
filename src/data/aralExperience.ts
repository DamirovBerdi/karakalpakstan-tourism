import type { Lang } from '@/lib/translations';

type Localized = Partial<Record<Lang, string>>;

export interface AralTimePoint {
  year: number;
  area: number;
  levelDrop: number;
  fact: Localized;
  milestones: Localized[];
}

export interface AralTour {
  id: string;
  name: Localized;
  description: Localized;
  image: string;
  price: number;
  duration: Localized;
  difficulty: 'easy' | 'moderate' | 'hard';
  includes: Localized[];
  highlights: Localized[];
}

export interface EcoProject {
  id: string;
  name: Localized;
  description: Localized;
  image: string;
  goal: number;
  current: number;
  unit: Localized;
  duration: Localized;
  location: Localized;
  season: Localized;
  impact: Localized;
}

export const aralTimeline: AralTimePoint[] = [
  {
    year: 1960,
    area: 68900,
    levelDrop: 0,
    fact: { en: 'The Aral Sea was the fourth-largest lake in the world — thriving fishing industry, 40,000 tons of fish yearly.', ru: 'Аральское море было четвёртым по величине озером в мире — процветающая рыбная промышленность, 40 000 тонн рыбы в год.', uz: "Orol dengizi dunyodagi to'rtinchi yirik ko'l edi — gullab-yashnagan baliqchilik, yiliga 40 000 tonna baliq.", kaa: 'Aral teńizi dúnyada tórtinshi eń úlken kól edi — gúllegen balıqshılıq, jılına 40 000 tonna balıq.' },
    milestones: [
      { en: 'Soviet government begins diverting Amu Darya and Syr Darya for cotton irrigation', ru: 'Советское правительство начинает отвод Амударьи и Сырдарьи для хлопкового орошения', uz: "Sovet hukumati Amudaryo va Sirdaryoni paxta sug'orish uchun burishni boshlaydi", kaa: 'Sovet húkimeti Ámiwdárya hám Sirdáryanı paxta suǵarıw ushın burıwdı baslaydı' },
    ],
  },
  {
    year: 1970,
    area: 60200,
    levelDrop: 3,
    fact: { en: 'Water level drops 3 meters. Fishing catches begin to decline noticeably.', ru: 'Уровень воды падает на 3 метра. Уловы рыбы начинают заметно снижаться.', uz: "Suv darajasi 3 metr tushadi. Baliq ovilishi sezilarli kamaya boshlaydi.", kaa: 'Suw dárejesi 3 metr túsedi. Balıq awılı sezinilerli kemeye baslaydı.' },
    milestones: [
      { en: 'Karakalpakstan becomes a major cotton-producing region', ru: 'Каракалпакстан становится крупным хлопкопроизводящим регионом', uz: "Qoraqalpog'iston yirik paxta ishlab chiqaruvchi hududga aylanadi", kaa: "Qaraqalpaqstan yirik paxta islep shıǵarıwshı aymaqqa aylanadı" },
    ],
  },
  {
    year: 1980,
    area: 41500,
    levelDrop: 13,
    fact: { en: 'Sea shrinks by 40%. Moynaq port is now 30km from the receding shoreline.', ru: 'Море сокращается на 40%. Порт Муйнак теперь в 30 км от отступающей береговой линии.', uz: "Dengiz 40% qisqaradi. Mo'ynoq porti endi chekinayotgan qirg'oqdan 30 km uzoqda.", kaa: 'Teńiz 40% qısqaradı. Moynaq portı endi shekinip atırǵan qıyıqtan 30 km uzaqta.' },
    milestones: [
      { en: 'Moynaq fishing fleet trapped in the sand — ships become a graveyard', ru: 'Рыбацкий флот Муйнака trapped в песке — корабли становятся кладбищем', uz: "Mo'ynoq baliqchilik floti qumga tiqilib qoladi — kemalar qabristonga aylanadi", kaa: 'Moynaq balıqshılıq flotı qumǵa tıqılıp qaladı — kemalar qábirstanǵa aylanadı' },
    ],
  },
  {
    year: 1990,
    area: 39700,
    levelDrop: 15,
    fact: { en: 'The sea splits into North (Small) and South (Large) Aral. Fishing industry collapses entirely.', ru: 'Море разделяется на Северный (Малый) и Южный (Большой) Арал. Рыбная промышленность полностью рушится.', uz: "Dengiz Shimoliy (Kichik) va Janubiy (Katta) Orolga bo'linadi. Baliqchilik mutlaqo qulaydi.", kaa: 'Teńiz Arqa (Kishi) hám Qubla (Ulıwma) Aralǵa bólinedi. Balıqshılıq tolıq qulaydı.' },
    milestones: [
      { en: 'Vozrozhdeniya Island — former Soviet bioweapons testing site — becomes accessible via land bridge', ru: 'Остров Возрождения — бывшая советская база биооружия — становится доступным по сухопутному мосту', uz: "Vozrojdeniya oroli — sobiq sovet bioqurol bazasi — quruqlik ko'prigi orqali yetib boriladigan bo'ladi", kaa: "Vozrojdeniya atawı — sobiq sovet bioqural bazası — qurǵaqlıq kópriksi arqalı jetip barılatuǵın boladı" },
    ],
  },
  {
    year: 2000,
    area: 28600,
    levelDrop: 22,
    fact: { en: 'South Aral further splits into eastern and western basins. Toxic dust storms spread pesticides across the region.', ru: 'Южный Арал далее разделяется на восточный и западный бассейны. Токсичные пыльные бури распространяют пестициды по региону.', uz: "Janubiy Orol sharqiy va g'arbiy havzalarga bo'linadi. Zaharli chang bo'ronlari pestisidlarni mintaqaga tarqatadi.", kaa: 'Qubla Aral shıǵıs hám batıs havzalarǵa bólinedi. Zahrli chang dawılları pestisidlerdi aymaqqa tarqatadı.' },
    milestones: [
      { en: 'Kokaral Dam completed — begins saving the North Aral Sea', ru: 'Плотина Кокарал завершена — начинает спасать Северный Арал', uz: "Kokaral to'g'oni tugallandi — Shimoliy Orol dengizini saqlashni boshlaydi", kaa: "Kokaral bendi juwmaqlandı — Arqa Aral teńizin saqlawdı baslaydı" },
    ],
  },
  {
    year: 2010,
    area: 17800,
    levelDrop: 27,
    fact: { en: 'North Aral begins recovering — water level rises 3m, fish return. South Aral continues to vanish.', ru: 'Северный Арал начинает восстанавливаться — уровень воды поднимается на 3м, рыба возвращается. Южный Арал продолжает исчезать.', uz: "Shimoliy Orol tiklana boshlaydi — suv darajasi 3m ko'tariladi, baliq qaytadi. Janubiy Orol yo'qolishda davom etadi.", kaa: 'Arqa Aral tiklene baslaydı — suw dárejesi 3m kóteriledi, balıq qaytadı. Qubla Aral joq bolıwdı dawam etedi.' },
    milestones: [
      { en: 'Saxaul tree planting initiatives begin to combat desertification', ru: 'Начинаются инициативы по посадке саксаула для борьбы с опустыниванием', uz: "Cho'llanishga qarshi kurashish uchun saksovul daraxtlarini ekish tashabbuslari boshlanadi", kaa: "Shólleniwge qarsı gúresiw ushın saksovul tereklerin egiw baslanadı" },
    ],
  },
  {
    year: 2020,
    area: 14200,
    levelDrop: 30,
    fact: { en: 'Eastern basin of South Aral completely dries up for the first time in recorded history. Aralkum Desert expands.', ru: 'Восточный бассейн Южного Арала полностью высыхает впервые в истории. Пустыня Аралкум расширяется.', uz: "Janubiy Orolning sharqiy havzasi tarixda birinchi marta to'liq quriydi. Aralkum cho'li kengayadi.", kaa: 'Qubla Araldıń shıǵıs havzası tariyxta birinshi márte tolıq qurıydı. Aralkum shóli keńeyedi.' },
    milestones: [
      { en: 'UN launches multi-million dollar Aral Sea restoration program', ru: 'ООН запускает многомиллионную программу восстановления Аральского моря', uz: "BMT Orol dengizini tiklash bo'yicha ko'p million dollarlik dasturni ishga tushiradi", kaa: 'BM Aral teńizin tiklew boyınsha kóp million dollarlıq baǵdarlamanı iske túsiredi' },
    ],
  },
  {
    year: 2024,
    area: 13800,
    levelDrop: 31,
    fact: { en: 'North Aral thriving again — local fishing revived, 7,000 tons/year. South Aral remains a cautionary tale.', ru: 'Северный Арал снова процветает — местное рыболовство возрождено, 7 000 тонн/год. Южный Арал остаётся предупреждением.', uz: "Shimoliy Orol yana gullab-yashnamoqda — mahalliy baliqchilik tiklandi, 7 000 tonna/yil. Janubiy Orol ogohlantirish bo'lib qolmoqda.", kaa: 'Arqa Aral yana gúllep-yashnamaqta — jergilikli balıqshılıq tiklendi, 7 000 tonna/jıl. Qubla Aral eskertiw bolıp qalmaqta.' },
    milestones: [
      { en: 'Over 1.5 million saxaul trees planted. Eco-tourism brings new hope to Moynaq.', ru: 'Посажено более 1,5 млн саксаулов. Эко-туризм приносит новую надежду Муйнаку.', uz: "1,5 milliondan ortiq saksovul daraxti ekilgan. Eko-turizm Mo'ynoqqa yangi umid keltirmoqda.", kaa: '1,5 millionnan asıq saksovul teregi egilgen. Eko-sayaxat Moynaqqa jańa úmit keltirmekte.' },
    ],
  },
];

export const aralTours: AralTour[] = [
  {
    id: 'moynaq-ship-graveyard',
    name: { en: 'Moynaq Ship Graveyard Tour', ru: 'Тур на кладбище кораблей Муйнака', uz: "Mo'ynoq Kema Qabristoni Turi", kaa: 'Moynaq Keme Qábirstanı Turi' },
    description: {
      en: 'Walk among the rusted hulks of fishing boats stranded in the sand — a haunting monument to ecological disaster. Includes Moynaq museum and former port.',
      ru: 'Прогулка среди ржавых остовов рыбацких лодок, застрявших в песке — зловещий памятник экологической катастрофе. Включает музей Муйнака и бывший порт.',
      uz: "Qumga tiqilib qolgan zanglagan baliqchi qayiqlari orasida yurish — ekologik ofatning dahshatli yodgorligi. Mo'ynoq muzeyi va sobiq portni o'z ichiga oladi.",
      kaa: 'Qumǵa tıqılıp qalǵan zanglagan balıqshı qayıqları arasında júriw — ekologiyalıq apattıń qorqınıshlı esteligi. Moynaq muzeyi hám burınǵı portti óz ishine aladı.',
    },
    image: 'https://images.pexels.com/photos/349879/pexels-photo-349879.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 35,
    duration: { en: 'Half day (4 hrs)', ru: 'Полдня (4 часа)', uz: 'Yarim kun (4 soat)', kaa: 'Yarım kún (4 saat)' },
    difficulty: 'easy',
    includes: [
      { en: 'Transport from Nukus', ru: 'Транспорт из Нукуса', uz: "Nukusdan transport", kaa: 'Nókisten transport' },
      { en: 'English-speaking guide', ru: 'Русскоязычный гид', uz: "Ingliz tilida so'zlashuvchi gid", kaa: 'Inglis tilinde sóylesiwshi gid' },
      { en: 'Moynaq Museum entry', ru: 'Вход в музей Муйнака', uz: "Mo'ynoq muzeyiga kirish", kaa: 'Moynaq muzeyine kiriw' },
      { en: 'Photography stops', ru: 'Остановки для фото', uz: "Fotosurat uchun to'xtashlar", kaa: 'Fotosurat ushın toqtawlar' },
    ],
    highlights: [
      { en: 'Iconic ship graveyard', ru: 'Кладбище кораблей', uz: "Kema qabristoni", kaa: 'Keme qábirstanı' },
      { en: 'Former seaport views', ru: 'Виды бывшего порта', uz: "Sobiq dengiz porti manzaralari", kaa: "Burınǵı teńiz portı kórinisleri" },
    ],
  },
  {
    id: 'ustyurt-jeep-expedition',
    name: { en: 'Ustyurt Plateau 4x4 Expedition', ru: 'Экспедиция на плато Устюрт 4x4', uz: 'Ustyurt Platosi 4x4 Ekspeditsiyasi', kaa: 'Ustyurt Platosı 4x4 Ekspediciyası' },
    description: {
      en: 'A full-day off-road adventure across the dramatic chalk cliffs and canyons of the Ustyurt Plateau. See the surreal landscapes that few travelers ever witness.',
      ru: 'Полнодневное внедорожное приключение по драматичным меловым скалам и каньонам плато Устюрт. Увидите сюрреалистичные пейзажи, которые мало кто видит.',
      uz: "Ustyurt platosining dramatik bo'rtma qoyalari va kanyonlari bo'ylab to'liq kunlik off-road sarguzashti.",
      kaa: 'Ustyurt platosınıń dramatikalıq aq qıyaları hám kanjonları boyınsha tolıq kúnlik off-road sarguzeshti.',
    },
    image: 'https://images.pexels.com/photos/1538154/pexels-photo-1538154.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 120,
    duration: { en: 'Full day (10 hrs)', ru: 'Полный день (10 часов)', uz: 'To\'liq kun (10 soat)', kaa: 'Tolıq kún (10 saat)' },
    difficulty: 'hard',
    includes: [
      { en: '4x4 jeep with driver', ru: 'Джип 4x4 с водителем', uz: "Haydovchi bilan 4x4 jeep", kaa: 'Aydawshı menen 4x4 jeep' },
      { en: 'Picnic lunch', ru: 'Пикник-обед', uz: 'Piknik tushlik', kaa: 'Piknik túslik' },
      { en: 'All fuel costs', ru: 'Все расходы на топливо', uz: "Yoqilg'i xarajatlari", kaa: 'Janar may xarajatları' },
      { en: 'Expert off-road guide', ru: 'Опытный гид по бездорожью', uz: "Off-road bo'yicha mutaxassis gid", kaa: 'Off-road boyınsha bilimli gid' },
    ],
    highlights: [
      { en: 'Surreal chalk cliffs', ru: 'Сюрреалистичные меловые скалы', uz: 'G\'aroyiq bo\'rtma qoyalar', kaa: 'G\'arripa aq qıyalar' },
      { en: 'Sergei-steppe canyons', ru: 'Каньоны Сергей-степи', uz: 'Sergei-dasht kanyonlari', kaa: 'Sergei-dasht kanyonları' },
    ],
  },
  {
    id: 'aral-yurt-overnight',
    name: { en: 'Aral Sea Yurt Camp Overnight', ru: 'Ночёвка в юртовом лагере Арала', uz: "Orol Dengizi Yurt Lagerida Tunash", kaa: 'Aral Teńizi Yurt Lagerinde Túnlew' },
    description: {
      en: 'Spend a night in a traditional yurt near the Aral Sea shore. Stargaze in one of the darkest skies on Earth, enjoy Karakalpak cuisine, and witness a legendary sunrise.',
      ru: 'Проведите ночь в традиционной юрте у берега Аральского моря. Наблюдайте звёзды в одном из самых тёмных небес на Земле, насладитесь каракалпакской кухней и легендарным рассветом.',
      uz: "Aral dengizi qirg'og'idagi an'anaviy yurtada tunang. Yerdagi eng qorong'i osmonlardan birida yulduzlarni kuzating.",
      kaa: 'Aral teńizi qıyaǵındaǵı an\'anagóy yurtada túńeń. Jerdegi eń qarańǵı aspanlardan birinde juldızlardı kóriń.',
    },
    image: 'https://images.pexels.com/photos/2823037/pexels-photo-2823037.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 65,
    duration: { en: 'Overnight (24 hrs)', ru: 'Ночёвка (24 часа)', uz: 'Tunash (24 soat)', kaa: 'Túnlew (24 saat)' },
    difficulty: 'moderate',
    includes: [
      { en: 'Yurt accommodation', ru: 'Размещение в юрте', uz: 'Yurtada joy', kaa: 'Yurtada orın' },
      { en: 'Dinner + breakfast', ru: 'Ужин + завтрак', uz: "Kechki ovqat + nonushta", kaa: 'Keshki azıq + nonushta' },
      { en: 'Campfire & storytelling', ru: 'Костёр и истории', uz: 'Olov va hikoyalar', kaa: 'Otash hám gúrrińler' },
      { en: '4x4 transfer from Nukus', ru: 'Трансфер 4x4 из Нукуса', uz: "Nukusdan 4x4 transfer", kaa: 'Nókisten 4x4 transfer' },
    ],
    highlights: [
      { en: 'Milky Way stargazing', ru: 'Наблюдение Млечного Пути', uz: 'Somon Yo\'li yulduzlari', kaa: 'Jol Jol yulduzları' },
      { en: 'Aral Sea sunrise', ru: 'Восход над Аралом', uz: 'Orol dengizi botishi', kaa: 'Aral teńizi kún shıǵıwı' },
    ],
  },
  {
    id: 'aralsk-photography',
    name: { en: 'Aral Sea Photography Workshop', ru: 'Фотографический воркшоп на Арале', uz: 'Orol Dengizi Fotosurat Ustaxonasi', kaa: 'Aral Teńizi Fotosurat Ustaxanası' },
    description: {
      en: 'A specialized tour for photographers — golden hour at the ship graveyard, drone-friendly locations, and the dramatic Ustyurt cliffs. Professional guidance included.',
      ru: 'Специализированный тур для фотографов — золотой час на кладбище кораблей, локации для дрона и драматичные скалы Устюрта.',
      uz: "Fotograflar uchun ixtisoslashtirilgan tur — kema qabristonida oltin soat, dron uchun joylar va dramatik Ustyurt qoyalari.",
      kaa: "Fotograflar ushın ixtisoslastırılǵan tur — keme qábiristanında altın saat, dron ushın orınlar hám dramatikalıq Ustyurt qıyaları.",
    },
    image: 'https://images.pexels.com/photos/349879/pexels-photo-349879.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 85,
    duration: { en: 'Full day (12 hrs)', ru: 'Полный день (12 часов)', uz: "To'liq kun (12 soat)", kaa: 'Tolıq kún (12 saat)' },
    difficulty: 'moderate',
    includes: [
      { en: 'Photography guide', ru: 'Гид-фотограф', uz: "Fotografiya gidı", kaa: 'Fotografiya gidi' },
      { en: 'Transportation', ru: 'Транспорт', uz: 'Transport', kaa: 'Transport' },
      { en: 'Golden hour timing', ru: 'Золотой час тайминг', uz: 'Oltin soat vaqti', kaa: 'Altın saat waqtı' },
      { en: 'Drone permit guidance', ru: 'Разрешение на дрон', uz: 'Dron ruxsati', kaa: 'Dron ruqsatı' },
    ],
    highlights: [
      { en: 'Drone-friendly spots', ru: 'Локации для дрона', uz: 'Dron uchun joylar', kaa: 'Dron ushın orınlar' },
      { en: 'Golden hour mastery', ru: 'Мастерство золотого часа', uz: 'Oltin soat mahorati', kaa: 'Altın saat maharatı' },
    ],
  },
];

export const ecoProjects: EcoProject[] = [
  {
    id: 'saxaul-planting',
    name: { en: 'Saxaul Tree Planting', ru: 'Посадка саксаула', uz: 'Saksovul Daraxti Ekish', kaa: 'Saksovul Teregi Egiw' },
    description: {
      en: 'Plant saxaul trees on the dried Aral Sea bed to combat desertification. Saxaul roots stabilize the sand and reduce toxic dust storms that affect millions.',
      ru: 'Сажайте саксаул на высохшем дне Аральского моря для борьбы с опустыниванием. Корни саксаула укрепляют песок и снижают токсичные пыльные бури.',
      uz: "Qurigan Orol dengizi tubida saksovul daraxtlarini ekib, cho'llanishga qarshi kuring.",
      kaa: 'Qurıǵan Aral teńizi astında saksovul tereklerin egip, shólleniwge qarsı gúresiń.',
    },
    image: 'https://images.pexels.com/photos/1078958/pexels-photo-1078958.jpeg?auto=compress&cs=tinysrgb&w=800',
    goal: 50000,
    current: 37500,
    unit: { en: 'trees planted', ru: 'деревьев посажено', uz: 'daraxt ekilgan', kaa: 'terek egilgen' },
    duration: { en: 'Half day (3 hrs)', ru: 'Полдня (3 часа)', uz: 'Yarim kun (3 soat)', kaa: 'Yarım kún (3 saat)' },
    location: { en: 'Moynaq, dried seabed', ru: 'Муйнак, высохшее дно', uz: "Mo'ynoq, qurigan tub", kaa: 'Moynaq, qurǵaq astı' },
    season: { en: 'October–April', ru: 'Октябрь–Апрель', uz: 'Oktyabr–Aprel', kaa: 'Oktyabr–Aprel' },
    impact: {
      en: 'Each tree stabilizes ~10m² of sand and absorbs ~25kg CO₂/year',
      ru: 'Каждое дерево укрепляет ~10м² песка и поглощает ~25кг CO₂/год',
      uz: "Har bir daraxt ~10m² qumni stabilizatsiya qiladi va ~25kg CO₂/yil yutadi",
      kaa: "Hár bir terek ~10m² qumdı turaqlastıradı hám ~25kg CO₂/jıl jutadı",
    },
  },
  {
    id: 'dust-monitoring',
    name: { en: 'Dust Storm Monitoring', ru: 'Мониторинг пыльных бурь', uz: 'Chang Bo\'roni Monitoringi', kaa: 'Chang Dawılı Monitorinǵi' },
    description: {
      en: 'Help scientists collect air quality data and dust samples from the Aralkum Desert. Your data contributes to climate research publications and public health warnings.',
      ru: 'Помогите учёным собирать данные о качестве воздуха и образцы пыли из пустыни Аралкум. Ваши данные вносят вклад в климатические исследования.',
      uz: "Olimlarga Aralkum cho'lidan havo sifati ma'lumotlari va chang namunalarini yig'ishda yordam bering.",
      kaa: "Ilimpazlarǵa Aralkum shólinen hawa sapalıq maǵlıwmatları hám chang úlgilerin jıyıwda járdem beriń.",
    },
    image: 'https://images.pexels.com/photos/349879/pexels-photo-349879.jpeg?auto=compress&cs=tinysrgb&w=800',
    goal: 500,
    current: 312,
    unit: { en: 'samples collected', ru: 'образцов собрано', uz: 'namuna yig\'ilgan', kaa: 'úlgi jıyılǵan' },
    duration: { en: 'Full day (6 hrs)', ru: 'Полный день (6 часов)', uz: "To'liq kun (6 soat)", kaa: 'Tolıq kún (6 saat)' },
    location: { en: 'Aralkum Desert', ru: 'Пустыня Аралкум', uz: 'Aralkum cho\'li', kaa: 'Aralkum shóli' },
    season: { en: 'Year-round', ru: 'Круглый год', uz: 'Yil bo\'yi', kaa: 'Jıl boyı' },
    impact: {
      en: 'Data published in 12 international climate research papers',
      ru: 'Данные опубликованы в 12 международных климатических исследованиях',
      uz: "Ma'lumotlar 12 xalqaro iqlim tadqiqot nashrlarida chop etilgan",
      kaa: 'Maǵlıwmatlar 12 xalıqaralıq klimat izertlew neshrlerinde basıldı',
    },
  },
  {
    id: 'fish-restoration',
    name: { en: 'North Aral Fish Restoration', ru: 'Восстановление рыбы Северного Арала', uz: 'Shimoliy Orol Baliq Tiklash', kaa: 'Arqa Aral Balıq Tiklew' },
    description: {
      en: 'Support the remarkable recovery of the North Aral Sea fishery. Help release juvenile fish, monitor water quality, and document the return of native species.',
      ru: 'Поддержите замечательное восстановление рыболовства Северного Арала. Помогите выпускать мальков, следить за качеством воды.',
      uz: "Shimoliy Orol dengizi baliqchiligining ajoyib tiklanishini qo'llab-quvvatlang. Baliqchalarini chiqarishga yordam bering.",
      kaa: 'Arqa Aral teńizi balıqshılıǵınıń ajayıp tikleniwin qollap-quwatlań. Balıqshalardı shıǵarıwǵa járdem beriń.',
    },
    image: 'https://images.pexels.com/photos/259868/pexels-photo-259868.jpeg?auto=compress&cs=tinysrgb&w=800',
    goal: 100000,
    current: 68000,
    unit: { en: 'fish released', ru: 'рыб выпущено', uz: 'baliq chiqarildi', kaa: 'balıq shıǵarıldı' },
    duration: { en: 'Half day (4 hrs)', ru: 'Полдня (4 часа)', uz: 'Yarim kun (4 soat)', kaa: 'Yarım kún (4 saat)' },
    location: { en: 'North Aral Sea, Aralsk', ru: 'Северный Арал, Аральск', uz: "Shimoliy Orol, Aralsk", kaa: 'Arqa Aral, Aralsk' },
    season: { en: 'May–September', ru: 'Май–Сентябрь', uz: 'May–Sentabr', kaa: 'May–Sentabr' },
    impact: {
      en: 'Fish population grew from 0 to 7,000 tons/year in North Aral',
      ru: 'Популяция рыб выросла с 0 до 7 000 тонн/год в Северном Арале',
      uz: "Shimoliy Orol'da baliq populyatsiyasi 0 dan 7 000 tonna/yilgacha o'sdi",
      kaa: "Arqa Aralda balıq populyaciyası 0 dan 7 000 tonna/jılǵa ósti",
    },
  },
];

export const COUNTRIES = [
  'Uzbekistan', 'Kazakhstan', 'Russia', 'United States', 'United Kingdom',
  'Germany', 'France', 'Japan', 'South Korea', 'China', 'India',
  'Turkey', 'Italy', 'Spain', 'Netherlands', 'Australia', 'Canada',
  'Other',
];
