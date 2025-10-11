import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useGamificationViewModel } from '../../viewmodels/gamification/GamificationViewModel';

export function GamificationView() {
  const { data, addXP } = useGamificationViewModel();

  return (
    <View style={styles.container}>
      <Text>XP: {data.xp}</Text>
      <Text>Nível: {data.level}</Text>
      <Text>Pontos: {data.points}</Text>
      <Button title="Ganhar XP" onPress={() => addXP(50)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
