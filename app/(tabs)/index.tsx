import { StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Text, View } from '@/components/Themed';
import { Image } from 'react-native';

export default function TabOneScreen() {
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);

  useEffect(() => {
    async function getAlbumAssets() {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const album = await MediaLibrary.getAlbumAsync("galleryApp");
        const albumAssets = await MediaLibrary.getAssetsAsync({ album });
        setAssets(albumAssets.assets);
      }
    }
    getAlbumAssets();
  }, []);

  return (
    <View style={styles.container}>
      {assets && assets.map((asset, i) => (
        <Image key={i} source={{ uri: asset.uri }} style={styles.image} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    width: 100, 
    height: 100, 
    margin: 5,
  },
  galleryApp: {
    flex: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
