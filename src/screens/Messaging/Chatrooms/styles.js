import { StyleSheet } from 'react-native';

const colors = {
  WHITE: '#FFF',
  BLACK: '#000',
  PRIMARY: '#5FB0FF',
  GREY: '#B4B4B4',
};

//TODO: CLEAN UP STYLES
const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    width: '100%',
    paddingVertical: 3,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textContainer: {
    width: 160,
    backgroundColor: colors.GREY,
    borderRadius: 40,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginLeft: 10,
  },
  rightContainer: {
    justifyContent: 'flex-end',
  },
  rightTextContainer: {
    backgroundColor: colors.PRIMARY,
    marginRight: 10,
  },
  leftText: {
    textAlign: 'left',
  },
  rightText: {
    textAlign: 'right',
  },
  text: {
    fontSize: 12,
  },
  rootContainer: {
    flex: 1,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 30,
    right: 0,
    zIndex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  buttonLabel: {
    fontSize: 22,
  },
});

const flattenedStyles = {
  container: StyleSheet.flatten([styles.container, styles.rightContainer]),
  textContainer: StyleSheet.flatten([styles.textContainer, styles.rightTextContainer]),
  leftText: StyleSheet.flatten([styles.leftText, styles.text]),
  rightText: StyleSheet.flatten([styles.rightText, styles.text]),
};

export {
  styles,
  flattenedStyles,
};
