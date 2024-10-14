import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const ReplaceBinScreen = ({ navigation, route }) => {
  const [bins, setBins] = useState([]); // List of resident's bins
  const [selectedOldBin, setSelectedOldBin] = useState(null); // Bin selected for replacement
  const [selectedNewBin, setSelectedNewBin] = useState(''); // New bin type to replace old one

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
    if (!selectedOldBin || !selectedNewBin) {
      Alert.alert('Error', 'Please select an old bin and a new bin type');
      return;
    }

    Alert.alert(
      'Confirm Replacement',
      `Are you sure you want to replace the ${selectedOldBin.binType} bin with a ${selectedNewBin} bin?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            // Navigate to payment screen after confirmation
            navigation.navigate('PaymentScreen', { binType: selectedNewBin });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Replace Existing Bin</Text>

      <Text style={styles.subHeading}>Select the bin you want to replace:</Text>
      {bins.length > 0 ? (
        bins.map((bin) => (
          <TouchableOpacity
            key={bin._id}
            style={[styles.binOption, selectedOldBin === bin && styles.selected]}
            onPress={() => setSelectedOldBin(bin)}
          >
            <Text style={styles.binText}>{bin.binType} - Status: {bin.status}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No bins available</Text>
      )}

      <Text style={styles.subHeading}>Select the new bin type:</Text>
      <TouchableOpacity
        style={[styles.binOption, selectedNewBin === 'Bio' && styles.selected]}
        onPress={() => setSelectedNewBin('Bio')}
      >
        <Text style={styles.binText}>Bio</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.binOption, selectedNewBin === 'Plastic' && styles.selected]}
        onPress={() => setSelectedNewBin('Plastic')}
      >
        <Text style={styles.binText}>Plastic</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.binOption, selectedNewBin === 'Glass' && styles.selected]}
        onPress={() => setSelectedNewBin('Glass')}
      >
        <Text style={styles.binText}>Glass</Text>
      </TouchableOpacity>

      <Button title="Submit Replacement Request" onPress={handleSubmit} />
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
  subHeading: {
    fontSize: 18,
    marginBottom: 10,
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
});

export default ReplaceBinScreen;
