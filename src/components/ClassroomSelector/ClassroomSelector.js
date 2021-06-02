/* eslint-disable react/forbid-prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, { useState, useEffect, useContext } from 'react';
import {
  View, ScrollView, StyleSheet, Text, Animated,
} from 'react-native';
import Firestore from '@react-native-firebase/firestore';
import Firebase from '@react-native-firebase/app';
import { Avatar } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { ClassroomContext, HeaderContext } from '../../context';

const headerHeight = 135;
const styles = StyleSheet.create({
  headerContainer: {
    height: headerHeight,
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

const ClassroomSelector = ({ scene }) => {
  const {
    classroom: selectedClassroom,
    setClassroom: setSelectedClassroom,
  } = useContext(ClassroomContext);

  const [classrooms, setClassrooms] = useState([]);
  const [slideValue, setSlide] = useState(new Animated.Value(0));
  const [fadeValue, setFade] = useState(new Animated.Value(1));
  const [bottom, setBottom] = useState(0);
  const [lastTabIndex, setLast] = useState(0);
  const {
    animate,
    setAnimate,
  } = useContext(HeaderContext);

  useEffect(() => {
    async function fetchClassrooms(results = []) {
      setClassrooms([]);
      const { uid } = Firebase.auth().currentUser;
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
    fetchClassrooms();
  }, []);

  useEffect(() => {
    console.log('Classroom changed to', selectedClassroom);
  }, [selectedClassroom]);

  useEffect(() => {
    const duration = 250;
    if (animate === 'slideIn') {
      Animated.timing(slideValue, {
        toValue: -headerHeight,
        duration,
        useNativeDriver: false,
      }).start(() => {
        setSlide(new Animated.Value(-headerHeight));
      });
    } else if (animate === 'slideOut') {
      Animated.timing(slideValue, {
        toValue: 0,
        duration,
        useNativeDriver: false,
      }).start(() => {
        setSlide(new Animated.Value(0));
      });
    } else if (animate === 'fadeIn') {
      setBottom(0);
      if (Animated.subtract(1, fadeValue)) {
        Animated.timing(fadeValue, {
          toValue: 1,
          duration,
          useNativeDriver: false,
        }).start(() => {
          setFade(new Animated.Value(1));
        });
      }
    } else if (animate === 'fadeOut') {
      setBottom(-135);
      Animated.timing(fadeValue, {
        toValue: 0,
        duration,
        useNativeDriver: false,
      }).start(() => {
        setFade(new Animated.Value(0));
      });
    }
  }, [animate]);

  useEffect(() => {
    if (scene.route.state) {
      if (lastTabIndex === 3 && scene.route.state.index !== lastTabIndex) {
        setAnimate('fadeIn');
      }
      setLast(scene.route.state.index);
    }
  }, [scene]);

  const classroomButtons = (
    classrooms.map((c) => (
      <View style={styles.classroomIconGroup} key={c.id}>
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
      <Animated.View style={[styles.headerContainer, {
        opacity: fadeValue,
        height: Animated.add(135, slideValue),
        transform: [{
          translateY: slideValue,
        }],
        marginBottom: bottom,
      }]}
      >
        <LinearGradient
          colors={['#984A9C', '#C95748']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: -0.5 }}
          style={{ height: '100%' }}
        >
          <Text style={styles.classroomHeaderText}>My Classrooms</Text>
          <ScrollView horizontal indicatorStyle="white" style={{ paddingLeft: 10 }}>
            {classroomButtons}
          </ScrollView>
        </LinearGradient>
      </Animated.View>
    </ClassroomContext.Provider>
  );
};

ClassroomSelector.propTypes = {
  scene: PropTypes.object.isRequired,
};

export default ClassroomSelector;
