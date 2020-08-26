import React, { useCallback, useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';

// Message schema
// {
//   _id: 2, // message ID. also firestore message document id.
//   text: 'Hello!',
//   createdAt: new Date().getTime(),
//   user: {
//     _id: uid, // user ID
//     name: 'Test User',
//     // avatar: url,
//   },
// }

// TODO: add user names.
export default function MessagesScreen({ navigation }) { // { navigation, screenprops }
  const uid = navigation.getParam('uid', null);
  // const members = navigation.getParam('members', null);
  const messagesRef = navigation.getParam('messageCollection', null);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('Mounted. Subscribing to messages');
    const unsubscribe = messagesRef.onSnapshot(
      (querySnapshot) => {
        const newMessages = querySnapshot.docChanges()
          .filter((change) => change.type === 'added')
          .map((change) => change.doc.data());
        setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
      },
      (e) => {
        Alert.alert(e.message);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => unsubscribe();
  }, [messagesRef]); // subscribe on mount

  const handleSend = useCallback(
    (newMessage = []) => {
      // eslint-disable-next-line no-param-reassign
      newMessage.createdAt = new Date().getTime();
      messagesRef
        // eslint-disable-next-line no-underscore-dangle
        .doc(newMessage._id)
        .set(newMessage)
        .catch((e) => {
          Alert.alert(e.message);
        });
    },
    [messagesRef],
  );

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessage) => handleSend(newMessage[0])}
      user={{ _id: uid }}
    />
  );
}

MessagesScreen.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('membernames', 'New Message'),
});

MessagesScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
