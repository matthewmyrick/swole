import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';

import WeekView from './src/screens/WeekView';
import RoutinesList from './src/screens/RoutinesList';
import RoutineDetail from './src/screens/RoutineDetail';
import DayDetail from './src/screens/DayDetail';

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
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
  },
  labelFocused: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  labelUnfocused: {
    fontSize: 12,
    color: '#999',
    fontWeight: '400',
  },
});

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            height: 80,
            paddingBottom: 10,
            paddingTop: 10,
          },
        }}
      >
        <Tab.Screen 
          name="Week" 
          component={WeekStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={tabIconStyles.container}>
                <Text style={tabIconStyles.icon}>📅</Text>
                <Text style={focused ? tabIconStyles.labelFocused : tabIconStyles.labelUnfocused}>
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
                <Text style={tabIconStyles.icon}>💪</Text>
                <Text style={focused ? tabIconStyles.labelFocused : tabIconStyles.labelUnfocused}>
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
