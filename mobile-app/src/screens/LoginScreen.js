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
      // 1. Simulate API call for now (until backend is ready)
      // In real app: const res = await fetch(`${API_URL}/api/validate-code`, ...);
      
      console.log("Validating code:", code);
      
      // TEMPORARY: Allow any code for testing UI
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        storeName: "Test Store",
        shopUrl: "https://shopify.com" // Redirects to shopify for test
      };

      // 2. Save config
      await AsyncStorage.setItem('storeConfig', JSON.stringify(mockData));
      
      // 3. Notify App.js
      onLogin(mockData);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to server');
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
