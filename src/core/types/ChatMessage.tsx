import { IMessage } from 'react-native-gifted-chat';

export type ChatMessage = IMessage & { seen?: boolean; reaction?: number };

export type ChatResponseDto = {
  messages: ChatMessage[];
};
