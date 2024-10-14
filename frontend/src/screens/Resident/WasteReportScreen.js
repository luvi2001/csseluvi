import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

const WasteReportScreen = ({ navigation }) => {
  const [description, setDescription] = useState(''); // Description of the issue
  const [userId, setUserId] = useState(null); // To store the user ID

  // Get user ID from the token stored in AsyncStorage
  const getUserIdFromToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // Fetch token from AsyncStorage
      if (token) {
        const decoded = jwt_decode(token); // Decode the token to get the user ID
        const id = decoded.id; // Assuming the user ID is stored in the 'id' field
        setUserId(id);
      }
    } catch (error) {
      console.error('Error fetching user ID from token', error);
    }
  };

  // Call the getUserIdFromToken function when the component mounts
  React.useEffect(() => {
    getUserIdFromToken();
  }, []);

  // Handle the submission of the waste issue
  const handleSubmit = async () => {
    if (!description) {
      Alert.alert('Error', 'Please provide a description for the issue.');
      return;
    }

    try {
      // Send a POST request to the backend to create a new waste report
      const response = await axios.post(`http://localhost:5000/api/residents/${userId}/reportWaste`, {
        description,
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Waste issue reported successfully');
        navigation.goBack(); // Go back to the Resident Home after successful submission
      } else {
        Alert.alert('Error', 'Failed to submit the report. Please try again.');
      }
    } catch (error) {
      console.error('Error reporting waste issue:', error);
      Alert.alert('Error', 'Failed to submit the report.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Report Waste Issue</Text>

      <TextInput
        style={styles.input}
        placeholder="Describe the issue"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Button title="Submit Report" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    textAlignVertical: 'top',
  },
});

export default WasteReportScreen;
