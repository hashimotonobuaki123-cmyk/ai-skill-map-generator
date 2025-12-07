import {getRequestConfig} from "next-intl/server";
import {locales, defaultLocale, type Locale} from "../src/i18n/config";

export default getRequestConfig(async ({requestLocale}) => {
  // requestLocale は middleware から来るロケールを await で取得
  const requested = await requestLocale;
  const localeValue = (requested ?? defaultLocale) as Locale;
  const currentLocale: Locale = (locales as readonly string[]).includes(
    localeValue
  )
    ? localeValue
    : defaultLocale;

  return {
    locale: currentLocale,
    messages: (await import(`../src/messages/${currentLocale}.json`)).default
  };
});
