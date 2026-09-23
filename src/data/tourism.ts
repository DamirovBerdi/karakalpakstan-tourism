export interface Guide {
  id: number;
  name: string;
  photo: string;
  rating: number;
  reviews: number;
  languages: string[];
  specialties: string[];
  dailyRate: number;
  phone: string;
  whatsapp: string;
}

export interface Hotel {
  id: number;
  name: string;
  type: 'hotel' | 'yurt' | 'guesthouse';
  image: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  location: string;
  roomTypes?: { id: string; name: string; pricePerNight: number; description: string }[];
}

export interface TransportRoute {
  id: number;
  mode: 'taxi' | 'bus' | 'train' | 'jeep';
  from: string;
  to: string;
  departure: string;
  duration: string;
  price: number;
}

export interface MapPoint {
  id: number;
  category: 'attraction' | 'atm' | 'restaurant' | 'yurt';
  x: number;
  y: number;
  lat: number;
  lng: number;
  name: string;
  nameRu?: string;
  descRu?: string;
  address?: string;
}

export interface SafetyPhrase {
  id: number;
  category: 'emergency' | 'directions' | 'communication' | 'meeting';
  translations: Record<string, string>;
}

export const guides: Guide[] = [
  {
    id: 1,
    name: 'Akbayan Turebayeva',
    photo: 'https://images.pexels.com/photos/5439381/pexels-photo-5439381.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    rating: 4.9,
    reviews: 127,
    languages: ['English', 'Russian', 'Karakalpak'],
    specialties: ['Aral Sea', 'Moynaq', 'History'],
    dailyRate: 45,
    phone: '+998901234567',
    whatsapp: '998901234567',
  },
  {
    id: 2,
    name: 'Marat Utebayev',
    photo: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    rating: 4.8,
    reviews: 93,
    languages: ['English', 'Uzbek', 'Russian'],
    specialties: ['Ustyurt Plateau', '4x4 Tours', 'Photography'],
    dailyRate: 55,
    phone: '+998911234567',
    whatsapp: '998911234567',
  },
  {
    id: 3,
    name: 'Gulnara Espenbetova',
    photo: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    rating: 5.0,
    reviews: 158,
    languages: ['English', 'Karakalpak', 'Uzbek', 'Russian'],
    specialties: ['Savitsky Museum', 'Culture', 'Crafts'],
    dailyRate: 40,
    phone: '+998921234567',
    whatsapp: '998921234567',
  },
  {
    id: 4,
    name: 'Bakhtiyar Sarsenbaev',
    photo: 'https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    rating: 4.7,
    reviews: 72,
    languages: ['English', 'Russian', 'Kazakh'],
    specialties: ['Desert Trekking', 'Yurt Camps', 'Wildlife'],
    dailyRate: 50,
    phone: '+998931234567',
    whatsapp: '998931234567',
  },
];

