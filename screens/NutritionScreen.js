import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

export default function NutritionScreen({ route, navigation }) {
  const { barcodeData } = route.params || { barcodeData: 'No data' };
  const [nutrition, setNutrition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcodeData}.json`);
        const product = response.data.product;
        if (product) {
          const servingSize = product.serving_size || '100g';
          const nutriments = product.nutriments || {};

          let servingSizeGrams = parseFloat(servingSize) || 100;
          if (servingSize.includes('g')) servingSizeGrams = parseFloat(servingSize);

          let calories = 'N/A kcal';
          if (nutriments.energy_value) {
            const energyValue = parseFloat(nutriments.energy_value);
            const energyUnit = nutriments.energy_value_unit || 'kJ';
            if (energyUnit.toLowerCase() === 'kj') {
              calories = `${(energyValue * 0.239).toFixed(0)} kcal`;
            } else if (energyUnit.toLowerCase() === 'kcal') {
              calories = `${energyValue} kcal`;
            }
            if (servingSizeGrams !== 100 && nutriments.energy_value_unit === undefined) {
              calories = `${((energyValue * servingSizeGrams) / 100).toFixed(0)} kcal`;
            }
          }

          const normalizeValue = (value, unit) => {
            if (value && !isNaN(parseFloat(value))) {
              const baseValue = parseFloat(value);
              if (servingSizeGrams !== 100) {
                return `${((baseValue * servingSizeGrams) / 100).toFixed(1)}${unit}`;
              }
              return `${baseValue}${unit}`;
            }
            return `N/A ${unit}`;
          };

          const sugar = normalizeValue(nutriments.sugars, 'g');
          const sodium = normalizeValue(nutriments.sodium, 'g');
          const fiber = normalizeValue(nutriments.fiber, 'g');
          const protein = normalizeValue(nutriments.proteins, 'g');
          const transFat = normalizeValue(nutriments['trans-fat'], 'g');
          const saturatedFat = normalizeValue(nutriments['saturated-fat'], 'g');

          const sugarValue = parseFloat(sugar) || 0;
          const inconsistencyNote = sugarValue > servingSizeGrams ? ' (Note: Sugar may be per 100g)' : '';

          setNutrition({
            name: product.product_name || 'Unknown Food',
            servingSize: servingSize,
            calories: calories,
            sugar: `${sugar}${inconsistencyNote}`,
            sodium: sodium,
            fiber: fiber,
            protein: protein,
            transFat: transFat,
            saturatedFat: saturatedFat,
            warning: nutriments.sugars_content > 10 ? 'High Sugar' : '',
            suggestion: nutriments.sugars_content > 10 ? 'Try oats with no added sugar' : '',
          });
        } else {
          setNutrition({
            name: 'No Data Found',
            servingSize: 'N/A',
            calories: 'N/A kcal',
            sugar: 'N/A g',
            sodium: 'N/A g',
            fiber: 'N/A g',
            protein: 'N/A g',
            transFat: 'N/A g',
            saturatedFat: 'N/A g',
            warning: '',
            suggestion: '',
          });
        }
      } catch (err) {
        setError('Failed to fetch nutrition data');
      } finally {
        setLoading(false);
      }
    };

    fetchNutrition();
  }, [barcodeData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="tomato" accessibilityLabel="Loading Nutrition Data" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Back to Scanner" onPress={() => navigation.navigate('Scanner')} color="tomato" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title} accessibilityRole="header">{nutrition.name}</Text>
      <Text style={styles.servingText}>Serving Size: {nutrition.servingSize}</Text>
      <Text style={styles.barcodeText}>Barcode: {barcodeData}</Text>

      <View style={styles.dataRow}>
        <View style={[styles.dataBox, styles.calories]}>
          <Text style={styles.dataLabel}>Calories</Text>
          <Text style={styles.dataValue}>{nutrition.calories}</Text>
        </View>
        <View style={[styles.dataBox, styles.sugar]}>
          <Text style={styles.dataLabel}>Sugar</Text>
          <Text style={styles.dataValue}>{nutrition.sugar}</Text>
        </View>
        <View style={[styles.dataBox, styles.protein]}>
          <Text style={styles.dataLabel}>Protein</Text>
          <Text style={styles.dataValue}>{nutrition.protein}</Text>
        </View>
      </View>

      <View style={styles.dataRow}>
        <View style={[styles.dataBox, styles.sodium]}>
          <Text style={styles.dataLabel}>Sodium</Text>
          <Text style={styles.dataValue}>{nutrition.sodium}</Text>
        </View>
        <View style={[styles.dataBox, styles.saturatedFat]}>
          <Text style={styles.dataLabel}>Sat. Fat</Text>
          <Text style={styles.dataValue}>{nutrition.saturatedFat}</Text>
        </View>
        <View style={[styles.dataBox, styles.transFat]}>
          <Text style={styles.dataLabel}>Trans Fat</Text>
          <Text style={styles.dataValue}>{nutrition.transFat}</Text>
        </View>
      </View>

      <View style={[styles.dataBox, styles.fiber]}>
        <Text style={styles.dataLabel}>Fiber</Text>
        <Text style={styles.dataValue}>{nutrition.fiber}</Text>
      </View>

      {nutrition.warning && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText} accessibilityRole="alert">{nutrition.warning}</Text>
        </View>
      )}

      {nutrition.suggestion && (
        <Text style={styles.suggestion}>{nutrition.suggestion}</Text>
      )}
      <Button
        title="Back to Scanner"
        onPress={() => navigation.navigate('Scanner')}
        color="tomato"
        accessibilityLabel="Back to Scanner Button"
      />
    </ScrollView>
  );
}

const windowWidth = Dimensions.get('window').width - 40;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    backgroundColor: '#fff',
  },
  content: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: '#333',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
  servingText: {
    fontSize: 14,
    marginBottom: 10,
    color: '#777',
    textAlign: 'center',
  },
  barcodeText: {
    fontSize: 14,
    marginBottom: 20,
    color: '#777',
    textAlign: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dataBox: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minWidth: windowWidth / 3 - 20,
    marginBottom: 5,
  },
  dataLabel: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  dataValue: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  calories: { backgroundColor: '#b6d7a8', borderColor: '#6aa84f', borderWidth: 1 },
  sugar: { backgroundColor: '#fff2cc', borderColor: '#b8860b', borderWidth: 1 },
  protein: { backgroundColor: '#c9daf8', borderColor: '#4a90e2', borderWidth: 1 },
  sodium: { backgroundColor: '#d9d2e9', borderColor: '#6a5acd', borderWidth: 1 },
  saturatedFat: { backgroundColor: '#f4cccc', borderColor: '#cc0000', borderWidth: 1 },
  transFat: { backgroundColor: '#ead1dc', borderColor: '#993366', borderWidth: 1 },
  fiber: { backgroundColor: '#f9f0e6', borderColor: '#c6a87c', borderWidth: 1, alignSelf: 'flex-start' },
  warningBox: {
    backgroundColor: '#e25822',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 6,
    alignItems: 'center',
  },
  warningText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  suggestion: {
    fontSize: 16,
    color: '#357ABD',
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#e25822',
    textAlign: 'center',
    marginBottom: 20,
  },
});