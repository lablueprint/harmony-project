import React from 'react';
// import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
// import { Button, Input } from 'react-native-elements';
// import Auth from '@react-native-firebase/auth';
// import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import { styles, flattenedStyles } from './styles';

export default function MessageBubble({ message, side }) {
  const isLeftSide = side === 'left';

  const containerStyles = isLeftSide ? styles.container : flattenedStyles.container;
  const textContainerStyles = isLeftSide ? styles.textContainer : flattenedStyles.textContainer;
  const textStyles = isLeftSide ? flattenedStyles.leftText : flattenedStyles.rightText;

  return (
    <View style={containerStyles}>
      <View style={textContainerStyles}>
        <Text style={textStyles}>
          {message}
        </Text>
      </View>
    </View>
  );
}

MessageBubble.propTypes = {
  message: PropTypes.string.isRequired,
  side: PropTypes.string.isRequired,
};
