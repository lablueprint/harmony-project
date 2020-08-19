import React, { useCallback, useState, useEffect } from 'react';
import {
  FlatList, SafeAreaView, View, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { Button } from 'react-native-elements';
// import Auth from '@react-native-firebase/auth';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import MessageBubble from '../MessageBubble';
import { styles } from './styles';

export default function MessagesScreen({ navigation }) { // { navigation, screenprops }
  // TODO: convert query to scrolling window view with live updates
  function getCurrTime() {
    const date = new Date();
    return date.getTime();
  }

  const uid = navigation.getParam('uid', null);
  // const members = navigation.getParam('members', null);
  const messagesRef = navigation.getParam('messageCollection', null);
  const [messages, setMessages] = useState([]);
  // TODO: implement event listener instead of this hacky way to check for updates
  const [lastUpdated, setLastUpdated] = useState(getCurrTime());
  const [isLoading, setIsLoading] = useState(true);
  const [outMessage, setOutMessage] = useState('');

  const handlePress = useCallback(
    () => {
      // eslint-disable-next-line no-console
      console.log('Sending message...');
      setIsLoading(true);
      try {
        messagesRef.add({
          senderId: uid,
          text: outMessage,
          sentAt: Firestore.FieldValue.serverTimestamp(),
        }).then(() => {
          setLastUpdated(getCurrTime());
          setOutMessage('');
          setIsLoading(false);
        });
      } catch (e) {
        Alert.alert(e.message);
      }
    },
    [uid, messagesRef, outMessage],
  );

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('Mounted. Retrieving messages');
    setIsLoading(true);
    try {
      messagesRef.orderBy('sentAt', 'desc')
        .get()
        .then((querySnapshot) => {
          setMessages(querySnapshot.docs.map((doc) => doc.data()));
        })
        .then(() => {
          setIsLoading(false);
        });
    } catch (e) {
      setIsLoading(false);
      Alert.alert(e.message);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastUpdated]); // fire on mount and when new message sent

  // const mock = [
  //   { id: 1, message: 'Hello', side: 'left' },
  //   { id: 2, message: 'Hi!', side: 'right' },
  // ];
  /* eslint-disable react/jsx-no-bind */
  if (isLoading) {
    return (
      <SafeAreaView>
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView>
      <View style={styles.messagesContainer}>
        <FlatList
          inverted
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            if (item.senderId === uid) {
              return (<MessageBubble side="right" message={item.text} />);
            }
            return (
              <>
                {/* TODO: Add member names for groupchats
                    <Text style={colors.GREY}>{members[item.senderId]}</Text> */}
                <MessageBubble side="left" message={item.text} />
              </>
            );
          }}
        />
      </View>
      {/* Input text box.
          TODO: Change textbox to dynamically vertically resize.
                (currently an infinite horizontal scroll)
        */}
      <View style={styles.inputContainer}>
        <View style={styles.container}>
          <View style={{ width: '75%' }}>
            <TextInput
              style={styles.input}
              value={outMessage}
              onChangeText={setOutMessage}
              placeholder="Enter message..."
              disabled={isLoading}
            />
          </View>
          <View style={{ width: '20%', paddingRight: 5 }}>
            <Button title="Send" onPress={handlePress} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
  /* eslint-enable react/jsx-no-bind */
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
