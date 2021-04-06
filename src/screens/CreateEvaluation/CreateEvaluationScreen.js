/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, Alert,
} from 'react-native';
import { Button } from 'react-native-elements';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export default function CreateEvaluationScreen({ navigation }) {
  const [startValue, onChangeStart] = useState('');
  const [endValue, onChangeEnd] = useState('');
  const [comment, onChangeComment] = useState('');

  const doc = navigation.getParam('doc', '');
  // const submission = navigation.getParam('submissionID', '');

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text>Start time:</Text>
        <TextInput placeholder="Start Time" value={startValue} onChangeText={(text) => onChangeStart(text)} keyboardType="numeric" />
      </View>
      <View style={styles.row}>
        <Text>End time:</Text>
        <TextInput placeholder="End Time" value={endValue} onChangeText={(text) => onChangeEnd(text)} keyboardType="numeric" />
      </View>
      <View style={styles.row}>
        <Text>Comment:</Text>
        <TextInput placeholder="Comment" value={comment} onChangeText={(text) => onChangeComment(text)} />
      </View>
      <Button
        title="Create"
        onPress={() => {
          if (endValue === '' || startValue === '') {
            Alert.alert('Please enter a start and end time');
          } else if (parseInt(endValue, 10) < parseInt(startValue, 10)) {
            Alert.alert('Start Time must come before End Time');
          } else {
            const newEval = {
              endTime: endValue,
              startTime: startValue,
              comment,
            };
            if (doc !== '') {
              doc.update({
                evaluations: Firestore.FieldValue.arrayUnion(newEval),
              });
            }
            navigation.navigate('Evaluation');
          }
        }}
      />
    </View>
  );
}

// eslint-disable-next-line no-unused-vars
CreateEvaluationScreen.navigationOptions = ({ navigation }) => ({
  title: 'Create Evaluation',
  headerShown: true, // button within the header to go back to the (homescreen)
});

CreateEvaluationScreen.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
