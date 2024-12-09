import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// Define types for the location object
type LocationType = {
  latitude: number;
  longitude: number;
};

const MapComponent = () => {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); 

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords); 
    })();
  }, []);

  const handleLocationPress = () => {
    if (location) {
      // Open full map (use the location for navigation)
      console.log("Navigating to full map with coordinates:", location);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {location ? (
        <MapView
          style={{ flex: 1 }}
          provider="google"
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Current Location"
            description="You are here"
          />
        </MapView>
      ) : (
        <Text>{errorMsg || 'Loading location...'}</Text>
      )}

      <TouchableOpacity onPress={handleLocationPress}>
        <Text>Go to Full Map</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MapComponent;
