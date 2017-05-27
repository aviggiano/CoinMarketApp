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

const PAGE_SIZE = 20

export default class List extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <RefreshableListView renderRow={(row) => this.renderListViewRow(row)}
                           onRefresh={(page, callback) => this.listViewOnRefresh(page, callback, endpoints.CMC_COINS)}
                           backgroundColor={'#F6F6EF'}/>
    )
  }

  formatCurrency(numberString) {
    return `R$ ${parseFloat(numberString).toFixed(2)}`
  }

  getStylePercent(numberString) {
    return (parseFloat(numberString) > 0) ? styles.rowDetailsGreen : styles.rowDetailsRed
  }

  renderListViewRow(row) {
    return (
      <TouchableHighlight underlayColor={'#f3f3f2'}
                          onPress={() => console.log(`pressed row ${row}`)}>
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
                 source={{uri: `https://files.coinmarketcap.com/static/img/coins/32x32/${row.id}.png`}}
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
                {this.formatCurrency(row.price_brl)}
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
    fetch(endpoint + items)
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
  toolbar: {
    height: 56,
    backgroundColor: 'purple'
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowCount: {
    fontSize: 20,
    textAlign: 'right',
    color: 'gray',
    margin: 10,
    marginLeft: 15,
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
    fontSize: 14,
    color: 'gray',
  },
  rowTitle: {
    fontSize: 14,
    color: 'gray',
    flex: 3,
  },
  rowTitleRight: {
    fontSize: 14,
    color: 'gray',
    flex: 1.5,
  },
  rowDetailsLine: {
    fontSize: 14,
  },
  rowDetailsGreen: {
    fontSize: 14,
    justifyContent: 'flex-end',
    color: 'green',
    flex: 1,
  },
  rowDetailsRed: {
    fontSize: 14,
    justifyContent: 'flex-end',
    color: 'red',
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC'
  }
});