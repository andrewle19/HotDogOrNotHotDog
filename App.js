import { StatusBar } from 'expo-status-bar';
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as googleVisionProxy from './proxies/googleVisionProxy';
import * as firestorageProxy from './proxies/firestorageProxy';
import { db } from './firebase-config';

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [status, setStatus] = useState(null);

  let selectImageHandler = async () => {
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
  }


  let analyzeImage = async () => {
    try {
      const result = await firestorageProxy.uploadImageAsync(selectedImage).then(image => {
        return googleVisionProxy.isHotDog(image);
      })

      if (result === true) {
        setStatus("Hot Dog!");
      } else {
        setStatus("Not Hot Dog!");
      }
    } catch (error) {
      alert("Was not able to analyze please try again later");
    }
  }

  const [dogs, setDogs] = useState([]);
  const dogsTable = collection(db, "dogs");
  
  // useEffect(()=> {
  //   const getDogs = async () => {
  //       const data = await getDocs(dogsTable);
  //       setDogs(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
  //       console.log(setDogs);
  //   }
  //   getDogs();
  // }, [])


  if (selectedImage !== null) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: selectedImage }} style={styles.thumbnail}/>
        <Button title="Pick an Image" onPress={selectImageHandler}></Button>
        <Button title="Analyze" color="blue" onPress={analyzeImage}/>
        <Text>{status}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {/* <Text>Dog List</Text>
        {dogs.map((dog) => { return <Text key={dog.id}>Name: {dog.name} Type: {dog.type}</Text>} )} */}
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
  }
});
