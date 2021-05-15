/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, ScrollView, View, Alert, TouchableHighlight, Text,
} from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
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
    backgroundColor: '#ffffff',
  },
  cardHeader: {
    paddingTop: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#BDBDBD',
  },
  cardHeaderText: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'Inter-SemiBold',
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
  filesContainer: {
    height: '100%',
  },
});

export default function LibraryFilesScreen({ navigation, route }) {
  const { fileType, classFiles } = route.params; // fileType = 'Videos', 'Photos', or 'Files'
  const [searchText, setSearch] = useState('');
  const [searchFiles, setSearchFiles] = useState({});
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems([]);
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
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          {text}
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
      {searchText ? (
        <>
          {searchFiles && Object.keys(searchFiles).length ? (
            <ScrollView style={styles.filesContainer}>
              {Object.entries(searchFiles).map(([code, obj]) => (
                <View style={styles.cardContainer} key={code}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardHeaderText}>{obj.name}</Text>
                  </View>
                  {obj.files.map((f) => (
                    <TouchableHighlight
                      underlayColor="#EEEEEE"
                      onPress={() => {}}
                      style={styles.card}
                      key={f.getDownloadURL()}
                    >
                      <View style={styles.subCard}>
                        <Icon
                          containerStyle={styles.cardIcon}
                          name="film"
                          type="feather"
                          color="black"
                          size={25}
                        />
                        <Text style={styles.cardText}>
                          {f.name}
                        </Text>
                      </View>
                    </TouchableHighlight>
                  ))}
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text>
              No matching files found.
            </Text>
          )}
        </>
      ) : (
        <>
          {items.length > 0 ? (
            items.map((i) => (
              <View style={styles.cardContainer} key={i.code}>
                {i.files.length > 0 && i.files.map((f) => (
                  <TouchableHighlight
                    underlayColor="#EEEEEE"
                    onPress={() => {}}
                    style={styles.card}
                    key={f.getDownloadURL()}
                  >
                    <View style={styles.subCard}>
                      <Icon
                        containerStyle={styles.cardIcon}
                        name="film"
                        type="feather"
                        color="black"
                        size={25}
                      />
                      <Text style={styles.cardText}>
                        {f.name}
                      </Text>
                    </View>
                  </TouchableHighlight>
                ))}
              </View>
            ))) : (
              <Text>
                {`No ${text.toLowerCase()} yet! When your teacher uploads ${text.toLowerCase()}, they will show up here.`}
              </Text>
          )}
        </>
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
