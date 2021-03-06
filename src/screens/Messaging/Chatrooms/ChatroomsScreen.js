import React, { useState, useEffect } from 'react'; // , {  useEffect, userReducer, useState, useReducer, }
import {
  SafeAreaView, FlatList, View, Alert, ActivityIndicator,
} from 'react-native';
import { Button } from 'react-native-elements';
// import Auth from '@react-native-firebase/auth';
import Firestore from '@react-native-firebase/firestore';
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
  const chatRoomRef = Firestore().collection('chatrooms');

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('Mounted. Retrieving chatrooms...');
    setIsLoading(true);
    setChats([]); // Reset for when react native auto remounts in emulator
    // chatRoomRef.add({
    //   users: [uid, '123'],
    //   names: { uid: 'tester', 123: 'test123' },
    //   createdAt: Firestore.FieldValue.serverTimestamp(),
    //   updatedAt: Firestore.FieldValue.serverTimestamp(),
    // }).then((newchatRef) => {
    //   newchatRef.collection('messages').add({
    //     senderId: uid,
    //     text: 'test message',
    //     sentAt: Firestore.FieldValue.serverTimestamp(),
    //   });
    //   newchatRef.collection('messages').add({
    //     senderId: '123',
    //     text: 'test received message',
    //     sentAt: Firestore.FieldValue.serverTimestamp(),
    //   });
    // });
    try {
      // build chats - list of tuples of chatrooms with (recipients, updatedAt, messages)
      // |- recipients is a map of userid: displayname
      chatRoomRef.where('users', 'array-contains', uid).orderBy('updatedAt', 'desc')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const users = doc.data().names;
            delete users[uid]; // exclude own name
            // eslint-disable-next-line no-shadow
            setChats((chats) => [...chats, {
              recipients: users,
              updatedAt: doc.data().updatedAt,
              messages: doc.ref.collection('messages'),
            }]);
          });
        })
        .then(() => {
          setIsLoading(false);
        });
    } catch (e) {
      setIsLoading(false);
      Alert.alert(e.message);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // []: only run once on mount

  // TODO: add search button
  // TODO: look into rare timestamp race condition   // https://medium.com/firebase-developers/the-secrets-of-firestore-fieldvalue-servertimestamp-revealed-29dd7a38a82b
  // TODO: convert list to PureComponents (Flatlist of Buttons is very slow)
  // TODO: convert query to scrolling window with live updates
  if (isLoading) {
    return (
      <SafeAreaView>
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }
  // eslint-disable-next-line no-console
  console.log('Retrieved ', chats.length, 'chatrooms');
  return (
    <SafeAreaView>
      <View style={styles.messagesContainer}>
        <FlatList
          data={chats}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            // TODO: Style chat select with Touch components
            const membernames = Object.values(item.recipients).join(', ');
            return (
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
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

// eslint-disable-next-line no-unused-vars
ChatroomsScreen.navigationOptions = ({ navigation }) => ({
  title: 'Messages',
  headerRight: () => (
    <Button
      title=" + "
      buttonStyle={{ padding: 5, marginRight: 20 }}
      // TODO: new chat -> enter recipient
      //       -> load existing chatroom if exists, else start new chatroom
      // onPress={() => {
      //   navigation.navigate('Message', {
      //     uid,
      //     members: item.recipients,
      //     membernames,
      //     messageCollection: item.messages,
      //   });
      // }}
      onPress={() => { Alert.alert('WIP - New chat not implemented'); }}
    />
  ),
});

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
