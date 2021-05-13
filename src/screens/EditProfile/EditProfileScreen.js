/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, ActivityIndicator, View, Text, Alert, SafeAreaView, ScrollView, TouchableHighlight,
} from 'react-native';
import { CheckBox, Button, Input } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
// eslint-disable-next-line import/no-unresolved
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import Firebase from '@react-native-firebase/app';
import { INITIAL_USER_STATE } from '../../components';
import DatePicker from '../../components/DatePicker';
import UploadFile from '../../components/UploadFile/UploadFile';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    height: 400,
    padding: 20,
  },
  subContainer: {
    marginBottom: 20,
    padding: 5,
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 18,
    margin: 5,
    width: 200,
  },
  checklist: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
});

// navigation MUST INCLUDE: uid
export default function EditProfileScreen({ navigation }) {
  const [initializing, setInitializing] = useState(true);
  const { uid } = Firebase.auth().currentUser;
  const ref = Firestore().collection('users');
  const [userState, setUserState] = useState(INITIAL_USER_STATE);
  // const [newState, setNewState] = useState(INITIAL_USER_STATE);
  const [instruments, setInsts] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [dob, setDob] = useState({});
  const [monitorUpload, setMonitor] = useState();
  const [choseFile, setChoose] = useState();
  const [upload, setUpload] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // if the user is signed in, then fetch its data
      if (uid) {
        ref.doc(uid).get()
          .then((document) => {
            if (document.exists) {
              return document.data();
            }
            return null;
          })
          .then(async (data) => {
            setUserState(data);
            // setNewState(data);
            const date = data.dob.split('-'); // yyyy-mm-dd
            setDob({
              ...dob,
              year: parseInt(date[0], 10),
              month: parseInt(date[1], 10),
              day: parseInt(date[2], 10),
            });

            // fetch instruments from Firestore and place them into the instruments state var
            // each object in the instruments state var hold the name and
            // whether or not they've been chosen or were previously chosen (toggle)
            await Firestore().collection('instruments').orderBy('name', 'asc').get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  setInsts((insts) => [...insts, {
                    name: doc.data().name,
                    toggle: data.instruments.includes(doc.data().name),
                  }]);
                });
              })
              .catch((e) => {
                Alert.alert(e.message);
              });

            if (initializing) setInitializing(false);
          })
          .catch((e) => {
            Alert.alert(e.message);
          });
      }
    }

    navigation.addListener('focus', () => {
      fetchData();
    });
  }, [uid]);

  /*   useEffect(() => {
    async function fetchInsts() {

    }
    const focusListener = navigation.addListener('didFocus', () => {
      fetchInsts();
    });

    return () => focusListener.remove();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); */

  const submitProfile = async () => {
    function submit() {
      const userInsts = [];
      instruments.forEach((i) => {
        if (i.toggle) {
          userInsts.push(i.name);
        }
      });
      ref.doc(uid).update({
        ...userState,
        instruments: userInsts,
        updatedAt: Firestore.FieldValue.serverTimestamp(),
      }).then(() => {
        setShowLoading(false);
        navigation.navigate('Profile', { uid });
        setInitializing(true);
      })
        .catch((e) => {
          setShowLoading(false);
          Alert.alert(
            e.message,
          );
        });
    }

    setShowLoading(true);
    if (choseFile) {
      setUpload(true);
      monitorUpload.then((data) => {
        setUserState({
          ...userState,
          profilePic: data.url,
        });
        submit();
      })
        .catch((e) => {
          setShowLoading(false);
          Alert.alert(
            e.message,
          );
        });
    } else {
      submit();
    }
  };

  function cancel() {
    navigation.navigate('Profile', { uid });
  }

  if (initializing) return null;

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 28, height: 50 }}>Edit Your Profile</Text>
      </View>
      <SafeAreaView style={styles.formContainer}>
        <ScrollView>
          <UploadFile
            setMonitor={setMonitor}
            setChoose={setChoose}
            upload={upload}
            postId={uid}
            collection="users/profilepics"
            mediaType="photo"
          />
          <View style={styles.subContainer}>
            <Input
              style={styles.textInput}
              placeholder="First Name"
              value={userState.firstName}
              onChangeText={(text) => {
                setUserState({
                  ...userState,
                  firstName: text,
                });
              }}
            />
            <Input
              style={styles.textInput}
              placeholder="Last Name"
              value={userState.lastName}
              onChangeText={(text) => {
                setUserState({
                  ...userState,
                  lastName: text,
                });
              }}
            />
          </View>
          <View style={styles.subContainer}>
            <Input
              style={styles.textInput}
              placeholder="Email"
              value={userState.email}
              onChangeText={(text) => {
                setUserState({
                  ...userState,
                  email: text,
                });
              }}
            />
          </View>
          {userState.role === 'TEACHER'
            ? (
              <View style={styles.subContainer}>
                <Input
                  style={styles.textInput}
                  placeholder="Display Name"
                  value={userState.displayName}
                  onChangeText={(text) => {
                    setUserState({
                      ...userState,
                      displayName: text,
                    });
                  }}
                />
              </View>
            )
            : (
              <View style={styles.subContainer}>
                <Input
                  style={styles.textInput}
                  placeholder="Student ID"
                  value={userState.hpID}
                  onChangeText={(text) => {
                    setUserState({
                      ...userState,
                      hpID: text,
                    });
                  }}
                />
              </View>
            )}
          {userState.role === 'STUDENT' && (
          <View style={styles.subContainer}>
            <Picker
              selectedValue={userState.gradeLevel}
              style={styles.textInput}
              onValueChange={(itemValue) => {
                setUserState({
                  ...userState,
                  gradeLevel: itemValue,
                });
              }}
            >
              <Picker.Item label="K" value={0} />
              <Picker.Item label="1st" value={1} />
              <Picker.Item label="2nd" value={2} />
              <Picker.Item label="3rd" value={3} />
              <Picker.Item label="4th" value={4} />
              <Picker.Item label="5th" value={5} />
              <Picker.Item label="6th" value={6} />
              <Picker.Item label="7th" value={7} />
              <Picker.Item label="8th" value={8} />
              <Picker.Item label="9th" value={9} />
              <Picker.Item label="10th" value={10} />
              <Picker.Item label="11th" value={11} />
              <Picker.Item label="12th" value={12} />
            </Picker>
          </View>
          )}
          <View style={styles.subContainer}>
            <Text>
              Instruments:
            </Text>
            {instruments.map((i, index) => (
              <View key={i.name} style={styles.checklist}>
                <CheckBox
                  checked={i.toggle}
                  onPress={() => {
                    const items = [...instruments];
                    items[index].toggle = !i.toggle;
                    setInsts(items);
                  }}
                />
                <TouchableHighlight
                  onPress={() => {
                    const items = [...instruments];
                    items[index].toggle = !i.toggle;
                    setInsts(items);
                  }}
                  underlayColor="#E1E1E1"
                >
                  <Text>{i.name}</Text>
                </TouchableHighlight>
              </View>
            ))}
          </View>
          <Text>Date of Birth:</Text>
          <DatePicker
            currDay={dob.day}
            currMonth={dob.month}
            currYear={dob.year}
            onChange={(date) => {
              setUserState({
                ...userState,
                dob: date,
              });
            }}
          />
          {showLoading
          && (
          <View style={styles.activity}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
          )}
        </ScrollView>
      </SafeAreaView>
      <View style={styles.subContainer}>
        <Button
          style={styles.textInput}
          title="Save Changes"
          onPress={() => {
            submitProfile();
          }}
        />
      </View>
      {/* <View style={styles.subContainer}>
  <Button
    style={styles.textInput}
    title="Cancel"
    onPress={() => cancel()}
  />
</View> */}
      <View style={styles.subContainer}>
        <Button
          style={styles.textInput}
          title="Back to Profile"
          onPress={() => {
            cancel();
          }}
        />
      </View>
    </View>
  );
}

// eslint-disable-next-line no-unused-vars
EditProfileScreen.navigationOptions = ({ navigation }) => ({
  title: 'Edit Profile',
  headerShown: false,
});

EditProfileScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,

  route: PropTypes.shape({
    params: PropTypes.isRequired,
  }).isRequired,
};
