import { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, Download, X } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { applyServiceWorkerUpdate } from '@/lib/pwa';

const LABELS: Record<string, Record<string, string>> = {
  offline: {
    en: "You're offline — showing saved content",
    ru: 'Вы офлайн — показан сохранённый контент',
    uz: "Siz oflaynsiz — saqlangan kontent ko'rsatilmoqda",
    kaa: "Siz oflaynsız — saqlangan kontent kórsetilbaqta",
  },
  backOnline: {
    en: 'Back online!',
    ru: 'Снова онлайн!',
    uz: 'Yana onlayn!',
    kaa: 'Qayta onlayn!',
  },
  updateTitle: {
    en: 'Update available',
    ru: 'Доступно обновление',
    uz: 'Yangilanish mavjud',
    kaa: 'Jańalanıw bar',
  },
  updateDesc: {
    en: 'A new version of the app is ready. Refresh to update.',
    ru: 'Новая версия приложения готова. Обновите, чтобы загрузить.',
    uz: "Ilovaning yangi versiyasi tayyor. Yangilash uchun yangilang.",
    kaa: "Ilovanıń jańa versiyası tayyar. Jańalaw ushın jańalań.",
  },
  updateNow: {
    en: 'Update now',
    ru: 'Обновить сейчас',
    uz: 'Hozir yangilash',
    kaa: 'Házir jańalaw',
  },
};

export default function OfflineIndicator() {
  const { lang } = useLang();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [showBackOnline, setShowBackOnline] = useState(false);

  const tl = (key: string) => LABELS[key]?.[lang] ?? LABELS[key]?.en ?? key;

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setWasOffline(true);
    };
    const handleOnline = () => {
      setIsOffline(false);
      if (wasOffline) {
        setShowBackOnline(true);
        setTimeout(() => setShowBackOnline(false), 3500);
      }
    };
    const handleUpdate = () => setShowUpdateBanner(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('sw-update-available', handleUpdate);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('sw-update-available', handleUpdate);
    };
  }, [wasOffline]);

  return (
    <>
      {isOffline && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 animate-fade-in pointer-events-none">
          <div className="flex items-center gap-2 rounded-full bg-deepblue-900/95 backdrop-blur-md px-4 py-2 shadow-medium ring-1 ring-white/10">
            <WifiOff className="h-4 w-4 text-sand-300" />
            <span className="text-xs font-medium text-sand-100">{tl('offline')}</span>
            <Download className="h-3 w-3 text-green-400 ml-1" />
          </div>
        </div>
      )}

      {showBackOnline && !isOffline && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 animate-fade-in">
          <div className="flex items-center gap-2 rounded-full bg-green-600/95 backdrop-blur-md px-4 py-2 shadow-medium">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            <span className="text-xs font-semibold text-white">{tl('backOnline')}</span>
          </div>
        </div>
      )}

      {showUpdateBanner && (
        <div className="fixed bottom-4 right-4 z-50 max-w-xs animate-fade-up">
          <div className="rounded-2xl bg-white shadow-elevated ring-1 ring-sand-200 p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-terracotta-100 p-1.5">
                  <RefreshCw className="h-4 w-4 text-terracotta-600" />
                </div>
                <h4 className="font-display text-sm font-bold text-deepblue-900">{tl('updateTitle')}</h4>
              </div>
              <button
                onClick={() => setShowUpdateBanner(false)}
                className="text-deepblue-400 hover:text-deepblue-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-deepblue-600 mb-3">{tl('updateDesc')}</p>
            <button
              onClick={applyServiceWorkerUpdate}
              className="w-full rounded-lg bg-terracotta-500 py-2 text-xs font-semibold text-white hover:bg-terracotta-600 transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {tl('updateNow')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
