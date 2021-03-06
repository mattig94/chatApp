import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

//import firebase/firestore
const firebase = require('firebase');
require('firebase/firestore');

export default class CustomActions extends Component {

  /**
   * user can pick an image from their library
   * @async
   * @function pickImage
   * 
   */
  pickImage = async () => {
    try {  
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if(status === 'granted') {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch(error => console.log(error));
        if (!result.cancelled) {
          const imgURL = await this.uploadImage(result.uri);
          this.props.onSend({ image: imgURL })
        }
      }
    } catch(error) {
      console.log(error);
    }
  }

  /**
   * user can take a photo using device's camera application
   * @async
   * @function takePhoto
   */
  takePhoto = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
      if (status === 'granted') {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch(error => console.log(error));
        if (!result.cancelled) {
          const imgURL = await this.uploadImage(result.uri);
          this.props.onSend({ image: imgURL })
        }
      }
    } catch(error) {
      console.log(error);
    }
  }

  /**
   * user can send an image 
   * @async
   * @function uploadImage
   */
  uploadImage = async(uri) => {
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(xhr.response);
        };
        xhr.onerror = function(e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
      const ref = firebase.storage().ref().child('sentImage');
      const snapshot = await ref.put(blob);
      blob.close();
      const imgURL = await snapshot.ref.getDownloadURL();
      return imgURL;
    } catch(error) {
      console.log(error);
    }
  }

  /**
   * user can send geographic location
   * @async
   * @function getLocation
   */
  getLocation = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        let result = await Location.getCurrentPositionAsync({}).catch(error => console.log(error));
        const longitude = JSON.stringify(result.coords.longitude);
        const latitude = JSON.stringify(result.coords.latitude);
        if(result) {
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            }
          })
        }
      }
    } catch(error) {
      console.log(error);
    }
  }

  /**
   * action sheet opens when user taps +
   * @function onActionPress
   * @returns {actionSheet}
   */
  onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        try {
          switch (buttonIndex) {
            case 0: 
              console.log('User wants to pick an image');
              return this.pickImage();
            case 1:
              console.log('User wants to take a photo');
              return this.takePhoto();
            case 2:
              console.log('User wants to get their location');
              return this.getLocation();
            default:
          }
        } catch(error) {
          console.log(error);
        }
      },
    );
  };

  render() {
    return (
      <TouchableOpacity style={[styles.container]} onPress={this.onActionPress}>
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }

}

/**
 * styles
 * @constant
 * @type {object}
 */
const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2, 
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};