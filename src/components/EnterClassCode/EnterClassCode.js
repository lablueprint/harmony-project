import React, { useState } from 'react';
import {
  StyleSheet, ActivityIndicator, View, Text,
} from 'react-native';
import { Overlay, Input, Button } from 'react-native-elements';
import Auth from '@react-native-firebase/auth';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  h3: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F4F4F',
  },
});

/**
 *
 * @param {Boolean} doDisplay - Determines if overlay should be displayed or not.
 * @param {function} setDoDisplay - Function that sets doDisplay.
 * @param {function} setClassCode - Function that sets the classCode. "Returns" the classCode
 * (as a useState pair)
 * @returns A modal that asks the user for the class code and verifies if the code is valid.
 */
export default function EnterClassCode({
  doDisplay, setDoDisplay, setClassCode,
}) {
  let classCode = '';

  const [showLoading, setShowLoading] = useState(false);
  const [classCodeErr, setClassCodeErr] = useState('');

  async function isValidClassCode() {
    await Firestore().collection('classrooms').doc(classCode).get()
      .then((doc) => {
        if (doc.exists) {
          setShowLoading(false);
          setDoDisplay(false);
          setClassCode(classCode);
        } else {
          setShowLoading(false);
          setClassCodeErr('*Invalid classroom code');
        }
      })
      .catch((e) => {
        console.warn(e);
      });
  }

  function checkClassCode() {
    if (classCode === '') {
      setClassCodeErr('*Please enter a classroom code.');
    } else {
      setShowLoading(true);
      Auth().onAuthStateChanged(async (user) => {
        if (user) {
          // User is signed in.
          await isValidClassCode();
        } else {
          // No user is signed in.
          Auth().signInAnonymously()
            .then(async (anon) => {
              if (anon) {
                await isValidClassCode();
              }
            })
            . catch((e) => {
              console.warn(e);
            });
        }
      });
    }
  }

  return (
    <Overlay
      isVisible={doDisplay}
      borderRadius={10}
      width={300}
      height={190}
      overlayStyle={{
        display: 'flex', justifyContent: 'center',
      }}
      onBackdropPress={() => setDoDisplay(false)}
    >
      <View>
        {showLoading
            && (
            <View>
              <ActivityIndicator size="large" color="#828282" />
            </View>
            )}
        {!showLoading && (
          <View style={{ padding: 10 }}>
            <Text style={styles.h3}>Enter classroom code: </Text>
            <Input
              placeholder="Classroom code"
              onChangeText={(value) => { classCode = value; }}
              errorMessage={classCodeErr}
            />
            <View style={{
              display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', padding: 10,
            }}
            >
              <Button
                buttonStyle={{ backgroundColor: 'transparent' }}
                title="Cancel"
                titleStyle={{ color: '#828282' }}
                onPress={() => {
                  setClassCodeErr('');
                  setDoDisplay(false);
                }}
              />
              <Button
                buttonStyle={{
                  backgroundColor: '#8E4F97',
                  borderRadius: 40,
                  width: 100,
                }}
                title="Submit"
                titleStyle={{ color: '#ffffff' }}
                onPress={() => {
                  checkClassCode();
                }}
              />
            </View>
          </View>
        )}
      </View>
    </Overlay>
  );
}

EnterClassCode.propTypes = {
  doDisplay: PropTypes.bool.isRequired,
  setDoDisplay: PropTypes.func.isRequired,
  setClassCode: PropTypes.func.isRequired,
};
