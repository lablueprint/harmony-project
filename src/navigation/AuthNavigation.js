import { createStackNavigator } from 'react-navigation-stack';
import SignInScreen from '../screens/SignIn';
import SignUpScreen from '../screens/SignUp';

const AuthNavigation = createStackNavigator(
  {
    SignIn: SignInScreen,
    SignUp: SignUpScreen,
  },
  {
    initialRouteName: 'SignIn',
    headerMode: 'none',
  },
);

export default AuthNavigation;
