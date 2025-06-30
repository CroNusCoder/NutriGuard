import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen({ navigation }) {
  const [warnSugar, setWarnSugar] = useState(true);
  const [warnSodium, setWarnSodium] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const sugar = await AsyncStorage.getItem('warnSugar');
        const sodium = await AsyncStorage.getItem('warnSodium');
        if (sugar !== null) setWarnSugar(sugar === 'true');
        if (sodium !== null) setWarnSodium(sodium === 'true');
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    loadSettings();
  }, []);

  const toggleSugar = () => setWarnSugar(prev => !prev);
  const toggleSodium = () => setWarnSodium(prev => !prev);

  const onSave = async () => {
    try {
      await AsyncStorage.setItem('warnSugar', warnSugar.toString());
      await AsyncStorage.setItem('warnSodium', warnSodium.toString());
      Alert.alert('Settings Saved', `Warn on High Sugar: ${warnSugar ? 'Yes' : 'No'}\nWarn on High Sodium: ${warnSodium ? 'Yes' : 'No'}`);
    } catch (error) {
      console.error('Failed to save settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">Settings</Text>

      <TouchableOpacity
        style={[styles.option, warnSugar && styles.optionActive]}
        onPress={toggleSugar}
        activeOpacity={0.7}
        accessibilityLabel={`Warn on High Sugar ${warnSugar ? 'On' : 'Off'}`}
        accessibilityRole="button"
      >
        <Text style={styles.optionText}>Warn on High Sugar</Text>
        <View style={[styles.checkbox, warnSugar && styles.checkboxChecked]}>
          {warnSugar && <View style={styles.innerCircle} />}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, warnSodium && styles.optionActive]}
        onPress={toggleSodium}
        activeOpacity={0.7}
        accessibilityLabel={`Warn on High Sodium ${warnSodium ? 'On' : 'Off'}`}
        accessibilityRole="button"
      >
        <Text style={styles.optionText}>Warn on High Sodium</Text>
        <View style={[styles.checkbox, warnSodium && styles.checkboxChecked]}>
          {warnSodium && <View style={styles.innerCircle} />}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={onSave}
        activeOpacity={0.7}
        accessibilityLabel="Save Settings Button"
        accessibilityRole="button"
      >
        <Text style={styles.saveButtonText}>SAVE</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Welcome')}
        activeOpacity={0.7}
        accessibilityLabel="Back to Welcome Button"
        accessibilityRole="button"
      >
        <Text style={styles.backButtonText}>Back to Welcome</Text>
      </TouchableOpacity>
    </View>
  );
}

const BORDER_COLOR = '#444';

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    marginHorizontal: 20,
    padding: 15,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: BORDER_COLOR,
    backgroundColor: '#fff',
    width: 320,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 30,
    borderBottomWidth: 2,
    borderColor: BORDER_COLOR,
    paddingBottom: 8,
    color: '#222',
    fontFamily: 'Courier',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 18,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  optionActive: {
    backgroundColor: '#B3D9B3',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Courier',
  },
  checkbox: {
    height: 26,
    width: 26,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: BORDER_COLOR,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#216D21',
    borderColor: '#216D21',
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: '#3A6ED8',
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#14276B',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Courier',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: BORDER_COLOR,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
    fontFamily: 'Courier',
  },
});