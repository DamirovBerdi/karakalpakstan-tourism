export interface Mosque {
  id: string;
  name: string;
  nameLocal: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  jumuah: string;
  capacity: number;
  hasWomenSection: boolean;
  hasWudu: boolean;
}

export interface HalalRestaurant {
  id: string;
  name: string;
  nameLocal: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  cuisine: string;
  priceRange: string;
  alcoholFree: boolean;
  certified: boolean;
  rating: number;
}

export interface HeritageSite {
  id: string;
  name: string;
  nameLocal: string;
  type: 'shrine' | 'mosque' | 'necropolis' | 'khanqah';
  lat: number;
  lng: number;
  description: string;
  descriptionLocal: string;
  century: string;
  significance: string;
  image: string;
  visited: boolean;
}

export const mosques: Mosque[] = [
  {
    id: 'm1',
    name: 'Nukus Central Mosque',
    nameLocal: 'Nókis Oraylıq Meshit',
    lat: 42.4531,
    lng: 59.6103,
    address: 'T. Shevchenko St, Nukus',
    city: 'Nukus',
    jumuah: '13:00',
    capacity: 2000,
    hasWomenSection: true,
    hasWudu: true,
  },
  {
    id: 'm2',
    name: 'Moynaq Mosque',
    nameLocal: 'Moynaq Meshit',
    lat: 43.7800,
    lng: 59.1200,
    address: 'Central Square, Moynaq',
    city: 'Moynaq',
    jumuah: '13:00',
    capacity: 300,
    hasWomenSection: false,
    hasWudu: true,
  },
  {
    id: 'm3',
    name: 'Chimboy Friday Mosque',
    nameLocal: 'Shımbay Juma Meshiti',
    lat: 42.9300,
    lng: 59.7100,
    address: 'Amir Temur St, Chimboy',
    city: 'Chimboy',
    jumuah: '13:00',
    capacity: 800,
    hasWomenSection: true,
    hasWudu: true,
  },
  {
    id: 'm4',
    name: 'Kungrad Central Mosque',
    nameLocal: 'Qońırat Oraylıq Meshiti',
    lat: 43.0800,
    lng: 58.9400,
    address: 'A. Dosnazarov St, Kungrad',
    city: 'Kungrad',
    jumuah: '13:00',
    capacity: 1200,
    hasWomenSection: true,
    hasWudu: true,
  },
  {
    id: 'm5',
    name: 'Shumanay Mosque',
    nameLocal: 'Shomanay Meshiti',
    lat: 42.6700,
    lng: 59.4800,
    address: 'Independence St, Shumanay',
    city: 'Shumanay',
    jumuah: '13:00',
    capacity: 500,
    hasWomenSection: false,
    hasWudu: true,
  },
  {
    id: 'm6',
    name: 'Turtkul Juma Mosque',
    nameLocal: 'Tórtkúl Juma Meshiti',
    lat: 41.5500,
    lng: 61.0000,
    address: 'Navoi St, Turtkul',
    city: 'Turtkul',
    jumuah: '13:00',
    capacity: 1000,
    hasWomenSection: true,
    hasWudu: true,
  },
  {
    id: 'm7',
    name: 'Ellikkala Mosque',
    nameLocal: 'Ellikqala Meshiti',
    lat: 42.0700,
    lng: 60.7600,
    address: 'Karakalpak St, Ellikkala',
    city: 'Ellikkala',
    jumuah: '13:00',
    capacity: 600,
    hasWomenSection: false,
    hasWudu: true,
  },
  {
    id: 'm8',
    name: 'Beruni Central Mosque',
    nameLocal: 'Beruniy Oraylıq Meshiti',
    lat: 41.6900,
    lng: 60.7600,
    address: 'A. Timur St, Beruni',
    city: 'Beruni',
    jumuah: '13:00',
    capacity: 900,
    hasWomenSection: true,
    hasWudu: true,
  },
];

