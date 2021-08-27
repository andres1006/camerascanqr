import React, {Component, Fragment} from 'react';
import {
  TouchableOpacity,
  Text,
  Linking,
  View,
  Image,
  ImageBackground,
  BackHandler,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import styles from './scanStyle';
import axios from 'axios';

class Scan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scan: true,
      ScanResult: false,
      result: null,
      loading: false,
    };
  }
  onSuccess = async e => {
    const check = e.data.substring(0, 4);
    console.log('scanned data' + check);
    this.setState({
      result: e,
      scan: false,
      ScanResult: true,
      loading: true,
    });
    if (check) {
      //Linking.openURL(`162.248.54.211/paqtec/public/api/producto/detalle/${check}`).catch(err => console.error('An error occured', err));
      const response = await axios
        .get(
          `http://162.248.54.211/paqtec/public/api/producto/detalle/${check}`,
        )
        .catch(function (error) {
          this.setState({
            result: error,
            scan: false,
            ScanResult: true,
            loading: false,
          });
        });
      if (!response)
        return this.setState({
          result: null,
          scan: false,
          ScanResult: true,
          loading: false,
        });
      this.setState({
        result: response.data[0],
        scan: false,
        ScanResult: true,
        loading: false,
      });
    } else {
      this.setState({
        result: null,
        scan: false,
        ScanResult: true,
        loading: false,
      });
    }
  };
  activeQR = () => {
    this.setState({scan: true});
  };
  scanAgain = () => {
    this.setState({scan: true, ScanResult: false});
  };
  render() {
    const {scan, ScanResult, result, loading} = this.state;
    return (
      <View style={styles.scrollViewStyle}>
        <Fragment>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => BackHandler.exitApp()}>
              <Image
                source={require('../../assets/back.png')}
                style={{height: 36, width: 36}}></Image>
            </TouchableOpacity>
            <Text style={styles.textTitle}>Paq Tec</Text>
          </View>
          {/*      {!scan && !ScanResult && (
            <View style={styles.cardView}>
              <Image
                source={require('../../assets/camera.png')}
                style={{height: 36, width: 36}}></Image>
              <Text numberOfLines={8} style={styles.descText}>
                Please move your camera {'\n'} over the QR Code
              </Text>
              <Image
                source={require('../../assets/qr-code.png')}
                style={{margin: 20}}></Image>
              <TouchableOpacity
                onPress={this.activeQR}
                style={styles.buttonScan}>
                <View style={styles.buttonWrapper}>
                  <Image
                    source={require('../../assets/camera.png')}
                    style={{height: 36, width: 36}}></Image>
                  <Text style={{...styles.buttonTextStyle, color: '#2196f3'}}>
                    Scan QR Code
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )} */}
          {ScanResult && (
            <Fragment>
              <View style={ScanResult ? styles.scanCardView : styles.cardView}>
                {!loading ? (
                  <Fragment>
                    <Text style={styles.textTitle1}>Result</Text>
                    <Text>Id : {result.pro_id && result.pro_id}</Text>
                    <Text numberOfLines={1}>
                      Rol: {result.pro_rol && result.pro_rol}
                    </Text>
                    <Text numberOfLines={1}>
                      Producto: {result.pro_producto && result.pro_producto}
                    </Text>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Text numberOfLines={1}>Cargando...</Text>
                  </Fragment>
                )}
                {result.error && <Text>error : {result.error}</Text>}
                <TouchableOpacity
                  onPress={this.scanAgain}
                  style={styles.buttonScan}>
                  <View style={styles.buttonWrapper}>
                    <Image
                      source={require('../../assets/camera.png')}
                      style={{height: 36, width: 36}}></Image>
                    <Text style={{...styles.buttonTextStyle, color: '#2196f3'}}>
                      Scanear otro codigo
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Fragment>
          )}
          {scan && (
            <QRCodeScanner
              reactivate={true}
              showMarker={true}
              ref={node => {
                this.scanner = node;
              }}
              onRead={this.onSuccess}
              topContent={
                <Text style={styles.centerText}>
                  Porfavor mueve tu camara  sobre el codigo 2D
                </Text>
              }
              bottomContent={
                <View>
                  <ImageBackground
                    style={styles.bottomContent}>
                    <TouchableOpacity
                      style={styles.buttonScan2}
                      onPress={() => this.scanner.reactivate()}
                      onLongPress={() => this.setState({scan: false})}>
                      <Image
                        source={require('../../assets/camera2.png')}></Image>
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
              }
            />
          )}
        </Fragment>
      </View>
    );
  }
}
export default Scan;
