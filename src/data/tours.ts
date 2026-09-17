export type TravelMode = 'solo' | 'couple' | 'family' | 'group';

export type Difficulty = 'easy' | 'moderate' | 'hard';

export interface Tour {
  id: number;
  title: { en: string; ru: string; uz: string; kaa: string };
  description: { en: string; ru: string; uz: string; kaa: string };
  image: string;
  duration: { en: string; ru: string; uz: string; kaa: string };
  difficulty: Difficulty;
  price: number;
  modes: TravelMode[];
  includes: { en: string[]; ru: string[]; uz: string[]; kaa: string[] };
}

const includes = {
  aral: {
    en: ['4x4 Transport', 'Local Guide', 'Lunch', 'Water'],
    ru: ['Транспорт 4x4', 'Местный гид', 'Обед', 'Вода'],
    uz: ['4x4 Transport', "Mahalliy gid", 'Tushlik', 'Suv'],
    kaa: ['4x4 Transport', 'Jergilikli gid', 'Túslik', 'Suw'],
  },
  ustyurt: {
    en: ['4x4 Jeep', 'Guide', 'Picnic', 'Sunset Photography'],
    ru: ['Джип 4x4', 'Гид', 'Пикник', 'Фотосъёмка на закате'],
    uz: ['4x4 Jeep', 'Gid', 'Piknik', 'Quyosh botishi fotosurati'],
    kaa: ['4x4 Jeep', 'Gid', 'Piknik', 'Kún batıw fotosurati'],
  },
  yurt: {
    en: ['Yurt Stay', 'Dinner & Breakfast', 'Campfire', 'Stargazing'],
    ru: ['Ночёвка в юрте', 'Ужин и завтрак', 'Костёр', 'Звёзды'],
    uz: ['Yurtda qolish', "Kechki va ertalab ovqat", 'Olov', 'Yulduzlar'],
    kaa: ['Yurtta qalıw', 'Keshki hám ertengi awqat', 'Ot', 'Juldızlar'],
  },
  museum: {
    en: ['Museum Entry', 'Audio Guide', '2-hour Tour'],
    ru: ['Вход в музей', 'Аудиогид', '2-часовая экскурсия'],
    uz: ['Muzeyga kirish', 'Audio gid', '2 soatlik ekskursiya'],
    kaa: ['Muzeyge kiriw', 'Audio gid', '2 saatlıq ekskursiya'],
  },
  camel: {
    en: ['Camel Ride', 'Guide', 'Tea Ceremony'],
    ru: ['Верхом на верблюде', 'Гид', 'Чайная церемония'],
    uz: ['Tuya minish', 'Gid', 'Choy marosimi'],
    kaa: ['Tuya miniw', 'Gid', 'Shay marosimi'],
  },
  fortress: {
    en: ['4x4 Transport', 'Guide', 'Historical Tour', 'Water'],
    ru: ['Транспорт 4x4', 'Гид', 'Исторический тур', 'Вода'],
    uz: ['4x4 Transport', 'Gid', 'Tarixiy tur', 'Suv'],
    kaa: ['4x4 Transport', 'Gid', 'Tariyxıy tur', 'Suw'],
  },
};

