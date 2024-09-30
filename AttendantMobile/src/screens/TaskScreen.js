import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';

const tasks = [
  { id: '1', title: 'Task 1', date: '2024-09-28', time: '10:00 AM' },
  { id: '2', title: 'Task 2', date: '2024-09-29', time: '12:00 PM' },
];

export default function TaskScreen() {
  const renderTaskItem = ({ item }) => (
    <View style={styles.taskCard}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text>{item.date} at {item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderTaskItem}
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
  taskCard: {
    backgroundColor: '#f4f4f4',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
