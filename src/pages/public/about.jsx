import { Link } from "react-router-dom";

export default function AboutUs() {
  const values = [
    {
      title: "Kurasi Buku Pilihan",
      desc: "Setiap judul dalam katalog kami dipilih berdasarkan nilai literatur, keaslian penerbitan, dan relevansi kebutuhan pembaca di Indonesia.",
    },
    {
      title: "Mendukung Penulis Lokal",
      desc: "Kami bermitra erat dengan para penulis mandiri dan penerbit independen untuk membuka panggung bagi karya-karya lokal terbaik.",
    },
    {
      title: "Aksesibilitas Bacaan",
      desc: "Menghubungkan pembaca di berbagai pelosok daerah dengan harga yang terjangkau, katalog terstruktur, dan pemesanan yang mudah.",
    },
  ];

  const milestones = [
    { num: "1.200+", label: "Judul Buku Terpilih" },
    { num: "85+", label: "Penulis & Kreator" },
    { num: "15.000+", label: "Pesanan Terkirim" },
    { num: "99.4%", label: "Kepuasan Pelanggan" },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen antialiased">
      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="py-12 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
          <span className="inline-block py-1 px-3 mb-4 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full dark:bg-indigo-900/40 dark:text-indigo-300">
            Tentang BookSales
          </span>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white max-w-4xl mx-auto">
            Menghubungkan pembaca dengan lembaran ilmu pengetahuan dan imajinasi.
          </h1>
          <p className="mb-8 text-base font-normal text-gray-500 lg:text-lg sm:px-16 xl:px-48 dark:text-gray-400 max-w-4xl mx-auto">
            BookSales didirikan dengan keyakinan bahwa membaca adalah cara tercepat
            menjelajah dunia. Kami membangun platform yang mempertemukan kurasi karya
            bermutu tinggi dari para penulis dengan pembaca yang haus wawasan.
          </p>
        </div>
      </section>

      {/* Nilai & Visi */}
      <section className="bg-gray-50 dark:bg-gray-800/40 py-12 lg:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Prinsip yang Kami Pegang
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Standar kami dalam mengelola katalog dan melayani komunitas literasi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  0{idx + 1}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-3 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrik */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 py-12 lg:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {milestones.map((m, idx) => (
              <div key={idx}>
                <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {m.num}
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-50 dark:bg-gray-800/40 py-16 px-4 text-center">
        <div className="max-w-screen-md mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Mulai Perjalanan Membacamu Hari Ini
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-3">
            Temukan buku favoritmu dari ratusan pilihan novel, ensiklopedia wawasan, dan karya terbaik dari penulis terkemuka.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/books"
              className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              Jelajahi Koleksi Buku
            </Link>
            <Link
              to="/"
              className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Beranda
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
