/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import Auth from '@react-native-firebase/auth';
import PropTypes from 'prop-types';
import UploadFile from '../../components/UploadFile';

const styles = StyleSheet.create({
  subContainer: {
    marginBottom: 20,
    padding: 10,
  },
  textInput: {
    fontSize: 18,
    margin: 5,
    width: 200,
  },
});

export default function HomeScreen({ navigation }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [uid, setUid] = useState(navigation.getParam('uid', null));

  function onAuthStateChanged(authUser) {
    setUser(authUser);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = Auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (user && !uid) setUid(user.uid);
  }, [user]);

  if (initializing) return null;

  if (!user) {
    return navigation.navigate('SignIn');
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>
        Welcome {user.email}
      </Text>
      <View style={styles.subContainer}>
        <Button
          style={styles.textInput}
          title="Profile"
          onPress={() => {
            navigation.navigate('Profile', { uid });
          }}
        />
      </View>
      <View style={styles.subContainer}>
        <Button
          style={styles.textInput}
          title="View Evaluation"
          onPress={() => {
            navigation.navigate('Evaluation');
          }}
        />
        <Button
          style={styles.textInput}
          title="GenericForm"
          onPress={() => {
            navigation.navigate('GenericFormDemo', { });
          }}
        />
      </View>
      <View style={styles.subContainer}>
        <Button
          style={styles.textInput}
          title="View Posts"
          onPress={() => {
            navigation.navigate('Post');
          }}
        />
        <UploadFile
          docId="example"
          collection="posts"
        />
      </View>
      <View style={styles.subContainer}>
        <Button
          style={styles.textInput}
          title="Announcements"
          onPress={() => {
            navigation.navigate('Announcements');
          }}
        />
      </View>
    </View>
  );
}

// eslint-disable-next-line no-unused-vars
HomeScreen.navigationOptions = ({ navigation }) => ({
  title: 'Home',
  headerRight: () => (
    <Button
      title="Sign Out"
      buttonStyle={{ padding: 5, marginRight: 20 }}
      onPress={() => { Auth().signOut(); }}
    />
  ),
});

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
