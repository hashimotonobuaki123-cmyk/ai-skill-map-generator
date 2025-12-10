"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import { Locale, defaultLocale } from "@/src/i18n/config";

interface LocaleContextType {
  locale: Locale;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    // Return a fallback when not in LocaleProvider
    return {
      locale: defaultLocale as Locale,
      toggleLocale: () => {},
    };
  }
  return context;
}

interface LocaleProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

// Cache for loaded messages
const messagesCache: Record<string, AbstractIntlMessages> = {};

async function loadMessages(locale: string): Promise<AbstractIntlMessages> {
  if (messagesCache[locale]) {
    return messagesCache[locale];
  }
  
  const mod = await import(`@/src/messages/${locale}.json`);
  messagesCache[locale] = mod.default as AbstractIntlMessages;
  return messagesCache[locale];
}

export function LocaleProvider({ children, initialLocale }: LocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale || defaultLocale);
  const [messages, setMessages] = useState<AbstractIntlMessages | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial locale from localStorage or use initialLocale or default
  useEffect(() => {
    if (!initialLocale) {
      const savedLocale = localStorage.getItem("preferred-locale") as Locale | null;
      if (savedLocale && (savedLocale === "ja" || savedLocale === "en")) {
        setLocale(savedLocale);
      }
    }
  }, [initialLocale]);

  // Load messages when locale changes
  useEffect(() => {
    setIsLoading(true);
    loadMessages(locale)
      .then((msgs) => {
        setMessages(msgs);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [locale]);

  const toggleLocale = () => {
    const newLocale: Locale = locale === "ja" ? "en" : "ja";
    setLocale(newLocale);
    localStorage.setItem("preferred-locale", newLocale);
  };

  if (isLoading || !messages) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="animate-pulse text-[var(--text-secondary)]">Loading...</div>
      </div>
    );
  }

  return (
    <LocaleContext.Provider value={{ locale, toggleLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
