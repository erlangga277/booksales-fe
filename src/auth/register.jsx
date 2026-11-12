import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../_service/authService";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage("");
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  // Validasi form sisi frontend
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Nama lengkap wajib diisi.";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Nama lengkap minimal 3 karakter.";
    }

    if (!formData.username.trim()) {
      errors.username = "Username wajib diisi.";
    } else if (formData.username.length < 3) {
      errors.username = "Username minimal 3 karakter.";
    } else if (/\s/.test(formData.username)) {
      errors.username = "Username tidak boleh mengandung spasi.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email wajib diisi.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Format email tidak valid.";
    }

    if (!formData.password) {
      errors.password = "Password wajib diisi.";
    } else if (formData.password.length < 6) {
      errors.password = "Password minimal harus 6 karakter.";
    }

    if (!termsAccepted) {
      errors.terms = "Silakan setujui syarat dan ketentuan.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      if (validationErrors.terms) {
        setErrorMessage(validationErrors.terms);
      }
      return;
    }

    setLoading(true);

    try {
      const res = await authService.register(formData);

      // Simpan session token & role jika backend mengembalikan token
      if (res.token) {
        localStorage.setItem("token", res.token);
      }
      if (res.data?.role) {
        localStorage.setItem("role", res.data.role);
      }

      // Karena role publik/customer, langsung arahkan ke beranda (/)
      navigate("/");
    } catch (err) {
      console.error("Register error:", err);
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      }
      const msg =
        err.response?.data?.message ||
        err.customMessage ||
        "Gagal mendaftar. Silakan periksa kembali formulir Anda.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-8">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto w-full max-w-md">
        <Link
          to="/"
          className="flex items-center gap-2.5 mb-6 text-2xl font-bold text-indigo-600 dark:text-white"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          BookSales
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Create an account
            </h1>

            {errorMessage && (
              <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
                {errorMessage}
              </div>
            )}

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit} noValidate>
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`bg-gray-50 border ${
                    fieldErrors.name ? "border-red-500" : "border-gray-300"
                  } text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  placeholder="John Doe"
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {Array.isArray(fieldErrors.name) ? fieldErrors.name[0] : fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`bg-gray-50 border ${
                    fieldErrors.username ? "border-red-500" : "border-gray-300"
                  } text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  placeholder="johndoe"
                />
                {fieldErrors.username && (
                  <p className="mt-1 text-xs text-red-500">
                    {Array.isArray(fieldErrors.username) ? fieldErrors.username[0] : fieldErrors.username}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`bg-gray-50 border ${
                    fieldErrors.email ? "border-red-500" : "border-gray-300"
                  } text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  placeholder="name@company.com"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {Array.isArray(fieldErrors.email) ? fieldErrors.email[0] : fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password (min. 6 karakter)
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`bg-gray-50 border ${
                    fieldErrors.password ? "border-red-500" : "border-gray-300"
                  } text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {Array.isArray(fieldErrors.password) ? fieldErrors.password[0] : fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-indigo-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <a
                      className="font-medium text-indigo-600 hover:underline dark:text-indigo-500"
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create an account"}
              </button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:underline dark:text-indigo-500"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}