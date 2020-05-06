import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../screens/Home';
import EditProfileScreen from '../screens/EditProfile';
import ChatroomsScreen from '../screens/Messaging/Chatrooms';
import MessageScreen from '../screens/Messaging/Messages';
import ProfileScreen from '../screens/Profile';
import EvaluationScreen from '../screens/Evaluation';
import CreateEvaluationScreen from '../screens/CreateEvaluation';

const AppNavigation = createStackNavigator(
  {
    Home: HomeScreen,
    EditProfile: EditProfileScreen,
    Chatrooms: ChatroomsScreen,
    Messages: MessageScreen,
    Profile: ProfileScreen,
    Evaluation: EvaluationScreen,
    CreateEvaluation: CreateEvaluationScreen,
  },
  {
    initialRouteName: 'Home',
  },
);

export default AppNavigation;
