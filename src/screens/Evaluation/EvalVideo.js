import React, { useState } from 'react';
import Video from 'react-native-video';
import {
  Text, View, StyleSheet, TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import { convertToMinSec } from './MathFunctions';
import ProgressBar from './ProgressBar';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  controls: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: 48,
    left: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  mainButton: {
    marginRight: 15,
  },
  duration: {
    color: '#FFF',
    marginLeft: 15,
  },
});

/**
 *
 * @param {String} videoLink A Firebase link to the submission video
 * @param {ref} videoPlayer A react-native-video ref
 * @param {Object} seekUntil An object that stores a timestamped comment's endTime
 */
export default function EvalVideo({
  videoLink, videoPlayer, range, setRange,
}) {
  /**
   * doPause - A boolean indicating whether or not to pause the video
   */
  const [doPause, setDoPause] = useState(false);

  /**
   * didSeek - A boolean indicating whether or not the user selected a timestamp range
   * button
   */
  const [didSeek, setDidSeek] = useState(false);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleEnd = () => {
    setDoPause(true);
    setProgress(1);
  };

  const handleLoad = (meta) => {
    setDuration(meta.duration);
  };

  const handleMainButtonTouch = () => {
    if (progress >= 1) {
      videoPlayer.current.seek(0);
      setRange({
        startTime: 0,
        endTime: duration,
        length: 0,
      });
    } else {
      setDoPause(!doPause);
    }
  };

  const handleProgress = (meta) => {
    setProgress(meta.currentTime / duration);
    if (didSeek && (meta.currentTime >= range.endTime)) {
      setDoPause(true);
      setDidSeek(false);
    }
  };

  const handleProgressPress = (e) => {
    console.log('handleProgressPress');
    const position = e.nativeEvent.locationX;
    console.log(position);
    const calculatedProgress = (position / 250) * duration;
    videoPlayer.current.seek(calculatedProgress);
  };

  const handleSeek = (e) => {
    setProgress(e.currentTime / duration);
    setDoPause(false);
    setDidSeek(true);
  };

  return (
    <View style={styles.container}>
      <Video
        onEnd={handleEnd}
        onLoad={handleLoad}
        onProgress={handleProgress}
        onSeek={handleSeek}
        paused={doPause}
        ref={videoPlayer}
        source={{
          uri: videoLink,
        }}
        style={styles.video}
      />
      <View style={styles.controls}>
        <TouchableWithoutFeedback onPress={handleMainButtonTouch}>
          <Icon name={!doPause ? 'pause' : 'play'} size={30} color="#FFF" />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={handleProgressPress}>
          <ProgressBar
            range={{
              startPercentage: Number(range.startTime) / duration,
              widthRatio: Number(range.length) / duration,
            }}
            progress={progress}
            highlightColor="#2196F3"
            foregroundColor="#FFF"
            backgroundColor="rgba(255,255,255,.5)"
            width={250}
            height={20}
          />
        </TouchableWithoutFeedback>
        <Text style={styles.duration}>{convertToMinSec(Math.floor(progress * duration))}</Text>
      </View>
    </View>
  );
}

EvalVideo.propTypes = {
  range: PropTypes.shape({
    startTime: PropTypes.number,
    endTime: PropTypes.number,
    length: PropTypes.number,
  }),
  setRange: PropTypes.func,
  videoLink: PropTypes.string.isRequired,
  videoPlayer: PropTypes.objectOf(PropTypes.object).isRequired,
};

EvalVideo.defaultProps = {
  range: {
    startTime: 0,
    endTime: 0,
    length: 0,
  },
  setRange: () => {},
};
