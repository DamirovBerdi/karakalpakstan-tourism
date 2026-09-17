import type { Lang } from '@/lib/translations';

type LocalizedText = Partial<Record<Lang, string>>;

export interface Festival {
  id: number;
  name: LocalizedText;
  month: number;
  day: number;
  endDate?: number;
  venue: LocalizedText;
  category: 'cultural' | 'eco' | 'music' | 'national' | 'historical';
  description: LocalizedText;
  image: string;
}

export interface HiddenGem {
  id: number;
  name: LocalizedText;
  location: LocalizedText;
  category: 'nature' | 'culture' | 'history';
  description: LocalizedText;
  tip: LocalizedText;
  image: string;
}

export interface ItineraryActivity {
  id: number;
  name: LocalizedText;
  interests: string[];
  duration: string;
  cost: string;
  icon: string;
}

export const FESTIVALS: Festival[] = [
  {
    id: 1,
    name: {
      en: "Navruz Spring Festival",
      ru: "Праздник Навруз",
      uz: "Navruz Bahor Bayrami",
      kaa: "Navruz Baxar Bayramı",
    },
    month: 3,
    day: 21,
    venue: {
      en: "Nukus Central Square & Parks",
      ru: "Центральная площадь и парки Нукуса",
      uz: "Nukus Markaziy Maydoni va Bog'lari",
      kaa: "Nókis Oraylıq Maydanı hám Baǵları",
    },
    category: 'cultural',
    description: {
      en: "The Persian New Year and the biggest cultural celebration in Karakalpakstan. Traditional wrestling (kurash), horseback games, folk music, and huge spreads of sumalak — a sweet wheat-germ paste cooked overnight. Free to attend.",
      ru: "Персидский Новый год и крупнейшее культурное празднование в Каракалпакстане. Традиционная борьба (кураш), конные игры, народная музыка и огромные столы с сумалаком — сладкой пастой из пророщенной пшеницы. Вход свободный.",
      uz: "Fors Yangi yili va Qoraqalpog'istondagi eng katta madaniy bayram. An'anaviy kurash, ot o'yinlari, xalq musiqasi va sumalak tarqatish. Bepul.",
      kaa: "Fors Jańa jılı hám Qaraqalpaqstandaǵı eń úlken mádeniy bayram. An'anagóy kurash, at oyınları, xalıq muzıkası hám sumalak tarqatıw. Biypul.",
    },
    image: "https://images.pexels.com/photos/1078958/pexels-photo-1078958.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 2,
    name: {
      en: "Aral Sea Eco-Festival & Ice Festival",
      ru: "Эко-фестиваль Аральского моря и Ледяной фестиваль",
      uz: "Orol Dengizi Eko-Festivali va Muz Festivali",
      kaa: "Aral Teńizi Eko-Festivalı hám Muz Festivalı",
    },
    month: 2,
    day: 10,
    endDate: 12,
    venue: {
      en: "Moynaq, former seaport",
      ru: "Муйнак, бывший морской порт",
      uz: "Mo'ynoq, sobiq dengiz porti",
      kaa: "Moynaq, burınǵı teńiz portı",
    },
    category: 'eco',
    description: {
      en: "A unique winter festival on the dry bed of the Aral Sea. Ice sculptures carved from the frozen salt flats, eco-activism talks, photography exhibitions of the ship graveyard, and traditional music. A powerful reminder of the Aral tragedy and a call for ecological awareness.",
      ru: "Уникальный зимний фестиваль на пересохшем дне Аральского моря. Ледяные скульптуры из замёрзших солончаков, эко-дискуссии, фотовыставки кладбища кораблей и традиционная музыка. Мощное напоминание об аральской трагедии.",
      uz: "Orol dengizi quruq tubidagi noyob qish festivali. Muz haykallari, eko-aktivizm suhbatlari, kema qabristoni fotosergihamlari va an'anaviy musiqa.",
      kaa: "Aral teńizi qurǵaq astındaǵı noyob qıs festivalı. Muz háykelleri, eko-aktivizm sóylesiwleri, keme qábiristanı fotosergihamları hám an'anagóy muzıka.",
    },
    image: "https://images.pexels.com/photos/349879/pexels-photo-349879.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 3,
    name: {
      en: "Stikhiya Electronic Music Festival",
      ru: "Фестиваль электронной музыки Стихия",
      uz: "Stikhiya Elektron Musiqa Festivali",
      kaa: "Stikhiya Elektron Muzıka Festivalı",
    },
    month: 8,
    day: 15,
    endDate: 17,
    venue: {
      en: "Aral Sea shore, near Moynaq",
      ru: "Берег Аральского моря, рядом с Муйнаком",
      uz: "Orol dengizi qirg'og'i, Mo'ynoq yaqinida",
      kaa: "Aral teńizi qıyaǵı, Moynaqqa jaqında",
    },
    category: 'music',
    description: {
      en: "A surreal electronic music festival held on the barren shores of the Aral Sea — where the water used to be. International and local DJs perform against the backdrop of the retreating sea and the ship graveyard. Camping available. Tickets ~$40–60.",
      ru: "Сюрреалистичный фестиваль электронной музыки на пустынных берегах Аральского моря. Международные и местные диджеи выступают на фоне отступающего моря и кладбища кораблей. Палатки доступны. Билеты ~$40–60.",
      uz: "Orol dengizining cho'l qirg'og'idagi g'aroyib elektron musiqa festivali. Mahalliy va xalqaro DJ'lar. Chodir mavjud. Bilet ~$40–60.",
      kaa: "Aral teńiziniń shól qıyaǵındaǵı g'arripa elektron muzıka festivalı. Jergilikli hám xalıqaralıq DJ'lar. Shatır bar. Bilet ~$40–60.",
    },
    image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 4,
    name: {
      en: "Independence Day Celebration",
      ru: "Праздник Дня Независимости",
      uz: "Mustaqillik Kuni Bayrami",
      kaa: "Mustaqillıq Kúni Bayramı",
    },
    month: 9,
    day: 1,
    venue: {
      en: "Nukus, city-wide",
      ru: "Нукус, по всему городу",
      uz: "Nukus, shahar bo'ylab",
      kaa: "Nókis, qala boyınsha",
    },
    category: 'national',
    description: {
      en: "Uzbekistan's Independence Day with parades, concerts, fireworks over the Amu Darya, and traditional food stalls throughout Nukus. Free public celebrations. A festive atmosphere with street performances and family events.",
      ru: "День независимости Узбекистана с парадами, концертами, фейерверками над Амударьей и традиционными продуктовыми лавками по всему Нукусу. Бесплатные публичные празднования.",
      uz: "O'zbekiston Mustaqillik kuni paradlari, kontsertlari, Amudaryo ustida otashinlar va an'anaviy ovqat stendlari bilan. Bepul.",
      kaa: "Ózbekstan Mustaqillıq kúni paradları, kontsertleri, Ámiwdárya ústinde otashınlar hám an'anagóy azıq stendleri menen. Biypul.",
    },
    image: "https://images.pexels.com/photos/259868/pexels-photo-259868.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 5,
    name: {
      en: "Ancient Fortress Tour — Ellikkala & Tortkul",
      ru: "Тур по древним крепостям — Эллиkkalа и Торткуль",
      uz: "Qadimiy Qal'a Turi — Ellikkala va To'rtko'l",
      kaa: "Áyyemgi Qorǵan Turi — Ellikkala hám Tortkul",
    },
    month: 10,
    day: 5,
    endDate: 7,
    venue: {
      en: "Ellikkala & Tortkul districts",
      ru: "Районы Эллиkkalа и Торткуль",
      uz: "Ellikkala va To'rtko'l tumanlari",
      kaa: "Ellikkala hám Tortkul rayonları",
    },
    category: 'historical',
    description: {
      en: "An annual guided expedition to the ancient Khorezm fortresses — Toprak-Kala, Ayaz-Kala, and Kyzyl-Kala. Archaeologists lead tours through 2,000-year-old mud-brick ruins with sunset views from the fortress walls. Camping under the stars at Ayaz-Kala. ~$25 per person.",
      ru: "Ежегодная экспедиция к древним крепостям Хорезма — Топрак-Кала, Аяз-Кала и Кызыл-Кала. Археологи ведут экскурсии по 2000-летним руинам из сырцового кирпича с видом на закат со стен крепостей. Ночёвка под звёздами у Аяз-Кала. ~$25 с человека.",
      uz: "Qadimiy Xorazm qal'alari — Toproq-Qal'a, Ayoz-Qal'a va Qizil-Qal'a'ga yillik ekspeditsiya. Arxeologlar 2000 yillik xom g'isht xarobalari bo'ylab tur olib boradilar. Yulduzlar ostida lager. ~$25 kishi boshiga.",
      kaa: "Áyyemgi Xorezm qorǵanları — Topraq-Qala, Ayaz-Qala hám Qızıl-Qala'ǵa jılına ekspediciya. Arxeologlar 2000 jıllıq shiy gerbish xarabaları boyınsha tur alıp baradı. Juldızlar astında lager. ~$25 kisi basına.",
    },
    image: "https://images.pexels.com/photos/260929/pexels-photo-260929.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 6,
    name: {
      en: "Karakalpak Cotton & Craft Harvest Fair",
      ru: "Каракалпакская хлопковая и ремесленная ярмарка",
      uz: "Qoraqalpoq Paxta va Hunarmandlik Yarmarkasi",
      kaa: "Qaraqalpaq Paxta hám Hunarmentlik Yarmarkası",
    },
    month: 11,
    day: 10,
    endDate: 15,
    venue: {
      en: "Nukus Bazaar & Savitsky Museum grounds",
      ru: "Базар Нукуса и территория музея Савицкого",
      uz: "Nukus Bozori va Savitskiy muzeyi maydoni",
      kaa: "Nókis Bazarı hám Savitskiy muzeyi maydanı",
    },
    category: 'cultural',
    description: {
      en: "A week-long celebration of Karakalpak craftsmanship during the cotton harvest. Traditional carpet weaving demonstrations, silver jewelry stalls, embroidered suzani panels, and folk dance performances. Buy direct from artisans at fair prices. Free entry.",
      ru: "Недельный праздник каракалпакского ремесла во время сбора хлопка. Демонстрация традиционного ткачества ковров, лавки серебряных украшений, вышитые сузани и выступления народных танцев. Покупка напрямую у ремесленников. Вход свободный.",
      uz: "Paxta yig'im-terimi davomida Qoraqalpoq hunarmandchiligini nishonlash. An'anaviy gilam to'qish ko'rgazmasi, kumush zeb-ziynat, kashta tikish va xalq raqslari. Hunarmandlardan to'g'ridan-to'g'ri. Bepul.",
      kaa: "Paxta jıyıw-terimi dawamında Qaraqalpaq hunarmentligin nishanlaw. An'anagóy gilem toqıw kórgazması, kúmis ziynet, shıyǵıslaw hám xalıq oyınları. Hunarmentlerden tikkeley. Biypul.",
    },
    image: "https://images.pexels.com/photos/6193462/pexels-photo-6193462.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

export const HIDDEN_GEMS: HiddenGem[] = [
  {
    id: 1,
    name: {
      en: "Chermen Well — Sacred Spring",
      ru: "Колодец Чермен — Священный источник",
      uz: "Chermen Quduq — Muqaddas Buloq",
      kaa: "Chermen Quduq — Muqaddas Bulaq",
    },
    location: {
      en: "Near Shomanay, ~40km from Nukus",
      ru: "Возле Шоманая, ~40км от Нукуса",
      uz: "Shomana yaqinida, Nukusdan ~40km",
      kaa: "Shomanay jaqınında, Nókisten ~40km",
    },
    category: 'nature',
    description: {
      en: "A hidden natural spring tucked in the desert that locals consider sacred. The water is said to have healing properties. Surrounded by ancient tamara trees, it's a peaceful, almost magical spot almost no tourists know about.",
      ru: "Скрытый природный источник в пустыне, который местные жители считают священным. Говорят, вода обладает целебными свойствами. Окружён древними тамарисками — умиротворённое, почти магическое место, о котором почти не знают туристы.",
      uz: "Cho'lda yashirin muqaddas tabiiy buloq. Suv davolovchi xususiyatga ega deyiladi. Qadimiy daraxtlar bilan o'ralgan, turistlar deyarli bilmaydigan tinch joy.",
      kaa: "Shólda jasırın muqaddas tabiy bulaq. Suw shıpalıq qásiyetke iye deyiledi. Áyyemgi terekler menen oralǵan, turistler derlik bilmeytin tınısh jer.",
    },
    tip: {
      en: "Bring your own container — no shops nearby. Ask a local in Shomanay for directions; GPS is unreliable here.",
      ru: "Возьмите свою тару — магазинов поблизости нет. Спросите у местных в Шоманае дорогу; GPS здесь ненадёжен.",
      uz: "O'z idishingizni oling — yaqinda do'kon yo'q. Shomana mahalliy aholisidan yo'l so'rang; GPS ishlamaydi.",
      kaa: "Óz idisińizdi alıń — jaqında dúkan joq. Shomanay jergilikli xalqınan jol soráń; GPS islemeydi.",
    },
    image: "https://images.pexels.com/photos/2406730/pexels-photo-2406730.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 2,
    name: {
      en: "Kikentash Rock Formation",
      ru: "Скальное образование Кикенташ",
      uz: "Kikentash Tosh Formasiyasi",
      kaa: "Kikentash Tas Formaciyası",
    },
    location: {
      en: "Sultanuizdag Mountains, near Kungrad",
      ru: "Горы Султануиздаг, около Кунграда",
      uz: "Sulton Uvays tog'lari, Qo'ng'irotda",
      kaa: "Sultanuizdag tawları, Qońıratqa jaqında",
    },
    category: 'nature',
    description: {
      en: "A bizarre, towering rock spire rising from the Sultanuizdag ridge. Local legends say it was a petrified giant. The hike up offers panoramic views of the Amu Darya delta. Almost zero tourist infrastructure — pure adventure.",
      ru: "Причудливая возвышающаяся скала, растущая из хребта Султануиздаг. Местные легенды гласят, что это окаменевший великан. Подъём открывает панорамные виды на дельту Амударьи. Почти нулевая туристическая инфраструктура — чистое приключение.",
      uz: "Sulton Uvays tizmasidan ko'tariladigan g'aroyiq qoya. Mahalliy afsonalar bo'yicha toshga aylangan ulug'vor. Panoramali Amudaryo deltasi manzarasi.",
      kaa: "Sultanuizdag tiziminen kóteriletuǵın g'arripa qoya. Jergilikli afsonalar boyınsha tasqa aylanǵan ulıwma. Panoramalı Ámiwdárya deltası kórinisi.",
    },
    tip: {
      en: "Hire a local taxi from Kungrad (~$10 round trip). Best at sunrise — the rock glows orange. Wear sturdy shoes.",
      ru: "Возьмите местное такси из Кунграда (~$10 туда-обратно). Лучше на рассвете — скала светится оранжевым. Наденьте крепкую обувь.",
      uz: "Qo'ng'irotdan mahalliy taksi yollang (~$10). Tongi eng yaxshi — qoya to'q sariq yonadi. Mustahkam oyoq kiyim kiyish.",
      kaa: "Qońırattan jergilikli taksi jallań (~$10). Tań atıwında eń jaqsı — qoya narınjalıq janadı. Bekkem ayaq kiyim kiyiw.",
    },
    image: "https://images.pexels.com/photos/1538154/pexels-photo-1538154.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 3,
    name: {
      en: "Madiyar's Yurt — Home-Stay Experience",
      ru: "Юрта Мадияра — Домашнее проживание",
      uz: "Madiyarning Yurtasi — Uyda Yashash",
      kaa: "Madiyardıń Yurtası — Úyde Jasaw",
    },
    location: {
      en: "Chimboy district, ~60km from Nukus",
      ru: "Чимбайский район, ~60км от Нукуса",
      uz: "Chimboy tumani, Nukusdan ~60km",
      kaa: "Chimboy rayonı, Nókisten ~60km",
    },
    category: 'culture',
    description: {
      en: "Not a commercial yurt camp — a real Karakalpak family's home. Madiyar and his wife host travelers in their traditional yurt, cook authentic beshbarmak, and teach carpet weaving. The most genuine cultural immersion you can find. ~$15/night including meals.",
      ru: "Не коммерческий юртовый лагерь — настоящий дом каракалпакской семьи. Мадияр и его жена принимают путешественников в традиционной юрте, готовят аутентичный бешбармак и учат ткать ковры. Самое подлинное культурное погружение. ~$15/ночь с едой.",
      uz: "Tijoriy yurt lageri emas — haqiqiy Qoraqalpoq oilasi uyi. Madiyar va rafiqasi sayohatchilarni an'anaviy yurtada qabul qilishadi, beshbarmak pishirishadi. ~$15/tun ovqat bilan.",
      kaa: "Tijoriy yurt lageri emes — haqıyqiy Qaraqalpaq shańaraǵı úyi. Madiyar hám zayıpı sayaxatshılardı an'anagóy yurtada qabıl etedi, beshbarmak pisiredi. ~$15/tún azıq menen.",
    },
    tip: {
      en: "Call ahead — no internet booking. Ask at Chimboy Guest House to arrange contact. Bring a small gift (tea or sweets).",
      ru: "Звоните заранее — интернет-бронирования нет. Спросите в гостевом доме Чимбоя, чтобы связаться. Принесите небольшой подарок (чай или сладости).",
      uz: "Oldindan qo'ng'iroq qiling — internet bronlash yo'q. Chimboy Mehmon Uyida bog'lanishni so'rang. Kichik sovg'a oling (choy yoki shirinlik).",
      kaa: "Aldın dawıs salıń — internet bronlew joq. Chimboy Miyman Úyinde baylanıstı soráń. Kishi sawǵa alıń (shay yaki tatlı).",
    },
    image: "https://images.pexels.com/photos/2823037/pexels-photo-2823037.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 4,
    name: {
      en: "Kazakdy-Kyr — The Singing Dunes",
      ru: "Казакды-Кыр — Поющие барханы",
      uz: "Qozoqdiquir — Kuylagan Qumlar",
      kaa: "Qazaqdıqır — Sazlanǵan Qumlar",
    },
    location: {
      en: "Eastern Karakalpakstan, ~100km from Nukus",
      ru: "Восточный Каракалпакстан, ~100км от Нукуса",
      uz: "Sharqiy Qoraqalpog'iston, Nukusdan ~100km",
      kaa: "Shıǵıs Qaraqalpaqstan, Nókisten ~100km",
    },
    category: 'nature',
    description: {
      en: "A remote dune field where the sand produces a low humming sound when wind sweeps across the ridges — and a louder boom if you slide down. The phenomenon is rare and deeply atmospheric. No signs, no guides — you'll likely have it entirely to yourself.",
      ru: "Удалённое дюнное поле, где песок издаёт низкий гул, когда ветер пересекает гребни — и более громкий грохот, если скатиться вниз. Явление редкое и глубоко атмосферное. Никаких вывесок, гидов — скорее всего, будете там одни.",
      uz: "Shamol qum tepalari bo'ylab esganda past g'uldir ovoz chiqaradigan uzoq qum maydoni — va pastga siralsangiz undan ham baland ovoz. Kam uchraydigan hodisa. Belgilarsiz, gidlarsiz.",
      kaa: "Samal qum tawları boyınsha eskende tómengi gúldir dawıs shıǵatuǵın uzaq qum maydanı — hám tómenge siralsańız odan da balándawıs. Siyrek ushıraytuǵın hadise. Belgisiz, gidlerisiz.",
    },
    tip: {
      en: "You need a 4x4 to reach this area — share a jeep with other travelers from Nukus (~$25/person). Go in the afternoon when wind picks up.",
      ru: "Нужен 4x4, чтобы добраться — разделите джип с другими путешественниками из Нукуса (~$25/человек). Идите днём, когда поднимается ветер.",
      uz: "Bu yerga 4x4 kerak — Nukusdan boshqa sayohatchilar bilan jeepni bo'ling (~$25/kishi). Tushdan keyin shamol kuchayganda borgan ma'qul.",
      kaa: "Bul jerge 4x4 kerek — Nókisten basqa sayaxatshılar menen jeepni bóliń (~$25/kisi). Tústen keyin samal kúsheygende barǵan ma'qul.",
    },
    image: "https://images.pexels.com/photos/1439173/pexels-photo-1439173.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

export const ITINERARY_INTERESTS: { id: string; label: LocalizedText; icon: string }[] = [
  { id: 'history', icon: 'Landmark', label: { en: 'History', ru: 'История', uz: 'Tarix', kaa: 'Tariyx' } },
  { id: 'ecotourism', icon: 'Leaf', label: { en: 'Ecotourism', ru: 'Экотур', uz: 'Ekoturizm', kaa: 'Ekosayaxat' } },
  { id: 'gastronomy', icon: 'UtensilsCrossed', label: { en: 'Gastronomy', ru: 'Гастроном', uz: 'Gastronom', kaa: 'Gastronomiya' } },
  { id: 'extreme', icon: 'Mountain', label: { en: 'Extreme Sports', ru: 'Экстрим', uz: 'Ekstremal', kaa: 'Ekstremal' } },
  { id: 'photography', icon: 'Camera', label: { en: 'Photography', ru: 'Фото', uz: 'Fotosurat', kaa: 'Fotosurat' } },
  { id: 'culture', icon: 'Palette', label: { en: 'Culture & Crafts', ru: 'Культура', uz: 'Madaniyat', kaa: 'Mádeniyat' } },
];

export const ITINERARY_ACTIVITIES: ItineraryActivity[] = [
  {
    id: 1,
    name: { en: "Savitsky Museum tour", ru: "Тур по музею Савицкого", uz: "Savitskiy muzeyi turi", kaa: "Savitskiy muzeyi turi" },
    interests: ['history', 'culture'],
    duration: '2h',
    cost: '$2',
    icon: 'Landmark',
  },
  {
    id: 2,
    name: { en: "Moynaq Ship Cemetery & Aral Sea", ru: "Кладбище кораблей и Арал", uz: "Mo'ynoq kema qabristoni va Orol", kaa: "Moynaq keme qábiristanı hám Aral" },
    interests: ['history', 'ecotourism', 'photography'],
    duration: 'Full day',
    cost: '$8–35',
    icon: 'Ship',
  },
  {
    id: 3,
    name: { en: "Bazaar food crawl — laghman, samsa, plov", ru: "Гастротур по базару", uz: "Bozor ovqat turi", kaa: "Bazar azıq turi" },
    interests: ['gastronomy'],
    duration: '2h',
    cost: '$3–5',
    icon: 'UtensilsCrossed',
  },
  {
    id: 4,
    name: { en: "Ustyurt Plateau 4x4 expedition", ru: "Экспедиция на Устюрт 4x4", uz: "Ustyurt 4x4 ekspeditsiyasi", kaa: "Ustyurt 4x4 ekspediciyası" },
    interests: ['extreme', 'ecotourism', 'photography'],
    duration: 'Full day',
    cost: '$35–40',
    icon: 'Mountain',
  },
  {
    id: 5,
    name: { en: "Karakalpak carpet weaving workshop", ru: "Мастер-класс по ткачеству ковров", uz: "Gilam to'qish ustaxonasi", kaa: "Gilem toqıw ustaxanası" },
    interests: ['culture'],
    duration: '3h',
    cost: '$10',
    icon: 'Palette',
  },
  {
    id: 6,
    name: { en: "Ayaz-Kala fortress sunset & stargazing", ru: "Закат в крепости Аяз-Кала и звёзды", uz: "Ayoz-Qal'a botishi va yulduzlar", kaa: "Ayaz-Qala kún batıwı hám juldızlar" },
    interests: ['history', 'photography', 'ecotourism'],
    duration: 'Half day',
    cost: '$15',
    icon: 'Camera',
  },
  {
    id: 7,
    name: { en: "Mizdakhan necropolis pilgrimage", ru: "Паломничество в Миздахан", uz: "Mizdaxan ziyorati", kaa: "Mizdaxan ziyaratı" },
    interests: ['history', 'culture'],
    duration: '3h',
    cost: '$2–3',
    icon: 'Landmark',
  },
  {
    id: 8,
    name: { en: "Aral Sea yurt camp overnight", ru: "Ночёвка в юртовом лагере Арала", uz: "Orol yurt lagerida tunash", kaa: "Aral yurt lagerinde túnlew" },
    interests: ['ecotourism', 'culture', 'photography'],
    duration: 'Overnight',
    cost: '$30',
    icon: 'Tent',
  },
  {
    id: 9,
    name: { en: "Camel riding at Ustyurt yurt camp", ru: "Верхом на верблюде в Устюрте", uz: "Ustyurt yurt lagerida tuya minish", kaa: "Ustyurt yurt lagerinde tuya miniw" },
    interests: ['extreme', 'culture'],
    duration: '1h',
    cost: '$8',
    icon: 'Mountain',
  },
  {
    id: 10,
    name: { en: "Sunrise photography at ship graveyard", ru: "Фотосъёмка на рассвете у кораблей", uz: "Tonggi kema qabristoni fotosurati", kaa: "Tań atıwında keme qábiristanı fotosuratı" },
    interests: ['photography'],
    duration: '2h',
    cost: 'Free',
    icon: 'Camera',
  },
];

export const PACKING_RULES = {
  summer: {
    en: ["Light cotton clothing (t-shirts, shorts)", "Wide-brimmed sun hat", "Sunglasses (UV protection)", "Sunscreen SPF 50+", "2L+ water bottle (refillable)", "Light scarf for dust storms", "Sandals + sturdy walking shoes", "Insect repellent (for yurt camps)"],
    ru: ["Лёгкая хлопковая одежда (футболки, шорты)", "Шляпа с широкими полями", "Солнцезащитные очки (UV)", "Солнцезащитный крем SPF 50+", "Бутылка воды 2л+ (многоразовая)", "Лёгкий шарф от пыльных бурь", "Сандалии + крепкая обувь для ходьбы", "Репеллент от насекомых (для юртовых лагерей)"],
    uz: ["Yengil mato kiyim (futbolka, short)", "Keng qalpoq", "Quyosh ko'zoynagi (UV)", "Quyosh kremi SPF 50+", "2L+ suv idishi", "Chang bo'roni uchun ro'mol", "Sandal + mustahkam oyoq kiyim", "Hasharotlarga qarshi vosita"],
    kaa: ["Jeńil shiyki kiyim (futbolka, short)", "Keń qalpaq", "Quyas kózáynegi (UV)", "Quyas kremi SPF 50+", "2L+ suw idisi", "Chang dawılı ushın oramal", "Sandal + bekkem ayaq kiyim", "Shıbın-qaraqshı qarsı qural"],
  },
  winter: {
    en: ["Warm down jacket or parka", "Thermal base layers (top + bottom)", "Wool hat & gloves", "Insulated waterproof boots", "Scarf or neck gaiter (desert wind)", "Warm socks (2+ pairs)", "Lip balm & moisturizer (dry air)", "Small thermos for hot tea"],
    ru: ["Тёплая пуховик или парка", "Термобельё (верх + низ)", "Шерстяная шапка и перчатки", "Утеплённые непромокаемые ботинки", "Шарф или бафф (пустынный ветер)", "Тёплые носки (2+ пары)", "Бальзам для губ и увлажнитель (сухой воздух)", "Небольшой термос для горячего чая"],
    uz: ["Issiq paxta kurtka", "Termo kiyim (ustki + pastki)", "Jun qalpoq va qo'lqop", "Issiq suv o'tkazmaydigan etik", "Sharf yoki buff (cho'l shamoli)", "Issiq paypoq (2+ juft)", "Lab balzami va namlovchi (quruq havo)", "Issiq choy uchun kichik termos"],
    kaa: ["Issıq paxta kurtka", "Termo kiyim (ústki + tómengi)", "Jun qalpaq hám qoltıq", "Issıq suw ótkermeytuǵın etik", "Oramal yaki buff (shól samalı)", "Issıq baypaq (2+ juqt)", "Eriw balzam hám namlandırıwshı (qurǵaq hawa)", "Issıq shay ushın kishi termos"],
  },
  spring: {
    en: ["Layered clothing (t-shirt + fleece + light jacket)", "Light rain jacket", "Comfortable walking shoes", "Sun hat + sunscreen", "Reusable water bottle", "Light scarf (spring dust)", "Camera (spring wildflowers bloom!)", "Allergy medication (pollen season)"],
    ru: ["Многослойная одежда (футболка + флис + лёгкая куртка)", "Лёгкая дождевик", "Удобная обувь для ходьбы", "Солнцезащитная шляпа + крем", "Многоразовая бутылка воды", "Лёгкий шарф (весенняя пыль)", "Камера (весеннее цветение!)", "Лекарство от аллергии (пыльца)"],
    uz: ["Qatlamli kiyim (futbolka + flees + yengil kurtka)", "Yengil yomg'ir kurtka", "Qulay yurish oyoq kiyim", "Quyosh qalpoq + krem", "Qayta ishlatiladigan suv idishi", "Yengil sharf (bahar changi)", "Kamera (bahar gullari!)", "Allergiya dori (changto'zon)"],
    kaa: ["Qatlamlı kiyim (futbolka + flees + jeńil kurtka)", "Jeńil jawın kurtka", "Qolay júriw ayaq kiyim", "Quyas qalpaq + krem", "Qayta isletilatuǵın suw idisi", "Jeńil oramal (baxar changı)", "Kamera (baxar gúlleri!)", "Allergiya dári (changto'zan)"],
  },
  autumn: {
    en: ["Layered clothing (light jacket for evenings)", "Comfortable hiking shoes", "Sun hat + sunscreen (still strong UV)", "Reusable water bottle", "Light gloves (cold desert nights)", "Camera (golden hour is stunning)", "Lip balm (dry autumn air)", "Small daypack for day trips"],
    ru: ["Многослойная одежда (лёгкая куртка для вечеров)", "Удобные походные ботинки", "Солнцезащитная шляпа + крем (сильный UV)", "Многоразовая бутылка воды", "Лёгкие перчатки (холодные ночи в пустыне)", "Камера (золотой час великолепен)", "Бальзам для губ (сухой осенний воздух)", "Небольшой рюкзак для дневных поездок"],
    uz: ["Qatlamli kiyim (kechqurun uchun yengil kurtka)", "Qulay piyoda etik", "Quyosh qalpoq + krem (kuchli UV)", "Qayta ishlatiladigan suv idishi", "Yengil qo'lqop (sovuq cho'l kechlari)", "Kamera (oltin soat ajoyib)", "Lab balzami (quruq kuz havosi)", "Kunlik sayohat uchun kichik ryukzak"],
    kaa: ["Qatlamlı kiyim (keşqurın ushın jeńil kurtka)", "Qolay piyada etik", "Quyas qalpaq + krem (kúshli UV)", "Qayta isletilatuǵın suw idisi", "Jeńil qoltıq (suwıq shól keńleri)", "Kamera (altın saat ajayıp)", "Eriw balzamı (qurǵaq guz hawası)", "Kúnlik sayaxat ushın kishi ryukzak"],
  },
};

export const SEASON_NAMES: Record<string, LocalizedText> = {
  summer: { en: 'Summer', ru: 'Лето', uz: 'Yoz', kaa: 'Jaz' },
  winter: { en: 'Winter', ru: 'Зима', uz: "Qish", kaa: 'Qıs' },
  spring: { en: 'Spring', ru: 'Весна', uz: 'Bahor', kaa: 'Baxar' },
  autumn: { en: 'Autumn', ru: 'Осень', uz: 'Kuz', kaa: 'Guz' },
};

export const MONTH_NAMES: LocalizedText[] = [
  { en: 'January', ru: 'Январь', uz: 'Yanvar', kaa: 'Yanvar' },
  { en: 'February', ru: 'Февраль', uz: 'Fevral', kaa: 'Fevral' },
  { en: 'March', ru: 'Март', uz: 'Mart', kaa: 'Mart' },
  { en: 'April', ru: 'Апрель', uz: 'Aprel', kaa: 'Aprel' },
  { en: 'May', ru: 'Май', uz: 'May', kaa: 'May' },
  { en: 'June', ru: 'Июнь', uz: 'Iyun', kaa: 'Iyun' },
  { en: 'July', ru: 'Июль', uz: 'Iyul', kaa: 'Iyul' },
  { en: 'August', ru: 'Август', uz: 'Avgust', kaa: 'Avgust' },
  { en: 'September', ru: 'Сентябрь', uz: 'Sentabr', kaa: 'Sentabr' },
  { en: 'October', ru: 'Октябрь', uz: 'Oktabr', kaa: 'Oktabr' },
  { en: 'November', ru: 'Ноябрь', uz: 'Noyabr', kaa: 'Noyabr' },
  { en: 'December', ru: 'Декабрь', uz: 'Dekabr', kaa: 'Dekabr' },
];

export function getCurrentSeason(month: number): 'summer' | 'winter' | 'spring' | 'autumn' {
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 12 || month <= 2) return 'winter';
  if (month >= 3 && month <= 5) return 'spring';
  return 'autumn';
}

export function getSeasonFromTemp(tempC: number): 'summer' | 'winter' | 'spring' | 'autumn' {
  if (tempC >= 30) return 'summer';
  if (tempC <= 5) return 'winter';
  if (tempC > 5 && tempC < 15) return 'autumn';
  return 'spring';
}
