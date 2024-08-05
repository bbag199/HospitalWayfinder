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
      To: "到: 搜索目的地...",
      From: "从: 搜索起点...",
      GetDirections: "获取方向"
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
      To: "Ki: Rapu waahi...",
      From: "Mai: Rapu waahi timatanga...",
      GetDirections: "Tikina nga Tohutohu"
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
      To: "Đến: Tìm điểm đến...",
      From: "Từ: Tìm điểm xuất phát...",
      GetDirections: "Nhận chỉ đường"
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
