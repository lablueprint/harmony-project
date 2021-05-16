import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, View, Text, TextInput, Button,
  Alert,
  Keyboard,
  Modal,
  ActivityIndicator,
} from 'react-native';
// import PropTypes from 'prop-types';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import { createFeedback, submitFeedbackComment } from '../../utils/Firebase';
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
   * evalDoc - A document in the evaluations collection that corresponds to a single
   * evaluation screen
   *
   * setEvalDoc - A function called after the evaluation document has been retrieved
   * from Firebase
   */
  const [evalDoc, setEvalDoc] = useState({});

  /**
   * range - {startTime, endTime} (in seconds) of timestamped feedback
   */
  const [range, setRange] = useState({});

  /**
   * docId - (In the future, this should be retrieved from navigation, etc. rather than being
   * "hardcoded") Is the document ID of an example evaluation scrren in Firestore
   */
  const submissionID = navigation.params?.submissionID ?? null;
  const [feedbackID, setFeedbackID] = useState(null);

  const [newComment, setNewComment] = useState({});
  const [submittingComment, setSubmittingComment] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  /**
   * Uses the docId to retrieve a particular evaluation document.
   */
  useEffect(() => {
    async function fetchOrCreateFeedback() {
      const submission = await Firestore().collection('submissions').doc(submissionID).get();
      if (submission.exists && submission.data().hasReceivedFeedback) {
        const querySnapshot = await Firestore().collection('feedback').where('submissionID', '==', submissionID)
          .get();
        if (querySnapshot.size > 0) { // should only be one match
          setEvalDoc(querySnapshot.docs[0].data());
          setFeedbackID(querySnapshot.docs[0].id);
        }
      } else {
        const newDoc = await createFeedback({ // will also update hasReceivedFeedback on submission
          submissionID,
          studentID: navigation?.studentID ?? null,
          teacherID: navigation?.getParam ?? teacherID,
          createdAt: Firestore.Timestamp.now(),
          updatedAt: Firestore.Timestamp.now(),
        });
        setFeedbackID(newDoc.id);
      }
    }
    fetchOrCreateFeedback();
  }, [submittingComment]);
  async function handleAddTimestampFeedback() {
    Keyboard.dismiss();
    setModalVisible(false);
    try {
      setSubmittingComment(true);
      await submitFeedbackComment(feedbackID, newComment);
      setNewComment({});
      setSubmittingComment(false);
    } catch (err) {
      Alert.alert(
        'Your feedback could not be added.',
        err,
        [
          { text: 'OK' },
        ],
        { cancelable: false },
      );
      // TODO: add toast/popup to confirm comment add
      setSubmittingComment(false);
    }
  }
  // TODO: check media type and display accordingly
  return (
    <>
      <View style={{ flex: 3 }}>
        <EvalVideo
          videoLink={navigation.getParam('attachment')}
          range={range}
          setRange={setRange}
          videoPlayer={videoPlayer}
        />
      </View>
      {/* TODO: convert to modal */}
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
        {submittingComment ? <ActivityIndicator size="large" /> : <Button title="Add new comment" onPress={() => setModalVisible(true)} /> }
        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 22,
            backgroundColor: '#00000080',
          }}
          >
            <View style={{
              flex: 1,
              margin: 10,
              padding: 25,
              backgroundColor: 'white',
              borderRadius: 20,
              alignItems: 'flex-start',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 2,
            }}
            >
              <TextInput
                style={{ width: '100%', textAlignVertical: 'top' }}
                editable={!submittingComment}
                multiline
                numberOfLines={5}
                placeholder="Start typing..."
                value={newComment.body}
                onChangeText={(body) => setNewComment({ ...newComment, body })}
              />
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
              >
                <View style={{ flex: 1, marginRight: 5 }}>
                  <Text style={{ marginRight: 5 }}>Start time (seconds):</Text>
                </View>
                <View style={{ flex: 3, marginRight: 5 }}>
                  <TextInput
                    editable={!submittingComment}
                    placeholder="0"
                    keyboardType="numeric"
                    value={newComment.startTime}
                    onChangeText={(startTime) => setNewComment({ ...newComment, startTime })}
                  />
                </View>
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
              >
                <View style={{ flex: 1, marginRight: 5 }}>
                  <Text style={{ marginRight: 5 }}>End time (seconds):</Text>
                </View>
                <View style={{ flex: 3, marginRight: 5 }}>
                  <TextInput
                    editable={!submittingComment}
                    placeholder="0"
                    keyboardType="numeric"
                    value={newComment.endTime}
                    onChangeText={(endTime) => setNewComment({ ...newComment, endTime })}
                  />
                </View>
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: '100%',
              }}
              >
                <Button title="Save draft" onPress={() => setModalVisible(!modalVisible)} />
                <Button
                  title="Discard"
                  onPress={() => {
                    setNewComment({});
                    setModalVisible(!modalVisible);
                  }}
                />
                <Button disabled={submittingComment} title="Post comment" onPress={handleAddTimestampFeedback} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={{ flex: 6 }}>
        <View>
          {evalDoc.evaluations && (
          <TimestampedFeedbackList
            evaluations={evalDoc.evaluations}
            videoPlayer={videoPlayer}
            setRange={setRange}
          />
          )}
        </View>
      </View>
    </>
  );
}

// // eslint-disable-next-line no-unused-vars
// EvaluationScreen.navigationOptions = ({ navigation }) => ({
//   title: 'Evaluation',
//   headerShown: true, // button within the header to go back to the (homescreen)
// });

EvaluationScreen.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  navigation: PropTypes.object.isRequired,
};
