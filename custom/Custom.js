import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Banner from './Banner';

const Custom = () => {
  return (
    <View style={{ height: '100%', width: '100%' }}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          Custom
        </Text>
        <Text style={styles.headerText}>
          <Icon name="search" size={20} />
        </Text>
      </View>
      <ScrollView style={{ width: '100%', minHeight: '100vh', backgroundColor: 'white' }}>
        <View style={styles.container}>
          <Banner />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  headerContainer: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: 'white'
  },
  headerText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold'
  }
})

export default Custom;
