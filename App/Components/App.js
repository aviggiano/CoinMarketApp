import React, {Component} from 'react'
import {StackNavigator} from 'react-navigation'
import List from './List'

const Navigator = StackNavigator({
  Home: {screen: List},
})

export default class App extends Component {
  render() {
    return (
      <Navigator onNavigationStateChange={null}/>
    );
  }
}