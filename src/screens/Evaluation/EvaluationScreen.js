import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, View, Text, TextInput, Button,
  Alert,
  Keyboard,
} from 'react-native';
// import PropTypes from 'prop-types';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import { createEval, createTimestampFeedback } from '../../utils/Firebase';
import EvalVideo from './EvalVideo';
import TimestampedFeedbackList from './TimestampedFeedbackList';

const styles = StyleSheet.create({
});

/**
 * Returns an EvaluationScreen with a submission video and the teacher's timestamped
 * feedback comments
 */
// TODO: rename evaluations to 'feedback'
export default function EvaluationScreen({ navigation }) {
  /**
   * videoPlayer - Allows TimestampedFeedbackList to access EvalVideo's seek() function
   */
  const videoPlayer = useRef(null);

  /**
   * evaluationDoc - A document in the evaluations collection that corresponds to a single
   * evaluation screen
   *
   * setEvaluationDoc - A function called after the evaluation document has been retrieved
   * from Firebase
   */
  const [evaluationDoc, setEvaluationDoc] = useState({});

  /**
   * range - {startTime, endTime} (in seconds) of timestamped feedback
   */
  const [range, setRange] = useState({});

  /**
   * docId - (In the future, this should be retrieved from navigation, etc. rather than being
   * "hardcoded") Is the document ID of an example evaluation scrren in Firestore
   */
  const [evalId, setEvalId] = useState(navigation.getParam('evalId', null));

  const [newComment, setNewComment] = useState({});
  const [submittingComment, setSubmittingComment] = useState(false);
  /**
   * Uses the docId to retrieve a particular evaluation document.
   */
  useEffect(() => {
    // TODO: refactor this to utils, add to assignment list view
    const placeholderRecording = 'https://firebasestorage.googleapis.com/v0/b/la-blueprint-harmony-project.appspot.com/o/images%2FVID_20200310_193940847.mp4?alt=media&token=9651b6e5-a82e-4578-91c3-0b261c609e52';
    const placeholderId = 'bTzLmdl03mDOYwsZMyCP';
    setEvalId(placeholderId);
    // async function createEval({
    //   teacherId, recording, studentId, submissionComment,
    // }) {
    //   const newEval = {
    //     teacherId,
    //     createdAt: Firestore.Timestamp.now(),
    //     updatedAt: Firestore.Timestamp.now(),
    //     recording,
    //     evaluations: [],
    //     submissionComment,
    //     studentId,
    //   };
    //   return Firestore().collection('evaluations').add(newEval);
    // }
    async function fetchOrCreateEval() {
      if (submittingComment) return;
      let evalDoc = await Firestore().collection('evaluations').doc(evalId).get();
      if (evalDoc.exists) {
        setEvaluationDoc(evalDoc.data());
      } else {
        evalDoc = await createEval({
          teacherId: 'testTeacher',
          studentId: 'testStudent',
          recording: placeholderRecording,
          submissionComment: 'testComment',
        });
        setEvalId(evalDoc.id);
      }
    }
    fetchOrCreateEval();
  }, [evalId, submittingComment]);
  async function handleAddTimestampFeedback() {
    Keyboard.dismiss();
    try {
      setSubmittingComment(true);
      await createTimestampFeedback(evalId, newComment);
      setNewComment({});
      setSubmittingComment(false);
    } catch (err) {
      Alert.alert(
        'Your feedback could not be added.',
        err,
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      );
      setSubmittingComment(false);
    }
  }
  return (
    <>
      {evaluationDoc.recording
      && (
      // Stop autoplay?
      <View style={{ flex: 3 }}>
        <EvalVideo
          videoLink={evaluationDoc.recording}
          range={range}
          setRange={setRange}
          videoPlayer={videoPlayer}
        />
      </View>
      )}
      {/* TODO: convert to modal */}
      <View style={{ flex: 6 }}>
        <Text style={{ flex: 2 }}>Add new comment:</Text>
        <TextInput
          style={{ flex: 2 }}
          editable={!submittingComment}
          placeholder="Title"
          value={newComment.title}
          onChangeText={(title) => setNewComment({ ...newComment, title })}
        />
        <TextInput
          style={{ flex: 2 }}
          editable={!submittingComment}
          multiline
          placeholder="Start typing..."
          value={newComment.body}
          onChangeText={(body) => setNewComment({ ...newComment, body })}
        />
        <TextInput
          style={{ flex: 2 }}
          editable={!submittingComment}
          placeholder="Start time"
          keyboardType="numeric"
          value={newComment.startTime}
          onChangeText={(startTime) => setNewComment({ ...newComment, startTime })}
        />
        <TextInput
          style={{ flex: 2 }}
          editable={!submittingComment}
          placeholder="End time"
          keyboardType="numeric"
          value={newComment.endTime}
          onChangeText={(endTime) => setNewComment({ ...newComment, endTime })}
        />
        <Button disabled={submittingComment} title="Add new comment" onPress={handleAddTimestampFeedback} />
      </View>
      <View style={{ flex: 3 }}>
        <View>
          {evaluationDoc.evaluations && (
          <TimestampedFeedbackList
            evaluations={evaluationDoc.evaluations}
            videoPlayer={videoPlayer}
            setRange={setRange}
          />
          )}
        </View>
      </View>
    </>
  );
}

// eslint-disable-next-line no-unused-vars
EvaluationScreen.navigationOptions = ({ navigation }) => ({
  title: 'Evaluation',
  headerShown: true, // button within the header to go back to the (homescreen)
});

EvaluationScreen.propTypes = {
  navigation: PropTypes.elementType.isRequired,
};
