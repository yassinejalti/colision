import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, Button } from "react-native";
import { useLayoutEffect } from 'react';
import { useNavigation  } from "@react-navigation/native";
import { useWebSocket } from '../contexts/webSocketContext';

// store
import { useSelector } from 'react-redux';

function MiniUser({ user,id }:any) {
    const navigation = useNavigation<any>();
    let isDisabled;
    if(user.self){
        isDisabled = true;
    }else{
        isDisabled = false;
    }

    const openChat = (user:any,id:string) => {
        navigation.navigate('Chat', {
            internal_client_ID:id,
            name:user.name,
            age:user.age,
            gender:user.gender,
            description:user.description,
        });
    }

    return (
        <TouchableOpacity 
            style={[styles.container, isDisabled ? styles.self : null]}
            disabled={isDisabled}
            onPress={() => {
                if (!isDisabled) {
                    openChat(user,id);
                }
            }}
        >
            <Image 
                source={user.gender === 'male' ? require('../assets/img/male-user.png') : require('../assets/img/female-user.png')} 
                style={styles.image} 
            />
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.age}>{user.age} years old</Text>
                <Text style={styles.description}>{user.description}</Text>
            </View>
            {isDisabled ? 
                <TouchableOpacity>
                    <Image source={require('../assets/img/settings.png')} style={styles.online} />
                </TouchableOpacity>
                : <Image source={require('../assets/img/online.png')} style={styles.online} />}
        </TouchableOpacity>
    );
};
 
export default function Users() {
    const navigation = useNavigation<any>();
    const { ws } = useWebSocket();
    let currentState = useSelector((state:any)=>state.general);
    currentState = JSON.stringify(currentState);
    currentState = JSON.parse(currentState);
    
    const logout = () => {
        Alert.alert(
            'Your account will be deleted',
            'Are you sure you want to continue?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Continue',
                    onPress: () => {
                        ws.close();
                        navigation.navigate('Register');
                    },
                    style: 'default',
                },
            ],
            { cancelable: false }
        );
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => false,
            headerRight: () => (
                <TouchableOpacity
                    onPress={logout}
                    style={styles.logoutButton}
                >
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <ScrollView>
        <View style={{ padding: 10 }}>
            <MiniUser key={-1} user={{ ...(currentState.general).client, self: true }} />
            {((currentState.general).conversations.length === 0) ? (
            <Text style={{ textAlign: 'center', color: 'gray', marginTop: 5 }}>No messages yet</Text>
            ) : (
            (currentState.general).conversations.map((conversation: any, index: Number) => (
                <MiniUser key={index} user={conversation.client} id={conversation.internal_client_ID} />
            ))
            )}
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    age: {
        fontSize: 14,
        color: '#555',
    },
    description: {
        fontSize: 12,
        color: '#777',
    },
    online: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    self: {
        backgroundColor: '#F0FFF0',
    },
    logoutButton: {
        paddingHorizontal: 10,
        paddingVertical:5,
        backgroundColor: '#FF3B30',
        borderRadius: 5,
        marginRight: 10,
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});
