import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart_items");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (book, quantity = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === book.id);
      const stock = Number(book.stock) || 0;

      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, stock);
        return prevItems.map((item) =>
          item.id === book.id ? { ...item, quantity: nextQty } : item
        );
      }

      return [
        ...prevItems,
        {
          id: book.id,
          title: book.title,
          price: Number(book.price) || 0,
          cover_photo: book.cover_photo,
          stock: stock,
          author: book.author,
          genre: book.genre,
          quantity: Math.min(quantity, stock),
        },
      ];
    });
  };

  const updateQuantity = (bookId, quantity) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id !== bookId) return item;
          const nextQty = Math.min(Math.max(1, quantity), item.stock);
          return { ...item, quantity: nextQty };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (bookId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== bookId));
  };

  const clearCart = () => setCartItems([]);

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
