export default function Testimonial() {
  return (
    <section className="bg-gray-50 dark:bg-gray-800/40 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-screen-xl px-4 py-12 mx-auto text-center lg:py-16 lg:px-6">
        <figure className="max-w-screen-md mx-auto">
          <svg
            className="h-10 mx-auto mb-4 text-indigo-400 dark:text-indigo-600"
            viewBox="0 0 24 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
              fill="currentColor"
            />
          </svg>
          <blockquote>
            <p className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white leading-relaxed">
              "Koleksi buku di BookSales sangat lengkap dan selalu original. Pengiriman super cepat dan packing sangat rapi dengan bubble wrap tebal. Tempat terbaik untuk belanja buku favorit."
            </p>
          </blockquote>
          <figcaption className="flex items-center justify-center mt-6 space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
              DA
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900 dark:text-white text-sm">
                Dian Anggraini
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Pencinta Buku & Anggota Komunitas Baca
              </div>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
