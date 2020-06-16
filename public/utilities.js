export const saveToLocal = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
}

export const getFromLocal = (key) => {
    return JSON.parse(localStorage.getItem(key))
}