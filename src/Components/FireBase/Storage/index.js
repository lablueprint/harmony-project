import React, { Component } from 'react';
import { Alert, Text, View } from 'react-native';

import { FireBaseStorage } from './FireBaseStorage'

const TestFireBase = () => {

	return (
		<View>
			{alert(JSON.stringify(FireBaseStorage))}
		</View>
	);
};

export default TestFireBase;