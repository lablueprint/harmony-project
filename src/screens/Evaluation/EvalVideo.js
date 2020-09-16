import React, { useState, useEffect } from 'react';
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
    height: '50%',
    backgroundColor: 'black',
  },
});

/**
 *
 * @param {String} videoLink A Firebase link to the submission video
 * @param {ref} videoPlayer A react-native-video ref
 * @param {Object} seekUntil An object that stores a timestamped comment's endTime
 */
export default function EvalVideo({ videoLink, videoPlayer, seekUntil }) {
  /**
   * doPause - A boolean indicating whether or not to pause the video
   */
  const [doPause, setDoPause] = useState(false);

  /**
   * didSeek - A boolean indicating whether or not the user selected a timestamp range
   * button
   */
  const [didSeek, setDidSeek] = useState(false);

  return (
    <Video
      controls
      onProgress={(e) => {
        if (didSeek && (e.currentTime >= seekUntil)) {
          setDoPause(true);
          setDidSeek(false);
        }
      }}
      onSeek={() => {
        setDoPause(false);
        setDidSeek(true);
      }}
      paused={doPause}
      ref={videoPlayer}
      source={{
        uri: videoLink,
      }}
      style={styles.video}
    />
  );
}

EvalVideo.propTypes = {
  seekUntil: PropTypes.number,
  videoLink: PropTypes.string.isRequired,
  videoPlayer: PropTypes.objectOf(PropTypes.object).isRequired,
};

EvalVideo.defaultProps = {
  seekUntil: -1,
};
