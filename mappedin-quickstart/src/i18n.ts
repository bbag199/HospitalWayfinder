import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      Contact: "Contact",
    },
  },
  cn: {
    translation: {
      Contact: "联系方式",
    },
  },
  mi: {
    translation: {
      Contact: "Whakapā",
    },
  },
  vi: {
    translation: {
      Contact: "Liên hệ",
    }
  }
};


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,//debug
    interpolation: {
      escapeValue:false
    }
  });

  export default i18n;