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

export default Adicionar;

