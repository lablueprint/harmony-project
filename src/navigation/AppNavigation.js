import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../screens/Home';
import EditProfileScreen from '../screens/EditProfile';

const AppNavigation = createStackNavigator(
  {
    Home: HomeScreen,
    EditProfile: EditProfileScreen,
  },
  {
    initialRouteName: 'Home',
  },
);

export default AppNavigation;
