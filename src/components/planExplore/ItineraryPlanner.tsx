import { useState, useMemo, useCallback } from 'react';
import {
  Landmark, Leaf, UtensilsCrossed, Mountain, Camera, Palette,
  Ship, Tent, Shuffle, MapPin, Clock, DollarSign, Sparkles, CheckCircle2,
} from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { getText } from '@/lib/translations';
import {
  ITINERARY_INTERESTS, ITINERARY_ACTIVITIES, HIDDEN_GEMS,
} from '@/data/planExplore';

const ICON_MAP: Record<string, typeof Landmark> = {
  Landmark, Leaf, UtensilsCrossed, Mountain, Camera, Palette, Ship, Tent,
};

const LABELS: Record<string, Record<string, string>> = {
  selectInterests: { en: 'Select Your Interests', ru: 'Выберите интересы', uz: 'Qiziqishlaringizni tanlang', kaa: 'Qızıǵıwshılıqlarıńızdı tańlań' },
  selectDesc: { en: 'Pick what excites you and we\'ll build a personalized day plan', ru: 'Выберите, что вас увлекает, и мы составим персональный план', uz: "Qiziqarli narsalarni tanlang, biz reja tuzamiz", kaa: "Qızıqtırarlıqtı tańlań, biz jeke reja quramız" },
  yourPlan: { en: 'Your Personalized Itinerary', ru: 'Ваш персональный план', uz: 'Sizning shaxsiy rejangiz', kaa: 'Sizdiń jeke rejańız' },
  noSelection: { en: 'Select at least one interest to generate your plan', ru: 'Выберите хотя бы один интерес', uz: "Reja uchun kamida bitta qiziqish tanlang", kaa: "Reja ushın keminde bir qızıǵıwshılıq tańlań" },
  random: { en: 'Surprise Me!', ru: 'Сюрприз!', uz: "Meni xayratga qoldir!", kaa: "Meni tańqaldır!" },
  randomDesc: { en: 'Get a random destination suggestion', ru: 'Случайное направление', uz: "Tasodifiy manzil", kaa: "Tasadıqıy manzil" },
  hiddenGems: { en: 'Hidden Gems', ru: 'Скрытые жемчужины', uz: "Yashirin gavharlar", kaa: "Jasırın gózzallar" },
  hiddenDesc: { en: 'Off-the-beaten-path spots almost no tourists find', ru: 'Неизведанные места, которые почти не находят туристы', uz: "Turistlar deyarli topmaydigan joylar", kaa: "Turistler derlik tapbaytın jerler" },
  duration: { en: 'Duration', ru: 'Время', uz: 'Davomiyligi', kaa: 'Dawamlılıq' },
  cost: { en: 'Cost', ru: 'Стоимость', uz: 'Narx', kaa: 'Baxa' },
  location: { en: 'Location', ru: 'Место', uz: 'Joylashuv', kaa: 'Orın' },
  tip: { en: 'Local Tip', ru: 'Совет местного', uz: "Mahalliy maslahat", kaa: "Jergilikli maslahat" },
  generate: { en: 'Generate Plan', ru: 'Создать план', uz: "Reja tuzish", kaa: "Reja qurıw" },
  regenerate: { en: 'Regenerate', ru: 'Обновить', uz: "Qayta tuzish", kaa: "Qayta qurıw" },
  nature: { en: 'Nature', ru: 'Природа', uz: 'Tabiat', kaa: 'Tabiyat' },
  culture: { en: 'Culture', ru: 'Культура', uz: 'Madaniyat', kaa: 'Mádeniyat' },
  history: { en: 'History', ru: 'История', uz: 'Tarix', kaa: 'Tariyx' },
  day: { en: 'Day', ru: 'День', uz: 'Kun', kaa: 'Kún' },
};

