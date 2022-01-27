import React, { useState } from "react";
import { View, Text } from "react-native";
import { TriangleColorPicker, toHsv } from "react-native-color-picker";

// export class ColorScreen extends React.Component {
//   constructor(...args) {
//     super(...args);
//     this.state = { color: toHsv("green") };
//     this.onColorChange = this.onColorChange.bind(this);
//   }

//   onColorChange(color) {
//     this.setState({ color });
//   }

const ColorScreen = () => {
  const [color, setColor] = useState({ color: toHsv("green") });

  return (
    <View style={{ flex: 1, padding: 45, backgroundColor: "#212021" }}>
      <Text style={{ color: "white" }}>
        React Native Color Picker - Controlled
      </Text>
      <TriangleColorPicker
        oldColor="purple"
        color={color}
        onColorChange={(val) => setColor(val)}
        onColorSelected={(color) => alert(`Color selected: ${color}`)}
        onOldColorSelected={(color) => alert(`Old color selected: ${color}`)}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default ColorScreen;