export const hotels: Hotel[] = [
  {
    id: 1,
    name: 'Jipek Joli Hotel',
    type: 'hotel',
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    rating: 4.5,
    pricePerNight: 35,
    amenities: ['WiFi', 'AC', 'Restaurant', 'Parking'],
    location: 'Nukus',
  },
  {
    id: 2,
    name: 'Yurt Camp Ustyurt',
    type: 'yurt',
    image: 'https://images.pexels.com/photos/2823037/pexels-photo-2823037.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    rating: 4.8,
    pricePerNight: 25,
    amenities: ['Traditional Meals', 'Stargazing', 'Camel Riding', 'Campfire'],
    location: 'Ustyurt Plateau',
  },
  {
    id: 3,
    name: 'Karakalpak Guest House',
    type: 'guesthouse',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    rating: 4.6,
    pricePerNight: 18,
    amenities: ['Home-cooked Meals', 'WiFi', 'Garden', 'Bicycle Rental'],
    location: 'Nukus',
  },
  {
    id: 4,
    name: 'Aral Sea Yurt Camp',
    type: 'yurt',
    image: 'https://images.pexels.com/photos/30276246/pexels-photo-30276246.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    rating: 4.7,
    pricePerNight: 30,
    amenities: ['Sea View', 'Fishing', 'Traditional Meals', '4x4 Transfer'],
    location: 'Moynaq',
  },
  {
    id: 5,
    name: 'Nukus Palace Hotel',
    type: 'hotel',
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    rating: 4.3,
    pricePerNight: 50,
    amenities: ['Pool', 'Spa', 'WiFi', 'AC', 'Bar', 'Restaurant'],
    location: 'Nukus',
    roomTypes: [
      { id: 'standard', name: 'Standard Room', pricePerNight: 50, description: 'Queen bed, city view, 25sqm' },
      { id: 'deluxe', name: 'Deluxe Room', pricePerNight: 75, description: 'King bed, pool view, 35sqm' },
      { id: 'suite', name: 'Presidential Suite', pricePerNight: 120, description: 'Living room, spa bath, 60sqm' },
    ],
  },
  {
    id: 6,
    name: 'Pana Hotel',
    type: 'hotel',
    image: 'https://images.pexels.com/photos/2029722/pexels-photo-2029722.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    rating: 4.6,
    pricePerNight: 40,
    amenities: ['WiFi', 'AC', 'Restaurant', 'Bar', 'Parking', 'Airport Shuttle'],
    location: 'Nukus',
    roomTypes: [
      { id: 'single', name: 'Single Room', pricePerNight: 40, description: 'Single bed, workspace, 18sqm' },
      { id: 'double', name: 'Double Room', pricePerNight: 55, description: 'Double bed, city view, 25sqm' },
      { id: 'family', name: 'Family Room', pricePerNight: 80, description: 'Two beds, seating area, 35sqm' },
    ],
  },
  {
    id: 7,
    name: 'Fayz Hotel',
    type: 'hotel',
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    rating: 4.4,
    pricePerNight: 30,
    amenities: ['WiFi', 'AC', 'Breakfast', 'Parking', '24h Reception'],
    location: 'Nukus',
    roomTypes: [
      { id: 'standard', name: 'Standard Room', pricePerNight: 30, description: 'Queen bed, WiFi, 20sqm' },
      { id: 'comfort', name: 'Comfort Room', pricePerNight: 45, description: 'King bed, breakfast included, 28sqm' },
    ],
  },
  {
    id: 8,
    name: 'Chimboy Guest House',
    type: 'guesthouse',
    image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    rating: 4.4,
    pricePerNight: 15,
    amenities: ['Home-cooked Meals', 'Garden', 'Parking'],
    location: 'Chimboy',
  },
];

export const transportRoutes: TransportRoute[] = [
  { id: 1, mode: 'taxi', from: 'Nukus', to: 'Moynaq', departure: '07:00, 09:00, 12:00', duration: '2.5 hrs', price: 8 },
  { id: 2, mode: 'bus', from: 'Nukus', to: 'Kungrad', departure: '06:30, 08:00, 10:30, 14:00', duration: '1.5 hrs', price: 3 },
  { id: 3, mode: 'train', from: 'Tashkent', to: 'Nukus', departure: '18:45 (daily)', duration: '18 hrs', price: 15 },
  { id: 4, mode: 'taxi', from: 'Nukus', to: 'Ustyurt Plateau', departure: 'On demand', duration: '3-4 hrs', price: 35 },
  { id: 5, mode: 'jeep', from: 'Nukus', to: 'Aral Sea (Moynaq)', departure: '06:00 (full day)', duration: 'Full day', price: 120 },
  { id: 6, mode: 'bus', from: 'Nukus', to: 'Khiva', departure: '07:00, 09:30, 13:00', duration: '3 hrs', price: 5 },
];

