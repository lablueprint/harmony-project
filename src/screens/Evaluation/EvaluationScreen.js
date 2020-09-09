import React, { useState, useEffect, useRef } from 'react';
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
  timestampedFeedback: {
  },
});

export default function EvaluationScreen() {
  const videoPlayer = useRef(null);

  const [evaluationDoc, setEvaluationDoc] = useState({});
  const [evaluations, setEvaluations] = useState([]);
  const [evaluationsLoaded, setEvaluationsLoaded] = useState(false);
  const [seekUntil, setSeekUntil] = useState(null);
  const [videoLinkLoaded, setVideoLinkLoaded] = useState(false);
  const [videoLink, setVideoLink] = useState();

  const docId = 'bTzLmdl03mDOYwsZMyCP';

  Firestore().collection('evaluations')
    .doc(docId)
    .get()
    .then((document) => {
      if (document.exists) {
        setEvaluationDoc(document.data());
      }
    });

  useEffect(() => {
    setVideoLink(evaluationDoc.recording);
    setEvaluations(evaluationDoc.evaluations);
  }, [evaluationDoc]);

  useEffect(() => {
    if (videoLink !== undefined) {
      setVideoLinkLoaded(true);
    }
  }, [videoLink]);

  useEffect(() => {
    if (evaluations !== undefined && evaluations.length !== 0) {
      setEvaluationsLoaded(true);
    }
  }, [evaluations]);

  return (
    <View style={styles.container}>
      {videoLinkLoaded
      && (
      <EvalVideo
        videoLink={videoLink}
        seekUntil={seekUntil}
        videoPlayer={videoPlayer}
        style={styles.video}
      />
      )}
      <View style={styles.bottomContainer}>
        {evaluationsLoaded && (
        <TimestampedFeedbackList
          evaluations={evaluations}
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
