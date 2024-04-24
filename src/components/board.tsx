import { View, StyleSheet } from "react-native";
import { BoardModel } from "../models/board";

interface BoardProps {
    board: BoardModel;
}

export const Board = ({board}: BoardProps) => {
  return (
    <View style={styles.board}>
      {board.board.map((row, rowIndex) => {
        if (rowIndex <= 4) return null;
        return (
          <View key={rowIndex} style={styles.row}>
            {row.map((column, columnIndex) => {
              return (
                <View
                  key={columnIndex}
                  style={[
                    styles.piece,
                    { backgroundColor: column.color ?? "black" },
                  ]}
                ></View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    width: "80%",
    aspectRatio: 0.8,
    flexDirection: "column",
    borderWidth: 10,
    borderColor: "black",
    borderRadius: 10,
    backgroundColor: "black",
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  piece: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#212121",
  },
});
