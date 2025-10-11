import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
} from 'react-native';
import { useChatViewModel } from '../../viewmodels/chat/ChatViewModel';

export function ChatView() {
  const { messages, sendMessage } = useChatViewModel();
  const [msg, setMsg] = useState('');

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text>
            {item.senderId}: {item.content}
          </Text>
        )}
        style={styles.list}
      />
      <TextInput
        value={msg}
        onChangeText={setMsg}
        placeholder="Mensagem"
        style={styles.input}
      />
      <Button
        title="Enviar"
        onPress={() => {
          sendMessage(msg, '1', '2');
          setMsg('');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  list: { flex: 1, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 8,
    padding: 8,
  },
});