export const halalRestaurants: HalalRestaurant[] = [
  {
    id: 'h1',
    name: 'Nukus Pilaf Center',
    nameLocal: 'Nókis Plov Orayı',
    lat: 42.4561,
    lng: 59.6120,
    address: 'Erkin Jomart St 12, Nukus',
    city: 'Nukus',
    cuisine: 'Uzbek / Karakalpak',
    priceRange: '$',
    alcoholFree: true,
    certified: true,
    rating: 4.5,
  },
  {
    id: 'h2',
    name: 'Aral Sea Café',
    nameLocal: 'Aral Teńiz Kafesi',
    lat: 43.7810,
    lng: 59.1210,
    address: 'Port St 5, Moynaq',
    city: 'Moynaq',
    cuisine: 'Seafood / Local',
    priceRange: '$$',
    alcoholFree: true,
    certified: false,
    rating: 4.2,
  },
  {
    id: 'h3',
    name: 'Karakalpak Kitchen',
    nameLocal: 'Qaraqalpaq Ashxanası',
    lat: 42.4540,
    lng: 59.6080,
    address: 'T. Shevchenko St 28, Nukus',
    city: 'Nukus',
    cuisine: 'Traditional Karakalpak',
    priceRange: '$',
    alcoholFree: true,
    certified: true,
    rating: 4.7,
  },
  {
    id: 'h4',
    name: 'Chimboy Lagman House',
    nameLocal: 'Shımbay Lagman Uyı',
    lat: 42.9310,
    lng: 59.7110,
    address: 'Market St 7, Chimboy',
    city: 'Chimboy',
    cuisine: 'Uzbek / Noodle',
    priceRange: '$',
    alcoholFree: true,
    certified: false,
    rating: 4.3,
  },
  {
    id: 'h5',
    name: 'Kungrad Teahouse',
    nameLocal: 'Qońırat Sháyxanası',
    lat: 43.0810,
    lng: 58.9410,
    address: 'Central Bazaar, Kungrad',
    city: 'Kungrad',
    cuisine: 'Tea / Pastries',
    priceRange: '$',
    alcoholFree: true,
    certified: true,
    rating: 4.4,
  },
  {
    id: 'h6',
    name: 'Turtkul Family Restaurant',
    nameLocal: 'Tórtkúl Shańaraq Restoranı',
    lat: 41.5510,
    lng: 61.0010,
    address: 'Navoi St 15, Turtkul',
    city: 'Turtkul',
    cuisine: 'Uzbek / Grill',
    priceRange: '$$',
    alcoholFree: true,
    certified: true,
    rating: 4.6,
  },
  {
    id: 'h7',
    name: 'Savitsky Café',
    nameLocal: 'Savitskiy Kafesi',
    lat: 42.4520,
    lng: 59.6110,
    address: ' museum Quarter, Nukus',
    city: 'Nukus',
    cuisine: 'International / Vegetarian',
    priceRange: '$$',
    alcoholFree: true,
    certified: false,
    rating: 4.1,
  },
  {
    id: 'h8',
    name: 'Ellikkala Shashlik',
    nameLocal: 'Ellikqala Shashlik',
    lat: 42.0710,
    lng: 60.7610,
    address: 'Karakalpak St 3, Ellikkala',
    city: 'Ellikkala',
    cuisine: 'Grill / Kebab',
    priceRange: '$',
    alcoholFree: true,
    certified: false,
    rating: 4.0,
  },
];

