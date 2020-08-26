/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'; // , {  useEffect, userReducer, useState, useReducer, }
import { View, Text, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { TextInput } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import { styles } from './styles';

// TODO: Refactor this into a new modal screen. Will require new navigation stack.
// Using form from react-hook-form: see https://react-hook-form.com/get-started#ReactNative
export default function AddChatroomScreen({ navigation }) {
  const uid = navigation.getParam('uid', null);
  const { control, handleSubmit, errors } = useForm();

  function createRoom(data) {
    if (data.roomName.length > 0) {
      firestore()
        .collection('chatrooms')
        .add({
          roomName: data.roomName,
          names: ['placeholder3', 'placeholder2'], // TODO: refactor so chatrooms don't require this and instead query user names from database + memoize.
          users: [uid, data.recipientID],
          updatedAt: firestore.FieldValue.serverTimestamp(),
        })
        .then((newChatroomRef) => {
          newChatroomRef
            .collection('messages')
            .add({
              _id: 0,
              text: 'New room created.',
              createdAt: new Date().getTime(),
              system: true,
            });
          navigation.goBack();
        });
    }
  }

  return (
    <View style={styles.rootContainer}>
      <View>
        <Text>Create a new chat room.</Text>
        {/* https://react-hook-form.com/api#Controller */}
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              placeholder="Enter room name..."
            />
          )}
          name="roomName"
          rules={{ required: true }}
          defaultValue=""
        />

        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              placeholder="Enter recipient uid..."
            />
          )}
          name="recipientID"
          rules={{ required: true }}
          defaultValue=""
        />

        <Button title="Create chatroom" onPress={handleSubmit(createRoom)} />
      </View>
    </View>
  );
}

AddChatroomScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
