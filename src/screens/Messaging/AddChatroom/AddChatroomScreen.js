import React, { useState, useEffect } from 'react'; // , {  useEffect, userReducer, useState, useReducer, }
import { View, Text, Alert } from 'react-native';
import { styles } from './styles';
import { Button } from 'react-native-elements';
import GenericForm from '../../../components/GenericForm';

const formDefinition = {
  fields: [
    {
      name: 'roomName',
      label: 'Chatroom name',
    },
    {
      name: 'users',
      label: 'Users',
    },
  ],
  submitClickCallback: (values) => { Alert.alert(JSON.stringify(values)); },
};

export default function AddChato({ navigation }) {
    const [roomName, setRoomName] = useState('');
    return (
      <View style={styles.rootContainer}>
        <View>
          <Button
            title = "Cancel"
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Create a new chat room</Text>
          <GenericForm formDefinition={formDefinition} styles={styles} />
        </View>
      </View>
    );
  }