import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Replace with your actual backend URL (from `npm run dev` in backend folder)
// It will look like: https://RANDOM-STRING.trycloudflare.com
const API_URL = 'https://lutose-joyously-jasmine.ngrok-free.dev';

export default function LoginScreen({ onLogin }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!code) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/validate-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join store');
      }

      console.log("Joined store:", data.shop);

      const storeConfig = {
        shop: data.shop,
        logoUrl: data.logoUrl,
        primaryColor: data.primaryColor,
        storefrontAccessToken: data.storefrontAccessToken,
        shopUrl: `https://${data.shop}` // derived for webview fallback
      };

      // 2. Save config
      await AsyncStorage.setItem('storeConfig', JSON.stringify(storeConfig));
      
      // 3. Notify App.js
      onLogin(storeConfig);
      
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mobile Store Builder</Text>
      <Text style={styles.subtitle}>Enter your invite code to access the store</Text>
      
      <TextInput
        style={styles.input}
        placeholder="e.g. 123456"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        autoCapitalize="none"
        maxLength={6}
      />
      
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Enter Store" onPress={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30, textAlign: 'center' },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 15, 
    marginBottom: 20, 
    borderRadius: 8, 
    fontSize: 20, 
    textAlign: 'center',
    letterSpacing: 2
  },
});
