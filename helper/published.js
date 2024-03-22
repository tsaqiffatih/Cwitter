function published(createdAt) {
    let date = new Date(createdAt);
    let today = new Date();

    let minutes = Math.floor((today - date) / 60000);
    let h = Math.floor(minutes / 60);
    let m = minutes % 60;
    if (h > 0) {
        return `${h} hours ago`
    } else {
        return `${m} minutes ago`
    }
}

module.exports = published;