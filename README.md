# NutriGuard 🍽️📱

**NutriGuard** is a mobile application built with **React Native (Expo)** that empowers users to make informed dietary decisions by scanning packaged food barcodes and retrieving **detailed nutrition information**. Designed for health-conscious individuals, the app provides real-time insights into calorie, sugar, sodium, and fat content — along with customizable warning settings.

---

## 🧠 Purpose & Goals

**Purpose**:  
To provide an intuitive, efficient tool for scanning barcodes and viewing nutrition facts, with alerts for high sugar or sodium based on user preferences.

**Goals**:
- Deliver accurate, serving-size-normalized nutrition data.
- Offer a customizable experience with persistent user settings.
- Ensure responsive, accessible design for all devices.
- Prepare for eventual release on Google Play and Apple App Store.

---

## 🏗️ Architecture & Technology Stack

| Layer              | Technology / Library                                  |
|-------------------|--------------------------------------------------------|
| Framework          | [Expo](https://expo.dev/) (React Native)              |
| Navigation         | React Navigation (Stack Navigator)                    |
| API Integration    | [Open Food Facts API](https://world.openfoodfacts.org/api/v0/product/{barcode}.json) |
| Data Storage       | AsyncStorage (for user preferences)                   |
| UI Components      | React Native core + `@expo/vector-icons`, SVG         |
| Version Control    | Git (hosted on [GitHub](https://github.com/CroNusCoder/NutriGuard)) |

---

## ✨ Key Features

### 🔹 Welcome Screen
- Entry point with custom SVG graphics.
- Motivational message: **"Know What You Eat!!"**
- Two buttons: **Scan Now!** and ⚙️ **Settings**
- Fully accessible and responsive.

### 🔹 Scanner Screen
- Uses device camera to scan barcodes.
- Passes scanned data to NutritionScreen.

### 🔹 Nutrition Screen
- Fetches nutrition data from Open Food Facts API.
- Displays: calories, sugar, sodium, protein, fiber, trans fat, saturated fat.
- Normalizes values to per-serving size.
- Highlights high sugar (>10g/100g) or sodium (based on user settings).
- Displays warning/suggestions.
- Built-in accessibility and mobile responsiveness.

### 🔹 Settings Screen
- Toggle warning preferences: **High Sugar** & **High Sodium**
- Persists preferences via `AsyncStorage`
- Custom checkbox UI with color indicators
- Save confirmation via alert

### 🔹 Privacy Policy
- Scrollable document outlining app's handling of camera, storage, and data.
- Accessible with future plans to host it online.

---

## 🧪 Development Process & Challenges

| Task / Feature            | Notes                                                                 |
|--------------------------|-----------------------------------------------------------------------|
| Nutrition normalization   | Handled serving size mismatch using per-100g API data                |
| API reliability           | Safeguarded against missing data fields (fallbacks like `"N/A"`)     |
| UI/UX polish              | Added responsive styling, contrast, and screen reader support         |
| Git issues                | Resolved push rejections via `git pull`                              |

---

## 🚦 Current Status

| Area                 | Status                          |
|----------------------|----------------------------------|
| Barcode → Nutrition  | ✅ Working with live API         |
| Settings Persistence | ✅ Functional with AsyncStorage |
| UI Polish            | ✅ ScrollView, custom components |
| Accessibility        | ✅ Implemented                   |
| Store Ready?         | ⚠️ Not yet (see below)           |

### ⚠️ To Do Before Public Release
- Add app icon and splash screen
- Connect warning toggles to `NutritionScreen` dynamically
- Host privacy policy online
- Configure `app.json` for builds
- Cross-device testing

---

## 🚀 Future Enhancements

- 🔄 Integrate user preferences with `NutritionScreen`
- 📊 Add scan history and dietary trend tracking
- 🎨 Support dark mode & high-contrast themes
- 🧠 Personalized food suggestions based on goals
- 🔧 Refactor for performance with `react-native-reanimated`
- 🌐 Multi-language support

---

## 🛠️ How to Contribute / Help

**Ways you can help:**
- Suggest better nutrition warnings or threshold logic
- Review code for performance or accessibility improvements
- Help connect Firestore for saving scan history
- Guide Expo build + Play Store/App Store submission
- Star ⭐ the repo on GitHub: [CroNusCoder/NutriGuard](https://github.com/CroNusCoder/NutriGuard)

---

## 📸 Screenshots (Coming Soon)

_Add screenshots of WelcomeScreen, ScannerScreen, NutritionScreen, and SettingsScreen here._

---

## 📃 License

MIT © 2025 [CroNusCoder](https://github.com/CroNusCoder)

---

_This project was built with ❤️ to promote mindful eating and health awareness using the power of open data and mobile technology._
