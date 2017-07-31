import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Picker,
} from 'react-native';
import {Colors, Fonts, Metrics} from '../Themes/'
import currencies from '../Data/currencies.json'
import variations from '../Data/variations.json'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default class Header extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.flex0p3, styles.text]}>
          {"#"}
        </Text>
        <Text style={[styles.flex2, styles.text]}>
          {"Name"}
        </Text>
        <TouchableOpacity
          onPress={() => this.props.toggleSearchBar()}>
          <Icon
            name='search'
            size={Metrics.buttonSize}
            style={styles.icon}/>
        </TouchableOpacity>
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
          style={styles.picker2}
          selectedValue={this.props.selectedValueVariation}
          onValueChange={(item) => this.props.onValueChangeVariation(item)}>
          { variations.map(opt => <Picker.Item
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
    height: Metrics.headerHeight,
    flexDirection: 'row',
    backgroundColor: Colors.headerBackground,
  },
  text: {
    ...{
      color: Colors.headerText,
      paddingTop: Metrics.padding / (5/3),
      paddingLeft: Metrics.padding / 2,
    },
    ...Fonts.style.h5
  },
  picker: {
    ...{width: 100},
    ...{color: Colors.headerText, paddingVertical: Metrics.padding}
  },
  picker2: {
    ...{width: 100},
    ...{color: Colors.headerText, paddingVertical: Metrics.padding}
  },
  flex0p3: {flex: 0.3},
  flex2: {flex: 1.9},
  flex0p5: {flex: 0.5},
  icon: {color: Colors.headerText, paddingTop: Metrics.padding/2, paddingRight: Metrics.padding/2}
})