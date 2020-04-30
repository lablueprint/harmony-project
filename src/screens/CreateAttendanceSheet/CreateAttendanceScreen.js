import React, { useState } from 'react';
import {
  StyleSheet, View, Text, Alert,
} from 'react-native';
import { Button, Input } from 'react-native-elements';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import CalendarPicker from 'react-native-calendar-picker';
import Moment from 'moment';
import { useScreens } from 'react-native-screens';

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
});

export default function CreateAttendanceScreen({ navigation }) {
  const currentDate = new Moment();
  const [date, setDate] = useState(currentDate.format('MM/DD/YYYY'));
  const [teacher, setTeacher] = useState('');
  const [attendance, setAttendance] = useState('');

  const uid = navigation.getParam('uid', null);
  const teacherRef = Firestore().collection('users').doc(uid);
  teacherRef.get()
    .then((document) => {
      if (document.exists) {
        setTeacher(document.data());
      }
    });
  if (teacher) {
    console.log(teacher.classroomIds);
  }

  const attendanceDoc = Firestore().collection('attendance').doc('test');
  let newAttendanceSheet = null;
  if (typeof teacher !== 'undefined') {
    newAttendanceSheet = {
      studentStatus: [],
      createdAt: currentDate.format(),
      teacherId: teacher,
      date,
    };
  }
  return (
    <View>
      <Button
        title={date}

      />
      <CalendarPicker onDateChange={(d) => setDate(d.format('MM/DD/YYYY'))} style={styles.hidden} />

    </View>
  );
}

CreateAttendanceScreen.navigationOptions = ({ navigation }) => ({
  title: 'Create Attendance Sheet',
  headerShown: true,
});

CreateAttendanceScreen.propTypes = {
  navigation: PropTypes.elementType.isRequired,
};
