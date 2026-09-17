export interface GeoPoint {
  id: string;
  name: string;
  category: 'restaurant' | 'supermarket' | 'pharmacy' | 'bazaar' | 'atm' | 'hospital';
  lat: number;
  lng: number;
  address: string;
  phone?: string;
  city: 'Nukus' | 'Moynaq' | 'Kungrad';
}

export interface HiddenGem {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  image: string;
  photoTips: string;
  difficulty: 'easy' | 'moderate' | 'hard';
}

// Real GPS coordinates for Karakalpakstan points of interest
export const nearbyPoints: GeoPoint[] = [
  // Restaurants
  { id: 'r1', name: 'Nukus City Restaurant', category: 'restaurant', lat: 42.4531, lng: 59.6103, address: '23 T. Shevchenko St, Nukus', phone: '+998 61 222 1500', city: 'Nukus' },
  { id: 'r2', name: 'Tazhabagat Garden Cafe', category: 'restaurant', lat: 42.4614, lng: 59.6170, address: '7 K. Sultanbek St, Nukus', phone: '+998 61 222 4288', city: 'Nukus' },
  { id: 'r3', name: 'Aral Fish Cafe', category: 'restaurant', lat: 43.7789, lng: 59.0200, address: 'Aral St, Moynaq', phone: '+998 61 235 2315', city: 'Moynaq' },
  { id: 'r4', name: 'Old Port Cafe', category: 'restaurant', lat: 43.7800, lng: 59.0190, address: 'Port Area, Moynaq', city: 'Moynaq' },

  // Supermarkets
  { id: 's1', name: 'Mega Nukus Supermarket', category: 'supermarket', lat: 42.4550, lng: 59.6080, address: 'Turtkul Rd, Nukus', city: 'Nukus' },
  { id: 's2', name: 'Korzinka Nukus', category: 'supermarket', lat: 42.4500, lng: 59.6150, address: 'A. Dosnazarov St, Nukus', city: 'Nukus' },
  { id: 's3', name: 'Moynaq Provision Shop', category: 'supermarket', lat: 43.7760, lng: 59.0210, address: 'Center, Moynaq', city: 'Moynaq' },

  // Pharmacies
  { id: 'p1', name: 'Nukus Central Pharmacy', category: 'pharmacy', lat: 42.4520, lng: 59.6120, address: '1 A. Dosnazarov St, Nukus', phone: '+998 61 222 3344', city: 'Nukus' },
  { id: 'p2', name: 'Dori-Darmon Nukus', category: 'pharmacy', lat: 42.4580, lng: 59.6090, address: '15 T. Shevchenko St, Nukus', city: 'Nukus' },
  { id: 'p3', name: 'Moynaq Pharmacy', category: 'pharmacy', lat: 43.7770, lng: 59.0220, address: 'Aral St, Moynaq', city: 'Moynaq' },

  // Bazaars
  { id: 'b1', name: 'Nukus Bazaar (Downtown Market)', category: 'bazaar', lat: 42.4540, lng: 59.6140, address: 'A. Dosnazarov St, Nukus', city: 'Nukus' },
  { id: 'b2', name: 'Turtkol Bazaar', category: 'bazaar', lat: 42.4480, lng: 59.6060, address: 'Turtkul Rd, Nukus', city: 'Nukus' },
  { id: 'b3', name: 'Moynaq Local Market', category: 'bazaar', lat: 43.7750, lng: 59.0230, address: 'Center, Moynaq', city: 'Moynaq' },

  // ATMs
  { id: 'a1', name: 'Hamkorbank ATM', category: 'atm', lat: 42.4535, lng: 59.6105, address: 'A. Dosnazarov St, Nukus', city: 'Nukus' },
  { id: 'a2', name: 'Kapitalbank ATM', category: 'atm', lat: 42.4560, lng: 59.6130, address: 'Turtkul Rd, Nukus', city: 'Nukus' },
  { id: 'a3', name: 'Asaka Bank ATM', category: 'atm', lat: 42.4510, lng: 59.6160, address: 'T. Shevchenko St, Nukus', city: 'Nukus' },
  { id: 'a4', name: 'Moynaq ATM', category: 'atm', lat: 43.7765, lng: 59.0215, address: 'Center, Moynaq', city: 'Moynaq' },

  // Hospitals
  { id: 'h1', name: 'Nukus City Hospital', category: 'hospital', lat: 42.4600, lng: 59.6050, address: 'Berdaq St, Nukus', phone: '+998 61 222 0103', city: 'Nukus' },
  { id: 'h2', name: 'Moynaq Medical Center', category: 'hospital', lat: 43.7740, lng: 59.0240, address: 'Aral St, Moynaq', city: 'Moynaq' },
];

export const hiddenGems: HiddenGem[] = [
  {
    id: 'g1',
    name: 'Ship Bow at Sunset',
    description: 'A lone ship bow rising from the sand — the most dramatic photo spot in the Moynaq graveyard. Arrive 1 hour before sunset for golden hour light.',
    lat: 43.7810,
    lng: 59.0180,
    image: 'https://images.pexels.com/photos/36446923/pexels-photo-36446923.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    photoTips: 'Use a wide-angle lens. Silhouette against the setting sun for maximum drama.',
    difficulty: 'easy',
  },
  {
    id: 'g2',
    name: 'Ustyurt Chalk Cliffs',
    description: 'Otherworldly white chalk formations on the Ustyurt Plateau edge. Few tourists make it here — the colors at dawn are unforgettable.',
    lat: 43.2000,
    lng: 58.5000,
    image: 'https://images.pexels.com/photos/10582941/pexels-photo-10582941.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    photoTips: 'Drone shots are incredible here. Bring water — no shade anywhere.',
    difficulty: 'hard',
  },
  {
    id: 'g3',
    name: 'Sudochye Lake Reeds',
    description: 'A hidden wetland oasis full of migratory birds. Local fishermen can take you out on a small boat for unique perspective shots.',
    lat: 43.6500,
    lng: 58.7000,
    image: 'https://images.pexels.com/photos/7124359/pexels-photo-7124359.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    photoTips: 'Best at sunrise when mist rises off the water. Telephoto lens for birds.',
    difficulty: 'moderate',
  },
  {
    id: 'g4',
    name: 'Mizdakhan at Dawn',
    description: 'The ancient necropolis is magical in the early morning silence — before other visitors arrive, the mausoleums glow in first light.',
    lat: 42.4100,
    lng: 59.5500,
    image: 'https://images.pexels.com/photos/34532131/pexels-photo-34532131.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    photoTips: 'Arrive by 6 AM in summer. The first light hits the domes beautifully.',
    difficulty: 'easy',
  },
  {
    id: 'g5',
    name: 'Chilpyk Panorama',
    description: 'The Zoroastrian Tower of Silence offers a 360° view of the Amu Darya delta. Climb the hill for the best vantage point.',
    lat: 42.4000,
    lng: 59.5800,
    image: 'https://images.pexels.com/photos/32309988/pexels-photo-32309988.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    photoTips: 'Shoot towards the river for the most striking composition.',
    difficulty: 'moderate',
  },
  {
    id: 'g6',
    name: 'Abandoned Lighthouse',
    description: 'A forgotten lighthouse that once guided ships to the Aral Sea port. Now standing alone in the desert — a surreal photo backdrop.',
    lat: 43.7900,
    lng: 59.0100,
    image: 'https://images.pexels.com/photos/14256258/pexels-photo-14256258.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    photoTips: 'Use the structure for scale against the vast emptiness.',
    difficulty: 'moderate',
  },
];

// Haversine distance in km
export function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}
