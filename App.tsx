import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TargetWeight from './components/weightTarget'


export default function App() {
  return (
    <TargetWeight weight={84} height={1.77}/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
