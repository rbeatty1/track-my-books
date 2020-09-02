import "./bookTile.css";
import pubSub from "../../../../util/pubSub";

const createWordCountLink = book => `<button type="button" data-bid="${book.id}" data-event-name="${pubSub.actions.BOOKS.OPEN_VOCAB_PAGE}">${book.wordCount} vocabulary words.</button>`;

const createHTML = component =>{
    let data = component.state;
    let daysSpentReading =
        data.start && data.end ? `${component.getDaysSpentReading()} days to read` :
        data.start && !data.end ? "Currently Reading" : "Days spent reading unavailable.";

    let bookTileHTML = `
    <div class="book-inner-border">
        <h3>${component.getTitle()}</h3>
        <span>${data.end ? "Finished on "+data.end : "" }</span>
        <section>
            <span>${component.getAuthor()}</span>
            <span">${Number(data.pages).toLocaleString()} pg.</span>
        </section>
        <section>
            <span>${daysSpentReading}</span>
        </section>
        <section>
            <span>${data.wordCount > 0 ? createWordCountLink(data) : "No vocabulary words"}</span>
        </section>
    </div>
    `

    let bookTile = document.createElement("article");
    bookTile.classList.add(data.genre.replace(" ", "-").toLowerCase());
    bookTile.insertAdjacentHTML("afterbegin", bookTileHTML);

    return bookTile;
}

class BookTile{
    constructor(book){
        this.state = book;
        this.node = this.render();

        return this;
    }
    render(){
        let node = createHTML(this);
        return node;
    }
    getTitle(){ return this.state.title }
    getAuthor(){ return this.state.author} 
    getDaysSpentReading(){
        let startDate = new Date(this.state.start);
        let endDate = new Date(this.state.end);
        let difference = parseInt((endDate - startDate)/(24*3600*1000));
        return difference
    }

}

export default BookTile;