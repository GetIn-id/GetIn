import { StyleSheet } from "react-native";

const primaryColor = "#00e575ff";
const darkColor = "#00b147";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  logoSection: {
    width: "90%",
    height: "50%",
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
  },
  logo: {
    marginTop: "10%",
    alignSelf: "center",
    width: 260,
    height: 260,
  },
  textSection: {
    width: "90%",
    height: "30%",
    flexDirection: "column",
    alignSelf: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginHorizontal: 30,
  },
  infoText: {
    fontSize: 16,
    alignSelf: "center",
    marginHorizontal: 30,
    paddingTop: 20,
  },
  buttonSection: {
    width: "90%",
    height: "20%",
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
  },
  button: {
    paddingHorizontal: 50,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: primaryColor,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15 ,
    shadowOffset : { width: 1, height: 13}
  },
  buttonText: {
    paddingLeft: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 16,
  },
  signInSection: {
    width: "90%",
    height: "25%",
    flexDirection: "column",
    alignSelf: "center",
  },
  SIbuttonSection: {
    width: "90%",
    height: "20%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignSelf: "center",
  },
  SIlogoSection: {
    width: "90%",
    height: "30%",
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
  },
  SIlogo: {
    marginTop: "10%",
    alignSelf: "center",
  },
  circles: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: "center",
    width: "90%",
    height: "25%",
  },
  progress: {
    margin: 10,
  },
  CancelButton: {
    backgroundColor: "#808080",
  },
  settingsCard: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  divider: {
    marginVertical: 15,
    width: "90%",
    borderBottomColor: 'grey',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  input: {
    width: "90%",
    justifyContent: "space-between",
    alignSelf: "center",
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: "grey",
  },
  inputText: {
    marginLeft: "5%",
  },
  settingButton: {
    width: "90%",
    height: "100%",
    justifyContent: "space-around",
    alignSelf: "center",
  },
  historyText: {
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0
  },
  modalView: {
    margin: "5%",
    backgroundColor: "#121212",
    borderRadius: 0,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginTop: 20,
    marginBottom: 60,
    textAlign: "center"
  }, 
  backUpInput: {
    justifyContent: 'space-between',
    alignSelf: 'center',
    height: 40,
    margin: 12,
    borderBottomWidth: 1,
    padding: 10,
    autoCapitalize: "none"
  },
  backUpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  backUpButton: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignSelf: "center",
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#F5FCFF88",
  }
});