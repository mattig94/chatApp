import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

//import views for navigation 
import Start from './components/Start';
import Chat from './components/Chat';

//Event listener fix
window.addEventListener = x => x

//fix for React Native - Firestore: Possible Unhandled Promise Rejection Can't find variable atob error
import {decode, encode} from 'base-64';

if (!global.btoa) {  global.btoa = encode }

if (!global.atob) { global.atob = decode } 

const navigator = createStackNavigator({
  Start: { screen: Start },
  Chat: { screen: Chat }
});

const navigatorContainer = createAppContainer(navigator);
export default navigatorContainer;
