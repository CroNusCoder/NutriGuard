import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";

// Get device width and height for responsive styling
const { width, height } = Dimensions.get("window");

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9c7d0" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>CSHARK</Text>
      </View>

      {/* Floating black spheres container */}
      <View style={styles.bubblesContainer}>
        {/* Multiple black spheres as overlapping circles */}
        {[...Array(9).keys()].map((i) => {
          // generate different sizes and positions for spheres
          const size = 50 + Math.random() * 100;
          const top = Math.random() * (height * 0.3);
          const left = Math.random() * (width * 0.85);
          return (
            <View
              key={i}
              style={[
                styles.bubble,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  top,
                  left,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          BUY, SELL,{"\n"}HOLD & EARN{"\n"}CRYPTO
        </Text>
        <Text style={styles.subtitle}>
          CSHARK IS A UNIVERSAL PLATFORM FOR TRADING DIGITAL ASSETS, SUPPORTING
          MORE THAN 500 CRYPTOCURRENCY
        </Text>
      </View>

      {/* Get Started Button */}
      <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => navigation.navigate('Scanner')}>
        <Text style={styles.buttonText}>Start Scanning!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9c7d0", // Pink background (#f9c7d0 approximated)
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  header: {
    paddingTop: 10,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 1,
  },
  bubblesContainer: {
    position: "absolute",
    top: 70,
    left: 20,
    width: width * 0.9,
    height: height * 0.35,
    overflow: "visible",
  },
  bubble: {
    position: "absolute",
    backgroundColor: "#222", // Dark black spheres color
    opacity: 0.9,
    // shadow to create slight 3D effect:
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  textContainer: {
    marginTop: height * 0.4,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 0.8,
    lineHeight: 44,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: "#000",
    opacity: 0.8,
    lineHeight: 16,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#000",
    letterSpacing: 1,
  },
});

