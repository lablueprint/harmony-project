import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  contentContainer: {
    paddingTop: 20,
  },
  timeText: {
    fontSize: 11,
  },
  topicText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: 14,
  },
});


export default function Post({
  topic, time, date, children,
}) {
  return (
    <View style={styles.container}>
      <View>
        <View>
          <Text style={styles.topicText}>
            {topic}
          </Text>
          <Text style={styles.timeText}>
            {time}
          </Text>
          <Text style={styles.timeText}>
            {date}
          </Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text>
          {children}
        </Text>
      </View>
    </View>
  );
}

Post.propTypes = {
  topic: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
};
