import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import AuthNavigation from './AuthNavigation';
import AppNavigation from './AppNavigation';

const SwitchNavigator = createSwitchNavigator(
  {
    Auth: AuthNavigation,
    App: AppNavigation,
  },
  {
    initialRouteName: 'App',
  },
);

const AppContainer = createAppContainer(SwitchNavigator);

export default AppContainer;
