// lib/chat-mocks.ts
export interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  status?: "online" | "offline" | "away";
}

export interface Message {
  id: number;
  senderId: string | number;
  receiverId: string | number;
  text: string;
  time: string;
  isMe: boolean;
  status?: "sent" | "delivered" | "read";
}

// Mock data for conversations
export const mockConversations:Conversation[] = [
  {
    id: 1,
    name: "John Doe",
    lastMessage: "Hey, how are you?",
    time: "10:30 AM",
    unread: 2,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Jane Smith",
    lastMessage: "Can we meet tomorrow?",
    time: "Yesterday",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Team Chat",
    lastMessage: "Alice: Let's discuss the project",
    time: "Yesterday",
    unread: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "David Wilson",
    lastMessage: "Thanks for your help!",
    time: "Monday",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Sarah Johnson",
    lastMessage: "The meeting is scheduled for 3 PM",
    time: "Monday",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

// Mock data for messages
export const mockMessages:Message[] = [
  {
    id: 1,
    senderId: 1,
    receiverId: 2,
    text: "Hey, how are you?",
    time: "10:30 AM",
    isMe: false,
  },
    {
        id: 2,
        senderId: 2,
        receiverId: 1,
        text: "I'm good, thanks!",
        time: "10:31 AM",
        status: "sent",
        isMe: true,
    },
//   {
//     id: 3,
//     senderId: 1,
//     receiverId: 2,
//     text: "Doing well. Are you free to meet tomorrow?",
//     time: "10:33 AM",
//     isMe: false,
//   },
//   {
//     id: 4,
//     senderId: 8,
//     receiverId: 2,
//     text: "Yes, I'm available in the afternoon. What time works for you?",
//     time: "10:35 AM",
//     isMe: true,
//   },
//   {
//     id: 5,
//     senderId: 8,
//     receiverId: 2,
//     text: "How about 3 PM?",
//     time: "10:36 AM",
//     isMe: false,
//   },
//   {
//     id: 1,
//     senderId: 2,
//     receiverId: 1,
//     text: "Hey, how are you?",
//     time: "10:30 AM",
//     isMe: false,
//   },
//   {
//     id: 3,
//     senderId: 2,
//     receiverId: 1,
//     text: "Doing well. Are you free to meet tomorrow?",
//     time: "10:33 AM",
//     isMe: false,
//   },
//   {
//     id: 4,
//     senderId: "me",
//     receiverId: 2,
//     text: "Yes, I'm available in the afternoon. What time works for you?",
//     time: "10:35 AM",
//     isMe: true,
//   },
//   {
//     id: 5,
//     senderId: 2,
//     receiverId: 1,
//     text: "How about 4 PM?",
//     time: "10:36 AM",
//     isMe: false,
//   },
];
