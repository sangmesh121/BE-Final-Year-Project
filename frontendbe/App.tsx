import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ThemeProvider } from './src/context/ThemeContext';
import { AppNavigator } from './src/navigation';

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}


