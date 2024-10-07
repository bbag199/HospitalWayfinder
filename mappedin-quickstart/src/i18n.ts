import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      Contact: "Contact",
      Home: "Home",
      Setting: "Setting",
      Mode: "Mode",
      FontSize: "Font Size",
      Language: "Language",
      Apply: "Apply",
      Light: "Light",
      Dark: "Dark",
      Default: "Default",
      Medium: "Medium",
      Large: "Large",
      SettingsTitle: "Settings",
      To: "To: Search destination...",
      From: "From: Search starting point...",
      GetDirections: "Get Directions",
      StopNavigation: "Stop Navigation",
      // EmergencyExit: "Emergency Exit",
      "Main Reception": "Main Reception",
      "Module 6 Reception": "Module 6 Reception",
      Reception: "Reception",
      "Corridor between Super Clinic and Surgical Centre":
        "Corridor between Super Clinic and Surgical Centre",
      EnableStackMap: "Enable Stack Map",
      DisableStackMap: "Disable Stack Map",
      "Entrance(surgical centre)": "Entrance(surgical centre)",
      Entrance: "Entrance",
      "Module 2a": "Module 2a",
      "Module 2": "Module 2",
      "Module 3": "Module 3",
      "Module 1": "Module 1",
      "Module 4": "Module 4",
      "Module 5": "Module 5",
      "Module 6": "Module 6",
      "Module 7a": "Module 7a",
      "Module 7": "Module 7",
      "Module 8": "Module 8",
      "Module 9": "Module 9",
      "Module 10": "Module 10",
      "Module 11": "Module 11",
      Lifts: "Lifts",
      Toilets: "Toilets",
      "Module 2b": "Module 2b",
      Staircase: "Stairs",
      "Breast Screening": "Breast Screening",
      Lightwell: "Lightwell",
      "Busy Pod": "Busy Pod",
      Plant: "Plant",
      "Ward (Level 1)": "Ward (Level 1)",
      "Ward (Level 2)": "Ward (Level 2)",
      "Ward - Level 1 Reception": "Ward - Level 1 Reception",
      "Ward - Level 2 Reception": "Ward - Level 2 Reception",
      "Inward Goods": "Inward Goods",
      "Manukau SuperClinic": "Manukau SuperClinic",
      "MSC Incentre (Dialysis Unit)": "MSC Incentre (Dialysis Unit)",
      "Corridor to Manukau SuperClinic": "Corridor to Manukau SuperClinic",
      "Clinical Photography": "Clinical Photography",
      Cafe: "Cafe",
      "Surgical Theatres & Recovery": "Surgical Theatres & Recovery",
      "Unisex Toilet (GF)": "Unisex Toilet (GF)",
      "Unisex Toilets (GF)": "Unisex Toilets (GF)",
      "SuperClinic Reception": "SuperClinic Reception",
      "Surgical Centre Reception": "Surgical Centre Reception",
      "Main Entrance": "Main Entrance",
      "Renal - Rito Dialysis Centre": "Renal - Rito Dialysis Centre",
      "Surgical Centre Toilets (GF)": "Surgical Centre Toilets (GF)",
      "Renal - MSC Incentre Dialysis Unit":
        "Renal - MSC Incentre Dialysis Unit",
      "Male Toilets (GF)": "Male Toilets (GF)",
      "Male Toilets (L1)": "Male Toilets (L1)",
      "Female Toilets (L1)": "Female Toilets (L1)",
      "Female Toilets (GF)": "Female Toilets (GF)",
      "Points of Interest": "Points of Interest",
    },
  },

  mi: {
    translation: {
      Contact: "Whakapā",
      Home: "Kāinga",
      Settings: "Tautuhinga",
      Mode: "Aratau",
      FontSize: "Rahi Momotuhi",
      Language: "Reo",
      Apply: "Whakamahia",
      Light: "Māama",
      Dark: "Pōuri",
      Default: "Taunoa",
      Medium: "Waenga",
      Large: "Rahi",
      SettingsTitle: "Tautuhinga",
      To: "Ki: Rapu waahi...",
      From: "Mai: Rapu waahi timatanga...",
      GetDirections: "Tikina nga Tohutohu",
      StopNavigation: "Whakamutu Whakaterenga",
      // EmergencyExit: "Putanga Whawhati Tata",
      "Main Reception": "Whakatau Matua",
      "Module 6 Reception": "Teihana Wāhanga 6",
      Reception: "Tari",
      "Corridor between Super Clinic and Surgical Centre":
        "Arawhata i waenganui i te Hōhipera Matua me te Whare Pokanga",
      EnableStackMap: "Whakahohe Mapi Papa",
      DisableStackMap: "Mono Mapi Papa",
      "Entrance(surgical centre)": "Tīmatanga (pōkairua)",
      Entrance: "Tīmatanga",
      "Module 2a": "Mōtū 2a",
      "Module 2": "Wāhanga 2",
      "Module 3": "Wāhanga 3",
      "Module 1": "Wāhanga 1",
      "Module 4": "Wāhanga 4",
      "Module 5": "Wāhanga 5",
      "Module 6": "Wāhanga 6",
      "Module 7a": "Wāhanga 7a",
      "Module 7": "Wāhanga 7",
      "Module 8": "Wāhanga 8",
      "Module 9": "Wāhanga 9",
      "Module 10": "Wāhanga 10",
      "Module 11": "Wāhanga 11",
      Lifts: "Hiko",
      Toilets: "Wharepaku",
      "Module 2b": "Wāhanga 2b",
      Staircase: "Arawhata",
      "Breast Screening": "Tātari Ū",
      Lightwell: "Puna Marama",
      "Busy Pod": "Kōpana Mahi",
      Plant: "Whakato",
      "Ward (Level 1)": "Wāhi Moe (Papa Tuatahi)",
      "Ward (Level 2)": "Wāhi Moe (Papa Tuarua)",
      "Ward - Level 1 Reception": "Teihana Wāhi Moe Papa Tuatahi",
      "Ward - Level 2 Reception": "Teihana Wāhi Moe Papa Tuarua",
      "Inward Goods": "Taonga Urunga",
      "Manukau SuperClinic": "Manukau Haumanu Nui",
      "MSC Incentre (Dialysis Unit)": "MSC Incentre (Wāhanga Whakarerekē Toto)",
      "Corridor to Manukau SuperClinic": "Arapiki ki Manukau Haumanu Nui",
      "Clinical Photography": "Whakaahua Haumanu",
      Cafe: "Kawhe",
      "Surgical Theatres & Recovery":
        "Ngā Whare Tapere Mahi Hāparapara me te Whakaoranga",
      "Unisex Toilet (GF)": "Whareiti Koreira (GF)",
      "Unisex Toilets (GF)": "Ngā Whareiti Koreira (GF)",
      "SuperClinic Reception": "Teihana SuperClinic",
      "Main Entrance": "Tomokanga Matua",
      "Surgical Centre Reception": "Teihana Pōwhiri Pokanga",
      "Renal - Rito Dialysis Centre": "Tākihi Rito o te Whatukuhu",
      "Renal - MSC Incentre Dialysis Unit": "Wāhanga Whakaora – MSC Incentre",
      "Male Toilets (GF)": "Whareiti Tāne (GF)",
      "Male Toilets (L1)": "Whareiti Tāne (L1)",
      "Female Toilets (L1)": "Whareiti Wāhine (L1)",
      "Female Toilets (GF)": "Whareiti Wāhine (GF)",
      "Surgical Centre Toilets (GF)": "Wharepaku Pokanga (Papa Tuatahi)",
      "Points of Interest": "Ngā Wāhi Rongonui",
    },
  },

  cn: {
    translation: {
      Contact: "联系方式",
      Home: "主页",
      Settings: "设置",
      Mode: "模式",
      FontSize: "字体大小",
      Language: "语言",
      Apply: "应用",
      Light: "浅色",
      Dark: "深色",
      Default: "默认",
      Medium: "中",
      Large: "大",
      SettingsTitle: "设置",
      To: "到: 搜索目的地...",
      From: "从: 搜索起点...",
      GetDirections: "获取方向",
      StopNavigation: "停止导航",
      // EmergencyExit: "紧急出口",
      "Main Reception": "主接待处",
      Reception: "接待处",
      "Corridor between Super Clinic and Surgical Centre":
        "超级诊所和外科中心之间的走廊",
      "Module 6 Reception": "模块 6 接待处",
      DisableStackMap: "禁用叠加地图",
      "Entrance(surgical centre)": "入口(外科中心)",
      Entrance: "入口",
      "Module 2a": "模块 2a",
      "Module 2": "模块 2",
      "Module 3": "模块 3",
      "Module 1": "模块 1",
      "Module 4": "模块 4",
      "Module 5": "模块 5",
      "Module 6": "模块 6",
      "Module 7a": "模块 7a",
      "Module 7": "模块 7",
      "Module 8": "模块 8",
      "Module 9": "模块 9",
      "Module 10": "模块 10",
      "Module 11": "模块 11",
      Staircase: "楼梯",
      Lifts: "电梯",
      Toilets: "厕所",
      "Male Toilets": "男厕",
      "Female Toilets": "女厕",
      "Module 2b": "模块 2b",
      Stairs: "楼梯",
      "Breast Screening": "乳房筛查",
      Lightwell: "天井",
      "Busy Pod": "忙碌舱",
      Plant: "植物",
      "Ward (Level 1)": "病房 (一楼)",
      "Ward (Level 2)": "病房 (二楼)",
      "Ward - Level 1 Reception": "病房一楼接待处",
      "Ward - Level 2 Reception": "病房二楼接待处",
      "Inward Goods": "入库货物",
      "Manukau SuperClinic": "Manukau超级诊所",
      "MSC Incentre (Dialysis Unit)": "MSC 中心（透析单元）",
      "Corridor to Manukau SuperClinic": "通往Manukau超级诊所的走廊",
      "Clinical Photography": "临床摄影",
      Cafe: "咖啡馆",
      "Surgical Theatres & Recovery": "手术室与康复",
      "Unisex Toilet (GF)": "厕所(一楼)",
      "Unisex Toilets (GF)": "厕所(一楼)",
      "SuperClinic Reception": "超级诊所接待处",
      "Surgical Centre Reception": "外科中心接待处",
      "Renal - Rito Dialysis Centre": "肾脏 - Rito 透析中心",
      "Surgical Centre Toilets (GF)": "外科中心厕所(一楼)",
      "Renal - MSC Incentre Dialysis Unit": "肾脏 – MSC 中心透析单元",
      "Male Toilets (GF)": "男厕所(一楼)",
      "Male Toilets (L1)": "男厕所(二楼)",
      "Female Toilets (L1)": "女厕所 (L1)",
      "Female Toilets (GF)": "女厕所 (GF)",
      "Main Entrance": "主入口",
      "Points of Interest": "热门地点",
    },
  },

  tw: {
    translation: {
      Contact: "聯絡方式",
      Home: "主頁",
      Settings: "設置",
      Mode: "模式",
      FontSize: "字型大小",
      Language: "語言",
      Apply: "應用",
      Light: "淺色",
      Dark: "深色",
      Default: "預設",
      Medium: "中",
      Large: "大",
      SettingsTitle: "設置",
      To: "到: 搜索目的地...",
      From: "從: 搜索起點...",
      GetDirections: "獲取方向",
      StopNavigation: "停止導航",
      // EmergencyExit: "緊急出口",
      "Main Reception": "主接待處",
      "Module 6 Reception": "模組 6 接待處",
      "Corridor between Super Clinic and Surgical Centre":
        "超級診所和外科中心之間的走廊",
      EnableStackMap: "啟用疊加地圖",
      DisableStackMap: "禁用疊加地圖",
      "Entrance(surgical centre)": "入口（手术中心）",
      Entrance: "入口",
      "Module 2a": "模組 2a",
      "Module 2": "模組 2",
      "Module 3": "模組 3",
      "Module 1": "模組 1",
      "Module 4": "模組 4",
      "Module 5": "模組 5",
      "Module 6": "模組 6",
      "Module 7a": "模組 7a",
      "Module 8": "模組 8",
      "Module 7": "模組 7",
      "Module 9": "模組 9",
      "Module 10": "模組 10",
      "Module 11": "模組 11",
      Staircase: "樓梯",
      Lifts: "電梯",
      Toilets: "廁所",
      "Module 2b": "模組 2b",
      "Breast Screening": "乳房篩檢",
      Lightwell: "天井",
      "Busy Pod": "忙碌艙",
      Plant: "植物",
      "Ward (Level 1)": "病房 (一樓)",
      "Ward (Level 2)": "病房 (二樓)",
      "Ward - Level 1 Reception": "病房一樓接待處",
      "Ward - Level 2 Reception": "病房二樓接待處",
      "Inward Goods": "入庫貨物",
      "Manukau SuperClinic": "Manukau超級診所",
      "MSC Incentre (Dialysis Unit)": "MSC 中心（透析單位）",
      "Corridor to Manukau SuperClinic": "通往Manukau超級診所的走廊",
      "Clinical Photography": "臨床攝影",
      Cafe: "咖啡館",
      "Surgical Theatres & Recovery": "手術室與康復",
      "Unisex Toilet (GF)": "廁所(一樓)",
      "Unisex Toilets (GF)": "廁所(一樓)",
      "SuperClinic Reception": "超級診所接待處",
      "Main Entrance": "主入口",
      "Surgical Centre Reception": "外科中心接待處",
      "Renal - Rito Dialysis Centre": "腎臟 - Rito 透析中心",
      "Renal - MSC Incentre Dialysis Unit": "腎臟 – MSC 中心透析單元",
      "Male Toilets (GF)": "男廁所(一樓)",
      "Male Toilets (L1)": "男廁所(二樓)",
      "Female Toilets (L1)": "女廁所 (L1)",
      "Female Toilets (GF)": "女廁所 (GF)",
      "Surgical Centre Toilets (GF)": "外科中心洗手間 (一樓)",
      "Points of Interest": "熱門地點",
    },
  },

  vi: {
    translation: {
      Contact: "Liên hệ",
      Home: "Trang chủ",
      Settings: "Cài đặt",
      Mode: "Chế độ",
      FontSize: "Kích thước phông chữ",
      Language: "Ngôn ngữ",
      Apply: "Áp dụng",
      Light: "Sáng",
      Dark: "Tối",
      Default: "Mặc định",
      Medium: "Trung bình",
      Large: "Lớn",
      SettingsTitle: "Cài đặt",
      To: "Đến: Tìm điểm đến...",
      From: "Từ: Tìm điểm xuất phát...",
      GetDirections: "Nhận chỉ đường",
      StopNavigation: "Dừng điều hướng",
      // EmergencyExit: "Lối Thoát Hiểm",
      "Main Reception": "Lễ tân chính",
      "Module 6 Reception": "Quầy tiếp tân của Mô-đun 6",
      Reception: "Tiếp Tân",
      "Corridor between Super Clinic and Surgical Centre":
        "Hành lang giữa Phòng khám siêu và Trung tâm phẫu thuật",
      EnableStackMap: "Bật Bản Đồ Xếp Chồng",
      DisableStackMap: "Tắt Bản Đồ Xếp Chồng",
      "Entrance(surgical centre)": "Lối vào (trung tâm phẫu thuật)",
      Entrance: "Lối vào",
      "Module 2a": "Mô-đun 2a",
      "Module 2": "Mô-đun 2",
      "Module 3": "Mô-đun 3",
      "Module 1": "Mô-đun 1",
      "Module 4": "Mô-đun 4",
      "Module 5": "Mô-đun 5",
      "Module 6": "Mô-đun 6",
      "Module 7a": "Mô-đun 7a",
      "Module 7": "Mô-đun 7",
      "Module 8": "Mô-đun 8",
      "Module 9": "Mô-đun 9",
      "Module 10": "Mô-đun 10",
      "Module 11": "Mô-đun 11",
      Staircase: "Cầu thang",
      Lifts: "Thang máy",
      Toilets: "Nhà vệ sinh",
      "Module 2b": "Mô-đun 2b",
      "Breast Screening": "Khám vú",
      Lightwell: "Giếng trời",
      "Busy Pod": "Pod bận rộn",
      Plant: "Cây trồng",
      "Ward (Level 1)": "Khu Phòng Bệnh (Tầng 1)",
      "Ward (Level 2)": "Khu Phòng Bệnh (Tầng 2)",
      "Ward - Level 1 Reception": "Quầy tiếp tân Khu Phòng Bệnh Tầng 1",
      "Ward - Level 2 Reception": "Quầy tiếp tân Khu Phòng Bệnh Tầng 2",
      "Inward Goods": "Hàng hóa nhập khẩu",
      "Manukau SuperClinic": "Phòng khám Manukau",
      "MSC Incentre (Dialysis Unit)": "MSC Trung tâm (Đơn vị lọc máu)",
      "Corridor to Manukau SuperClinic": "Hành lang đến Phòng khám Manukau",
      "Clinical Photography": "Nhiếp ảnh lâm sàng",
      Cafe: "Quán cà phê",
      "Surgical Theatres & Recovery": "Phòng mổ và phục hồi",
      "Unisex Toilet (GF)": "Nhà vệ sinh chung (GF)",
      "Unisex Toilets (GF)": "Nhà vệ sinh chung (GF)",
      "SuperClinic Reception": "Quầy tiếp tân của SuperClinic",
      "Main Entrance": "Lối vào chính",
      "Surgical Centre Reception": "Quầy tiếp tân Trung tâm Phẫu thuật",
      "Renal - Rito Dialysis Centre": "Thận - Trung tâm Lọc máu Rito",
      "Renal - MSC Incentre Dialysis Unit":
        "Thận – Đơn vị lọc máu MSC Incentre",
      "Male Toilets (GF)": "Nhà vệ sinh nam (GF)",
      "Male Toilets (L1)": "Nhà vệ sinh nam (L1)",
      "Female Toilets (L1)": "Nhà vệ sinh nữ (L1)",
      "Female Toilets (GF)": "Nhà vệ sinh nữ (GF)",
      "Surgical Centre Toilets (GF)":
        "Nhà vệ sinh Trung tâm Phẫu thuật (Tầng Trệt)",
      "Points of Interest": "Địa Điểm Nổi Bật",
    },
  },

  sm: {
    translation: {
      Contact: "Fa'afeso'ota'i",
      Home: "Aiga",
      Settings: "Seti",
      Mode: "Faiga",
      FontSize: "Tele o le mataitusi",
      Language: "Gagana",
      Apply: "Fa'atino",
      Light: "Malamalama",
      Dark: "Pogisa",
      Default: "Fa'aletonu",
      Medium: "Feololo",
      Large: "Tele",
      SettingsTitle: "Seti",
      To: "I: Saili nofoaga...",
      From: "Mai: Saili nofoaga amata...",
      GetDirections: "Maua Faatonuga",
      StopNavigation: "Taofi Faʻatautaiga",
      // EmergencyExit: "Ala Faafuasei",
      "Module 6 Reception": "Tali le Module 6",

      Reception: "Talia'iga",
      "Corridor between Super Clinic and Surgical Centre":
        "Fala o lo'o i le va o le Super Clinic ma le Nofoaga Tipitipi",
      EnableStackMap: "Faʻaola Mapi Faʻaopoopo",
      DisableStackMap: "Faʻamuta Mapi Faʻaopoopo",
      "Entrance(surgical centre)": "Ulufale (nofoaga taotoga)",
      Entrance: "Ulufale",
      "Module 2a": "Module 2a",
      "Module 2": "Module 2",
      "Module 3": "Module 3",
      "Module 1": "Module 1",
      "Module 4": "Module 4",
      "Module 5": "Module 5",
      "Module 6": "Module 6",
      "Module 7a": "Module 7a",
      "Module 7": "Module 7",
      "Module 8": "Module 8",
      "Module 9": "Module 9",
      "Module 10": "Module 10",
      "Module 11": "Module 11",
      Staircase: "Ala Savali",
      Lifts: "Si'isi'i",
      Toilets: "Faleta'ele",
      "Breast Screening": "Su'esu'ega Ova",
      Lightwell: "Puna Malamalama",
      "Busy Pod": "Pod Galue",
      Plant: "La'au",
      "Ward (Level 1)": "Potu Ma'i (Fogā Muamua)",
      "Ward (Level 2)": "Potu Ma'i (Fogā Lua)",
      "Ward - Level 1 Reception": "Ofisa Tali Potu Ma'i Fogā Muamua",
      "Ward - Level 2 Reception": "Ofisa Tali Potu Ma'i Fogā Lua",
      "Inward Goods": "Oloa Ulufale",
      "Manukau SuperClinic": "Manukau Falema'i Tele",
      "MSC Incentre (Dialysis Unit)": "MSC Incentre (Vaega Ta'amilo)",
      "Corridor to Manukau SuperClinic": "Ala i Manukau Falema'i Tele",
      "Clinical Photography": "Pueata Foma'i",
      Cafe: "Fale Kofe",
      "Surgical Theatres & Recovery": "Falema'i Tipitipi ma Toe Fa'aleleia",
      "Unisex Toilet (GF)": "Faleta'ele Lē Fa'apitoa (GF)",
      "Unisex Toilets (GF)": "Faleta'ele Lē Fa'apitoa (GF)",
      "SuperClinic Reception": "Tali o le SuperClinic",
      "Main Entrance": "Ulufale Autu",
      "Surgical Centre Reception": "Tali le Ofisa Tipitipi",
      "Renal - Rito Dialysis Centre": "Tama'ita'i - Nofoaga Fa'amama Toto Rito",
      "Male Toilets (GF)": "Faleta'ele a Ali'i (GF)",
      "Male Toilets (L1)": "Faleta'ele a Ali'i (L1)",
      "Female Toilets (L1)": "Faleta'ele o Tama'ita'i (L1)",
      "Female Toilets (GF)": "Faleta'ele o Tama'ita'i (GF)",
      "Surgical Centre Toilets (GF)": "Faleta'ele Ofisa Tipitipi (Fogāloa)",
      "Points of Interest": "Nofoaga Lauiloa",
    },
  },

  to: {
    translation: {
      Contact: "Fetu'utaki",
      Home: "ʻApi",
      Settings: "Ngaahi Seti",
      Mode: "Taimi",
      FontSize: "Lahi ʻo e ngaahi tohi fakamatala",
      Language: "Lea",
      Apply: "Fakalele",
      Light: "Maama",
      Dark: "Pōuli",
      Default: "Angamaheni",
      Medium: "Falahi",
      Large: "Lahi",
      SettingsTitle: "Ngaahi Seti",
      To: "Ki he: Fekumi ki he feitu'u...",
      From: "Mei he: Fekumi ki he feitu'u kamata...",
      GetDirections: "Ma'u e ngaahi Fokotu'utu'u",
      StopNavigation: "Taofi ngāue fakalotofonua",
      // EmergencyExit: "Hala Fa'atu'utu'unga",
      "Module 6 Reception": "Fakatokanga 'a e Module 6",
      Reception: "Talitali",
      "Corridor between Super Clinic and Surgical Centre":
        "Hala ‘i he va ‘a e Super Clinic mo e Centre Tipitipi",
      EnableStackMap: "Fakamamā Mapu fakaʻaonga",
      DisableStackMap: "Taʻeʻasi Mapu fakaʻaonga",
      "Entrance(surgical centre)": "Huʻu (ngaahi taokete)",
      Entrance: "Huʻu",
      "Module 2a": "Module 2a",
      "Module 2": "Module 2",
      "Module 3": "Module 3",
      "Module 1": "Module 1",
      "Module 4": "Module 4",
      "Module 5": "Module 5",
      "Module 6": "Module 6",
      "Module 7a ": "Module 7a",
      "Module 7": "Module 7",
      "Module 8": "Module 8",
      "Module 9": "Module 9",
      "Module 10": "Module 10",
      "Module 11": "Module 11",
      Staircase: "Fakaikiiki Hala",
      Lifts: "Ngaahi Si'i",
      Toilets: "Ngaahi Faleta'ele",
      "Module 2b": "Module 2b",
      "Breast Screening": "Ngaahi Sivi Tītaha",
      Lightwell: "Tā Puha",
      "Busy Pod": "Ngaahi Potoa Toho",
      Plant: "Akau",
      "Ward (Level 1)": "Potu Moʻui (ʻĀpa ki lalo)",
      "Ward (Level 2)": "Potu Moʻui (ʻĀpa ke ʻuluaki)",
      "Ward - Level 1 Reception": "ʻOfisi Tali Potu Moʻui ʻĀpa ki lalo",
      "Ward - Level 2 Reception": "ʻOfisi Tali Potu Moʻui ʻĀpa ke ʻuluaki",
      "Inward Goods": "Ngaahi Koloa Hū",
      "Manukau SuperClinic": "Manukau Falema'i Lalahi",
      "MSC Incentre (Dialysis Unit)": "MSC Incentre (Vaega Loto'a)",
      "Corridor to Manukau SuperClinic": "Hala ki he Manukau Falema'i Lalahi",
      "Clinical Photography": "Tohitohi Fakafaito'o",
      Cafe: "Falekai Kofe",
      "Surgical Theatres & Recovery": "Ngaahi Lokesi Tipitipi & Fakafoki",
      "Unisex Toilet (GF)": "Faleta'ele Ta'efanau (GF)",
      "Unisex Toilets (GF)": "Faleta'ele Ta'efanau (GF)",
      "SuperClinic Reception": "Tali e SuperClinic",
      "Main Entrance": "Loloa Mu'a",
      "Surgical Centre Reception": "Fakatokanga 'a e Potungaue Tipitipi",
      "Renal - Rito Dialysis Centre": "Totonu 'o e 'Aisa Ki'i Totonu Rito",
      "Renal - MSC Incentre Dialysis Unit": "Nei – Potu Tuitui MSC Incentre",
      "Male Toilets (GF)": "Faleta'ele Tangata (GF)",
      "Male Toilets (L1)": "Faleta'ele Tangata (L1)",
      "Female Toilets (L1)": "Faleta'ele Fefine (L1)",
      "Female Toilets (GF)": "Faleta'ele Fefine (GF)",
      "Surgical Centre Toilets (GF)":
        "Falemālōlō 'a e Potungaue Tipitipi (ʻĀpa ki lalo)",
      "Points of Interest": "Ngaahi Feituʻu Lauiloa",
    },
  },

  pa: {
    translation: {
      Contact: "ਸੰਪਰਕ ਕਰੋ",
      Home: "ਘਰ",
      Settings: "ਸੈਟਿੰਗਜ਼",
      Mode: "ਮੋਡ",
      FontSize: "ਫੋਂਟ ਸਾਈਜ਼",
      Language: "ਭਾਸ਼ਾ",
      Apply: "ਲਾਗੂ ਕਰੋ",
      Light: "ਹਲਕਾ",
      Dark: "ਗੂੜਾ",
      Default: "ਡਿਫ਼ਾਲਟ",
      Medium: "ਦਰਮਿਆਨਾ",
      Large: "ਵੱਡਾ",
      SettingsTitle: "ਸੈਟਿੰਗਜ਼",
      To: "ਨੂੰ: ਗੰਟਵਿਓ ਖੋਜੋ...",
      From: "ਤੋਂ: ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਖੋਜੋ...",
      GetDirections: "ਦਿਸ਼ਾਵਾਂ ਪ੍ਰਾਪਤ ਕਰੋ",
      StopNavigation: "ਨੈਵੀਗੇਸ਼ਨ ਰੋਕੋ",
      // EmergencyExit: "ਐਮਰਜੈਂਸੀ ਐਗਜ਼ਿਟ",
      Reception: "ਰਿਸੈਪਸ਼ਨ",
      "Module 6 Reception": "ਮੋਡਿਊਲ 6 ਸਵਾਗਤ",
      EnableStackMap: "ਸਟੈਕ ਮੈਪ ਨੂੰ ਐਨਬਲ ਕਰੋ",
      DisableStackMap: "ਸਟੈਕ ਮੈਪ ਨੂੰ ਅਯੋਗ ਕਰੋ",
      "Entrance(surgical centre)": "ਦਾਖਲਾ (ਸਰਜਰੀ ਸੈਂਟਰ)",
      Entrance: "ਦਾਖਲਾ",
      "Corridor between Super Clinic and Surgical Centre":
        "ਸੁਪਰ ਕਲੀਨਿਕ ਅਤੇ ਸਰਜਰੀ ਸੈਂਟਰ ਦੇ ਵਿਚਕਾਰ ਦਾ ਕਾਰਿਡੋਰ",
      "Module 2a": "ਮੋਡਿਊਲ 2a",
      "Module 2": "ਮੋਡਿਊਲ 2",
      "Module 3": "ਮੋਡਿਊਲ 3",
      "Module 1": "ਮੋਡਿਊਲ 1",
      "Module 4": "ਮੋਡਿਊਲ 4",
      "Module 5": "ਮੋਡਿਊਲ 5",
      "Module 6": "ਮੋਡਿਊਲ 6",
      "Module 7a": "ਮੋਡੀਊਲ 7a",
      "Module 7": "ਮੋਡੀਊਲ 7",
      "Module 8": "ਮੋਡੀਊਲ 8",
      "Module 9": "ਮੋਡੀਊਲ 9",
      "Module 10": "ਮੋਡੀਊਲ 10",
      "Module 11": "ਮੋਡੀਊਲ 11",
      Staircase: "ਸੀੜ੍ਹੀਆਂ",
      Lifts: "ਲਿਫਟਾਂ",
      Toilets: "ਟੌਇਲਟ",
      "Module 2b": "ਮੋਡੀਊਲ 2b",
      "Breast Screening": "ਛਾਤੀ ਦੀ ਸਕ੍ਰੀਨਿੰਗ",
      Lightwell: "ਲਾਈਟਵੈਲ",
      "Busy Pod": "ਬਿਜ਼ੀ ਪੋਡ",
      Plant: "ਪੌਦਾ",
      "Ward (Level 1)": "ਵਾਰਡ (ਪਹਿਲੀ ਮੰਜ਼ਿਲ)",
      "Ward (Level 2)": "ਵਾਰਡ (ਦੂਜੀ ਮੰਜ਼ਿਲ)",
      "Ward - Level 1 Reception": "ਵਾਰਡ ਪਹਿਲੀ ਮੰਜ਼ਿਲ ਰਿਸੈਪਸ਼ਨ",
      "Ward - Level 2 Reception": "ਵਾਰਡ ਦੂਜੀ ਮੰਜ਼ਿਲ ਰਿਸੈਪਸ਼ਨ",
      "Inward Goods": "ਅੰਦਰਲੇ ਸਮਾਨ",
      "Manukau SuperClinic": "ਮਨੂਕੌ ਸੂਪਰਕਲਿਨਿਕ",
      "MSC Incentre (Dialysis Unit)": "ਐਮਐਸਸੀ ਇੰਸੈਂਟਰ (ਡਾਇਲਿਸਿਸ ਯੂਨਿਟ)",
      "Corridor to Manukau SuperClinic": "ਮਨੂਕੌ ਸੂਪਰਕਲਿਨਿਕ ਲਈ ਕਰੀਡੋਰ",
      "Clinical Photography": "ਕਲੀਨੀਕਲ ਫੋਟੋਗ੍ਰਾਫੀ",
      Cafe: "ਕੈਫੇ",
      "Surgical Theatres & Recovery": "ਸਰਜਿਕਲ ਥੀਏਟਰ ਅਤੇ ਰਿਕਵਰੀ",
      "Unisex Toilet (GF)": "ਯੂਨੀਸੈਕਸ ਸ਼ੌਚਾਲਾ (GF)",
      "Unisex Toilets (GF)": "ਯੂਨੀਸੈਕਸ ਸ਼ੌਚਾਲਾ (GF)",
      "SuperClinic Reception": "ਸੁਪਰਕਲਿਨਿਕ ਰਿਸੈਪਸ਼ਨ",
      "Main Entrance": "ਮੁੱਖ ਦਰਵਾਜ਼ਾ",
      "Surgical Centre Reception": "ਸਰਜਿਕਲ ਸੈਂਟਰ ਰਿਸੈਪਸ਼ਨ",
      "Renal - Rito Dialysis Centre": "ਗੁਰਦਾ - ਰਿਤੋ ਡਾਇਲਸਿਸ ਸੈਂਟਰ",
      "Male Toilets (GF)": "ਮਰਦਾਨਾ ਸ਼ੌਚਾਲਾ (GF)",
      "Male Toilets (L1)": "ਮਰਦਾਨਾ ਸ਼ੌਚਾਲਾ (L1)",
      "Female Toilets (L1)": "ਮਹਿਲਾ ਸ਼ੌਚਾਲਾ (L1)",
      "Female Toilets (GF)": "ਮਹਿਲਾ ਸ਼ੌਚਾਲਾ (GF)",
      "Surgical Centre Toilets (GF)": "ਸਰਜਿਕਲ ਸੈਂਟਰ ਟਾਇਲਟ (ਜਮੀਨ ਦਾ ਮੰਜ਼ਿਲ)",
      "Points of Interest": "ਪ੍ਰਸਿੱਧ ਸਥਾਨ",
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
