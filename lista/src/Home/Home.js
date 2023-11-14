import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Home({ navigation }) {
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
      
        return (
          <View >
             <Text>Lista de Tarefas</Text>
            <View>
              <TextInput
                placeholder="Digite uma tarefa"
                value={taskText}
                onChangeText={(text) => setTaskText(text)}
              />
              <TouchableOpacity onPress={addTask}>
                <Text >Adicionar</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={tasks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View >
                  <Text>{item.text}</Text>
                  <View>
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
                    <TouchableOpacity onPress={() => navigation.push('Adicionar')}></TouchableOpacity>
                      <Text> Editar </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removeTask(item.id)}>
                      <Text>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        );
      };

export default Home;


