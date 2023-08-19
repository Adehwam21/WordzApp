import React from 'react';
import { StyleSheet, View } from 'react-native';
import WordList from './Components/WordList';

export default function App() {
  return (
    <View style={styles.container}>
      <WordList/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
