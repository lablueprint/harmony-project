import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import React, { useState, useContext } from 'react';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import ClassroomContext from './ClassroomContext';
import AssignmentListScreen from '../screens/AssignmentList/AssignmentListScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import ProfileScreen from '../screens/Profile';
import { MainStackNavigator, LibraryNavigator } from './StackNavigation';
import ClassroomSelector from '../components/ClassroomSelector';

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

/* Function is just here to route to an empty screen since notification
screen is currently not made and the navigator breaksdown without something
present.
*/

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const [classroom, setClassroom] = useState('');

  return (
    <ClassroomContext.Provider value={{ classroom, setClassroom }}>
      <ClassroomSelector />
      <Tab.Navigator screenOptions={{ headerShown: false }}>
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
          name="Library"
          component={LibraryNavigator}
          options={{
            tabBarIcon: LibraryIcon,
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
    </ClassroomContext.Provider>
  );
};

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
