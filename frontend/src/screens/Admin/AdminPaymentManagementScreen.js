import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const AdminPaymentManagementScreen = () => {
  const [payments, setPayments] = useState([]); // All payments
  const [loading, setLoading] = useState(false);

  // Fetch all payments when the component mounts
  useEffect(() => {
    fetchPayments();
  }, []);

  // Fetch payments from backend
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://your-backend-url/api/payments');
      setPayments(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load payments');
      setLoading(false);
    }
  };

  // Handle updating the payment status
  const handleUpdatePayment = async (paymentId, newStatus, userId) => {
    try {
      // Update payment status in the backend
      await axios.put(`http://your-backend-url/api/payments/${paymentId}`, {
        status: newStatus,
      });

      // Send notification to the user
      await sendNotification(userId, newStatus);

      Alert.alert('Success', `Payment marked as ${newStatus}`);
      fetchPayments(); // Refresh the list after the update
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update payment');
    }
  };

  // Function to send notification to the user
  const sendNotification = async (userId, status) => {
    try {
      const message = `Your payment was marked as ${status}.`;
      await axios.post('http://your-backend-url/api/notifications', {
        userId,
        message,
      });
    } catch (error) {
      console.error('Error sending notification', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading Payments...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Manage Payments</Text>

      {/* List of payments */}
      <FlatList
        data={payments}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.paymentItem}>
            <Text style={styles.paymentText}>
              {item.binType} - ${item.amount} - {item.status}
            </Text>

            {/* Buttons to update payment status */}
            <View style={styles.buttonContainer}>
              {item.status !== 'successful' && (
                <Button
                  title="Mark as Successful"
                  color="green"
                  onPress={() => handleUpdatePayment(item._id, 'successful', item.userId)}
                />
              )}
              {item.status !== 'unsuccessful' && (
                <Button
                  title="Mark as Unsuccessful"
                  color="red"
                  onPress={() => handleUpdatePayment(item._id, 'unsuccessful', item.userId)}
                />
              )}
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
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  paymentItem: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FFF',
    marginBottom: 10,
    borderRadius: 5,
  },
  paymentText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminPaymentManagementScreen;
