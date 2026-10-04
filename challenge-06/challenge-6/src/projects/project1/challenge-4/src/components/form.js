import { useState } from "react"
import { createBook } from "../class/libro"

export function Form({ onAddBook }) {

    const [book, setBook] = useState({ bookName: "", isbn: "", author: "", editorial: "" })

    const handleSubmit = (e) => {
        e.preventDefault();
        const newBook = createBook(book.bookName, book.isbn, book.author, book.editorial);
        onAddBook(newBook);
        setBook({ bookName: "", isbn: "", author: "", editorial: "" });
    }

    return (
        <form onSubmit={handleSubmit}>

            <input
                value={book.bookName}
                onChange={(e) => setBook({ ...book, bookName: e.target.value })}
                placeholder="Nombre del Libro" />
            <input
                value={book.isbn}
                onChange={(e) => setBook({ ...book, isbn: e.target.value })}
                placeholder="ISBN del Libro" />
            <input
                value={book.author}
                onChange={(e) => setBook({ ...book, author: e.target.value })}
                placeholder="Autor del Libro" />
            <input
                value={book.editorial}
                onChange={(e) => setBook({ ...book, editorial: e.target.value })}
                placeholder="Editorial del Libro" />

            <button type="submit"> Agregar al usuario </button>
        </form>
    )

}