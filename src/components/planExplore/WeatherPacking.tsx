import { useState, useEffect, useCallback } from 'react';
import { CloudSun, Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, Thermometer, Eye, Clock, Package, RefreshCw, AlertCircle } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { PACKING_RULES, SEASON_NAMES, getCurrentSeason, getSeasonFromTemp } from '@/data/planExplore';

interface WeatherData {
  temperature: number;
  windSpeed: number;
  humidity: number;
  weatherCode: number;
  apparentTemp: number;
  uvIndex: number;
  visibility: number;
  daily: { max: number; min: number; code: number }[];
}

const WEATHER_CODES: Record<number, { en: string; ru: string; uz: string; kaa: string; icon: typeof Sun }> = {
  0: { en: 'Clear sky', ru: 'Ясно', uz: 'Ochiq osmon', kaa: 'Ashıq aspan', icon: Sun },
  1: { en: 'Mainly clear', ru: 'Преимущественно ясно', uz: 'Asosan ochiq', kaa: 'Ti karán ashıq', icon: Sun },
  2: { en: 'Partly cloudy', ru: 'Переменная облачность', uz: "Qisman bulutli", kaa: 'Qısım bulutlı', icon: Cloud },
  3: { en: 'Overcast', ru: 'Пасмурно', uz: 'Bulutli', kaa: 'Bulutlı', icon: Cloud },
  45: { en: 'Fog', ru: 'Туман', uz: 'Tuman', kaa: 'Tuman', icon: Cloud },
  48: { en: 'Rime fog', ru: 'Изморозь', uz: 'Qiroli tuman', kaa: 'Qıro tuman', icon: Cloud },
  51: { en: 'Light drizzle', ru: 'Слабая морось', uz: "Yengil selp", kaa: 'Jeńil sepki', icon: CloudRain },
  53: { en: 'Drizzle', ru: 'Морось', uz: 'Selp', kaa: 'Sepki', icon: CloudRain },
  55: { en: 'Dense drizzle', ru: 'Сильная морось', uz: "Qattiq selp", kaa: "Qattı sepki", icon: CloudRain },
  61: { en: 'Light rain', ru: 'Слабый дождь', uz: "Yengil yomg'ir", kaa: 'Jeńil jawın', icon: CloudRain },
  63: { en: 'Rain', ru: 'Дождь', uz: "Yomg'ir", kaa: 'Jawın', icon: CloudRain },
  65: { en: 'Heavy rain', ru: 'Сильный дождь', uz: "Qattiq yomg'ir", kaa: 'Qattı jawın', icon: CloudRain },
  71: { en: 'Light snow', ru: 'Слабый снег', uz: "Yengil qor", kaa: 'Jeńil qar', icon: CloudSnow },
  73: { en: 'Snow', ru: 'Снег', uz: 'Qor', kaa: 'Qar', icon: CloudSnow },
  75: { en: 'Heavy snow', ru: 'Сильный снег', uz: "Qattiq qor", kaa: 'Qattı qar', icon: CloudSnow },
  80: { en: 'Rain showers', ru: 'Ливень', uz: 'Sel yomg\'ir', kaa: 'Sel jawın', icon: CloudRain },
  81: { en: 'Heavy showers', ru: 'Сильный ливень', uz: 'Qattiq sel', kaa: 'Qattı sel', icon: CloudRain },
  82: { en: 'Violent showers', ru: 'Жестокий ливень', uz: 'Juda qattiq sel', kaa: 'Júda qattı sel', icon: CloudRain },
  95: { en: 'Thunderstorm', ru: 'Гроза', uz: "Momaqaldiroq", kaa: 'Shaqmaq', icon: Cloud },
  96: { en: 'Storm + hail', ru: 'Гроза с градом', uz: "Momaqaldiroq va do'l", kaa: "Shaqmaq hám do'l", icon: Cloud },
  99: { en: 'Severe storm', ru: 'Сильная гроза', uz: "Qattiq momaqaldiroq", kaa: 'Qattı shaqmaq', icon: Cloud },
};

// Nukus coordinates
const NUKUS_LAT = 42.4531;
const NUKUS_LON = 59.6103;

import { getText } from '@/lib/translations';
import type { Lang } from '@/lib/translations';

function getWeatherInfo(code: number, _lang?: Lang) {
  return WEATHER_CODES[code] ?? { en: 'Unknown', ru: 'Неизвестно', uz: 'Noma\'lum', kaa: 'Belgisiz', icon: Cloud };
}

