import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { memo } from "react";

interface GameOverModalProps {
  show: boolean;
  onClose: () => void;
  onRestart: () => void;
  score: number;
}

function GameOverModal({ show, onClose, onRestart, score }: GameOverModalProps) {
  return (
    <Modal visible={show} >
      <View style={styles.modalView}>
        <View style={styles.modal}>
          <Text style={{fontSize: 40, fontWeight: 'bold'}}>Game Over</Text>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Score: {score}</Text>
          <TouchableOpacity
            onPress={onRestart}
            style={{ width: 100, height: 50, backgroundColor: "#ccc", justifyContent: "center", alignItems: "center" }}
          >
            <Text>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    position: "absolute",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#010101",
    padding: 35,
    width: "100%",
    zIndex: 1,
    gap: 50
  },
  modal: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});

export default memo(GameOverModal);
