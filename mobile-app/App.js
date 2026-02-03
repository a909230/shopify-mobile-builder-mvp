import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, SafeAreaView, Button, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { CartProvider } from './src/context/CartContext';
import { ThemeProvider } from './src/context/ThemeContext';
import LoginScreen from './src/screens/LoginScreen';
import MainNavigator from './src/navigation/MainNavigator';

const linking = {
  prefixes: ['mobilebuilder://'],
  config: {
    screens: {
      Home: {
        screens: {
          ProductList: 'products',
          ProductDetails: 'product/:productId',
        },
      },
      Cart: 'cart',
      Account: 'account',
    },
  },
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [storeConfig, setStoreConfig] = useState(null);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const stored = await AsyncStorage.getItem('storeConfig');
      if (stored) {
        setStoreConfig(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('storeConfig');
    setStoreConfig(null);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!storeConfig) {
    return <LoginScreen onLogin={setStoreConfig} />;
  }

  return (
    <ThemeProvider config={storeConfig}>
      <CartProvider>
        <NavigationContainer linking={linking}>
          <StatusBar style="auto" />
          <MainNavigator onLogout={handleLogout} />
          
          {/* Dev Logout Button - Floating on top for now */}
          <View style={styles.logoutButton}>
            <Button title="Exit" onPress={handleLogout} color="red" />
          </View>
        </NavigationContainer>
      </CartProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 10,
    zIndex: 1000
  }
});