export const mapPoints: MapPoint[] = [
  {
    id: 1,
    category: 'attraction',
    x: 55, y: 35,
    lat: 42.4651, lng: 59.6142,
    name: 'Savitsky Museum',
    nameRu: 'Музей искусств им. И.В. Савицкого',
    descRu: 'Знаменитый «Лувр в пустыне» с мировой коллекцией авангарда',
    address: 'ул. Рыскулова 64, Нукус'
  },
  {
    id: 2,
    category: 'attraction',
    x: 38, y: 22,
    lat: 43.7634, lng: 59.0322,
    name: 'Moynaq Ship Graveyard',
    nameRu: 'Кладбище кораблей Муйнак',
    descRu: 'Забытые корабли на бывшем дне Аральского моря',
    address: 'г. Муйнак, бывшая пристань'
  },
  {
    id: 3,
    category: 'attraction',
    x: 30, y: 50,
    lat: 44.5200, lng: 58.2800,
    name: 'Ustyurt Plateau',
    nameRu: 'Плато Устюрт & Каньоны',
    descRu: 'Чинк Устюрта, меловые каньоны и марсианские пейзажи',
    address: 'Плато Устюрт'
  },
  {
    id: 4,
    category: 'attraction',
    x: 72, y: 42,
    lat: 42.2000, lng: 61.5000,
    name: 'Kyzylkum Desert',
    nameRu: 'Пустыня Кызылкум',
    descRu: 'Бескрайние песчаные барханы и древние цитадели',
    address: 'Пустыня Кызылкум'
  },
  {
    id: 5,
    category: 'atm',
    x: 57, y: 37,
    lat: 42.4628, lng: 59.6105,
    name: 'Nukus Bank ATM',
    nameRu: 'Банкомат НБУ (Нукус)',
    descRu: 'Круглосуточный банкомат VISA / Mastercard / Humo',
    address: 'ул. Досназарова 32, Нукус'
  },
  {
    id: 6,
    category: 'atm',
    x: 53, y: 33,
    lat: 42.4672, lng: 59.6185,
    name: 'Currency Exchange Booth',
    nameRu: 'Пункт обмена валют (Нукус)',
    descRu: 'Обмен USD, EUR, RUB на узбекские сумы (UZS)',
    address: 'Центральный базар, Нукус'
  },
  {
    id: 7,
    category: 'restaurant',
    x: 56, y: 36,
    lat: 42.4640, lng: 59.6120,
    name: 'Nukus City Restaurant',
    nameRu: 'Ресторан Нукус Сити',
    descRu: 'Национальная каракалпакская кухня и бешбармак',
    address: 'ул. Амира Тимура 12, Нукус'
  },
  {
    id: 8,
    category: 'restaurant',
    x: 39, y: 24,
    lat: 43.7595, lng: 59.0280,
    name: 'Moynaq Fish Cafe',
    nameRu: 'Рыбное кафе Муйнак',
    descRu: 'Свежежареный аральский судак и национальные блюда',
    address: 'ул. Бердаха 5, Муйнак'
  },
  {
    id: 9,
    category: 'yurt',
    x: 30, y: 48,
    lat: 44.3800, lng: 58.1500,
    name: 'Ustyurt Yurt Camp',
    nameRu: 'Юртовый лагерь Устюрт',
    descRu: 'Традиционные юрты на краю живописного чинка',
    address: 'Каньон Устюрт'
  },
  {
    id: 10,
    category: 'yurt',
    x: 40, y: 20,
    lat: 44.6420, lng: 58.2150,
    name: 'Aral Sea Yurt Camp',
    nameRu: 'Юртовый лагерь Аралкум',
    descRu: 'Ночевка под звездами на самом берегу Аральского моря',
    address: 'Западный берег Арала'
  },
];

