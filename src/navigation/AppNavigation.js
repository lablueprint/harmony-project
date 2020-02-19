import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../screens/Home';

const AppNavigation = createStackNavigator(
  {
    Home: { screen: HomeScreen },
  },
  {
    initialRouteName: 'Home',
  },
);

export default AppNavigation;
