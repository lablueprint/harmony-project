import { ScrollView } from 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import { Button } from 'react-native-elements';
import { List } from 'react-native-paper';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import Firebase from '@react-native-firebase/app';

const styles = StyleSheet.create({
  accordion: {
    backgroundColor: 'white',
    height: 65,
    margin: 5,
    marginBottom: 6,
  },
  container: {
    flex: 1,
    paddingBottom: 8,
    paddingLeft: 40,
    display: 'flex',
    flexDirection: 'row',
  },
  name: {
    padding: 12,
    fontFamily: 'Helvetica',
    backgroundColor: 'white',
    width: 335,
    borderRadius: 15,
  },
  missing: {
    padding: 12,
    fontFamily: 'Helvetica',
    backgroundColor: 'white',
    width: '90%',
    color: 'red',
  },
  buttonText_3: {
    color: '#8e4f97',
    fontSize: 16,
    fontWeight: '500',
  },
  evaluate: {
    padding: 12,
    fontFamily: 'Helvetica',
    backgroundColor: 'white',
    width: '90%',
    color: 'blue',
  },
  header: {
    padding: 12,
    fontFamily: 'Helvetica',
    backgroundColor: 'white',
    width: '90%',
    color: 'blue',
  },

});

export default function SubmissionsList({ route, navigation }) {
  // const [errorMessage, setErrorMessage] = useState(null);
  const [assignmentID, setAssignmentID] = useState(null);
  const [classroomID, setClassroomID] = useState(null);
  const { teacherID } = Firebase.auth().currentUser.uid;
  // const [initializing, setInitializing] = useState(true);
  // TODO: refactor all this to just use the original submission object
  const [studentIDsList, setStudentIDsList] = useState([]);
  const [studentNames, setStudentNames] = useState([]);
  const [submissionIDs, setSubmissionIDs] = useState([]);
  const [submissionFeedback, setSubmissionFeedback] = useState([]);
  const [submissionAttachments, setSubmissionAttachments] = useState([]);
  const [studentsList, setStudentList] = useState([]);
  // using this as a hacky obj array in the meantime
  const [displayMissing, setDisplayMissing] = useState([]);
  const [displaySubmitted, setDisplaySubmitted] = useState([]);
  const [displayEvaluated, setDisplayEvaluated] = useState([]);

  const [finished0, setFinished0] = useState(false);
  const [finished1, setFinished1] = useState(false);
  const [finished2, setFinished2] = useState(false);
  const [finished3, setFinished3] = useState(false);
  const [finished4, setFinished4] = useState(false);

  const { a, c } = route.params;

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
                  setSubmissionAttachments((submissionAttachments) => [...submissionAttachments,
                    data.attachment]);
                  setSubmissionIDs((submissionIDs1) => [...submissionIDs1, doc.id]);
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
      // hacky, needs reworking
      const zipped = studentNames.map((x, i) => [x, submissionIDs[i],
        submissionFeedback[i], studentIDsList[i], submissionAttachments[i]]);
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
      // const submission = obj[1];
      const name = obj[0];
      return (
        <View style={styles.container}>

          <Button title={name} titleStyle={styles.buttonText_3} buttonStyle={styles.name} />

        </View>
      );
    }));

    const submitted = studentsList.filter((e) => (e[1] !== null && !e[2]));
    setDisplaySubmitted(submitted.map((obj) => {
      // ..this needs to be rewritten
      const submissionID = obj[1];
      const name = obj[0];
      // const evaluated = obj[2];
      const studentID = obj[3];
      const attachment = obj[4];
      // const evaluated = obj[2];
      return (
        <View style={styles.container}>

          {/* {(submission !== null && !evaluated)
            ? ( */}
          <Button
            title={`Leave Feedback For : ${name}`}
            titleStyle={styles.buttonText_3}
            buttonStyle={styles.name}
            onPress={() => {
              navigation.navigate('Evaluation', {
                submissionID, teacherID, studentID, attachment,
              });
            }}
          />
          {/* // ) : []} */}

        </View>
      );
    }));

    const evaluated = studentsList.filter((e) => (e[1] !== null && e[2]));
    setDisplayEvaluated(evaluated.map((obj) => {
      const name = obj[0];

      return (
        <View style={styles.container}>

          <Button title={name} titleStyle={styles.buttonText_3} buttonStyle={styles.name} />

        </View>
      );
    }));
  }, [navigation, finished4, studentsList, teacherID]);

  return (
    <View>
      <ScrollView>
        <List.Section>
          <List.Accordion
            style={styles.accordion}
            title="Students Missing Submission"
            left={() => <List.Icon icon="alert-circle" />}
            expanded={expanded}
            onPress={handlePress}
          >
            {displayMissing}
          </List.Accordion>
          <List.Accordion
            style={styles.accordion}
            title="Students To Evaluate"
            left={() => <List.Icon icon="clipboard-check-multiple-outline" />}
            expanded={expanded1}
            onPress={handlePress1}
          >
            {displaySubmitted}
          </List.Accordion>
          <List.Accordion
            style={styles.accordion}
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
  route: PropTypes.shape({
    params: PropTypes.func.isRequired,
  }).isRequired,
};
