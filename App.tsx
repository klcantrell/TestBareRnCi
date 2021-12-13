/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import useColorScheme from './hooks/useColorScheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './navigation';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaProvider style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Navigation colorScheme={isDarkMode ? 'dark' : 'light'} />
    </SafeAreaProvider>
  );
};

export default App;
