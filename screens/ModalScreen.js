import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Text, View, } from '../components/Themed';

export default function ModalScreen() {
  const [zipCode, setZipCode] = useState('02453')

  const restoreZipFromAsync = async () => {
    const value = await AsyncStorage.getItem('zip');
    if (value !== null) {
      setZipCode(JSON.parse(value))
    }
  }

  const storeData = async (value) => {
    try {
      const jsonVal = JSON.stringify(value)
      await AsyncStorage.setItem('zip', jsonVal)
    } catch (e) {
      console.log("err in storeData")
      console.dir(e)
    }
  }

  useEffect(() => {
    restoreZipFromAsync()
  }, [zipCode]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What2Eat</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.text}>
        Deciding what to eat has never been easy! {"\n"}
        This application will help you to decide what to eat. {"\n"}
        Just like Tinder, swipe left and right to look at foods! {"\n"}
        The app also will tell you where to get the recommended food. {"\n"}
      </Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.text}>
        Enter your Zipcode for restaurant recommendations. {"\n"}
        If not entered, it will be set to Brandeis Zipcode.
      </Text>
      <TextInput
        style={{ backgroundColor: '#ccc', color: '#fff', width: 50, borderRadius: 10, }}
        onChangeText={setZipCode}
        placeholder={zipCode}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={styles.submitButton}
        onPress={
          () => {storeData(zipCode)}
        }>
        <Text style={styles.submitButtonText}> Submit </Text>
      </TouchableOpacity>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
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
  text: {
    textAlign: "center",
    fontSize: 15,
  },

  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },

  image: {
    width: "90%",
    height: "35%"
  },
  submitButton: {
    backgroundColor: '#7a42f4',
    padding: 10,
    margin: 15,
    height: 40,
    borderRadius: 10
  },
  submitButtonText: {
    color: 'white'
  }
});
