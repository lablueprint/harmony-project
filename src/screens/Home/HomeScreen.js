/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import Auth from '@react-native-firebase/auth';
import PropTypes from 'prop-types';

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
          title="Edit Profile"
          onPress={() => {
            navigation.navigate('EditProfile', { uid });
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
      </View>
      <View style={styles.subContainer}>
        <Button
          style={styles.textInput}
          title="Create Attendance Sheets"
          onPress={() => {
            navigation.navigate('CreateAttendance', { uid });
          }}
        />
      </View>
      <View style={styles.subContainer}>
        <Button
          style={styles.textInput}
          title="View Attendance Sheets"
          onPress={() => {
            navigation.navigate('AttendanceSheet', { uid });
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
