import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../screens/Home';
import EditProfileScreen from '../screens/EditProfile';
import { PostScreen, NewPostScreen } from '../components/Post';

const AppNavigation = createStackNavigator(
  {
    Home: HomeScreen,
    EditProfile: EditProfileScreen,
    Post: PostScreen,
    NewPost: NewPostScreen,
  },
  {
    initialRouteName: 'Home',
  },
);

export default AppNavigation;
