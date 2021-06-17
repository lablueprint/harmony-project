import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import {
  // eslint-disable-next-line no-unused-vars
  View, Button, Text, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import Firestore from '@react-native-firebase/firestore';
import { Card } from 'react-native-elements';

// eslint-disable-next-line no-unused-vars
const styles = StyleSheet.create({

  headingTitle: {
    fontSize: 28,
    fontWeight: '600',
  },
  container: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
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
  buttons:
 {
   color: 'blue',
   paddingLeft: 35,
   fontSize: 15,
 },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 75,

  },
});

export default function StudentsNamesScreen({ route, navigation }) {
  const { studentIDs } = route.params;
  const [students, setStudents] = useState([]);

  useEffect(() => {
    console.log(studentIDs);

    async function getSingleStudent(id) {
      let name = null;
      await Firestore().collection('users').doc(id)
        .get()
        .then((doc) => { name = doc.data().name; });
      return (
        <Card
          title={name}
          titleStyle={{
            textAlign: 'left',
          }}
          containerStyle={{ padding: 20 }}
        />
      );
    }

    const getStudents = async () => Promise.all(studentIDs.map(
      async (id) => getSingleStudent(id),
    ));
    async function setStudentsList() {
      const res = await getStudents();
      setStudents(res);
    }
    setStudentsList();
  }, [navigation]);

  return (
    <ScrollView>
      {students}
    </ScrollView>
  );
}

StudentsNamesScreen.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.func.isRequired,
  }).isRequired,
};
