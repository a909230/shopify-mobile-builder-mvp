import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, SafeAreaView, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './src/screens/LoginScreen';

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
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {/* 
         NOTE: In a real app, you might want to hide the logout button 
         or put it in a settings menu.
      */}
      <View style={{ height: '100%', width: '100%' }}>
        <WebView 
          source={{ uri: storeConfig.shopUrl }} 
          style={{ flex: 1 }}
        />
        <Button title="Exit Store (Dev)" onPress={handleLogout} />
      </View>
    </SafeAreaView>
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
});
