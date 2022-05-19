import { useState } from "react";
import { Text, View, Button, Image, TouchableOpacity, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as googleVisionProxy from './proxies/googleVisionProxy';
import * as firestorageProxy from './proxies/firestorageProxy';
import { Camera, CameraType } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';
import MainMenu from './components/menu';
import styles from './styles';

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [status, setStatus] = useState(null);
  const [camera, setCamera] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [type, setType] = useState(CameraType.back);
  const [cameraReady, setCameraReady] = useState(false);
  const [isLoading, setLoading] = useState(false);

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
      return alert("Already analyzed");
    }

    try {
      setLoading(true);
      const result = await firestorageProxy.uploadImageAsync(selectedImage).then(image => {
        return googleVisionProxy.isHotDog(image);
      })

      if (result === true) {
        setStatus("🌭 Hot Dog 🌭");
      } else {
        setStatus("❌ Not Hot Dog ❌");
      }
    } catch (error) {
      console.log(error);
      alert("Was not able to analyze please try again later");
    }

    setLoading(false);
  }

  const takePicture = async () => {
    if (camera) {
      console.log("Taking picture");
      const image = await camera.takePictureAsync(null);
      console.log(image);
      
      setSelectedImage(image.uri);
      setCameraOn(false);
      setStatus(null);
    }
  };

  if (isLoading === true) {
    return (<Spinner
      visible={isLoading}
      textContent={'Analyzing...'}
      textStyle={styles.spinnerTextStyle}/>)
  }

  if (selectedImage !== null && cameraOn !== true) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: selectedImage }} style={styles.thumbnail}/>
        <Button title="Analyze" onPress={analyzeImage}/>
        <Text style={styles.title}> {status} </Text>
        
        <MainMenu turnCameraOn={() => { setCameraOn(cameraOn === false ? true : false)}} selectImageHandler={selectImageHandler}></MainMenu>
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
      <MainMenu turnCameraOn={() => { setCameraOn(cameraOn === false ? true : false)}} selectImageHandler={selectImageHandler}></MainMenu>
    );
  }
}
