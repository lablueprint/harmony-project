import React, { useState } from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import { Button } from 'react-native-elements';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import DateTimePickerModal from 'react-native-modal-datetime-picker';


const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
});

export default function CreateAttendanceScreen({ navigation }) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const [date, setDate] = useState(currentDate);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [teacher, setTeacher] = useState({});
  const [studentStatus, setStudentStatus] = useState({});
  const [attendanceDocID, setAttendanceDocID] = useState('');
  const [createOrEdit, setCreateOrEdit] = useState('Create');
  const [hasExistingEntry, setHasExistingEntry] = useState(false);

  const uid = navigation.getParam('uid', null);

  function loadData() {
    Firestore().collection('users').doc(uid).get()
      .then((document) => {
        if (document.exists) {
          setTeacher(document.data());
        }
      })
      .catch((e) => {
        console.log('Problem with finding TEACHER in users.');
        throw e;
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
        })
        .catch((e) => {
          console.log('Problem with finding STUDENT(s) in classroom.');
          throw e;
        });
    }

    Firestore().collection('attendance')
      .where('date', '==', Firestore.Timestamp.fromDate(date))
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          setHasExistingEntry(true);
        }
        snapshot.forEach((doc) => {
          setAttendanceDocID(doc.id);
        });
      });
  }

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (d) => {
    setDate(d);
    console.log(d);
    console.log(date);
    if (hasExistingEntry && attendanceDocID) {
      Firestore().collection('attendance').doc(attendanceDocID).update({
        updatedAt: Firestore.FieldValue.serverTimestamp(),
        studentStatus,
      });
    } else {
      Firestore().collection('attendance').add({
        createdAt: Firestore.FieldValue.serverTimestamp(),
        updatedAt: Firestore.FieldValue.serverTimestamp(),
        date: Firestore.Timestamp.fromDate(date),
        studentStatus,
        teacherId: Firestore().collection('users').doc(uid),
      });
    }
  };

  return (
    <View>
      <DateTimePickerModal
        isVisible
        mode="default"
        onCancel={hideDatePicker}
        onConfirm={handleConfirm}
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
