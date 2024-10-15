import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install expo/vector-icons
import ResidentHome from './ResidentHome';
import GarbageCollectionRequestForm from './GarbageCollectionRequestForm';
import ResidentProfile from './ResidentProfile';
import BinRequestScreen from './BinRequestScreen';
import WasteReportScreen from './WasteReportScreen';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 5, // Adds a shadow effect
          height: 60, // Adjusts the height of the tab bar
        },
        tabBarActiveTintColor: '#4CAF50', // Active tab color
        tabBarInactiveTintColor: '#7a7a7a', // Inactive tab color
        tabBarLabelStyle: {
          fontSize: 14,
          marginBottom: 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline'; // Home icon
              break;
            case 'ReqCollect':
              iconName = focused ? 'add-circle' : 'add-circle-outline'; // Add request icon
              break;
            case 'ReqBin':
              iconName = focused ? 'cube' : 'cube-outline'; // Bin request icon
              break;
            case 'Track':
              iconName = focused ? 'bar-chart' : 'bar-chart-outline'; // Waste tracking icon
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline'; // Profile icon
              break;
            default:
              iconName = 'home-outline'; // Default icon
              break;
          }

          // Return the Ionicons component with the chosen icon
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={ResidentHome}
      />
      <Tab.Screen 
        name="ReqCollect" 
        component={GarbageCollectionRequestForm} 
        options={{ title: 'Garbage Request' }} // Set custom title
      />
      <Tab.Screen 
        name="ReqBin" 
        component={BinRequestScreen} 
        options={{ title: 'Bin Request' }} // Set custom title
      />
      <Tab.Screen 
        name="Track" 
        component={WasteReportScreen} 
        options={{ title: 'Track Waste' }} // Set custom title
      />
      <Tab.Screen 
        name="Profile" 
        component={ResidentProfile} 
        options={{ title: 'My Profile' }} // Set custom title
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
