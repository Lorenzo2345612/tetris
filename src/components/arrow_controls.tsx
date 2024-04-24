import { Pressable, View, StyleSheet, TouchableOpacity } from "react-native";
import { Move } from "../models/pieces/piece_basic";
import { AntDesign } from "@expo/vector-icons";
import React from "react";

interface ArrowControlsProps {
  handleMove: (move: Move) => void;
}

export const ArrowControls = React.memo(({ handleMove }: ArrowControlsProps) => {
  return (
    <View style={styles.arrowControlsContainer}>
      <View style={styles.arrowControlsRow}>
        <ArrowButton>
          <AntDesign name="arrowup" size={24} color="black" />
        </ArrowButton>
      </View>
      <View style={styles.arrowControlsRow}>
        <ArrowButton
          onPress={() => {
            handleMove(Move.left);
          }}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </ArrowButton>
        <ArrowButton>
          <AntDesign name="pluscircle" size={24} color="black" />
        </ArrowButton>
        <ArrowButton
          onPress={() => {
            handleMove(Move.right);
          }}
        >
          <AntDesign name="arrowright" size={24} color="black" />
        </ArrowButton>
      </View>
      <View style={styles.arrowControlsRow}>
        <ArrowButton
          onPress={() => {
            handleMove(Move.down);
          }}
        >
          <AntDesign name="arrowdown" size={24} color="black" />
        </ArrowButton>
      </View>
    </View>
  );
});

interface ArrowButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
}

const ArrowButton = ({ onPress, children }: ArrowButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
        },
        styles.arrowBtn,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  arrowControlsContainer: {
    height: 165,
    width: 165,
    gap: 8,
  },
  arrowControlsRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  arrowBtn: {
    height: "100%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    borderRadius: 5
  },
});