const TIME_LABELS: Record<string, Record<string, string>> = {
  local: { en: 'Local Time in Nukus', ru: 'Местное время в Нукусе', uz: "Nukus mahalliy vaqti", kaa: 'Nókis jergilikli waqtı' },
  feelsLike: { en: 'Feels like', ru: 'Ощущается', uz: 'His qilinadi', kaa: 'Seziledi' },
  wind: { en: 'Wind', ru: 'Ветер', uz: 'Shamol', kaa: 'Samal' },
  humidity: { en: 'Humidity', ru: 'Влажность', uz: 'Namlik', kaa: 'Namlıq' },
  uv: { en: 'UV Index', ru: 'УФ-индекс', uz: 'UV indeks', kaa: 'UV indeks' },
  visibility: { en: 'Visibility', ru: 'Видимость', uz: "Ko'rinish", kaa: 'Kórinis' },
  forecast: { en: '3-Day Forecast', ru: 'Прогноз на 3 дня', uz: '3-kun prognoz', kaa: '3-kún prognoz' },
  packing: { en: 'Smart Packing List', ru: 'Умный список вещей', uz: 'Aqlli yig\'ilish ro\'yxati', kaa: 'Aqıllı jiyıw dizimi' },
  packingDesc: { en: 'Recommended for current conditions', ru: 'Рекомендовано для текущих условий', uz: 'Joriy sharoit uchun', kaa: 'Házirgi sharayat ushın' },
  loading: { en: 'Loading weather...', ru: 'Загрузка погоды...', uz: "Ob-havo yuklanmoqda...", kaa: "Hawa-jayıt júklenbaqta..." },
  error: { en: 'Could not load weather. Check your connection.', ru: 'Не удалось загрузить погоду. Проверьте подключение.', uz: "Ob-havo yuklanmadi. Aloqani tekshiring.", kaa: "Hawa-jayıt júklenbedi. Baylanıstı tekseriń." },
  retry: { en: 'Retry', ru: 'Повторить', uz: "Qayta urinish", kaa: "Qaytalaw" },
  refresh: { en: 'Refresh', ru: 'Обновить', uz: 'Yangilash', kaa: 'Jańalaw' },
};

