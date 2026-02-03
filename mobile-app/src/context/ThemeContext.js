import React, { createContext, useContext, useMemo } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ config, children }) => {
  const theme = useMemo(() => {
    if (!config) return null;

    return {
      colors: {
        primary: config.primaryColor || '#000000',
        background: '#ffffff',
        text: '#000000',
        secondaryText: '#666666',
        error: 'red',
        white: '#ffffff',
        border: '#eeeeee',
        lightGray: '#f5f5f5'
      },
      shop: {
        name: config.shop,
        logoUrl: config.logoUrl,
        url: config.shopUrl,
        storefrontAccessToken: config.storefrontAccessToken
      }
    };
  }, [config]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
