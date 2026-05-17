import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '@features/products/screens/HomeScreen';
import { SearchScreen } from '@features/products/screens/SearchScreen';
import { CartScreen } from '@features/cart/screens/CartScreen';
import { ProfileScreen } from '@features/profile/screens/ProfileScreen';
import { palette, spacing } from '@shared/theme';
import type { AppTabsParamList } from './types';
import { useAppSelector } from '@/shared/hooks/redux';
import { selectCartCount } from '@features/cart/selectors'

const Tab = createBottomTabNavigator<AppTabsParamList>();

export function AppTabs() {
  const cartCount = useAppSelector(selectCartCount);
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.inkMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarLabel: 'Search' }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ 
          tabBarLabel: 'Cart',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: styles.tabBadge,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: palette.white,
    borderTopColor: palette.border,
  },
  tabLabel: { fontSize: 11, fontWeight: '600' },
  iconBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceMuted,
    marginTop: spacing.xxs,
  },
  iconBubbleFocused: {
    backgroundColor: palette.primary,
  },
  tabBadge: {
    backgroundColor: palette.primary,
  }
});