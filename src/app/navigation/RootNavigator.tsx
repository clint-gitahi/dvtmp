import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
export function RootNavigator() {  
  const isAuthenticated = false;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>      
      {isAuthenticated ? (        
        <Stack.Screen name="AppTabs" component={AppTabs} />      
      ) : (        
        <Stack.Screen name="AuthStack" component={AuthStack} />      
      )}    
    </Stack.Navigator>  
  );
}