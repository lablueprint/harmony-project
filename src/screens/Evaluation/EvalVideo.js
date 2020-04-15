import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Alert, View, Text,
} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  controlBar: {
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function EvalVideo({ docId }) {
  const [evaluation, setEvaluation] = useState({});

  Firestore().collection('evaluations').doc(docId).get()
    .then((document) => {
      if (document.exists) {
        setEvaluation(document.data());
      }
    });

  return (
    <VideoPlayer source={{ uri: evaluation.recording }} disableBack style={styles.video} />
  );
}

EvalVideo.propTypes = {
  docId: PropTypes.element.isRequired,
};
