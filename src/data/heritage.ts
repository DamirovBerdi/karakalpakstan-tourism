import type { Lang } from '@/lib/translations';

type LocalizedText = Partial<Record<Lang, string>>;

export interface VirtualTourLocation {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  image: string;
  duration: string;
  tags: string[];
}

export const virtualTours: VirtualTourLocation[] = [
  {
    id: 'moynaq',
    name: {
      en: 'Moynaq Ship Graveyard',
      ru: 'Кладбище кораблей Муйнак',
      uz: "Mo'ynoq kema qabristoni",
      kaa: 'Moynaq keme qábiristanı',
    },
    description: {
      en: 'Walk among rusted fishing trawlers stranded in the desert — a haunting monument to the Aral Sea ecological disaster.',
      ru: 'Прогуляйтесь среди заржавевших траулеров, застрявших в пустыне — жуткий памятник экологической катастрофе Аральского моря.',
      uz: "Cho'lda qolib, zanglagan baliq ovlash kemalari orasida yuring — Orol dengizi ekologik ofatining dahshatli yodgorligi.",
      kaa: 'Shólte qalıp, qıydırlanǵan balıq tutıw kemeleri arasında júriń — Aral teńizi ekologiyalıq apatınıń qorqınıshlı esteligi.',
    },
    image: 'https://images.pexels.com/photos/36446923/pexels-photo-36446923.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    duration: '8 min',
    tags: ['Aral Sea', 'Ecology', 'Moynaq'],
  },
  {
    id: 'savitskiy',
    name: {
      en: 'Savitsky Museum, Nukus',
      ru: 'Музей Савицкого, Нукус',
      uz: 'Savitskiy muzeyi, Nukus',
      kaa: 'Savitskiy muzeyi, Nókis',
    },
    description: {
      en: 'Explore the "Louvre of the Desert" — one of the world\'s finest collections of Russian avant-garde art and Karakalpak treasures.',
      ru: 'Откройте «Лувр пустыни» — одну из лучших в мире коллекций русского авангарда и каракалпакских сокровищ.',
      uz: '"Cho\'l Luvri"ni kashf eting — dunyodagi eng yaxshi rus avangard san\'ati va qoraqalpoq xazinalari kolleksiyasi.',
      kaa: '"Shól Luvri"n ashıń — dúnyadaǵı eń jaqsı orıs avangard kórkem-óner hám qaraqalpaq qazınaları kollekciyası.',
    },
    image: 'https://images.pexels.com/photos/29608796/pexels-photo-29608796.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    duration: '12 min',
    tags: ['Art', 'Museum', 'Nukus'],
  },
  {
    id: 'mizdakhan',
    name: {
      en: 'Mizdakhan Necropolis',
      ru: 'Некрополь Миздахан',
      uz: 'Mizdaxan nekropoli',
      kaa: 'Mizdaxan nekropolisı',
    },
    description: {
      en: 'Wander through 2,000-year-old mausoleums and sacred pilgrimage sites on the ancient hilltop overlooking the Amu Darya delta.',
      ru: 'Прогуляйтесь среди 2000-летних мавзолеев и священных мест паломничества на древнем холме overlooking Амударьинский дельты.',
      uz: 'Amudaryo deltasiga qaragan qadimiy tepalikdagi 2000 yillik maqbaralar va muqaddas ziyoratgohlar orasida yuring.',
      kaa: 'Ámiwdárya deltasına qaraytuǵın áyyemgi tawbasında 2000 jıllıq mavzoleyler hám qasıyetli ziyarat orınları arasında júriń.',
    },
    image: 'https://images.pexels.com/photos/34532131/pexels-photo-34532131.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    duration: '10 min',
    tags: ['History', 'Pilgrimage', 'Ancient'],
  },
  {
    id: 'chilpyk',
    name: {
      en: 'Chilpyk Fortress (Tower of Silence)',
      ru: 'Чильпек (Башня молчания)',
      uz: 'Chilpyk (Sukunat minorasi)',
      kaa: 'Chilpyk (Sútlik Oranı)',
    },
    description: {
      en: 'Stand atop the ancient Zoroastrian dakhma — a sacred circular platform where sky burials once took place, now a windswept desert landmark.',
      ru: 'Стоите на древней зороастрийской дахме — священной круглой платформе, где когда-то совершались погребения неба, теперь это продуваемый ветрами памятник пустыни.',
      uz: 'Qadimiy Zardushtiylik dakhmasi — osmon dafn marosimlari o\'tkaziladigan muqaddas doira platformasi tepasida turing, endi bu cho\'l belgisi.',
      kaa: 'Áyyemgi Zardushtiylik dakhması — aspan dafn marasimleri ótkerilgen qasıyetli sheńber platforması ústinde turıń, házir shól belgisi.',
    },
    image: 'https://images.pexels.com/photos/32309988/pexels-photo-32309988.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    duration: '6 min',
    tags: ['Zoroastrian', 'Sacred', 'Desert'],
  },
];

