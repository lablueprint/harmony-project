/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Alert, Image,
} from 'react-native';
import { Icon, Text, ListItem } from 'react-native-elements';
import Firestore from '@react-native-firebase/firestore';
import Auth from '@react-native-firebase/auth';
import PropTypes from 'prop-types';
import Firebase from '@react-native-firebase/app';
import { INITIAL_USER_STATE } from '../../components';
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({
  banner: {
    height: '20%',
    zIndex: 1, 
  },
  screenContainer: {
    display: 'flex', 
    backgroundColor: '#ffffff',
    zIndex: 2
  },
  top: {
    top: -120,
    zIndex: 2
  },
  bottom: {
    top:-120, 
    zIndex:3
  },
  profilePicture: {
    height: 150, 
    width: 150,
    borderRadius: 150, 
    borderWidth: 6,
    borderColor: '#ffffff'
  }, 
  parentCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  childCenter: {
    alignSelf: 'center'
  },
  pageName: {
    color: '#ffffff', 
    fontSize: 25,
    marginBottom: 20
  },
  subtextContainer: {
    backgroundColor: '#f1f3f4', 
    padding: 6, 
    color: '#6c6c6c', 
    borderRadius: 8
  },
  horizontalListContainer: {
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'row',
  },
  gradeLevelContainer: {
    marginLeft: 8,
    color: '#4391d8'
  },
  instrumentContainer: {
    marginBottom: -10
  },
  instrumentListContainer: {
    paddingBottom: 15,
    paddingLeft: 15,
    flexWrap: 'wrap', 
  },
  instrumentTextContainer: { 
    marginRight: 8
  }, 
});

// navigation MUST INCLUDE: uid
export default function ProfileScreen({ navigation }) {
  //const [initializing, setInitializing] = useState(true);
  //const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  const { uid } = Firebase.auth().currentUser;
  const ref = Firestore().collection('users');
  const [userState, setUserState] = useState(INITIAL_USER_STATE);
  const [instrumentList, setInstrumentList] = useState([]);
  // const [newState, setNewState] = useState(INITIAL_USER_STATE);

  useEffect(() => {
    // if the user is signed in, then fetch their data
    function fetchData() {
      if (uid) {
        ref.doc(uid).get()
          .then((document) => {
            if (document.exists) {
              return document.data();
            }
            return null;
          })
          .then((data) => {
            setUserState(data);

            const temp = data.instruments.map((instrument, index) => {
              return <Text key={index} style={[styles.subtextContainer, styles.instrumentTextContainer]}> {instrument} </Text>
              });
            setInstrumentList(temp);

            // setNewState(data);
            if (loading) setLoading(false);
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

  /* function saveProfile() {

  } */

  if (loading) return null;

  // if not logged in, unmount and go to signin page
  if (!uid) {
    return navigation.navigate('SignIn');
  }

  return (
    <View>
      <LinearGradient style={styles.banner} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#aa7bb1', '#cd857a']}/>
      <View style={styles.screenContainer}>
        <View style={[styles.parentCenter, styles.top]}>
          <Text style={[styles.childCenter, styles.pageName]} >My Profile</Text>
          <Image style={[styles.childCenter, styles.profilePicture]} source={{ uri: userState.profilePic }} />
          <View style={[styles.childCenter]}>
            <Text h4>{`${userState.firstName} ${userState.lastName}`}</Text>
          </View>
          <View style={[styles.childCenter, styles.horizontalListContainer]}>
            <Text style={[styles.subtextContainer]}>{userState.role}</Text>
            {userState.gradeLevel && <Text style={[styles.subtextContainer, styles.gradeLevelContainer]}>{`Grade ${userState.gradeLevel}`}</Text>}
          </View>
        </View>
      </View>
      <View style={styles.bottom}>
      <ListItem
          leftIcon={
            <Icon 
              name='music'
              type='feather'
              containerStyle={styles.instrumentContainer}
            />
        }
          title="Instrument List"
        />
        <View style={[styles.horizontalListContainer, styles.instrumentListContainer]}>
            {instrumentList}
        </View>
        <ListItem
          leftIcon={
            <Icon 
              name='bell'
              type='feather'
            />
          }
          title="Notification Settings"
          chevron={
            <Icon 
              name='chevron-right'
              type='feather'
            />
          }
          onPress={() => {
            navigation.navigate('Notifications', { uid });
          }}
          topDivider
          bottomDivider
        />
        <ListItem
          leftIcon={
            <Icon 
              name='edit-3'
              type='feather'
            />
          }
          title="Edit Profile"
          chevron={
            <Icon 
              name='chevron-right'
              type='feather'
            />
          }
          onPress={() => {
            navigation.navigate('EditProfile', { uid });
            setLoading(true);
          }}
          bottomDivider
        />
        <ListItem
          leftIcon={
            <Icon 
              name='log-out'
              type='feather'
            />
          }
          title="Log Out"
          onPress={() => { Auth().signOut(); }}
          bottomDivider
        />
        <ListItem
          title="Home"
          onPress={() => {
            navigation.navigate('Home');
          }}
          bottomDivider
        />
        <ListItem
          title="Landing"
          onPress={() => {
            navigation.navigate('Load');
          }}
          bottomDivider
        />
      </View>
    </View>
  );
}

// eslint-disable-next-line no-unused-vars
ProfileScreen.navigationOptions = ({ navigation }) => ({
  title: 'Profile',
  headerShown: false,
});

ProfileScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
