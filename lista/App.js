import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
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

const SubitemsScreen = ({ route }) => {
  const { taskId, taskText, subitems, setSubitems } = route.params;
  const [subitemText, setSubitemText] = useState('');
  const [editingSubitemId, setEditingSubitemId] = useState(null);
  const [editedSubitemText, setEditedSubitemText] = useState('');

  const addSubitem = () => {
    if (subitemText.trim() !== '') {
      const newSubitem = { id: subitems.length.toString(), text: subitemText };
      setSubitems([...subitems, newSubitem]);
      setSubitemText('');
    }
  };

  const removeSubitem = (subitemId) => {
    const updatedSubitems = subitems.filter((item) => item.id !== subitemId);
    setSubitems(updatedSubitems);
  };

  const editSubitem = (subitemId, newText) => {
    const updatedSubitems = subitems.map((item) =>
      item.id === subitemId ? { ...item, text: newText } : item
    );
    setSubitems(updatedSubitems);
    setEditingSubitemId(null);
  };

  const startEditingSubitem = (subitemId, currentText) => {
    setEditingSubitemId(subitemId);
    setEditedSubitemText(currentText);
  };

  const cancelEditingSubitem = () => {
    setEditingSubitemId(null);
    setEditedSubitemText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{taskText}</Text>
      <FlatList
        data={subitems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.subitemContainer}>
            {editingSubitemId === item.id ? (
              <View style={styles.editingContainer}>
                <TextInput
                  style={styles.editingInput}
                  value={editedSubitemText}
                  onChangeText={(text) => setEditedSubitemText(text)}
                />
                <TouchableOpacity
                  style={styles.editingButton}
                  onPress={() => editSubitem(item.id, editedSubitemText)}
                >
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.editingButton}
                  onPress={cancelEditingSubitem}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.subitemTextContainer}>
                <Text>{item.text}</Text>
                <View style={styles.subitemButtonContainer}>
                  <TouchableOpacity onPress={() => startEditingSubitem(item.id, item.text)}>
                    <Text style={styles.editButton}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeSubitem(item.id)}>
                    <Text style={styles.deleteButton}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite um subitem"
          value={subitemText}
          onChangeText={(text) => setSubitemText(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addSubitem}>
          <Text style={styles.buttonText}>Adicionar Subitem</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Listas" component={HomeScreen} />
        <Stack.Screen name="Itens" component={SubitemsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

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

export default App;