export interface Museum {
  id: string;
  name: LocalizedText;
  type: LocalizedText;
  description: LocalizedText;
  image: string;
  address: string;
  hours: string;
  phone: string;
  entryFee: string;
  rating: number;
}

export const museums: Museum[] = [
  {
    id: 'savitsky',
    name: {
      en: 'I.V. Savitsky Karakalpakstan State Art Museum',
      ru: 'Государственный музей искусств Каракалпакстана им. И.В. Савицкого',
      uz: 'I.V. Savitskiy nomidagi Qoraqalpog\'iston davlat san\'at muzeyi',
      kaa: 'I.V. Savitskiy atındaǵı Qaraqalpaqstan mámleket kórkem-óner muzeyi',
    },
    type: {
      en: 'Art & History Museum',
      ru: 'Художественный и исторический музей',
      uz: 'San\'at va tarix muzeyi',
      kaa: 'Kórkem-óner hám tariyx muzeyi',
    },
    description: {
      en: 'Called the "Louvre of the Desert," this world-renowned museum houses the second-largest collection of Russian avant-garde art after the Russian Museum in St. Petersburg, plus 90,000 archaeological and ethnographic artifacts spanning 2,000 years of Karakalpak history.',
      ru: 'Называемый «Лувром пустыни», этот всемирно известный музей хранит вторую по величине коллекцию советского и русского авангарда после Русского музея в Санкт-Петербурге, а также 90 000 археологических и этнографических артефактов, охватывающих 2000 лет каракалпакской истории.',
      uz: '"Cho\'l Luvri" deb ataladigan bu jahon miqyosidagi muzey Sankt-Peterburgdagi Rossiya muzeyidan keyin rus avangard san\'atining ikkinchi yirik kolleksiyasini saqlaydi, shuningdek 2000 yillik qoraqalpoq tarixini qamrab olgan 90 000 arxeologik va etnografik artefaktlar.',
      kaa: '"Shól Luvri" atalatuǵın bul jer júzlik belgili muzey Sankt-Peterburgdaǵı Orıs muzeyinen keyin orıs avangard kórkem-óneriniń ekinshi iri kollekciyasın saqlaydı, sonday-aq 2000 jıllıq qaraqalpaq tariyxın qamtıǵan 90 000 arxeologiyalıq hám etnografiyalıq artefaktlar.',
    },
    image: 'https://images.pexels.com/photos/19227978/pexels-photo-19227978.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    address: '219 Raymbek Ave, Nukus 230100',
    hours: '09:00 – 17:00 (Mon–Sat, closed Sun)',
    phone: '+998 (61) 222-15-67',
    entryFee: '40,000 UZS / $3.50',
    rating: 4.9,
  },
  {
    id: 'moynaq-museum',
    name: {
      en: 'Moynaq Regional History & Ecology Museum',
      ru: 'Муйнакский краеведческий и экологический музей',
      uz: "Mo'ynoq tarix va ekologiya muzeyi",
      kaa: 'Moynaq tariyx hám ekologiya muzeyi',
    },
    type: {
      en: 'Ecology & History Museum',
      ru: 'Музей экологии и истории',
      uz: 'Ekologiya va tarix muzeyi',
      kaa: 'Ekologiya hám tariyx muzeyi',
    },
    description: {
      en: 'A poignant tribute to the Aral Sea tragedy. Exhibits include historic photographs of the once-thriving fishing port, model ships, ecological data on the sea\'s retreat, and the story of the people who stayed behind. Located at the entrance to the ship graveyard.',
      ru: 'Пронзительная дань трагедии Аральского моря. Экспонаты включают исторические фотографии некогда процветающего рыбацкого порта, модели кораблей, экологические данные об отступлении моря и историю людей, которые остались. Находится у входа на кладбище кораблей.',
      uz: 'Orol dengizi fojiasiga bag\'ishlangan ta\'sirchan yodgorlik. Eksponatlar orasida bir paytlar gullab-yashnagan baliqchilik portining tarixiy fotosuratlari, kema maketlari, dengiz chekinishi ekologik ma\'lumotlari va ortda qolgan odamlar haqidagi hikoya. Kema qabristoni kirish qismida joylashgan.',
      kaa: 'Aral teńizi faciyasına arnalǵan ta\'sirli estelik. Eksponatlar ishinde bir waqıtları gúllep-jasnaǵan balıqshılıq portınıń tariyxıy fotosúwretleri, keme maketleri, teńiz shekiniwi ekologiyalıq maǵlıwmatları hám artta qalǵan adamlar haqqındaǵı g\'uya. Keme qábiristanı kiriw bóleginde jaylasqan.',
    },
    image: 'https://images.pexels.com/photos/36429277/pexels-photo-36429277.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    address: 'Aral St, Moynaq 230900',
    hours: '08:00 – 18:00 (Daily)',
    phone: '+998 (61) 235-22-40',
    entryFee: '20,000 UZS / $1.75',
    rating: 4.7,
  },
  {
    id: 'berdaq',
    type: {
      en: 'Poetry & Literature Museum',
      ru: 'Музей поэзии и литературы',
      uz: 'She\'riyat va adabiyot muzeyi',
      kaa: 'Poeziya hám ádebiyat muzeyi',
    },
    name: {
      en: 'Berdaq Karakalpak Poetry Museum',
      ru: 'Музей каракалпакской поэзии Бердаха',
      uz: 'Berdaq Qoraqalpoq she\'riyat muzeyi',
      kaa: 'Berdaq Qaraqalpaq poeziya muzeyi',
    },
    description: {
      en: 'Dedicated to Berdaq (1827–1900), the greatest Karakalpak poet and national hero. The museum showcases original manuscripts, traditional musical instruments like the dutar, and immersive exhibits on the oral poetry tradition that shaped Karakalpak identity.',
      ru: 'Посвящён Бердаху (1827–1900), величайшему каракалпакскому поэту и национальному герою. Музей демонстрирует оригинальные рукописи, традиционные музыкальные инструменты вроде дутара и иммерсивные экспозиции устной поэтической традиции, сформировавшей каракалпакскую идентичность.',
      uz: 'Berdaq (1827–1900) — eng buyuk qoraqalpoq shoiri va milliy qahramoniga bag\'ishlangan. Muzeyda asl qo\'lyozmalar, dutar kabi an\'anaviy musiqa asboblari va qoraqalpoq o\'ziga xosligini shakllantirgan og\'zaki she\'riyat an\'anasi ko\'rgazmalari mavjud.',
      kaa: 'Berdaq (1827–1900) — eń ullı qaraqalpaq shayırı hám milliy qaharmanına arnalǵan. Muzeyde túsliq jazbalar, dutar sıyaqlı an\'anaviy muzıka ásbapları hám qaraqalpaq ózine tánligin shakillendirgen awızeki poeziya dástúriniń kórgizbeleri bar.',
    },
    image: 'https://images.pexels.com/photos/19473612/pexels-photo-19473612.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    address: '14 A. Dosnazarov St, Nukus 230100',
    hours: '09:00 – 17:00 (Tue–Sun, closed Mon)',
    phone: '+998 (61) 222-40-11',
    entryFee: '15,000 UZS / $1.30',
    rating: 4.6,
  },
  {
    id: 'karakalpak-national-museum',
    name: {
      en: 'Karakalpak National Museum of History',
      ru: 'Каракалпакский национальный исторический музей',
      uz: 'Qoraqalpog\'iston tarixi milliy muzeyi',
      kaa: 'Qaraqalpaq tariyxı milliy muzeyi',
    },
    type: {
      en: 'National History Museum',
      ru: 'национальный исторический музей',
      uz: 'Milliy tarix muzeyi',
      kaa: 'Milliy tariyx muzeyi',
    },
    description: {
      en: 'A comprehensive journey through Karakalpakstan\'s past — from ancient Khorezm civilizations and Scythian burial mounds to Soviet-era transformations and modern independence. Features archaeological finds, traditional yurt interiors, and coin collections.',
      ru: 'Полное путешествие сквозь историю Каракалпакстана — от древних цивилизаций Хорезма и скифских курганов до советских преобразований и современной независимости. Археологические находки, традиционные интерьеры юрт и коллекции монет.',
      uz: 'Qoraqalpog\'iston o\'tmishi — qadimiy Xorazm sivilizatsiyalari va skif qabrlaridan sovet davri o\'zgarishlari va zamonaviy mustaqillikka qadar bo\'lgan to\'liq sayohat. Arxeologik topilmalar, an\'anaviy yurt interyerlari va tanga kolleksiyalari.',
      kaa: 'Qaraqalpaqstan ótmesi — áyyemgi Xorezm civilizaciyalarınan hám skif qábirlerinden sovet dáwiri ózgerisleri hám zamanag\'yiy ǵárezsizlikke shekem bolǵan tolıq sayaxat. Arxeologiyalıq tabıslar, an\'anaviy yurt ishki bólimleri hám tanga kollekciyaları.',
    },
    image: 'https://images.pexels.com/photos/29975799/pexels-photo-29975799.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    address: '1 K. Junaev St, Nukus 230100',
    hours: '09:00 – 18:00 (Wed–Mon, closed Tue)',
    phone: '+998 (61) 222-33-00',
    entryFee: '25,000 UZS / $2.20',
    rating: 4.5,
  },
];

