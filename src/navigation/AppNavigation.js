import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../screens/Home';
import EditProfileScreen from '../screens/EditProfile';
import EvaluationScreen from '../screens/Evaluation';
import CreateEvaluationScreen from '../screens/CreateEvaluation';
import CreateAttendanceScreen from '../screens/CreateAttendanceSheet';
import AttendanceSheetScreen from '../screens/AttendanceSheet';

const AppNavigation = createStackNavigator(
  {
    Home: HomeScreen,
    EditProfile: EditProfileScreen,
    Evaluation: EvaluationScreen,
    CreateEvaluation: CreateEvaluationScreen,
    CreateAttendance: CreateAttendanceScreen,
    AttendanceSheet: AttendanceSheetScreen,
  },
  {
    initialRouteName: 'Home',
  },
);

export default AppNavigation;
