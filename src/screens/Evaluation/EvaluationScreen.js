import React, { useState, useEffect } from 'react';
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
  const [videoLinkLoaded, setVideoLinkLoaded] = useState(false);
  const [videoLink, setVideoLink] = useState();

  const docId = 'bTzLmdl03mDOYwsZMyCP';

  Firestore().collection('evaluations')
    .doc(docId)
    .get()
    .then((document) => {
      if (document.exists) {
        setEvaluation(document.data());
      }
    });

  useEffect(() => {
    setVideoLink(evaluation.recording);
  }, [evaluation]);

  useEffect(() => {
    if (videoLink !== undefined) {
      setVideoLinkLoaded(true);
    }
  }, [videoLink]);

  return (
    <View style={styles.container}>
      {videoLinkLoaded && <EvalVideo videoLink={videoLink} style={styles.video} />}
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
