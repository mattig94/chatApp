import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground } from 'react-native';

//first screen to render when app opens
export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      name: '',
      roomColor: '' 
    };
  }

  //TextInput sets user name
  //TouchableOpacity sets background color for chat

  render() {
    return (
      <ImageBackground source={require('../assets/background.png')} style={styles.homeBackground}>
        <View style={styles.container}>
          <Text style={styles.title}>ChatApp</Text>
          <View style={styles.homeContainer}>
            <TextInput
            style={[styles.basicText, styles.textInput]}
            onChangeText={(name) => this.setState({name})}
            value={this.state.name}
            placeholder='Your Name'
            />
            
            <View>
            <Text style={[styles.basicText, {paddingBottom: 10}]}>Choose Background Color:</Text>
              <View style={styles.colorChoice}>
                <TouchableOpacity
                style={[styles.roundButton, {backgroundColor: '#090C08'}]}
                onPress={() => this.setState({roomColor: '#090C08'})}
                />
                <TouchableOpacity
                style={[styles.roundButton, {backgroundColor: '#474056'}]}
                onPress={() => this.setState({roomColor: '#474056'})}
                />
                <TouchableOpacity
                style={[styles.roundButton, {backgroundColor: '#8A95A5'}]}
                onPress={() => this.setState({roomColor: '#8A95A5'})}
                />
                <TouchableOpacity
                style={[styles.roundButton, {backgroundColor: '#B9C6AE'}]}
                onPress={() => this.setState({roomColor: '#B9C6AE'})}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => this.props.navigation.navigate('Chat', {name: this.state.name, roomColor: this.state.roomColor})}
            >
              <Text style={[styles.basicText, styles.buttonText]}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

/**
 * styles
 * @constant
 * @type {object}
 */
const styles = StyleSheet.create({ 
  basicText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
  },
  title: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#FFFFFF',
  }, 
  textInput: {
    opacity: 50,
    height: 40, 
    width: '88%',
    borderColor: 'gray', 
    borderWidth: 1,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  homeBackground: {
    width: '100%', 
    height: '100%'
  },
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  homeContainer:{
    backgroundColor: '#FFFFFF',
    height: '44%',
    width: '88%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  colorChoice: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '88%',
  },
  roundButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  chatButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#757083',
    height: 40,
    width: '88%',
  },
})