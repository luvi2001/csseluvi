import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet } from 'react-native';

const NewBinRequestScreen = ({ navigation }) => {
  const [selectedBin, setSelectedBin] = useState(''); // Track bin type
  const [isSpecialBin, setIsSpecialBin] = useState(false); // Track if user selects special bin
  const [selectedSpecialBin, setSelectedSpecialBin] = useState(''); // Track special bin type

  // Function to handle bin type selection
  const handleSelectBin = (binType) => {
    setSelectedBin(binType);
    setIsSpecialBin(binType === 'Special Bin');
  };

  // Function to handle special bin selection
  const handleSelectSpecialBin = (specialBinType) => {
    setSelectedSpecialBin(specialBinType);
  };

  // Function to handle order confirmation and navigation to payment page
  const handleConfirmOrder = () => {
    if (selectedBin === 'Special Bin' && !selectedSpecialBin) {
      alert('Please select a special bin type');
      return;
    }

    const binTypeToOrder = selectedBin === 'Special Bin' ? selectedSpecialBin : selectedBin;
    navigation.navigate('PaymentScreen', { binType: binTypeToOrder }); // Navigate to PaymentScreen with the bin type as props
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Request a New Bin</Text>

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
      <TouchableOpacity
        style={[styles.binOption, selectedBin === 'Special Bin' && styles.selected]}
        onPress={() => handleSelectBin('Special Bin')}
      >
        <Text style={styles.binText}>Special Bin</Text>
      </TouchableOpacity>

      {/* Special bin options, shown only if 'Special Bin' is selected */}
      {isSpecialBin && (
        <>
          <Text style={styles.subHeading}>Select a special bin type:</Text>
          <TouchableOpacity
            style={[styles.binOption, selectedSpecialBin === 'Paper and Cardboard' && styles.selected]}
            onPress={() => handleSelectSpecialBin('Paper and Cardboard')}
          >
            <Text style={styles.binText}>Paper and Cardboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.binOption, selectedSpecialBin === 'Yard Waste' && styles.selected]}
            onPress={() => handleSelectSpecialBin('Yard Waste')}
          >
            <Text style={styles.binText}>Yard Waste</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.binOption, selectedSpecialBin === 'Food Scraps' && styles.selected]}
            onPress={() => handleSelectSpecialBin('Food Scraps')}
          >
            <Text style={styles.binText}>Food Scraps</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.binOption, selectedSpecialBin === 'Bulky Item' && styles.selected]}
            onPress={() => handleSelectSpecialBin('Bulky Item')}
          >
            <Text style={styles.binText}>Bulky Item</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.binOption, selectedSpecialBin === 'Extra Trash' && styles.selected]}
            onPress={() => handleSelectSpecialBin('Extra Trash')}
          >
            <Text style={styles.binText}>Extra Trash</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Green button for confirming the order */}
      <Button
        title="Confirm Order"
        onPress={handleConfirmOrder}
        color="#4CAF50" // Green color
      />
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

export default NewBinRequestScreen;
