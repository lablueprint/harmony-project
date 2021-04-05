/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import {
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import Firestore from '@react-native-firebase/firestore';
import Auth from '@react-native-firebase/auth'; // https://rnfirebase.io/auth/usage
import { INITIAL_USER_STATE } from '../../components';

export default function LoadClasses({ navigation }) {
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userState, setUserState] = useState(INITIAL_USER_STATE);
  const [uid, setUid] = useState(null);
  const [classrooms, setClasses] = useState([]);

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
    if (user && user.email && !uid) setUid(user.uid);
  }, [user]);

  useEffect(() => {
    function fetch() {
      setLoading(true);
      setClasses([]);
      // if the user is signed in, then fetch its data and fetch classrooms
      if (user && uid) {
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
            if (loading) {
              setLoading(false);
            }
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
  }, [uid]);

  if (initializing) return null;

  // if not logged in, unmount and go to signin page
  if (!user || !user.email) {
    if (user) { Auth().currentUser.delete(); }
    return navigation.navigate('SignIn');
  }

  if (loading) return null;

  return navigation.navigate('Landing', {
    user, uid, userState, classrooms,
  });
}

LoadClasses.navigationOptions = {
  headerShown: false,
};

LoadClasses.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
