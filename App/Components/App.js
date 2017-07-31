import React, {Component} from 'react'
import {
  View,
  StatusBar
} from 'react-native'
import {Colors} from '../Themes'
import List from './List'


export default class App extends Component {
  render() {
    return (
      <View>
        <StatusBar
          backgroundColor={Colors.darkMain}
          barStyle="light-content"
        />
        <List/>
      </View>
    );
  }
}