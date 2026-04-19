export type FeatureCardItem = {
  title: string;
  description: string;
  image: string;
  alt: string;
};

export type CapabilityItem = {
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const introWords = ["Notes", "App", "Ready."];

export const quickPoints = [
  {
    title: "Login dan Register",
    description:
      "Pengguna dapat membuat akun dan masuk menggunakan email dan password.",
  },
  {
    title: "CRUD Catatan",
    description:
      "Tambah, lihat, edit, dan hapus catatan dalam satu alur yang ringkas.",
  },
  {
    title: "Catatan Berbasis Kalender",
    description:
      "Setiap catatan dapat dikaitkan ke tanggal tertentu untuk perencanaan harian.",
  },
  {
    title: "Dashboard Profile",
    description:
      "Pengguna melihat ringkasan profil dan aktivitas catatan miliknya.",
  },
];

export const featureCards: FeatureCardItem[] = [
  {
    title: "Autentikasi Email",
    description:
      "Halaman login dan register untuk akses aman ke data catatan pribadi.",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    alt: "Person using phone authentication app",
  },
  {
    title: "Create dan Edit Catatan",
    description:
      "Buat ide baru lalu perbarui isi catatan kapan saja saat dibutuhkan.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    alt: "Writing notes on paper",
  },
  {
    title: "Planning Berdasarkan Tanggal",
    description:
      "Atur catatan pada tanggal tertentu agar agenda harian lebih terstruktur.",
    image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80",
    alt: "Notebook and calendar planning",
  },
  {
    title: "Ringkasan Dashboard",
    description:
      "Lihat total catatan dan statistik bulanan pada dashboard profile.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    alt: "Dashboard analytics on screen",
  },
];

export const capabilityPanels: CapabilityItem[] = [
  {
    title: "Auth API",
    description:
      "Endpoint register dan login untuk autentikasi berbasis email-password.",
  },
  {
    title: "Notes API",
    description:
      "Endpoint REST untuk create, read, update, dan delete catatan pengguna.",
  },
  {
    title: "Calendar Notes",
    description:
      "Filter catatan per tanggal untuk kebutuhan planning harian.",
  },
  {
    title: "Profile Dashboard",
    description:
      "Ringkasan profil, total catatan, dan catatan upcoming pada dashboard.",
  },
];

export const faqItems: FaqItem[] = [
  {
    question: "Apa saja fitur utama Notes App?",
    answer:
      "Fitur utama adalah register/login, CRUD catatan, catatan berbasis tanggal kalender, dan dashboard profile.",
  },
  {
    question: "Apakah login hanya dengan email dan password?",
    answer:
      "Ya. Login menggunakan email dan password sesuai skema autentikasi backend.",
  },
  {
    question: "Apakah catatan bisa dijadwalkan per tanggal?",
    answer:
      "Ya. Setiap catatan memiliki tanggal sehingga bisa dipetakan ke kebutuhan kalender.",
  },
  {
    question: "Apa yang ditampilkan dashboard profile?",
    answer:
      "Dashboard profile menampilkan data profil pengguna dan statistik catatan.",
  },
];
