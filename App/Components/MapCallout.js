import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import MapView from 'react-native-maps'
import Styles from './Styles/MapCalloutStyle'

export default const MapCallout = () => (
  <MapView.Callout style={Styles.callout}>
    <TouchableOpacity onPress={() => {}}>
      <Text>{}</Text>
    </TouchableOpacity>
  </MapView.Callout>
);
