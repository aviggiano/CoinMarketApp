'use strict';

import React, {Component} from 'react'

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight
} from 'react-native';

import * as endpoints from '../Network/endpoints.js'
import RefreshableListView from './RefreshableListView'
import Header from './Header'
import {Colors, Fonts} from '../Themes/'
import currencies from '../Data/currencies.json'

const PAGE_SIZE = 20

export default class List extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currency: currencies[0]
    }
  }

  render() {
    return (
      <RefreshableListView
        key={this.state.currency}
        renderRow={(row) => this.renderListViewRow(row)}
        renderHeader={() => <Header selectedValue={this.state.currency}
                                    onValueChange={(item) => this.onHeaderValueChange(item)}/>}
        onRefresh={(page, callback) => this.listViewOnRefresh(page, callback, endpoints.CMC_COINS)}
        backgroundColor={Colors.clair}/>
    )
  }

  onHeaderValueChange(item) {
    this.setState({currency: item})
  }

  formatCurrency(numberString) {
    return `${this.state.currency} ${parseFloat(numberString).toFixed(2)}`
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
          <Text style={styles.rowTitleRank}>
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
              <Text style={styles.rowTitleRight}>
                {this.formatCurrency(row[`price_${this.state.currency.toLowerCase()}`])}
              </Text>
              <Text style={this.getStylePercent(row.percent_change_24h)}>
                {`${row.percent_change_24h}%`}
              </Text>
            </View>
            <View style={styles.separator}/>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  listViewOnRefresh(pageCount, callback, endpoint) {
    const items = PAGE_SIZE * pageCount
    fetch(`${endpoint}${items}&convert=${this.state.currency}`)
      .then((response) => response.json())
      .then(array => {
        callback(array.slice(-PAGE_SIZE))
      })
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
  rowTitleRank: {
    fontSize: Fonts.size.medium,
    color: Colors.text,
  },
  rowTitle: {
    fontSize: Fonts.size.medium,
    color: Colors.text,
    flex: 3,
  },
  rowTitleRight: {
    fontSize: Fonts.size.medium,
    color: Colors.text,
    flex: 1.5,
  },
  rowDetailsLine: {
    fontSize: Fonts.size.medium,
  },
  rowDetailsGreen: {
    fontSize: Fonts.size.medium,
    justifyContent: 'flex-end',
    color: 'green',
    flex: 1,
  },
  rowDetailsRed: {
    fontSize: Fonts.size.medium,
    justifyContent: 'flex-end',
    color: 'red',
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: Colors.separator
  }
});