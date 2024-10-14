import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import 'react-native-get-random-values';
import { StatusBar } from 'react-native'; // StatusBar correctly imported

// Components


// Register and Login Screens
import Register from './src/screens/Register';
import LoginScreen from './src/screens/LoginScreen';
import profileScreen from './src/screens/profileScreen';

// Home Screens
import AdminHome from './src/screens/Admin/AdminHome';
import DistributorHome from './src/screens/Distributor/DistributorHome';
import ResidentHome from './src/screens/Resident/ResidentHome';
import ServiceManagerHome from './src/screens/ServiceManager/ServiceManagerHome';
import WasteCollectorHome from './src/screens/wasteCollector/WasteCollectorHome';


//resident
import BinRequestScreen from './src/screens/Resident/BinRequestScreen';
import NewBinRequestScreen from './src/screens/Resident/NewBinRequestScreen';
import RepairBinScreen from './src/screens/Resident/RepairBinScreen';
import ReplaceBinScreen from './src/screens/Resident/ReplaceBinScreen';
import PaymentScreen from './src/screens/Resident/PaymentScreen'
import PaymentProcessingScreen from './src/screens/Resident/paymentProcessingScreen';
import WasteReportScreen from './src/screens/Resident/WasteReportScreen'; // Import the screen
import BinRequestsScreen from './src/screens/Admin/DisplayBinRequests';
import GarbageCollectionRequestForm from './src/screens/Resident/GarbageCollectionRequestForm';
const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      {/* Place StatusBar outside the navigator */}
      <StatusBar style="auto" />
      
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen">
          
          {/* Register and Login Screens */}
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="profileScreen" component={profileScreen} />

          {/* Home Screens */}
          <Stack.Screen name="AdminHome" component={AdminHome} />
          <Stack.Screen name="DistributorHome" component={DistributorHome} />
          <Stack.Screen name="ResidentHome" component={ResidentHome} />
          <Stack.Screen name="ServiceManagerHome" component={ServiceManagerHome} />
          <Stack.Screen name="WasteCollectorHome" component={WasteCollectorHome} />

          {/* Components */}
          
          {/*Resident Screens */}
          <Stack.Screen name="BinRequestScreen" component={BinRequestScreen} />
          <Stack.Screen name="NewBinRequestScreen" component={NewBinRequestScreen} />
          <Stack.Screen name="RepairBinScreen" component={RepairBinScreen} />
          <Stack.Screen name="ReplaceBinScreen" component={ReplaceBinScreen} />
          <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
          <Stack.Screen name="PaymentProcessingScreen" component={PaymentProcessingScreen} />
          <Stack.Screen name="WasteReportScreen" component={WasteReportScreen} />


          <Stack.Screen name="AdminBinreq" component={BinRequestsScreen} />
          <Stack.Screen name="Reqcol" component={GarbageCollectionRequestForm} />

        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}



