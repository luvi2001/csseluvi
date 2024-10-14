import { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ResidentHome = () => {
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();  // Get the navigation object

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await fetch('http://192.168.8.169:5000/api/admin/residents/me', {
            method: 'GET',
            headers: {
              Authorization: token,
            },
          });
          const data = await response.json();
          setUserName(data.userName); // Set the user's name
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  // Function to handle navigation
  const handleNext = () => {
    navigation.navigate('Reqcol');  // Navigate to AnotherPage
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Welcome, {userName}!</Text>

      {/* Next Button to Navigate to AnotherPage */}
      <Button title="Next" onPress={handleNext} style={styles.button} />
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
  greeting: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default ResidentHome;
