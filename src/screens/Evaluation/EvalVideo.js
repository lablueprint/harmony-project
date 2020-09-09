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

export default function EvalVideo({ videoLink, videoPlayer, seekUntil }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [doPause, setDoPause] = useState(false);
  const [didSeek, setDidSeek] = useState(false);

  useEffect(() => {
    if (doPause) {
      console.log(currentTime);
    }
  }, [doPause, currentTime]);

  return (
    <Video
      controls
      onProgress={(e) => {
        if (didSeek && (e.currentTime >= seekUntil)) {
          setCurrentTime(e.currentTime);
          setDoPause(true);
          setDidSeek(false);
        }
      }}
      onSeek={() => {
        setDoPause(false);
        setDidSeek(true);
      }}
      paused={doPause}
      // progressUpdateInterval={10}
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
