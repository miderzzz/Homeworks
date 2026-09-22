export function createUser(userName, idUser, withdrawalAmount) {
    return {
        id: crypto.randomUUID(),
        userName,
        idUser,
        withdrawalAmount,
        dateArrival: randomDate(),
    }
}

function randomDate() {
    const start = new Date(2019, 0, 1).getTime()
    const end = new Date().getTime()
    const randomTimestamp = start + Math.random() * (end - start)
    return new Date(randomTimestamp)
}