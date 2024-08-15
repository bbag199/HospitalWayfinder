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
      "Module 2a ": "Module 2a", //testing
      "Module 2 Anaesthetic & Pre-Admission":
        "Module 2 Anaesthetic & Pre-Admission",
      "Module 1 Orthopaedics & Radiology": "Module 1 Orthopaedics & Radiology",
      "Module 4 Pediatrics": "Module 4 Pediatrics",
      "Module 5 Plastic/ Hand Therapy": "Module 5 Plastic/ Hand Therapy",
      "Module 6 Ophtamology": "Module 6 Ophtamology",
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
      "Module 2a ": "Mōtū 2a", //testing
      "Module 2 Anaesthetic & Pre-Admission":
        "Wāhanga 2 Anarīhi me te Whakaurunga",
      "Module 1 Orthopaedics & Radiology":
        "Wāhanga 1 Ōropārangi me te Irarangi",
      "Module 4 Pediatrics": "Wāhanga 4 Tamariki",
      "Module 5 Plastic/ Hand Therapy": "Wāhanga 5 Puka/ Mahi Ringa",
      "Module 6 Ophtamology": "Wāhanga 6 Matapihi",
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
      "Module 2a ": "模块 2a", //testing
      "Module 2 Anaesthetic & Pre-Admission": "模块 2 麻醉和预入院",
      "Module 1 Orthopaedics & Radiology": "模块 1 骨科和放射科",
      "Module 4 Pediatrics": "模块 4 儿科",
      "Module 5 Plastic/ Hand Therapy": "模块 5 整形/手疗",
      "Module 6 Ophtamology": "模块 6 眼科",
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
      "Module 2a ": "模組 2a", //testing
      "Module 2 Anaesthetic & Pre-Admission": "模組 2 麻醉和預入院",
      "Module 1 Orthopaedics & Radiology": "模組 1 骨科和放射科",
      "Module 4 Pediatrics": "模組 4 兒科",
      "Module 5 Plastic/ Hand Therapy": "模組 5 整形/手療",
      "Module 6 Ophtamology": "模組 6 眼科",
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
      "Module 2a ": "Mô-đun 2a", //testing
      "Module 2 Anaesthetic & Pre-Admission":
        "Mô-đun 2 Gây mê & Tiền nhập viện",
      "Module 1 Orthopaedics & Radiology": "Mô-đun 1 Chỉnh hình & X-quang",
      "Module 4 Pediatrics": "Mô-đun 4 Nhi khoa",
      "Module 5 Plastic/ Hand Therapy":
        "Mô-đun 5 Phẫu thuật thẩm mỹ/ Trị liệu tay",
      "Module 6 Ophtamology": "Mô-đun 6 Nhãn khoa",
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
      "Module 2a ": "Module 2a", //testing
      "Module 2 Anaesthetic & Pre-Admission":
        "Module 2 Fa'alavelave & Ulufale i luma",
      "Module 1 Orthopaedics & Radiology": "Module 1 Fa'ailoga & X-ray",
      "Module 4 Pediatrics": "Module 4 Tamaiti",
      "Module 5 Plastic/ Hand Therapy":
        "Module 5 Togafitiga fa'ama'i lima/ Fa'ata'ita'i",
      "Module 6 Ophtamology": "Module 6 Mata",
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
      "Module 2a ": "Module 2a", //testing
      "Module 2a": "Module 2a (Tonga)", //testing
      "Module 2 Anaesthetic & Pre-Admission":
        "Module 2 Fakamālōlō & Fa'ahinga Paenga",
      "Module 1 Orthopaedics & Radiology": "Module 1 Fakamatala & X-ray",
      "Module 4 Pediatrics": "Module 4 Fānau'i",
      "Module 5 Plastic/ Hand Therapy":
        "Module 5 Fōsilaini/ Vaimai'ipulopula'i",
      "Module 6 Ophtamology": "Module 6 Mata",
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
      "Module 2a ": "ਮੋਡਿਊਲ 2a", //testing
      "Module 2 Anaesthetic & Pre-Admission":
        "ਮੋਡਿਊਲ 2 ਐਨੇਸਥੇਟਿਕ ਅਤੇ ਪੂਰਵ-ਭਰਤੀ",
      "Module 1 Orthopaedics & Radiology": "ਮੋਡਿਊਲ 1 ਆਰਥੋਪੀਡਿਕਸ ਅਤੇ ਰੇਡੀਓਲੋਜੀ",
      "Module 4 Pediatrics": "ਮੋਡਿਊਲ 4 ਪੀਡੀਐਟ੍ਰਿਕਸ",
      "Module 5 Plastic/ Hand Therapy": "ਮੋਡਿਊਲ 5 ਪਲਾਸਟਿਕ/ਹੱਥ ਥੈਰੇਪੀ",
      "Module 6 Ophtamology": "ਮੋਡਿਊਲ 6 ਓਫਥੈਮੋਲੋਜੀ",
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
