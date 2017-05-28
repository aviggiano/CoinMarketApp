import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Picker,
  StatusBar,
} from 'react-native';
import {Colors, Fonts} from '../Themes/'
import currencies from '../Data/currencies.json'

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

        <Picker
          style={styles.text}
          selectedValue={this.props.selectedValue}
          onValueChange={(item) => {
            this.props.onValueChange(item)
          }}>
          { currencies.map(currency => <Picker.Item label={currency} value={currency}/>) }
        </Picker>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 13,
    // flexDirection: 'row',
    // alignItems: 'center',
    backgroundColor: Colors.headerBackground,
  },
  text: Object.assign({color: Colors.headerText}, Fonts.style.h6),
})