import React from "react";
import QRCodeScanner from "react-native-qrcode-scanner";

function Scan({ navigation }) {

  onSuccess = (e) => {
    console.log(e.data);
    navigation.navigate("SignIn", {
      lnurl: e.data,
   });
  };

  return <QRCodeScanner onRead={this.onSuccess} />;
}

export default Scan;