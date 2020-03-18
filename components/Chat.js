import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

//main chat view
export default class Chat extends Component {
  //put users name in nav bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  };

  render() {
    return (
      <View style={[styles.container, {backgroundColor: this.props.navigation.state.params.color}]}>
        <Text style={{color: '#FFFFFF'}}>Chat</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});