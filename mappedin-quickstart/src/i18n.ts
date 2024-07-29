import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      Contact: "Contact",
      Setting: "Setting",
      Mode: "Mode",
      Language: "Language",
      Apply: "Apply",
    },
  },
  cn: {
    translation: {
      Contact: "联系方式",
      Settings: "设置",
      Mode: "模式",
      Language: "语言",
      Apply: "应用",
    },
  },
  mi: {
    translation: {
      Contact: "Whakapā",
      Settings: "Tautuhinga",
      Mode: "Aratau",
      Language: "Reo",
      Apply: "Whakamahia",
    },
  },
  vi: {
    translation: {
      Contact: "Liên hệ",
      Settings: "Cài đặt",
      Mode: "Chế độ",
      Language: "Ngôn ngữ",
      Apply: "Áp dụng",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: true, //debug
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
