// ============================================================================
// CYBERSECURITY HONEYPOT & PENTEST EASTER EGGS
// ============================================================================

export function initHoneypot(): void {
  if (typeof window === 'undefined') return;

  // 1. DevTools Console Warning Banner
  const titleStyle =
    'background: #dc2626; color: #ffffff; font-size: 20px; font-weight: 900; padding: 10px 18px; border-radius: 8px; text-shadow: 1px 1px 3px black;';
  const descStyle =
    'color: #f59e0b; font-size: 14px; font-weight: 700; margin-top: 6px; line-height: 1.5;';
  const commandStyle =
    'color: #38bdf8; font-size: 13px; font-family: monospace; background: #0f172a; padding: 4px 8px; border-radius: 4px;';

  console.log('%c🚨 СТОЙ! ОБНАРУЖЕН ПЕНТЕСТЕР! 🚨', titleStyle);
  console.log(
    '%c🤡 Попался! Ищешь уязвимости, ключи и токены в консоли?\nСтатус пентеста: ТЫ ЛОХ!\nВсе 28 таблиц надёжно заблокированы через Supabase RLS и криптографические JWT-сессии.',
    descStyle
  );
  console.log(
    '%c💡 Хочешь хакнуть систему? Попробуй вызвать: %cwindow.getAdminPassword()%c или %cwindow.hackSystem()',
    'color: #94a3b8; font-size: 12px;',
    commandStyle,
    'color: #94a3b8; font-size: 12px;',
    commandStyle
  );

  // 2. Global window fake traps (decoy objects for script-kiddies)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;

  w.__ADMIN_SECRET_KEY__ = 'loh_ne_mamont_2026_super_secret_token';
  w.__DATABASE_ROOT__ = 'postgres://root:ti_loh@127.0.0.1/fake_db';

  w.getAdminPassword = () => {
    console.warn('⚠️ ОШИБКА 418: ЛОХ-ДЕТЕКТОР ЗАШКАЛИВАЕТ!');
    return '🤡 ТЫ ЛОХ! Реально думал, что пароль супер-админа хранится в объекте window в браузере? 😂';
  };

  w.hackSystem = () => {
    return '💀 [EXPLOIT STATUS]: Ошибка! Квалификация взломщика равна нулю. Пентест провален. Иди учи уроки!';
  };

  w.getFlag = () => {
    return '🚩 FLAG{TY_LOH_PENTESTER_CIRCUS_CLOWN_2026}';
  };

  w.bypassAuth = () => {
    return '🚫 [BYPASS FAILED]: Защита отразила атаку. Ты снова попался как лох.';
  };
}
