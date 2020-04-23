import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, AsyncStorage } from 'react-native';
//NetInfo was separated from react-native
import NetInfo from "@react-native-community/netinfo";
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

//import firebase/firestore
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
    this.state = {
      messages: [],
      isConnected: false,
    }
  }

  //puts user's name in nav bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  };

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      var data = doc.data();
      messages.push({
        _id: data._id,
        createdAt: data.createdAt.toDate(),
        text: data.text,
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
        image: data.image,
        location: data.location,
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
      user: {
        _id: this.state.uid,
        name: this.props.navigation.state.params.name,
        avatar: 'https://placeimg.com/140/140/any'
      },
      image: this.state.messages[0].image,
      location: this.state.messages[0].location,
    });
  };

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      () => {
        this.addMessage();
        this.saveMessages();
      })
  };

  //async functions for getting messages even when offline
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  }


  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected == true) {
        console.log('online');
        this.setState({
          isConnected: true,
        });
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
      } else {
        console.log('offline');
        this.setState({
          isConnected: false,
        });
        this.getMessages();
      }
    });  
  }

  componentWillUnmount() {
    this.authUnsubscribe();
  }

  //No input bar when offline
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar {...props}/>
      );
    }
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  renderCustomView (props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <View style={[styles.container, {backgroundColor: this.props.navigation.state.params.roomColor}]}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
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