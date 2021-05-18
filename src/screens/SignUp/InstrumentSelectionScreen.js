import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, ScrollView, Text,
} from 'react-native';
import { Button, Input, CheckBox } from 'react-native-elements';
import PropTypes from 'prop-types';
import Auth from '@react-native-firebase/auth';
import Firestore from '@react-native-firebase/firestore';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import Svg from 'react-native-svg';
import SignInWave from '../SignIn/background.svg';
import DatePicker from '../../components/DatePicker';

const styles = StyleSheet.create({
  screen: {
    fontFamily: 'Helvetica Neue',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
  },
  wavyBanner: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '20%',
  },
  checklist: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    color: '#828282',
  },
  h2: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4F4F4F',
  },
  labelContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  labelStyles: {
    color: '#828282',
    fontWeight: 'bold',
    alignItems: 'flex-start',
  },
  highlightedLabelStyles: {
    color: '#8E4F97',
    fontWeight: 'bold',
  },
  instrumentContainer: {
    height: 240,
    width: 300,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#ffffff',
    borderColor: '#BDBDBD',
    margin: 10,
    marginTop: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  checkbox: {
    backgroundColor: '#ffffff',
    borderWidth: 0,
    margin: 0,
  },
  instrument: {
    fontSize: 18,
    color: '#828282',
  },
  inputLabel: {
    color: '#BDBDBD',
  },
  errorStyle: {
    color: '#bc5d4e',
    fontWeight: 'bold',
  },
  subContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: 10,
  },
  buttonContainer: {
    padding: 20,
  },
  buttonText_1: {
    color: '#8E4F97',
  },
  buttonText_2: {
    color: '#ffffff',
  },
  buttonText_3: {
    color: '#8e4f97',
  },
  button_1: {
    backgroundColor: '#ffffff',
    borderColor: '#8E4F97',
    borderWidth: 3,
    borderRadius: 40,
    width: 250,
  },
  button_2: {
    backgroundColor: '#8e4f97',
    borderColor: '#8e4f97',
    borderWidth: 3,
    borderRadius: 40,
    width: 250,
  },
  button_3: {
    backgroundColor: '#ffffff',
    borderColor: '#8e4f97',
    borderWidth: 3,
    borderRadius: 40,
    width: 250,
  },
});

export default function UserInformationScreen({ route, navigation }) {
  const {
    classCode,
    role,
    firstName,
    lastName,
    studentID,
    gradeLevel,
    email,
    password,
  } = route.params;

  const [dob, setDob] = useState({});
  const [instruments, setInsts] = useState([]);
  const [selectedInstr, setSelectedInstr] = useState([]);

  const signup = async () => {
    Auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        if (user) {
          user.sendEmailVerification();
        }
      })
      .catch((e) => {
        const errorCode = e.code;
        console.log(errorCode);
        /*
        if (errorCode === 'auth/email-already-in-use') {
          setEmailErr('*Email already in use');
        } else if (errorCode === 'auth/invalid-email') {
          setEmailErr('*Invalid email');
        } else if (errorCode === 'auth/weak-password') {
          setPasswordErr('*Weak Password');
        }
        */
      });
  };

  useEffect(() => {
    Auth().signInAnonymously().then((user) => {
      if (user) {
        // fetch instruments from Firestore and place them into the instruments state var
        // each object in the instruments state var hold the name and
        // whether or not they've been chosen (toggle)
        Firestore().collection('instruments').orderBy('name', 'asc').get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              setInsts((insts) => [...insts, { id: doc.id, name: doc.data().name, toggle: false }]);
            });
          })
          .catch((e) => {
            console.log(e.message);
          });

        // Delete anonymous user after fetching instruments from Firestore
        Auth().currentUser.delete();
      }
    }).catch((e) => {
      console.warn(e);
    });
  }, []);
  return (
    <View style={styles.screen}>
      <View style={styles.wavyBanner}>
        <Svg viewBox="0 0 375 450" width="100%" height="100%" preserveAspectRatio="none">
          <SignInWave />
        </Svg>
      </View>
      <View style={[styles.subContainer, {
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 100,
      }]}
      >
        <DatePicker
          currDay={-1}
          currMonth={-1}
          currYear={-1}
          onChange={setDob}
        />
      </View>
      <View style={{
        display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100%', marginLeft: 60,
      }}
      >
        <Text style={styles.labelStyles}>My Instruments - </Text>
        <Text style={styles.highlightedLabelStyles}>
          (
          {selectedInstr.length}
          ) Selected
        </Text>
      </View>
      <View style={styles.instrumentContainer}>
        <ScrollView persistentScrollbar>
          {instruments.map((i, index) => (
            <View key={i.id} style={styles.checklist}>
              <CheckBox
                checked={i.toggle}
                title={i.name}
                textStyle={styles.instrument}
                containerStyle={styles.checkbox}
                onPress={() => {
                  const items = [...instruments];
                  items[index].toggle = !i.toggle;
                  if (i.toggle) {
                    setSelectedInstr((prev) => [...prev, i.name]);
                  } else {
                    const prev = [...selectedInstr];
                    const instrIndex = selectedInstr.indexOf(i.name);
                    if (index !== -1) {
                      prev.splice(instrIndex, 1);
                      setSelectedInstr(prev);
                    }
                  }
                  setInsts(items);
                }}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.subContainer}>
        <Button
          titleStyle={styles.buttonText_2}
          buttonStyle={styles.button_2}
          title="Sign Up"
          onPress={() => {
            signup();
            Auth().signInAnonymously().then((user) => {
              if (user) {
                Firestore().collection('classrooms').where('id', '==', classCode)
                  .then((doc) => {
                    if (doc) {
                      Firestore().collection('users').add({
                        role,
                        createdAt: Firestore.Timestamp.now(),
                        updatedAt: Firestore.Timestamp.now(),
                        email,
                        firstName,
                        lastName,
                        profilePic: '',
                        hpID: studentID,
                        gradeLevel,
                        dob,
                        instruments: selectedInstr,
                      }).then((userDoc) => {
                        if (role === 'Student') {
                          Firestore().collection('classrooms').doc(classCode)
                            .update({
                              studentIDs: Firestore.FieldValue.arrayUnion(userDoc.id),
                            });
                        } else {
                          Firestore().collection('classrooms').doc(classCode)
                            .update({
                              teacherIDs: Firestore.FieldValue.arrayUnion(userDoc.id),
                            });
                        }
                      })
                        .then(() => {
                          navigation.navigate('SignIn');
                        });
                    }
                  });
              }
            });
          }}
        />
      </View>
      <View style={styles.subContainer}>
        <Button
          titleStyle={styles.buttonText_3}
          buttonStyle={styles.button_3}
          title="Login"
          onPress={() => { navigation.navigate('SignIn'); }}
        />
      </View>
    </View>
  );
}

UserInformationScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,

  route: PropTypes.shape({
    params: PropTypes.isRequired,
  }).isRequired,
};
