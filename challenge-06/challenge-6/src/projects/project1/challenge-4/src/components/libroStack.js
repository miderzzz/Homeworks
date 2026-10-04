export function BookStack({ books }) {
    const colors = ["colorbook1", "colorbook2", "colorbook3"];

    return (
        <div className="stack-container">
            {books.map((book, index) => (
                <div key={book.id} className={"libro-card " + colors[index % 3]}>
                    <p className="bookname">{book.bookName}</p>
                    <p className="author">{book.author}</p>
                </div>
            ))}
        </div>
    )
}

