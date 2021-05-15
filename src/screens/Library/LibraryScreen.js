/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useEffect, useRef, /* useContext, */
} from 'react';
import {
  StyleSheet, View, Alert, TouchableHighlight, Text, ScrollView, Animated, useWindowDimensions,
} from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import storage from '@react-native-firebase/storage';
import Auth from '@react-native-firebase/auth';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    backgroundColor: '#F6F6F6',
    height: '100%',
  },
  subContainer: {
    height: 50,
    width: '100%',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#BDBDBD',
    paddingLeft: 20,
    paddingVertical: 40,
  },
  subText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    paddingLeft: 40,
  },
  subCard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  subIcon: {
    position: 'absolute',
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
  const [animatedHeight, setHeight] = useState('auto');

  const window = useWindowDimensions();
  const slide = useRef(new Animated.Value(0)).current;

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
    setFiles([]);
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

  useEffect(() => {
    if (focus && !searchText) {
      setHeight(0);
      Animated.timing(slide, {
        toValue: window.height,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (!searchText) {
      Animated.timing(slide, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
      setHeight('auto');
    }
  }, [focus]);

  function toFiles(fileType) {
    return navigation.navigate('LibraryFiles', { fileType, classFiles });
  }

  if (initializing) return null;

  return (
    <View style={styles.container}>
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
          onClear={() => {
            if (!focus) setFocus(null);
          }}
        />
      </View>
      {!loading && (
        <>
          {searchFiles && Object.keys(searchFiles).length ? (
            <ScrollView style={styles.filesContainer}>
              {/* opening file preview: https://www.npmjs.com/package/react-native-file-viewer */}
              {Object.entries(searchFiles).map(([code, obj]) => (
                <View style={styles.cardContainer} key={code}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardHeaderText}>{obj.name}</Text>
                  </View>
                  {obj.videos.length > 0 && (
                  <>
                    {obj.videos.map((f) => (
                      // IN THE FUTURE: Have files be placed into some
                      // collection in Firestore as well, so we can
                      // have unique IDs or something...
                      // And also to give files actual names instead of
                      // their file name...?
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
                  </>
                  )}
                  {obj.photos.length > 0 && (
                  <>
                    {obj.photos.map((f) => (
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
                  </>
                  )}
                  {obj.files.length > 0 && (
                  <>
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
                  </>
                  )}
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text>No matching files found.</Text>
          )}
        </>
      )}

      <Animated.View style={{
        transform: [{ translateY: slide }],
        height: animatedHeight,
        backgroundColor: 'white',
      }}
      >
        <TouchableHighlight
          style={styles.subContainer}
          underlayColor="#EEEEEE"
          onPress={() => toFiles('Videos')}
        >
          <View style={styles.subCard}>
            <Icon
              containerStyle={styles.subIcon}
              name="film"
              type="feather"
              color="black"
              size={25}
            />
            <Text style={styles.subText}>Videos</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.subContainer}
          underlayColor="#EEEEEE"
          onPress={() => toFiles('Photos')}
        >
          <View style={styles.subCard}>
            <Icon
              containerStyle={styles.subIcon}
              name="image"
              type="feather"
              color="black"
              size={25}
            />
            <Text style={styles.subText}>Photos</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.subContainer}
          underlayColor="#EEEEEE"
          onPress={() => toFiles('Files')}
        >
          <View style={styles.subCard}>
            <Icon
              containerStyle={styles.subIcon}
              name="file"
              type="feather"
              color="black"
              size={25}
            />
            <Text style={styles.subText}>Files</Text>
          </View>
        </TouchableHighlight>
      </Animated.View>

    </View>
  );
}

LibraryScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    setOptions: PropTypes.func.isRequired,
  }).isRequired,
};
