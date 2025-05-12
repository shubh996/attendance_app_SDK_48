

import React, { useState } from 'react';
import { View, Image, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import * as ImageManipulator from 'expo-image-manipulator';


const CLOUDINARY_UPLOAD_PRESET = 'ftyyo36e';
const CLOUDINARY_CLOUD_NAME = 'dywzucf4d';

const ImageUploader = () => {
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.1,
    });

    if (!result.canceled && result?.assets[0]?.uri) {

      console.log(result)

      compressImage(result?.assets[0]?.uri);
    }

  };



  const compressImage = async (uri) => {

    console.log("REC==>", uri)

    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Set the desired width for compression
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Adjust the compress value as needed
      );

      setImageUri(manipResult.uri);
    } catch (error) {
      console.log('Error compressing image:', error);
    }

  };


  const uploadImage = async () => {
    if (imageUri) {
      const formData = new FormData();
      formData.append('file', { uri: imageUri, type: 'image/jpeg', name: 'image.jpg' });
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (response.ok) {
          const resultData = await response.json();
          console.log(resultData.secure_url);
        } else {
          console.error('Image upload failed:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <View style={{marginTop:50}}>
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
      <Button title="Pick an image" onPress={pickImage} />
      <Button title="Upload to Cloudinary" onPress={uploadImage} />
    </View>
  );
};

export default ImageUploader;
