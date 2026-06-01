'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { storeApi } from '@/lib/services';
import type { CartItem } from '@/lib/types';
import { useAuth } from './AuthContext';

const GUEST_CART_KEY = 'guest_cart';

interface CartContextValue {
  items: CartItem[];
  totalPrice: number;
  count: number;
  refresh: () => Promise<void>;
  addItem: (item: CartItem) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, selectedVariants?: Record<string, string>) => Promise<void>;
  removeItem: (productId: string, selectedVariants?: Record<string, string>) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

function itemKey(productId: string, variants?: Record<string, string>) {
  return `${productId}:${JSON.stringify(variants || {})}`;
}

function calcTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

function loadGuestCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveGuestCart(items: CartItem[]) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!token) {
      setItems(loadGuestCart());
      return;
    }
    setIsLoading(true);
    try {
      const data = await storeApi.getCart();
      setItems(data.items || []);
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const mergeItem = (current: CartItem[], item: CartItem) => {
    const key = itemKey(item.productId, item.selectedVariants);
    const existing = current.find((i) => itemKey(i.productId, i.selectedVariants) === key);
    if (existing) {
      return current.map((i) =>
        itemKey(i.productId, i.selectedVariants) === key
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    }
    return [...current, item];
  };

  const addItem: CartContextValue['addItem'] = async (item) => {
    if (!token) {
      const next = mergeItem(loadGuestCart(), { ...item, quantity: item.quantity || 1 });
      saveGuestCart(next);
      setItems(next);
      toast.success('Added to cart');
      return;
    }

    const current = items;
    const next = mergeItem(current, { ...item, quantity: item.quantity || 1 });
    const payload = next.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      selectedVariants: i.selectedVariants,
    }));
    const updated = await storeApi.updateCart(payload);
    setItems(updated.items || []);
    toast.success('Added to cart');
  };

  const updateQuantity = async (productId: string, quantity: number, selectedVariants?: Record<string, string>) => {
    const key = itemKey(productId, selectedVariants);
    const next = items
      .map((i) => (itemKey(i.productId, i.selectedVariants) === key ? { ...i, quantity } : i))
      .filter((i) => i.quantity > 0);

    if (!token) {
      saveGuestCart(next);
      setItems(next);
      return;
    }

    const updated = await storeApi.updateCart(
      next.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        selectedVariants: i.selectedVariants,
      }))
    );
    setItems(updated.items || []);
  };

  const removeItem = async (productId: string, selectedVariants?: Record<string, string>) => {
    const key = itemKey(productId, selectedVariants);
    const next = items.filter((i) => itemKey(i.productId, i.selectedVariants) !== key);

    if (!token) {
      saveGuestCart(next);
      setItems(next);
      return;
    }

    const updated = await storeApi.updateCart(
      next.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        selectedVariants: i.selectedVariants,
      }))
    );
    setItems(updated.items || []);
  };

  const clearCart = async () => {
    if (!token) {
      saveGuestCart([]);
      setItems([]);
      return;
    }
    await storeApi.updateCart([]);
    setItems([]);
  };

  const totalPrice = calcTotal(items);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, totalPrice, count, refresh, addItem, updateQuantity, removeItem, clearCart, isLoading }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