export const safetyPhrases: SafetyPhrase[] = [
  { id: 1, category: 'emergency', translations: { en: 'Help! I am lost.', kaa: 'Járdem! Men adastım.', uz: 'Yordam! Men adashdim.', ru: 'Помогите! Я заблудился.' } },
  { id: 2, category: 'emergency', translations: { en: 'I need a doctor.', kaa: 'Maǵan shıpaker kerek.', uz: 'Menga shifokor kerak.', ru: 'Мне нужен врач.' } },
  { id: 3, category: 'emergency', translations: { en: 'Please call the police.', kaa: 'Policiyanı shaqırıń.', uz: "Iltimos, politsiyaga qo'ng'iroq qiling.", ru: 'Пожалуйста, вызовите полицию.' } },
  { id: 4, category: 'emergency', translations: { en: 'I need an ambulance.', kaa: 'Maǵan tez járdem kerek.', uz: 'Menga tez yordam kerak.', ru: 'Мне нужна скорая помощь.' } },
  { id: 5, category: 'emergency', translations: { en: "I can't find my tour group.", kaa: 'Sayaxat toxparım tabılmay atır.', uz: "Sayohat guruhimni topa olmayapman.", ru: 'Я не могу найти свою туристическую группу.' } },
  { id: 6, category: 'directions', translations: { en: 'Where is the nearest hotel?', kaa: 'Eń jaqın miymanxana qayerda?', uz: "Eng yaqin mehmonxona qayerda?", ru: 'Где ближайший отель?' } },
  { id: 7, category: 'directions', translations: { en: 'How do I get to Nukus?', kaa: 'Nókiske qalay baraman?', uz: "Nukusga qanday boraman?", ru: 'Как добраться до Нукуса?' } },
  { id: 8, category: 'directions', translations: { en: 'Where is the bus station?', kaa: 'Avtobus stanciyası qayerda?', uz: "Avtobus beketi qayerda?", ru: 'Где автобусная станция?' } },
  { id: 9, category: 'directions', translations: { en: 'Can you show me on the map?', kaa: 'Kartada kórsetip bere alasız ba?', uz: 'Xaritada koʻrsatib berolasizmi?', ru: 'Можете показать на карте?' } },
  { id: 10, category: 'directions', translations: { en: 'How far is the Aral Sea?', kaa: 'Aral teńizi qansha uzaqta?', uz: "Orol dengizi qancha uzoqda?", ru: 'Как далеко Аральское море?' } },
  { id: 11, category: 'communication', translations: { en: 'Hello, how are you?', kaa: 'Sálem, qalayıńız?', uz: 'Salom, qalaysiz?', ru: 'Здравствуйте, как дела?' } },
  { id: 12, category: 'communication', translations: { en: 'Thank you very much.', kaa: 'Kóp kóp razı bolaman.', uz: "Ko'p rahmat.", ru: 'Большое спасибо.' } },
  { id: 13, category: 'communication', translations: { en: "I don't understand.", kaa: 'Túsingen joq.', uz: 'Tushunmayman.', ru: 'Я не понимаю.' } },
  { id: 14, category: 'communication', translations: { en: 'How much does it cost?', kaa: 'Bahası qansha?', uz: "Narxi qancha?", ru: 'Сколько это стоит?' } },
  { id: 15, category: 'communication', translations: { en: 'Can you help me, please?', kaa: "Járdem bere alasız ba?", uz: "Menga yordam bera olasizmi?", ru: 'Не могли бы вы мне помочь?' } },
  { id: 16, category: 'meeting', translations: { en: 'Where is the meeting point?', kaa: 'Ushırasıw nókitesi qayerda?', uz: "Uchrashuv nuqtasi qayerda?", ru: 'Где место встречи?' } },
  { id: 17, category: 'meeting', translations: { en: 'I am waiting for my guide.', kaa: 'Gidimdi kútip atırman.', uz: 'Gidimni kutyapman.', ru: 'Я жду своего гида.' } },
  { id: 18, category: 'meeting', translations: { en: 'What time do we meet?', kaa: 'Qansha waqıtta usırasamız?', uz: "Necha vaqtda uchrashamiz?", ru: 'Во сколько мы встречаемся?' } },
  { id: 19, category: 'meeting', translations: { en: 'I am at the yurt camp.', kaa: 'Men yurt lagerindebin.', uz: 'Men yurt lageridaman.', ru: 'Я в юртовом лагере.' } },
  { id: 20, category: 'meeting', translations: { en: 'My phone number is...', kaa: 'Telefon nomerim...', uz: "Telefon raqamim...", ru: 'Мой номер телефона...' } },
];

export const budgetInterests: string[] = [
  'Aral Sea', 'Ustyurt Plateau', 'Yurt Camps', 'Savitsky Museum',
  'Moynaq Ship Graveyard', 'Desert Trekking', 'Photography', 'Camel Riding',
  'History & Culture', 'Bird Watching',
];

export const tourGroupMeetingPoints = [
  { name: 'Savitsky Museum', x: 55, y: 35 },
  { name: 'Moynaq Ship Graveyard', x: 38, y: 22 },
  { name: 'Ustyurt Yurt Camp', x: 30, y: 50 },
  { name: 'Aral Sea Yurt Camp', x: 40, y: 20 },
  { name: 'Nukus Bazaar', x: 57, y: 38 },
];
