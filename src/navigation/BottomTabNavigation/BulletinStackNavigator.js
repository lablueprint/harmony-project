import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PostScreen, NewPostScreen, NewCommentScreen } from '../../components/Post';
import { Announcements } from '../../screens/Announcements';

const Stack = createStackNavigator();

const BulletinStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Announcements" component={Announcements} />
    <Stack.Screen name="Post" component={PostScreen} />
    <Stack.Screen name="NewPost" component={NewPostScreen} />
    <Stack.Screen name="NewComment" component={NewCommentScreen} />
  </Stack.Navigator>
);

export default BulletinStackNavigator;
