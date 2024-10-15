import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import QRCode from 'qrcode'; // Import QR code library

// Bin factory function
const binFactory = (binType, residentName, location) => {
  switch (binType) {
    case 'Bio': return new BioBin(residentName, location);
    case 'Plastic': return new PlasticBin(residentName, location);
    case 'Glass': return new GlassBin(residentName, location);
    case 'Bulky Item': return new BulkyItemBin(residentName, location);
    case 'Paper and Cardboard': return new PaperCardboardBin(residentName, location);
    case 'Yard Waste': return new YardWasteBin(residentName, location);
    case 'Food Scraps': return new FoodScrapsBin(residentName, location);
    case 'Extra Trash': return new ExtraTrashBin(residentName, location);
    default: throw new Error('Invalid bin type');
  }
};

// Base class for bins
class Bin {
  constructor(residentName, location) {
    this.residentName = residentName;
    this.location = location;
    this.binFilledStatus = 'empty'; // Default status is empty
  }
}

// Subclasses for each bin type
class BioBin extends Bin { constructor(residentName, location) { super(residentName, location); this.binType = 'Bio'; } }
class PlasticBin extends Bin { constructor(residentName, location) { super(residentName, location); this.binType = 'Plastic'; } }
class GlassBin extends Bin { constructor(residentName, location) { super(residentName, location); this.binType = 'Glass'; } }
class BulkyItemBin extends Bin { constructor(residentName, location) { super(residentName, location); this.binType = 'Bulky Item'; } }
class PaperCardboardBin extends Bin { constructor(residentName, location) { super(residentName, location); this.binType = 'Paper and Cardboard'; } }
class YardWasteBin extends Bin { constructor(residentName, location) { super(residentName, location); this.binType = 'Yard Waste'; } }
class FoodScrapsBin extends Bin { constructor(residentName, location) { super(residentName, location); this.binType = 'Food Scraps'; } }
class ExtraTrashBin extends Bin { constructor(residentName, location) { super(residentName, location); this.binType = 'Extra Trash'; } }

const CreateBin = ({ route, navigation }) => {
  const { binType, residentName, location } = route.params;
  const [qrCode, setQrCode] = useState(null); // State to hold QR code

  const handleConfirmCreateBin = () => {
    try {
      // Use the factory to create the appropriate bin instance
      const newBin = binFactory(binType, residentName, location);

      // Generate QR code for the bin, including binFilledStatus
      const binData = {
        binType: newBin.binType,
        residentName: newBin.residentName,
        location: newBin.location,
        binFilledStatus: newBin.binFilledStatus // Add binFilledStatus to the QR code
      };
      
      QRCode.toDataURL(JSON.stringify(binData))
        .then((url) => {
          setQrCode(url);

          // Send the bin details to the backend, including the QR code and bin status
          axios.post('http://192.168.8.169:5000/api/admin/bins', {
            binType: newBin.binType,
            residentName: newBin.residentName,
            location: newBin.location,
            binFilledStatus: newBin.binFilledStatus,
            qrCode: url, // Include the QR code in the request
          })
          .then((response) => {
            Alert.alert('Bin Created Successfully', `Bin Type: ${newBin.binType}`);
            navigation.goBack(); // Navigate back after creation
          })
          .catch((error) => {
            console.error('Error creating bin:', error);
            Alert.alert('Error', 'Failed to create bin');
          });
        })
        .catch((err) => {
          console.error('Failed to generate QR code:', err);
          Alert.alert('Error', 'Failed to generate QR code');
        });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bin Type: {binType}</Text>
      <Text style={styles.text}>Resident Name: {residentName}</Text>
      <Text style={styles.text}>Location: {location}</Text>

      {/* Display the generated QR code */}
      {qrCode && <Image source={{ uri: qrCode }} style={styles.qrCode} />}

      <Button title="Confirm Create Bin" onPress={handleConfirmCreateBin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  qrCode: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
});

export default CreateBin;
