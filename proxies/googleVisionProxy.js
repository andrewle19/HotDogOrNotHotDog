const API_KEY = 'AIzaSyBVe7boImQpNy4H-aAgypiTiVoOQqCG5Ng';
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

export async function isHotDog(image) {
    let isHotDog = false;
    const result = await callGoogleVisionAsync(image);
    result.responses[0].localizedObjectAnnotations.forEach(object => { if (object.name === "Hot dog") isHotDog = true });
    
    return isHotDog;
}

export async function callGoogleVisionAsync(image) {
    console.log("IMAGE provided", image)
  
    const body = {
      requests: [
        {
          image:{
            source:{
              imageUri:
                "https://cf-store.widencdn.net/mccormick/5/1/c/51c3951e-750a-4506-9c06-69d61f7359dc.jpg?response-content-disposition=inline%3B%20filename%3D%22classic_grilled_hot_dog_800x800.jpg%22&Expires=1652683362&Signature=lWi0UsKUxprmZzfWM62rAh8aXALY6-xi3nV5lPL9wWA5tRlOlKw0G9LPlvH0yjs~9XgNBDnHNFbAiBnIc-caQsi5CWO2VdWnDYhpcnCVKxK5KYXYP8PxiZDYha8vWGTX04jmBWq5GYSEgrmEHZUFKEJno4HVxKVbo3Vp2AfXz3vj44u12C5klT4eOxfVY-DpOhqVJysQHEW99A4GC4VlcDWwusb8yE1xtbQF9xwyh-UAHk81hAr8HVJ0F1-VQv8PdRwsMQx5FeWL7KpjsxSUiMhDxqPDCpcEX0suetRi2-fD5gyadg80KQfxSD52ZTNVCcWOR5SNSw-7AeTzsw7L6g__&Key-Pair-Id=APKAJD5XONOBVWWOA65A"
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