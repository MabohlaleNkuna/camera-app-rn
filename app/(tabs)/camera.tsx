import React, { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, FlatList, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';

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
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  async function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = { quality: 1, base64: true };
      const takenPhoto = await cameraRef.current.takePictureAsync(options);

      if (takenPhoto) {
        setPhoto(takenPhoto);

        // Save photo to default camera album
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
          const asset = await MediaLibrary.createAssetAsync(takenPhoto.uri);
          const album= await MediaLibrary.getAlbumAsync("galleryApp");
          console.log (album);
          if (!album) {
            console.log("album null")
            const album= await MediaLibrary.createAlbumAsync("galleryApp",asset);
            await MediaLibrary.deleteAssetsAsync(asset);
          }else{
            console.log("album not null")
            await MediaLibrary.addAssetsToAlbumAsync(asset,album);
            await MediaLibrary.deleteAssetsAsync(asset);
          }
          

          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
          }
          const location = await Location.getCurrentPositionAsync({});
          console.log('Photo saved at:', asset.uri);

          // Save metadata for debugging
          const metadata = {
            timestamp: new Date().toISOString(),
            location: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          };
          console.log('Photo metadata:', metadata);

          // Add to state for UI
          setPhotos((prevPhotos) => [...prevPhotos, { id: asset.id, uri: asset.uri }]);
        } else {
          console.error('MediaLibrary permissions not granted');
        }
      } else {
        console.error('Photo capture failed');
      }
    }
  };

  const handleRetakePhoto = () => setPhoto(null);

  if (photo) {
    return (
      <View style={styles.previewContainer}>
        <Image style={styles.previewImage} source={{ uri: photo.uri }} />
        <Button title="Retake Photo" onPress={handleRetakePhoto} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <AntDesign name="retweet" size={44} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <AntDesign name="camera" size={44} color="white" />
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
  },
  photoItem: {
    marginBottom: 10,
  },
  photo: {
    width: 100,
    height: 100,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '80%',
  },
});
