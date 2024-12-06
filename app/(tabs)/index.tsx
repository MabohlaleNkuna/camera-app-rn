import { StyleSheet } from 'react-native';
import {useState,useEffect} from 'react';
import * as MediaLibrary from 'expo-media-library';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View} from '@/components/Themed';
import { Image } from 'react-native';


export default function TabOneScreen() {
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);

  useEffect(() => {
    async function getAlbumAssets() {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
      const album= await MediaLibrary.getAlbumAsync("galleryApp");
      const albumAssets = await MediaLibrary.getAssetsAsync({ album });
      setAssets(albumAssets.assets);
      }
    }
    getAlbumAssets();
  }, []);
  return (
    <View style={styles.container}>
            {assets && assets.map((asset,i) => (
          <Image key={i} source={{ uri: asset.uri }} width={50} height={50} />
        ))}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
