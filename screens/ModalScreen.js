import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { Text, View, Image } from '../components/Themed';

const IMG_URI =
  "https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg";

export default function ModalScreen() {
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
});
