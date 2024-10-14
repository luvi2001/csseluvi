import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BinRequestScreen = ({ navigation }) => {
  const [selectedRequestType, setSelectedRequestType] = useState(''); // Track request type
  const [selectedBin, setSelectedBin] = useState(''); // Track bin type

  const handleSelectRequestType = (requestType) => {
    setSelectedRequestType(requestType); // Set the selected request type
  };

  const handleSelectBin = (binType) => {
    setSelectedBin(binType); // Set the selected bin type
  };

  const handleNext = () => {
    if (!selectedRequestType) {
      alert('Please select a request type');
      return;
    }

    if (selectedRequestType === 'New Bin') {
      if (!selectedBin) {
        navigation.navigate('NewBinRequestScreen'); // Navigate to available bins screen for new bin requests
      }
    } else if (selectedRequestType === 'Repair Bin') {
      navigation.navigate('RepairBinScreen'); // Navigate to repair bin interface
    } else if (selectedRequestType === 'Replace Bin') {
      navigation.navigate('ReplaceBinScreen'); // Navigate to replace bin interface
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Request a Bin Service</Text>

      {/* Request type options */}
      <Text style={styles.subHeading}>Select a request type:</Text>
      <TouchableOpacity
        style={[styles.requestOption, selectedRequestType === 'New Bin' && styles.selected]}
        onPress={() => handleSelectRequestType('New Bin')}
      >
        <Text style={styles.requestText}>Request New Bin</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.requestOption, selectedRequestType === 'Repair Bin' && styles.selected]}
        onPress={() => handleSelectRequestType('Repair Bin')}
      >
        <Text style={styles.requestText}>Repair Existing Bin</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.requestOption, selectedRequestType === 'Replace Bin' && styles.selected]}
        onPress={() => handleSelectRequestType('Replace Bin')}
      >
        <Text style={styles.requestText}>Replace Existing Bin</Text>
      </TouchableOpacity>

      {/* Bin type options (only if user selected 'New Bin') */}
      {/* {selectedRequestType === 'New Bin' && (
        <>
          <Text style={styles.subHeading}>Select the type of bin you need:</Text>
          <TouchableOpacity
            style={[styles.binOption, selectedBin === 'Bio' && styles.selected]}
            onPress={() => handleSelectBin('Bio')}
          >
            <Text style={styles.binText}>Bio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.binOption, selectedBin === 'Plastic' && styles.selected]}
            onPress={() => handleSelectBin('Plastic')}
          >
            <Text style={styles.binText}>Plastic</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.binOption, selectedBin === 'Glass' && styles.selected]}
            onPress={() => handleSelectBin('Glass')}
          >
            <Text style={styles.binText}>Glass</Text>
          </TouchableOpacity>
        </>
      )} */}

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
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
  subHeading: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  requestOption: {
    backgroundColor: '#E0E0E0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  selected: {
    backgroundColor: '#4CAF50',
  },
  requestText: {
    fontSize: 18,
    textAlign: 'center',
  },
  binOption: {
    backgroundColor: '#E0E0E0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  binText: {
    fontSize: 18,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default BinRequestScreen;
