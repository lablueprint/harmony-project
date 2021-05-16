import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EvaluationScreen from '../../screens/Evaluation';
import CreateEvaluationScreen from '../../screens/CreateEvaluation';
import AssignmentListScreen from '../../screens/AssignmentList/AssignmentListScreen';
import StudentsNamesScreen from '../../screens/AssignmentList/StudentsNamesScreen';
import AssignmentScreen from '../../screens/AssignmentList/AssignmentScreen';
import NewAssignmentScreen from '../../screens/AssignmentList/NewAssignmentScreen';
import SubmissionsList from '../../screens/AssignmentList/SubmissionsList';
import FeedbackScreen from '../../screens/Feedback';

const Stack = createStackNavigator();

const ToDoStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="AssignmentList" component={AssignmentListScreen} />
    <Stack.Screen name="Assignment" component={AssignmentScreen} />
    <Stack.Screen name="NewAssignment" component={NewAssignmentScreen} />
    <Stack.Screen name="Submissions" component={SubmissionsList} />
    <Stack.Screen name="StudentNames" component={StudentsNamesScreen} />
    <Stack.Screen name="Evaluation" component={EvaluationScreen} />
    <Stack.Screen name="CreateEvaluation" component={CreateEvaluationScreen} />
    <Stack.Screen name="Feedback" component={FeedbackScreen} />
  </Stack.Navigator>
);

export default ToDoStackNavigator;
