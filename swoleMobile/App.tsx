import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet, Platform } from 'react-native';
import Icon from './src/components/Icon';
import { LinearGradient } from 'expo-linear-gradient';

import WeekView from './src/screens/WeekView';
import RoutinesList from './src/screens/RoutinesList';
import RoutineDetail from './src/screens/RoutineDetail';
import DayDetail from './src/screens/DayDetail';
import { colors, spacing, borderRadius } from './src/theme/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function WeekStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="WeekView" component={WeekView} />
      <Stack.Screen name="DayDetail" component={DayDetail} />
      <Stack.Screen name="RoutineDetail" component={RoutineDetail} />
    </Stack.Navigator>
  );
}

function RoutinesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="RoutinesList" component={RoutinesList} />
      <Stack.Screen name="RoutineDetail" component={RoutineDetail} />
    </Stack.Navigator>
  );
}

const tabIconStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    width: 80,
    minWidth: 80,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  iconWrapperFocused: {
    transform: [{ scale: 1.1 }],
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
  },
  labelFocused: {
    color: colors.primary.main,
    fontWeight: '700',
  },
  labelUnfocused: {
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  tabBar: {
    backgroundColor: colors.background.secondary,
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 100 : 80,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.md,
    paddingTop: spacing.md,
    ...colors.shadow.lg,
  },
});

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: tabIconStyles.tabBar,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tab.Screen 
          name="Week" 
          component={WeekStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={tabIconStyles.container}>
                <View style={[
                  tabIconStyles.iconWrapper,
                  focused && tabIconStyles.iconWrapperFocused,
                ]}>
                  {focused ? (
                    <LinearGradient
                      colors={colors.primary.gradient}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: borderRadius.xl,
                        opacity: 0.15,
                      }}
                    />
                  ) : null}
                  <Icon 
                    name="calendar-outline" 
                    size={22} 
                    color={focused ? colors.primary.main : colors.text.tertiary}
                  />
                </View>
                <Text style={[
                  tabIconStyles.label,
                  focused ? tabIconStyles.labelFocused : tabIconStyles.labelUnfocused
                ]}>
                  Week
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen 
          name="Routines" 
          component={RoutinesStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={tabIconStyles.container}>
                <View style={[
                  tabIconStyles.iconWrapper,
                  focused && tabIconStyles.iconWrapperFocused,
                ]}>
                  {focused ? (
                    <LinearGradient
                      colors={colors.secondary.gradient}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: borderRadius.xl,
                        opacity: 0.15,
                      }}
                    />
                  ) : null}
                  <Icon 
                    name="fitness-outline" 
                    size={22} 
                    color={focused ? colors.secondary.main : colors.text.tertiary}
                  />
                </View>
                <Text style={[
                  tabIconStyles.label,
                  focused ? tabIconStyles.labelFocused : tabIconStyles.labelUnfocused
                ]}>
                  Routines
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
