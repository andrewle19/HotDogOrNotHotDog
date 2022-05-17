import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../firebase-config';

export async function uploadImageAsync(uri) {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    const fileRef = ref(storage, uuidv4());
  
    await uploadBytes(fileRef, blob);
  
    blob.close();
  
    return await getDownloadURL(fileRef);
};