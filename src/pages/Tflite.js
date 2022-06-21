import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Alert, Image, Modal, Animated, ScrollView,
} from 'react-native';
import Tflite from 'tflite-react-native';
import * as ImagePicker from 'react-native-image-picker';
import Tts from 'react-native-tts';

const tflite = new Tflite();
// const height = 350;
// const width = 350;

class TfModel extends React.Component {
  state = {
    isTfReady: false,
    singleFile: null,
    patUri: null,
    result: null,
    visible: false,
    describtion: '',

  };

  selectModel = () => {
    const model = 'model/avamodel.tflite';
    const labels = 'model/avamodel.txt';
    tflite.loadModel(
      {
        model,
        labels,
      },
      (err, res) => {
        if (err) console.log(err);
        else console.log(res);
        this.setState({ isTfReady: true });
      },
    );
  };

  componentDidMount() {
    this.selectModel();
    Tts.setDefaultVoice('id-ID-language');
  }

  onSpeak(textSpeak) {
    // id-ID-language
    Tts.voices().then((voices) => console.log(voices));
    Tts.getInitStatus().then(() => {
      Tts.speak(textSpeak, {
        androidParams: {
          KEY_PARAM_PAN: -1,
          KEY_PARAM_VOLUME: 0.5,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
      });
    });
  }

  onPressX() {
    Tts.stop();
    this.setState({ visible: false });
  }

  onClassification = () => {
    const path = this.state.patUri;

    if (path != null) {
      tflite.runModelOnImage(
        {
          path,
          imageMean: 128.0,
          imageStd: 128.0,
          numResults: 1,
          threshold: 0.9,
        },
        (err, res) => {
          if (err) console.log(err);
          else console.log(res);
          if(res != ''){
            if (res[0].label != null) {
              if (res[0].label == 'Anoa') {
                this.setState({ describtion: 'Anoa (Bubalus sp.) adalah mamalia terbesar dan endemik yang hidup di daratan Pulau Sulawesi dan Pulau Buton.[3] Banyak yang menyebut anoa sebagai kerbau kerdil.[4] Anoa merupakan hewan yang tergolong fauna peralihan.[5] Anoa merupakan mamalia tergolong dalam famili bovidae yang tersebar hampir di seluruh pulau Sulawesi. Kawasan Wallacea yang terdiri atas pulau Sulawesi, Maluku, Halmahera, Kepulauan Flores, dan pulaupulau kecil di Nusa Tenggara' });
              } else if (res[0].label == 'Bekantan') {
                this.setState({ describtion: 'Bekantan (nama ilmiah: Nasalis larvatus) adalah jenis monyet berhidung panjang dengan rambut berwarna coklat kemerahan dan merupakan satu dari dua spesies dalam genus Nasalis. Bekantan merupakan hewan endemik pulau Kalimantan yang tersebar di hutan bakau, rawa dan hutan pantai. Ciri utama yang membedakan bekantan dari monyet lainnya adalah hidung panjang dan besar yang hanya ditemukan di spesies jantan.' });
              } else if (res[0].label == 'Jalak Bali') {
                this.setState({ describtion: 'Jalak Bali (Leucopsar rothschildi) adalah sejenis burung pengicau berukuran sedang, dengan panjang lebih kurang 25cm,[1] dari suku Sturnidae. Ia turut dikenali sebagai Curik Ketimbang Jalak.[2] Jalak Bali hanya ditemukan di hutan bagian barat Pulau Bali dan merupakan hewan endemik Indonesia. Burung ini juga merupakan satu-satunya spesies endemik Bali dan pada tahun 1991 dinobatkan sebagai lambang fauna Provinsi Bali.' });
              } else if (res[0].label == 'Komodo') {
                this.setState({ describtion: 'Komodo atau lengkapnya biawak komodo (Varanus komodoensis), adalah spesies biawak besar yang terdapat di Pulau Komodo, Rinca, Flores, Gili Motang, dan Gili Dasami di Provinsi Nusa Tenggara Timur, Indonesia.[1][2] Biawak ini oleh penduduk asli pulau Komodo juga disebut dengan nama setempat ora.[3] Nama lain dari komodo adalah buaya darat, walaupun komodo bukanlah spesies buaya.[4]' });
              } else if (res[0].label == 'Orang Utan') {
                this.setState({ describtion: 'Orang utan (bentuk tidak baku: orangutan) atau mawas adalah salah satu jenis kera besar dengan lengan panjang dan berbulu kemerahan atau cokelat, yang hidup di hutan tropis Indonesia dan Malaysia, khususnya di Pulau Kalimantan dan Sumatra.[1][2]' });
              }
            }
            this.setState({ result: res });
            this.setState({ visible: true });
          }else{
            Alert.alert("Gagal", "Terdapat masalah, Silahkan coba gambar yang lain")
          }
        },
      );
    } else {
      Alert.alert('Warning', 'Silahkan Masukan Imagenya Terlebih Dahulu');
    }
  };

  ImageFromGaleri = () => {
    const options = {
      title: 'Select Avatar',
      customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        this.setState({ patUri: response.assets[0].uri });
      }
    });
  };

  ImageFromCamera = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        console.log('response', JSON.stringify(response));
        console.log(response.assets[0].uri);
        this.setState({ patUri: response.assets[0].uri });
      }
    });
  };

  render() {
    return (
      <View style={styles.mainBody}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 30, textAlign: 'center' ,color:'black'}}>
            AVA CNN Image Classification
          </Text>
          <Text
            style={{
              fontSize: 25,
              marginTop: 20,
              marginBottom: 35,
              textAlign: 'center',
              color:'black'
            }}
          >
            Offline Version
          </Text>
        </View>
          <ModalPoup visible={this.state.visible}>
            <View style={{ alignItems: 'center' }}>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => this.onPressX()}>
                  <Image
                    source={require('../../assets/x.png')}
                    style={{ height: 30, width: 30 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ alignItems: 'center' }}>
              {this.state.patUri != null ? (
                <Image style={{ height: 150, width: 150, marginVertical: 10 }} source={{ uri: this.state.patUri }} />
              ) : null}
            </View>
            {this.state.result != null ? (
              <Text style={{ marginVertical: 30, fontSize: 20, textAlign: 'center', color:'black' }}>
                {this.state.result[0].label ? this.state.result[0].label : ''}
                {'\n'}
                confidence:
                {' '}
                {this.state.result[0].confidence ? (this.state.result[0].confidence * 100).toFixed(2) : ''}
                {' '}
                %
              </Text>
            ) : null}
            {this.state.describtion != null ? (
              <TouchableOpacity onPress={() => this.onSpeak(this.state.describtion ? this.state.describtion : '')}>
                <Text style={{ marginVertical: 30, fontSize: 20, textAlign: 'center', color:'black' }}>
                  source : wikipedia
                  {'\n'}
                  {this.state.describtion ? this.state.describtion : ''}
                </Text>
              </TouchableOpacity>
            ) : null}

          </ModalPoup>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={this.ImageFromGaleri}
        >
          <Text style={styles.buttonTextStyle}>Open Galeri</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={this.ImageFromCamera}
        >
          <Text style={styles.buttonTextStyle}>Open Camera</Text>
        </TouchableOpacity>
        
        
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={this.onClassification}
        >
          <Text style={styles.buttonTextStyle}>Classification !</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  buttonStyle: {
    backgroundColor: '#112D4E',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#112D4E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 10,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  textStyle: {
    backgroundColor: '#fff',
    fontSize: 15,
    marginTop: 16,
    marginLeft: 35,
    marginRight: 35,
    textAlign: 'center',
  },
  image: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginLeft: 35,
    marginRight: 35,
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default TfModel;

function ModalPoup({ visible, children }) {
  const [showModal, setShowModal] = React.useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    toggleModal();
  }, [visible]);
  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <Animated.View
          style={[styles.modalContainer, { transform: [{ scale: scaleValue }] }]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}
