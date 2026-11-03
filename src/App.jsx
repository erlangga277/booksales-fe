import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/admin";
import Dashboard from "./pages/admin/index";
import AdminBooks from "./pages/admin/books/index";
import BookCreate from "./pages/admin/books/create";
import AdminGenres from "./pages/admin/genres/index";
import AdminAuthors from "./pages/admin/authors/index";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="books" element={<AdminBooks />} />
          <Route path="books/create" element={<BookCreate />} />
          <Route path="genres" element={<AdminGenres />} />
          <Route path="authors" element={<AdminAuthors />} />
        </Route>

        {/* Redirect default ke /admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}