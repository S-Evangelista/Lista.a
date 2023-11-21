import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const Adicionar = ({ route }) => {
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
    <View>
      <Text>{taskText}</Text>
      <FlatList
        data={subitems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            {editingSubitemId === item.id ? (
              <View>
                <TextInput
                  value={editedSubitemText}
                  onChangeText={(text) => setEditedSubitemText(text)}
                />
                <TouchableOpacity onPress={() => editSubitem(item.id, editedSubitemText)}>
                  <Text>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={cancelEditingSubitem}>
                  <Text>Cancelar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text>{item.text}</Text>
                <View>
                  <TouchableOpacity onPress={() => startEditingSubitem(item.id, item.text)}>
                    <Text>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeSubitem(item.id)}>
                    <Text>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      />
      <View>
        <TextInput
          placeholder="Digite um subitem"
          value={subitemText}
          onChangeText={(text) => setSubitemText(text)}
        />
        <TouchableOpacity onPress={addSubitem}>
          <Text>Adicionar Subitem</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Stack = createStackNavigator();

export default Adicionar;
