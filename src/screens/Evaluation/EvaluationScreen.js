import React, { useState } from 'react';
import {
  StyleSheet, View,
} from 'react-native';
// import { Button } from 'react-native-elements';
// import PropTypes from 'prop-types';
import Firestore from '@react-native-firebase/firestore';
import EvalVideo from './EvalVideo';
// import TimestampedFeedbackList from './TimestampedFeedbackList';

const styles = StyleSheet.create({
  video: {
    height: '40%',
  },
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

export default function EvaluationScreen() {
  const [evaluation, setEvaluation] = useState({});
  const [video, setVideo] = useState();
  const docId = 'bTzLmdl03mDOYwsZMyCP';

  Firestore().collection('evaluations')
    .doc(docId)
    .get()
    .then((document) => {
      if (document.exists) {
        setEvaluation(document.data());
        console.log(evaluation);
        setVideo();
      }
      return document.recording;
    });


  return (
    <View style={styles.container}>
      <EvalVideo uri={video} style={styles.video} />
    </View>
  );
}

// eslint-disable-next-line no-unused-vars
EvaluationScreen.navigationOptions = ({ navigation }) => ({
  title: 'Evaluation',
  headerShown: true, // button within the header to go back to the (homescreen)
});

/*
EvaluationScreen.propTypes = {
  navigation: PropTypes.elementType.isRequired,
};
*/
