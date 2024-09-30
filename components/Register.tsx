import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Alert } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Picker } from '@react-native-picker/picker';

// websocket context
import { useWebSocket } from '../contexts/webSocketContext';

// store
import { useSelector } from 'react-redux';


export default function Register() {
    const navigation = useNavigation<any>();
    
    // inputs
    const [name, setName] = useState('');
    const [age, setAge] = useState(18);
    const [gender, setGender] = useState('male');
    const [description, setDescription] = useState('');

    // connection
    const { ws } = useWebSocket();
    let currentState = useSelector((state:any)=>state.general).general;

    // it's important to do this switch to avoid redux problems
    currentState = JSON.stringify(currentState);
    currentState = JSON.parse(currentState);

    const handleRegister = () => {
        if (name === '') {
            Alert.alert('Empty Field', 'Name is required', [{ text: 'I understand' }]);
            return;
        }
        const client = {name:name, age:age, gender:gender, description:description};
        currentState.client = client;
        currentState.connected = true;

        ws.send(JSON.stringify(currentState));
        navigation.navigate('Users');
    };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/img/chat.png')} style={styles.header} />
            <TextInput 
                style={styles.input} 
                placeholder="Name" 
                value={name} 
                onChangeText={setName} 
            />
            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Age</Text>
                <Picker
                    selectedValue={age}
                    style={styles.picker}
                    onValueChange={(itemValue) => setAge(itemValue)}
                >
                {Array.from({ length: 83 }, (_, i) => i + 18).map(age => (
                    <Picker.Item key={age} label={age.toString()} value={age.toString()} />
                ))}
                </Picker>
            </View>
            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Gender</Text>
                <Picker
                    selectedValue={gender}
                    style={styles.picker}
                    onValueChange={(itemValue) => setGender(itemValue)}
                >
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                </Picker>
            </View>
            <TextInput 
                style={styles.input} 
                placeholder="Description (optional)" 
                value={description} 
                onChangeText={setDescription} 
                maxLength={40}
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#FFFFFF',
    },
    header: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        padding: 10,
        marginBottom: 15,
        borderBottomColor: '#001F3F',
        borderBottomWidth: 1,
    },
    pickerContainer: {
        width: '100%',
        display:'flex',
        flexDirection:"row",
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#001F3F',
        borderBottomWidth: 1,
    },
    picker: {
        height: 16,
        width: '70%',
        borderRadius:10,
    },
    label: {
        fontSize: 16,
        width: '30%',
        color: '#001F3F',
    },
    button: {
        width: '100%',
        height: 40,
        backgroundColor: '#001F3F',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 30,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});