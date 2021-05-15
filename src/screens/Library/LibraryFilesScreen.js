/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, ScrollView, View, Alert, TouchableHighlight, Text,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    backgroundColor: '#F6F6F6',
    height: '100%',
  },
  headerContainer: {
    height: 50,
    width: '100%',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#BDBDBD',
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 40, // scuffed????
  },
  headerText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
  subCard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    height: 20,
    width: '100%',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#BDBDBD',
    paddingVertical: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 20,
  },
  cardIcon: {
    position: 'absolute',
    left: 20,
  },
  cardText: {
    fontFamily: 'Inter',
    fontSize: 16,
    paddingLeft: 55,
  },
  cardContainer: {
    height: '100%',
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
    width: '100%',
    height: 72,
    borderBottomWidth: 1,
    borderColor: '#BDBDBD',
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
  const [searchFiles, setSearchFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const items = {
    code: classFiles.code,
    name: classFiles.name,
    files: classFiles[fileType.toLowerCase()],
  };

  // search function
  useEffect(() => {
    setLoading(true);
    if (searchText) {
      // eslint-disable-next-line max-len
      const files = items.files.filter((f) => f.name.toLowerCase().includes(searchText.toLowerCase()));
      if (files.length) {
        setSearchFiles(files);
      } else {
        setSearchFiles([]);
      }
      setLoading(false);
    } else {
      setSearchFiles([]);
    }
  }, [searchText]);

  if (!fileType) {
    Alert.alert('Error: No file type specified to display!');
    return navigation.goBack();
  }

  const text = fileType;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          {`${items.name}'s ${text}`}
        </Text>
      </View>
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
      {searchText && !loading ? (
        <>
          {searchFiles.length > 0 ? (
            <ScrollView style={styles.cardContainer}>
              {searchFiles.map((f) => (
                <TouchableHighlight
                  underlayColor="#EEEEEE"
                  onPress={() => {}}
                  style={styles.card}
                  key={f.getDownloadURL()}
                >
                  <Text style={styles.cardText}>
                    {f.name}
                  </Text>
                </TouchableHighlight>
              ))}
            </ScrollView>
          ) : (
            <Text>
              No matching files found.
            </Text>
          )}
        </>
      ) : (
        <ScrollView style={styles.cardContainer}>
          {items.files.length > 0 ? items.files.map((f) => (
            <TouchableHighlight
              underlayColor="#EEEEEE"
              onPress={() => {}}
              style={styles.card}
              key={f.getDownloadURL()}
            >
              <Text style={styles.cardText}>
                {f.name}
              </Text>
            </TouchableHighlight>
          )) : (
            <Text>
              {`No ${text.toLowerCase()} yet! When your teacher uploads ${text.toLowerCase()}, they will show up here.`}
            </Text>
          )}
        </ScrollView>
      )}
    </View>
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
