import Firestore, { firebase } from '@react-native-firebase/firestore';

const db = {
  FEEDBACK: 'evaluations',
};
async function createEval({
  teacherId, recording, studentId, submissionComment,
}) {
  const newEval = {
    teacherId,
    createdAt: Firestore.Timestamp.now(),
    updatedAt: Firestore.Timestamp.now(),
    recording,
    evaluations: [],
    submissionComment,
    studentId,
  };
  return Firestore().collection(db.FEEDBACK).add(newEval);
}

async function createTimestampFeedback(evalId, feedback) {
  const data = {
    ...feedback,
    startTime: Number(feedback.startTime),
    endTime: Number(feedback.endTime),
  };

  return Firestore().collection(db.FEEDBACK).doc(evalId).update({
    evaluations: firebase.firestore.FieldValue.arrayUnion(data),
  });
}

export { createEval, createTimestampFeedback };