export const heritageSites: HeritageSite[] = [
  {
    id: 'hs1',
    name: 'Mizdakhan Necropolis',
    nameLocal: 'Mizdaxan Mákan-jayı',
    type: 'necropolis',
    lat: 42.3940,
    lng: 59.5170,
    description: 'One of Central Asia\'s oldest sacred complexes, dating back over 2000 years. Contains the tomb of Adam (as local tradition), the World Clock, and the seven-meter Shamun Nabi sarcophagus. A major ziyarat pilgrimage destination.',
    descriptionLocal: 'Oraylıq Aziyadaǵı eń áyyemgi múqaddes komplekslerden biri. Adam (xaliq) qábiri, Jáhán Saatı hám Shamun Nabi lahadı bar.',
    century: '4th century BCE',
    significance: 'Major ziyarat site — pilgrims come from across Central Asia',
    image: 'https://images.pexels.com/photos/1654748/pexels-photo-1654748.jpeg',
    visited: false,
  },
  {
    id: 'hs2',
    name: 'Konya-Urgench Minaret',
    nameLocal: 'Kóne Úrgenish Minarası',
    type: 'mosque',
    lat: 42.3100,
    lng: 59.1600,
    description: 'A 14th-century minaret (Kutlug-Timur) standing 62 meters tall — the tallest in Central Asia. Part of a UNESCO World Heritage Site that was once a great Islamic center of learning.',
    descriptionLocal: 'XIV ásir minarası, Oraylıq Aziyadaǵı eń bálent (62 m). YUNESKO Jan-pánlisindegi úlken islam bilim orayı bolǵan.',
    century: '14th century CE',
    significance: 'UNESCO World Heritage Site',
    image: 'https://images.pexels.com/photos/1654748/pexels-photo-1654748.jpeg',
    visited: false,
  },
  {
    id: 'hs3',
    name: 'Shamun Nabi Mausoleum',
    nameLocal: 'Shamun Nabi Mazarı',
    type: 'shrine',
    lat: 42.3930,
    lng: 59.5180,
    description: 'Located within the Mizdakhan complex, this 18-meter-long sarcophagus is attributed to the Prophet Shamun Nabi (a.s.). Despite its length, local tradition says the prophet was of giant stature.',
    descriptionLocal: 'Mizdakhan ishinde jaylasqan. Shamun Nabi (a.s.) dep atalatuǵın 18 metrli lahad.',
    century: '9th-12th century CE',
    significance: 'Active ziyarat pilgrimage site',
    image: 'https://images.pexels.com/photos/1654748/pexels-photo-1654748.jpeg',
    visited: false,
  },
  {
    id: 'hs4',
    name: 'Dzhumart Mosque',
    nameLocal: 'Jumart Meshiti',
    type: 'mosque',
    lat: 42.4500,
    lng: 59.6100,
    description: 'A historic Friday mosque in central Nukus, rebuilt in the 19th century on the site of an older structure. Known for its traditional Karakalpak architectural elements.',
    descriptionLocal: 'Nókis orayındaǵı tarixiyy Juma meshiti, XIX ásirde qayta qurılǵan.',
    century: '19th century CE',
    significance: 'Active place of worship',
    image: 'https://images.pexels.com/photos/1654748/pexels-photo-1654748.jpeg',
    visited: false,
  },
  {
    id: 'hs5',
    name: "Kyzyl Kal'a Caravanserai",
    nameLocal: 'Qızıl Qala Karvansarayı',
    type: 'khanqah',
    lat: 42.0800,
    lng: 60.7500,
    description: 'A 12th-century fortified caravanserai that served as a rest stop and prayer site for Silk Road travelers. Features a small prayer hall with mihrab facing Mecca.',
    descriptionLocal: 'XII ásir qorǵan karvansarayı, Jibek jolı sayaxatshıları ushın dem alıs hám namaz orayı bolǵan.',
    century: '12th century CE',
    significance: 'Silk Road heritage',
    image: 'https://images.pexels.com/photos/1654748/pexels-photo-1654748.jpeg',
    visited: false,
  },
  {
    id: 'hs6',
    name: 'Chilpyk Dakhma',
    nameLocal: 'Shilpiq Dahması',
    type: 'shrine',
    lat: 42.0800,
    lng: 59.5300,
    description: 'A Zoroastrian tower of silence later adopted as an Islamic pilgrimage landmark. Pilgrims tie strips of cloth to the surrounding bushes while making dua for healing and blessings.',
    descriptionLocal: 'Zardushtiy dahma, keyin islam ziyarat orayına ayırılǵan. Shıbınshılar shaqalarǵa shash baǵıshlap, dua oqıydı.',
    century: '1st century BCE',
    significance: 'Cross-faith pilgrimage landmark',
    image: 'https://images.pexels.com/photos/1654748/pexels-photo-1654748.jpeg',
    visited: false,
  },
];

export interface JumuahInfo {
  mosque: string;
  city: string;
  khutbahTime: string;
  prayerTime: string;
  language: string;
}

export const jumuahTimes: JumuahInfo[] = [
  { mosque: 'Nukus Central Mosque', city: 'Nukus', khutbahTime: '12:45', prayerTime: '13:00', language: 'Karakalpak / Uzbek' },
  { mosque: 'Chimboy Friday Mosque', city: 'Chimboy', khutbahTime: '12:45', prayerTime: '13:00', language: 'Karakalpak' },
  { mosque: 'Kungrad Central Mosque', city: 'Kungrad', khutbahTime: '12:45', prayerTime: '13:00', language: 'Karakalpak / Uzbek' },
  { mosque: 'Turtkul Juma Mosque', city: 'Turtkul', khutbahTime: '12:45', prayerTime: '13:00', language: 'Uzbek' },
];

