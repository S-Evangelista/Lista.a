import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
function Home({ navigation }) {
  const [tarefas, setTarefas] = useState([]);
  const [textoTarefa, setTextoTarefa] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const tarefasArmazenadas = await AsyncStorage.getItem('tarefas');
    setTarefas(tarefasArmazenadas ? JSON.parse(tarefasArmazenadas) : []);
  };

  const salvarDados = async (dados) => {
    await AsyncStorage.setItem('tarefas', JSON.stringify(dados));
  };

  const adicionarTarefa = () => {
    if (textoTarefa.trim() !== '') {
      const novaTarefa = { id: tarefas.length.toString(), texto: textoTarefa, subitens: [] };
      setTarefas([...tarefas, novaTarefa]);
      setTextoTarefa('');
      salvarDados([...tarefas, novaTarefa]);
    }
  };

  const removerTarefa = (idTarefa) => {
    const tarefasAtualizadas = tarefas.filter((item) => item.id !== idTarefa);
    setTarefas(tarefasAtualizadas);
    salvarDados(tarefasAtualizadas);
  };

  return (
    <View>
      <Text>Lista de Tarefas</Text>
      <View>
        <TextInput
          placeholder="Digite uma tarefa"
          value={textoTarefa}
          onChangeText={(texto) => setTextoTarefa(texto)}
        />
        <TouchableOpacity onPress={adicionarTarefa}>
          <Text>Adicionar</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.texto}</Text>
            <View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Adicionar', {
                    idTarefa: item.id,
                    textoTarefa: item.texto,
                    subitens: item.subitens,
                    setSubitens: (subitensAtualizados) => {
                      const tarefasAtualizadas = tarefas.map((t) =>
                        t.id === item.id ? { ...t, subitens: subitensAtualizados } : t
                      );
                      setTarefas(tarefasAtualizadas);
                      salvarDados(tarefasAtualizadas);
                    },
                  })
                }>
                <TouchableOpacity onPress={() => navigation.push('Adicionar')}></TouchableOpacity>
                <Text> Editar </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removerTarefa(item.id)}>
                <Text>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

export default Home;



