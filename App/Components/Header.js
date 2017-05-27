import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {Colors, Fonts} from '../Themes/'

export default class Header extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={Colors.darkMain}
          barStyle="light-content"
        />
        <Text style={styles.text}>
          {this.props.text}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.headerBackground,
  },
  text: Object.assign({color: Colors.headerText}, Fonts.style.h6),
})