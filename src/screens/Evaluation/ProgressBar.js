import React, { useEffect, useRef } from 'react';

import PropTypes from 'prop-types';
import {
  Animated, View,
} from 'react-native';

export default function ProgressBar({
  range, progress, highlightColor, foregroundColor, backgroundColor, width, height,
}) {
  const progressAnim = useRef(new Animated.Value(0));
  const highlightTransAnim = useRef(new Animated.Value(0));
  const highlightWidthAnim = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progressAnim.current, {
      toValue: progress,
      duration: 100,
    }).start();

    Animated.timing(highlightTransAnim.current, {
      toValue: (range.startPercentage ? range.startPercentage : 0),
      duration: 100,
    }).start();

    Animated.timing(highlightWidthAnim.current, {
      toValue: (range.widthRatio ? range.widthRatio : 0),
      duration: 100,
    }).start();
  }, [progress, range]);

  const progressToWidth = progressAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });

  const startTime2Translate = highlightTransAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });

  const toWidth = highlightWidthAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });

  const containerStyle = {
    backgroundColor, width, height,
  };

  const barStyle = {
    backgroundColor: foregroundColor,
    width: progressToWidth,
    height,
  };

  const highlightStyle = {
    backgroundColor: highlightColor,
    width: toWidth,
    height,
    transform: [
      { translateX: startTime2Translate },
    ],
  };

  return (
    <View style={containerStyle}>
      <Animated.View style={barStyle}>
        <Animated.View style={highlightStyle} />
      </Animated.View>
    </View>
  );
}

ProgressBar.propTypes = {
  range: PropTypes.shape({
    doHighlight: PropTypes.bool,
    startPercentage: PropTypes.number,
    widthRatio: PropTypes.number,
  }),
  progress: PropTypes.number.isRequired,
  highlightColor: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  foregroundColor: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

ProgressBar.defaultProps = {
  range: {
    doHighlight: false,
    startPercentage: 0,
    widthRatio: 1,
  },
};
