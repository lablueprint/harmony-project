import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../screens/Home';
import EditProfileScreen from '../screens/EditProfile';
import ChatroomsScreen from '../screens/Messaging/Chatrooms';
import MessageScreen from '../screens/Messaging/Messages';
import ProfileScreen from '../screens/Profile';
import EvaluationScreen from '../screens/Evaluation';
import CreateEvaluationScreen from '../screens/CreateEvaluation';
import GenericFormDemoScreen from '../screens/GenericFormDemo';

const AppNavigation = createStackNavigator(
  {
    Home: HomeScreen,
    EditProfile: EditProfileScreen,
    Chatrooms: ChatroomsScreen,
    Messages: MessageScreen,
    Profile: ProfileScreen,
    Evaluation: EvaluationScreen,
    CreateEvaluation: CreateEvaluationScreen,
    GenericFormDemo: GenericFormDemoScreen,
  },
  {
    initialRouteName: 'Home',
  },
);

export default AppNavigation;
