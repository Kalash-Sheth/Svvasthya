import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

// Example earnings data
const earningsData = [
  { id: '1', date: '2024-09-01', amount: '$50' },
  { id: '2', date: '2024-09-15', amount: '$75' },
  { id: '3', date: '2024-09-20', amount: '$60' },
];

export default function EarningsScreen() {
  const renderEarningItem = ({ item }) => (
    <View style={styles.earningCard}>
      <Text style={styles.earningDate}>{item.date}</Text>
      <Text style={styles.earningAmount}>{item.amount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total Earnings: $185</Text>
      <FlatList
        data={earningsData}
        keyExtractor={item => item.id}
        renderItem={renderEarningItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  earningCard: {
    backgroundColor: '#f4f4f4',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
  },
  earningDate: {
    fontSize: 16,
  },
  earningAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
