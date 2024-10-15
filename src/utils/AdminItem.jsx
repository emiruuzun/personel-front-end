import {
  FaUserCircle,
  FaUserPlus,
  FaBuilding,
  FaClipboardList,
  FaUserCog,
  FaCalendarCheck,
  FaBullhorn,
  FaChartBar,
  FaChartLine,
} from "react-icons/fa";

export const adminItem = [
  {
    name: "Profil",
    items: [
      {
        name: "Profil",
        slug: "admin/profile",
        description: "Bilgi Profili",
        icon: FaUserCircle,
      },
    ],
  },
  {
    name: "Personel Yönetimi",
    items: [
      {
        name: "Kullanıcı Kaydı",
        slug: "admin/personel-register",
        description: "Kullanıcı Kaydı",
        icon: FaUserPlus,
      },
      {
        name: "Kullanıcı Ayarları",
        slug: "admin/getallusers",
        description: "Kullanıcı Analizi",
        icon: FaUserCog,
      },
      {
        name: "Kullanıcı İzin Listesi",
        slug: "admin/allLeave",
        description: "Kullanıcı İzin",
        icon: FaCalendarCheck,
      },
    ],
  },
  {
    name: "İş Yönetimi",
    items: [
      {
        name: "Personel İş Takibi",
        slug: "admin/personel-job",
        description: "Personel İş Takibi",
        icon: FaClipboardList,
      },
      {
        name: "İş Atama Listesi",
        slug: "admin/personnel-assignments",
        description: "İş Atama Listesi",
        icon: FaClipboardList,
      },
    ],
  },
  {
    name: "Firma Yönetimi",
    items: [
      {
        name: "Firma Kaydı",
        slug: "admin/company-register",
        description: "Firma Kaydı",
        icon: FaBuilding,
      },
    ],
  },
  {
    name: "Raporlama",
    items: [
      {
        name: "Rapor Oluştur",
        slug: "admin/job-reports",
        description: "Aylık raporlama verilerini görüntüle",
        icon: FaChartLine,
      },
    ],
  },
  {
    name: "Analizler",
    items: [
      {
        name: "İzin Kullanım Grafiği",
        slug: "admin/usage-chart",
        description: "Kullanım Grafiği",
        icon: FaChartBar,
      },
      {
        name: "İş Atama Grafiği",
        slug: "admin/work-chart",
        description: "İş Atama Grafiği",
        icon: FaChartBar,
      },
    ],
  },
  {
    name: "İletişim",
    items: [
      {
        name: "Duyuru",
        slug: "admin/Announcement",
        description: "Duyuru",
        icon: FaBullhorn,
      },
    ],
  },
];
