import React from "react";
import QRCodeScanner from "react-native-qrcode-scanner";

function Scan({ navigation }) {

  onSuccess = (e) => {
    navigation.navigate("SignIn", {
      lnurl: e.data,
   });
  };

  return <QRCodeScanner onRead={this.onSuccess} />;
}

export default Scan;