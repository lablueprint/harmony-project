import { createStackNavigator } from 'react-navigation-stack';
import SignInScreen from '../screens/SignIn';
import SignUpScreen from '../screens/SignUp';
import ForgotPasswordScreen from '../screens/ForgotPassword';

const AuthNavigation = createStackNavigator(
  {
    SignIn: SignInScreen,
    SignUp: SignUpScreen,
    ForgotPassword: ForgotPasswordScreen,
  },
  {
    initialRouteName: 'SignIn',
    headerMode: 'none',
  },
);

export default AuthNavigation;
