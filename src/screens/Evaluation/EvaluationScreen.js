import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Alert, View, Text,
} from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import Firestore from '@react-native-firebase/firestore';
import EvalVideo from './EvalVideo';
import TimestampedFeedbackList from './TimestampedFeedbackList';

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
  comment: {
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
  const [evaluation, setEvaluation] = useState({});
  const docId = 'bTzLmdl03mDOYwsZMyCP';

  const doc = Firestore().collection('evaluations').doc(docId);
  doc.get()
    .then((document) => {
      if (document.exists) {
        setEvaluation(document.data());
      }
    });

  return (
    <View style={styles.container}>
      <EvalVideo uri={evaluation.recording} style={styles.top} />
      <View style={styles.bottom}>
        <TimestampedFeedbackList evaluations={evaluation.evaluations} />
        <Button
          title="+"
          onPress={() => {
            navigation.navigate('CreateEvaluation', { doc });
          }}
        />
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
