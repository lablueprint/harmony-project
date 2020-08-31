import React, { useState } from 'react';
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
  // console.log(seekUntil);
  const [doPause, setDoPause] = useState(false);
  const [didSeek, setDidSeek] = useState(false);
  return (
    <Video
      controls
      onProgress={(e) => {
        if (didSeek && (e.currentTime >= seekUntil.endTime)) {
          setDoPause(true);
          setDidSeek(false);
        }
      }}
      onSeek={() => {
        setDoPause(false);
        setDidSeek(true);
      }}
      paused={doPause}
      progressUpdateInterval={100}
      ref={videoPlayer}
      source={{
        uri: videoLink,
      }}
      style={styles.video}
    />
  );
}

EvalVideo.propTypes = {
  seekUntil: PropTypes.element.isRequired,
  videoLink: PropTypes.string.isRequired,
  videoPlayer: PropTypes.element.isRequired,
};
