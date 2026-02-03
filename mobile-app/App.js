import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, SafeAreaView, Button, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { CartProvider } from './src/context/CartContext';
import { ThemeProvider } from './src/context/ThemeContext';
import LoginScreen from './src/screens/LoginScreen';
import MainNavigator from './src/navigation/MainNavigator';
import { BUILD_CONFIG } from './src/config/build';

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
      // 1. Check for White Label Build Config
      if (BUILD_CONFIG) {
        console.log("Using White Label Config");
        setStoreConfig(BUILD_CONFIG);
        return;
      }

      // 2. Fallback to Stored Config (Preview Mode)
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
    // Prevent logout in White Label mode
    if (BUILD_CONFIG) return;
    
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
          
          {/* Dev Logout Button - Only show in Preview Mode */}
          {!BUILD_CONFIG && (
            <View style={styles.logoutButton}>
              <Button title="Exit" onPress={handleLogout} color="red" />
            </View>
          )}
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
