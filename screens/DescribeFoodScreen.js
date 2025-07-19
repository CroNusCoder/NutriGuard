import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { auth } from '../config/firebase';

export default function DescribeFoodScreen({ navigation }) {
  const [foodText, setFoodText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [goalData, setGoalData] = useState({ goal: '', targetDate: '' });

  const userEmail = auth.currentUser?.email;

  useEffect(() => {
    const fetchFitnessGoal = async () => {
      if (!userEmail) return;
      try {
        const res = await fetch(`https://95bcc019821b.ngrok-free.app/api/fitness/goal?email=${userEmail}`);
        const data = await res.json();
        if (res.ok) {
          setGoalData({
            goal: data.goal || '',
            targetDate: data.targetDate || ''
          });
        } else {
          console.warn("Goal fetch error:", data.message);
        }
      } catch (err) {
        console.error("Failed to fetch goal data", err);
      }
    };
    fetchFitnessGoal();
  }, [userEmail]);

  const handleDescribeFood = async () => {
    if (!foodText.trim()) return;
    if (!goalData.goal) {
      setError("Please complete your fitness profile first.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://95bcc019821b.ngrok-free.app/api/groq/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'describe',
          foodDescription: foodText
        })
      });

      const data = await res.json();

      if (res.ok && data) {
        navigation.navigate('AiAnalysis', {
          macros: data,
          foodName: 'Described Food',
          source: 'manual',
          userGoal: goalData.goal,
          targetDate: goalData.targetDate
        });
      } else {
        setError(data.message || 'Failed to analyze food');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Describe Your Meal</Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. 2 slices of pizza, 1 can of coke"
          value={foodText}
          onChangeText={setFoodText}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleDescribeFood}>
          <Text style={styles.buttonText}>Analyze</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#2A473A" />}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2A473A',
    marginBottom: 20,
  },
  input: {
    minHeight: 100,
    borderColor: '#D9D9D9',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2A473A',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#D6E54B',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2A473A',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center'
  }
});
