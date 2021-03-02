/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, ScrollView, StyleSheet, Platform, View, Alert, TextInput,
} from 'react-native';
import { Button, Text, Icon } from 'react-native-elements';
import Drawer from 'react-native-drawer';
import Firestore from '@react-native-firebase/firestore';
import Auth from '@react-native-firebase/auth';
import PropTypes from 'prop-types';
import { INITIAL_USER_STATE } from '../../components';
import ClassSelections from './ClassSelections';

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  sideMenu: {
    height: '100%',
    backgroundColor: '#ffffff',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: 56,
    backgroundColor: '#ffffff',
    borderBottomColor: 'rgb(216, 216, 216)',
    shadowColor: 'rgb(216, 216, 216)',
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowOpacity: 0.85,
        shadowRadius: 0,
        shadowOffset: {
          width: 0,
          height: StyleSheet.hairlineWidth,
        },
      },
      default: {
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
    }),
  },
  headerLeft: {
    marginLeft: 10,
    flex: 1,
    display: 'flex',
    alignItems: 'flex-start',
  },
  headerRight: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    width: 20,
  },
  headerText: {
    marginLeft: 65,
    marginRight: 75,
  },
  headerTextText: {
    ...Platform.select({
      ios: {
        fontSize: 17,
        fontWeight: '600',
      },
      android: {
        fontSize: 20,
        fontFamily: 'sans-serif-medium',
        fontWeight: 'normal',
      },
      default: {
        fontSize: 18,
        fontWeight: '500',
      },
    }),
  },
  subContainer: {
    marginBottom: 10,
    padding: 10,
  },
  textInput: {
    fontSize: 18,
    margin: 5,
    width: 200,
  },
  contentContainer: {
    paddingTop: 20,
  },
  topicText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scroll: {
    height: '88%',
    marginBottom: 10,
  },
});

const drawerStyles = StyleSheet.create({
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
  main: { paddingLeft: 3 },
});

