import React from 'react';
import {
  View, StyleSheet, Text,
} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  headingTitle: {
    fontSize: 28,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
  },
  sectionAuthor: {
    marginTop: 8,
    fontWeight: '300',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default function Post({ title, author, text }) {
  return (
    <View style={{ flex: 1, marginLeft: 10 }}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>
      <Text style={styles.sectionAuthor}>
        Written by:
        {author}
      </Text>
      <Text style={styles.sectionDescription}>
        {text}
      </Text>
    </View>
  );
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};
