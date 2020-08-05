import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function CreateAttendanceScreen({ navigation }) {
  const [date, setDate] = useState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(true);
  const [teacher, setTeacher] = useState({});
  const [studentStatus, setStudentStatus] = useState({});
  const [attendanceDocID, setAttendanceDocID] = useState('');

  const uid = navigation.getParam('uid', null);

  useEffect(() => {
    Firestore().collection('users').doc(uid).get()
      .then((document) => {
        if (document.exists) {
          setTeacher(document.data());
        }
      })
      .catch((e) => {
        console.log('Problem finding TEACHER in users.');
        throw e;
      });
  }, [uid]);

  useEffect(() => {
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
          console.log('Problem finding STUDENT(s) in classroom.');
          throw e;
        });
    }
  }, [teacher]);

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (d) => {
    d.setHours(0, 0, 0, 0);
    setDate(d);
  };

  useEffect(() => {
    if (date !== undefined) {
      Firestore().collection('attendance')
        .where('date', '==', Firestore.Timestamp.fromDate(date))
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            Firestore().collection('attendance').add({
              createdAt: Firestore.FieldValue.serverTimestamp(),
              date,
              studentStatus,
              updatedAt: Firestore.FieldValue.serverTimestamp(),
            });
          } else {
            snapshot.forEach((doc) => {
              setAttendanceDocID(doc.id);
            });
          }
        });
    }
  }, [date, studentStatus]);

  useEffect(() => {
    if (attendanceDocID) {
      Firestore().collection('attendance').doc(attendanceDocID).update({
        studentStatus,
        updatedAt: Firestore.FieldValue.serverTimestamp(),
      });
    }
  });

  return (
    <View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
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
