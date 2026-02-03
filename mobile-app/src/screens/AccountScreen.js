import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, ActivityIndicator, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginCustomer, fetchCustomerOrders } from '../api/shopify';
import { useTheme } from '../context/ThemeContext';

export default function AccountScreen() {
  const { colors } = useTheme();
  const [customerAccessToken, setCustomerAccessToken] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    checkCustomerLogin();
  }, []);

  const checkCustomerLogin = async () => {
    try {
      const token = await AsyncStorage.getItem('customerAccessToken');
      if (token) {
        setCustomerAccessToken(token);
        loadCustomerData(token);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCheckingAuth(false);
    }
  };

  const loadCustomerData = async (token) => {
    setLoading(true);
    try {
      const data = await fetchCustomerOrders(token);
      setCustomer(data);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to load profile. Please login again.');
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      const token = await loginCustomer(email, password);
      await AsyncStorage.setItem('customerAccessToken', token);
      setCustomerAccessToken(token);
      loadCustomerData(token);
    } catch (e) {
      Alert.alert('Login Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('customerAccessToken');
    setCustomerAccessToken(null);
    setCustomer(null);
    setEmail('');
    setPassword('');
  };

  if (checkingAuth) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!customerAccessToken) {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Customer Login</Text>
          <Text style={styles.subtitle}>Sign in to view your orders</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <View style={styles.buttonContainer}>
             {loading ? (
               <ActivityIndicator color={colors.primary} />
             ) : (
               <Button title="Sign In" onPress={handleLogin} color={colors.primary} />
             )}
          </View>
        </View>
      </View>
    );
  }

  const renderOrder = ({ item }) => {
    const order = item.node;
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
          <Text style={styles.orderDate}>{new Date(order.processedAt).toLocaleDateString()}</Text>
        </View>
        <Text style={styles.orderStatus}>
          Status: {order.financialStatus} / {order.fulfillmentStatus}
        </Text>
        <Text style={styles.orderTotal}>
          Total: {order.totalPrice.amount} {order.totalPrice.currencyCode}
        </Text>
        <View style={styles.itemsList}>
          {order.lineItems.edges.map((line, index) => (
            <Text key={index} style={styles.lineItem}>
              {line.node.quantity}x {line.node.title}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>
          Welcome, {customer?.firstName || 'Customer'}
        </Text>
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>

      <Text style={styles.sectionTitle}>My Orders</Text>

      {loading ? (
         <View style={styles.center}>
           <ActivityIndicator size="large" color={colors.primary} />
         </View>
      ) : (
        <FlatList
          data={customer?.orders?.edges || []}
          renderItem={renderOrder}
          keyExtractor={(item) => item.node.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No orders found.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loginContainer: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30, textAlign: 'center' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  buttonContainer: { marginTop: 10 },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  welcome: { fontSize: 18, fontWeight: 'bold' },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 20,
    marginBottom: 10,
  },
  listContent: { padding: 16 },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderNumber: { fontWeight: 'bold', fontSize: 16 },
  orderDate: { color: '#666' },
  orderStatus: { marginBottom: 5, color: '#666' },
  orderTotal: { fontWeight: 'bold', marginBottom: 10 },
  itemsList: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  lineItem: { fontSize: 14, marginBottom: 2 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#999' },
});
