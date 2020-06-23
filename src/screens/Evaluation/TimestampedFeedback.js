import React from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import Post from '../../components/Post/Post';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeMessage: {
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 50,
    fontSize: 20,
  },
});


export default function TimestampedFeedback({
  // navigation, title, startTime, endTime, comment,
  title, comment,
}) {
  return (
    <View style={styles.container}>
      <Post
        title={title}
        body={comment}
      />


    </View>

  );
}

TimestampedFeedback.propTypes = {
  // navigation: PropTypes.elementType.isRequired,
  title: PropTypes.elementType.isRequired,
  // startTime: PropTypes.elementType.isRequired,
  // endTime: PropTypes.elementType.isRequired,
  comment: PropTypes.elementType.isRequired,
};