// navigation MUST INCLUDE: uid
export default function ClassroomSelectScreen({ navigation }) {
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [userState, setUserState] = useState(INITIAL_USER_STATE);
  const [uid, setUid] = useState(navigation.getParam('uid', null));
  const [code, setCode] = useState('');
  const [toggleMenu, setToggle] = useState(false); // toggle drawer

  const [classrooms, setClasses] = useState([]);

  // input code, join
  async function joinClassroom() {
    const classRef = Firestore().collection('classrooms');
    const doc = await classRef.doc(code.toLowerCase()).get();
    const classroomInfo = doc.data();
    if (!classroomInfo) {
      Alert.alert(
        'Please input a valid code!',
      );
    } else {
      // if user is a student or teacher, add their id to the classroom
      if (userState.role === 'STUDENT') {
        classRef.doc(code.toLowerCase()).update({
          studentIDs: Firestore.FieldValue.arrayUnion(user.uid),
        });
      }
      if (userState.role === 'TEACHER') {
        classRef.doc(code.toLowerCase()).update({
          teacherIDs: Firestore.FieldValue.arrayUnion(user.uid),
        });
      }
      setToggle(false);
      navigation.navigate('Classroom', { code, classroomInfo, uid });
    }
  }

  function onAuthStateChanged(authUser) {
    setUser(authUser);
    if (initializing) setInitializing(false);
  }

  // check signin on mount
  useEffect(() => {
    const subscriber = Auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // if signed in, set uid
  useEffect(() => {
    if (user && !uid) setUid(user.uid);
  }, [user]);

  useEffect(() => {
    function fetch() {
      setLoading(true);
      setClasses([]);
      // if the user is signed in, then fetch its data and fetch classrooms
      if (uid) {
        Firestore().collection('users')
          .doc(uid)
          .get()
          .then((document) => {
            if (document.exists) {
              return document.data();
            }
            return null;
          })
          .then(async (data) => {
            setUserState(data);
            await Firestore().collection('classrooms').orderBy('endDate', 'desc').get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  if (data.role === 'TEACHER') {
                    if (doc.id.length === 6) {
                      doc.data().teacherIDs.forEach((element) => {
                        if (element === uid) {
                          setClasses((c) => [...c, { ...doc.data(), code: doc.id }]);
                        }
                      });
                    }
                  } else if (data.role === 'STUDENT') {
                    if (doc.id.length === 6) {
                      doc.data().studentIDs.forEach((element) => {
                        if (element === uid) {
                          setClasses((c) => [...c, { ...doc.data(), code: doc.id }]);
                        }
                      });
                    }
                  }
                });
              });

            if (loading) setLoading(false);
          })
          .catch((e) => {
            Alert.alert(e.message);
          });
        // force teacher to create classroom on login
        /* if (userState && userState.role && userState.role === 'TEACHER'
        && userState.classroomIds.length === 0) {
          navigation.navigate('CreateClassroom', { uid });
        } */
      }
    }
    fetch();

    const focusListener = navigation.addListener('didFocus', () => {
      fetch();
    });

    return () => focusListener.remove();
  }, [uid]);

  // if signing in, return null
  if (initializing) return null;

  // if not logged in, unmount and go to signin page
  if (!user) {
    return navigation.navigate('SignIn');
  }

  // if loading user data, return the base views
  if (loading) {
    return (
      <SafeAreaView>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Icon
              name="menu"
              size={36}
              color="#000000"
            />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTextText}>
              Home
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Button
              title="Sign Out"
              buttonStyle={{ padding: 5, marginRight: 20 }}
              style={styles.button}
            />
          </View>
        </View>
        <Text style={styles.topicText}>
          {`Welcome ${user.email}!`}
        </Text>
        <Text style={styles.topicText}>
          LOADING...
        </Text>
      </SafeAreaView>
    );
  }

  const menu = (
    <View style={styles.sideMenu}>
      <View style={styles.subContainer}>
        <Button
          style={styles.textInput}
          title="Profile"
          onPress={() => {
            setToggle(false);
            navigation.navigate('Profile', { uid });
          }}
        />
      </View>
      <View style={styles.subContainer}>
        <TextInput
          placeholder="ABCDEF"
          fontSize={20}
          maxLength={6}
          onChangeText={setCode}
          value={code}
        />
        <Button
          style={styles.textInput}
          title="Join"
          onPress={() => {
            setToggle(false);
            joinClassroom();
          }}
        />
      </View>
      {userState && userState.role === 'TEACHER'
    && (
    <View style={styles.subContainer}>
      <Button
        style={styles.textInput}
        title="Create Classroom"
        onPress={() => {
          setToggle(false);
          navigation.navigate('CreateClassroom', { uid });
          // for now a separate page using this button
        }}
      />
    </View>
    )}
      <View style={styles.subContainer}>
        <Button
          style={styles.textInput}
          title="Settings"
          onPress={() => {
          }}
        />
      </View>
    </View>
  );

  return (
    <Drawer
      type="overlay"
      content={menu}
      tapToClose
      open={toggleMenu}
      onClose={() => { setToggle(false); }}
      openDrawerOffset={0.2} // 20% gap on the right side of drawer
      panCloseMask={0.2}
      closedDrawerOffset={-3}
      styles={drawerStyles}
      tweenHandler={(ratio) => ({
        main: { opacity: (2 - ratio) / 2 },
      })}
    >
      <SafeAreaView>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Icon
              name="menu"
              size={36}
              color="#000000"
              onPress={() => { setToggle(!toggleMenu); }}
            />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTextText}>
              Home
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Button
              title="Sign Out"
              buttonStyle={{ padding: 5, marginRight: 20 }}
              onPress={() => { Auth().signOut(); }}
              style={styles.button}
            />
          </View>
        </View>
        <Text style={styles.topicText}>
          {`Welcome ${userState.email}!`}
        </Text>
        <ScrollView style={styles.scroll}>
          <ClassSelections
            classroomData={classrooms}
            uid={uid}
            userState={userState}
            navigation={navigation}
          />
        </ScrollView>
      </SafeAreaView>
    </Drawer>

  );
}

ClassroomSelectScreen.navigationOptions = {
  headerShown: false,
  title: 'Landing',
  /* headerLeft: () => (
    <Icon
      name="menu"
      size={36}
      color="#000000"
      onPress={() => { }}
    />
  ),
  headerRight: () => (
    <Button
      title="Sign Out"
      buttonStyle={{ padding: 5, marginRight: 20 }}
      onPress={() => { Auth().signOut(); }}
    />
  ), */
};

ClassroomSelectScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};