export interface CraftItem {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  image: string;
  category: 'costume' | 'craft';
  priceRange: string;
}

export const craftItems: CraftItem[] = [
  {
    id: 'saukele',
    name: {
      en: 'Saukele Headdress',
      ru: 'Головной убор саукеле',
      uz: 'Saukele bosh kiyimi',
      kaa: 'Sáwkele bas kiyimi',
    },
    description: {
      en: 'The crown jewel of Karakalpak bridal attire — a tall, conical headdress adorned with silver coins, coral beads, and intricate embroidery. Worn only at weddings, it symbolizes the transition from maidenhood to married life.',
      ru: 'Корона каракалпакского свадебного наряда — высокий конический головной убор, украшенный серебряными монетами, коралловыми бусами и сложной вышивкой. Носится только на свадьбах, символизирует переход от девичества к замужней жизни.',
      uz: 'Qoraqalpoq to\'y kiyimining toj gavhari — kumush tanga, marjon boncuklari va murakkab gulkash bilan bezatilgan baland konussimon bosh kiyimi. Faqat to\'ylarda taqiladi, qizlikdan oilaviy hayotga o\'tishni anglatadi.',
      kaa: 'Qaraqalpaq to\'y kiyiminiń taq gawharı — kúmis tanga, marjan monshaqları hám quramalı naǵıs penen bezelgen biyik konus tárizli bas kiyimi. Tek ǵana toyda taqıladı, qızlıqtan qaterli ómire shańaraqlıq ómisge ótiwdi anglatadı.',
    },
    image: 'https://images.pexels.com/photos/9466563/pexels-photo-9466563.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    category: 'costume',
    priceRange: '$120 – $400',
  },
  {
    id: 'chapan',
    name: {
      en: 'Felt Chapan (Robe)',
      ru: 'Войлочный чапан (халат)',
      uz: 'Zar chapan (ro\'mol)',
      kaa: 'Gúzim chapan (shapan)',
    },
    description: {
      en: 'A traditional felted-wool robe worn by both men and women in winter. Made by pressing and rolling sheep\'s wool into dense, weatherproof fabric. The Karakalpak version features distinctive geometric patterns in deep reds and indigo blues.',
      ru: 'Традиционный валяный шерстяной халат, который носят и мужчины, и женщины зимой. Изготавливается путём прессования и прокатывания овечьей шерсти в плотную, непромокаемую ткань. Каракалпакский вариант отличается характерными геометрическими узорами в глубоких красных и индиго-синих тонах.',
      uz: 'Qishda ham erkaklar, ham ayollar kiyadigan an\'anaviy presslangan jun xalat. Qo\'y junini zich, suv o\'tkazmaydigan mato bo\'lib presslash va o\'rash orqali tayyorlanadi. Qoraqalpoq versiyasi chuqur qizil va indigo ko\'k ranglarda o\'ziga xos geometrik naqshlarga ega.',
      kaa: 'Qısta hám erkekler, hám hayallar kiyetuǵın an\'anaviy basılǵan jún xalat. Qo\'y júnin tıǵız, suw ótkermeytuǵın shıma bolip basıw hám o\'raw arqalı tayarlanadı. Qaraqalpaq nusqası tereń qızıl hám indigo kók reńlerde ózine tán geometriyalıq naqıslarǵa iye.',
    },
    image: 'https://images.pexels.com/photos/5275479/pexels-photo-5275479.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    category: 'costume',
    priceRange: '$50 – $180',
  },
  {
    id: 'shiy',
    name: {
      en: 'Shiy Reed Mat',
      ru: 'Камышовая циновка ший',
      uz: 'Shiy qamish to\'shama',
      kaa: 'Shiy qamıs to\'same',
    },
    description: {
      en: 'Hand-woven from reeds harvested along the Amu Darya delta, shiy mats are the foundation of the Karakalpak yurt. Decorated with symbolic geometric patterns in red, black, and natural tones — each pattern tells a story or wards off evil.',
      ru: 'Плетённые вручную из тростника, собранного в дельте Амударьи, циновки ший — основа каракалпакской юрты. Украшены символическими геометрическими узорами в красных, чёрных и натуральных тонах — каждый узор рассказывает историю или отгоняет зло.',
      uz: 'Amudaryo deltasidan yig\'ilgan qamishlardan qo\'lda to\'qilgan, shiy to\'shamalari qoraqalpoq yurti asosidir. Qizil, qora va tabiiy ohanglarda ramziy geometrik naqshlar bilan bezatilgan — har bir naqsh hikoya so\'zlaydi yoki yovuzlikni qaytaradi.',
      kaa: 'Ámiwdárya deltasınan jıynalǵan qamıslardan qol menen toqılǵan, shiy to\'samaları qaraqalpaq yurti tiykarı. Qızıl, qara hám tabiyiy reńlerde ramzlıq geometriyalıq naqıslar menen bezelgen — hár bir naqıs g\'uya aytadı yamasa jamannı qaytaradı.',
    },
    image: 'https://images.pexels.com/photos/29848181/pexels-photo-29848181.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    category: 'craft',
    priceRange: '$15 – $60',
  },
  {
    id: 'jewelry',
    name: {
      en: 'Silver Jewelry (Kúmis Taqta)',
      ru: 'Серебряные украшения (Кумис Такта)',
      uz: 'Kumush zebolar (Kumis Taqta)',
      kaa: 'Kúmis taqıy (Kúmis Taqta)',
    },
    description: {
      en: 'Karakalpak silversmiths create elaborate necklaces, bracelets, and amulets using techniques passed down for generations. Silver is believed to purify and protect — pieces often feature turquoise, coral, and engraved tribal symbols.',
      ru: 'Каракалпакские ювелиры создают сложные ожерелья, браслеты и амулеты, используя техники, передаваемые из поколения в поколение. Серебро, как считается, очищает и защищает — изделия часто украшены бирюзой, кораллом и гравированными племенными символами.',
      uz: 'Qoraqalpoq kumush ustalari avloddan avlodga o\'tgan usullar yordamida murakkab bilaguzuklar, zeb-ziynatlar va taqinchoqlar yaratadilar. Kumush tozalaydi va himoya qiladi deb ishoniladi — buyumlar ko\'pincha firuza, marjon va o\'yilgan qabila belgilarini o\'z ichiga oladi.',
      kaa: 'Qaraqalpaq kúmis ustaları avloddan avlodqa ótken usıllar menen quramalı boyın jaqular, bilizerlikler hám sabaqlar jaratadı. Kúmis tazalaydı hám qorǵaydı dep iseniledi — buyımlar kóbinese kóktas, marjan hám oyılǵan qabila belgilerin óz ishine aladı.',
    },
    image: 'https://images.pexels.com/photos/33873052/pexels-photo-33873052.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    category: 'craft',
    priceRange: '$30 – $250',
  },
  {
    id: 'felt-making',
    name: {
      en: 'Felt Making (Kiyiz)',
      ru: 'Валяние войлока (Кийиз)',
      uz: 'Zar ishlash (Kiyiz)',
      kaa: 'Gúzim islew (Kiyiz)',
    },
    description: {
      en: 'The ancient art of turning raw sheep\'s wool into felted fabric through heat, moisture, and relentless rolling. Karakalpak women gather in groups to felt together — singing traditional work songs as they press the wool. The result is rugs, saddle blankets, and yurt coverings.',
      ru: 'Древнее искусство превращения сырой овечьей шерсти в валяное полотно с помощью тепла, влаги и непрерывного прокатывания. Каракалпакские женщины собираются группами, чтобы валять вместе — распевая традиционные рабочие песни, пока они прессуют шерсть. Результат — ковры, попоны и покрытия для юрт.',
      uz: 'Xom qo\'y junini issiqlik, namlik va uzluksiz o\'rash orqali zar mato shaklida keltirib chiqarishning qadimiy san\'ati. Qoraqalpoq ayollari junni bosishda birga yig\'ilib, an\'anaviy ish qo\'shiqlarini kuylaydilar. Natijada gilamlar, o\'rtancharlar va yurt qoplamalari hosil bo\'ladi.',
      kaa: 'Xam qo\'y júnin ısıqlıq, ızǵarlıq hám úzliksiz o\'raw arqalı gúzim shıma shaklinde alıp kelıwdiń áyyemgi kórkem-óneri. Qaraqalpaq hayalları júndi basıwda birge jıynılıp, an\'anaviy is qosıqların aytadı. Nátiyjede gilamlar, eyerlikler hám yurt qaplamaları payda boladı.',
    },
    image: 'https://images.pexels.com/photos/9702063/pexels-photo-9702063.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    category: 'craft',
    priceRange: '$25 – $150',
  },
];

