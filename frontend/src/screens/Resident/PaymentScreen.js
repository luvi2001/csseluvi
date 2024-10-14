import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Switch, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaymentScreen = ({ route, navigation }) => {
  const { binType } = route.params; // Get the bin type from the props

  // State to handle payment details
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [amount, setAmount] = useState(0); // State to hold the price
  const [errors, setErrors] = useState({}); // To store validation errors
  const [saveCardDetails, setSaveCardDetails] = useState(false); // State to track whether user wants to save card details

  // Define prices for each bin type
  const binPrices = {
    Bio: 500,
    Plastic: 600,
    Glass: 800,
    'Paper and Cardboard': 300,
    'Yard Waste': 350,
    'Food Scraps': 450,
    'Bulky Item': 800,
    'Extra Trash': 200,
  };

  // Set the amount based on the bin type
  useEffect(() => {
    if (binPrices[binType]) {
      setAmount(binPrices[binType]); // Set the price based on the bin type
    } else {
      setAmount(0); // Default to 0 if no valid bin type is found
    }
  }, [binType]);

  // Validates card number (16 digits, numeric)
  const validateCardNumber = (number) => {
    const regex = /^\d{16}$/;
    return regex.test(number);
  };

  // Validates expiration date (MM/YY format, and should be a future date)
  const validateExpirationDate = (date) => {
    const regex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!regex.test(date)) return false;

    const [month, year] = date.split('/');
    const now = new Date();
    const expiryDate = new Date(`20${year}`, month);

    return expiryDate > now;
  };

  // Validates CVC (3 digits, numeric)
  const validateCvc = (cvc) => {
    const regex = /^\d{3}$/;
    return regex.test(cvc);
  };

  // Validate fields in real-time as user types
  const validateField = (field, value) => {
    let errorMsg = '';

    if (field === 'cardNumber' && !validateCardNumber(value)) {
      errorMsg = 'Card number should be 16 digits.';
    } else if (field === 'expirationDate' && !validateExpirationDate(value)) {
      errorMsg = 'Invalid expiration date. Use MM/YY format and ensure it’s in the future.';
    } else if (field === 'cvc' && !validateCvc(value)) {
      errorMsg = 'CVC should be 3 digits.';
    } else if (field === 'billingAddress' && value === '') {
      errorMsg = 'Billing address is required.';
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: errorMsg,
    }));
  };

  // Handle payment submission with validations
  const handlePayment = async () => {
    if (!cardNumber || !expirationDate || !cvc || !billingAddress) {
      Alert.alert('Error', 'All fields are required for payment');
      return;
    }

    if (errors.cardNumber || errors.expirationDate || errors.cvc || errors.billingAddress) {
      Alert.alert('Error', 'Please fix the validation errors before proceeding.');
      return;
    }

    try {
      // Get user ID from token or other source (assuming it's stored in AsyncStorage)
      const token = await AsyncStorage.getItem('userToken'); // Replace with actual storage mechanism
      if (!token) {
        Alert.alert('Error', 'User is not authenticated.');
        return;
      }

      const decoded = jwt_decode(token); // Decode the token to get the user ID (residentId)
      const residentId = decoded.id; // Replace with the correct key for residentId in your JWT

      // Make an API call to your backend for processing payment
      const response = await axios.post('http://localhost:5000/api/residents/makePayment', {
        residentId, // Send residentId in the request body
        cardNumber,
        expirationDate,
        cvc,
        billingAddress,
        binType,
        amount, // Send the amount as part of the payment
        saveCardDetails, // Send whether the user wants to save card details
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Payment processed successfully');
        navigation.navigate('PaymentProcessingScreen'); // Navigate to payment processing screen
      } else {
        Alert.alert('Error', 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Payment processing failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Payment for {amount} Rupees - {binType} Bin</Text>

      <TextInput
        style={styles.input}
        placeholder="Card Number"
        value={cardNumber}
        onChangeText={(value) => {
          setCardNumber(value);
          validateField('cardNumber', value);
        }}
        keyboardType="numeric"
      />
      {errors.cardNumber ? <Text style={styles.errorText}>{errors.cardNumber}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Expiration Date (MM/YY)"
        value={expirationDate}
        onChangeText={(value) => {
          setExpirationDate(value);
          validateField('expirationDate', value);
        }}
        keyboardType="numeric"
      />
      {errors.expirationDate ? <Text style={styles.errorText}>{errors.expirationDate}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="CVC"
        value={cvc}
        onChangeText={(value) => {
          setCvc(value);
          validateField('cvc', value);
        }}
        keyboardType="numeric"
        secureTextEntry
      />
      {errors.cvc ? <Text style={styles.errorText}>{errors.cvc}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Billing Address"
        value={billingAddress}
        onChangeText={(value) => {
          setBillingAddress(value);
          validateField('billingAddress', value);
        }}
      />
      {errors.billingAddress ? <Text style={styles.errorText}>{errors.billingAddress}</Text> : null}

      {/* Add Switch for Save Card Details */}
      <View style={styles.switchContainer}>
        <Text>Save Card Details?</Text>
        <Switch
          value={saveCardDetails}
          onValueChange={(value) => setSaveCardDetails(value)}
        />
      </View>

      <Button title="Confirm Payment" onPress={handlePayment} />
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
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default PaymentScreen;
