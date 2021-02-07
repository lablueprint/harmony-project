import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import {
  Text, View, SafeAreaView, ScrollView, StyleSheet, Alert, Button, /*  TextInput, */
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import PropTypes from 'prop-types';
import Firestore from '@react-native-firebase/firestore';
// import Post from './Post';
import { INITIAL_USER_STATE } from '../../components';

const styles = StyleSheet.create({

  headingTitle: {
    fontSize: 28,
    fontWeight: '600',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

// navigation MUST INCLUDE: code, classroomInfo, uid
export default function ClassroomHome({ navigation }) {
  const uid = navigation.getParam('uid', null);
  const classroomInfo = navigation.getParam('classroomInfo', null);
  const code = navigation.getParam('code', null);
  const [userState, setUserState] = useState(INITIAL_USER_STATE);

  useEffect(() => {
    // fetch user data
    Firestore().collection('users')
      .doc(uid)
      .get()
      .then((document) => {
        if (document.exists) {
          return document.data();
        }
        return null;
      })
      .then((data) => {
        setUserState(data);
      })
      .catch((e) => {
        Alert.alert(e.message);
      });
  });

  // copies code to clipboard
  const copyToClipboard = () => {
    Clipboard.setString(code);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.headingTitle}>
            {`Hi ${userState.name}! Welcome to ${classroomInfo.name}!`}
          </Text>
          <Text style={styles.sectionDescription}>
            {`Description: ${classroomInfo.description}`}
          </Text>
          <Text style={styles.sectionDescription}>
            {`Code: ${code.toUpperCase()}`}
          </Text>
          <Button
            style={styles.textInput}
            title="Copy Code"
            onPress={copyToClipboard}
          />
          <Text style={styles.sectionDescription}>
            {`Type: ${classroomInfo.type}`}
          </Text>
          <Text style={styles.sectionDescription}>
            {`Terms: ${classroomInfo.term}`}
          </Text>
          <Text style={styles.sectionDescription}>
            {`Year: ${classroomInfo.year}`}
          </Text>
          <Text style={styles.sectionDescription}>
            {`Meet Days: ${classroomInfo.meetDays}`}
          </Text>
          <Text style={styles.sectionDescription}>
            {`Length: ${classroomInfo.classLength}`}
          </Text>
          <Text style={styles.sectionDescription}>
            {`Start: ${classroomInfo.startDate}`}
          </Text>
          <Text style={styles.sectionDescription}>
            {`End: ${classroomInfo.endDate}`}
          </Text>
          {/*
          <Button title="Make a Post!" onPress={() => navigation.navigate('Make a New Post')} />
          */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/*
// eslint-disable-next-line no-unused-vars
function MakePost() {
  return (
    <View style={{ backgroundColor: '#ffffff' }}>
      <TextInput
        style={{ height: 40 }}
        placeholder="Enter Topic"
        maxLength={25}
        fontSize={24}
        fontWeight="500"
      />
      <TextInput
        style={{ height: 200 }}
        placeholder="What's on your mind?"
        maxLength={1000}
        multiline
        numberOfLines={10}
        fontSize={18}
        fontWeight="200"
      />
      <Button title="Submit Post" />
    </View>
  );
}
*/

ClassroomHome.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};

// const Stack = createStackNavigator();

// export default function Classroom() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="Classroom One" component={ClassroomHome} />
//         <Stack.Screen name="Make a New Post" component={MakePost} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

/* Classroom works in this manner: The Classroom View has multiple classrooms.
Each classroom has students and teacher(s). Only teachers can make a post in the
classroom. Students, however, can make comments in the classrooms and produce a
"thread". In terms of slack, a classroom is a channel. Only teachers can send
stuff into the channel but students can comment on what is sent.
NEXT STEP: Build in firebase for the posts */
