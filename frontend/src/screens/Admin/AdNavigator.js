import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install expo/vector-icons
import AdminHome from './AdminHome';
import DisplayBinRequests from './DisplayBinRequests';
import GarbageRequests from './GarbageRequests';
import ResidentProfile from '../Resident/ResidentProfile';

const Tab = createBottomTabNavigator();

const AdNavigator = () => {
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
            case 'Assign':
              iconName = focused ? 'clipboard' : 'clipboard-outline'; // Assign garbage request icon
              break;
            case 'BinReq':
              iconName = focused ? 'trash' : 'trash-outline'; // Bin request icon
              break;
            case 'Garbage':
              iconName = focused ? 'analytics' : 'analytics-outline'; // Track garbage/waste icon
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
        component={AdminHome}
      />
      <Tab.Screen 
        name="Assign" 
        component={AdminHome} 
        options={{ title: 'Garbage Request' }} // Set custom title
      />
      <Tab.Screen 
        name="BinReq" 
        component={DisplayBinRequests} 
        options={{ title: 'Bin Request' }} // Set custom title
      />
      <Tab.Screen 
        name="Garbage" 
        component={GarbageRequests} 
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

export default AdNavigator;