const RANDOM_DESTINATIONS = [
  { name: { en: 'Ayaz-Kala Fortress', ru: 'Крепость Аяз-Кала', uz: 'Ayoz-Qal\'a qal\'asi', kaa: 'Ayaz-Qala qorǵanı' }, desc: { en: 'Watch the sunset from a 2,000-year-old mud-brick fortress wall overlooking the Kyzylkum desert.', ru: 'Встретьте закат с 2000-летней крепости из сырца над пустыней Кызылкум.', uz: '2000 yillik qal\'a devoridan Kyzylkum cho\'li botishini kuzating.', kaa: '2000 jıllıq qorǵan diywalınan Kyzylkum shóli kún batıwın kóriń.' } },
  { name: { en: 'Chermen Sacred Spring', ru: 'Священный источник Чермен', uz: 'Chermen muqaddas bulog\'i', kaa: 'Chermen muqaddas bulaǵı' }, desc: { en: 'Find a hidden healing spring in the desert near Shomanay — bring a container and ask locals for directions.', ru: 'Найдите скрытый целебный источник в пустыне у Шоманая — возьмите тару и спросите местных.', uz: 'Shomana yaqinidagi cho\'lda yashirin shifobaxsh buloqni toping.', kaa: 'Shomanay jaqınındagi shólda jasırın shıpalıq bulaqtı tabıń.' } },
  { name: { en: 'Stikhiya Festival site', ru: 'Место фестиваля Стихия', uz: 'Stikhiya festivali joyi', kaa: 'Stikhiya festivalı orını' }, desc: { en: 'Stand on the barren shore where the Aral Sea used to lap — now a surreal electronic music festival venue.', ru: 'Встаньте на пустынный берег, где раньше плескался Арал — теперь сюрреалистичная площадка фестиваля.', uz: 'Arol dengizi bo\'lgan cho\'l qirg\'og\'ida turing — endi festival joyi.', kaa: 'Aral teńizi bolǵan shól qıyaǵında turiń — endi festival orını.' } },
  { name: { en: 'Savitsky Museum avant-garde wing', ru: 'Авангардное крыло музея Савицкого', uz: 'Savitskiy muzeyi avangard bo\'limi', kaa: 'Savitskiy muzeyi avangard bo\'limi' }, desc: { en: 'See banned Soviet avant-garde art secretly rescued and hidden in remote Nukus — the "Louvre of the Desert."', ru: 'Смотрите запрещённый советский авангард, тайно спасённый в Нукусе — «Лувр пустыни».', uz: 'Nukusda yashirilgan taqiqlangan Sovet avangard san\'atini ko\'ring.', kaa: 'Nókiste jasırılǵan qadaǵalawǵan Sovet avangard kórkem-ónerin kóriń.' } },
  { name: { en: 'Singing Dunes of Kazakdy-Kyr', ru: 'Поющие барханы Казакды-Кыр', uz: 'Qozoqdiquir kuylagan qumlari', kaa: 'Qazaqdıqır sazlanǵan qumları' }, desc: { en: 'Slide down remote desert dunes that hum and boom — a rare natural phenomenon with zero crowds.', ru: 'Скользите по удалённым дюнам, которые гудят — редкое природное явление без толп.', uz: 'G\'uldiraydigan uzoq cho\'l qumlaridan siraling — kam uchraydigan hodisa.', kaa: 'Gúldireytuǵın uzaq shól qumlarınan siralıń — siyrek hadise.' } },
];

