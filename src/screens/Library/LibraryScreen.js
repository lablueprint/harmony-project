/* eslint-disable react/no-children-prop */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useEffect, useRef, useContext,
} from 'react';
import {
  StyleSheet, View, Alert, TouchableHighlight, Text, ScrollView, Animated,
  useWindowDimensions,
} from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import storage from '@react-native-firebase/storage';
// import Auth from '@react-native-firebase/auth';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import ClassroomContext from '../../context/ClassroomContext';
import { fileTypes } from '../../components';
import toPreview from './LibraryFunctions';

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
  fileModal: {
    width: 300,
    height: 300,
  },
});

export default function LibraryScreen({ navigation }) {
  const [initializing, setInitializing] = useState(true);

  // const { uid } = Auth().currentUser;
  const [classFiles, setFiles] = useState([]);
  const [searchText, setSearch] = useState('');
  const [searchFiles, setSearchFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState(false);
  const [animatedHeight, setHeight] = useState('auto');
  const [searchRef, setRef] = useState();
  // const [filePath, setPath] = useState('');

  const {
    classroom: selectedClassroom,
  } = useContext(ClassroomContext);

  const window = useWindowDimensions();
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setFiles([]);
    setSearch('');
    if (searchRef) {
      searchRef.clear();
      searchRef.blur();
    }
    Firestore().collection('classrooms').doc(selectedClassroom).get()
      .then((doc) => {
        const fileRef = storage().ref(`classrooms/${doc.id}/files`);
        const photoRef = storage().ref(`classrooms/${doc.id}/photos`);
        const videoRef = storage().ref(`classrooms/${doc.id}/videos`);
        const newClassFiles = {
          code: doc.id,
          name: doc.data().name,
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
        setFiles(newClassFiles);

        setInitializing(false);
      })
      .catch((e) => {
        Alert.alert(e.message);
      });
  }, [selectedClassroom]);

  // search function
  useEffect(() => {
    setLoading(true);
    if (searchText) {
      // eslint-disable-next-line max-len
      const videos = classFiles.videos.filter((f) => f.name.toLowerCase().includes(searchText.toLowerCase()));
      // eslint-disable-next-line max-len
      const photos = classFiles.photos.filter((f) => f.name.toLowerCase().includes(searchText.toLowerCase()));
      // eslint-disable-next-line max-len
      const files = classFiles.files.filter((f) => f.name.toLowerCase().includes(searchText.toLowerCase()));
      if (videos.length || photos.length || files.length) {
        setSearchFiles({
          videos,
          photos,
          files,
        });
      } else {
        setSearchFiles(null);
      }
    } else {
      setSearchFiles(null);
    }
    setLoading(false);
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
          ref={(search) => setRef(search)}
        />
      </View>
      {!loading && searchText.length > 0 && (
        <>
          {searchFiles ? (
            <ScrollView style={styles.cardContainer}>
              {/* opening file preview: https://www.npmjs.com/package/react-native-file-viewer */}
              {searchFiles.videos.map((f) => (
                // IN THE FUTURE: Have files be placed into some
                // collection in Firestore as well, so we can
                // have unique IDs or something...
                // And also to give files actual names instead of
                // their file name...?
                <TouchableHighlight
                  underlayColor="#EEEEEE"
                  onPress={() => {
                    toPreview(navigation, fileTypes.video, f);
                  }}
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
              {searchFiles.photos.map((f) => (
                <TouchableHighlight
                  underlayColor="#EEEEEE"
                  onPress={() => {
                    // f.getDownloadURL().then((url) => {
                    //   viewFile(url, f.name);
                    // });
                    toPreview(navigation, fileTypes.photo, f);
                  }}
                  style={styles.card}
                  key={f.getDownloadURL()}
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
              {searchFiles.files.map((f) => (
                <TouchableHighlight
                  underlayColor="#EEEEEE"
                  onPress={() => {
                    toPreview(navigation, fileTypes.file, f);
                  }}
                  style={styles.card}
                  key={f.getDownloadURL()}
                >
                  <View style={styles.subCard}>
                    <Icon
                      containerStyle={styles.cardIcon}
                      name="file"
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
          onPress={() => toFiles(fileTypes.video)}
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
          onPress={() => toFiles(fileTypes.photo)}
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
          onPress={() => toFiles(fileTypes.file)}
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
