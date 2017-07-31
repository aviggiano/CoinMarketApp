'use strict';

import React, {Component} from 'react'

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  FlatList,
  ScrollView,
  Vibration,
  StatusBar,
  AsyncStorage
} from 'react-native';

import Share from 'react-native-share'
import SearchBar from 'react-native-searchbar'

import * as endpoints from '../Network/endpoints.js'
import Header from './Header'
import {Colors, Fonts} from '../Themes/'
import currencies from '../Data/currencies.json'

const DEFAULT_CURRENCY = 'USD'
const STORAGE_KEY_CURRENCY = 'currency'
const DEFAULT_VARIATION = 'percent_change_24h'
const STORAGE_KEY_VARIATION = 'variation'

export default class List extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currency: DEFAULT_CURRENCY,
      variation: DEFAULT_VARIATION,
      isSearching: false,
      refreshing: true,
      data: [],
      dataVisible: []
    }
    this.getData = this.getData.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.toggleSearchBar = this.toggleSearchBar.bind(this)
    this.onX = this.onX.bind(this)
    this.persistCurrency = this.persistCurrency.bind(this)
    this.persistVariation = this.persistVariation.bind(this)

    this.getDataConstructor().done()
  }

  onX() {
    this.searchBar._clearInput()
  }

  toggleSearchBar() {
    const isSearching = !this.state.isSearching
    if (!isSearching) {
      this.onX()
    }
    this.setState({isSearching})
  }

  handleSearch(input) {
    const inputLower = input.toLowerCase()
    const dataVisible = this.state.data.filter((object) => (
      object.name.toLowerCase().indexOf(inputLower) > -1 ||
      object.symbol.toLowerCase().indexOf(inputLower) > -1
    ))
    this.setState({dataVisible})
  }

  renderHeader() {
    return (
      <Header
        selectedValue={this.state.currency}
        selectedValueVariation={this.state.variation}
        onValueChange={this.persistCurrency}
        onValueChangeVariation={this.persistVariation}
        toggleSearchBar={this.toggleSearchBar}
      />
    )
  }

  renderSearchBar() {
    return this.state.isSearching ? (
      <SearchBar
        style={styles.style}
        data={this.state.data}
        handleSearch={this.handleSearch}
        onBack={this.toggleSearchBar}
        ref={(ref) => this.searchBar = ref}
        onX={this.onX}
        allDataOnEmptySearch
        clearOnBlur
        clearOnHide
        clearOnShow
        showOnLoad
      />
    ) : null
  }


  render() {
    return (
      <View>
        <StatusBar
          backgroundColor={Colors.darkMain}
          barStyle="light-content"
        />
        {this.renderHeader()}
        {this.renderSearchBar()}
        <ScrollView>
          <FlatList
            data={this.state.dataVisible}
            refreshing={this.state.refreshing}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.id}
            onRefresh={this.getData}
          />
        </ScrollView>
      </View>
    )
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
    return this.getData({variation})
  }

  async persistCurrency(currency) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_CURRENCY, currency);
    } catch (error) {
      console.log(error)
    }
    return this.getData({currency})
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
          `(${row[this.state.variation]}% change 24h).`
        ].join(' '),
        url: endpoints.GOOGLE_PLAY,
        subject: `Latest ${row.name} (${row.symbol}) price`
      })
      .then((action) => console.log(action))
      .catch((err) => console.log(err))
  }

  renderItem({item}) {
    return (
      <TouchableHighlight
        onLongPress={() => this.shareSocial(item)}
        underlayColor={Colors.press}>
        <View>
          <View style={styles.separator}/>
          <View style={styles.rowContainer}>
            <Text>
              {"  "}
            </Text>
            <Text style={styles.rowRank}>
              {item.rank}
            </Text>
            <Text>
              {"  "}
            </Text>
            <Image style={styles.image}
                   source={{uri: `${endpoints.CMC_IMAGES}${item.id}.png`}}
            />
            <Text>
              {"  "}
            </Text>
            <View style={styles.rowDetailsContainerFlex}>
              <View style={styles.rowDetailsContainer}>
                <Text style={styles.rowTitle}>
                  {`${item.name} (${item.symbol})`}
                </Text>
                <Text style={styles.rowCurrency}>
                  {this.formatCurrency(item[`price_${this.state.currency.toLowerCase()}`])}
                </Text>
                <Text style={this.getStylePercent(item[this.state.variation])}>
                  {`${item[this.state.variation]}%`}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  async getData(state) {
    state = state || {}
    const currency = state.currency || this.state.currency

    return fetch(`${endpoints.CMC_COINS}?convert=${currency}&limit=20`)
      .then((response) => response.json()).catch(() => this.setState(state))
      .then(data => this.setState({data, dataVisible: data, ...state}))
      .done()
  }

  async getDataConstructor() {
    await Promise.all([this.getCurrency(), this.getVariation()])
    this.getData({refreshing: false}).done()
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
  },
  image: {
    width: 32,
    height: 32
  }
});