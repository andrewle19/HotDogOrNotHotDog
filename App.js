import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as googleVisionProxy from './proxies/googleVisionProxy';
import * as firestorageProxy from './proxies/firestorageProxy';
import { Camera, CameraType } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const CAPTURE_SIZE = Math.floor(WINDOW_HEIGHT * 0.08);

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [status, setStatus] = useState(null);
  const [camera, setCamera] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [type, setType] = useState(CameraType.back);
  const [cameraReady, setCameraReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectImageHandler = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    console.log(pickerResult);

    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage(pickerResult.uri);
    setStatus(null);
    setCameraOn(false);
  }

  const analyzeImage = async () => {
    if (status !== null) {
      alert("Already analyzed");
    }

    try {
      const result = await firestorageProxy.uploadImageAsync(selectedImage).then(image => {
        return googleVisionProxy.isHotDog(image);
      })

      if (result === true) {
        setStatus("Hot Dog!");
        setLoading(true);
      } else {
        setStatus("Not Hot Dog!");
        setLoading(true);
      }
    } catch (error) {
      console.log(error);
      alert("Was not able to analyze please try again later");
    }
  }

  const takePicture = async () => {
    if (camera) {
      console.log("Taking picture");
      const image = await camera.takePictureAsync(null);

      setSelectedImage(image.uri);
      setCameraOn(false);
      setStatus(null);
    }
  };

  if (selectedImage !== null && cameraOn !== true) {
    return (
      <View style={styles.container}>
         <Spinner
          visible={loading}
          textContent={'Analyzing...'}
          textStyle={styles.spinnerTextStyle}
        />
        <Image source={{ uri: selectedImage }} style={styles.thumbnail}/>
        <Button title="Analyze" color="blue" onPress={analyzeImage}/>
        <Text>{status}</Text>
        <Text> {loading} </Text>

        <View style={styles.bottomButtonsContainer}>
          <Button title='Take Picture' onPress={() => { setCameraOn(cameraOn === false ? true : false) } } />
          <Button title="Pick an Image" onPress={selectImageHandler}></Button>
        </View>
      </View>
    );
  } else if (cameraOn === true) {
    return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)} onCameraReady = {() => {setCameraReady(true)}}>
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity disabled={!cameraReady} onPress={() => {setType(type === CameraType.back ? CameraType.front : CameraType.back);}}>
            <MaterialIcons name='flip-camera-ios' size={28} color='white' />
          </TouchableOpacity>
          <TouchableOpacity disabled={!cameraReady} activeOpacity={0.7} onPress={takePicture} style={styles.capture}/>
          <TouchableOpacity disabled={!cameraReady} onPress={selectImageHandler}>
            <MaterialIcons name='photo-library' size={28} color='white' />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <Button title='Take Picture' onPress={() => { setCameraOn(cameraOn === false ? true : false) } } />
        <Button title="Pick an Image" onPress={selectImageHandler}></Button>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  }
});
