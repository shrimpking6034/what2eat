import * as React from 'react';
import { StyleSheet, SafeAreaView, FlatList, Image } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Text, View } from '../components/Themed';


export default function TabTwoScreen() {
  const [foods, setFoods] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  const restoreFoodsFromAsync = async () => {
    const value = await AsyncStorage.getItem('foodH');
    if (value !== null) {
      setFoods(JSON.parse(value).slice(1))
      setShowHistory(true)
    } else {
      setFoods([])
      setShowHistory(false)
    }
  }

  useEffect(() => {
    restoreFoodsFromAsync()

    const interval = setInterval(() => {
      restoreFoodsFromAsync()
    }, 1000)


    return () => clearInterval(interval)
  }, []);

  const renderItem = ({ item }) => {
    if (item.likes == 0) {
      return null
    } else {

      return (
        <View style={{ backgroundColor: '#cccccc', margin: 10, padding: 10, borderRadius: 20, flexDirection: 'column', flex: 1 }}>
          <View style={{ flex: 1, }}>
            <Image
              style={{ height: null, width: null, resizeMode: 'cover', }}
              source={item.uri} />
          </View>
          <Text style={{ flex: 5, fontSize: 20, color: 'white' }}> You've liked {item.name} {item.likes} times </Text>
        </View>
      )
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>History</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <FlatList
        data={foods.sort(function (a, b) {
          return b.likes - a.likes;
        })}
        renderItem={renderItem}
        keyExtractor={item => item.id}

      />
      {showHistory == false ?
        <Text style={{ flex: 5, fontSize: 20, color: 'white' }}> You do not have any likes yet.... </Text> :
        <Text></Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
