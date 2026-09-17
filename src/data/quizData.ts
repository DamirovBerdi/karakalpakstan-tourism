import type { Lang } from '@/lib/translations';

export interface QuizQuestion {
  id: number;
  question: Partial<Record<Lang, string>>;
  options: Partial<Record<Lang, string[]>>;
  correctIndex: number;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: {
      en: 'What is the capital city of Karakalpakstan?',
      ru: 'Какова столица Каракалпакстана?',
      uz: "Qoraqalpog'istonning poytaxti qaysi?",
      kaa: 'Qaraqalpaqstannıń paytaxtı qaysı?',
    },
    options: {
      en: ['Samarkand', 'Nukus', 'Bukhara', 'Khiva'],
      ru: ['Самарканд', 'Нукус', 'Бухара', 'Хива'],
      uz: ['Samarqand', 'Nukus', 'Buxoro', 'Xiva'],
      kaa: ['Samarqand', 'Nókis', 'Buxara', 'Xiva'],
    },
    correctIndex: 1,
  },
  {
    id: 2,
    question: {
      en: 'The Savitsky Museum is often called the "Louvre of the ___"?',
      ru: 'Музей Савицкого часто называют «Лувром ___»?',
      uz: 'Savitskiy muzeyi tez-tez "___ Luvri" deb ataladi?',
      kaa: 'Savitskiy muzeyi kóbinese "___ Luvri" dep ataladı?',
    },
    options: {
      en: ['Steppes', 'Desert', 'Mountains', 'Sea'],
      ru: ['Степей', 'Пустыни', 'Гор', 'Моря'],
      uz: ['Dashtlar', 'Cho\'l', 'Tog\'lar', 'Dengiz'],
      kaa: ['Dala', 'Shól', 'Tawlar', 'Teńiz'],
    },
    correctIndex: 1,
  },
  {
    id: 3,
    question: {
      en: 'What ecological disaster is Karakalpakstan most known for?',
      ru: 'За какую экологическую катастрофу наиболее известен Каракалпакстан?',
      uz: "Qoraqalpog'iston qaysi ekologik ofat bilan eng mashhur?",
      kaa: 'Qaraqalpaqstan qaysı ekologiyalıq apat penen eń ataqlı?',
    },
    options: {
      en: ['Drying of the Aral Sea', 'Deforestation', 'Oil spill', 'Earthquake'],
      ru: ['Высыхание Аральского моря', 'Вырубка лесов', 'Разлив нефти', 'Землетрясение'],
      uz: ['Orol dengizining qurib qolishi', 'O\'rmonlarni kesish', 'Neft to\'kilishi', 'Zilzila'],
      kaa: ['Aral teńiziniń qurıp qalıwı', 'Ormanlardı qıyıw', 'Neft tamıwı', 'Jer silkiniw'],
    },
    correctIndex: 0,
  },
  {
    id: 4,
    question: {
      en: 'Which famous poet is considered the greatest Karakalpak literary figure?',
      ru: 'Какой поэт считается величайшим каракалпакским литературным деятелем?',
      uz: "Qaysi shoir eng buyuk qoraqalpoq adabiyot namoyandasi hisoblanadi?",
      kaa: 'Qaysı shayır eń ullı qaraqalpaq ádebiyat wákili sanaladı?',
    },
    options: {
      en: ['Navoi', 'Berdaq', 'Rumi', 'Firdawsi'],
      ru: ['Навои', 'Бердах', 'Руми', 'Фирдоуси'],
      uz: ['Navoiy', 'Berdaq', 'Rumiy', 'Firdavsiy'],
      kaa: ['Nawayı', 'Berdaq', 'Rumiy', 'Firdawsiy'],
    },
    correctIndex: 1,
  },
  {
    id: 5,
    question: {
      en: 'Moynaq was once a thriving town on the shore of which body of water?',
      ru: 'Муйнак когда-то был процветающим городом на берегу какого водоёма?',
      uz: "Mo'ynoq bir vaqtlar qaysi suv havzasi qirg'og'ida gullab-yashnagan shahar edi?",
      kaa: 'Moynaq bir waqıtları qaysı suw basseyni jaǵasında gúllep-jasnaǵan qala edi?',
    },
    options: {
      en: ['Caspian Sea', 'Aral Sea', 'Lake Baikal', 'Amu Darya River'],
      ru: ['Каспийское море', 'Аральское море', 'Озеро Байкал', 'Река Амударья'],
      uz: ['Kaspiy dengizi', 'Orol dengizi', 'Baykal ko\'li', 'Amudaryo daryosi'],
      kaa: ['Kaspiy teńizi', 'Aral teńizi', 'Baykal kóli', 'Ámiwdárya dáryası'],
    },
    correctIndex: 1,
  },
  {
    id: 6,
    question: {
      en: 'What is the traditional Karakalpak bridal headdress called?',
      ru: 'Как называется традиционный каракалпакский свадебный головной убор?',
      uz: "An'anaviy qoraqalpoq kelin bosh kiyimi nima deb ataladi?",
      kaa: 'An\'anaviy qaraqalpaq kelin bas kiyimi ne dep ataladı?',
    },
    options: {
      en: ['Saukele', 'Tubeteika', 'Tyubeteika', 'Kupkari'],
      ru: ['Саукеле', 'Тюбетейка', 'Тюбетейка', 'Купкари'],
      uz: ['Saukele', 'Duppı', 'Tyubeteyka', 'Kupkari'],
      kaa: ['Sáwkele', 'Doppı', 'Tyubeteyka', 'Kupkari'],
    },
    correctIndex: 0,
  },
  {
    id: 7,
    question: {
      en: 'Chilpyk Fortress was originally used by which ancient religion?',
      ru: 'Чильпек первоначально использовался какой древней религией?',
      uz: 'Chilpyk dastlab qaysi qadimiy din tomonidan foydalanilgan?',
      kaa: 'Chilpyk dáslep qaysı áyyemgi din tárepinen paydalanılǵan?',
    },
    options: {
      en: ['Buddhism', 'Zoroastrianism', 'Islam', 'Christianity'],
      ru: ['Буддизм', 'Зороастризм', 'Ислам', 'Христианство'],
      uz: ['Buddizm', 'Zardushtiylik', 'Islom', 'Xristianlik'],
      kaa: ['Buddizm', 'Zardushtiylik', 'Islam', 'Xristianlik'],
    },
    correctIndex: 1,
  },
  {
    id: 8,
    question: {
      en: 'Which river forms the main waterway through Karakalpakstan?',
      ru: 'Какая река образует главную водную артерию Каракалпакстана?',
      uz: "Qaysi daryo Qoraqalpog'iston orqali asosiy suv yo'lini tashkil etadi?",
      kaa: 'Qaysı dárya Qaraqalpaqstan arqalı tiykarǵı suw jolın quralaydı?',
    },
    options: {
      en: ['Syr Darya', 'Amu Darya', 'Volga', 'Zarafshan'],
      ru: ['Сырдарья', 'Амударья', 'Волга', 'Зарафшан'],
      uz: ['Sirdaryo', 'Amudaryo', 'Volga', 'Zarafshon'],
      kaa: ['Sirdárya', 'Ámiwdárya', 'Volga', 'Zarafshan'],
    },
    correctIndex: 1,
  },
  {
    id: 9,
    question: {
      en: 'What is the traditional Karakalpak soup made with dried elaeagnus fruits?',
      ru: 'Какой традиционный каракалпакский суп делают из сушёных плодов лоха?',
      uz: "Quritilgan jiyda mevalaridan tayyorlanadigan an'anaviy qoraqalpoq sho'rva nima?",
      kaa: 'Qurıtılǵan jiyde miywelerinen tayarlanatuǵın an\'anaviy qaraqalpaq shorba ne?',
    },
    options: {
      en: ['Juwiriq', 'Jiyde Koje', 'Lagman', 'Mastava'],
      ru: ['Жувирик', 'Джиже кожэ', 'Лагман', 'Мастава'],
      uz: ['Juwiriq', 'Jiyda koje', 'Lag\'mon', 'Mastava'],
      kaa: ['Juwiriq', 'Jiyde koje', 'Lag\'man', 'Mastava'],
    },
    correctIndex: 1,
  },
  {
    id: 10,
    question: {
      en: 'Karakalpakstan is an autonomous republic within which country?',
      ru: 'Каракалпакстан — автономная республика в составе какой страны?',
      uz: "Qoraqalpog'iston qaysi mamlakat tarkibidagi avtonom respublika?",
      kaa: 'Qaraqalpaqstan qaysı mámleket quramındaǵı avtonom respublika?',
    },
    options: {
      en: ['Kazakhstan', 'Turkmenistan', 'Uzbekistan', 'Kyrgyzstan'],
      ru: ['Казахстан', 'Туркменистан', 'Узбекистан', 'Киргизия'],
      uz: ['Qozog\'iston', 'Turkmaniston', 'O\'zbekiston', 'Qirg\'iziston'],
      kaa: ['Qazaqstan', 'Turkmenstan', 'Ózbekstan', 'Qırǵızstan'],
    },
    correctIndex: 2,
  },
];
