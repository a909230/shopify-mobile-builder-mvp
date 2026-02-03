import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { fetchProducts } from '../api/shopify';

export default function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const imageUrl = item.images?.edges?.[0]?.node?.url;
    const price = item.priceRange?.minVariantPrice;

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => {
          console.log('Pressed item:', item.id);
          // Temporary alert to verify click works
          // navigation.navigate('ProductDetails', { productId: item.id });
          if (navigation) {
             navigation.navigate('ProductDetails', { productId: item.id });
          } else {
             alert('Navigation prop missing');
          }
        }}
      >
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.price}>
            {price ? `${price.amount} ${price.currencyCode}` : 'N/A'}
          </Text>
        </View>
      </TouchableOpacity>
    );
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

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 10 },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { width: '100%', height: 200, resizeMode: 'cover' },
  info: { padding: 10 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  price: { fontSize: 14, color: '#666' },
  error: { color: 'red' },
});
