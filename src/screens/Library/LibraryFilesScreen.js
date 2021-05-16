/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, SafeAreaView, ScrollView, View, Alert, TouchableHighlight, Text,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  subContainer: {
    marginBottom: 10,
    padding: 10,
  },
  card: {
    height: 50,
    width: '100%',
    backgroundColor: '#ffffff',
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
    width: '100%',
    height: 72,
  },
  searchBar: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderBottomWidth: 0,
    borderTopWidth: 0,
    width: '80%',
  },
  searchBarInput: {
    fontSize: 18,
    padding: 0,
    paddingBottom: 1,
  },
  searchBarInputContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderBottomWidth: 1,
    borderRadius: 10,
    height: 36,
  },
});

export default function LibraryFilesScreen({ navigation, route }) {
  const { fileType, classFiles } = route.params; // fileType = 'Videos', 'Photos', or 'Files'
  const [searchText, setSearch] = useState('');
  const [searchFiles, setSearchFiles] = useState({});
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (fileType === 'Videos') {
      classFiles.forEach((c) => {
        setItems((f) => [...f, { code: c.code, name: c.name, files: c.videos }]);
      });
    } else if (fileType === 'Photos') {
      classFiles.forEach((c) => {
        setItems((f) => [...f, { code: c.code, name: c.name, files: c.photos }]);
      });
    } else if (fileType === 'Files') {
      classFiles.forEach((c) => {
        setItems((f) => [...f, { code: c.code, name: c.name, files: c.files }]);
      });
    }
  }, []);

  // search function
  useEffect(() => {
    if (searchText) {
      items.forEach((c) => {
        // eslint-disable-next-line max-len
        const files = c.files.filter((f) => f.name.toLowerCase().includes(searchText.toLowerCase()));
        if (files.length) {
          setSearchFiles({
            ...searchFiles,
            [c.code]: { name: c.name, files },
          });
        } else {
          setSearchFiles((prev) => {
            const tempFiles = { ...prev };
            delete tempFiles[c.code];
            return tempFiles;
          });
        }
      });
    } else {
      setSearchFiles({});
    }
  }, [searchText]);

  if (!fileType) {
    Alert.alert('Error: No file type specified to display!');
    return navigation.goBack();
  }

  const text = fileType;

  return (
    <SafeAreaView>
      <ScrollView class={styles.container}>
        <Text>
          {text}
        </Text>
        <View style={styles.searchContainer}>
          <SearchBar
            lightTheme
            inputContainerStyle={styles.searchBarInputContainer}
            inputStyle={styles.searchBarInput}
            containerStyle={styles.searchBar}
            searchIcon={{ size: 27 }}
            placeholder={`Search ${text}`}
            onChangeText={setSearch}
            value={searchText}
          />
        </View>
        <Text>{`${Object.keys(searchFiles).length}`}</Text>
        {searchText ? (
          <View>
            {searchFiles && Object.keys(searchFiles).length ? (
              Object.entries(searchFiles).map(([code, obj]) => (
                <View class={styles.card} key={code}>
                  <Text>{obj.name}</Text>
                  {obj.files.map((f) => (
                    <TouchableHighlight class={styles.subContainer} key={f.name}>
                      <Text>{f.name}</Text>
                    </TouchableHighlight>
                  ))}
                </View>
              ))
            ) : (
              <Text>
                No matching files found.
              </Text>
            )}
          </View>
        ) : (
          <View>
            {items.map((i) => (
              <View key={i.code}>
                {i.files.length > 0 && (
                  <View class={styles.card}>
                    <Text>{i.name}</Text>
                    {i.files.map((f) => (
                      <TouchableHighlight class={styles.subContainer} key={f.name}>
                        <Text>{f.name}</Text>
                      </TouchableHighlight>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

LibraryFilesScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,

    goBack: PropTypes.func.isRequired,
  }).isRequired,

  route: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    params: PropTypes.object.isRequired,
  }).isRequired,
};
