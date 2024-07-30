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
      Light: "Light",
      Dark: "Dark",
      SettingsTitle: "Settings",
      MapName1: "Level 1",
    },
  },
  cn: {
    translation: {
      Contact: "联系方式",
      Settings: "设置",
      Mode: "模式",
      Language: "语言",
      Apply: "应用",
      Light: "浅色",
      Dark: "深色",
      SettingsTitle: "设置",
      MapName1: "1楼",
    },
  },
  mi: {
    translation: {
      Contact: "Whakapā",
      Settings: "Tautuhinga",
      Mode: "Aratau",
      Language: "Reo",
      Apply: "Whakamahia",
      Light: "Māama",
      Dark: "Pōuri",
      SettingsTitle: "Tautuhinga",
      MapName1: "Papa 1",
    },
  },
  vi: {
    translation: {
      Contact: "Liên hệ",
      Settings: "Cài đặt",
      Mode: "Chế độ",
      Language: "Ngôn ngữ",
      Apply: "Áp dụng",
      Light: "Sáng",
      Dark: "Tối",
      SettingsTitle: "Cài đặt",
      MapName1: "Tầng 1",
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
