export interface Conversation {
    id: string;
    username: string;
    avatar: string;
}

export interface Message {
    id: number;
    senderId: string | number;
    receiverId: string | number;
    text: string;
    time: string;
    isMe: boolean;
    status?: "SENT" | "DELIVERED" | "READ";
}