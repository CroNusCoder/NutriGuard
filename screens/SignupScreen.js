import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    let interval;

    if (isVerificationSent) {
      interval = setInterval(async () => {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          clearInterval(interval);
          const token = await auth.currentUser.getIdToken();
          try {
            const res = await fetch("https://95bcc019821b.ngrok-free.app/api/auth/firebase", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken: token }),
            });

            const data = await res.json();

            if (res.ok) {
              Alert.alert("Verified", "Account created successfully!");
              navigation.replace("LoginScreen"); // 🔁 or navigate("HomeScreen") if user is logged in directly
            } else {
              Alert.alert("Error", data.error || "Failed to save user in DB");
            }
          } catch (err) {
            console.error("Backend error:", err);
            Alert.alert("Error", "Could not contact server");
          }
        }
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [isVerificationSent]);

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter email and password");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCred.user);
      setIsVerificationSent(true);
      Alert.alert("Verify Email", "Verification mail sent. Please check your inbox/spam.");
    } catch (err) {
      console.error("Signup error:", err);
      Alert.alert("Error", err.message || "Signup failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Create your{'\n'}account</Text>

      <Text style={styles.descriptionText}>
        Sign up with your email to get started with your grocery experience.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor="#C4C4C4"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#C4C4C4"
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.continueButton, (!email || !password) && styles.continueButtonDisabled]}
        onPress={handleSignup}
        disabled={!email || !password}
      >
        <Text style={styles.continueButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.termsText}>
        Already a user?{' '}
        <Text style={styles.linkText} onPress={() => navigation.navigate("Login")}>
          Login
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
  },
  titleText: {
    fontSize: 28,
    color: '#2A473A',
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'left',
    lineHeight: 34,
  },
  descriptionText: {
    fontSize: 14,
    color: '#9A9A9A',
    lineHeight: 20,
    marginBottom: 24,
  },
  input: {
    height: 48,
    borderColor: '#D9D9D9',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2A473A',
    marginBottom: 20,
  },
  continueButton: {
    height: 48,
    backgroundColor: '#D6E54B',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonDisabled: {
    backgroundColor: '#E6E6E6',
  },
  continueButtonText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#2A473A',
  },
  verifyButton: {
    height: 44,
    borderColor: '#2A473A',
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  verifyButtonText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#2A473A',
  },
  alreadyUserText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#2A473A',
    textDecorationLine: 'underline',
  },
});
