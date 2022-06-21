import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';


const Cardimage = ({img, nama, jurusan , kelas, job}) => {
  return (
    <View style={{flexDirection:'row', marginBottom:20, marginLeft:20}}>
      <Image source={img} style={{height:100, width:100, borderRadius:50}} />
      <Text style={{marginLeft:40, alignSelf:'center', color:'black'}} >{nama}{'\n'}{jurusan}{'\n'}{kelas}{'\n'}{job}</Text>
    </View>
  )
}

export default function About() {
  return (
    <View style={{marginTop:10, alignContent:'center', justifyContent:'center', flex:1}}>
      <Cardimage img={require('../../assets/hiro.jpeg')} nama={'Armandani Hero'} jurusan={'Teknik Informatika'} kelas={'Fibonaci'} job={"Data Acquisition \nData Preprocessing"} />
      <Cardimage img={require('../../assets/glandy.jpg')} nama={'Glandy Mundung'} jurusan={'System Informasi'} kelas={'Optima'} job={"Modelling\nEvaluation"} />
      <Cardimage img={require('../../assets/ghanes.jpg')} nama={'Ghanes Mahesa Aditya'} jurusan={'Teknik Telekomunikasi'} kelas={'Paradox'} job={"Data Acquisition \nData Preprocessing"} />
      <Cardimage img={require('../../assets/agung.png')} nama={'Trio Agung Purwanto'} jurusan={'Teknik Informatika'} kelas={'Jatayu'} job={"Deployment"} />
    </View>
  )
}

const styles = StyleSheet.create({
  top: {
    marginTop:10
  },
});