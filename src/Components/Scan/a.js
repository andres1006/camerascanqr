import React, { useState } from 'react';
import BarcodeScanner from 'react-native-barcodescanner';

const Barcode = () => {
  const [state, setState] = useState({
    torchMode: 'off',
    cameraType: 'back',
  });


  const barcodeReceived = (e) => {
    console.log('Barcode: ' + e.data);
    console.log('Type: ' + e.type);
  }

  return (
    <BarcodeScanner
      onBarCodeRead={barcodeReceived}
      style={{ flex: 1 }}
      torchMode={state.torchMode}
      cameraType={state.cameraType}
    />
  );
}

export default Barcode;