import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
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

export default function EvalVideo({ uri }) {
  return (
    <VideoPlayer source={{ uri }} disableBack style={styles.video} />
  );
}

EvalVideo.propTypes = {
  uri: PropTypes.element.isRequired,
};
