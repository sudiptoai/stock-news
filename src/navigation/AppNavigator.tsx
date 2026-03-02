import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import NewsScreen from '../screens/NewsScreen';
import StocksScreen from '../screens/StocksScreen';
import RecommendationsScreen from '../screens/RecommendationsScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import GoalsScreen from '../screens/GoalsScreen';

export type RootTabParamList = {
  News: undefined;
  Stocks: undefined;
  Recommendations: undefined;
  Watchlist: undefined;
  Goals: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

// Simple emoji-based icons to avoid native module requirements
const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  News: { active: '📰', inactive: '📄' },
  Stocks: { active: '📈', inactive: '📉' },
  Recommendations: { active: '💡', inactive: '🔦' },
  Watchlist: { active: '⭐', inactive: '☆' },
  Goals: { active: '🎯', inactive: '◎' },
};

function TabIcon({
  name,
  focused,
}: {
  name: keyof typeof TAB_ICONS;
  focused: boolean;
}) {
  const icon = focused ? TAB_ICONS[name].active : TAB_ICONS[name].inactive;
  return (
    <View style={[iconStyles.wrap, focused && iconStyles.wrapActive]}>
      <Text style={iconStyles.icon}>{icon}</Text>
    </View>
  );
}

const iconStyles = StyleSheet.create({
  wrap: {
    padding: 4,
    borderRadius: 10,
  },
  wrapActive: {
    backgroundColor: Colors.primary + '22',
  },
  icon: {
    fontSize: 22,
  },
});

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: Colors.surface,
          borderBottomColor: Colors.border,
          borderBottomWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 20,
        },
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingTop: 6,
          paddingBottom: 4,
          height: 64,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginBottom: 4,
        },
        tabBarIcon: ({ focused }) => (
          <TabIcon
            name={route.name as keyof typeof TAB_ICONS}
            focused={focused}
          />
        ),
      })}
    >
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{ title: 'Market News' }}
      />
      <Tab.Screen
        name="Stocks"
        component={StocksScreen}
        options={{ title: 'Stocks' }}
      />
      <Tab.Screen
        name="Recommendations"
        component={RecommendationsScreen}
        options={{
          title: 'Picks',
          tabBarLabel: 'Picks',
          headerTitle: 'Recommendations',
        }}
      />
      <Tab.Screen
        name="Watchlist"
        component={WatchlistScreen}
        options={{ title: 'Watchlist' }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{ title: 'Goals' }}
      />
    </Tab.Navigator>
  );
}
