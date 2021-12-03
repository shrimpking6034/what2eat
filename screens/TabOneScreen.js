import * as React from 'react';
import { StyleSheet } from 'react-native';

import Foodtemplate from '../components/Foodtemplate';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';


export default function TabOneScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Foodtemplate/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});
