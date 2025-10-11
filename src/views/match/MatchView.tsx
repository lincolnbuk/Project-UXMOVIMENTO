import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { useMatchViewModel } from '../../viewmodels/match/MatchViewModel';

export function MatchView() {
  const { matches, findMatch } = useMatchViewModel();

  return (
    <View style={styles.container}>
      <Button title="Encontrar Parceiro" onPress={findMatch} />
      {matches.map(m => (
        <View key={m.matchedUserId} style={styles.card}>
          <Text>Match com usuário: {m.matchedUserId}</Text>
          <Text>Score: {m.matchScore}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
});
