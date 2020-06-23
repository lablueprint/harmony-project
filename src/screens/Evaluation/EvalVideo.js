import React from 'react';
import Video from 'react-native-video';
import {
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default function EvalVideo({ uri }) {
  console.log(uri);
  return (
    <Video
      source={{ uri }}
      controls
      style={styles.video}
    />
  );
}

EvalVideo.propTypes = {
  uri: PropTypes.element.isRequired,
};
