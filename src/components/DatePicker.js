/* eslint-disable no-plusplus */
import React, { useState } from 'react';
import {
  StyleSheet, View, Text,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  labelStyles: {
    color: '#828282',
    fontWeight: 'bold',
    marginLeft: 10
  },
  unitStyles: {
    color: '#BDBDBD',
    fontWeight: 'bold',
  },
  calendar: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  monthInput: {
    width: '36%',
  },
  dayInput: {
    width: '30%',
  },
  yearInput: {
    width: '33%',
  },
});

// props:
// currDay, currMonth, currYear: current date of birth (default to 1, 1, 2021; used in EditProfile)
// onChange (required): a function that receives the date string as a parameter
export default function DatePicker({
  currDay, currMonth, currYear, onChange,
}) {
  const [day, setDay] = useState(currDay);
  const [month, setMonth] = useState(currMonth);
  const [year, setYear] = useState(currYear);

  const [monthsDays, setDays] = useState([0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]);
  const pickerDays = [];
  for (let i = 1; i <= 31; ++i) {
    pickerDays.push(i);
  }
  const pickerMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const pickerYears = [];
  const d = new Date();
  const currentYear = d.getFullYear();
  console.log(currentYear);
  for (let i = currentYear; i >= 1920; i--) {
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
    <View>
      <Text style={styles.labelStyles}>Birthdate</Text>
      <View style={styles.calendar}>
        <Picker
          selectedValue={month}
          style={styles.monthInput}
          onValueChange={(itemValue) => {
            setDate(itemValue, day, year);
          }}
        >
          <Picker.Item key={13} label="Month" value={-1} color="#828282" />
          {pickerMonths.map((i, index) => (<Picker.Item key={i} label={i} value={index + 1} />))}
        </Picker>

        <Picker
          selectedValue={day}
          style={styles.dayInput}
          onValueChange={(itemValue) => {
            setDate(month, itemValue, year);
          }}
        >
          <Picker.Item key={32} label="Day" value={-1} color="#828282" />
          {pickerDays.map((i, index) => (index < monthsDays[month] && <Picker.Item key={i} label={`${i}`} value={i} />))}
        </Picker>
        <Picker
          selectedValue={year}
          style={styles.yearInput}
          onValueChange={(itemValue) => {
            setDate(month, day, itemValue);
          }}
        >
          <Picker.Item key={1919} label="Year" value={-1} color="#828282" />
          {pickerYears.map((i) => (<Picker.Item key={i} label={`${i}`} value={i} />))}
        </Picker>
      </View>
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