export interface EidInfo {
  name: string;
  nameLocal: string;
  date: string;
  prayerTime: string;
  location: string;
  description: string;
}

export const eidInfo: EidInfo[] = [
  {
    name: 'Eid al-Fitr',
    nameLocal: 'Oraza Hayit',
    date: 'April 10, 2024',
    prayerTime: '06:30',
    location: 'Nukus Central Mosque & all city mosques',
    description: 'Celebration marking the end of Ramadan. Special Eid prayer held in the morning followed by community feasts and family visits.',
  },
  {
    name: 'Eid al-Adha',
    nameLocal: 'Qurban Hayit',
    date: 'June 16, 2024',
    prayerTime: '06:15',
    location: 'Nukus Central Mosque & all city mosques',
    description: 'The Festival of Sacrifice, commemorating Prophet Ibrahim\'s (a.s.) devotion. Includes the ritual sacrifice of livestock and distribution of meat to the needy.',
  },
];

export interface EtiquetteTip {
  id: string;
  icon: string;
  title: string;
  titleLocal: string;
  description: string;
  descriptionLocal: string;
}

export const etiquetteTips: EtiquetteTip[] = [
  {
    id: 'e1',
    icon: 'Shirt',
    title: 'Modest Dress at Holy Sites',
    titleLocal: 'Múqaddes Orınlarda Tınıq Kiyim',
    description: 'When visiting mosques, shrines, or necropolises, both men and women should cover shoulders and knees. Women should cover their hair with a scarf. Long sleeves and loose-fitting clothing are preferred.',
    descriptionLocal: 'Meshit, mazar yamasa mákan-jaylarǵa barǵanda, er adam hám hayallar qoltıqların hám tizilerin jabıwları kerek. Hayallar shashın shármen menen jabıwı kerek.',
  },
  {
    id: 'e2',
    icon: 'Footprints',
    title: 'Remove Shoes',
    titleLocal: 'Ayaq Kiyimdi Sheshiń',
    description: 'Always remove your shoes before entering a mosque or prayer room. Look for the designated shoe area at the entrance. Socks are recommended.',
    descriptionLocal: 'Meshitke yamasa namaz bólmelerine kiriwden aldın ayaq kiyimdi sheshiń. Kiris jasında arnawlı orın bar.',
  },
  {
    id: 'e3',
    icon: 'Users',
    title: 'Gender Separation',
    titleLocal: 'Jınıs Ayırması',
    description: 'Most mosques have separate prayer areas for men and women. Women may pray in a designated section or behind the men\'s area. Follow local signage and ask if unsure.',
    descriptionLocal: 'Meshitlerde er adam hám hayallar ushın arnawlı namaz orınları bar. Belgilerdi qabılap etiń.',
  },
  {
    id: 'e4',
    icon: 'Camera',
    title: 'Photography Etiquette',
    titleLocal: 'Fotografiya Etikası',
    description: 'Ask permission before photographing people, especially at prayer. Some mosques may restrict photography inside the prayer hall. Always be respectful during worship times.',
    descriptionLocal: 'Adamlardı, ásirese namaz waqtında, fotografiya etiwden aldın ruqsat sorıń. Kóp meshitlerde namaz bólmesinde foto túsiriw sheklengen.',
  },
  {
    id: 'e5',
    icon: 'Hand',
    title: 'Right Hand Usage',
    titleLocal: 'On Qoldan Paydalanıw',
    description: 'Use your right hand for eating, greeting, and passing objects. This is an Islamic tradition widely observed in Karakalpak culture. Shake hands only with the same gender unless offered first.',
    descriptionLocal: 'Awqatlanıw, amalsarıw hám zatlardı beriw ushın on qoldı paydalanıń. Bul islam an\'anasi qaraqalpaq mádeniyatında keń qabıl etiledi.',
  },
  {
    id: 'e6',
    icon: 'Moon',
    title: 'Ramadan Considerations',
    titleLocal: 'Ramazan Esaplawları',
    description: 'During Ramadan, avoid eating, drinking, or smoking in public during daylight hours out of respect for those fasting. Restaurants may have screened areas. Iftar meals are often community events.',
    descriptionLocal: 'Ramazan waqtında kúndiz ashıq orınlarda awqatlanıw, ishiw yamasa sheshiwdan qashıń. Restoranlar parda orınları bolıwı múmkin. Ifmar awqatları kóbinese jámiyetlik ilajlar.',
  },
];
