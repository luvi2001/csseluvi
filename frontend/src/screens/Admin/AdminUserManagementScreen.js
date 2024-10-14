import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const AdminUserManagementScreen = () => {
  const [users, setUsers] = useState([]); // All users
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered users
  const [selectedUserType, setSelectedUserType] = useState('All'); // Filter criteria

  // Fetch all users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://your-backend-url/api/users');
      setUsers(response.data); // Set users in state
      setFilteredUsers(response.data); // Initially show all users
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load users');
    }
  };

  // Handle filtering of users by user type
  const handleFilterChange = (userType) => {
    setSelectedUserType(userType);
    if (userType === 'All') {
      setFilteredUsers(users); // Show all users if "All" is selected
    } else {
      setFilteredUsers(users.filter((user) => user.userType === userType));
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://your-backend-url/api/users/${userId}`);
      Alert.alert('Success', 'User deleted successfully');
      fetchUsers(); // Refresh the user list after deletion
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete user');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Manage Users</Text>

      {/* Filter options */}
      <Text style={styles.subHeading}>Filter by user type:</Text>
      <View style={styles.filterOptions}>
        <TouchableOpacity
          style={[styles.filterButton, selectedUserType === 'All' && styles.selectedFilter]}
          onPress={() => handleFilterChange('All')}
        >
          <Text>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedUserType === 'Resident' && styles.selectedFilter]}
          onPress={() => handleFilterChange('Resident')}
        >
          <Text>Resident</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedUserType === 'WasteCollector' && styles.selectedFilter]}
          onPress={() => handleFilterChange('WasteCollector')}
        >
          <Text>Waste Collector</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedUserType === 'ServiceManager' && styles.selectedFilter]}
          onPress={() => handleFilterChange('ServiceManager')}
        >
          <Text>Service Manager</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedUserType === 'Admin' && styles.selectedFilter]}
          onPress={() => handleFilterChange('Admin')}
        >
          <Text>Admin</Text>
        </TouchableOpacity>
      </View>

      {/* List of users */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userText}>
              {item.name} ({item.userType})
            </Text>
            <Button
              title="Delete"
              color="red"
              onPress={() => handleDeleteUser(item._id)}
            />
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
  subHeading: {
    fontSize: 18,
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 5,
  },
  selectedFilter: {
    backgroundColor: '#4CAF50',
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FFF',
    marginBottom: 10,
    borderRadius: 5,
  },
  userText: {
    fontSize: 16,
  },
});

export default AdminUserManagementScreen;
