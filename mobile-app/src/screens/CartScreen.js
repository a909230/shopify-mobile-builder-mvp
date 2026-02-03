import React, { useState } from 'react';
import { View, Text, FlatList, Image, Button, StyleSheet, TouchableOpacity, Alert, Linking, ActivityIndicator } from 'react-native';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, checkout, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const url = await checkout();
      if (url) {
        // In a real app, you might want to use a WebView or WebBrowser
        // asking user if they want to clear cart or wait for success
        // For now, we'll open in browser and clear cart
        await Linking.openURL(url);
        // Optional: clearCart(); // Depends on desired UX. Maybe keep it until confirmed?
      } else {
        Alert.alert('Error', 'Could not create checkout');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const renderItem = ({ item }) => {
    const { product, variant, quantity } = item;
    const image = variant.image?.url || product.images?.edges?.[0]?.node?.url;
    
    return (
      <View style={styles.itemContainer}>
        {image && <Image source={{ uri: image }} style={styles.itemImage} />}
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle}>{product.title}</Text>
          <Text style={styles.itemVariant}>{variant.title !== 'Default Title' ? variant.title : ''}</Text>
          <Text style={styles.itemPrice}>
            {variant.price.amount} {variant.price.currencyCode}
          </Text>
          
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => updateQuantity(variant.id, quantity - 1)} style={styles.qtyButton}>
              <Ionicons name="remove" size={20} color="black" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity onPress={() => updateQuantity(variant.id, quantity + 1)} style={styles.qtyButton}>
              <Ionicons name="add" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={() => removeFromCart(variant.id)} style={styles.removeButton}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        renderItem={renderItem}
        keyExtractor={item => item.variant.id}
        contentContainerStyle={styles.listContent}
      />
      
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>
            {getCartTotal().toFixed(2)} {cart[0]?.variant?.price?.currencyCode}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.checkoutButton, isCheckingOut && styles.disabledButton]} 
          onPress={handleCheckout}
          disabled={isCheckingOut}
        >
          {isCheckingOut ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkoutText}>Checkout</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  emptyText: { marginTop: 16, fontSize: 18, color: '#888' },
  listContent: { padding: 16, paddingBottom: 100 },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: { width: 60, height: 60, borderRadius: 4, marginRight: 12, resizeMode: 'cover' },
  itemDetails: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
  itemVariant: { fontSize: 14, color: '#666', marginBottom: 4 },
  itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  qtyButton: { padding: 4, backgroundColor: '#eee', borderRadius: 4 },
  quantityText: { marginHorizontal: 12, fontSize: 16, fontWeight: '600' },
  removeButton: { padding: 8 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  totalLabel: { fontSize: 18, fontWeight: '500' },
  totalPrice: { fontSize: 22, fontWeight: 'bold' },
  checkoutButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: { opacity: 0.7 },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
