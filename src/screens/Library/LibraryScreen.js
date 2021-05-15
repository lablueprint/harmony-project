/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Alert, TouchableHighlight, Text,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import storage from '@react-native-firebase/storage';
import Auth from '@react-native-firebase/auth';
import Firestore from '@react-native-firebase/firestore';
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
// create list of file, image, whtv from each individual class of the user
// sort using orderBy firebase command
// upload file naming requires changing upload file to have an input line

// search bar --> state variable linked to useEffect that constantly updates to change the list
// when searching --> still do the same sorts i guess

// for libraryfilesscreen --> just check which file type is null, and then change view based on that

// search --> delineate search on this screen with text,
// other page only search thru the specified file type

export default function LibraryScreen({ navigation }) {
  const [initializing, setInitializing] = useState(true);

  // if can't pass classrooms, need to fetch user data and check signin
  // const [user, setUser] = useState(null);
  // const userState = navigation.getParam('userState', null);
  const { uid } = Auth().currentUser;
  const [classFiles, setFiles] = useState([]);
  const [searchText, setSearch] = useState('');
  const [searchFiles, setSearchFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [focus, setFocus] = useState(false);

  // if can't pass classrooms, need to fetch user data and check signin
  /*
  function onAuthStateChanged(authUser) {
    setUser(authUser);
  }

  // check signin on mount
  useEffect(() => {
    const subscriber = Auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []); */

  useEffect(() => {
    Firestore().collection('users')
      .doc(uid)
      .get()
      .then((document) => {
        if (document.exists) {
          return document.data();
        }
        return null;
      })
      .then((data) => {
        Firestore().collection('classrooms').orderBy('endDate', 'desc').get()
          .then((querySnapshot) => {
            const classrooms = [];
            querySnapshot.forEach((doc) => {
              if (data.role === 'TEACHER') {
                if (doc.id.length === 6) {
                  doc.data().teacherIDs.forEach((element) => {
                    if (element === uid) {
                      classrooms.push({ ...doc.data(), code: doc.id });
                    }
                  });
                }
              } else if (data.role === 'STUDENT') {
                if (doc.id.length === 6) {
                  doc.data().studentIDs.forEach((element) => {
                    if (element === uid) {
                      classrooms.push({ ...doc.data(), code: doc.id });
                    }
                  });
                }
              }
            });

            classrooms.forEach((c) => {
              const fileRef = storage().ref(`classrooms/${c.code}/files`);
              const photoRef = storage().ref(`classrooms/${c.code}/photos`);
              const videoRef = storage().ref(`classrooms/${c.code}/videos`);

              const newClassFiles = {
                code: c.code,
                name: c.name,
                videos: [],
                photos: [],
                files: [],
              };

              fileRef.list()
                .then((res) => {
                  newClassFiles.files = res.items;
                }).catch((e) => {
                  Alert.alert(e.message);
                });

              photoRef.list()
                .then((res) => {
                  newClassFiles.photos = res.items;
                }).catch((e) => {
                  Alert.alert(e.message);
                });

              videoRef.list()
                .then((res) => {
                  newClassFiles.videos = res.items;
                }).catch((e) => {
                  Alert.alert(e.message);
                });
              setFiles((f) => [...f, newClassFiles]);
            });

            setInitializing(false);
          })
          .catch((e) => {
            Alert.alert(e.message);
          });
      })
      .catch((e) => {
        Alert.alert(e.message);
      });
  }, []);

  // search function
  useEffect(() => {
    setLoading(true);
    if (searchText) {
      classFiles.forEach((c) => {
        // eslint-disable-next-line max-len
        const videos = c.videos.filter((f) => f.name.toLowerCase().includes(searchText.toLowerCase()));
        // eslint-disable-next-line max-len
        const photos = c.photos.filter((f) => f.name.toLowerCase().includes(searchText.toLowerCase()));
        // eslint-disable-next-line max-len
        const files = c.files.filter((f) => f.name.toLowerCase().includes(searchText.toLowerCase()));
        const filteredFiles = {
          name: c.name,
          videos,
          photos,
          files,
        };
        if (videos.length || photos.length || files.length) {
          setSearchFiles({
            ...searchFiles,
            [c.code]: filteredFiles,
          });
        } else {
          setSearchFiles((prev) => {
            const tempFiles = { ...prev };
            delete tempFiles[c.code];
            return tempFiles;
          });
        }
        setLoading(false);
      });
    } else {
      setSearchFiles({});
    }
  }, [searchText]);

  function toFiles(fileType) {
    return navigation.navigate('LibraryFiles', { fileType, classFiles });
  }

  if (initializing) return null;

  return (
    <View style={styles.container}>
      {/* add icons */}
      <View style={styles.searchContainer}>
        <SearchBar
          lightTheme
          inputContainerStyle={styles.searchBarInputContainer}
          inputStyle={styles.searchBarInput}
          containerStyle={styles.searchBar}
          searchIcon={{ size: 27 }}
          placeholder="Search All Files"
          onChangeText={setSearch}
          value={searchText}
          showLoading={loading}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
      </View>
      {focus ? (
        <>
          {!loading && (
          <>
            {searchFiles && Object.keys(searchFiles).length ? (
              <>
                {/* opening file preview: https://www.npmjs.com/package/react-native-file-viewer */}
                {Object.entries(searchFiles).map(([code, obj]) => (
                  <View class={styles.card} key={code}>
                    <Text>{obj.name}</Text>
                    {obj.videos.length > 0 && (
                    <View>
                      <Text>Videos</Text>
                      {obj.videos.map((f) => (
                        <Text key={f.name}>{f.name}</Text>
                      ))}
                    </View>
                    )}
                    {obj.photos.length > 0 && (
                    <View>
                      <Text>Photos</Text>
                      {obj.photos.map((f) => (
                        <Text key={f.name}>{f.name}</Text>
                      ))}
                    </View>
                    )}
                    {obj.files.length > 0 && (
                    <View>
                      <Text>Files</Text>
                      {obj.files.map((f) => (
                        <Text key={f.name}>{f.name}</Text>
                      ))}
                    </View>
                    )}
                  </View>
                ))}
              </>
            ) : (
              <Text>No matching files found.</Text>
            )}
          </>
          )}
        </>
      ) : (
        <>
          <TouchableHighlight
            style={styles.subContainer}
            onPress={() => toFiles('Videos')}
          >
            <Text>Videos</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.subContainer}
            onPress={() => toFiles('Photos')}
          >
            <Text>Photos</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.subContainer}
            onPress={() => toFiles('Files')}
          >
            <Text>Files</Text>
          </TouchableHighlight>
        </>
      )}
    </View>
  );
}

LibraryScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
