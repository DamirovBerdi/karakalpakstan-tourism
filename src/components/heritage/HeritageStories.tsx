import React, { useState } from 'react';
import {
  BookOpen,
  Landmark,
  Compass,
  Sparkles,
  History,
  ShieldAlert,
  Feather,
  ChevronRight,
  Scroll,
  MapPin
} from 'lucide-react';

interface StoryItem {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  location: string;
  badge: string;
  summary: string;
  fullHistory: string;
  legend: string;
  facts: string[];
  image: string;
}

export default function HeritageStories() {
  const [selectedStory, setSelectedStory] = useState<string>('chilpyk');

  const STORIES: StoryItem[] = [
    {
      id: 'chilpyk',
      title: 'Чилпык — Башня Молчания',
      subtitle: 'Священная дахма зороастрийцев на берегу Амударьи',
      period: 'III–IV вв. до н.э.',
      location: '45 км к югу от Нукуса',
      badge: 'Символ Нации',
      image: 'https://images.pexels.com/photos/28949995/pexels-photo-28949995.jpeg?auto=compress&cs=tinysrgb&w=1200',
      summary: 'Величественное кольцевое сооружение на вершине конического холма. Служило основным зороастрийским культовым центром древнего Хорезма.',
      fullHistory: `Чилпык (Chilpyk-kala) — древнейший зороастрийский памятник в Каракалпакстане. Сооружение представляет собой замкнутую кольцевую стену высотой до 15 метров и диаметром 65 метров, возведенную на вершине естественного 35-метрового холма.

Зороастрийцы верили, что мёртвое тело не должно осквернять священные стихии Земли и Огня. Поэтому тела усопших помещали на вершину Чилпыка для естественного очищения ветром и птицами. После этого чистые кости собирали в глиняные сосуды — оссуарии — и захоранивали в гротах холма.

С силуэтом Чилпыка связана вся символика современного Каракалпакстана: его стилизованный профиль украшает государственный герб республики, символизируя вечность, древность и мудрость народа.`,
      legend: 'По местной легенде, крепость построила юная богатырша Чилпык. Влюбившись вопреки воле отца-хана, она бежала на этот холм и возвела неприступные стены за одну ночь с помощью джиннов.',
      facts: [
        'Изображен на официальном Государственном Гербе Республики Каракалпакстан.',
        'С вершины открывается панорамный вид на петляющее русло Амударьи и степи.',
        'На стенах найдены древние знаки-тамги хорезмийских родов.'
      ]
    },
    {
      id: 'toprak-kala',
      title: 'Топрак-Кала — Дворец Хорезмшахов',
      subtitle: 'Царская резиденция и античный мегаполис Древнего Хорезма',
      period: 'I–IV вв. н.э.',
      location: 'Элликкалинский район',
      badge: 'ЮНЕСКО Наследие',
      image: 'https://images.pexels.com/photos/28949996/pexels-photo-28949996.jpeg?auto=compress&cs=tinysrgb&w=1200',
      summary: 'Грандиозный дворцово-храмовый комплекс с 150 комнатами, где найдены настенные фрески, скульптуры царей и древнейшие письменные архивы.',
      fullHistory: `Топрак-Кала («Земляная крепость») являлась официальной столицей и царской резиденцией правителей Древнего Хорезма в I–IV веках нашей эры. Город занимал площадь более 12 гектаров и был окружен мощными оборонительными стенами с прямоугольными башнями.

В северо-западном углу возвышался Высокий Дворец на 25-метровом стилобате. Внутри располагалось свыше 150 залов и комнат, украшенных живописью и глиняной скульптурой. В «Зале Царей» стояли ростовые статуи правителей, а в «Зале Танцующих Масок» — барельефы пляшущих женщин и мужчин.

Именно здесь археологи экспедиции С.П. Толстова нашли древнейший архив документов на хорезмийском языке, записанный тушью на кожаных свитках и дощечках.`,
      legend: 'Считается, что дворец был оставлен правителями из-за внезапного изменения русла Амударьи и катастрофической засухи. Жители ушли, не унося тяжелые статуи, оставив город в первозданном виде на полтора тысячелетия.',
      facts: [
        'Найдены уникальные фрески с изображениями «Танцующих женщин» и тигров.',
        'Здесь находился главный монетный двор древнехорезмийского государства.',
        'Здания строились из гигантского сырцового кирпича весом до 15 кг каждый.'
      ]
    },
    {
      id: 'ayaz-kala',
      title: 'Аяз-Кала — Великан в Пустыне',
      subtitle: 'Тройной комплекс крепостей на обрыве Кызылкума',
      period: 'IV в. до н.э. – VII в. н.э.',
      location: 'Султануиздагский хребет',
      badge: 'Великий Шёлковый Путь',
      image: 'https://images.pexels.com/photos/28949994/pexels-photo-28949994.jpeg?auto=compress&cs=tinysrgb&w=1200',
      summary: 'Впечатляющая система из трех крепостей, парящих над пустыней. Охраняла границы государства и караваны Великого Шёлкового Пути.',
      fullHistory: `Аяз-Кала состоит из трех цитаделей, построенных на разных уровнях плато. Самая древняя — Аяз-Кала 1 (IV–III вв. до н.э.) — возведена на высоте 100 метров над равниной. Ее двойные стены с въездным лабиринтом позволяли защитникам отражать атаки кочевников с минимальными силами.

Нижняя крепость Аяз-Кала 2 и дворец Аяз-Кала 3 достраивались в кушанскую и раннесредневековую эпохи. Комплекс контролировал плодородную оазисную зону и торговые караваны, шедшие вдоль реки Амударья на север.`,
      legend: 'Легенда гласит, что крепость построил бедный пастух по имени Аяз («Холодный сквозняк»). За свою честность и мудрость он был избран царем. Став правителем, Аяз повесил в царском зале свой старый рваный кожаный сапог, чтобы каждое утро напоминать себе о своих простых народных корнях.',
      facts: [
        'С плато Аяз-Кала открывается захватывающий вид на барханы Кызылкума и озеро Аязкуль.',
        'Рядом расположен традиционный юртовый лагерь для туристов.',
        'Крепость не была взята штурмом ни разу за все время существования.'
      ]
    },
    {
      id: 'mizdakhan',
      title: 'Миздахан & Мировые Часы',
      subtitle: 'Древнейший некрополь Центральной Азии и святыни паломников',
      period: 'IV в. до н.э. – XIV в. н.э.',
      location: 'Ходжейлийский район',
      badge: 'Зиярат & Легенды',
      image: 'https://images.pexels.com/photos/28949995/pexels-photo-28949995.jpeg?auto=compress&cs=tinysrgb&w=1200',
      summary: 'Священный холм с мавзолеями, подземными гробницами и культовыми «Мировыми часами» Ерезжеп Халфа.',
      fullHistory: `Некрополь Миздахан занимает три холма возле города Ходжейли. Это один из старейших и непрерывно функционирующих культовых комплексов в Азии, где переплелись зороастризм, ислам и древние верования.

Здесь располагаются мавзолей великана Шамун-Наби, полуподземный мавзолей Мазлумхан-Сулу (XII–XIV вв.) и руины крепости Гяур-Кала. Паломники со всего мира приезжают сюда для совершения зиярата.`,
      legend: 'Главная загадка Миздахана — «Часы Мира» (мавзолей Ерезжеп Халфа). По преданию, каждый год из стены мавзолея выпадает один кирпич. Когда упадет последний кирпич, наступит конец света. Поэтому верующие бережно складывают пирамидки из 7 упавших кирпичиков и молятся о сохранении мира.',
      facts: [
        'Пирамидки из 7 кирпичей строятся паломниками для исполнения самого заветного желания.',
        'Мавзолей Мазлумхан-Сулу расположен полностью под землей ради поддержания прохлады.',
        'Здесь покоится легендарный строитель и целитель Шамун-Наби.'
      ]
    },
    {
      id: 'muynak-aral',
      title: 'Муйнак & Судьба Аральского Моря',
      subtitle: 'От морского порта СССР до экологического музея Аралкум',
      period: 'XX – XXI век',
      location: 'Город Муйнак, мыс Устюрт',
      badge: 'Эко-История',
      image: 'https://images.pexels.com/photos/28949994/pexels-photo-28949994.jpeg?auto=compress&cs=tinysrgb&w=1200',
      summary: 'История трансформации некогда богатого рыболовецкого порта на Арале в один из самых поразительных экологических музеев мира.',
      fullHistory: `Ещё в середине XX века Муйнак был цветущим полуостровом и крупнейшим рыболовным портом на Аральском море. Здесь работали рыбоконсервный комбинат, морской порт, матросский клуб и судоремонтные верфи. Ежегодно Муйнак поставлял миллионы банок Аральского судака и сазана по всему СССР.

Однако из-за масштабного отвода вод рек Амударья и Сырдарья на орошение хлопковых полей море начало стремительно отступать. К 1980-м годам вода ушла от Муйнака на десятки километров, оставив корабли на сухом песке.

Сегодня Муйнак — символ человеческого осмысления природы. Здесь находится «Кладбище кораблей», музей Арала и ежегодный экологический фестиваль музыки «СТИХИЯ» (STIXIA).`,
      legend: 'Старые капитаны Муйнака рассказывали, что в последние дни ухода моря корабли пытались плыть за отступающей водой, пока не сели на мель среди барханов, превратившись в вечные железные памятники.',
      facts: [
        'Вода ушла от старой пристани Муйнака более чем на 100 километров.',
        'На месте бывшего дна моря образовалась новая самая молодая пустыня мира — Аралкум.',
        'Фестиваль СТИХИЯ привлекает в Муйнак тысячи эко-туристов и музыкантов со всего мира.'
      ]
    }
  ];

  const current = STORIES.find((s) => s.id === selectedStory) || STORIES[0];

  return (
    <div className="py-12 bg-sand-50/70 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-4 py-1.5 text-xs font-bold text-garnet-700 mb-3 border border-amber-400/30">
            <Scroll className="h-4 w-4 text-garnet-600" />
            ИСТОРИИ, ЛЕГЕНДЫ И ДРЕВНИЕ ЦИТАДЕЛИ КАРАКАЛПАКСТАНА
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-ink-900 tracking-tight">
            История Древнего Хорезма и Арала
          </h1>
          <p className="mt-3 text-sm sm:text-base text-ink-600 leading-relaxed">
            Погрузитесь в захватывающие хроники античных царств, зороастрийских башен, легенд пастухов и историю ушедшего моря.
          </p>
        </div>

        {/* Story Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {STORIES.map((item) => {
            const isSelected = item.id === selectedStory;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedStory(item.id)}
                className={`p-4 rounded-2xl text-left border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-garnet-600 text-white border-garnet-700 shadow-md translate-y-[-2px]'
                    : 'bg-white text-ink-900 border-sand-200 hover:border-sand-300 hover:bg-sand-100/50'
                }`}
              >
                <div>
                  <span
                    className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold mb-2 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-gold-400/20 text-garnet-700'
                    }`}
                  >
                    {item.period}
                  </span>
                  <h3 className="font-display text-xs sm:text-sm font-bold leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] opacity-80">
                  <span className="truncate">{item.badge}</span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Story Details Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-sm border border-sand-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content (Left 7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded-full bg-garnet-100 px-3 py-1 text-xs font-bold text-garnet-700">
                  {current.period}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-sand-100 px-3 py-1 text-xs font-semibold text-ink-600">
                  <MapPin className="h-3.5 w-3.5 text-garnet-600" /> {current.location}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-ink-900 leading-tight">
                {current.title}
              </h2>
              <p className="text-sm font-medium text-garnet-600 mt-1">{current.subtitle}</p>
            </div>

            {/* History Text */}
            <div className="prose prose-sm max-w-none text-ink-700 leading-relaxed space-y-3">
              {current.fullHistory.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-sm sm:text-base leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Legend Box */}
            <div className="rounded-2xl bg-amber-50/80 p-5 border border-amber-200/70 relative">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2">
                <Sparkles className="h-4 w-4 text-amber-600" /> Древнее Предание и Легенда:
              </div>
              <p className="text-xs sm:text-sm text-amber-900/90 italic leading-relaxed">
                «{current.legend}»
              </p>
            </div>
          </div>

          {/* Sidebar / Facts (Right 5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-sm aspect-video sm:aspect-square">
              <img
                src={current.image}
                alt={current.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent flex items-end p-5">
                <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30">
                  {current.badge}
                </span>
              </div>
            </div>

            {/* Key Historic Facts */}
            <div className="rounded-2xl bg-sand-50 p-6 border border-sand-200">
              <h3 className="font-display text-base font-bold text-ink-900 mb-3 flex items-center gap-2">
                <History className="h-4 w-4 text-garnet-600" /> Ключевые Факты:
              </h3>
              <ul className="space-y-2.5">
                {current.facts.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-700">
                    <span className="h-2 w-2 rounded-full bg-garnet-600 mt-1.5 shrink-0" />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
