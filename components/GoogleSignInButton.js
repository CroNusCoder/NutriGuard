import React, { useEffect } from "react";
import { Button, Alert } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../config/firebase";
import { sendIdTokenToBackend } from "../utils/api";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "1064804006721-9lk4u1e604m1s5pspicdq8jvp498lp73.apps.googleusercontent.com",
    androidClientId: "1064804006721-9lk4u1e604m1s5pspicdq8jvp498lp73.apps.googleusercontent.com",
    iosClientId: "1064804006721-9lk4u1e604m1s5pspicdq8jvp498lp73.apps.googleusercontent.com",
    webClientId: "1064804006721-9lk4u1e604m1s5pspicdq8jvp498lp73.apps.googleusercontent.com",
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    const authenticate = async () => {
      if (response?.type === "success") {
        try {
          const { id_token } = response.authentication;
          if (!id_token) throw new Error("No ID token received");

          // Sign in to Firebase
          const credential = GoogleAuthProvider.credential(id_token);
          const userCred = await signInWithCredential(auth, credential);

          const token = await userCred.user.getIdToken();
          console.log("🔐 Firebase ID Token:", token);

          // Send token to backend
          await sendIdTokenToBackend(token);
          Alert.alert("Success", `Signed in as ${userCred.user.email}`);
        } catch (err) {
          console.error("❌ Authentication error:", err);
          Alert.alert("Error", err.message);
        }
      }
    };

    authenticate();
  }, [response]);

  return (
    <Button
      title="Sign in with Google"
      onPress={() => {
        promptAsync();
      }}
      disabled={!request}
    />
  );
}
