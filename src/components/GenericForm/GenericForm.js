import React from 'react';
import { Formik } from 'formik';
import { StyleSheet, View, ViewPropTypes } from 'react-native';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';


import FormField from './FormField';

const GenericForm = (props) => {
  const { formDefinition, styles } = props;
  const { fields, submitClickCallback } = formDefinition;

  return fields ? (
    <View style={styles.formContainer}>
      <Formik
        initialValues={{}}
        onSubmit={(values, actions) => {
          submitClickCallback(values);
          actions.setSubmitting(false);
          actions.resetForm();
        }}
      >
        {({
          values, handleChange, handleBlur, handleSubmit,
        }) => (
          <View>
            <View style={styles.subContainer}>
              {fields.map(({ name, type = 'text', label }) => (
                <View style={styles.subContainer}>
                  <FormField
                    key={name}
                    name={name}
                    type={type}
                    label={label}
                    onChangeText={handleChange(name)}
                    onBlur={handleBlur(name)}
                    value={values[name]}
                    style={styles.TextInput}
                  />
                </View>
              ))}
            </View>
            <Button title="Submit" onPress={handleSubmit} />
          </View>
        )}
      </Formik>
    </View>
  ) : (<View>No Field Error</View>);
};

GenericForm.propTypes = {
  formDefinition: PropTypes.shape({
    fields: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string,
    })).isRequired,
    submitClickCallback: PropTypes.func,
  }).isRequired,
  styles: ViewPropTypes.style,
};

const defaultStylesheet = StyleSheet.create({
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

GenericForm.defaultProps = {
  styles: defaultStylesheet,
};

export default GenericForm;
