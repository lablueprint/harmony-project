import React from 'react';
import {
  View, StyleSheet, Text,
} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    width: '95%',
    borderWidth: 2,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingTop: 2,
    paddingRight: 2,
    paddingBottom: 2,
    paddingLeft: 2,
    margin: 2,
  },
});

export default function TimestampedFeedback({ startTime, endTime, comment }) {
  return (
    <View style={styles.container}>
      <Text>
        {startTime}
        {' '}
        {endTime}
        {' '}
        {comment}
      </Text>
    </View>
  );
}

TimestampedFeedback.propTypes = {
  startTime: PropTypes.elementType.isRequired,
  endTime: PropTypes.elementType.isRequired,
  comment: PropTypes.elementType.isRequired,
};
