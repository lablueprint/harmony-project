import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../screens/Home';
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
import { ClassroomSelectScreen, LoadClasses } from '../screens/Landing';

const AppNavigation = createStackNavigator(
  {
    Home: HomeScreen,
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
    Load: LoadClasses,
  },
  {
    initialRouteName: 'Home',
  },
);

export default AppNavigation;
