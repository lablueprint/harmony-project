import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet, View,
} from 'react-native';
// import PropTypes from 'prop-types';
import Firestore from '@react-native-firebase/firestore';
import EvalVideo from './EvalVideo';
import TimestampedFeedbackList from './TimestampedFeedbackList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  commentsContainer: {
    width: '100%',
    height: '50%',
  },
});

/**
 * Returns an EvaluationScreen with a submission video and the teacher's timestamped
 * feedback comments
 */
export default function EvaluationScreen({ navigation }) {
  /**
   * videoPlayer - Allows TimestampedFeedbackList to access EvalVideo's seek() function
   */
  const videoPlayer = useRef(null);

  /**
   * evaluationDoc - A document in the evaluations collection that corresponds to a single
   * evaluation screen
   *
   * setEvaluationDoc - A function called after the evaluation document has been retrieved
   * from Firebase
   */
  const [evaluationDoc, setEvaluationDoc] = useState({});

  /**
   * seekUntil - An object that stores the endTime of a timestamp range
   *
   * setSeekUntil - A function called by TimestampedFeedbackList's timestamped-comment buttons
   */
  const [range, setRange] = useState({});

  /**
   * docId - (In the future, this should be retrieved from navigation, etc. rather than being
   * "hardcoded") Is the document ID of an example evaluation scrren in Firestore
   */
  const docId = navigation.getParam('uid', null);

  /**
   * Uses the docId to retrieve a particular evaluation document.
   */
  Firestore().collection('evaluations')
    .doc(docId)
    .get()
    .then((document) => {
      if (document.exists) {
        return document.data();
      }
      return null;
    })
    .then((doc) => {
      setEvaluationDoc(doc);
    });

  return (
    <View style={styles.container}>
      {evaluationDoc.recording
      && (
      <EvalVideo
        videoLink={evaluationDoc.recording}
        range={range}
        setRange={setRange}
        videoPlayer={videoPlayer}
      />
      )}
      <View style={styles.commentsContainer}>
        {evaluationDoc.evaluations && (
        <TimestampedFeedbackList
          evaluations={evaluationDoc.evaluations}
          videoPlayer={videoPlayer}
          setRange={setRange}
        />
        )}
      </View>
    </View>
  );
}

// // eslint-disable-next-line no-unused-vars
// EvaluationScreen.navigationOptions = ({ navigation }) => ({
//   title: 'Evaluation',
//   headerShown: true, // button within the header to go back to the (homescreen)
// });

/*
EvaluationScreen.propTypes = {
  navigation: PropTypes.elementType.isRequired,
};
*/

EvaluationScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,

  }).isRequired,
};
