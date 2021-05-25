/* eslint-disable react/forbid-prop-types */
import React from 'react';
import {
  View, Text, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { ListItem, Avatar } from 'react-native-elements';

const styles = StyleSheet.create({
  titleView: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5,
    fontSize: 15,
    color: '#BDBDBD',
  },
  subtitleView: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5,
    color: '#4F4F4F',
  },
});

export default function FeedbackPost({
  time, message, videoPlayer, scrollRef,
}) {
  // Gets a time value and outputs the appropripate minutes:seconds text
  function getTime(unprocessedTime) {
    const minutes = unprocessedTime >= 60 ? Math.floor(unprocessedTime / 60) : 0;
    const seconds = Math.round(unprocessedTime - minutes * 60);

    return `${minutes >= 10 ? minutes : `0${minutes}`}:${
      seconds >= 10 ? seconds : `0${seconds}`
    }`;
  }

  return (
    <View style={{ position: 'relative', top: 25 }}>
      <ListItem
        leftIcon={time ? (
          <Avatar
            rounded
            icon={{ name: 'play-circle', type: 'feather' }}
            onPress={() => {
              videoPlayer.current.seek(time);
              scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
            }}
            size="small"
            activeOpacity={0.7}
          />
        )
          : (

            <Avatar
              rounded
              icon={{ name: 'message-circle', type: 'feather' }}
              size="small"
            />
          )}
        title={time
          ? (
            <View>
              <Text style={styles.titleView}>{getTime(time)}</Text>
            </View>
          )
          : (
            <View>
              <Text style={styles.titleView}>General Feedback</Text>
            </View>
          )}
        subtitle={(
          <View>
            <Text style={styles.subtitleView}>{message}</Text>
          </View>
          )}
      />
    </View>
  );
}

FeedbackPost.propTypes = {
  time: PropTypes.number,
  message: PropTypes.string.isRequired,
  videoPlayer: PropTypes.object.isRequired,
  scrollRef: PropTypes.object.isRequired,
};

FeedbackPost.defaultProps = {
  time: null,
};
