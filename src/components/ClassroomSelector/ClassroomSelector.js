/* eslint-disable no-console */
import React, { useState, useEffect, useContext } from 'react';
import {
  View, ScrollView, StyleSheet, Text,
} from 'react-native';
import Firestore from '@react-native-firebase/firestore';
import Firebase from '@react-native-firebase/app';
import { Avatar } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import ClassroomContext from '../../navigation/ClassroomContext';
// eslint-disable-next-line no-unused-vars
import AuthContext from '../../navigation/AuthContext';

const styles = StyleSheet.create({
  headerContainer: {
    height: 130,
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
    marginBottom: 12,
  },
  classroomIconContainer: {
    backgroundColor: '#9ACA3C',
    // borderColor: 'rgba(245,245,245,0.7)',
    // borderWidth: 3,
  },
  classroomIconText: {
    color: 'white',
    textShadowColor: 'darkslategrey',
    textShadowRadius: 2,
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    width: 52,
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});

const ClassroomSelector = () => {
  const {
    classroom: selectedClassroom,
    setClassroom: setSelectedClassroom,
  } = useContext(ClassroomContext);
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    async function fetchClassrooms(results = []) {
      const user = Firebase.auth().currentUser.uid;
      await Firestore().collection('classrooms')
        .where('studentIDs', 'array-contains', user)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            results.push(doc);
          });
        })
        .catch((error) => {
          console.log('User not enrolled in any classrooms: ', error);
        });
      setClassrooms(results);
    }
    fetchClassrooms();
  }, []);

  useEffect(() => {
    console.log('Classroom changed to', selectedClassroom);
  }, [selectedClassroom]);

  const classroomButtons = (
    classrooms.map((c) => (
      <View style={styles.classroomIconGroup} key={c}>
        <Avatar
          size={60}
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
            // TODO: add border/outline to classroom on select
          }}
        />
        <Text style={styles.classroomIconText} numberOfLines={1}>
          {c.data().name}
        </Text>
      </View>
    ))
  );

  return (
    <ClassroomContext.Provider value={{ selectedClassroom, setSelectedClassroom }}>
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#984A9C', '#C95748']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: -0.5 }}
        >
          <Text style={styles.classroomHeaderText}>My Classrooms</Text>
          <ScrollView horizontal indicatorStyle="white" style={{ paddingLeft: 10 }}>
            {classroomButtons}
          </ScrollView>
        </LinearGradient>
      </View>
    </ClassroomContext.Provider>
  );
};

export default ClassroomSelector;
