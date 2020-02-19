import React, { Component } from 'react';
import { Alert, Text, View } from 'react-native';

import { FireBaseStorage } from '../Utils/FireBaseStorage'

const TestFireBase = () => {

	return (
		<View>
			{alert(JSON.stringify(FireBaseStorage))}
		</View>
	);
};

export default TestFireBase;