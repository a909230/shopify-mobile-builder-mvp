import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import AccountScreen from '../screens/AccountScreen';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator for Home Tab
const HomeStack = () => {
  const { colors } = useTheme();
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProductList" 
        component={ProductListScreen} 
        options={{ 
          title: 'Shop Products',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
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

export default function MainNavigator({ onLogout }) {
  const { cart } = useCart();
  const { colors, shop } = useTheme();

  // Helper to construct URLs
  // Note: In a real app, you might need more robust URL handling
  const getUrl = (path) => {
    // Remove trailing slash if present
    const base = shop.url.endsWith('/') ? shop.url.slice(0, -1) : shop.url;
    return `${base}${path}`;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
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
        component={CartScreen} 
        options={{
          headerShown: true,
          title: 'My Cart',
          tabBarBadge: cart.length > 0 ? cart.reduce((acc, item) => acc + item.quantity, 0) : null,
        }}
      />
      <Tab.Screen 
        name="Account" 
        component={AccountScreen} 
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
