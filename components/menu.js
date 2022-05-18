import { View, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { styles } from '../styles';

const mainMenu = props => (
    <View style={styles.container}>
        <View style={styles.bottomButtonsContainer}>
            <Button title='Take Picture' onPress={props.turnCameraOn} />
            <Button title="Pick an Image" onPress={props.selectImageHandler}></Button>
        </View>
        <StatusBar style="auto" />
    </View>
)

export default mainMenu;