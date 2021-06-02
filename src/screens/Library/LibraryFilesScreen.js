/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet, ScrollView, View, Alert, TouchableHighlight, Text,
} from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import toPreview from './LibraryFunctions';
import ClassroomContext from '../../context/ClassroomContext';

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
  const {
    fileType, classFiles, classroom,
  } = route.params; // fileType = 'Video', 'Photo', or 'File'
  const [searchText, setSearch] = useState('');
  const [searchFiles, setSearchFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const items = {
    code: classFiles.code,
    name: classFiles.name,
    files: classFiles[`${fileType.toLowerCase()}s`],
  };

  const {
    classroom: selectedClassroom,
  } = useContext(ClassroomContext);

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

  useEffect(() => {
    if (selectedClassroom !== classroom) {
      navigation.navigate('Library');
    }
  }, [selectedClassroom]);

  if (!fileType) {
    Alert.alert('Error: No file type specified to display!');
    return navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          {`${items.name}'s ${fileType}s`}
        </Text>
      </View>
      <View style={styles.searchContainer}>
        <SearchBar
          lightTheme
          inputContainerStyle={styles.searchBarInputContainer}
          inputStyle={styles.searchBarInput}
          containerStyle={styles.searchBar}
          searchIcon={{ size: 27 }}
          placeholder={`Search ${fileType}s`}
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
                  onPress={() => {
                    // f.getDownloadURL().then((url) => {
                    //   viewFile(url, f.name);
                    // });
                    toPreview(navigation, fileType, f, selectedClassroom);
                  }}
                  style={styles.card}
                  key={f.name}
                >
                  <View style={styles.subCard}>
                    <Icon
                      containerStyle={styles.cardIcon}
                      name="image"
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
              onPress={() => {
                // f.getDownloadURL().then((url) => {
                //   viewFile(url, f.name);
                // });
                toPreview(navigation, fileType, f, selectedClassroom);
              }}
              style={styles.card}
              key={f.name}
            >
              <View style={styles.subCard}>
                <Icon
                  containerStyle={styles.cardIcon}
                  name="image"
                  type="feather"
                  color="black"
                  size={25}
                />
                <Text style={styles.cardText}>
                  {f.name}
                </Text>
              </View>
            </TouchableHighlight>
          )) : (
            <Text style={{ paddingHorizontal: 20, paddingTop: 20 }}>
              {`No ${fileType.toLowerCase()} yet! When your teacher uploads ${fileType.toLowerCase()}, they will show up here.`}
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
