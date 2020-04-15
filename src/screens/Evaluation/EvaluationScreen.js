import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Alert, View, Text,
} from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import Firestore from '@react-native-firebase/firestore';
import TimestampedFeedback from './TimestampedFeedback';
import EvalVideo from './EvalVideo';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    height: 400,
    padding: 20,
  },
  subContainer: {
    marginBottom: 20,
    padding: 5,
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 18,
    margin: 5,
    width: 200,
  },
  post: {
    position: 'relative',
  },
  video: {
    backgroundColor: 'black',
  },
  comment: {
    top: '40%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    marginTop: 5,
    marginLeft: 3,
    marginBottom: 5,
    marginRight: 3,
  },
});

export default function EvaluationScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <EvalVideo docId="bTzLmdl03mDOYwsZMyCP" style={styles.video} />

      <View style={styles.comment}>
        <TimestampedFeedback startTime="0:00" endTime="0:07" comment="pls work" />
        <TimestampedFeedback startTime="0:00" endTime="0:07" comment="pls work" />
        <TimestampedFeedback startTime="0:00" endTime="0:07" comment="pls work" />
      </View>

    </View>
  );
}

// eslint-disable-next-line no-unused-vars
EvaluationScreen.navigationOptions = ({ navigation }) => ({
  title: 'Evaluation',
  headerShown: true, // button within the header to go back to the (homescreen)
});

EvaluationScreen.propTypes = {
  navigation: PropTypes.elementType.isRequired,
};