export default function ItineraryPlanner() {
  const { lang } = useLang();
  const [selected, setSelected] = useState<string[]>([]);
  const [generated, setGenerated] = useState(false);
  const [randomDest, setRandomDest] = useState<typeof RANDOM_DESTINATIONS[0] | null>(null);
  const [shuffling, setShuffling] = useState(false);

  const tl = (key: string) => LABELS[key]?.[lang] ?? LABELS[key]?.en ?? key;

  const toggleInterest = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    setGenerated(false);
  };

  const matchedActivities = useMemo(() => {
    if (selected.length === 0) return [];
    return ITINERARY_ACTIVITIES.filter((a) =>
      a.interests.some((interest) => selected.includes(interest))
    );
  }, [selected]);

  const handleGenerate = () => {
    if (selected.length > 0) setGenerated(true);
  };

  const handleRandom = useCallback(() => {
    setShuffling(true);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * RANDOM_DESTINATIONS.length);
      setRandomDest(RANDOM_DESTINATIONS[idx]);
      setShuffling(false);
    }, 600);
  }, []);

  return (
    <div className="space-y-6">
      {/* Interest selection */}
      <div className="rounded-2xl bg-white ring-1 ring-sand-200 p-5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-terracotta-500" />
          <h4 className="font-display text-sm font-semibold text-deepblue-900">{tl('selectInterests')}</h4>
        </div>
        <p className="text-xs text-deepblue-500 mb-4">{tl('selectDesc')}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {ITINERARY_INTERESTS.map((interest) => {
            const Icon = ICON_MAP[interest.icon] ?? Landmark;
            const active = selected.includes(interest.id);
            return (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? 'bg-terracotta-500 text-white shadow-subtle shadow-terracotta-500/20'
                    : 'bg-sand-50 text-deepblue-700 ring-1 ring-sand-200 hover:bg-sand-100'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-terracotta-500'}`} />
                <span className="text-xs">{interest.label[lang]}</span>
                {active && <CheckCircle2 className="h-3.5 w-3.5 ml-auto" />}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleGenerate}
          disabled={selected.length === 0}
          className="mt-4 w-full rounded-xl bg-deepblue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-deepblue-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {generated ? tl('regenerate') : tl('generate')}
        </button>
      </div>

      {/* Generated itinerary */}
      {generated && matchedActivities.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-br from-sand-50 to-white ring-1 ring-sand-200 p-5 animate-fade-up">
          <h4 className="font-display text-sm font-semibold text-deepblue-900 mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-terracotta-500" />
            {tl('yourPlan')}
          </h4>
          <div className="space-y-3">
            {matchedActivities.map((activity, i) => {
              const Icon = ICON_MAP[activity.icon] ?? Landmark;
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-xl bg-white p-4 ring-1 ring-sand-100 animate-fade-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-terracotta-500 text-white flex items-center justify-center font-display font-bold text-sm">
                      {i + 1}
                    </div>
                    {i < matchedActivities.length - 1 && (
                      <div className="w-px h-8 bg-sand-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-deepblue-500 flex-shrink-0" />
                        <h5 className="text-sm font-semibold text-deepblue-900">{activity.name[lang]}</h5>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-deepblue-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {activity.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" /> {activity.cost}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {generated && selected.length > 0 && matchedActivities.length === 0 && (
        <div className="rounded-2xl bg-sand-50 ring-1 ring-sand-200 p-8 text-center">
          <p className="text-sm text-deepblue-600">{tl('noSelection')}</p>
        </div>
      )}

      {/* Random Destination */}
      <div className="rounded-2xl bg-gradient-to-br from-deepblue-700 to-deepblue-900 p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta-500/10 rounded-full -mr-16 -mt-16" />
        <div className="relative flex items-center justify-between mb-3">
          <div>
            <h4 className="font-display text-sm font-semibold flex items-center gap-2">
              <Shuffle className="h-4 w-4 text-sand-300" />
              {tl('random')}
            </h4>
            <p className="text-xs text-sand-300 mt-0.5">{tl('randomDesc')}</p>
          </div>
          <button
            onClick={handleRandom}
            disabled={shuffling}
            className="flex-shrink-0 rounded-xl bg-terracotta-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-terracotta-600 transition-colors disabled:opacity-60 flex items-center gap-1.5"
          >
            <Shuffle className={`h-3.5 w-3.5 ${shuffling ? 'animate-spin' : ''}`} />
            {shuffling ? '...' : tl('random')}
          </button>
        </div>
        {randomDest && !shuffling && (
          <div className="relative rounded-xl bg-white/10 p-4 ring-1 ring-white/20 animate-fade-up">
            <h5 className="font-display text-base font-bold text-sand-200 mb-1">{getText(randomDest.name, lang)}</h5>
            <p className="text-sm text-sand-100/90 leading-relaxed">{getText(randomDest.desc, lang)}</p>
          </div>
        )}
        {shuffling && (
          <div className="relative rounded-xl bg-white/10 p-4 ring-1 ring-white/20 flex items-center gap-2">
            <Shuffle className="h-4 w-4 text-sand-300 animate-spin" />
            <span className="text-sm text-sand-200">...</span>
          </div>
        )}
        {!randomDest && !shuffling && (
          <div className="relative rounded-xl bg-white/5 p-4 text-center text-sand-300/70 text-sm">
            {tl('randomDesc')}
          </div>
        )}
      </div>

      {/* Hidden Gems */}
      <div className="rounded-2xl bg-white ring-1 ring-sand-200 p-5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-terracotta-500" />
          <h4 className="font-display text-sm font-semibold text-deepblue-900">{tl('hiddenGems')}</h4>
        </div>
        <p className="text-xs text-deepblue-500 mb-4">{tl('hiddenDesc')}</p>

        <div className="space-y-3">
          {HIDDEN_GEMS.map((gem, i) => (
            <div
              key={gem.id}
              className="overflow-hidden rounded-xl bg-sand-50 ring-1 ring-sand-100 animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex flex-col sm:flex-row">
                <img
                  src={gem.image}
                  alt={gem.name[lang]}
                  loading="lazy"
                  className="w-full sm:w-32 h-32 sm:h-auto object-cover flex-shrink-0"
                />
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h5 className="font-display text-sm font-bold text-deepblue-900">{gem.name[lang]}</h5>
                    <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      gem.category === 'nature'
                        ? 'bg-green-100 text-green-700'
                        : gem.category === 'culture'
                        ? 'bg-terracotta-100 text-terracotta-700'
                        : 'bg-deepblue-100 text-deepblue-700'
                    }`}>
                      {tl(gem.category)}
                    </span>
                  </div>
                  <p className="text-xs text-deepblue-500 flex items-center gap-1 mb-2">
                    <MapPin className="h-3 w-3" /> {gem.location[lang]}
                  </p>
                  <p className="text-xs text-deepblue-700 leading-relaxed mb-2">{gem.description[lang]}</p>
                  <div className="rounded-lg bg-terracotta-50 p-2.5 flex items-start gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-terracotta-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-semibold text-terracotta-700 mb-0.5">{tl('tip')}</p>
                      <p className="text-xs text-terracotta-800 leading-relaxed">{gem.tip[lang]}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
