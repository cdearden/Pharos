import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Metrics } from '../Themes';
import Styles from './Styles/MapViewComponentsStyle';
import RadialMenu from '../Containers/RadialMenu';
import CalloutContainer from '../Containers/CalloutContainer';
import EventCategories from '../Lib/EventCategories';



export default class MapViewComponents extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const retrieveMapMarkers = this.props.retrieveMapMarkers.bind(this);
    this.props.getCurrentPosition((coord) => {
      const region = {
        latitude: coord.latitude,
        longitude: coord.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      this.props.updateRegion(region);
      retrieveMapMarkers(this.props.token, coord);
    });
    const watchID = this.props.watchPosition();
    this.props.saveWatchID(watchID);
  }

  onRegionChange(region) {
    this.props.updateRegion(region);
    this.props.retrieveMapMarkers(this.props.token, this.props.currentLocation);
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.props.watchID);
  }

  render() {
    return (
      <View style={Styles.container}>
        <MapView
          style={Styles.map}
          region={this.props.region}
          initialRegion={this.props.region}
          onRegionChange={region => this.onRegionChange(region)}
          // showsUserLocation={this.props.showUserLocation} //TODO: need to add this function
        >
          <MapView.Marker
            coordinate={{
              latitude: this.props.region.latitude,
              longitude: this.props.region.longitude,
            }}
          >
            <Icon
              name="map-pin"
              size={Metrics.icons.small}
              color={'blue'}
            />
          </MapView.Marker>

          {this.props.events
            .map(event => ({
              event,
              Icon: EventCategories[event.category].icon,
            }))
            .map((EventObj, index) =>
              <MapView.Marker
                key={index}
                coordinate={{
                  latitude: EventObj.event.latitude,
                  longitude: EventObj.event.longitude,
                }}
                event={EventObj.event}
              >
                <View color="#4F8EF7" >
                  <EventObj.Icon size={Metrics.icons.small} />
                </View>
                <MapView.Callout style={Styles.myCallout} >
                  <CalloutContainer
                    notification={EventObj.event}
                    socket={this.props.socket}
                  />
                </MapView.Callout>
              </MapView.Marker>,
            )
          }
        </MapView>
        <RadialMenu socket={this.props.socket} />
      </View>
    );
  }
}

MapViewComponents.propTypes = {
  region: PropTypes.object,
  updateRegion: PropTypes.func,
};
