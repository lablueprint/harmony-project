/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/forbid-prop-types */
import React, { useContext, useLayoutEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { LibraryScreen, LibraryFilesScreen } from '../../screens/Library';
import FilePreviewScreen from '../../screens/FilePreview';
import { HeaderContext } from '../../context';

const Stack = createStackNavigator();

const LibraryNavigator = ({ route }) => {
  const {
    setAnimate,
  } = useContext(HeaderContext);

  useLayoutEffect(() => {
    if (getFocusedRouteNameFromRoute(route) === 'FilePreview') {
      setAnimate('fadeOut');
    } else {
      setAnimate('fadeIn');
    }
  }, [route]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Library" component={LibraryScreen} />
      <Stack.Screen name="LibraryFiles" component={LibraryFilesScreen} />
      <Stack.Screen name="FilePreview" component={FilePreviewScreen} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
};

LibraryNavigator.propTypes = {
  route: PropTypes.object.isRequired,
};

export default LibraryNavigator;
