import React from 'react';
import {
  View, StyleSheet, Text,
} from 'react-native';
import PropTypes from 'prop-types';
import TimestampedFeedback from './TimestampedFeedback';

export default function TimestampedFeedbackList({ evaluations }) {
  let listItems = [];
  if (typeof evaluations !== 'undefined') {
    listItems = evaluations.map((i) => <TimestampedFeedback startTime={i.startTime} endTime={i.endTime} comment={i.comment} />);
  }
  return (
    <>{listItems}</>
  );
}

TimestampedFeedbackList.propTypes = {
  evaluations: PropTypes.element.isRequired,
};
