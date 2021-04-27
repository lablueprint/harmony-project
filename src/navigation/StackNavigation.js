import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import HomeScreen from '../screens/Home';
import ProfileScreen from '../screens/Profile';
import EditProfileScreen from '../screens/EditProfile';
import { PostScreen, NewPostScreen, NewCommentScreen } from '../components/Post';
import ChatroomsScreen from '../screens/Messaging/Chatrooms';
import MessageScreen from '../screens/Messaging/Messages';
import EvaluationScreen from '../screens/Evaluation';
import CreateEvaluationScreen from '../screens/CreateEvaluation';
import GenericFormDemoScreen from '../screens/GenericFormDemo';
import AnnouncementsScreen from '../screens/Announcements';
import AssignmentListScreen from '../screens/AssignmentList/AssignmentListScreen';
import StudentsNamesScreen from '../screens/AssignmentList/StudentsNamesScreen';
import AssignmentScreen from '../screens/AssignmentList/AssignmentScreen';
import NewAssignmentScreen from '../screens/AssignmentList/NewAssignmentScreen';
import SubmissionsList from '../screens/AssignmentList/SubmissionsList';
import { ClassroomHome, CreateClassroomScreen } from '../screens/Classroom';
import ClassroomSelectScreen from '../screens/Landing';

/* Container to hold default navigation options so that App Navigation
doesn't look too messy. Currently holds gradient and title text color.
*/
const defaultNavOptions = {
  headerBackground: () => (
    <LinearGradient
      colors={['#984A9C', '#C95748']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    />
  ),
  title: '',
};

const Stack = createStackNavigator();

const MainStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} options={defaultNavOptions} />
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
    <Stack.Screen name="Announcements" component={AnnouncementsScreen} />
    <Stack.Screen name="AssignmentList" component={AssignmentListScreen} options={defaultNavOptions} />
    <Stack.Screen name="CreateClassroom" component={CreateClassroomScreen} />
    <Stack.Screen name="Classroom" component={ClassroomHome} />
    <Stack.Screen name="Landing" component={ClassroomSelectScreen} />
  </Stack.Navigator>
);

export default MainStackNavigator;
