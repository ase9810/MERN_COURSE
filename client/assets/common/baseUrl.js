import { Platform } from "react-native";
//phone test
let baseURL = "http://192.168.0.91:3000/api/v1/";

//simulator test
// let baseURL = "";

// {
// 	Platform.OS == "android" ? (baseURL = "http://10.0.2.2:3000/api/v1/") : (baseURL = "http://localhost:3000/api/v1/");
// }

export default baseURL;
