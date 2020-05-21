import React, { useState } from 'react';
import {
  View, StyleSheet, Text,
} from 'react-native';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  student: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

function Student({ student }) {
  const [name, setName] = useState('');

  Firestore().collection('users').doc(student[0]).get()
    .then((doc) => {
      if (doc.exists) {
        setName(doc.data().name);
      }
    });

  return (
    <View style={styles.student}>
      <Text>{name}</Text>
      <Text>{student[1]}</Text>
    </View>
  );
}

export default function AttendanceSheet({ date, studentStatuses }) {
  const student = studentStatuses.map((i) => (<Student student={i} />));
  return (
    <View>
      <Text>{date}</Text>
      {student}
    </View>
  );
}

Student.propTypes = {
  student: PropTypes.element.isRequired,
};

AttendanceSheet.propTypes = {
  date: PropTypes.element.isRequired,
  studentStatuses: PropTypes.element.isRequired,
};
