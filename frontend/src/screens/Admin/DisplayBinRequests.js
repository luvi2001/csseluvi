import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Linking, TouchableOpacity } from 'react-native';
import axios from 'axios';

const BinRequestsScreen = () => {
  const [binRequests, setBinRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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

    // Use Linking API to open the location in Google Maps
    Linking.openURL(url).catch(err => console.error('Error opening Google Maps:', err));
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      <FlatList
        data={binRequests}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
            <Text>Bin Type: {item.binType}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Resident Name: {item.residentId?.userId?.name || 'N/A'}</Text>
            
            {/* TouchableOpacity to make location clickable */}
            <TouchableOpacity onPress={() => openLocationInMaps(item.residentId.address)}>
              <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
                Location: {item.residentId?.address || 'No Address Available'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default BinRequestsScreen;
