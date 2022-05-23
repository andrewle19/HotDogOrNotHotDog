const API_KEY = 'key';
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

export async function isHotDog(image) {
    let isHotDog = false;
    const result = await callGoogleVisionAsync(image);
    result.responses[0].localizedObjectAnnotations.forEach(object => { if (object.name === "Hot dog") isHotDog = true });
    
    return isHotDog;
}

export async function callGoogleVisionAsync(image) {
    console.log("Calling google vision api with image:", image);
  
    const body = {
      requests: [
        {
          image:{
            source:{
              imageUri:
                image
              }
          },
          features: [
            {
              type: 'OBJECT_LOCALIZATION',
              maxResults: 5,
            },
          ],
        },
      ],
    };
  
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  
    const result = await response.json();
    console.log('callGoogleVisionAsync -> result', result);
  
    return result;
  }