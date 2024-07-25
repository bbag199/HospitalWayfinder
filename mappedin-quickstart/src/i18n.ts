import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      Contact: "Contact",
      Setting: "Setting",
    },
  },
  cn: {
    translation: {
      Contact: "联系方式",
      Settings: "设置",
    },
  },
  mi: {
    translation: {
      Contact: "Whakapā",
      Settings: "Tautuhinga",
    },
  },
  vi: {
    translation: {
      Contact: "Liên hệ",
      Settings: "Cài đặt",
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