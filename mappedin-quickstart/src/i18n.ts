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
      To: "To: Search destination...",
      From: "From: Search starting point...",
      GetDirections: "Get Directions",
      EmergencyExit: "Emergency Exit",
      "Module 2a": "Module 2a", //testing
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
      GetDirections: "Tikina nga Tohutohu",
      EmergencyExit: "Putanga Whawhati Tata",
      "Module 2a": "Mōtū 2a",//testing
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
      GetDirections: "获取方向",
      EmergencyExit: "紧急出口",
      "Module 2a": "模块 2a",//testing
    },
  },

  tw: {
    translation: {
      Contact: "聯絡方式",
      Settings: "設置",
      Mode: "模式",
      Language: "語言",
      Apply: "應用",
      Light: "淺色",
      Dark: "深色",
      SettingsTitle: "設置",
      To: "到: 搜索目的地...",
      From: "從: 搜索起點...",
      GetDirections: "獲取方向",
      EmergencyExit: "緊急出口",
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
      GetDirections: "Nhận chỉ đường",
      EmergencyExit: "Lối Thoát Hiểm",
    },
  },

  sm: {
    translation: {
      Contact: "Fa'afeso'ota'i",
      Settings: "Seti",
      Mode: "Faiga",
      Language: "Gagana",
      Apply: "Fa'atino",
      Light: "Malamalama",
      Dark: "Pogisa",
      SettingsTitle: "Seti",
      To: "I: Saili nofoaga...",
      From: "Mai: Saili nofoaga amata...",
      GetDirections: "Maua Faatonuga",
      EmergencyExit: "Ala Faafuasei",
    },
  },

  to: {
    translation: {
      Contact: "Fetu'utaki",
      Settings: "Ngaahi Seti",
      Mode: "Taimi",
      Language: "Lea",
      Apply: "Fakalele",
      Light: "Maama",
      Dark: "Pōuli",
      SettingsTitle: "Ngaahi Seti",
      To: "Ki he: Fekumi ki he feitu'u...",
      From: "Mei he: Fekumi ki he feitu'u kamata...",
      GetDirections: "Ma'u e ngaahi Fokotu'utu'u",
      EmergencyExit: "Hala Fa'atu'utu'unga",
    },
  },

  pa: {
    translation: {
      Contact: "ਸੰਪਰਕ ਕਰੋ",
      Settings: "ਸੈਟਿੰਗਜ਼",
      Mode: "ਮੋਡ",
      Language: "ਭਾਸ਼ਾ",
      Apply: "ਲਾਗੂ ਕਰੋ",
      Light: "ਹਲਕਾ",
      Dark: "ਗੂੜਾ",
      SettingsTitle: "ਸੈਟਿੰਗਜ਼",
      To: "ਨੂੰ: ਗੰਟਵਿਓ ਖੋਜੋ...",
      From: "ਤੋਂ: ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਖੋਜੋ...",
      GetDirections: "ਦਿਸ਼ਾਵਾਂ ਪ੍ਰਾਪਤ ਕਰੋ",
      EmergencyExit: "ਐਮਰਜੈਂਸੀ ਐਗਜ਼ਿਟ",
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
