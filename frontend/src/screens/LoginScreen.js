import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios'; // Axios for making HTTP requests
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage for storing token

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and Password are required');
      return;
    }

    try {
      // Make an API call to login
      const response = await axios.post('http://192.168.8.169:5000/api/users/login', {
        email,
        password,
      });

      // Assuming the response contains a user object with a userType property and a token
      const { user, token } = response.data;

      // Store the token in AsyncStorage
      await AsyncStorage.setItem('token', token);

      // Navigate based on userType
      switch (user.userType) {
        case 'Resident':
          navigation.navigate('ResidentHome');
          break;
        case 'Admin':
          navigation.navigate('AdminHome');
          break;
        case 'WasteCollector':
          navigation.navigate('WasteCollectorHome');
          break;
        case 'ServiceManager':
          navigation.navigate('ServiceManagerHome');
          break;
        case 'Distributor':
          navigation.navigate('DistributorHome');
          break;
        default:
          Alert.alert('Error', 'Invalid user type');
          break;
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button style={styles.btn} title="Login" onPress={handleLogin} />

      {/* "Don't have an account?" link */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Don't have an account? Register here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#cceba7',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  linkText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#0066cc',
    textDecorationLine: 'underline',
  },
  btn:{
    backgroundColor:'#4CAF50'
  }
});

export default LoginScreen;
