export interface Conversation {
    id: number;
    name: string;
    avatar: string;
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