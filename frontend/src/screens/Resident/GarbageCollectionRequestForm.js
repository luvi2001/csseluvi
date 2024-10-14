import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GarbageCollectionRequestForm = () => {
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [residentName, setResidentName] = useState('');
  const [residentId, setResidentId] = useState('');
  const [residentAddress, setResidentAddress] = useState('');  // New state for address
  const [token, setToken] = useState('');  // State to hold token

  // Fetch resident details and location
  useEffect(() => {
    const fetchResidentDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');  // Fetch token from AsyncStorage
        if (!token) {
          console.error('Token missing');
          return;
        }
        
        setToken(token);  // Set token in state
        console.log("Fetched token:", token);

        const response = await axios.get('http://localhost:5000/api/residents/details', {
          headers: {
            Authorization: `Bearer ${token}`,  // Send token in Authorization header
          },
        });

        console.log('Resident details:', response.data); 
        setResidentName(response.data.residentName);
        setResidentId(response.data.residentId);
        setResidentAddress(response.data.address); // Log response data for debugging
      } catch (error) {
        console.error('Failed to fetch resident details:', error.response?.data || error.message);
      }
    };

    fetchResidentDetails();
  }, []);

  // Handle the form submission
  const handleRequest = async () => {
    try {
      if (!token) {
        console.error('Token is missing!');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/residents/create-request', {
        residentId,
        residentName,
        residentAddress,  // The location will be collected from the form input
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('Request sent successfully!');
    } catch (error) {
      setMessage('Failed to send request. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Request Garbage Collection</Text>

      {/* Resident Name (Read-Only) */}
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={residentName}
        editable={false}
      />

      {/* Resident ID (Hidden in frontend, but sent in the request) */}
      <TextInput
        style={styles.input}
        placeholder="Resident ID"
        value={residentId}
        editable={false}
      />

      {/* Resident Address (Read-Only) */}
      <TextInput
        style={styles.input}
        placeholder="Your Address"
        value={residentAddress}  // Display the address
        editable={false}
      />

      {/* Location Input (For Garbage Collection) */}


      {/* Submit Button */}
      <Button title="Send Request" onPress={handleRequest} />

      {/* Message */}
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
});

export default GarbageCollectionRequestForm;
