import React, { useState } from 'react';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import AttendanceSheet from './AttendanceSheet';


// eslint-disable-next-line no-unused-vars
export default function AttendanceSheetScreen({ navigation }) {
  const [listItems, setListItems] = useState([]);

  Firestore().collection('attendance').get()
    .then((snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      return list;
    })
    .then((x) => {
      setListItems(x);
    });

  return listItems.map((i) => (
    <AttendanceSheet
      key={i.id}
      date={i.date.toDate().toDateString()}
      studentStatuses={Object.entries(i.studentStatus)}
    />
  ));
}

// eslint-disable-next-line no-unused-vars
AttendanceSheetScreen.navigationOptions = ({ navigation }) => ({
  title: 'Attendance',
  headerShown: true,
});

AttendanceSheetScreen.propTypes = {
  navigation: PropTypes.elementType.isRequired,
};
