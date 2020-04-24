import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../screens/Home';
import EditProfileScreen from '../screens/EditProfile';
import ProfileScreen from '../screens/Profile';

const AppNavigation = createStackNavigator(
  {
    Home: HomeScreen,
    EditProfile: EditProfileScreen,
    Profile: ProfileScreen,
  },
  {
    initialRouteName: 'Home',
  },
);

export default AppNavigation;
