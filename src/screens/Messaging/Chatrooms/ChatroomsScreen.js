import React, { useState, useEffect } from 'react'; // , {  useEffect, userReducer, useState, useReducer, }
import {
  SafeAreaView, FlatList, View, Alert, ActivityIndicator,
} from 'react-native';
import { Button } from 'react-native-elements';
// import Auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import { styles } from './styles';

// https://googleapis.dev/nodejs/firestore/latest/CollectionReference.html#doc
// https://googleapis.dev/nodejs/firestore/latest/Query.html
// https://googleapis.dev/nodejs/firestore/latest/DocumentReference.html#get
// Collection reference -> where() -> Query -> get() -> QuerySnapshot
// QuerySnapshot.forEach() -> QueryDocumentSnapshot for each queried document
// QueryDocumentSnapshot -> data() -> document data (guaranteed to be nonempty)
// QueryDocumentSnapshot -> .ref -> Document reference -> collection() -> sub- Collection reference
export default function ChatroomsScreen({ navigation }) {
  const uid = navigation.getParam('uid', null);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('Mounted. Subscribing to chatrooms...');
    // build chats - list of tuples of chatrooms with (recipients, updatedAt, messages)
    // |- recipients is a map of userid: displayname
    const unsubscribe = firestore()
      .collection('chatrooms')
      .where('users', 'array-contains', uid)
      .orderBy('updatedAt', 'desc')
      .onSnapshot(
        (querySnapshot) => {
          setChats([]); // reset chats before updating
          querySnapshot.forEach((doc) => {
            const users = doc.data().names;
            delete users[uid]; // exclude own name
            // eslint-disable-next-line no-shadow
            setChats((chats) => [
              ...chats,
              // append next chatroom to chat state
              {
                recipients: users,
                updatedAt: doc.data().updatedAt,
                messages: doc.ref.collection('messages'),
              },
            ]);
          });
          if (isLoading) {
            setIsLoading(false);
          }
          return () => unsubscribe();
        },
        (e) => {
          setIsLoading(false);
          Alert.alert(e.message);
        },
      );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // subscribe on mount

  // TODO: add search button
  // TODO: look into rare timestamp race condition   // https://medium.com/firebase-developers/the-secrets-of-firestore-fieldvalue-servertimestamp-revealed-29dd7a38a82b
  if (isLoading) {
    return (
      <SafeAreaView>
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView>
      <Button
        title="Create chatroom"
        onPress={() => {
          navigation.navigate('AddChatroom', { uid });
        }}
      />
      <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: 1,
        }}
      />
      <View style={styles.messagesContainer}>
        <FlatList
          data={chats}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            // TODO: Style chat select with Touch components
            const membernames = Object.values(item.recipients).join(', ');
            return (
              <View>
                <Button
                  title={`${index.toString()} ${membernames}`}
                  onPress={() => {
                    navigation.navigate('Messages',
                      {
                        uid,
                        members: item.recipients,
                        membernames,
                        messageCollection: item.messages,
                      });
                  }}
                />
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

ChatroomsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};

// Component tree:
// Messages Screen - fetches and subscribes to new chats
// L ChatScreen - useReducer dispatcher for messages to new chat. Need state for new chat.
//   L Chatbox component - send message. updates firebase
//   L Message component - displays text, conditional style, onhover/press.
// navigation.getparam uid