export const tours: Tour[] = [
  {
    id: 1,
    title: {
      en: 'Aral Sea & Moynak Ship Graveyard',
      ru: 'Аральское море и Кладбище кораблей',
      uz: "Orol dengizi va Mo'ynoq kema qabristoni",
      kaa: 'Aral teńizi hám Moynaq keme qábiristanı',
    },
    description: {
      en: 'Full-day 4x4 journey to the iconic ship graveyard and the retreating Aral Sea shoreline. A haunting, unforgettable experience.',
      ru: 'Полнодневное путешествие на 4x4 к культовому кладбищу кораблей и отступающей береговой линии Аральского моря. Незабываемое впечатление.',
      uz: "Kema qabristoni va chekingan Orol dengizi qirg'og'iga to'liq kunlik 4x4 sayohat. Unutilmas tajriba.",
      kaa: 'Keme qábiristanı hám shekingen Aral teńizi qıyaǵına tolıq kúnlik 4x4 sayaxat. Unutilmas tájiriybe.',
    },
    image: 'https://images.pexels.com/photos/36612746/pexels-photo-36612746.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    duration: { en: 'Full day', ru: 'Весь день', uz: 'To\'liq kun', kaa: 'Tolıq kún' },
    difficulty: 'moderate',
    price: 35,
    modes: ['solo', 'couple', 'group'],
    includes: includes.aral,
  },
  {
    id: 2,
    title: {
      en: 'Ustyurt Plateau Expedition',
      ru: 'Экспедиция на плато Устюрт',
      uz: 'Ustyurt platosi ekspeditsiyasi',
      kaa: 'Ustyurt platosı ekspeditsiyası',
    },
    description: {
      en: 'Dramatic cliffs, sweeping canyon views, and otherworldly white rock landscapes. Perfect for adventure seekers and photographers.',
      ru: 'Драматичные обрывы, панорамные виды каньонов и инопланетные белые скалы. Идеально для искателей приключений и фотографов.',
      uz: 'Dramatik jarlar, keng kanyon manzaralari va g\'aroyib oq qoyalar. Sarguzasht va fotosurat izlovchilar uchun mukammal.',
      kaa: 'Dramatikalıq jarlar, keń kanyon kórinisleri hám g\'arrip aq qayalar. Sariguzesht hám fotosurat izlewshiler ushın mukammal.',
    },
    image: 'https://images.pexels.com/photos/26311719/pexels-photo-26311719.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    duration: { en: '3-4 hours', ru: '3-4 часа', uz: '3-4 soat', kaa: '3-4 saat' },
    difficulty: 'hard',
    price: 40,
    modes: ['solo', 'couple', 'group'],
    includes: includes.ustyurt,
  },
  {
    id: 3,
    title: {
      en: 'Desert Yurt Camp Overnight',
      ru: 'Ночёвка в юртовом лагере в пустыне',
      uz: 'Cho\'l yurt lagerida tunash',
      kaa: 'Shól yurt lagerinde túnlew',
    },
    description: {
      en: 'Sleep under a blanket of stars in a traditional yurt. Enjoy Karakalpak hospitality, campfire stories, and authentic local cuisine.',
      ru: 'Проснитесь под звёздным небом в традиционной юрте. Насладитесь каракалпакским гостеприимством,故事 у костра и местной кухней.',
      uz: 'An\'anaviy yurtada yulduzlar ostida uxlang. Qoraqalpoq mehmondo\'stligi, olov hikoyalari va mahalliy taomlardan bahramand bo\'ling.',
      kaa: 'An\'anaviy yurtada juldızlar astında uqlań. Qaraqalpaq miymandoslıǵı, ot gúpası hám jergilikli azıqtan bahramand boılıń.',
    },
    image: 'https://images.pexels.com/photos/18601782/pexels-photo-18601782.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    duration: { en: 'Overnight', ru: 'С ночёвкой', uz: 'Bir tun', kaa: 'Bir tún' },
    difficulty: 'easy',
    price: 30,
    modes: ['solo', 'couple', 'family', 'group'],
    includes: includes.yurt,
  },
  {
    id: 4,
    title: {
      en: 'Savitsky Museum Art Tour',
      ru: 'Тур по музею Савицкого',
      uz: 'Savitskiy muzeyi san\'at turi',
      kaa: 'Savitskiy muzeyi kórkem-óner turi',
    },
    description: {
      en: 'Discover the "Louvre of the Desert" — home to one of the world\'s finest collections of Russian avant-garde art and Karakalpak cultural treasures.',
      ru: 'Откройте "Лувр пустыни" — дом одной из лучших в мире коллекций русского авангарда и культурных сокровищ Каракалпакии.',
      uz: '"Cho\'l Luvri"ni kashf eting — dunyodagi eng yaxshi rus avangard san\'ati va qoraqalpoq madaniy xazinalari kolleksiyasi.',
      kaa: '"Shól Luvri"n ashıń — dúnyadaǵı eń jaqsı orıs avangard kórkem-óner hám qaraqalpaq mádeniy qazınaları kollekciyası.',
    },
    image: 'https://images.pexels.com/photos/1671016/pexels-photo-1671016.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    duration: { en: '2 hours', ru: '2 часа', uz: '2 soat', kaa: '2 saat' },
    difficulty: 'easy',
    price: 10,
    modes: ['solo', 'couple', 'family', 'group'],
    includes: includes.museum,
  },
  {
    id: 5,
    title: {
      en: 'Camel Trekking Adventure',
      ru: 'Приключение на верблюдах',
      uz: 'Tuya minish sarguzashti',
      kaa: 'Tuya miniw sariguzeshti',
    },
    description: {
      en: 'Ride a camel through the Kyzylkum desert sands, then relax with a traditional Karakalpak tea ceremony. Fun for all ages.',
      ru: 'Прокатитесь на верблюде по пескам Кызылкума, а затем расслабьтесь с традиционным каракалпакским чаепитием. Увлекательно для всех возрастов.',
      uz: 'Qizilqum cho\'li qumlari orqali tuya minib, so\'ng an\'anaviy qoraqalpoq choy marosimi bilan dam oling. Barcha yoshlar uchun qiziqarli.',
      kaa: 'Qızılqum shóli qumları arqalı tuya minip, soń an\'anaviy qaraqalpaq shay marosimi menen dem alıń. Barlıq jaslar ushın qızıqarlı.',
    },
    image: 'https://images.pexels.com/photos/13652204/pexels-photo-13652204.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    duration: { en: '2 hours', ru: '2 часа', uz: '2 soat', kaa: '2 saat' },
    difficulty: 'easy',
    price: 20,
    modes: ['solo', 'couple', 'family', 'group'],
    includes: includes.camel,
  },
  {
    id: 6,
    title: {
      en: 'Ancient Khorezm Fortresses',
      ru: 'Древние крепости Хорезма',
      uz: 'Qadimiy Xorazm qal\'alari',
      kaa: 'Áyyemgi Xorezm qorǵanları',
    },
    description: {
      en: 'Visit the ruins of ancient fortresses dating back over 2,000 years. Explore the mysterious Mizdakhan necropolis and the stories it holds.',
      ru: 'Посетите руины древних крепостей, которым более 2,000 лет. Исследуйте загадочный некрополь Миздахан и его истории.',
      uz: '2,000 yildan oshgan qadimiy qal\'a xarobalarini ziyorat qiling. Sirli Mizdaxan nekropolini va uning hikoyalarini o\'rganing.',
      kaa: '2,000 jıldan asqan áyyemgi qorǵan xarabaların ziyarat qılıń. Sirli Mizdaxan nekropolisin hám onıń gúyaların úyreniń.',
    },
    image: 'https://images.pexels.com/photos/14256258/pexels-photo-14256258.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    duration: { en: 'Half day', ru: 'Полдня', uz: 'Yarim kun', kaa: 'Yarım kún' },
    difficulty: 'moderate',
    price: 25,
    modes: ['solo', 'couple', 'family', 'group'],
    includes: includes.fortress,
  },
];

