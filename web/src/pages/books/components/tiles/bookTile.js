import "./bookTile.css";
import pubSub from "../../../../util/pubSub";

class BookTile {
    constructor(props) {
        this.data = props.data;
        this.node = this.render();

        return this;
    }
    render() {
        const createWordCountLink = () => `<button type="button" data-bid="${ this.data.id }" data-event-name="${ pubSub.actions.BOOKS.OPEN_VOCAB_PAGE }">${ this.data.wordCount } vocabulary words.</button>`;
        const formatDate = date => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let dateObj = new Date( date );
            return `${ months[dateObj.getMonth()] } ${ dateObj.getDate() }, ${ dateObj.getFullYear() }`
        }
        let daysSpentReading =
            this.data.start && this.data.end ? `${ this.getDaysSpentReading() } days to read` :
            this.data.start && !this.data.end ? "Currently Reading" : "Days spent reading unavailable.";

        return `
        <article class="${ this.data.genre.replace(" ", "-").toLowerCase() }">
            <div class="book-inner-border">
                <h3>${ this.getTitle() }</h3>
                <section>
                    <strong>${ this.getAuthor() }</strong>
                    <span">${ this.data.pages ? `${ Number( this.data.pages ).toLocaleString() } pg.` : "Pages unavailable" }</span>
                </section>
                <section>
                    <span>${ this.data.end ? `Finished on ${ formatDate( this.data.end ) }` : "Not Finished" }</span>
                    <span>${ daysSpentReading }</span>
                </section>
                <section>
                    <span>${ this.data.wordCount > 0 ? createWordCountLink() : "No vocabulary words" }</span>
                    <span>${ this.data.start && this.data.end && this.data.pages ? `${ Math.ceil( this.data.pages / this.getDaysSpentReading() ) } pg/day` : "" }</span>
                </section>
            </div>
        </article>
    `;
    }
    getTitle() {
        return this.data.title
    }
    getAuthor() {
        return this.data.author
    }
    getDaysSpentReading() {
        let startDate = new Date( this.data.start );
        let endDate = new Date( this.data.end );
        let difference = parseInt( ( endDate - startDate ) / ( 24 * 3600 * 1000 ), 10 );
        return difference
    }

}

export default BookTile;