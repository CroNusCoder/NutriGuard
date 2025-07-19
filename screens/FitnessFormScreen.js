import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { auth } from '../config/firebase';

export default function FitnessFormScreen({ navigation }) {
    const [form, setForm] = useState({
        name: '',
        age: '',
        gender: '',
        height: '',
        currentWeight: '',
        targetWeight: '',
        targetDate: new Date(),
        goal: '',
        activityLevel: '',
        allergies: '',
        medicalConditions: '',
        diagnosis: '',
    });

    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (!form.age || !form.height || !form.currentWeight || !form.targetWeight) {
            Alert.alert('Missing Fields', 'Please fill all required fields');
            return;
        }

        try {
            const res = await fetch('https://95bcc019821b.ngrok-free.app/api/fitness', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: auth.currentUser?.email,
                    formData: form
                }),
            });

            const data = await res.json();
            Alert.alert('Success', 'Fitness profile saved');
            navigation.navigate('TrackYourMeal');
        } catch (err) {
            console.error('Form error:', err);
            Alert.alert('Error', 'Could not save data');
        }
    };

    const renderAgeOptions = () => {
        const ages = [];
        for (let i = 1; i <= 100; i++) {
            ages.push(<Picker.Item key={i} label={`${i}`} value={`${i}`} />);
        }
        return ages;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.titleText}>Tell us about your fitness goal</Text>

            <TextInput style={styles.input} placeholder="Full Name" value={form.name} onChangeText={v => handleChange('name', v)} />

            <Text style={styles.label}>Age</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={form.age}
                    onValueChange={v => handleChange('age', v)}>
                    <Picker.Item label="Select Age" value="" />
                    {renderAgeOptions()}
                </Picker>
            </View>

            <Text style={styles.label}>Gender</Text>
            <View style={styles.radioGroup}>
                {['Male', 'Female', 'Other'].map(g => (
                    <TouchableOpacity
                        key={g}
                        style={styles.radioOption}
                        onPress={() => handleChange('gender', g)}>
                        <View style={styles.radioCircle}>{form.gender === g && <View style={styles.selectedDot} />}</View>
                        <Text>{g}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TextInput style={styles.input} placeholder="Height (cm)" keyboardType="numeric" value={form.height} onChangeText={v => handleChange('height', v)} />
            <TextInput style={styles.input} placeholder="Current Weight (kg)" keyboardType="numeric" value={form.currentWeight} onChangeText={v => handleChange('currentWeight', v)} />
            <TextInput style={styles.input} placeholder="Target Weight (kg)" keyboardType="numeric" value={form.targetWeight} onChangeText={v => handleChange('targetWeight', v)} />

            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                <Text style={styles.datePickerText}>Target Date: {form.targetDate.toDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={form.targetDate}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                        setShowDatePicker(false);
                        if (date) handleChange('targetDate', date);
                    }}
                />
            )}

            <Text style={styles.label}>Goal</Text>
            <View style={styles.radioGroup}>
                {['Lose', 'Gain', 'Maintain'].map(goal => (
                    <TouchableOpacity
                        key={goal}
                        style={styles.radioOption}
                        onPress={() => handleChange('goal', goal)}>
                        <View style={styles.radioCircle}>{form.goal === goal && <View style={styles.selectedDot} />}</View>
                        <Text>{goal}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Activity Level</Text>
            <View style={styles.radioGroup}>
                {['Low', 'Moderate', 'High'].map(level => (
                    <TouchableOpacity
                        key={level}
                        style={styles.radioOption}
                        onPress={() => handleChange('activityLevel', level)}>
                        <View style={styles.radioCircle}>{form.activityLevel === level && <View style={styles.selectedDot} />}</View>
                        <Text>{level}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TextInput style={styles.input} placeholder="Allergies (comma separated)" value={form.allergies} onChangeText={v => handleChange('allergies', v)} />
            <TextInput style={styles.input} placeholder="Medical Conditions" value={form.medicalConditions} onChangeText={v => handleChange('medicalConditions', v)} />
            <TextInput style={styles.input} placeholder="Any diagnosis / notes" value={form.diagnosis} onChangeText={v => handleChange('diagnosis', v)} />

            <TouchableOpacity style={styles.continueButton} onPress={handleSubmit}>
                <Text style={styles.continueButtonText}>Save and Continue</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: '#FFFFFF',
    },
    titleText: {
        fontSize: 26,
        color: '#2A473A',
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'left',
    },
    input: {
        height: 48,
        borderColor: '#D9D9D9',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#2A473A',
        marginBottom: 16,
    },
    datePickerButton: {
        height: 48,
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 12,
        borderColor: '#D9D9D9',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    datePickerText: {
        color: '#2A473A',
        fontSize: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2A473A',
        marginBottom: 6,
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 12,
        borderColor: '#D9D9D9',
        marginBottom: 16,
    },
    radioGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        flexWrap: 'wrap',
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
        marginBottom: 8,
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#2A473A',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    selectedDot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#2A473A',
    },
    continueButton: {
        height: 48,
        backgroundColor: '#D6E54B',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    continueButtonText: {
        fontWeight: '700',
        fontSize: 16,
        color: '#2A473A',
    },
});
