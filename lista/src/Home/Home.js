import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const storedTasks = await AsyncStorage.getItem('tasks');
    setTasks(storedTasks ? JSON.parse(storedTasks) : []);
  };

  const saveData = async (data) => {
    await AsyncStorage.setItem('tasks', JSON.stringify(data));
  };

  const addTask = () => {
    if (taskText.trim() !== '') {
      const newTask = { id: tasks.length.toString(), text: taskText, subitems: [] };
      setTasks([...tasks, newTask]);
      setTaskText('');
      saveData([...tasks, newTask]);
    }
  };

  const removeTask = (taskId) => {
    const updatedTasks = tasks.filter((item) => item.id !== taskId);
    setTasks(updatedTasks);
    saveData(updatedTasks);
  };

  const editTask = (taskId, newText) => {
    const updatedTasks = tasks.map((item) =>
      item.id === taskId ? { ...item, text: newText } : item
    );
    setTasks(updatedTasks);
    saveData(updatedTasks);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Tarefas</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma tarefa"
          value={taskText}
          onChangeText={(text) => setTaskText(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text>{item.text}</Text>
            <View style={styles.taskButtonContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Subitems', {
                taskId: item.id,
                taskText: item.text,
                subitems: item.subitems,
                setSubitems: (updatedSubitems) => {
                  const updatedTasks = tasks.map((t) =>
                    t.id === item.id ? { ...t, subitems: updatedSubitems } : t
                  );
                  setTasks(updatedTasks);
                  saveData(updatedTasks);
                },
              })}>
                <Text style={styles.editButton}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeTask(item.id)}>
                <Text style={styles.deleteButton}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const Stack = createStackNavigator();


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  taskItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  taskButtonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  editButton: {
    color: 'blue',
    marginRight: 10,
  },
  deleteButton: {
    color: 'red',
  },
  subitemContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  subitemTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subitemButtonContainer: {
    flexDirection: 'row',
  },
  editingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editingInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  editingButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;


