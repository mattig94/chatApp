import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';

//use to fix base64 error
import {decode, encode} from 'base-64'
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

//import firestore
const firebase = require('firebase');
require('firebase/firestore');

//main chat view
export default class Chat extends Component {
  constructor() {
    super()
    //connect to firestore
    if (!firebase.apps.length){
      firebase.initializeApp({
        apiKey: "AIzaSyCm7rBTAfptfThXjWQhkp_H2B4yJ94Csbk",
        authDomain: "chat-app-9ef43.firebaseapp.com",
        databaseURL: "https://chat-app-9ef43.firebaseio.com",
        projectId: "chat-app-9ef43",
        storageBucket: "chat-app-9ef43.appspot.com",
        messagingSenderId: "430643467945",
        appId: "1:430643467945:web:647c27b024b1ed29e13bb8",
        measurementId: "G-E4XCFDT292"
      });
    }
    //refernce collection
    this.referenceMessages = firebase.firestore().collection('messages');
    //get and store messages for chat
    state = {
      messages: [],
    }
  }

  //puts user's name in nav bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  };

  componentDidMount() {
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        loggedInText: 'Hello there',
      });
      this.unsubscribe = this.referenceMessages.onSnapshot(this.onCollectionUpdate);
    });
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello Developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: this.props.navigation.state.params.name + ' entered the chat',
          createdAt: new Date(),
          system: true,
        }
      ],
    })
  }

  componentWillUnmount() {
    this.authUnsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      var data = doc.data();
      messages.push({
        _id: data._id,
        createdAt: data.createdAt,
        text: data.text,
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
      });
    });
    this.setState({
      messages,
    });
  };

  addMessage() {
    this.referenceMessages.add({
      _id: this.state.messages[0]._id,
      text: this.state.messages[0].text,
      createdAt: this.state.messages[0].createdAt,
      user: this.state.messages[0].user,
      uid: this.state.uid,
    });
  };

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      () => {
        this.addMessage();
      })
  }

  render() {
    return (
      <View style={[styles.container, {backgroundColor: this.props.navigation.state.params.color}]}>
        <Text style={{color: '#FFFFFF'}}>Chat</Text>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {Platform.OS === 'android' ? <KeyboardSpacer/> : null }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: '#FFF',
  },
});