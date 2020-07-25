module.exports = (array) => {
    let randomFromArray = array[Math.floor(Math.random() * array.length)];
    return randomFromArray
}