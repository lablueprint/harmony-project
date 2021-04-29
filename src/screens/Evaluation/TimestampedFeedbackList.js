import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import {
  StyleSheet, View, Text, TouchableWithoutFeedback,
} from 'react-native';
import Post from '../../components/Post/Post';
import { convertToMinSec } from './MathFunctions';

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

/**
 *
 * @param {Array} evaluations An array of timestamped feedback comments
 * @param {Function} setSeekUntil Sets seekUntil to the timestamped comment's endTime
 * @param {ref} videoPlayer A react-native-video ref
 */
export default function TimestampedFeedbackList({
  evaluations, setRange, videoPlayer,
}) {
  /**
   * listItems - For every comment in the evaluations array, create a:
   *    - TouchableWithoutFeedback: A button that seeks to the comment's startTime
   *      and sends the endTime to the EvalVideo
   *    - Post: A post containing the comment's title and contents
   */
  const listItems = evaluations.map((evaluationsListItem, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <View style={styles.container} key={index}>
      {evaluationsListItem.startTime
      && (
      <TouchableWithoutFeedback
        onPress={() => {
          videoPlayer.current.seek(evaluationsListItem.startTime);
          setRange(
            {
              startTime: evaluationsListItem.startTime,
              endTime: evaluationsListItem.endTime,
              length: evaluationsListItem.endTime - evaluationsListItem.startTime,
            },
          );
        }}
        style={styles.timestamp}
      >
        <Text style={styles.text}>{`${convertToMinSec(evaluationsListItem.startTime)}`}</Text>
      </TouchableWithoutFeedback>
      )}
      <Post
        title={evaluationsListItem.title}
        body={evaluationsListItem.body}
        style={styles.comment}
        collection="fixme"
      />
    </View>
  ));

  /**
   * Present listItems in a ScrollView (allows the user to scroll)
   */
  return (
    <ScrollView>
      <>{listItems}</>
    </ScrollView>
  );
}

TimestampedFeedbackList.propTypes = {
  // navigation: PropTypes.element.isRequired,
  setRange: PropTypes.func.isRequired,
  evaluations: PropTypes.arrayOf(PropTypes.object).isRequired,
  videoPlayer: PropTypes.objectOf(PropTypes.object).isRequired,
};
