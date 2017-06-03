/**
 * Component Name: RefreshableListView
 * Author: Simar Singh (github/iSimar)
 * Description: This component is used to render a listview that can be
 *              pulled down to refresh
 *
 * Dependencies:
 *  -> react-native-gifted-listview 0.0.7 (https://github.com/FaridSafi/react-native-gifted-listview)
 *
 * Properties:
 *  -> renderRow
 *      render function for rows or cells in the listview
 *  -> onRefresh
 *      used for filling the listview on ethier pull to refresh or pagination (load more),
 *      it is called with 2 arugments page number and callback. see react-native-gifted-listview docs.
 *  -> backgroundColor (optional)
 *      default = '#FFFFFF', background color of the listview
 *  -> loadMoreText (optional)
 *      default = '+', text used at the end of the listview - pagination
 *  -> renderHeader (optional)
 *      rendering not sticky header of the listview
 *
 * Example:
 *  <RefreshableListView renderRow={(row)=>this.renderListViewRow(row)}
 *                       renderHeader={this.renderListViewHeader}
 *                       onRefresh={(page, callback)=>this.listViewOnRefresh(page, callback)}
 *                       backgroundColor={'#F6F6EF'}
 *                       loadMoreText={'Load More...'}/>
 *
 */
import React, {Component} from 'react'

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform
} from 'react-native'

import GiftedListView from 'react-native-gifted-listview'
import {Colors} from '../Themes/'

export default class RefreshableListView extends Component {
  constructor(props) {
    super(props)

    this.onRefresh = this.onRefresh.bind(this)
    this.renderHeaderView = this.renderHeaderView.bind(this)
    this.renderRow = this.renderRow.bind(this)
  }

  onRefresh(page = 1, callback, options) {
    this.props.onRefresh(page, callback, options);
  }

  renderRow(row, str) {
    return this.props.renderRow(row, str);
  }

  render() {
    return (
      <View style={[styles.container, {backgroundColor: this.props.backgroundColor || Colors.white}, this.props.style]}>
        <View style={styles.navBarSpace}/>
        <GiftedListView
          initialListSize={this.props.initialListSize}
          rowView={this.renderRow}
          onFetch={this.onRefresh}
          paginationAllLoadedView={this.renderPaginationAllLoadedView}
          paginationWaitingView={this.renderPaginationWaitingView}
          headerView={this.renderHeaderView}
          refreshableProgressBackgroundColor={Colors.clair}
          refreshableColors={[Colors.main]}
          customStyles={{
            refreshableView: {
              backgroundColor: this.props.backgroundColor || Colors.white,
              justifyContent: 'flex-end',
              paddingBottom: 12,
            },
            paginationView: {
              backgroundColor: this.props.backgroundColor || Colors.white,
              height: 60
            }
          }}/>
      </View>
    );
  }

  renderPaginationAllLoadedView() {
    return (
      <View />
    );
  }

  renderPaginationWaitingView(paginateCallback) {
    return (
      <TouchableOpacity style={styles.paginationView}
                        onPress={paginateCallback}>
        <Text style={styles.loadMoreText}>
          {'Load more...'}
        </Text>
      </TouchableOpacity>
    );
  }

  renderHeaderView() {
    if (this.props.renderHeader) {
      return this.props.renderHeader();
    }
    return (null);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navBarSpace: {
    height: (Platform.OS !== 'android') ? 64 : 0,
  },
  rowContainer: {
    paddingRight: 15,
    paddingLeft: 10,
    flexDirection: 'row'
  },
  paginationView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20
  },
  loadMoreText: {
    fontSize: 15,
    color: 'gray',
  }
});