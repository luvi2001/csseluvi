import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const AdminBinRequestsManagementScreen = () => {
  const [binRequests, setBinRequests] = useState([]); // All bin requests
  const [loading, setLoading] = useState(false);

  // Fetch all bin requests when the component mounts
  useEffect(() => {
    fetchBinRequests();
  }, []);

  // Fetch bin requests from backend
  const fetchBinRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://your-backend-url/api/binRequests');
      setBinRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load bin requests');
      setLoading(false);
    }
  };

  // Handle report generation
  const handleGenerateReport = async () => {
    try {
      const response = await axios.post('http://your-backend-url/api/reports/binRequests');
      // Assuming the report is returned as a downloadable file or a summary response
      Alert.alert('Success', 'Report generated successfully');
      // Here, you could handle the response if you want to display it or download it
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to generate report');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading Bin Requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Manage Bin Requests</Text>

      {/* List of bin requests */}
      <FlatList
        data={binRequests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text style={styles.requestText}>
              Resident: {item.residentId} | Bin Type: {item.binType} | Status: {item.status}
            </Text>
          </View>
        )}
      />

      {/* Button to generate report */}
      <Button title="Generate Report" onPress={handleGenerateReport} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  requestItem: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FFF',
    marginBottom: 10,
    borderRadius: 5,
  },
  requestText: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminBinRequestsManagementScreen;
