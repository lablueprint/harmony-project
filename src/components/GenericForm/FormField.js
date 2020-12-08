/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { useField } from 'formik';
import { Input } from 'react-native-elements';
import { View } from 'react-native';
import PropTypes from 'prop-types';

const FormField = ({
  label,
  ...props
}) => {
  const [field, meta] = useField(props);
  return (
    <>
      <Input
        label={label}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <View className="error">{meta.error}</View>
      ) : null}
    </>
  );
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
};

export default FormField;
