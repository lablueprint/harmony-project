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

export default function EnterClassCode({
  navigation, role, doDisplay, setDoDisplay,
}) {
  let classCode = '';

  const [showLoading, setShowLoading] = useState(false);
  const [classCodeErr, setClassCodeErr] = useState('');

  function checkClassCode() {
    if (classCode === '') {
      setClassCodeErr('*Please enter a classroom code.');
    } else {
      setShowLoading(true);
      Auth().signInAnonymously().then((user) => {
        if (user) {
          Firestore().collection('classrooms').doc(classCode).get()
            .then((doc) => {
              if (doc.exists) {
                setDoDisplay(false);
                navigation.navigate('UserInformation', { classCode, role });
              } else {
                setClassCodeErr('*Invalid classroom code');
              }
            })
            .then(() => setShowLoading(false))
            .catch((e) => {
              console.warn(e.message);
              setShowLoading(false);
            });

          // Delete anonymous user after fetching instruments from Firestore
          Auth().currentUser.delete();
        }
      }).catch((e) => {
        console.warn(e.message);
        setShowLoading(false);
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
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  role: PropTypes.string.isRequired,
  doDisplay: PropTypes.bool.isRequired,
  setDoDisplay: PropTypes.func.isRequired,
};
