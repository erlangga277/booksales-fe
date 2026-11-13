import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import AdminLayout from "./layouts/admin";
import Dashboard from "./pages/admin/index";
import AdminBooks from "./pages/admin/books/index";
import BookCreate from "./pages/admin/books/create";
import BookEdit from "./pages/admin/books/edit";
import AdminGenres from "./pages/admin/genres/index";
import AdminAuthors from "./pages/admin/authors/index";
import AdminUsers from "./pages/admin/users/index";
import AdminTransactions from "./pages/admin/transactions/index";
import AdminMessages from "./pages/admin/messages/index";

import PublicLayout from "./layouts/public";
import Home from "./pages/public/index";
import Books from "./pages/public/books/index";
import BookShow from "./pages/public/books/show";
import Cart from "./pages/public/cart";
import AboutUs from "./pages/public/about";
import Contact from "./pages/public/contact";
import Login from "./auth/login";
import Register from "./auth/register";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Rute Publik & User Biasa */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="books" element={<Books />} />
              <Route path="books/:id" element={<BookShow />} />
              <Route path="cart" element={<Cart />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* Rute Khusus Admin */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="books" element={<AdminBooks />} />
                <Route path="books/create" element={<BookCreate />} />
                <Route path="books/:id/edit" element={<BookEdit />} />
                <Route path="genres" element={<AdminGenres />} />
                <Route path="authors" element={<AdminAuthors />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="transactions" element={<AdminTransactions />} />
                <Route path="messages" element={<AdminMessages />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
