import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator for Home Tab
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProductList" 
        component={ProductListScreen} 
        options={{ 
          title: 'Shop Products',
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
        }} 
      />
      <Stack.Screen 
        name="ProductDetails" 
        component={ProductDetailsScreen} 
        options={{ title: 'Details' }} 
      />
    </Stack.Navigator>
  );
};

// Reusable WebView Screen
const WebScreen = ({ url }) => {
  return (
    <WebView 
      source={{ uri: url }} 
      startInLoadingState={true}
      renderLoading={() => (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )}
    />
  );
};

export default function MainNavigator({ storeConfig, onLogout }) {
  // Default to black if no color provided
  const primaryColor = storeConfig.primaryColor || '#000000';
  const shopUrl = storeConfig.shopUrl || 'https://shopify.com';

  // Helper to construct URLs
  // Note: In a real app, you might need more robust URL handling
  const getUrl = (path) => {
    // Remove trailing slash if present
    const base = shopUrl.endsWith('/') ? shopUrl.slice(0, -1) : shopUrl;
    return `${base}${path}`;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
      />
      <Tab.Screen 
        name="Cart" 
        children={() => <WebScreen url={getUrl('/cart')} />} 
      />
      <Tab.Screen 
        name="Account" 
        children={() => <WebScreen url={getUrl('/account')} />} 
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  }
});
