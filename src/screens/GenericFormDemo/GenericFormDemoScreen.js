import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import GenericForm from '../../components/GenericForm';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    height: 400,
    padding: 20,
  },
  subContainer: {
    marginBottom: 20,
    padding: 10,
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 18,
    margin: 5,
    width: 200,
    paddingLeft: 6,
    height: 40,
  },
});

const formDefinition = {
  fields: [
    {
      name: 'firstName',
      label: 'First name',
    },
    {
      name: 'lastName',
      label: 'Last name',
    },
    {
      name: 'email',
      type: 'email',
      label: 'E-mail',
    },
  ],
  submitClickCallback: (values) => { Alert.alert(JSON.stringify(values)); },
};

export default function GenericFormDemoScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <GenericForm formDefinition={formDefinition} styles={styles} />
        <View style={styles.subContainerButton}>
          <Button
            style={styles.textInput}
            title="Back to Home"
            onPress={() => {
              navigation.navigate('Home');
            }}
          />
        </View>
      </View>
    </View>
  );
}

// eslint-disable-next-line no-unused-vars
GenericFormDemoScreen.navigationOptions = ({ navigation }) => ({
  title: 'Test Form',
  headerShown: false,
});

GenericFormDemoScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
