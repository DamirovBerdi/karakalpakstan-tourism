import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  Square,
  MapPin,
  Headphones,
  Mic,
  MicOff,
  Globe,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { findResponse } from '@/data/chatKnowledgeBase';
import {
  CHAT_LANGUAGES,
  BCP47_MAP,
  getChatUIStrings,
  getChatLanguage,
  detectBrowserLanguage,
  isCoreLanguage,
} from '@/data/chatLanguages';
import type { Lang as CoreLang } from '@/lib/translations';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  id: number;
  lang?: string;
  isFallback?: boolean;
}

const STORAGE_KEY = 'kk-chat-history-v2';
const LANG_STORAGE_KEY = 'kk-chat-lang';
const MAX_HISTORY = 20;
let msgCounter = 0;
const nextId = () => ++msgCounter;

type SpeechRecognitionType = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEventLike = {
  results: { 0: { transcript: string }; length: number }[];
  resultIndex: number;
};

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionType) | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionType;
    webkitSpeechRecognition?: new () => SpeechRecognitionType;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export default function ChatBot() {
  const { lang: siteLang } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(false);
  const [audioPlayingId, setAudioPlayingId] = useState<number | null>(null);
  const [audioErrorId, setAudioErrorId] = useState<number | null>(null);
  const [audioSupported, setAudioSupported] = useState(true);
  const [showOnSiteBanner, setShowOnSiteBanner] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [chatLang, setChatLang] = useState<string>(siteLang);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [autoDetected, setAutoDetected] = useState(false);
  const [_voicesLoaded, setVoicesLoaded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const initialized = useRef(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const speechRecognitionSupported = useMemo(
    () => getSpeechRecognitionCtor() !== null,
    []
  );

  const ui = useMemo(() => getChatUIStrings(chatLang), [chatLang]);
  const chatLangInfo = useMemo(() => getChatLanguage(chatLang), [chatLang]);

  const coreLang: CoreLang = isCoreLanguage(chatLang) ? (chatLang as CoreLang) : chatLangInfo.coreLang;

  const suggestions = useMemo(
    () => [
      ui.suggestion1,
      ui.suggestion2,
      ui.suggestion3,
      ui.suggestion4,
    ],
    [ui]
  );

  const onSiteSuggestions = useMemo(
    () => [ui.suggestion5, ui.suggestion6],
    [ui]
  );

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setAudioSupported(false);
    }

    const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
    if (savedLang && CHAT_LANGUAGES.some((l) => l.code === savedLang)) {
      setChatLang(savedLang);
      setAutoDetected(false);
    } else {
      const detected = detectBrowserLanguage();
      if (detected !== siteLang) {
        setChatLang(detected);
        setAutoDetected(true);
      }
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: ChatMessage[] = JSON.parse(saved);
        setMessages(parsed.map((m) => ({ ...m, id: nextId() })));
      } else {
        setMessages([{ role: 'assistant', content: ui.welcome, id: nextId(), lang: chatLang }]);
      }
    } catch {
      setMessages([{ role: 'assistant', content: ui.welcome, id: nextId(), lang: chatLang }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const handler = () => setVoicesLoaded(true);
      window.speechSynthesis.addEventListener('voiceschanged', handler);
      window.speechSynthesis.getVoices();
      return () => window.speechSynthesis.removeEventListener('voiceschanged', handler);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(messages.slice(-MAX_HISTORY).map(({ id: _id, ...rest }) => rest))
        );
      } catch {
        // ignore quota errors
      }
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setUnread(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setShowLangDropdown(false);
      }
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      recognitionRef.current?.stop();
    };
  }, []);

  const stopAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setAudioPlayingId(null);
  }, []);

  const playAudio = useCallback(
    async (msgId: number, text: string) => {
      if (audioPlayingId === msgId) {
        stopAudio();
        return;
      }

      stopAudio();
      setAudioErrorId(null);

      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setAudioErrorId(msgId);
        setAudioSupported(false);
        return;
      }

      try {
        const utterance = new SpeechSynthesisUtterance(text);
        const bcp47 = BCP47_MAP[chatLang] ?? 'en-US';
        utterance.lang = bcp47;
        utterance.rate = 0.95;
        utterance.pitch = 1;

        const voices = window.speechSynthesis.getVoices();
        const langPrefix = bcp47.split('-')[0].toLowerCase();
        const matchedVoice =
          voices.find((v) => v.lang.toLowerCase() === bcp47.toLowerCase()) ??
          voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
        if (matchedVoice) utterance.voice = matchedVoice;

        utterance.onend = () => {
          setAudioPlayingId(null);
          utteranceRef.current = null;
        };
        utterance.onerror = () => {
          setAudioErrorId(msgId);
          setAudioPlayingId(null);
          utteranceRef.current = null;
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setAudioPlayingId(msgId);
      } catch {
        setAudioErrorId(msgId);
      }
    },
    [audioPlayingId, chatLang, stopAudio]
  );

  const handleLangChange = useCallback(
    (code: string) => {
      setChatLang(code);
      setAutoDetected(false);
      setShowLangDropdown(false);
      try {
        localStorage.setItem(LANG_STORAGE_KEY, code);
      } catch {
        // ignore
      }
      stopAudio();
      const newUi = getChatUIStrings(code);
      setMessages((prev) => {
        if (prev.length === 1 && prev[0].role === 'assistant') {
          return [{ role: 'assistant', content: newUi.welcome, id: nextId(), lang: code }];
        }
        return prev;
      });
    },
    [stopAudio]
  );

  const toggleRecording = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new Ctor();
      recognition.lang = BCP47_MAP[chatLang] ?? 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setInput(transcript);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => {
        setIsRecording(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
    } catch {
      setIsRecording(false);
    }
  }, [chatLang, isRecording]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setShowOnSiteBanner(false);
      const userMsg: ChatMessage = { role: 'user', content: trimmed, id: nextId(), lang: chatLang };
      const history = [...messages, userMsg];
      setMessages(history);
      setInput('');
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const validLang: 'en' | 'ru' | 'uz' | 'kaa' = (coreLang === 'ru' || coreLang === 'uz' || coreLang === 'kaa') ? coreLang : 'en';
      const replyText = findResponse(trimmed, validLang);
      const isFallbackReply = !isCoreLanguage(chatLang);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: replyText,
          id: nextId(),
          lang: chatLang,
          isFallback: isFallbackReply,
        },
      ]);
      if (!open) setUnread(true);
      setLoading(false);
    },
    [loading, messages, open, chatLang, coreLang]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-6 z-40 flex items-center gap-2 rounded-full bg-deepblue-700 px-4 py-3.5 text-white shadow-elevated ring-4 ring-deepblue-700/20 transition-all hover:bg-deepblue-800 hover:scale-105 sm:px-5"
          aria-label="Open AI Voice Guide chat"
        >
          <span className="absolute inset-0 rounded-full bg-deepblue-700 animate-pulse-ring" />
          <Headphones className="h-6 w-6 relative" />
          <span className="font-display font-bold text-sm relative hidden sm:inline">AI Guide</span>
          {unread && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-terracotta-500 ring-2 ring-white relative" />
          )}
        </button>
      )}

      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-[55] w-[calc(100vw-2rem)] sm:w-96 max-w-md animate-fade-up">
          <div className="flex h-[34rem] max-h-[72vh] flex-col rounded-2xl bg-white shadow-elevated ring-1 ring-deepblue-900/10 overflow-hidden">
            <div className="flex items-center justify-between bg-gradient-to-r from-deepblue-700 to-deepblue-900 px-4 py-3 text-white">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="rounded-full bg-sand-400/20 p-1.5 ring-1 ring-sand-400/30 flex-shrink-0">
                  <Bot className="h-5 w-5 text-sand-300" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-sm font-bold leading-tight truncate">{ui.title}</h3>
                  <p className="text-xs text-sand-300 flex items-center gap-1 truncate">
                    <Sparkles className="h-2.5 w-2.5 flex-shrink-0" /> {ui.subtitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="relative" ref={langDropdownRef}>
                  <button
                    onClick={() => setShowLangDropdown((v) => !v)}
                    className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium hover:bg-white/20 transition-colors"
                    aria-label={ui.languageLabel}
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span className="text-base leading-none">{chatLangInfo.flag}</span>
                    <ChevronDown className={`h-3 w-3 transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showLangDropdown && (
                    <div className="absolute right-0 top-full mt-1 max-h-64 w-52 overflow-y-auto rounded-xl bg-white py-1.5 shadow-elevated ring-1 ring-sand-200 z-10 scrollbar-thin">
                      <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-deepblue-400 border-b border-sand-100 mb-1">
                        {ui.languageLabel}
                      </div>
                      {CHAT_LANGUAGES.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => handleLangChange(l.code)}
                          className={`flex w-full items-center gap-2 px-3 py-1.5 text-xs transition-colors ${
                            chatLang === l.code
                              ? 'bg-deepblue-50 text-deepblue-700 font-semibold'
                              : 'text-deepblue-600 hover:bg-sand-50'
                          }`}
                        >
                          <span className="text-base leading-none flex-shrink-0">{l.flag}</span>
                          <span className="flex-1 text-left truncate">{l.label}</span>
                          {chatLang === l.code && <Check className="h-3 w-3 text-deepblue-500 flex-shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 hover:bg-white/20 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {autoDetected && (
              <div className="flex items-center gap-1.5 bg-terracotta-50 px-3 py-1.5 text-[11px] text-terracotta-700 border-b border-terracotta-100">
                <Sparkles className="h-3 w-3 flex-shrink-0" />
                <span>{ui.autoDetected}: {chatLangInfo.label}</span>
              </div>
            )}

            <div className="flex-1 overflow-y-auto scrollbar-thin bg-sand-50 px-3 py-3 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex-shrink-0 rounded-full bg-deepblue-100 p-1.5 mt-0.5">
                      <Bot className="h-4 w-4 text-deepblue-600" />
                    </div>
                  )}
                  <div className="max-w-[80%]">
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                        msg.role === 'user'
                          ? 'bg-terracotta-500 text-white rounded-br-md'
                          : 'bg-white text-deepblue-900 ring-1 ring-sand-200 rounded-bl-md'
                      }`}
                    >
                      {msg.content}
                    </div>
                    {msg.role === 'assistant' && msg.isFallback && (
                      <p className="mt-0.5 ml-1 text-[10px] text-deepblue-400 italic">{ui.fallbackNote}</p>
                    )}
                    {msg.role === 'assistant' && audioSupported && (
                      <div className="mt-1 flex items-center gap-1.5">
                        <button
                          onClick={() => playAudio(msg.id, msg.content)}
                          className="flex items-center gap-1 rounded-lg bg-deepblue-50 px-2 py-1 text-[10px] font-medium text-deepblue-600 ring-1 ring-deepblue-100 transition-all hover:bg-deepblue-100 disabled:opacity-50"
                          aria-label={ui.listen}
                        >
                          {audioPlayingId === msg.id ? (
                            <>
                              <Square className="h-3 w-3 fill-current" />
                              {ui.stop}
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-3 w-3" />
                              {ui.listen}
                            </>
                          )}
                        </button>
                        {audioErrorId === msg.id && (
                          <span className="text-[10px] text-terracotta-500">{ui.audioError}</span>
                        )}
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="flex-shrink-0 rounded-full bg-terracotta-100 p-1.5 mt-0.5">
                      <User className="h-4 w-4 text-terracotta-600" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-2 justify-start">
                  <div className="flex-shrink-0 rounded-full bg-deepblue-100 p-1.5 mt-0.5">
                    <Bot className="h-4 w-4 text-deepblue-600" />
                  </div>
                  <div className="rounded-2xl rounded-bl-md bg-white ring-1 ring-sand-200 px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-deepblue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 rounded-full bg-deepblue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 rounded-full bg-deepblue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {messages.length <= 1 && !loading && showOnSiteBanner && (
                <div className="rounded-xl bg-gradient-to-br from-terracotta-50 to-sand-100 p-3 ring-1 ring-terracotta-200">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-terracotta-500" />
                    <p className="text-xs font-semibold text-terracotta-700">{ui.onSiteTitle}</p>
                  </div>
                  <p className="text-xs text-deepblue-600 mb-2">{ui.onSiteDesc}</p>
                  <div className="space-y-1.5">
                    {onSiteSuggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="w-full text-left rounded-lg bg-white px-3 py-2 text-xs text-deepblue-700 ring-1 ring-terracotta-200 hover:bg-terracotta-50 transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.length <= 1 && !loading && (
                <div className="pt-1 space-y-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="w-full text-left rounded-xl bg-white px-3 py-2 text-xs text-deepblue-700 ring-1 ring-sand-200 hover:bg-sand-50 hover:ring-terracotta-300 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {messages.length <= 1 && (
              <div className="flex items-center gap-2 bg-deepblue-50 px-3 py-2 text-xs text-deepblue-600 border-t border-deepblue-100">
                <Headphones className="h-4 w-4 flex-shrink-0 text-deepblue-500" />
                <span>{ui.audioGuideDesc}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-sand-200 bg-white px-3 py-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={ui.placeholder}
                disabled={loading}
                className="flex-1 rounded-xl border border-sand-200 px-3.5 py-2.5 text-sm text-deepblue-900 placeholder-deepblue-400/60 focus:border-deepblue-400 focus:outline-none focus:ring-2 focus:ring-deepblue-200 disabled:opacity-60"
              />
              {speechRecognitionSupported && (
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={loading}
                  className={`flex-shrink-0 rounded-xl p-2.5 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                    isRecording ? 'bg-red-500 animate-pulse' : 'bg-deepblue-600 hover:bg-deepblue-700'
                  }`}
                  aria-label={isRecording ? ui.stopRecording : ui.voiceInput}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex-shrink-0 rounded-xl bg-terracotta-500 p-2.5 text-white transition-colors hover:bg-terracotta-600 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label={ui.send}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            <div className="bg-sand-50 px-4 py-1.5 text-center text-[10px] text-deepblue-400 border-t border-sand-100">
              {ui.disclaimer}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
