'use strict';

import React, {Component} from 'react'

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';

import * as endpoints from '../Network/endpoints.js'
import RefreshableListView from './RefreshableListView'
import Header from './Header'
import {Colors, Fonts} from '../Themes/'
import currencies from '../Data/currencies.json'

const PAGE_SIZE = 20
const DEFAULT_CURRENCY = 'USD'
const DEFAULT_VARIATION = 'percent_change_24h'
const DEFAULT_CURRENCY_KEY = 'currency'

export default class List extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currency: DEFAULT_CURRENCY,
      variation: DEFAULT_VARIATION
    }
    this.getCurrency()
    this.listViewOnRefresh = this.listViewOnRefresh.bind(this)
    this.renderListViewRow = this.renderListViewRow.bind(this)
  }

  render() {
    return (
      <RefreshableListView
        key={this.state.currency}
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

  async getCurrency() {
    try {
      const currency = await AsyncStorage.getItem(DEFAULT_CURRENCY_KEY)
      if (currency !== null) {
        this.setState({currency})
      }
    } catch (error) {
      console.log(error)
    }
  }

  async persistVariation(period) {
    this.setState({variation: period})
    try {
      await AsyncStorage.setItem(DEFAULT_VARIATION, period);
    } catch (error) {
      console.log(error)
    }
  }

  async persistCurrency(currency) {
    this.setState({currency})
    try {
      await AsyncStorage.setItem(DEFAULT_CURRENCY_KEY, currency);
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

  renderListViewRow(row) {
    return (
      <TouchableHighlight underlayColor={Colors.press}>
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
    flex: 1.2,
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