export interface SouvenirShop {
  id: string;
  name: string;
  location: string;
  specialties: LocalizedText;
  image: string;
  address: string;
}

export const souvenirShops: SouvenirShop[] = [
  {
    id: 'savitsky-shop',
    name: 'Savitsky Museum Gift Shop',
    location: 'Nukus',
    specialties: {
      en: 'Art prints, books, replica avant-garde posters',
      ru: 'Принты, книги, реплики авангардных плакатов',
      uz: 'San\'at nashrlari, kitoblar, avangard posterlar',
      kaa: 'Kórkem-óner baspaları, kitaplar, avangard posterler',
    },
    image: 'https://images.pexels.com/photos/23726207/pexels-photo-23726207.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    address: 'Inside Savitsky Museum, Nukus',
  },
  {
    id: 'nukus-bazaar',
    name: 'Nukus Bazaar (Downtown Market)',
    location: 'Nukus',
    specialties: {
      en: 'Felt rugs, silver jewelry, shiy mats, chapan robes',
      ru: 'Войлочные ковры, серебряные украшения, циновки ший, чапаны',
      uz: 'Zar gilamlar, kumush zebolar, shiy to\'shamalar, chapanlar',
      kaa: 'Gúzim gilamlar, kúmis taqıylar, shiy to\'samalar, chapanlar',
    },
    image: 'https://images.pexels.com/photos/10020209/pexels-photo-10020209.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    address: 'A. Dosnazarov St, Nukus',
  },
  {
    id: 'moynaq-craft-center',
    name: 'Moynaq Craft Center',
    location: 'Moynaq',
    specialties: {
      en: 'Fish-scale art, Aral Sea photography, eco-crafts',
      ru: 'Искусство из рыбьей чешуи, фотографии Аральского моря, эко-ремёсла',
      uz: 'Baliq tangachasi san\'ati, Orol dengizi fotografiyasi, eko-badiiy buyumlar',
      kaa: 'Balıq qabırshaq kórkem-óneri, Aral teńizi fotosuratı, eko-qol ónerleri',
    },
    image: 'https://images.pexels.com/photos/23726207/pexels-photo-23726207.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    address: 'Near Moynaq Museum, Moynaq',
  },
  {
    id: 'jipek-joli',
    name: 'Jipek Joli Artisan Corner',
    location: 'Nukus',
    specialties: {
      en: 'Handmade saukele replicas, embroidered wall hangings',
      ru: 'Ручные реплики саукеле, вышитые настенные панно',
      uz: 'Qo\'lda tayyorlangan saukele replikalari, gulkash devor qoplama',
      kaa: 'Qol menen tayarlanǵan sáwkele nusqaları, naǵıslı diywal qaplamaları',
    },
    image: 'https://images.pexels.com/photos/10020209/pexels-photo-10020209.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    address: 'Jipek Joli Hotel, Nukus',
  },
];

