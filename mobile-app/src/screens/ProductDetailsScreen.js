import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, Button, StyleSheet, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { fetchProductDetails } from '../api/shopify';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen({ route }) {
  const { productId } = route.params;
  const { addToCart } = useCart();
  const { colors } = useTheme();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const data = await fetchProductDetails(productId);
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product || !product.variants?.edges?.[0]?.node) return;
    const variant = product.variants.edges[0].node;
    addToCart(product, variant);
    Alert.alert('Success', 'Added to cart');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  if (!product) return null;

  const images = product.images?.edges?.map(e => e.node.url) || [];
  const price = product.variants?.edges?.[0]?.node?.price;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image Carousel */}
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
          {images.length > 0 ? (
            images.map((url, index) => (
              <Image key={index} source={{ uri: url }} style={styles.image} />
            ))
          ) : (
            <View style={[styles.image, styles.placeholder]}>
              <Text>No Image</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.info}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>
            {price ? `${price.amount} ${price.currencyCode}` : 'N/A'}
          </Text>
          
          <Text style={styles.descriptionLabel}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Add to Cart" onPress={handleAddToCart} color={colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 80 },
  imageContainer: { height: 300, backgroundColor: '#f9f9f9' },
  image: { width: width, height: 300, resizeMode: 'contain' },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  info: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  price: { fontSize: 20, color: '#444', marginBottom: 20 },
  descriptionLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  description: { fontSize: 16, lineHeight: 24, color: '#666' },
  error: { color: 'red' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});
