import { useState } from 'react';
import { Message } from '../../models/chat/Message';

export function useChatViewModel() {
  const [messages, setMessages] = useState<Message[]>([]);

  function sendMessage(content: string, senderId: string, receiverId: string) {
    const newMsg: Message = {
      id: Math.random().toString(),
      senderId,
      receiverId,
      content,
      timestamp: Date.now(),
    };
    setMessages(msgs => [...msgs, newMsg]);
  }

  return { messages, sendMessage };
}