export interface Dish {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  image: string;
  type: 'soup' | 'main' | 'fish';
  vegetarian: boolean;
}

export const dishes: Dish[] = [
  {
    id: 'jiyde-koye',
    name: {
      en: 'Jiyde Koje (Elm Soup)',
      ru: 'Джиже кожэ (Суп из лоха)',
      uz: 'Jiyda koje (Jiyda sho\'rvasi)',
      kaa: 'Jiyde koje (Jiyde shorbası)',
    },
    description: {
      en: 'A nourishing sour milk soup made with dried elaeagnus (jiyde) fruits, millet, and fresh herbs. This beloved Karakalpak comfort food balances tangy and sweet — traditionally served in summer to cool the body.',
      ru: 'Питательный кисломолочный суп из сушёных плодов лоха (джиде), пшена и свежей зелени. Это любимая каракалпакская домашняя еда, балансирующая кислое и сладкое — традиционно подаётся летом для охлаждения организма.',
      uz: 'Quritilgan jiyda mevalari, tariq va yangi ko\'katlar bilan tayyorlangan o\'ziga xos nordon sut sho\'rvasi. Bu sevimli qoraqalpoq uy ovqati nordon va shirin ta\'mni muvozanatlashtiradi — an\'anaviy ravishda yozda tanani sovutish uchun xizmat qiladi.',
      kaa: 'Qurıtılǵan jiyde miyweleri, kók ten hám jańa ko\'kler menen tayarlanǵan ózine tán qıshqıl sut shorbası. Bul jaqsı kórilgen qaraqalpaq uy awqatı qıshqıl hám shirin ta\'mdi teńlestiredi — dástúrli túrde jazda deneni suwıtıw ushın xızmet etedi.',
    },
    image: 'https://images.pexels.com/photos/15059718/pexels-photo-15059718.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    type: 'soup',
    vegetarian: true,
  },
  {
    id: 'juwiriq',
    name: {
      en: 'Juwiriq (Millet Porridge)',
      ru: 'Жувирик (Пшённая каша)',
      uz: 'Juwiriq (Tariq bo\'tqasi)',
      kaa: 'Juwiriq (Kók bótkesi)',
    },
    description: {
      en: 'A hearty porridge of toasted millet cooked in meat broth with chunks of lamb and root vegetables. Often prepared for family gatherings and celebrations — the golden grains absorb the rich broth for deep, savory flavor.',
      ru: 'Сытная каша из обжаренного пшена, сваренная в мясном бульоне с кусками баранины и корнеплодами. Часто готовится для семейных gatherings и праздников — золотые зёрна впитывают насыщенный бульон для глубокого пикантного вкуса.',
      uz: 'Qovurilgan tariq qo\'y go\'shti buloni va sabzavotlar bilan pishirilgan to\'yimli bo\'tqa. Ko\'pincha oilaviy yig\'ilishlar va bayramlar uchun tayyorlanadi — oltin donlar boy sho\'rvani o\'ziga singdirib, chuqur ta\'m beradi.',
      kaa: 'Qawırılǵan kók ten qoy eti shorbası hám palız eginleri menen pisirilgen to\'yimli bótke. Kóbinese shańaraqlıq jıynalıslar hám bayramlar ushın tayarlanadı — altın dánler bay shorbanı ózine sińdirip, tereń ta\'mdi beredi.',
    },
    image: 'https://images.pexels.com/photos/3559899/pexels-photo-3559899.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    type: 'main',
    vegetarian: false,
  },
  {
    id: 'aral-fish',
    name: {
      en: 'Aral Fish (Sudak & Sazan)',
      ru: 'Аральская рыба (Судак и Сазан)',
      uz: 'Orol baliqlari (Sudak va Sazan)',
      kaa: 'Aral balıqları (Sudak hám Sazan)',
    },
    description: {
      en: 'Before the sea retreated, Moynaq was a thriving fishing port. Today, fish from remaining lakes are grilled, smoked, or dried. Try sudak (pike-perch) grilled over an open flame or sazan (carp) served with traditional flatbread and pickled vegetables.',
      ru: 'До отступления моря Муйнак был процветающим рыбацким портом. Сегодня рыбу из оставшихся озёр жарят, коптят или сушат. Попробуйте судака на открытом огне или сазана с традиционной лепёшкой и маринованными овощами.',
      uz: 'Dengiz chekinmasdan oldin Mo\'ynoq gullab-yashnagan baliqchilik porti edi. Bugun qolgan ko\'llardan baliqlar qovuriladi, dudlanadi yoki quritiladi. Olovda qovurilgan sudak yoki an\'anaviy non va tuzlangan sabzavotlar bilan beriladigan sazanni sinab ko\'ring.',
      kaa: 'Teńiz shekinbewge shekem Moynaq gúllep-jasnaǵan balıqshılıq portı edi. Bugin qalǵan kóllerden balıqlar qawırıladı, dúdilenedi yamasa qurıtıladı. Ot ústinde qawırılǵan sudak yamasa an\'anaviy nan hám tuzlanǵan palız eginleri menen beriletuǵın sazandı sinap ko\'riń.',
    },
    image: 'https://images.pexels.com/photos/19106481/pexels-photo-19106481.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    type: 'fish',
    vegetarian: false,
  },
  {
    id: 'taryk-koye',
    name: {
      en: 'Taryk Koje (Barley Soup)',
      ru: 'Тарык кожэ (Ячменный суп)',
      uz: 'Taryak koje (Arpa sho\'rvasi)',
      kaa: 'Taryk koje (Arpa shorbası)',
    },
    description: {
      en: 'A warming winter soup of pearl barley, qatiq (strained yogurt), and garlic. Thick, creamy, and restorative — it\'s the Karakalpak answer to a cold desert night. Topped with caramelized onions and a swirl of red pepper oil.',
      ru: 'Зимний согревающий суп из перловой крупы, катыка (процеженного йогурта) и чеснока. Густой, кремовый и восстанавливающий — это каракалпакский ответ холодной пустынной ночи. Подается с карамелизированным луком и каплями масла с красным перцем.',
      uz: 'Arpa, qatiq (süzilgan qatiq) va sarimsoqdan tayyorlangan isituvchi qish sho\'rvasi. Qalin, kremli va tiklovchi — bu sovuq cho\'l tuniga qoraqalpoq javobidir. Karamelangan piyoz va qalampir yog\'i bilan beriladi.',
      kaa: 'Arpa, qatiq (súzilgen qatiq) hám sarımsaqtan tayarlanǵan ısıtıwshı qıs shorbası. Qalıń, kremli hám tiklewshi — bul suwıq shól túnine qaraqalpaq juwapı. Karamellanǵan piyaz hám qızıl búrshiq mayı menen beriledi.',
    },
    image: 'https://images.pexels.com/photos/1731535/pexels-photo-1731535.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    type: 'soup',
    vegetarian: true,
  },
];

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  cuisine: LocalizedText;
  image: string;
  address: string;
  hours: string;
  priceLevel: number;
  signatureDish: LocalizedText;
  phone: string;
}

