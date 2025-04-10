export interface Conversation {
    id: string;
    username: string;
    avatar: string;
}

export interface Message {
    id: string | number;
    senderId: string;
    receiverId: string | number;
    text: string;
    time: string;
    isMe: boolean;
    status?: 'SENT' | 'DELIVERED' | 'READ';
}

export interface Recipient {
    username: string;
    avatar?: string;
}
