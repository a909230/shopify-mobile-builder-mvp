import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createCheckout } from '../api/shopify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart from storage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    saveCart();
  }, [cart]);

  const loadCart = async () => {
    try {
      const storedCart = await AsyncStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Failed to load cart', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart', error);
    }
  };

  const addToCart = (product, variant) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.variant.id === variant.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.variant.id === variant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, variant, quantity: 1 }];
    });
  };

  const removeFromCart = (variantId) => {
    setCart(prevCart => prevCart.filter(item => item.variant.id !== variantId));
  };

  const updateQuantity = (variantId, quantity) => {
    if (quantity < 1) {
      removeFromCart(variantId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.variant.id === variantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.variant.price.amount);
      return total + price * item.quantity;
    }, 0);
  };

  const checkout = async () => {
    if (cart.length === 0) return null;
    try {
      const checkoutData = await createCheckout(cart);
      return checkoutData.webUrl;
    } catch (error) {
      console.error('Checkout failed', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
