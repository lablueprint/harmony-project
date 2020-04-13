import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../screens/Home';
import EditProfileScreen from '../screens/EditProfile';
import EvaluationScreen from '../screens/Evaluation';

const AppNavigation = createStackNavigator(
  {
    Home: HomeScreen,
    EditProfile: EditProfileScreen,
    Evaluation: EvaluationScreen,
  },
  {
    initialRouteName: 'Home',
  },
);

export default AppNavigation;
