import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define o formato do item no carrinho
export interface CartItem {
  id: string;
  name: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Carrega o carrinho salvo no navegador (se tiver) ao abrir o site
  useEffect(() => {
    const savedCart = localStorage.getItem('brasilHospCart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Salva no navegador sempre que o carrinho mudar
  useEffect(() => {
    localStorage.setItem('brasilHospCart', JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === newItem.id);
      if (existingItem) {
        // Se já existe, só aumenta a quantidade
        return prev.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Se não existe, adiciona novo
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart deve ser usado dentro de um CartProvider');
  return context;
};