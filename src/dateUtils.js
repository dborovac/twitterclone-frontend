export function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        const options = {
            hour: 'numeric',
            minute: 'numeric'
        };
        const formatter = new Intl.DateTimeFormat(navigator.language, options);
        return `Today at ${formatter.format(date)}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
        const options = {
            hour: 'numeric',
            minute: 'numeric'
        };
        const formatter = new Intl.DateTimeFormat(navigator.language, options);
        return `Yesterday at ${formatter.format(date)}`;
    } else {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };
        const formatter = new Intl.DateTimeFormat(navigator.language, options);
        return formatter.format(date);
    }
}