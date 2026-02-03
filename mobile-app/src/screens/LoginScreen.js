import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default URL - can be edited in the app
const DEFAULT_API_URL = 'https://lutose-joyously-jasmine.ngrok-free.dev';

export default function LoginScreen({ onLogin }) {
  const [code, setCode] = useState('');
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleLogin = async () => {
    if (!code) return;
    setLoading(true);

    try {
      // Remove trailing slash if present
      const cleanUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
      const response = await fetch(`${cleanUrl}/api/validate-code`, {
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
        bannerUrl: data.bannerUrl,
        welcomeTitle: data.welcomeTitle,
        welcomeSubtitle: data.welcomeSubtitle,
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

      <TouchableOpacity onPress={() => setShowSettings(!showSettings)} style={styles.settingsToggle}>
        <Text style={styles.settingsText}>{showSettings ? 'Hide Settings' : 'Server Settings'}</Text>
      </TouchableOpacity>

      {showSettings && (
        <View style={styles.settingsContainer}>
          <Text style={styles.label}>Backend URL:</Text>
          <TextInput
            style={[styles.input, styles.urlInput]}
            value={apiUrl}
            onChangeText={setApiUrl}
            placeholder="https://..."
            autoCapitalize="none"
          />
        </View>
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
  settingsToggle: { marginTop: 20, alignItems: 'center' },
  settingsText: { color: '#666', textDecorationLine: 'underline' },
  settingsContainer: { marginTop: 20, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 8 },
  label: { marginBottom: 5, fontWeight: 'bold', color: '#444' },
  urlInput: { fontSize: 14, textAlign: 'left', letterSpacing: 0, marginBottom: 0 }
});
