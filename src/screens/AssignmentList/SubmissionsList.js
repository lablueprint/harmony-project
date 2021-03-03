import { ScrollView } from 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';
import { List } from 'react-native-paper';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 8,
    paddingLeft: 40,
    display: 'flex',
    flexDirection: 'row',
  },
  name: {
    paddingRight: 20,
    paddingBottom: 8,
  },
  missing: {
    paddingRight: 15,
    paddingBottom: 8,
    color: 'red',
  },
  evaluate: {
    paddingRight: 15,
    paddingBottom: 8,
    color: 'blue',
  },
  header: {
    paddingLeft: 20,
    paddingTop: 20,
    color: 'blue',
  },

});

export default function SubmissionsList({ navigation }) {
  // const [errorMessage, setErrorMessage] = useState(null);
  const [assignmentID, setAssignmentID] = useState(null);
  const [classroomID, setClassroomID] = useState(null);
  // const [initializing, setInitializing] = useState(true);
  const [studentIDsList, setStudentIDsList] = useState([]);
  const [studentNames, setStudentNames] = useState([]);
  const [submissionIDs, setSubmissionIDs] = useState([]);
  const [submissionFeedback, setSubmissionFeedback] = useState([]);
  const [studentsList, setStudentList] = useState([]);
  const [displayMissing, setDisplayMissing] = useState([]);
  const [displaySubmitted, setDisplaySubmitted] = useState([]);
  const [displayEvaluated, setDisplayEvaluated] = useState([]);

  const [finished0, setFinished0] = useState(false);
  const [finished1, setFinished1] = useState(false);
  const [finished2, setFinished2] = useState(false);
  const [finished3, setFinished3] = useState(false);
  const [finished4, setFinished4] = useState(false);

  const a = navigation.getParam('assignment', null);
  const c = navigation.getParam('classroom', null);
  const [expanded, setExpanded] = useState(false);
  const [expanded1, setExpanded1] = useState(false);
  const [expanded2, setExpanded2] = useState(false);

  const handlePress = () => setExpanded(!expanded);
  const handlePress1 = () => setExpanded1(!expanded1);
  const handlePress2 = () => setExpanded2(!expanded2);

  useEffect(() => {
    console.log('TWO');
    async function setIDs() {
      setAssignmentID(a);
      setClassroomID(c);
      return true;
    }
    async function finish() {
      await setIDs();
      setFinished0(true);
    }
    finish();
  }, [navigation]);

  useEffect(() => {
    if (!finished0) {
      return;
    }
    console.log('THREE');
    async function getClassroomData() {
      await Firestore().collection('classrooms').doc(classroomID)
        .get()
        .then((doc) => {
          setStudentIDsList(doc.data().studentIDs);
        });
    }
    async function finish() {
      await getClassroomData();
      setFinished1(true);
    }
    finish();
  }, [classroomID, finished0]);

  useEffect(() => {
    if (!finished1) {
      return;
    }
    console.log('FOUR');
    const getNames = async () => {
      await studentIDsList.reduce(async (memo, studentID) => {
        await memo;
        await Firestore().collection('users').doc(studentID)
          .get()
          .then((doc) => {
            const data = doc.data();
            // eslint-disable-next-line no-shadow
            setStudentNames((studentNames) => [...studentNames, data.name]);
          });
      }, undefined);
    };
    const finish = async () => {
      await getNames();
      setFinished2(true);
    };
    finish();
  }, [finished1]);

  useEffect(() => {
    if (!finished1) {
      return;
    }
    console.log('FIVE');
    console.log(studentIDsList);

    const getSubmissions = async () => {
      await studentIDsList.reduce(async (memo, studentID) => {
        await memo;
        await Firestore().collection('submissions')
          .where('assignmentID', '==', assignmentID)
          .where('authorID', '==', studentID)
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              console.log('SADGE');
              // eslint-disable-next-line no-shadow
              setSubmissionIDs((submissionIDs) => [...submissionIDs, null]);
              // eslint-disable-next-line no-shadow
              setSubmissionFeedback((submissionFeedback) => [...submissionFeedback, false]);
            } else {
              console.log('YEET');
              querySnapshot.forEach((doc) => {
                if (doc) {
                  const data = doc.data();
                  // eslint-disable-next-line no-shadow
                  setSubmissionIDs((submissionIDs) => [...submissionIDs, doc.id]);
                  setSubmissionFeedback(
                    // eslint-disable-next-line no-shadow
                    (submissionFeedback) => [...submissionFeedback, data.hasReceivedFeedback],
                  );
                }
              });
            }
          });
      }, undefined);
    };
    const finish = async () => {
      await getSubmissions();
      setFinished3(true);
    };
    finish();
  }, [finished1, assignmentID]);

  useEffect(() => {
    if (!finished2 || !finished3) {
      return;
    }
    console.log('six');

    const zipping = async () => {
      const zipped = studentNames.map((x, i) => [x, submissionIDs[i], submissionFeedback[i]]);
      console.log(zipped);
      setStudentList(zipped);
      return true;
    };
    const zip = async () => {
      await zipping();
      setFinished4(true);
    };
    zip();
  }, [finished2, finished3]);

  useEffect(() => {
    if (!finished4) {
      return;
    }
    console.log('seven');
    const missing = studentsList.filter((e) => e[1] === null);
    setDisplayMissing(missing.map((obj) => {
      const submission = obj[1];
      const name = obj[0];
      return (
        <View style={styles.container}>

          <Text style={styles.name}>{name}</Text>
          {submission === null
            ? <Text style={styles.missing}>Not Submitted</Text>
            : []}

        </View>
      );
    }));

    const submitted = studentsList.filter((e) => (e[1] !== null && !e[2]));
    setDisplaySubmitted(submitted.map((obj) => {
      const submission = obj[1];
      const name = obj[0];
      const evaluated = obj[2];
      return (
        <View style={styles.container}>

          <Text style={styles.name}>{name}</Text>

          {(submission !== null && !evaluated)
            ? (
              <Text
                style={styles.evaluate}
                onPress={() => {
                  navigation.navigate('CreateEvaluation', { submissionID: submission });
                }}
              >
                Evaluate Assignment

              </Text>
            ) : []}

        </View>
      );
    }));

    const evaluated = studentsList.filter((e) => (e[1] !== null && e[2]));
    setDisplayEvaluated(evaluated.map((obj) => {
      const submission = obj[1];
      const name = obj[0];
      const e = obj[2];
      return (
        <View style={styles.container}>

          <Text style={styles.name}>{name}</Text>

          {(submission !== null && e)
            ? (
              // TODO: take teacher to a screen with the evaluation found via the given submissionID
              <Text>Student has submitted assignment</Text>
            ) : []}
        </View>
      );
    }));
  }, [navigation, finished4]);

  return (
    <View>
      <ScrollView>
        <List.Section>
          <List.Accordion
            title="Students Missing Assignments"
            left={() => <List.Icon icon="alert-circle" />}
            expanded={expanded}
            onPress={handlePress}
          >
            {displayMissing}
          </List.Accordion>
          <List.Accordion
            title="Students To Evaluate"
            left={() => <List.Icon icon="clipboard-check-multiple-outline" />}
            expanded={expanded1}
            onPress={handlePress1}
          >
            {displaySubmitted}
          </List.Accordion>
          <List.Accordion
            title="Students Evaluated"
            left={() => <List.Icon icon="clipboard-check-multiple" />}
            expanded={expanded2}
            onPress={handlePress2}
          >
            {displayEvaluated}
          </List.Accordion>
        </List.Section>
      </ScrollView>
    </View>

  );
}

SubmissionsList.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
