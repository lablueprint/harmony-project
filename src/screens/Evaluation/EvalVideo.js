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

export default function EvalVideo({ videoLink }) {
  return (
    <Video
      source={{
        uri: videoLink,
      }}
      controls
      style={styles.video}
    />
  );
}

EvalVideo.propTypes = {
  videoLink: PropTypes.element.isRequired,
};
