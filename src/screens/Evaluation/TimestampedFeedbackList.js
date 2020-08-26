import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import {
  StyleSheet, View, Text, TouchableWithoutFeedback,
} from 'react-native';
import Post from '../../components/Post/Post';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '78%',
  },
  text: {
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 10,
    padding: 10,
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: '#2196F3',
    height: 40,
  },
});

export default function TimestampedFeedbackList({ evaluations, videoPlayer }) {
  function convertToMinSec(totalSeconds) {
    let seconds = totalSeconds % 60;
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    const minutes = Math.floor(totalSeconds / 60);
    return `${minutes}:${seconds}`;
  }

  const listItems = evaluations.map((i) => (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => { videoPlayer.current.seek(i.startTime); }}
        style={styles.timestamp}
      >
        <Text style={styles.text}>{`${convertToMinSec(i.startTime)}-${convertToMinSec(i.endTime)}`}</Text>
      </TouchableWithoutFeedback>
      <Post
        title={i.title}
        body={i.comment}
        style={styles.comment}
      />
    </View>
  ));

  return (
    <ScrollView>
      <>{listItems}</>
    </ScrollView>
  );
}

TimestampedFeedbackList.propTypes = {
  // navigation: PropTypes.element.isRequired,
  videoPlayer: PropTypes.element.isRequired,
  evaluations: PropTypes.element.isRequired,
};
