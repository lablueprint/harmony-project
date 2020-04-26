import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Alert, View, Text,
} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
});

export default function EvalVideo({ uri }) {
  return (
    <VideoPlayer source={{ uri }} disableBack style={styles.video} />
  );
}

EvalVideo.propTypes = {
  uri: PropTypes.element.isRequired,
};
