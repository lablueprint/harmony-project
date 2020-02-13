import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Text, View, SafeAreaView, ScrollView, StyleSheet, Button, TextInput,
} from 'react-native';

const styles = StyleSheet.create({

  headingTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export function Classroom({ navigation }) {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.headingTitle}>
            {'\n'}
            Welcome to Classroom One!
            {'\n'}
          </Text>
          <Button title="Make a Post!" onPress={() => navigation.navigate('Make a New Post')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function MakePost({ navigation }) {
  return (
    <View style={{ backgroundColor: '#ffffff' }}>
      <TextInput
        style={{ height: 40 }}
        placeholder="Enter Topic"
        maxLength={25}
        fontSize={24}
        fontWeight="500"
      />
      <TextInput
        style={{ height: 200 }}
        placeholder="What's on your mind?"
        maxLength={1000}
        multiline
        numberOfLines={10}
        fontSize={18}
        fontWeight="200"
      />
      <Button title="Submit Post" />
    </View>
  );
}


const Stack = createStackNavigator();

export default function ClassNav() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Classroom One" component={Classroom} />
        <Stack.Screen name="Make a New Post" component={MakePost} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* Classroom works in this manner: The Classroom View has multiple classrooms.
Each classroom has students and teacher(s). Only teachers can make a post in the
classroom. Students, however, can make comments in the classrooms and produce a
"thread". In terms of slack, a classroom is a channel. Only teachers can send
stuff into the channel but students can comment on what is sent.
NEXT STEP: Create a local post for the classroom */
