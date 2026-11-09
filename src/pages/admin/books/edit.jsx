import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookService } from "../../../_service/bookService";
import { genreService } from "../../../_service/genreService";
import { authorService } from "../../../_service/authorService";

export default function BookEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    genre_id: "",
    author_id: "",
    cover_photo: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookData, genreData, authorData] = await Promise.all([
          bookService.getById(id),
          genreService.getAll(),
          authorService.getAll(),
        ]);

        const book = bookData.data || bookData;
        setForm({
          title: book.title || "",
          description: book.description || "",
          price: book.price || "",
          stock: book.stock || "",
          genre_id: book.genre_id || "",
          author_id: book.author_id || "",
          cover_photo: book.cover_photo || "",
        });
        setGenres(genreData.data || genreData);
        setAuthors(authorData.data || authorData);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await bookService.update(id, form);
      navigate("/admin/books");
    } catch (err) {
      console.error("Gagal mengupdate buku:", err);
      alert(err.customMessage || "Gagal mengupdate buku.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        Memuat data...
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Edit Buku
          </h2>
          <button
            onClick={() => navigate("/admin/books")}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Kembali
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
            {/* Judul */}
            <div className="sm:col-span-2">
              <label
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Judul Buku <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={form.title}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Contoh: Harry Potter"
                required
              />
            </div>

            {/* Genre */}
            <div>
              <label
                htmlFor="genre_id"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Genre <span className="text-red-500">*</span>
              </label>
              <select
                name="genre_id"
                id="genre_id"
                value={form.genre_id}
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">-- Pilih Genre --</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div>
              <label
                htmlFor="author_id"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Author <span className="text-red-500">*</span>
              </label>
              <select
                name="author_id"
                id="author_id"
                value={form.author_id}
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">-- Pilih Author --</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Harga */}
            <div>
              <label
                htmlFor="price"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Harga <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={form.price}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Contoh: 50000"
                required
              />
            </div>

            {/* Stok */}
            <div>
              <label
                htmlFor="stock"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Stok <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                id="stock"
                value={form.stock}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Contoh: 100"
                required
              />
            </div>

            {/* Cover Photo */}
            <div className="sm:col-span-2">
              <label
                htmlFor="cover_photo"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Cover Photo (nama file)
              </label>
              <input
                type="text"
                name="cover_photo"
                id="cover_photo"
                value={form.cover_photo}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Contoh: harry_potter.jpg"
              />
            </div>

            {/* Deskripsi */}
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Deskripsi
              </label>
              <textarea
                name="description"
                id="description"
                rows="5"
                value={form.description}
                onChange={handleChange}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Tulis deskripsi buku..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-60"
            >
              {loading ? "Menyimpan..." : "Update Buku"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/books")}
              className="text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
