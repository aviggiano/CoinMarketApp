'use strict';

import React, {Component} from 'react'

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  Vibration,
  AsyncStorage
} from 'react-native';

import Share from 'react-native-share'
import * as endpoints from '../Network/endpoints.js'
import RefreshableListView from './RefreshableListView'
import Header from './Header'
import {Colors, Fonts} from '../Themes/'
import currencies from '../Data/currencies.json'


const PAGE_SIZE = 20
const DEFAULT_CURRENCY = 'USD'
const STORAGE_KEY_CURRENCY = 'currency'
const DEFAULT_VARIATION = 'percent_change_24h'
const STORAGE_KEY_VARIATION = 'variation'

export default class List extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currency: DEFAULT_CURRENCY,
      variation: DEFAULT_VARIATION
    }
    this.getCurrency()
    this.getVariation()
    this.listViewOnRefresh = this.listViewOnRefresh.bind(this)
    this.renderListViewRow = this.renderListViewRow.bind(this)
  }

  render() {
    return (
      <RefreshableListView
        key={`${this.state.currency}/${this.state.variation}`}
        renderRow={this.renderListViewRow}
        renderHeader={() =>
          <Header
            selectedValue={this.state.currency}
            selectedValueVariation={this.state.variation}
            onValueChange={(currency) => this.persistCurrency(currency)}
            onValueChangeVariation={(period) => this.persistVariation(period)}
          />}
        onRefresh={this.listViewOnRefresh}
        backgroundColor={Colors.clair}/>
    )
  }

  async getStorage(storageKey, stateKey) {
    try {
      const value = await AsyncStorage.getItem(storageKey)
      if (value !== null) {
        this.setState({[stateKey]: value})
      }
    } catch (error) {
      console.log(error)
    }
  }

  async getCurrency() {
    try {
      const currency = await AsyncStorage.getItem(STORAGE_KEY_CURRENCY)
      if (currency !== null) {
        this.setState({currency})
      }
    } catch (error) {
      console.log(error)
    }
  }

  async getVariation() {
    try {
      const variation = await AsyncStorage.getItem(STORAGE_KEY_VARIATION)
      if (variation !== null) {
        this.setState({variation})
      }
    } catch (error) {
      console.log(error)
    }
  }

  async persistVariation(variation) {
    this.setState({variation})
    try {
      await AsyncStorage.setItem(STORAGE_KEY_VARIATION, variation);
    } catch (error) {
      console.log(error)
    }
  }

  async persistCurrency(currency) {
    this.setState({currency})
    try {
      await AsyncStorage.setItem(STORAGE_KEY_CURRENCY, currency);
    } catch (error) {
      console.log(error)
    }
  }

  formatCurrency(numberString) {
    return `${currencies[this.state.currency]} ${parseFloat(numberString).toFixed(2)}`
  }

  getStylePercent(numberString) {
    return (parseFloat(numberString) > 0) ? styles.rowDetailsGreen : styles.rowDetailsRed
  }

  shareSocial(row) {
    const pattern = [75, 25, 75] // empirically imitating WhatsApp's vibration pattern
    Vibration.vibrate(pattern)
    Share
      .open({
        message: [
          `${row.name} (${row.symbol})`,
          `is at`,
          `${this.formatCurrency(row[`price_${this.state.currency.toLowerCase()}`])}`,
          `(${row[this.state.variation]}% change 24h)`
        ].join(' '),
        url: endpoints.GOOGLE_PLAY,
        subject: `Latest ${row.name} (${row.symbol}) price`
      })
      .then((action) => console.log(action))
      .catch((err) => console.log(err))
  }

  renderListViewRow(row) {
    return (
      <TouchableHighlight
        onLongPress={() => this.shareSocial(row)}
        underlayColor={Colors.press}>
        <View style={styles.rowContainer}>
          <Text>
            {"  "}
          </Text>
          <Text style={styles.rowRank}>
            {row.rank}
          </Text>
          <Text>
            {"  "}
          </Text>
          <Image style={{width: 32, height: 32}}
                 source={{uri: `${endpoints.CMC_IMAGES}${row.id}.png`}}
          />
          <Text>
            {"  "}
          </Text>
          <View style={styles.rowDetailsContainerFlex}>
            <View style={styles.rowDetailsContainer}>
              <Text style={styles.rowTitle}>
                {`${row.name} (${row.symbol})`}
              </Text>
              <Text style={styles.rowCurrency}>
                {this.formatCurrency(row[`price_${this.state.currency.toLowerCase()}`])}
              </Text>
              <Text style={this.getStylePercent(row[this.state.variation])}>
                {`${row[this.state.variation]}%`}
              </Text>
            </View>
            <View style={styles.separator}/>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  listViewOnRefresh(pageCount, callback) {
    const items = PAGE_SIZE * pageCount
    fetch(`${endpoints.CMC_COINS}${items}&convert=${this.state.currency}`)
      .then((response) => response.json())
      .then(array => {
        callback(array.slice(-PAGE_SIZE))
      })
      .catch((err) => callback([]))
      .done()
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowDetailsContainerFlex: {
    flex: 1,
  },
  rowDetailsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 4,
    marginRight: 10,
  },
  rowRank: {
    fontSize: Fonts.size.medium,
    marginLeft: '1%',
    color: Colors.text,
  },
  rowTitle: {
    fontSize: Fonts.size.medium,
    color: Colors.text,
    flex: 3,
  },
  rowCurrency: {
    fontSize: Fonts.size.medium,
    color: Colors.text,
    flex: 1.4,
  },
  rowDetailsLine: {
    fontSize: Fonts.size.medium,
  },
  rowDetailsGreen: {
    fontSize: Fonts.size.medium,
    textAlign: 'right',
    justifyContent: 'flex-end',
    marginRight: '10%',
    color: 'green',
    flex: 1.1,
  },
  rowDetailsRed: {
    fontSize: Fonts.size.medium,
    textAlign: 'right',
    justifyContent: 'flex-end',
    marginRight: '10%',
    color: 'red',
    flex: 1.1
  },
  separator: {
    height: 1,
    backgroundColor: Colors.separator
  }
});