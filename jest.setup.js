import "react-native-gesture-handler/jestSetup";

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const Mock = ({ children }) =>
    React.createElement("mock-icon", null, children);
  return {
    Ionicons: Mock,
    MaterialIcons: Mock,
    MaterialCommunityIcons: Mock,
    FontAwesome: Mock,
    Entypo: Mock,
    Feather: Mock,
    FontAwesome5: Mock,
    SimpleLineIcons: Mock,
    EvilIcons: Mock,
    Octicons: Mock,
    AntDesign: Mock,
  };
});
process.env.EXPO_OS = "android";
