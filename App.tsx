/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, useColorScheme } from 'react-native';
import { LoginView } from './src/views/auth/LoginView';
import { MatchView } from './src/views/match/MatchView';
import { ChatView } from './src/views/chat/ChatView';
import { GamificationView } from './src/views/gamification/GamificationView';
import { ProfileView } from './src/views/auth/ProfileView';
import '@react-native-firebase/app';

const Stack = createNativeStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginView}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Match" component={MatchView} />
        <Stack.Screen name="Chat" component={ChatView} />
        <Stack.Screen name="Gamification" component={GamificationView} />
        <Stack.Screen name="Profile" component={ProfileView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
