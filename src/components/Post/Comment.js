import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#e3e3e3',
    borderRadius: 10,
  },
  contentContainer: {
    paddingTop: 20,
  },
  timeText: {
    fontSize: 11,
  },
  topicText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: 14,
  },
});


export default function Comment({
  title, createdAt, date, body,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.topicText}>
        {title}
      </Text>
      <Text style={styles.timeText}>
        {createdAt}
      </Text>
      <Text style={styles.timeText}>
        {date}
      </Text>
      <View style={styles.contentContainer}>
        <Text>
          {body}
        </Text>
      </View>
    </View>
  );
}

Comment.propTypes = {
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};