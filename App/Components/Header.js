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

const VariationOptions = [ { value: 'percent_change_24h', label: '24H' }, { value: 'percent_change_7d', label: '7D' }]
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
        <Text style={[styles.flex0p3, styles.text]}>
          {"#"}
        </Text>
        <Text style={[styles.flex2, styles.text]}>
          {"Name"}
        </Text>
        <Picker
          style={styles.picker}
          selectedValue={this.props.selectedValue}
          onValueChange={(item) => this.props.onValueChange(item)}>
          { Object.keys(currencies).map(currency => <Picker.Item
            key={currency}
            style={styles.text}
            label={currency} value={currency}/>) }
        </Picker>
        <Picker
          style={styles.picker}
          selectedValue={this.props.selectedValueVariation}
          onValueChange={(item) => this.props.onValueChangeVariation(item)}>
          { VariationOptions.map(opt => <Picker.Item
            key={opt.value}
            style={styles.text}
            label={opt.label} value={opt.value}/>) }
        </Picker>
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
  picker: Object.assign({}, {flex: 1.2}, {color: Colors.headerText, padding: 10}),
  flex0p3: {flex: 0.3},
  flex2: {flex: 2},
  flex0p5: {flex: 0.5},
})