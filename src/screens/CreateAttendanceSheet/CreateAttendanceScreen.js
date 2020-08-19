import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Picker } from 'react-native';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  Table, TableWrapper, Row, Rows, Col, Cols, Cell,
} from 'react-native-table-component';

const styles = StyleSheet.create({
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  wrapper: {
    flexDirection: 'row',
  },
  row: {
    height: 35,
  },
});

export default function CreateAttendanceScreen({ navigation }) {
  const [date, setDate] = useState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(true);
  const [teacher, setTeacher] = useState({});
  const [studentStatus, setStudentStatus] = useState({});
  const [classroomId, setClassroomId] = useState('');
  const [attendanceDocID, setAttendanceDocID] = useState('');

  const uid = navigation.getParam('uid', null);

  const tableHead = ['Student', 'Status'];
  const testData = ['test', 'test'];
  const [nameData, setNameData] = useState([]);

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
      setClassroomId(teacher.classroomIds[0].id);
    }
  }, [teacher]);

  useEffect(() => {
    if (classroomId !== undefined) {
      const obj = {};
      const classroomRef = Firestore().collection('classrooms').doc(classroomId);
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
  }, [classroomId]);

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (d) => {
    d.setHours(0, 0, 0, 0);
    setDate(d);
    hideDatePicker();
  };

  useEffect(() => {
    if (date !== undefined) {
      Firestore().collection('attendance')
        .where('date', '==', Firestore.Timestamp.fromDate(date))
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            Firestore().collection('attendance').add({
              classroomId: Firestore().collection('classrooms').doc(classroomId),
              createdAt: Firestore.FieldValue.serverTimestamp(),
              date,
              studentStatus,
              teacherId: Firestore().collection('user').doc(uid),
              updatedAt: Firestore.FieldValue.serverTimestamp(),
            });
          } else {
            snapshot.forEach((doc) => {
              setAttendanceDocID(doc.id);
            });
          }
        });
    }
  }, [classroomId, date, studentStatus, uid]);

  useEffect(() => {
    if (attendanceDocID) {
      Firestore().collection('attendance').doc(attendanceDocID).update({
        studentStatus,
        updatedAt: Firestore.FieldValue.serverTimestamp(),
      });
    }
  });

  useEffect(() => {
    const names = [];
    Object.keys(studentStatus).forEach((element) => {
      Firestore().collection('users').doc(element)
        .get()
        .then((snapshot) => {
          names.push(snapshot.data().name);
          // names.push(studentStatus[element]);
        })
        .then(() => {
          setNameData(names);
        });
    });
  }, [studentStatus]);

  return (
    <View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="default"
        onCancel={() => {
          navigation.goBack(null);
        }}
        onConfirm={handleConfirm}
      />
      <Table borderStyle={{ borderWidth: 2 }}>
        <Row data={tableHead} style={styles.head} />
        <TableWrapper style={styles.wrapper}>
          <Col data={nameData} style={styles.row} />
          <Col data={testData} style={styles.row} />
        </TableWrapper>
      </Table>
    </View>
  );
}


// eslint-disable-next-line no-unused-vars
CreateAttendanceScreen.navigationOptions = ({ navigation }) => ({
  title: 'Create Attendance Sheet',
  headerShown: true,
});

CreateAttendanceScreen.propTypes = {
  navigation: PropTypes.elementType.isRequired,
};
