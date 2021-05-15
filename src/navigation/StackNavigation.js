import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import ProfileScreen from '../screens/Profile';
import EditProfileScreen from '../screens/EditProfile';
import { PostScreen, NewPostScreen, NewCommentScreen } from '../components/Post';
import ChatroomsScreen from '../screens/Messaging/Chatrooms';
import MessageScreen from '../screens/Messaging/Messages';
import EvaluationScreen from '../screens/Evaluation';
import CreateEvaluationScreen from '../screens/CreateEvaluation';
import GenericFormDemoScreen from '../screens/GenericFormDemo';
import { Announcements } from '../screens/Announcements';
import AssignmentListScreen from '../screens/AssignmentList/AssignmentListScreen';
import StudentsNamesScreen from '../screens/AssignmentList/StudentsNamesScreen';
import AssignmentScreen from '../screens/AssignmentList/AssignmentScreen';
import NewAssignmentScreen from '../screens/AssignmentList/NewAssignmentScreen';
import SubmissionsList from '../screens/AssignmentList/SubmissionsList';
import { ClassroomHome, CreateClassroomScreen } from '../screens/Classroom';
import { ClassroomSelectScreen, LoadClasses } from '../screens/Landing';
import { LibraryScreen, LibraryFilesScreen } from '../screens/Library';
import { SignUpScreen, UserInformationScreen } from '../screens/SignUp';
import NotificationsScreen from '../screens/Notifications';

const Stack = createStackNavigator();

const MainStackNavigator = () => (
  <Stack.Navigator
  /* MainStackNavigatior's header MUST be hidden so that the Root's header
  options (linear gradient) can be applied to all screen with no weird
  overlaps/cutoffs
  */
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="Post" component={PostScreen} />
    <Stack.Screen name="NewPost" component={NewPostScreen} />
    <Stack.Screen name="NewAssignment" component={NewAssignmentScreen} />
    <Stack.Screen name="Assignment" component={AssignmentScreen} />
    <Stack.Screen name="Submissions" component={SubmissionsList} />
    <Stack.Screen name="NewComment" component={NewCommentScreen} />
    <Stack.Screen name="Chatrooms" component={ChatroomsScreen} />
    <Stack.Screen name="Messages" component={MessageScreen} />
    <Stack.Screen name="StudentNames" component={StudentsNamesScreen} />
    <Stack.Screen name="Evaluation" component={EvaluationScreen} />
    <Stack.Screen name="CreateEvaluation" component={CreateEvaluationScreen} />
    <Stack.Screen name="GenericFormDemo" component={GenericFormDemoScreen} />
    <Stack.Screen name="Announcements" component={Announcements} />
    <Stack.Screen name="AssignmentList" component={AssignmentListScreen} />
    <Stack.Screen name="CreateClassroom" component={CreateClassroomScreen} />
    <Stack.Screen name="Classroom" component={ClassroomHome} />
    <Stack.Screen name="LoadClasses" component={LoadClasses} />
    <Stack.Screen name="Landing" component={ClassroomSelectScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="UserInformation" component={UserInformationScreen} />
  </Stack.Navigator>
);

const LibraryNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Library" component={LibraryScreen} />
    <Stack.Screen name="LibraryFiles" component={LibraryFilesScreen} />
  </Stack.Navigator>
);

export { MainStackNavigator, LibraryNavigator };
