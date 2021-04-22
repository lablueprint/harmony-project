/* eslint-disable no-plusplus */
import React, { useState } from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  calendar: {
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 18,
    margin: 5,
    width: 200,
  },
});

// props:
// currDay, currMonth, currYear: current date of birth (default to 1, 1, 2021; used in EditProfile)
// onChange (required): a function that receives the date string as a parameter
export default function DatePicker({
  currDay, currMonth, currYear, onChange,
}) {
  const [day, setDay] = useState(currDay);
  const [month, setMonth] = useState(currMonth - 1);
  const [year, setYear] = useState(currYear);

  const [monthsDays, setDays] = useState([31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]);
  const pickerDays = [];
  for (let i = 1; i <= 31; ++i) {
    pickerDays.push(i);
  }
  const pickerMonths = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  const pickerYears = [];
  for (let i = 1920; i <= 2021; ++i) {
    pickerYears.push(i);
  }

  function setDate(m, d, y) {
    if (d > monthsDays[m]) {
      setDay(monthsDays[m]);
    } else {
      setDay(d);
    }
    setMonth(m);
    setYear(y);

    const tempDays = [...monthsDays];
    // leap year adjustments for February day count
    if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) {
      tempDays[1] = 29;
    } else {
      tempDays[1] = 28;
    }
    setDays(tempDays);

    let date = '';
    let monthString = '';
    let dayString = '';
    if (m < 9) {
      monthString = `0${m}`;
    } else {
      monthString = `${m}`;
    }
    if (d < 9) {
      dayString = `0${d}`;
    } else {
      dayString = `${d}`;
    }

    date = `${y}-${monthString}-${dayString}`;

    onChange(date);
  }

  return (
    <View style={styles.calendar}>
      <Picker
        selectedValue={month}
        style={styles.textInput}
        onValueChange={(itemValue) => {
          setDate(itemValue, day, year);
        }}
      >
        {pickerMonths.map((i, index) => (<Picker.Item key={i} label={i} value={index} />))}
      </Picker>
      <Picker
        selectedValue={day}
        style={styles.textInput}
        onValueChange={(itemValue) => {
          setDate(month, itemValue, year);
        }}
      >
        {pickerDays.map((i, index) => (index < monthsDays[month] && <Picker.Item key={i} label={`${i}`} value={i} />))}
      </Picker>
      <Picker
        selectedValue={year}
        style={styles.textInput}
        onValueChange={(itemValue) => {
          setDate(month, day, itemValue);
        }}
      >
        {pickerYears.map((i) => (<Picker.Item key={i} label={`${i}`} value={i} />))}
      </Picker>
    </View>
  );
}

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  currDay: PropTypes.number,
  currMonth: PropTypes.number,
  currYear: PropTypes.number,
};

DatePicker.defaultProps = {
  currDay: 1,
  currMonth: 1,
  currYear: 2021,
};
