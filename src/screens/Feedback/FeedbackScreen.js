import React, { useState, useRef } from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';
import {
  Button, Input, Icon, ListItem, Avatar, CheckBox,
} from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import Video from 'react-native-video';
import PropTypes from 'prop-types';
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
});

function CreateFeedback({
  currentTime, setAddFeedback, setPause, addFeedback,
}) {
  const [content, setContent] = useState('');
  const [initialTime] = useState(Math.floor(currentTime));
  const [usedSlider, setUsedSlider] = useState(false);
  const [sliderFlag, setSliderFlag] = useState(true);
  const [generalFeedback, setGeneralFeedback] = useState(false);

  /* If the user moves the slider, then UsedSlider will be set to true
  in order to remove the helper message. The floor function is used to
  account for the delay between the acctual current time and the saved
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
    const seconds = Math.floor(time - minutes * 60);

    return `${minutes >= 10 ? minutes : `0${minutes}`}:${
      seconds >= 10 ? seconds : `0${seconds}`
    }`;
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
        onPress={() => { setAddFeedback(!addFeedback); setPause(false); }}
        style={styles.buttonPosition}
      />
    </View>
  );
}

export default function FeedbackScreen() {
  // Handles Feedback screen itself
  const [pause, setPause] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [addFeedback, setAddFeedback] = useState(false);
  const videoPlayer = useRef(null);

  // Gets a time value and outputs the appropripate minutes:seconds text
  function getTime(time) {
    const minutes = time >= 60 ? Math.floor(time / 60) : 0;
    const seconds = Math.floor(time - minutes * 60);

    return `${minutes >= 10 ? minutes : `0${minutes}`}:${
      seconds >= 10 ? seconds : `0${seconds}`
    }`;
  }

  // As the video progresses, updates the currentTime
  const onProgress = (data) => {
    setCurrentTime(data.currentTime);
  };

  // On loading the video, get the max video time
  const onLoad = (data) => {
    setDuration(data.duration);
  };

  return (
    <ScrollView>
      <View>
        <Text style={{
          padding: 5, marginRight: 30, marginLeft: 30, marginTop: 30,
        }}
        >
          Time:
          {' '}
          {getTime(currentTime)}
          {' of '}
          {getTime(duration)}
        </Text>
        <Video
          source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/la-blueprint-harmony-project.appspot.com/o/recordings%2FSample%20Violin.mp4?alt=media&token=36b5a316-5d7b-4ba5-b51c-a36ec2fec79d' }}
          style={{
            aspectRatio: 1,
            width: '100%',
          }}
          controls
          resizeMode="contain"
          paused={pause}
          ref={videoPlayer}
          onProgress={onProgress}
          onLoad={onLoad}
          onSeek={() => { setPause(!pause); }}
        />
        {addFeedback
          ? (
            <CreateFeedback
              currentTime={currentTime}
              setAddFeedback={setAddFeedback}
              addFeedback={addFeedback}
              setPause={setPause}
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
              <FeedbackPost
                time={10}
                message="Beautiful Form!"
                videoPlayer={videoPlayer}
              />
            </>
          )}
      </View>
    </ScrollView>
  );
}

CreateFeedback.propTypes = {
  currentTime: PropTypes.number.isRequired,
  setAddFeedback: PropTypes.func.isRequired,
  addFeedback: PropTypes.bool.isRequired,
  setPause: PropTypes.func.isRequired,
};
