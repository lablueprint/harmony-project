import React from 'react';
import {
  View, Text, StyleSheet, Image,
} from 'react-native';
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
  title, createdAt, date, body, attachment,
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
        {attachment ? (
          <Image
            style={{ width: '100%', height: 200, resizeMode: 'center' }}
            source={{ uri: attachment }}
          />
        ) : null}
      </View>
    </View>
  );
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  attachment: PropTypes.string.isRequired,
};
