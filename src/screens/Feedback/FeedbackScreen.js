/* eslint-disable react/forbid-prop-types */
import React, { useState, useRef, useEffect } from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';
import {
  Button, Input, Icon, ListItem, Avatar, CheckBox,
} from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import Video from 'react-native-video';
import PropTypes from 'prop-types';
import Firestore from '@react-native-firebase/firestore';
import Firebase from '@react-native-firebase/app';
import FeedbackPost from './Feedback';

const styles = StyleSheet.create({
  space: {
    width: 20,
    height: 15,
  },
  buttonPosition: {
    position: 'relative',
    top: 10,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
  },
  buttonContainer: {
    padding: 8,
    marginRight: 50,
    marginLeft: 50,
    backgroundColor: '#8E4F97',
    borderRadius: 50,
    width: 250,
    height: 40,
  },
  buttonContainerCancel: {
    padding: 8,
    marginRight: 50,
    marginLeft: 50,
    backgroundColor: '#C1C1C1',
    borderRadius: 50,
    width: 250,
    height: 40,
  },
  time: {
    color: '#4F4F4F',
    fontSize: 15,
  },
  timeDisabled: {
    color: '#ACACAC',
    fontSize: 15,
  },
  timeHelp: {
    color: '#BDBDBD',
    fontSize: 13,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
    padding: 5,
  },
  NoFeedback: {
    textAlign: 'center',
    fontSize: 35,
    fontFamily: 'Thonburi-Light',
    color: '#BDBDBD',
  },
});

