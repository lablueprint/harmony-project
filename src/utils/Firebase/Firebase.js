import Firestore, { firebase } from '@react-native-firebase/firestore';

const db = {
  FEEDBACK: 'feedback',
  SUBMISSIONS: 'submissions',
};

async function createFeedback({
  submissionID, studentID, teacherID,
}) {
  const newEval = {
    submissionID,
    studentID,
    teacherID,
    createdAt: Firestore.Timestamp.now(),
    updatedAt: Firestore.Timestamp.now(),
  };
  await Firestore().collection(db.SUBMISSIONS).doc(submissionID)
    .update({ hasReceivedFeedback: true });
  return Firestore().collection(db.FEEDBACK).add(newEval);
}

async function submitFeedbackComment(feedbackID, feedback) {
  const data = {
    ...feedback,
  };

  return Firestore().collection(db.FEEDBACK).doc(feedbackID).update({
    evaluations: firebase.firestore.FieldValue.arrayUnion(data),
  });
}

export { createFeedback, submitFeedbackComment };
