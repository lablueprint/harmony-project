/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, {
  useState, useEffect, useContext, useRef,
} from 'react';
import {
  View, StyleSheet, Text, Animated,
} from 'react-native';
import Firestore from '@react-native-firebase/firestore';
import Firebase from '@react-native-firebase/app';
import { Avatar } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import ClassroomContext from '../../context/ClassroomContext';
import EnterClassCode from '../EnterClassCode';

const styles = StyleSheet.create({
  headerContainer: {
    height: 150,
    margin: 0,
  },
  classroomHeaderText: {
    color: 'white',
    alignSelf: 'center',
    marginTop: 13,
    marginBottom: 11,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  classroomIconGroup: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    paddingBottom: 10,
    height: '100%',
  },
  classroomIconContainer: {
    backgroundColor: '#BDBDBD',
    // borderColor: 'rgba(245,245,245,0.7)',
    // borderWidth: 3,
  },
  selectedClassroomIcon: {
    borderRadius: 40,
    borderWidth: 6,
    borderColor: 'rgba(227, 164, 164, 0.5)',
    borderStyle: 'solid',
  },
  classroomIconText: {
    marginTop: 5,
    color: 'white',
    textShadowColor: 'darkslategrey',
    width: 60,
    fontSize: 11,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  selectedClassroomIconText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
});

const ClassroomSelector = () => {
  const {
    classroom: selectedClassroom,
    setClassroom: setSelectedClassroom,
  } = useContext(ClassroomContext);

  const { uid } = Firebase.auth().currentUser;
  const [classrooms, setClassrooms] = useState([]);
  const [askClassCode, setAskClassCode] = useState(false);
  const [classCode, setClassCode] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const transXAnim = useRef(new Animated.Value(0)).current;

  /**
  * Fetches a user's classrooms and updates the classrooms state variable
  */
  async function fetchClassrooms(results = []) {
    setClassrooms([]);
    Firestore().collection('classrooms')
      .where('teacherIDs', 'array-contains', uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          results.push(doc);
        });
      })
      .then(() => {
        Firestore().collection('classrooms')
          .where('studentIDs', 'array-contains', uid)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              results.push(doc);
            });
          })
          .then(() => {
            setClassrooms(results);
            setSelectedClassroom(results[0].id);
          })
          .catch((error) => {
            console.log('User not enrolled in any classrooms as Student: ', error);
          });
      })
      .catch((error) => {
        console.log('User not enrolled in any classrooms as Teacher: ', error);
      });
  }

  /**
   * Add user's uid to the classroom depending on their role
   * (Student, studentIDs) (Teacher, teacherIDs)
   */
  async function addToClassroom() {
    Firestore().collection('users').doc(uid).get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data().role;
        }
        return '';
      })
      .then((role) => {
        if (role === 'Student') {
          Firestore().collection('classrooms').doc(classCode)
            .update({
              studentIDs: Firestore.FieldValue.arrayUnion(uid),
            })
            .catch((e) => {
              console.warn(e);
            });
        } else if (role === 'Teacher') {
          Firestore().collection('classrooms').doc(classCode)
            .update({
              teacherIDs: Firestore.FieldValue.arrayUnion(uid),
            })
            .catch((e) => {
              console.warn(e);
            });
        }
      });
  }

  useEffect(() => {
    fetchClassrooms();
  }, []);

  useEffect(() => {
    if (classCode !== '') {
      addToClassroom();
      fetchClassrooms();
    }
  }, [classCode]);

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      },
    ).start();
  }, [fadeAnim]);

  const classroomButtons = (
    classrooms.map((c) => (
      <View style={styles.classroomIconGroup} key={c.id}>
        <View style={(selectedClassroom === c.id) && styles.selectedClassroomIcon}>
          <Avatar
            size={58}
            rounded
            overlayContainerStyle={styles.classroomIconContainer}
            source={
            // workaround to fix icon fallback not appearing correctly: see https://github.com/react-native-elements/react-native-elements/issues/2143
            c.data().profilePicture
              ? { uri: c.data().profilePicture }
              : { uri: 'no-image' }
            }
            icon={{ // fallback icon if profilePicture is invalid
              name: 'musical-note',
              type: 'ionicon',
            }}
            imageProps={{
              resizeMode: 'cover',
            }}
            onPress={() => {
              setSelectedClassroom(c.id);
            }}
          />
        </View>
        <Text
          style={[styles.classroomIconText,
            (selectedClassroom === c.id) && styles.selectedClassroomIconText,
          ]}
          numberOfLines={1}
        >
          {c.data().name}
        </Text>
      </View>
    ))
  );

  const addClassroomButton = (
    <View style={styles.classroomIconGroup}>
      <Avatar
        size={58}
        rounded
        overlayContainerStyle={styles.classroomIconContainer}
        icon={{
          name: 'add-outline',
          type: 'ionicon',
        }}
        imageProps={{
          resizeMode: 'cover',
        }}
        onPress={() => {
          setAskClassCode(true);
        }}
      />
      <Text
        style={styles.classroomIconText}
        numberOfLines={1}
      >
        Add Class
      </Text>
    </View>
  );

  return (
    <ClassroomContext.Provider value={{ selectedClassroom, setSelectedClassroom }}>
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#984A9C', '#C95748']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: -0.5 }}
          style={{ height: '100%' }}
        >
          <Text style={styles.classroomHeaderText}>My Classrooms</Text>
          <Animated.ScrollView
            horizontal
            indicatorStyle="white"
            style={{ paddingLeft: 10, opacity: fadeAnim }}
          >
            {addClassroomButton}
            {classroomButtons}
          </Animated.ScrollView>
        </LinearGradient>
        <EnterClassCode
          doDisplay={askClassCode}
          setDoDisplay={setAskClassCode}
          setClassCode={setClassCode}
        />
      </View>
    </ClassroomContext.Provider>
  );
};

export default ClassroomSelector;
