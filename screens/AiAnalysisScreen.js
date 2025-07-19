import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { auth } from '../config/firebase';

export default function AiAnalysisScreen({ route, navigation }) {
  const { macros = {}, foodName = 'Unknown Food', source = 'manual' } = route.params || {};
  const [dailyMacros, setDailyMacros] = useState(null);
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userGoal, setUserGoal] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const userEmail = auth.currentUser?.email;

  const defaultMacros = {
    calories: 0, sugar: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, sodium: 0
  };

  const getTotal = (today, incoming) => {
    const total = {};
    Object.keys(defaultMacros).forEach(key => {
      total[key] = (today?.[key] || 0) + (incoming?.[key] || 0);
    });
    return total;
  };

  const fetchGoal = async () => {
    try {
      const res = await fetch(`https://95bcc019821b.ngrok-free.app/api/fitness/goal?email=${userEmail}`);
      const data = await res.json();
      if (res.ok) {
        setUserGoal(data.goal);
        setTargetDate(data.targetDate);
        return { goal: data.goal, targetDate: data.targetDate };
      } else {
        throw new Error(data.message || "Goal fetch failed");
      }
    } catch (err) {
      console.error("Fetch goal error:", err.message);
      return { goal: '', targetDate: '' };
    }
  };

  const fetchDecision = async (todayData, goal, date) => {
    try {
      const res = await fetch('https://95bcc019821b.ngrok-free.app/api/groq/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'decision',
          foodMacros: macros,
          dailyIntake: todayData,
          userGoal: goal,
          targetDate: date
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setDecision(data);
      } else {
        console.warn('AI Decision Error:', data);
        setDecision({ decision: 'no', reason: 'AI analysis failed' });
      }
    } catch (err) {
      console.error(err);
      setDecision({ decision: 'no', reason: 'Network or server error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://95bcc019821b.ngrok-free.app/api/intake/today?email=${userEmail}`);
        const todayData = await res.json();
        setDailyMacros(todayData);

        const { goal, targetDate } = await fetchGoal();
        fetchDecision(todayData, goal, targetDate);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch('https://95bcc019821b.ngrok-free.app/api/intake/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          foodName,
          nutrition: {
            calories: parseFloat(macros.calories) || 0,
            sugar: parseFloat(macros.sugar) || 0,
            protein: parseFloat(macros.protein) || 0,
            fat: parseFloat(macros.fat) || 0,
            carbs: parseFloat(macros.carbs) || 0,
            fiber: parseFloat(macros.fiber) || 0,
            sodium: parseFloat(macros.sodium) || 0
          },
          source
        }),
      });

      if (res.ok) {
        Alert.alert('Saved', 'Food intake saved successfully.');
        navigation.navigate('Home');
      } else {
        throw new Error('Could not save');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleSkip = () => navigation.navigate('Home');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A473A" />
        <Text style={styles.loadingText}>Analyzing...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Nutritional Advisor</Text>
      <Text style={styles.subheading}>Food: {foodName}</Text>
      <Text style={styles.subheading}>Source: {source}</Text>

      <View style={[styles.analysisBox, {
        borderColor: decision?.decision === 'yes' ? '#4CAF50' : '#FF5252',
        backgroundColor: decision?.decision === 'yes' ? '#E8F5E9' : '#FFEBEE'
      }]}>
        <Text style={styles.analysisText}>
          {decision?.decision === 'yes' ? '✅ Recommended' : '❌ Not Recommended'}
        </Text>
        <Text style={styles.reasonText}>{decision?.reason}</Text>
      </View>

      <Text style={styles.section}>This Meal</Text>
      {Object.entries(macros).map(([k, v]) => (
        <Text key={k}>{k.toUpperCase()}: {v}</Text>
      ))}

      <Text style={styles.section}>Total Today (after this meal)</Text>
      {Object.entries(getTotal(dailyMacros, macros)).map(([k, v]) => (
        <Text key={k}>{k.toUpperCase()}: {v}</Text>
      ))}

      <TouchableOpacity style={styles.consumedBtn} onPress={handleSave}>
        <Text style={styles.btnText}>Consumed</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skippedBtn} onPress={handleSkip}>
        <Text style={styles.btnText}>Skipped</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2A473A',
    marginBottom: 10,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 10,
  },
  section: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#2A473A'
  },
  analysisBox: {
    marginVertical: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1
  },
  analysisText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  reasonText: {
    fontSize: 15,
    color: '#333'
  },
  consumedBtn: {
    backgroundColor: '#D6E54B',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20
  },
  skippedBtn: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2A473A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#2A473A'
  }
});
