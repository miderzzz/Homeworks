export function createBook(bookName, isbn, author, editorial) {
    return {
        id: Date.now(),
        bookName,
        isbn,
        author,
        editorial

    }
}