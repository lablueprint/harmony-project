import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import AssignmentListScreen from '../screens/AssignmentList/AssignmentListScreen';
import ProfileScreen from '../screens/Profile';
import MainStackNavigator from './StackNavigation';
import NotificationsScreen from '../screens/Notifications';

/* These are wrapper functions that are used to display bottom tab icons
These needed to be abstracted in order to properly validate the props
*/
const HomeIcon = ({ color }) => (
  <Icon name="home" color={color} size={25} />
);

const TodoIcon = ({ color }) => (
  <Icon name="clipboard" color={color} size={25} />
);

const NotificationIcon = ({ color }) => (
  <Icon name="notifications" color={color} size={25} />
);

const ProfileIcon = ({ color }) => (
  <Icon name="person" color={color} size={25} />
);

/* Function is just here to route to an empty screen since notification
screen is currently not made and the navigator breaksdown without something
present.
*/
function blankScreen() {
  return (
    null
  );
}

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Bulletin"
      component={MainStackNavigator}
      options={{
        tabBarIcon: HomeIcon,
      }}
    />

    <Tab.Screen
      name="To-do"
      component={AssignmentListScreen}
      options={{
        tabBarIcon: TodoIcon,
      }}
    />

    <Tab.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{
        tabBarIcon: NotificationIcon,
      }}
    />

    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ProfileIcon,
      }}
    />
  </Tab.Navigator>
);

// Validate Icon Props
HomeIcon.propTypes = {
  color: PropTypes.string.isRequired,
};

TodoIcon.propTypes = {
  color: PropTypes.string.isRequired,
};

NotificationIcon.propTypes = {
  color: PropTypes.string.isRequired,
};

ProfileIcon.propTypes = {
  color: PropTypes.string.isRequired,
};

export default BottomTabNavigator;
