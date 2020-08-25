import { StyleSheet } from 'react-native';

const colors = {
  WHITE: '#FFF',
  BLACK: '#000',
  PRIMARY: '#5FB0FF',
  GREY: '#B4B4B4',
};

const styles = StyleSheet.create({
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

export {
  styles, colors,
};
