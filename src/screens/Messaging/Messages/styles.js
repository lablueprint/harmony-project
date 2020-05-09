import { StyleSheet } from 'react-native';

const colors = {
  WHITE: '#FFF',
  BLACK: '#000',
  PRIMARY: '#5FB0FF',
  GREY: '#B4B4B4',
};

const styles = StyleSheet.create({
  messagesContainer: {
    height: '100%',
    paddingBottom: 110,
  },
  inputContainer: {
    width: '100%',
    height: 100,
    position: 'absolute',
    bottom: 0,
    paddingVertical: 10,
    paddingLeft: 10,
    borderTopWidth: 1,
    borderTopColor: colors.GREY,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: colors.GREY,
    borderWidth: 1,
    borderRadius: 3,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
});

export {
  colors,
  styles,
};
