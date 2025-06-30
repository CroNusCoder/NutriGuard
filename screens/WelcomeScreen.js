import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform } from 'react-native';
import Svg, { Rect, Circle, Line } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen({ navigation }) {
  const windowWidth = Dimensions.get('window').width;
  const svgSize = windowWidth > 400 ? 200 : windowWidth * 0.9;

  return (
    <View style={styles.container}>
      <View style={styles.svgWrapper}>
        <Svg height={svgSize} width={svgSize} viewBox="0 0 200 200" accessibilityLabel="Welcome Graphic">
          <Rect x="10" y="10" width="180" height="180" stroke="white" strokeWidth="1" fill="none" />
          <Circle cx="100" cy="60" r="50" stroke="white" strokeWidth="1" fill="none" />
          <Circle cx="100" cy="140" r="50" stroke="white" strokeWidth="1" fill="none" />
          <Line x1="10" y1="10" x2="190" y2="190" stroke="white" strokeWidth="1" />
          <Line x1="10" y1="70" x2="190" y2="70" stroke="white" strokeWidth="1" />
          <Line x1="100" y1="10" x2="100" y2="190" stroke="white" strokeWidth="1" />
        </Svg>
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.text} accessibilityRole="header">Know What You Eat!!</Text>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Scanner')}
          accessibilityLabel="Start Scanning Button"
          accessibilityRole="button"
        >
          <Text style={styles.startButtonText}>Scan Now!</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
          accessibilityLabel="Settings Button"
          accessibilityRole="button"
        >
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4c9aff',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  svgWrapper: {
    flex: 4,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  startButton: {
    flex: 1,
    backgroundColor: 'black',
    borderRadius: 25,
    paddingVertical: 12,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  settingsButton: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});