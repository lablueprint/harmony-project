import 'react-native-gesture-handler';
import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import {
  Text, View, SafeAreaView, ScrollView, StyleSheet, Button, TextInput,
} from 'react-native';
import Post from './Post';


const styles = StyleSheet.create({

  headingTitle: {
    fontSize: 28,
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

/* const post1 = {
  author: 'Timmy Turner',
  text: "I wish that my code doesn't break I really want some pie
  right now I wonder how people are gopnna see what im typing pls
  bro just i want to eat i rlly want food bro pls",
  time: '10:16 PM',
};

const cl = {
  classroom: {
    title: 'CL1',
    posts: [post1],
  },
}; */

// eslint-disable-next-line no-unused-vars
function ClassroomHome({ navigation }) {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.headingTitle}>
            Welcome to Classroom One!
          </Text>
          <Button title="Make a Post!" onPress={() => navigation.navigate('Make a New Post')} />
        </View>
        <Post title="Idk What's Going on In Any Class" author="Cody Do" text="pls help me, I have 3 midterms next week" />
        <Post title="Will pay someone to take my midterm" author="Cody Do" text="i don't have much but i have lots of love to give c: will pay in hugs" />
      </ScrollView>
    </SafeAreaView>
  );
}

// eslint-disable-next-line no-unused-vars
function MakePost() {
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


// const Stack = createStackNavigator();

// export default function Classroom() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="Classroom One" component={ClassroomHome} />
//         <Stack.Screen name="Make a New Post" component={MakePost} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

/* Classroom works in this manner: The Classroom View has multiple classrooms.
Each classroom has students and teacher(s). Only teachers can make a post in the
classroom. Students, however, can make comments in the classrooms and produce a
"thread". In terms of slack, a classroom is a channel. Only teachers can send
stuff into the channel but students can comment on what is sent.
NEXT STEP: Build in firebase for the posts */
