import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';
import { useAppSelector } from '@shared/hooks/redux';
import { ProductDetailsScreen } from '@features/products/screens/ProductDetailsScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() { 
  const isAuthenticated = useAppSelector(s => Boolean(s.auth.token));

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>      
      {isAuthenticated ? (
        <>    
          <Stack.Screen name="AppTabs" component={AppTabs} />
          <Stack.Screen
            name="ProductDetails"
            component={ProductDetailsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          </>
      ) : (        
        <Stack.Screen name="AuthStack" component={AuthStack} />      
      )}    
    </Stack.Navigator>  
  );
}