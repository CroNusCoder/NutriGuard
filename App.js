import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth } from './config/firebase'; // make sure this is correctly imported

import WelcomeScreen from './screens/WelcomeScreen';
import ScannerScreen from './screens/ScannerScreen';
import NutritionScreen from './screens/NutritionScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import FitnessFormScreen from './screens/FitnessFormScreen';
import TrackYourMealScreen from './screens/TrackYourMealScreen';
import DescribeFoodScreen from './screens/DescribeFoodScreen';
import AiAnalysisScreen from './screens/AiAnalysisScreen';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return null; // Or a loading spinner if you want

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Scanner" component={ScannerScreen} />
            <Stack.Screen name="Nutrition" component={NutritionScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="FitnessForm" component={FitnessFormScreen} />
            <Stack.Screen name="TrackYourMeal" component={TrackYourMealScreen} />
            <Stack.Screen name="DescribeFood" component={DescribeFoodScreen} />
            <Stack.Screen name="AiAnalysis" component={AiAnalysisScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
