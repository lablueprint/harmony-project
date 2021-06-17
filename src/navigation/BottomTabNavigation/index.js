import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import BulletinStackNavigator from './BulletinStackNavigator';
import ToDoStackNavigator from './ToDoStackNavigator';
import NotificationStackNavigator from './NotificationStackNavigator';
import LibraryStackNavigator from './LibraryStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';

/* These are wrapper functions that are used to display bottom tab icons
These needed to be abstracted in order to properly validate the props
*/
const HomeIcon = ({ color }) => (
  <Icon name="home" type="feather" color={color} size={25} />
);

const TodoIcon = ({ color }) => (
  <Icon name="clipboard" type="feather" color={color} size={25} />
);

const NotificationIcon = ({ color }) => (
  <Icon name="bell" type="feather" color={color} size={25} />
);

const LibraryIcon = ({ color }) => (
  <Icon name="folder" type="feather" color={color} size={25} />
);

const ProfileIcon = ({ color }) => (
  <Icon name="user" type="feather" color={color} size={25} />
);

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name="Bulletin"
      component={BulletinStackNavigator}
      options={{
        tabBarIcon: HomeIcon,
      }}
    />

    <Tab.Screen
      name="Todo"
      component={ToDoStackNavigator}
      options={{
        tabBarIcon: TodoIcon,
      }}
    />

    <Tab.Screen
      name="Notifications"
      component={NotificationStackNavigator}
      options={{
        tabBarIcon: NotificationIcon,
      }}
    />

    <Tab.Screen
      name="Library"
      component={LibraryStackNavigator}
      options={{
        tabBarIcon: LibraryIcon,
      }}
    />

    <Tab.Screen
      name="Profile"
      component={ProfileStackNavigator}
      options={{
        tabBarIcon: ProfileIcon,
        header: null,
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

LibraryIcon.propTypes = {
  color: PropTypes.string.isRequired,
};

ProfileIcon.propTypes = {
  color: PropTypes.string.isRequired,
};

export default BottomTabNavigator;