function CreateFeedback({
  currentTime, setAddFeedback, setPause, addFeedback, submissionID, studentID,
}) {
  const [content, setContent] = useState('');
  const [initialTime] = useState(Math.floor(currentTime));
  const [usedSlider, setUsedSlider] = useState(false);
  const [sliderFlag, setSliderFlag] = useState(true);
  const [generalFeedback, setGeneralFeedback] = useState(false);

  /* If the user moves the slider, then UsedSlider will be set to true
  in order to remove the helper message. The floor function is used to
  account for the delay between the actual current time and the saved
  initial time. Basically, currentTime could be 5.003 seconds but the
  saved initialTime could be 5.002 seconds. Basically the same but code
  sees it as different.
  */
  if ((initialTime !== Math.floor(currentTime)) && sliderFlag) {
    setUsedSlider(true);
    setSliderFlag(false);
  }

  // Gets a time value and outputs the appropripate minutes:seconds text
  function getTime(time) {
    const minutes = time >= 60 ? Math.floor(time / 60) : 0;
    const seconds = Math.round(time - minutes * 60);

    return `${minutes >= 10 ? minutes : `0${minutes}`}:${
      seconds >= 10 ? seconds : `0${seconds}`
    }`;
  }

  // Function to handle submitting feedback to Firestore

  function handleSubmit() {
    let timePin = null;
    if (!generalFeedback) {
      timePin = currentTime;
    }

    const FeedbackRecord = {
      submissionID,
      studentID,
      authorID: Firebase.auth().currentUser.uid,
      createdAt: Firestore.Timestamp.now(),
      updatedAt: Firestore.Timestamp.now(),
      body: content,
      time: timePin,
    };

    Firestore().collection('feedback')
      .add(FeedbackRecord);
  }

  return (
    <View style={{ backgroundColor: 'white', borderBottomWidth: 25, borderBottomColor: 'white' }}>
      <ListItem
        leftIcon={generalFeedback ? (
          <Avatar
            rounded
            icon={{ name: 'clock', type: 'feather', color: '#BDBDBD' }}
            overlayContainerStyle={{ backgroundColor: 'white' }}
            size="medium"
          />
        )
          : (
            <Avatar
              rounded
              icon={{ name: 'clock', type: 'feather', color: '#A3C854' }}
              overlayContainerStyle={{ backgroundColor: 'white' }}
              size="medium"
            />
          )}
        title={generalFeedback ? (
          <View>
            <Text style={styles.timeDisabled}>General Feedback</Text>
          </View>
        )
          : (
            <View>
              <Text style={styles.time}>{getTime(currentTime)}</Text>
            </View>
          )}
        // eslint-disable-next-line no-nested-ternary
        subtitle={generalFeedback ? null
          : (
            usedSlider ? null
              : (
                <View>
                  <Text style={styles.timeHelp}>slide video to select time</Text>
                </View>
              ))}
      />
      <Input
        placeholder="add comment..."
        inputContainerStyle={styles.inputContainer}
        multiline
        onChangeText={setContent}
        value={content}
        fontFamily="Arial"
      />
      <CheckBox
        title="General Feedback"
        checkedIcon={<Icon type="feather" name="check-circle" color="#A3C854" />}
        uncheckedIcon={<Icon type="feather" name="circle" />}
        containerStyle={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
        checked={generalFeedback}
        onPress={() => { setGeneralFeedback(!generalFeedback); }}
      />
      <Button
        title="Cancel"
        titleStyle={{ fontFamily: 'Verdana' }}
        buttonStyle={styles.buttonContainerCancel}
        buttonContainer={{ borderBottomWidth: 10 }}
        onPress={() => { setAddFeedback(!addFeedback); setPause(false); }}
        style={styles.buttonPosition}
        icon={<Icon name="x" type="feather" color="white" />}
      />
      <View style={styles.space} />
      <Button
        title="Post Feedback"
        titleStyle={{ fontFamily: 'Verdana-Bold' }}
        buttonStyle={styles.buttonContainer}
        onPress={() => { setAddFeedback(!addFeedback); setPause(false); handleSubmit(); }}
        style={styles.buttonPosition}
      />
    </View>
  );
}

export default function FeedbackScreen({ route }) {
  const { submissionID } = route.params;

  const [pause, setPause] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [addFeedback, setAddFeedback] = useState(false);
  const [videoURL, setVideoURL] = useState('');
  const [studentID, setStudentID] = useState('');
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [feedbackData, setFeedbackData] = useState(null);
  const [feedbackPosts, setFeedbackPosts] = useState(null);
  const [noFeedback, setNoFeedback] = useState(false);
  const [loadCounter, setLoadCounter] = useState(0);
  const videoPlayer = useRef(null);
  const scrollRef = useRef(null);

  // As the video progresses, updates the currentTime
  const onProgress = (data) => {
    setCurrentTime(data.currentTime);
  };

  // Get the video URL from Firestore
  useEffect(() => {
    Firestore().collection('submissions')
      .doc(submissionID)
      .get()
      .then((snapshot) => {
        const url = snapshot.get('attachment');
        const studID = snapshot.get('authorID');
        setVideoURL(url);
        setStudentID(studID);
        setLoadingVideo(false);
      });
  });

  // Produce the list of feedback posts
  useEffect(() => {
    Firestore().collection('feedback')
      .where('submissionID', '==', submissionID)
      .orderBy('createdAt', 'desc')
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          const feedback = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setFeedbackData(feedback);
          setNoFeedback(false);
        } else {
          setNoFeedback(true);
        }
      })
      .then(() => {
        if (feedbackData !== null) {
          setFeedbackPosts(feedbackData.map((feedback) => (
            <FeedbackPost
              key={feedback.id}
              time={feedback.time}
              message={feedback.body}
              videoPlayer={videoPlayer}
              scrollRef={scrollRef}
            />
          )));
        }
      })
      .then(() => {
        /* Firebase is weird and we need to load it an extra time. This
        could simply be due to the server's latency.
        */
        if (loadCounter < 1 && !loadingVideo) {
          setLoadCounter(loadCounter + 1);
        }
      });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addFeedback, submissionID, loadCounter, loadingVideo]);

  /* Resets loadcounter everytime feedback is added. This will allow the
  new feedback (if it's made) to be rendered on the feedback screen.
  */
  useEffect(() => {
    setLoadCounter(0);
  }, [addFeedback]);

  return (
    <ScrollView ref={scrollRef}>
      <View>
        { loadingVideo ? null : (
          <Video
            source={{ uri: videoURL }}
            style={{
              aspectRatio: 1,
              width: '100%',
            }}
            controls
            resizeMode="contain"
            paused={pause}
            ref={videoPlayer}
            onProgress={onProgress}
            onSeek={() => { setPause(true); }}
            onEnd={() => { videoPlayer.current.seek(0); }}
          />
        )}
        {addFeedback
          ? (
            <CreateFeedback
              currentTime={currentTime}
              setAddFeedback={setAddFeedback}
              addFeedback={addFeedback}
              setPause={setPause}
              submissionID={submissionID}
              studentID={studentID}
            />
          )
          : (
            <>
              <Button
                title="Add Feedback"
                titleStyle={{ fontFamily: 'Verdana-Bold' }}
                buttonStyle={styles.buttonContainer}
                onPress={() => { setAddFeedback(!addFeedback); setPause(true); }}
                style={styles.buttonPosition}
              />
              {feedbackPosts}
            </>
          )}
      </View>
      {noFeedback ? (
        <>
          <View style={styles.space} />
          <View style={styles.space} />
          <Text style={styles.NoFeedback}>No Feedback Yet</Text>
        </>
      ) : null}
    </ScrollView>
  );
}

FeedbackScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
};

CreateFeedback.propTypes = {
  currentTime: PropTypes.number,
  setAddFeedback: PropTypes.func.isRequired,
  addFeedback: PropTypes.bool.isRequired,
  setPause: PropTypes.func.isRequired,
  submissionID: PropTypes.string.isRequired,
  studentID: PropTypes.string.isRequired,
};

CreateFeedback.defaultProps = {
  currentTime: null,
};
