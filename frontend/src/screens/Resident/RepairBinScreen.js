import React, { useState, useEffect } from 'react';
import { View, Text,TextInput, TouchableOpacity, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const RepairBinScreen = ({ navigation, route }) => {
  const [bins, setBins] = useState([]); // List of resident's bins
  const [selectedBin, setSelectedBin] = useState(null); // The selected bin for repair
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchBins();
  }, []);

  const fetchBins = async () => {
    try {
      const residentId = route.params.residentId; // Get resident ID from navigation props
      const response = await axios.get(`http://localhost:5000/api/residents/${residentId}/bins`);
      setBins(response.data);
    } catch (error) {
      console.error('Error fetching bins:', error);
      Alert.alert('Error', 'Failed to load bins');
    }
  };

  const handleSubmit = () => {
    if (!selectedBin || !description) {
      Alert.alert('Error', 'Please select a bin and provide a description');
      return;
    }

    // Submit repair request logic here
    Alert.alert(
      'Confirm Repair Request',
      `Are you sure you want to request repair for ${selectedBin.binType} bin?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            // Navigate to payment screen after confirmation
            navigation.navigate('PaymentScreen', { binType: selectedBin.binType });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Repair Bin Request</Text>

      {bins.length > 0 ? (
        bins.map((bin) => (
          <TouchableOpacity
            key={bin._id}
            style={[styles.binOption, selectedBin === bin && styles.selected]}
            onPress={() => setSelectedBin(bin)}
          >
            <Text style={styles.binText}>{bin.binType} - Status: {bin.status}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No bins available</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Describe the issue"
        value={description}
        onChangeText={setDescription}
      />

      <Button title="Submit Repair Request" onPress={handleSubmit} />
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
  binOption: {
    backgroundColor: '#E0E0E0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  selected: {
    backgroundColor: '#4CAF50',
  },
  binText: {
    fontSize: 18,
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

export default RepairBinScreen;
