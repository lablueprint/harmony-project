/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, Button, Alert,
} from 'react-native';
import { Text } from 'react-native-elements';
import PropTypes from 'prop-types';
import Firestore from '@react-native-firebase/firestore';

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  subContainer: {
    marginBottom: 10,
    padding: 10,
  },
  topicText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInput: {
    fontSize: 18,
    margin: 5,
    width: 200,
  },
});

export default function ClassSelections({
  classroomData, uid, userState, navigation,
}) {
  const [past, setPast] = useState([]);
  const [currClasses, setCurr] = useState([]);
  const [showPast, setShow] = useState(false);

  const date = new Date();
  let currDate = '';
  currDate += `${date.getFullYear()}-`;
  if (date.getMonth() < 9) {
    currDate += `0${date.getMonth() + 1}-`;
  } else {
    currDate += `${date.getMonth() + 1}-`;
  }
  if (date.getDate() <= 9) {
    currDate += `0${date.getDate()}`;
  } else {
    currDate += `${date.getDate()}`;
  }

  useEffect(() => {
    // resets to empty so that on every load it refills the state variables
    setCurr([]);
    setPast([]);
    classroomData.forEach((c) => {
      const classroomInfo = c;
      const classCode = c.code;
      delete classroomInfo.code;
      if (userState.role === 'TEACHER') {
        if (c.endDate > currDate) {
          setCurr((cl) => [...cl, { info: classroomInfo, code: classCode }]);
        } else {
          setPast((cl) => [...cl, { info: classroomInfo, code: classCode }]);
        }
      } else if (userState.role === 'STUDENT') {
        const teacherNames = [];
        c.teacherIDs.forEach((t) => {
          Firestore().collection('users').doc(t).get()
            .then((teacher) => {
              teacherNames.push(teacher.data().name);
            })
            .catch((e) => {
              Alert.alert(e.message);
            });
        });
        if (c.endDate > currDate) {
          setCurr((cl) => [...cl, { info: classroomInfo, code: classCode, teacherNames }]);
        } else {
          setPast((cl) => [...cl, { info: classroomInfo, code: classCode, teacherNames }]);
        }
      }
    });
  }, [classroomData]);

  return (
    <View>
      <View style={styles.container}>
        <Text>
          ACTIVE CLASSES
        </Text>
        {currClasses.map((c) => (
          <View style={styles.subContainer} key={c.code}>
            <View style={styles.subContainer}>
              <Text style={styles.topicText}>
                {`Class Name: ${c.info.name}`}
              </Text>
            </View>
            {userState.role === 'TEACHER' && (
            <View style={styles.subContainer}>
              <Text style={styles.topicText}>
                {`Number of Students: ${c.info.studentIDs.length}`}
              </Text>
            </View>
            )}
            {userState.role === 'STUDENT' && (
            <View style={styles.subContainer}>
              <Text style={styles.topicText}>
                Teachers:
              </Text>
              {c.teacherNames.map((n) => (
                <Text style={styles.topicText} key={n}>
                  {n}
                </Text>
              ))}
            </View>
            )}
            <Button
              style={styles.textInput}
              title="OPEN"
              onPress={() => {
                navigation.navigate('Classroom', { code: c.code, classroomInfo: c.info, uid });
              }}
            />
          </View>
        ))}
      </View>
      <View style={styles.container}>
        {!showPast
          ? (
            <Button
              style={styles.textInput}
              title="OPEN PAST CLASSES"
              onPress={() => {
                setShow(true);
              }}
            />
          ) : (
            <Button
              style={styles.textInput}
              title="CLOSE PAST CLASSES"
              onPress={() => {
                setShow(false);
              }}
            />
          )}
        {showPast && past.map((c) => (
          <View style={styles.subContainer} key={c.code}>
            <View style={styles.subContainer}>
              <Text style={styles.topicText}>
                {`Class Name: ${c.info.name}`}
              </Text>
            </View>
            {userState.role === 'TEACHER' && (
            <View style={styles.subContainer}>
              <Text style={styles.topicText}>
                {`Number of Students: ${c.info.studentIDs.length}`}
              </Text>
            </View>
            )}
            {userState.role === 'STUDENT' && (
            <View style={styles.subContainer}>
              <Text style={styles.topicText}>
                Teachers:
              </Text>
              {c.teacherNames.map((n) => (
                <Text style={styles.topicText} key={n}>
                  {n}
                </Text>
              ))}
            </View>
            )}
            <Button
              style={styles.textInput}
              title="OPEN"
              onPress={() => {
                navigation.navigate('Classroom', { code: c.code, classroomInfo: c.info, uid });
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

ClassSelections.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classroomData: PropTypes.array.isRequired,
  uid: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  userState: PropTypes.object.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
