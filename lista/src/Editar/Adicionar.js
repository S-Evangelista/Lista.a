import  { useState } from 'react';
import {  StyleSheet } from 'react-native';
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
}


return (
    <View >
      <Text >{taskText}</Text>
      <FlatList
        data={subitems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View >
            {editingSubitemId === item.id ? (
              <View >
                <TextInput
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

  
const Stack = createStackNavigator();

});

export default Adicionar;