export const DESTINATIONS = [
  { value: 'Moynaq', label: { en: 'Moynaq', ru: 'Муйнак', uz: "Mo'ynoq", kaa: 'Moynaq' } },
  { value: 'Nukus', label: { en: 'Nukus', ru: 'Нукус', uz: 'Nukus', kaa: 'Nókis' } },
  { value: 'Nukus Museum', label: { en: 'Savitsky Museum', ru: 'Музей Савицкого', uz: 'Savitskiy muzeyi', kaa: 'Savitskiy muzeyi' } },
  { value: 'Ustyurt Plateau', label: { en: 'Ustyurt Plateau', ru: 'Плато Устюрт', uz: 'Ustyurt platosi', kaa: 'Ustyurt platosı' } },
  { value: 'Aral Sea', label: { en: 'Aral Sea', ru: 'Аральское море', uz: 'Orol dengizi', kaa: 'Aral teńizi' } },
  { value: 'Mizdakhan', label: { en: 'Mizdakhan', ru: 'Миздахан', uz: 'Mizdaxan', kaa: 'Mizdaxan' } },
  { value: 'Kungrad', label: { en: 'Kungrad', ru: 'Кунград', uz: "Qo'ng'irot", kaa: 'Qońırat' } },
];

export const TRAVEL_MODES: { mode: TravelMode; key: string; icon: string }[] = [
  { mode: 'solo', key: 'mode.solo', icon: '👤' },
  { mode: 'couple', key: 'mode.couple', icon: '💑' },
  { mode: 'family', key: 'mode.family', icon: '👨‍👩‍👧‍👦' },
  { mode: 'group', key: 'mode.group', icon: '👥' },
];
