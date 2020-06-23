import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import TimestampedFeedback from './TimestampedFeedback';

export default function TimestampedFeedbackList({ navigation, evaluations }) {
  let listItems = [];
  if (typeof evaluations !== 'undefined') {
    listItems = evaluations.map((i) => (
      <TimestampedFeedback
        navigation={navigation}
        title={i.title}
        startTime={i.startTime}
        endTime={i.endTime}
        comment={i.comment}
      />
    ));
  }
  return (
    <ScrollView>
      <>{listItems}</>
    </ScrollView>
  );
}

TimestampedFeedbackList.propTypes = {
  navigation: PropTypes.element.isRequired,
  evaluations: PropTypes.element.isRequired,
};
