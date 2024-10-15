import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Linking, TouchableOpacity, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; 

const BinRequestsScreen = () => {
  const [binRequests, setBinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    axios.get('http://192.168.8.169:5000/api/admin/bin-requests')  // Adjust the URL to your backend endpoint
      .then(response => {
        setBinRequests(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching bin requests:', error);
        setLoading(false);
      });
  }, []);

  // Function to open the location in Google Maps
  const openLocationInMaps = (address) => {
    const query = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;

    Linking.openURL(url).catch(err => console.error('Error opening Google Maps:', err));
  };

  // Function to approve bin request
  const handleApproveRequest = (requestId) => {
    // Make a PUT or POST request to approve the request
    axios.put(`http://192.168.8.169:5000/api/admin/approve-bin-request/${requestId}`)
      .then(() => {
        setBinRequests(prevRequests =>
          prevRequests.map(request => request._id === requestId ? { ...request, status: 'Approved' } : request)
        );
        alert('Request approved successfully!');
      })
      .catch(error => {
        console.error('Error approving request:', error);
        alert('Failed to approve request');
      });
  };

  // Function to create a new bin
// Function to navigate to Create Bin screen
const handleCreateBin = (binType, residentName, location) => {
  console.log('Navigating to CreateBinScreen with:', { binType, residentName, location });
  navigation.navigate('CreateBinScreen', { binType, residentName, location });
};



  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={binRequests}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.requestCard}>
            <Text style={styles.text}><Text style={styles.label}>Bin Type:</Text> {item.binType}</Text>
            <Text style={styles.text}><Text style={styles.label}>Status:</Text> {item.status}</Text>
            <Text style={styles.text}><Text style={styles.label}>Resident Name:</Text> {item.residentId?.userId?.name || 'N/A'}</Text>
            
            <TouchableOpacity onPress={() => openLocationInMaps(item.residentId?.address)}>
              <Text style={[styles.text, styles.link]}>
                <Text style={styles.label}>Location:</Text> {item.residentId?.address || 'No Address Available'}
              </Text>
            </TouchableOpacity>

            {/* Buttons for Approving and Creating Bin */}
            <View style={styles.buttonContainer}>
              <Button
                title="Approve Request"
                onPress={() => handleApproveRequest(item._id)}
                color="#4CAF50"
              />
              <View style={styles.buttonSpacing} />
              <Button
            title="Create Bin"
            onPress={() => handleCreateBin(item.binType, item.residentId?.userId?.name, item.residentId?.address)}
            color="#4CAF50"
            />

            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cceba7', // Background color
    padding: 10,
  },
  requestCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonSpacing: {
    width: 10, // Space between buttons
  },
});

export default BinRequestsScreen;
