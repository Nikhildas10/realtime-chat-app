export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    // Helper to check if two dates are the same day
    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    // If it's today, return "Today"
    if (isSameDay(date, now)) {
        return 'Today';
    }

    // If it's yesterday, return "Yesterday"
    if (isSameDay(date, yesterday)) {
        return 'Yesterday';
    }

    // For other dates, return formatted date
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

export const formatMessageTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

export const groupMessagesByDate = (messages: any[]) => {
    const groups = messages.reduce((acc, message) => {
        const date = new Date(message.createdAt);
        const dateStr = formatDate(date.toISOString());
        
        if (!acc[dateStr]) {
            acc[dateStr] = [];
        }
        acc[dateStr].push({
            ...message,
            time: formatMessageTime(message.createdAt)
        });
        
        return acc;
    }, {});

    return Object.entries(groups).map(([date, messages]) => ({
        date,
        messages
    }));
};
