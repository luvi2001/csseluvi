import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';

const PaymentProcessingScreen = ({ route, navigation }) => {
  const { binType, amount } = route.params; // Get the bin type and amount passed from previous screen

  const [loading, setLoading] = useState(true); // Loading state for payment processing
  const [paymentSuccess, setPaymentSuccess] = useState(false); // To determine when to show the "OK" button

  // Simulate payment processing without any backend API call
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after 3 seconds
      setPaymentSuccess(true); // Show the "OK" button after processing
    }, 3000); // Simulate 3 seconds delay for payment processing

    // Cleanup timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Show the loading spinner while payment is processing */}
        {loading ? (
          <>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.processingText}>PAYMENT PROCESSING</Text>
          </>
        ) : (
          <>
            <Text style={styles.successText}>Payment Successful!</Text>
            <Button
              title="OK"
              onPress={() => navigation.navigate('ResidentHome')}
              color="#4CAF50"
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50', // Green theme for background
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    marginTop: 20,
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  successText: {
    fontSize: 22,
    color: 'white',
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default PaymentProcessingScreen;
