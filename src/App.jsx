import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/admin";
import Dashboard from "./pages/admin/index";
import AdminBooks from "./pages/admin/books/index";
import BookCreate from "./pages/admin/books/create";
import BookEdit from "./pages/admin/books/edit";
import AdminGenres from "./pages/admin/genres/index";
import AdminAuthors from "./pages/admin/authors/index";
import PublicLayout from "./layouts/public";
import Home from "./pages/public/index";
import Books from "./pages/public/books/index";
import BookShow from "./pages/public/books/show";
import Login from "./auth/login";
import Register from "./auth/register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="books" element={<Books />} />
          <Route path="books/:id" element={<BookShow />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Rute Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="books" element={<AdminBooks />} />
          <Route path="books/create" element={<BookCreate />} />
          <Route path="books/:id/edit" element={<BookEdit />} />
          <Route path="genres" element={<AdminGenres />} />
          <Route path="authors" element={<AdminAuthors />} />
        </Route>

        {/* Redirect fallback ke / */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}