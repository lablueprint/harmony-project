import React, { useState } from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import { Button } from 'react-native-elements';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import CalendarPicker from 'react-native-calendar-picker';

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
});

export default function CreateAttendanceScreen({ navigation }) {
  const currentDate = new Date();
  const [date, setDate] = useState(currentDate);
  const [teacher, setTeacher] = useState({});
  const [studentStatus, setStudentStatus] = useState({});
  const [attendanceDocID, setAttendanceDocID] = useState({});
  const [createOrEdit, setCreateOrEdit] = useState('Create');

  const uid = navigation.getParam('uid', null);

  Firestore().collection('users').doc(uid).get()
    .then((document) => {
      if (document.exists) {
        setTeacher(document.data());
      }
    });

  if (Object.keys(teacher).length !== 0) {
    const obj = {};
    const classroomRef = Firestore().collection('classrooms').doc(teacher.classroomIds[0].id);
    Firestore().collection('users')
      .where('role', '==', 'STUDENT')
      .where('classroomIds', 'array-contains', classroomRef)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          obj[doc.id] = 'Present';
        });
        setStudentStatus(obj);
      });
  }

  Firestore().collection('attendance')
    .where('date', '==', date)
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        setCreateOrEdit('Edit');
      }
      snapshot.forEach((doc) => {
        setAttendanceDocID(doc.id);
      });
    });

  return (
    <View>
      <CalendarPicker onDateChange={(d) => setDate(d.startOf('day').toDate())} style={styles.hidden} />
      <Button
        title={createOrEdit}
        onPress={() => {
          if (Object.keys(attendanceDocID).length === 0) {
            Firestore().collection('attendance').add({
              classroomId: Firestore().collection('users').doc(teacher.classroomIds[0].id),
              createdAt: Firestore.FieldValue.serverTimestamp(),
              updatedAt: Firestore.FieldValue.serverTimestamp(),
              date: Firestore.Timestamp.fromDate(date),
              studentStatus,
              teacherId: Firestore().collection('users').doc(uid),
            });
          } else {
            Firestore().collection('attendance').doc(attendanceDocID).update({
              classroomId: Firestore().collection('users').doc(teacher.classroomIds[0].id),
              updatedAt: Firestore.FieldValue.serverTimestamp(),
              studentStatus,
              teacherId: Firestore().collection('users').doc(uid),
            });
          }
        }}
      />
    </View>
  );
}

// eslint-disable-next-line no-unused-vars
CreateAttendanceScreen.navigationOptions = ({ navigation }) => ({
  title: 'Select Date',
  headerShown: true,
});

CreateAttendanceScreen.propTypes = {
  navigation: PropTypes.elementType.isRequired,
};
