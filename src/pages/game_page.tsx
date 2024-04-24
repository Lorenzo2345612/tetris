import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  StyleSheet,
  Button,
  View,
  Pressable,
  TouchableOpacity,
  Modal,
  BackHandler,
  AppState,
} from "react-native";
import { Board } from "../components/board";
import { ArrowControls } from "../components/arrow_controls";
import { LeterControls } from "../components/letter_controls";
import { useTetris } from "../hooks/useTetris";
import { Turn } from "../models/pieces/piece_basic";
import GameOverModal from "../components/game_over_modal";
import { AntDesign } from '@expo/vector-icons';

export const GamePage = () => {
  const { restartGame, pauseGame, score, board, handleMove, turn, isGameOver, isPaused } =
    useTetris();

  return (
    <SafeAreaView style={styles.page}>
      <Board board={board}></Board>

      <View style={styles.constrolsContainer}>
        <ArrowControls handleMove={handleMove} />
        <LeterControls
          onClickA={() => {
            turn(Turn.Right);
          }}
          onClickB={() => {
            turn(Turn.Left);
          }}
        />
      </View>

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={restartGame}
          style={styles.gameBtn}
        >
          <AntDesign name="reload1" size={25}/>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={pauseGame}
          style={styles.gameBtn}
        >
          <AntDesign name={isPaused ? 'play' : 'pause'} size={25}></AntDesign>
        </TouchableOpacity>
        <Text>Score: {score}</Text>
      </View>

      <GameOverModal
        show={isGameOver}
        onClose={() => {}}
        onRestart={restartGame}
        score={score}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 30,
    backgroundColor: "#005f73",
  },
  constrolsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  gameBtn : {
    backgroundColor: "grey",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    height: 50,
    width: 50,
  }
});
