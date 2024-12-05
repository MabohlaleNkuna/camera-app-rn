import React, { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, FlatList, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import PhotoPreview from '@/components/PhotoPreview';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);  
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  async function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: true,
        exif: true, 
      };
      const takenPhoto = await cameraRef.current.takePictureAsync(options);

      if (takenPhoto) { 
        setPhoto(takenPhoto);

        // Save photo to the device's file system
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
          // Get current location
          const location = await Location.getCurrentPositionAsync({});

          // Create an album called 'CapturedPhotos' if it doesn't exist
          let album = await MediaLibrary.getAlbumAsync('CapturedPhotos');
          if (!album) {
            album = await MediaLibrary.createAlbumAsync('CapturedPhotos', takenPhoto.uri, false);
          }

          // Save photo to MediaLibrary
          const asset = await MediaLibrary.createAssetAsync(takenPhoto.uri);
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);

          // Save metadata (timestamp, location)
          const timestamp = new Date().toISOString();
          const photoMetadata = {
            timestamp,
            location: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          };
          console.log(photoMetadata); 

          // Update state to show all photos
          const updatedPhotos = await MediaLibrary.getAssetsAsync({
            album: album.id,
            first: 50,
            mediaType: 'photo',
          });
          setPhotos(updatedPhotos.assets); 
        }
      } else {
        console.error("Photo capture failed, no photo returned.");
      }
    }
  };

  const handleRetakePhoto = () => setPhoto(null);

  if (photo) return <PhotoPreview photo={photo} handleRetakePhoto={handleRetakePhoto} />;

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <AntDesign name='retweet' size={44} color='black' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <AntDesign name='camera' size={44} color='black' />
          </TouchableOpacity>
        </View>
      </CameraView>

      {/* Display captured images */}
      <FlatList
        data={photos}
        renderItem={({ item }) => (
          <View style={styles.photoItem}>
            <Image style={styles.photo} source={{ uri: item.uri }} />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: 'gray',
    borderRadius: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  photoItem: {
    marginBottom: 10,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});
