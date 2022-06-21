import React, { Component } from 'react';
import {View , Image, StatusBar} from 'react-native';

// ...
class Splash extends Component {
  render() {
    return (
    <View style={{flex: 1, backgroundColor:'#112D4E',justifyContent: 'center', alignItems: 'center'}}>
      <StatusBar hidden={true} />
      <Image
        style={{width: 200, height: 200}}
        source={require('../../assets/avalogo.png')}
      />
    </View>
    ) 
  }
}

export default Splash;