export const restaurants: Restaurant[] = [
  {
    id: 'nukus-city-restaurant',
    name: 'Nukus City Restaurant',
    location: 'Nukus',
    cuisine: {
      en: 'Karakalpak & Uzbek',
      ru: 'Каракалпакская и узбекская',
      uz: 'Qoraqalpoq va o\'zbek',
      kaa: 'Qaraqalpaq hám ózbek',
    },
    image: 'https://images.pexels.com/photos/6876621/pexels-photo-6876621.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    address: '23 T. Shevchenko St, Nukus',
    hours: '10:00 – 23:00 (Daily)',
    priceLevel: 2,
    signatureDish: {
      en: 'Juwiriq with lamb',
      ru: 'Жувирик с бараниной',
      uz: 'Qo\'y go\'shti bilan juwiriq',
      kaa: 'Qoy eti menen juwiriq',
    },
    phone: '+998 (61) 222-15-00',
  },
  {
    id: 'aral-fish-cafe',
    name: 'Aral Fish Cafe',
    location: 'Moynaq',
    cuisine: {
      en: 'Aral Sea Fish Specialties',
      ru: 'Аральская рыба',
      uz: 'Orol dengizi baliq taomlari',
      kaa: 'Aral teńizi balıq tagamları',
    },
    image: 'https://images.pexels.com/photos/12181619/pexels-photo-12181619.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    address: 'Aral St, Moynaq',
    hours: '09:00 – 20:00 (Daily)',
    priceLevel: 1,
    signatureDish: {
      en: 'Grilled sudak with flatbread',
      ru: 'Судак на гриле с лепёшкой',
      uz: 'Non bilan grildagi sudak',
      kaa: 'Nan menen grildegi sudak',
    },
    phone: '+998 (61) 235-23-15',
  },
  {
    id: 'tazhabagat-cafe',
    name: 'Tazhabagat Garden Cafe',
    location: 'Nukus',
    cuisine: {
      en: 'Traditional Karakalpak Home Cooking',
      ru: 'Традиционная каракалпакская домашняя кухня',
      uz: 'An\'anaviy qoraqalpoq uy ovqati',
      kaa: 'An\'anaviy qaraqalpaq uy awqatı',
    },
    image: 'https://images.pexels.com/photos/10148448/pexels-photo-10148448.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    address: '7 K. Sultanbek St, Nukus',
    hours: '11:00 – 22:00 (Daily)',
    priceLevel: 1,
    signatureDish: {
      en: 'Jiyde koje (elm soup)',
      ru: 'Джиже кожэ (суп из лоха)',
      uz: 'Jiyda koje (jiyda sho\'rvasi)',
      kaa: 'Jiyde koje (jiyde shorbası)',
    },
    phone: '+998 (61) 222-42-88',
  },
  {
    id: 'moynaq-port-cafe',
    name: 'Old Port Cafe',
    location: 'Moynaq',
    cuisine: {
      en: 'Fish & Karakalpak Classics',
      ru: 'Рыба и каракалпакская классика',
      uz: 'Baliq va qoraqalpoq taomlari',
      kaa: 'Balıq hám qaraqalpaq tagamları',
    },
    image: 'https://images.pexels.com/photos/12181619/pexels-photo-12181619.jpeg?auto=compress&cs=tinysrgb&w=800&q=75',
    address: 'Port Area, Moynaq',
    hours: '08:00 – 19:00 (Daily)',
    priceLevel: 1,
    signatureDish: {
      en: 'Smoked sazan with pickled vegetables',
      ru: 'Копчёный сазан с маринованными овощами',
      uz: 'Dudlangan sazan tuzlangan sabzavotlar bilan',
      kaa: 'Dúdilengen sazan tuzlanǵan palız eginleri menen',
    },
    phone: '+998 (61) 235-24-01',
  },
];
