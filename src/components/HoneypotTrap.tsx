import React, { useState, useEffect } from 'react';
import { ShieldAlert, Terminal, Skull, AlertTriangle, ArrowLeft, Download, Bug } from 'lucide-react';

interface HoneypotTrapProps {
  path: string;
}

export default function HoneypotTrap({ path }: HoneypotTrapProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [trollModal, setTrollModal] = useState(false);

  useEffect(() => {
    const sequence = [
      `[0.01s] [HONEYPOT-SENSOR] Incoming probe on forbidden path: "${path}"`,
      `[0.04s] [SECURITY-CORE] Analyzing attack signatures (Burp Suite, SQLMap, Gobuster)...`,
      `[0.08s] [AI-ANALYTICS] Threat actor qualification: МАМКИН ХАКЕР`,
      `[0.12s] [DIAGNOSTIC] Exploit attempt: FAILED`,
      `[0.18s] [STATUS] >>> ТЫ ЛОХ 🤡 <<< Повёлся на очевидную приманку!`,
      `[0.25s] [DEFENSE] All 28 database tables are protected by PostgreSQL RLS.`,
      `[0.32s] [LOG] IP and browser signature logged to "Circus Clowns Registry".`,
      `[0.40s] [RECOMMENDATION] Закрывай Kali Linux, пора делать уроки :)`,
    ];

    sequence.forEach((line, index) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, line]);
      }, (index + 1) * 350);
    });
  }, [path]);

  const triggerExploitAttempt = () => {
    try {
      // Audio beep via Web Audio API
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {
      // AudioContext might be blocked before interaction
    }
    setTrollModal(true);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col items-center justify-center p-4 selection:bg-red-600 selection:text-white relative overflow-hidden">
      {/* Background Matrix Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#052e16_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      {/* Main Terminal Box */}
      <div className="relative w-full max-w-3xl rounded-2xl border-2 border-red-600/80 bg-neutral-950/95 shadow-[0_0_50px_rgba(220,38,38,0.3)] backdrop-blur-md overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-red-950/60 border-b border-red-700/60">
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-red-500 animate-ping inline-block" />
            <span className="h-3 w-3 rounded-full bg-red-500 inline-block" />
            <span className="h-3 w-3 rounded-full bg-yellow-500 inline-block" />
            <span className="h-3 w-3 rounded-full bg-green-500 inline-block" />
            <span className="text-xs uppercase tracking-widest text-red-200 font-bold ml-2 flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-red-400" />
              CYBER-DEFENSE HONEYPOT TRAP v2.6
            </span>
          </div>
          <span className="text-xs text-red-400 font-bold px-2.5 py-0.5 rounded bg-red-900/60 border border-red-700">
            СТАТУС: ЛОХ
          </span>
        </div>

        {/* Terminal Body */}
        <div className="p-6 space-y-5">
          {/* Big Troll Banner */}
          <div className="text-center py-4 border border-red-800/60 rounded-xl bg-red-950/30">
            <div className="text-5xl sm:text-6xl mb-2 animate-bounce">🤡</div>
            <h1 className="text-2xl sm:text-3xl font-black text-red-500 tracking-wider">
              ХАХАХА ПОПАЛСЯ! ТЫ ЛОХ!
            </h1>
            <p className="text-sm text-sand-300 mt-2 max-w-lg mx-auto">
              Ты перешёл по фейковому адресу <code className="text-yellow-400 bg-neutral-900 px-2 py-0.5 rounded font-bold">{path}</code> в надежде найти бэкдор или уязвимость.
            </p>
          </div>

          {/* ASCII Clown Face */}
          <div className="hidden sm:block text-center text-xs text-red-400/90 leading-tight select-none">
            <pre className="font-mono">
{`       .---.
      /     \\
     | () () |   <- ТВОЁ ЛИЦО, КОГДА ДУМАЛ ЧТО НАШЁЛ 0-DAY
      \\  -  /
       \`---\`
    [ СТАТУС: ЛОХ ГОДА 🏆 ]`}
            </pre>
          </div>

          {/* Simulated Logs */}
          <div className="bg-black/90 rounded-xl border border-neutral-800 p-4 h-48 overflow-y-auto text-xs space-y-1 scrollbar-thin scrollbar-thumb-neutral-800">
            <div className="text-neutral-500 mb-2 flex items-center gap-1">
              <Terminal className="h-3.5 w-3.5 text-neutral-400" />
              --- ЖУРНАЛ СРАБАТЫВАНИЯ СИСТЕМЫ ПЕРЕХВАТА ХАКЕРОВ ---
            </div>
            {logs.map((log, index) => (
              <div
                key={index}
                className={`font-mono transition-all duration-200 ${
                  log.includes('ТЫ ЛОХ')
                    ? 'text-red-400 font-extrabold text-sm py-0.5'
                    : log.includes('RLS')
                    ? 'text-yellow-300 font-semibold'
                    : 'text-green-400'
                }`}
              >
                {log}
              </div>
            ))}
            {logs.length < 8 && (
              <div className="text-green-500 animate-pulse">_ Анализ продолжается...</div>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-neutral-900/80 border border-neutral-800 p-3 rounded-lg">
              <div className="text-neutral-400 mb-1">Уровень угрозы</div>
              <div className="text-red-400 font-bold text-sm">0 / 100 (Клоун)</div>
            </div>
            <div className="bg-neutral-900/80 border border-neutral-800 p-3 rounded-lg">
              <div className="text-neutral-400 mb-1">Защита RLS</div>
              <div className="text-green-400 font-bold text-sm">28 из 28 таблиц</div>
            </div>
            <div className="bg-neutral-900/80 border border-neutral-800 p-3 rounded-lg">
              <div className="text-neutral-400 mb-1">Квалификация</div>
              <div className="text-yellow-400 font-bold text-sm">Ты Лох</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => (window.location.href = '/')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-black font-bold text-sm transition-all shadow-lg hover:shadow-green-600/30 active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              Признать поражение (На главную)
            </button>

            <button
              onClick={triggerExploitAttempt}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-200 font-bold text-sm transition-all active:scale-95"
            >
              <Bug className="h-4 w-4 text-red-400" />
              Ввести эксплоит (Zero-Day)
            </button>

            <a
              href="/admin-secret-backup.env"
              download
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-sand-300 text-xs transition-all"
            >
              <Download className="h-3.5 w-3.5 text-sand-400" />
              Скачать "секреты" (.env)
            </a>
          </div>
        </div>
      </div>

      {/* Easter Egg Modal when clicking "Zero Day" */}
      {trollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-neutral-900 border-2 border-red-600 rounded-2xl p-6 text-center shadow-2xl space-y-4">
            <div className="text-5xl animate-spin">🤡</div>
            <h2 className="text-xl font-black text-red-500 flex items-center justify-center gap-2">
              <Skull className="h-5 w-5" />
              ОШИБКА 418: ЛОХ-ДЕТЕКТОР ЗАШКАЛИВАЕТ!
            </h2>
            <p className="text-xs text-sand-300 leading-relaxed">
              Ты реально нажал кнопку «Ввести эксплоит» на странице, которая прямо говорит, что ты попался в ловушку? 😂
              <br />
              Уровень доверчивости: <strong>Максимальный</strong>.
            </p>
            <div className="p-3 bg-black/80 border border-red-900/60 rounded-lg text-xs text-yellow-400 font-mono">
              FLAG&#123;TY_LOH_HACKER_CIRCUS_CLOWN_2026&#125;
            </div>
            <button
              onClick={() => setTrollModal(false)}
              className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider"
            >
              Понял, признаю, больше не тыкаю
            </button>
          </div>
        </div>
      )}

      {/* Footer disclaimer */}
      <div className="mt-4 text-center text-xs text-neutral-600 flex items-center gap-1.5">
        <AlertTriangle className="h-3.5 w-3.5 text-neutral-500" />
        Karakalpakstan Tourism Portal Cybersecurity Honeypot Division &copy; 2026
      </div>
    </div>
  );
}
