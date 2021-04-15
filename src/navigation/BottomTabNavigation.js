import { createBottomTabNavigator } from 'react-navigation-tabs';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import HomeScreen from '../screens/Home';
import AssignmentListScreen from '../screens/AssignmentList/AssignmentListScreen';
import ProfileScreen from '../screens/Profile';

/* These are wrapper functions that are used to display bottom tab icons
These needed to be abstracted in order to properly validate the props
*/
const HomeIcon = ({ tintColor }) => (
  <Icon name="home" color={tintColor} size={25} />
);

const TodoIcon = ({ tintColor }) => (
  <Icon name="clipboard" color={tintColor} size={25} />
);

const NotificationIcon = ({ tintColor }) => (
  <Icon name="notifications" color={tintColor} size={25} />
);

const ProfileIcon = ({ tintColor }) => (
  <Icon name="person" color={tintColor} size={25} />
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

const BottomTabNavigation = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: HomeIcon,
      },
    },
    Todo: {
      screen: AssignmentListScreen,
      navigationOptions: {
        tabBarLabel: 'To-do',
        tabBarIcon: TodoIcon,
      },
    },
    Notifications: {
      screen: blankScreen,
      navigationOptions: {
        tabBarLabel: 'Notifications',
        tabBarIcon: NotificationIcon,
      },
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ProfileIcon,
      },
    },
  },
  {
    initialRouteName: 'Home',
  },
);

// Validate Icon Props
HomeIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

TodoIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

NotificationIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

ProfileIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

export default BottomTabNavigation;
