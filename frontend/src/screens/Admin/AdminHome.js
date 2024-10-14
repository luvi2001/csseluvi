import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Linking, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const AdminHome = () => {
  const [requests, setRequests] = useState([]);
  const [wasteCollectors, setWasteCollectors] = useState([]);

  // Fetch garbage requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://192.168.8.169:5000/api/admin/garbage-requests');
        setRequests(response.data);
      } catch (error) {
        Alert.alert('Error', 'Error fetching requests');
      }
    };

    fetchRequests();
  }, []);

  // Fetch waste collectors
  useEffect(() => {
    const fetchWasteCollectors = async () => {
      try {
        const response = await axios.get('http://192.168.8.169:5000/api/admin/waste-collectors');
        setWasteCollectors(response.data);
      } catch (error) {
        Alert.alert('Error', 'Error fetching waste collectors');
      }
    };

    fetchWasteCollectors();
  }, []);

  // Update status and waste collector
  const handleUpdateRequest = async (requestId, status, wasteCollector) => {
    try {
      const response = await axios.put(`http://192.168.8.169:5000/api/admin/garbage-requests/${requestId}`, {
        status,
        wasteCollector
      });
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? response.data : req
        )
      );
    } catch (error) {
      Alert.alert('Error', 'Error updating request');
    }
  };

  // Open Google Maps with the address
  const openAddressInMap = (address) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Failed to open the map');
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Garbage Collection Requests</Text>
        {requests.map((request) => (
          <View key={request._id} style={styles.requestCard}>
            <Text style={styles.text}><Text style={styles.label}>Resident Name:</Text> {request.residentName}</Text>
            
            {/* Make the address clickable */}
            <TouchableOpacity onPress={() => openAddressInMap(request.residentAddress)}>
              <Text style={[styles.text, styles.address]}>
                <Text style={styles.label}>Address:</Text> {request.residentAddress}
              </Text>
            </TouchableOpacity>
            
            <Text style={styles.label}>Status:</Text>
            <Picker
              selectedValue={request.status}
              style={styles.picker}
              onValueChange={(value) =>
                handleUpdateRequest(request._id, value, request.wasteCollector?._id)
              }
            >
              <Picker.Item label="Pending" value="Pending" />
              <Picker.Item label="Accepted" value="Accepted" />
              <Picker.Item label="Rejected" value="Rejected" />
            </Picker>
            <Text style={styles.label}>Waste Collector:</Text>
            <Picker
              selectedValue={request.wasteCollector?._id || ''}
              style={styles.picker}
              onValueChange={(value) =>
                handleUpdateRequest(request._id, request.status, value)
              }
            >
              <Picker.Item label="No Waste Collector" value="" />
              {wasteCollectors.map((collector) => (
                <Picker.Item key={collector._id} label={collector.name} value={collector._id} />
              ))}
            </Picker>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Ensures ScrollView expands properly
    padding: 20,
  },
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  requestCard: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
  },
  address: {
    color: 'blue', // Make the address text stand out as a link
    textDecorationLine: 'underline',
  },
});

export default AdminHome;
