function calculateTimeAgo(date) {
    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - date.getTime();

    const seconds = Math.floor(differenceInTime / 1000);
    if (seconds < 60) {
        return `${seconds} seconds ago`;
    }

    const minutes = Math.floor(differenceInTime / (1000 * 60));
    if (minutes < 60) {
        return `${minutes} minutes ago`;
    }

    const hours = Math.floor(differenceInTime / (1000 * 3600));
    if (hours < 24) {
        return `${hours} hours ago`;
    }

    const days = Math.floor(differenceInTime / (1000 * 3600 * 24));
    if (days < 7) {
        return `${days} days ago`;
    }

    const weeks = Math.floor(differenceInTime / (1000 * 3600 * 24 * 7));
    if (weeks < 4) {
        return `${weeks} weeks ago`;
    }

    const months = Math.floor(differenceInTime / (1000 * 3600 * 24 * 30));
    if (months < 12) {
        return `${months} months ago`;
    }

    const years = Math.floor(differenceInTime / (1000 * 3600 * 24 * 365));
    return `${years} years ago`;
}