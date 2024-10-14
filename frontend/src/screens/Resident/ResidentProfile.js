import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios'; // For making API requests

const ResidentProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  // Fetch user data on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.get('http://your-backend-url/api/residents/profile'); // Fetch profile data
        setName(response.data.name);
        setEmail(response.data.email);
        setAddress(response.data.address);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch profile information');
      }
    }
    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      await axios.put('http://your-backend-url/api/residents/profile', { name, email, address }); // Update profile data
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Resident Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />

      <Button title="Update Profile" onPress={handleUpdateProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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
  },
});

export default ResidentProfile;
