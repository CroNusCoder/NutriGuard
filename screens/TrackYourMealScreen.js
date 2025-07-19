import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TrackYourMealScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Track Your Meal</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Scanner')}>
        <Text style={styles.buttonText}>📷 Scan Your Food</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('DescribeFood')}>
        <Text style={styles.buttonText}>📝 Describe Your Food</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    padding: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2A473A',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#D6E54B',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#2A473A',
    fontWeight: '600',
  },
});
