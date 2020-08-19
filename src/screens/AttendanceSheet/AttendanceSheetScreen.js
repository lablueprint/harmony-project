import React, { useState } from 'react';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import AttendanceSheet from './AttendanceSheet';

// eslint-disable-next-line no-unused-vars
export default function AttendanceSheetScreen({ navigation }) {
  return (
    <View />
  );
}

AttendanceSheetScreen.navigationOptions = ({ navigation }) => ({
  title: 'Attendance',
  headerRight: () => (
    <Button
      title="Create"
      buttonStyle={{ padding: 5, marginRight: 20 }}
      onPress={() => {
        navigation.navigate('CreateAttendance', {
          uid: navigation.getParam('uid', null),
        });
      }}
    />
  ),
});

AttendanceSheetScreen.propTypes = {
  navigation: PropTypes.elementType.isRequired,
};
