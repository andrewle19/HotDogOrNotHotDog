import { StyleSheet, Dimensions } from 'react-native';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const CAPTURE_SIZE = Math.floor(WINDOW_HEIGHT * 0.08);

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    thumbnail: {
      width: 400,
      height: 400,
      resizeMode: "contain"
    },
    camera: {
      flex: 1,
      width: '100%'
    },
    bottomButtonsContainer: {
      position: 'absolute',
      flexDirection: 'row',
      bottom: 28,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    capture: {
      backgroundColor: '#5A45FF',
      borderRadius: 5,
      height: CAPTURE_SIZE,
      width: CAPTURE_SIZE,
      borderRadius: Math.floor(CAPTURE_SIZE / 2),
      marginBottom: 28,
      marginHorizontal: 30
    },
    spinnerTextStyle: {
      color: '#FFF'
    },
    title: {
        fontSize: 35,
        fontWeight: "bold"
    }
});

export default styles;

