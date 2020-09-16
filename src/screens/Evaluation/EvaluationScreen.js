import React, { useState, useRef } from 'react';
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
  bottomContainer: {
    width: '100%',
    height: '50%',
  },
});

/**
 * Returns an EvaluationScreen with a submission video and the teacher's timestamped
 * feedback comments
 */
export default function EvaluationScreen() {
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
  const [seekUntil, setSeekUntil] = useState(null);

  /**
   * docId - (In the future, this should be retrieved from navigation, etc. rather than being
   * "hardcoded") Is the document ID of an example evaluation scrren in Firestore
   */
  const docId = 'bTzLmdl03mDOYwsZMyCP';

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
        seekUntil={seekUntil}
        videoPlayer={videoPlayer}
        style={styles.video}
      />
      )}
      <View style={styles.bottomContainer}>
        {evaluationDoc.evaluations && (
        <TimestampedFeedbackList
          evaluations={evaluationDoc.evaluations}
          videoPlayer={videoPlayer}
          setSeekUntil={setSeekUntil}
          style={styles.timestampedFeedback}
        />
        )}
      </View>
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
