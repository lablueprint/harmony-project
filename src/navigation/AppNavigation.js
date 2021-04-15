import { createStackNavigator } from 'react-navigation-stack';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import EditProfileScreen from '../screens/EditProfile';
import { PostScreen, NewPostScreen, NewCommentScreen } from '../components/Post';
import ChatroomsScreen from '../screens/Messaging/Chatrooms';
import MessageScreen from '../screens/Messaging/Messages';
import ProfileScreen from '../screens/Profile';
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
import BottomTabNavigation from './BottomTabNavigation';

/* Container to hold default navigation options so that App Navigation
doesn't look too messy. Currently holds gradient and title text color.
*/
const defaultNavOptions = {
  headerBackground: () => (
    <LinearGradient
      colors={['#C95748', '#984A9C']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    />
  ),
  title: '',
};

/* Initial route must stay 'Home' in order to properly integrate
with bottom tab navigation
*/
const AppNavigation = createStackNavigator(
  {
    Home: {
      screen: BottomTabNavigation,
      navigationOptions: defaultNavOptions,
    },
    EditProfile: EditProfileScreen,
    Post: PostScreen,
    NewPost: NewPostScreen,
    NewAssignment: NewAssignmentScreen,
    Assignment: AssignmentScreen,
    Submissions: SubmissionsList,
    NewComment: NewCommentScreen,
    Chatrooms: ChatroomsScreen,
    Messages: MessageScreen,
    StudentNames: StudentsNamesScreen,
    Profile: ProfileScreen,
    Evaluation: EvaluationScreen,
    CreateEvaluation: CreateEvaluationScreen,
    GenericFormDemo: GenericFormDemoScreen,
    Announcements: AnnouncementsScreen,
    AssignmentList: AssignmentListScreen,
    CreateClassroom: CreateClassroomScreen,
    Classroom: ClassroomHome,
    Landing: ClassroomSelectScreen,
  },
  {
    initialRouteName: 'Home',
  },
);

export default AppNavigation;
