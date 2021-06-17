import React, { useState/* , useEffect */ } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import {
  SafeAreaView, ScrollView, Text, View, StyleSheet, Alert, Button, TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
// eslint-disable-next-line import/no-unresolved
import { CheckBox } from 'react-native-elements';
import { Calendar } from 'react-native-calendars';
import PropTypes from 'prop-types';
import Firestore from '@react-native-firebase/firestore';
import { TouchableHighlight } from 'react-native-gesture-handler';
import {
  INITIAL_CLASSROOM_STATE, classTypes, classDays,
} from '../../components';
// import Post from './Post';

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  contentContainer: {
    paddingTop: 20,
  },
  timeText: {
    fontSize: 11,
  },
  topicText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: 14,
  },
  checklist: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
});

const nums = /[0-9]/; // regex to check number-only input for classLength

// navigation MUST INCLUDE: uid
export default function CreateClassroomScreen({ navigation }) {
  const uid = navigation.getParam('uid', null);
  const [className, setName] = useState(''); // state var to hold class name
  const [classDesc, setDesc] = useState(''); // state var to hold class description
  const [classType, setType] = useState(classTypes.default); // state var to hold class type
  const [dayToggle, setDays] = useState({
    mon: false,
    tues: false,
    wed: false,
    thurs: false,
    fri: false,
  }); // state var keeping track of day checkboxes
  const [length, setLength] = useState(''); // state var to hold class length
  const [classStart, setStart] = useState(''); // state var to hold start date
  const [classEnd, setEnd] = useState(''); // state var to hold end date

  // creates classroomID
  async function makeid(num) {
    let result = ''; // var to store code
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    // generate id
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < num; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    await Firestore().collection('classrooms').get()
      .then((querySnapshot) => {
        // parse through every document in classrooms
        // if the code is not unique, generate new ones until unique
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          while (result === doc.id) {
            result = '';
            // generate new code
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < num; i++) {
              result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
          }
        });
      });

    return result;
  }

  async function create() {
    // if all fields inputted and valid, create classroom
    if (className.length === 0) {
      // class name empty
      Alert.alert('Please input a class name.');
    } else if (!dayToggle.mon && !dayToggle.tues && !dayToggle.wed
            && !dayToggle.thurs && !dayToggle.fri) {
      // meet days empty
      Alert.alert('Please select a meet day(s).');
    } else if (length.length === 0 || length === '0' || !nums.test(length)) {
      // class length empty or not only numeric
      Alert.alert('Please input a nonzero numeric length.');
    } else if (classStart.length === 0) {
      // no start date
      Alert.alert('Please input a valid start date.');
    } else if (classEnd.length === 0) {
      // no end date
      Alert.alert('Please input a valid end date.');
    } else if (classStart >= classEnd) {
      // end date before/on start date
      Alert.alert('Please make sure the end date is after the start date.');
    } else {
      const code = await makeid(6); // generate unique code

      const days = [];
      // 5 if statements instead of forEach to ensure proper ordering
      if (dayToggle.mon) days.push(classDays.monday);
      if (dayToggle.tues) days.push(classDays.tuesday);
      if (dayToggle.wed) days.push(classDays.wednesday);
      if (dayToggle.thurs) days.push(classDays.thursday);
      if (dayToggle.fri) days.push(classDays.friday);

      // create object with info fields of new classroom
      const classroomInfo = {
        ...INITIAL_CLASSROOM_STATE,
        teacherIDs: [uid],
        name: className,
        type: classType,
        meetDays: days,
        startDate: classStart,
        endDate: classEnd,
        description: classDesc,
        classLength: parseInt(length, 10),
        createdAt: Firestore.Timestamp.now(),
      };
      // create new classroom with the above fields
      // navigate to classroom page with code, classroomInfo, uid as navigation props
      Firestore().collection('classrooms')
        .doc(code).set(classroomInfo)
        .then(() => {
          navigation.navigate('Classroom', { code, classroomInfo, uid });
        })
        .catch((e) => {
          Alert.alert(e.message);
        });
    }
  }

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <View style={styles.subContainer}>
          <Text>
            Classroom Name:
          </Text>
          <TextInput
            placeholder="Michael's Class"
            fontSize={20}
            onChangeText={setName}
            value={className}
          />
        </View>
        <View style={styles.subContainer}>
          <Text>
            Class Description:
          </Text>
          <TextInput
            placeholder="Description"
            fontSize={20}
            onChangeText={setDesc}
            value={classDesc}
          />
        </View>
        <View style={styles.subContainer}>
          <Text>Class Type:</Text>
          <Picker
            selectedValue={classType}
            style={styles.textInput}
            onValueChange={setType}
          >
            <Picker.Item label="Group" value={classTypes.group} />
            <Picker.Item label="Ensemble" value={classTypes.ensemble} />
            <Picker.Item label="Musicianship" value={classTypes.musicianship} />
            <Picker.Item label="Mentorship" value={classTypes.mentorship} />
            <Picker.Item label="Private Lessons" value={classTypes.private_lessons} />
          </Picker>
        </View>
        <View style={styles.subContainer}>
          <Text>Meet days:</Text>
          <View style={styles.checklist}>
            <CheckBox
              checked={dayToggle.mon}
              onPress={() => {
                setDays({ ...dayToggle, mon: !dayToggle.mon });
              }}
            />
            <TouchableHighlight
              onPress={() => {
                setDays({ ...dayToggle, mon: !dayToggle.mon });
              }}
              underlayColor="#E1E1E1"
            >
              <Text>MONDAY</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.checklist}>
            <CheckBox
              checked={dayToggle.tues}
              onPress={() => {
                setDays({ ...dayToggle, tues: !dayToggle.tues });
              }}
            />
            <TouchableHighlight
              onPress={() => {
                setDays({ ...dayToggle, tues: !dayToggle.tues });
              }}
              underlayColor="#E1E1E1"
            >
              <Text>TUESDAY</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.checklist}>
            <CheckBox
              checked={dayToggle.wed}
              onPress={() => {
                setDays({ ...dayToggle, wed: !dayToggle.wed });
              }}
            />
            <TouchableHighlight
              onPress={() => {
                setDays({ ...dayToggle, wed: !dayToggle.wed });
              }}
              underlayColor="#E1E1E1"
            >
              <Text>WEDNESDAY</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.checklist}>
            <CheckBox
              checked={dayToggle.thurs}
              onPress={() => {
                setDays({ ...dayToggle, thurs: !dayToggle.thurs });
              }}
            />
            <TouchableHighlight
              onPress={() => {
                setDays({ ...dayToggle, thurs: !dayToggle.thurs });
              }}
              underlayColor="#E1E1E1"
            >
              <Text>THURSDAY</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.checklist}>
            <CheckBox
              checked={dayToggle.fri}
              onPress={() => {
                setDays({ ...dayToggle, fri: !dayToggle.fri });
              }}
            />
            <TouchableHighlight
              onPress={() => {
                setDays({ ...dayToggle, fri: !dayToggle.fri });
              }}
              underlayColor="#E1E1E1"
            >
              <Text>FRIDAY</Text>
            </TouchableHighlight>
          </View>
        </View>
        <View styles={styles.subContainer}>
          <Text>Class length:</Text>
          <TextInput
            placeholder="2"
            fontSize={20}
            maxLength={2}
            keyboardType="number-pad"
            onChangeText={setLength}
            value={length}
          />
        </View>
        <View styles={styles.subContainer}>
          <Text>Start Date:</Text>
          <Calendar
            minDate={Date()}
            onDayPress={(data) => {
              setStart(data.dateString);
            }}
            markedDates={{
              [classStart]: { selected: true },
            }}
          />
          <Text>End Date:</Text>
          <Calendar
            current={classStart}
            minDate={classStart}
            onDayPress={(data) => {
              setEnd(data.dateString);
            }}
            markedDates={{
              [classEnd]: { selected: true },
            }}
          />
        </View>
        <Button
          style={styles.textInput}
          title="Create"
          onPress={() => {
            create();
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

CreateClassroomScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
