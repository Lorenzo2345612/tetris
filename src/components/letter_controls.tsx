import React from "react";
import { Pressable, View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface LeterControlsProps {
  onClickA?: () => void;
  onClickB?: () => void;
  onClickX?: () => void;
  onClickY?: () => void;
}

export const LeterControls = React.memo(({
  onClickA,
  onClickB,
  onClickX,
  onClickY,
}: LeterControlsProps) => {
  return (
    <View style={styles.arrowControlsContainer}>
      <View style={styles.arrowControlsRow}>
        <TouchableOpacity style={styles.arrowBtn} onPress={onClickX}>
          <Text>X</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.arrowControlsRow}>
        <TouchableOpacity style={styles.arrowBtn} onPress={onClickY}>
          <Text>Y</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.arrowBtn} onPress={onClickA}>
          <Text>A</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.arrowControlsRow}>
        <TouchableOpacity style={styles.arrowBtn} onPress={onClickB}>
          <Text>B</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  arrowControlsContainer: {
    height: 150,
    width: 150,
  },
  arrowControlsRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  arrowBtn: {
    height: "100%",
    aspectRatio: 1,
    backgroundColor: "grey",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
