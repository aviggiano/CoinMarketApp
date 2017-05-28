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
        <Text style={[{flex: 0.3}, styles.text]}>
          {"#"}
        </Text>
        <Text style={[{flex: 2}, styles.text]}>
          {"Name"}
        </Text>
        <Picker
          style={[{flex: 1.2}, styles.text]}
          selectedValue={this.props.selectedValue}
          onValueChange={(item) => {
            this.props.onValueChange(item)
          }}>
          { currencies.map(currency => <Picker.Item
            style={styles.text}
            label={currency} value={currency}/>) }
        </Picker>
        <Text style={[{flex: 0.5}, styles.text]}>
          {"24h"}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.headerBackground,
  },
  text: Object.assign({}, {color: Colors.headerText, padding: 10}, Fonts.style.h6),
})