export default function WeatherPacking() {
  const { lang } = useLang();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [localTime, setLocalTime] = useState('');
  const [timeZone] = useState('Asia/Samarkand');

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${NUKUS_LAT}&longitude=${NUKUS_LON}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,uv_index,visibility&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=Asia%2FSamarkand&forecast_days=3`
      );
      if (!res.ok) throw new Error('Weather fetch failed');
      const data = await res.json();
      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        windSpeed: Math.round(data.current.wind_speed_10m),
        humidity: data.current.relative_humidity_2m,
        weatherCode: data.current.weather_code,
        apparentTemp: Math.round(data.current.apparent_temperature),
        uvIndex: Math.round(data.current.uv_index),
        visibility: Math.round(data.current.visibility / 1000),
        daily: data.daily.time.map((_: string, i: number) => ({
          max: Math.round(data.daily.temperature_2m_max[i]),
          min: Math.round(data.daily.temperature_2m_min[i]),
          code: data.daily.weather_code[i],
        })),
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  useEffect(() => {
    const updateTime = () => {
      try {
        const formatter = new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone,
          hour12: false,
        });
        setLocalTime(formatter.format(new Date()));
      } catch {
        setLocalTime(new Date().toLocaleTimeString());
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timeZone]);

  const currentMonth = new Date().getMonth() + 1;
  const season = weather
    ? getSeasonFromTemp(weather.temperature)
    : getCurrentSeason(currentMonth);

  const packingList = getText<string[]>(PACKING_RULES[season], lang) || PACKING_RULES[season].en;
  const tl = (key: string) => TIME_LABELS[key]?.[lang] ?? TIME_LABELS[key]?.en ?? key;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <CloudSun className="h-12 w-12 text-deepblue-400 mx-auto mb-3 animate-pulse" />
          <p className="text-deepblue-600 text-sm">{tl('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center max-w-sm">
          <AlertCircle className="h-12 w-12 text-terracotta-400 mx-auto mb-3" />
          <p className="text-deepblue-700 text-sm mb-4">{tl('error')}</p>
          <button
            onClick={fetchWeather}
            className="inline-flex items-center gap-2 rounded-xl bg-deepblue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-deepblue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            {tl('retry')}
          </button>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const weatherInfo = getWeatherInfo(weather.weatherCode, lang);
  const WeatherIcon = weatherInfo.icon;

  return (
    <div className="space-y-6">
      {/* Weather card */}
      <div className="rounded-2xl bg-gradient-to-br from-deepblue-600 via-deepblue-700 to-deepblue-900 p-6 text-white shadow-medium overflow-hidden relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />

        <div className="relative flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-sand-300 text-xs mb-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{tl('local')}</span>
            </div>
            <div className="font-display text-3xl font-bold tabular-nums tracking-tight">{localTime}</div>
          </div>
          <button
            onClick={fetchWeather}
            className="rounded-lg bg-white/10 p-2 hover:bg-white/20 transition-colors"
            aria-label={tl('refresh')}
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="relative flex items-center gap-4">
          <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/20">
            <WeatherIcon className="h-12 w-12 text-sand-300" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-5xl font-bold">{weather.temperature}°</span>
              <span className="text-sand-300 text-lg">C</span>
            </div>
            <p className="text-sand-200 text-sm">{getText(weatherInfo, lang)}</p>
            <p className="text-sand-300 text-xs mt-0.5">{tl('feelsLike')} {weather.apparentTemp}°C</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {[
            { icon: Wind, label: tl('wind'), value: `${weather.windSpeed} km/h` },
            { icon: Droplets, label: tl('humidity'), value: `${weather.humidity}%` },
            { icon: Sun, label: tl('uv'), value: weather.uvIndex },
            { icon: Eye, label: tl('visibility'), value: `${weather.visibility} km` },
          ].map((m) => (
            <div key={m.label} className="rounded-xl bg-white/10 p-3 ring-1 ring-white/10">
              <m.icon className="h-4 w-4 text-sand-300 mb-1.5" />
              <p className="text-[10px] text-sand-300 leading-none mb-1">{m.label}</p>
              <p className="text-sm font-semibold">{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3-day forecast */}
      <div className="rounded-2xl bg-white ring-1 ring-sand-200 p-5">
        <h4 className="font-display text-sm font-semibold text-deepblue-900 mb-4 flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-terracotta-500" />
          {tl('forecast')}
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {weather.daily.map((day, i) => {
            const di = getWeatherInfo(day.code, lang);
            const DIcon = di.icon;
            const dayLabel = i === 0
              ? (lang === 'ru' ? 'Сегодня' : lang === 'uz' ? 'Bugun' : lang === 'kaa' ? 'Búgin' : 'Today')
              : i === 1
              ? (lang === 'ru' ? 'Завтра' : lang === 'uz' ? "Ertaga" : lang === 'kaa' ? 'Erte' : 'Tomorrow')
              : (lang === 'ru' ? 'Послезавтра' : lang === 'uz' ? "Irtaga" : lang === 'kaa' ? 'Irtaga' : 'Day 3');
            return (
              <div key={i} className="rounded-xl bg-sand-50 p-3 text-center">
                <p className="text-xs font-medium text-deepblue-600 mb-2">{dayLabel}</p>
                <DIcon className="h-8 w-8 text-deepblue-500 mx-auto mb-2" />
                <p className="text-xs text-deepblue-500 mb-1">{getText(di, lang)}</p>
                <div className="flex items-center justify-center gap-1.5 text-sm">
                  <span className="font-bold text-deepblue-900">{day.max}°</span>
                  <span className="text-deepblue-400">/</span>
                  <span className="text-deepblue-500">{day.min}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Packing list */}
      <div className="rounded-2xl bg-white ring-1 ring-sand-200 p-5">
        <div className="flex items-center gap-2 mb-1">
          <Package className="h-5 w-5 text-terracotta-500" />
          <h4 className="font-display text-sm font-semibold text-deepblue-900">{tl('packing')}</h4>
        </div>
        <p className="text-xs text-deepblue-500 mb-4">
          {tl('packingDesc')} · <span className="font-medium text-terracotta-600">{getText(SEASON_NAMES[season], lang)}</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {packingList.map((item: string, i: number) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg bg-sand-50 px-3 py-2 text-sm text-deepblue-700 animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-terracotta-100 text-terracotta-600 flex items-center justify-center text-[10px] font-bold">
                {i + 1}
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
