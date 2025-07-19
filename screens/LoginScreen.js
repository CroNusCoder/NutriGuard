import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { auth } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { sendIdTokenToBackend } from '../utils/api';
import GoogleSignInButton from '../components/GoogleSignInButton';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginOrRegister = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      if (!userCred.user.emailVerified) {
        await sendEmailVerification(userCred.user);
        Alert.alert("Email not verified", "Verification link sent. Please verify your email before continuing.");
        return;
      }

      const idToken = await userCred.user.getIdToken();
      await sendIdTokenToBackend(idToken);
      navigation.replace("FitnessForm"); // 👈 navigate to home after success

    } catch (signInErr) {
      console.log("Sign in failed:", signInErr.message);
      if (signInErr.code === 'auth/user-not-found') {
        try {
          const newUser = await createUserWithEmailAndPassword(auth, email, password);
          await sendEmailVerification(newUser.user);
          Alert.alert("Account created!", "Please verify your email via the link sent before logging in.");
        } catch (registerErr) {
          Alert.alert("Sign Up Failed", registerErr.message);
        }
      } else {
        Alert.alert("Login Failed", signInErr.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Sign in or create{'\n'}an account</Text>

      <Text style={styles.descriptionText}>
        Your everyday grocery shopping is here!{'\n'}Please enter your credentials to continue.
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
        style={[styles.continueButton, !(email && password) && styles.continueButtonDisabled]}
        onPress={handleLoginOrRegister}
        disabled={!(email && password)}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      <Text style={styles.orContinueText}>or continue with</Text>

      <GoogleSignInButton />

      <Text style={styles.termsText}>
        By continuing you agree to{' '}
        <Text style={styles.linkText} onPress={() => Alert.alert('Terms of Service')}>
          Terms of Service
        </Text>{' '}
        and{' '}
        <Text style={styles.linkText} onPress={() => Alert.alert('Privacy Policy')}>
          Privacy Policy
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
    marginBottom: 40,
  },
  continueButtonDisabled: {
    backgroundColor: '#E6E6E6',
  },
  continueButtonText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#2A473A',
  },
  orContinueText: {
    textAlign: 'center',
    color: '#9A9A9A',
    fontSize: 14,
    marginBottom: 16,
  },
  termsText: {
    fontSize: 12,
    color: '#2A473A',
    textAlign: 'center',
    lineHeight: 16,
  },
  linkText: {
    color: '#2A473A',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
