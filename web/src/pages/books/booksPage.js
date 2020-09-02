import "./booksPage.css";
import {getTargetInfo, properCapitalization, refreshNode} from "../../util/util.js"
import BookTile from "./components/tiles/bookTile.js";
import pubSub from "../../util/pubSub";

/*
    Function: isBookRead(book)
        @desc: Function to check whether a particular book has been completed
            -- Completed = has end date
        @param:
            - Book: Data object that contains properties pertaining to an individual book
        @return: boolean
            - true = book data object has end date property that does not equal null or undefined
            - false = book data object does not have end date property
*/
const isBookRead = book => (!book.start && !book.end) || book.start && book.end
/*
    Function: sumPagesRead(accumulator, book)
        @desc: Callback function used in collaboration with Array.reduce() to calculate the number of pages read
        @param:
            - Accumulator: Integer that collects number of pages read
            - Book: Book data object that contains data properties pertaining to an individual book
        @return: Number
            - Calculated value of accumulator + pages (integer) data property from books data object
*/
const sumPagesRead = (accumulator, book) => accumulator + book.pages

const vocabWordCount = (accumulator, book) => book.wordCount > 0 ? accumulator + book.wordCount : accumulator;

const isBookInProgress = book => book.start && !book.end

const getBookGenres = (accumulator, book) =>{
    if (accumulator.indexOf(book.genre) === -1) accumulator.push(book.genre)
    return accumulator
};


const createHTML = component =>{
    const buildGenreSelectOptions = bookGenres => {
        let genresOptions = bookGenres.map(genre=> `<option value="${genre}" ${component.genre === genre ? "selected" : ""}>${properCapitalization(genre)}</option>`)
        genresOptions.unshift( `<option ${!component.genre ? "selected" : ""}>All</option>` )
        return genresOptions.join("");
    }
    let books = component.data;
    let filteredBooks = books.filter( x => !component.genre || x.genre === component.genre)
    //filter books to read
    const finishedBooks = filteredBooks.filter(isBookRead);
    const booksInProgress = filteredBooks.filter(isBookInProgress);
    // calculate pages read
    const pagesRead = finishedBooks.reduce(sumPagesRead, 0)
    const vocabWords = filteredBooks.reduce(vocabWordCount, 0);
    // get book genres
    const bookGenres = books.reduce(getBookGenres, [])

    let bannerProps = {
        finishedBooks: finishedBooks.length,
        inProgressBooks:booksInProgress.length,
        pagesRead: pagesRead.toLocaleString(),
        vocabWords: vocabWords,
        bookGenres: bookGenres
    }

    let bookTiles = filteredBooks.map( x => new BookTile(x).node.outerHTML).join("");
    let booksPage = `
    <section id="books-banner-section">
        <div>
            <h3>Books Finished: </h3>
            <h4>${bannerProps.finishedBooks}</h4>
        </div>
        <div>
            <h3>Pages Read: </h3>
            <h4>${bannerProps.pagesRead}</h4>
        </div>
        <div>
            <h3>Vocabulary Words: </h3>
            <h4>${bannerProps.vocabWords}</h4>
        </div>
        <div>
            <select id="books-genre-select" data-event-name="${pubSub.actions.BOOKS.CHANGE_FILTER}" >
                ${buildGenreSelectOptions(bannerProps.bookGenres)}
            </select>
        </div>
    </section>
    <section id="books-tile-section">
        ${bookTiles}
    </section>
    `

    let booksPageContainer = document.createElement("div");
    booksPageContainer.id = "books-page";
    booksPageContainer.insertAdjacentHTML("afterbegin", booksPage)

    return booksPageContainer;

};
class BooksPage {
    constructor(props){
        this.api = "http://localhost:5000/api/v1/books";
        this.genre = props;
        let _self = this;
        
        this.render = this.render.bind(this);
        this.getBooksData = this.getBooksData.bind(this);
        this.filterBooksByGenre = this.filterBooksByGenre.bind(this);
        this.changeEventDelegation = this.changeEventDelegation.bind(this);
        this.clickEventDelegation = this.clickEventDelegation.bind(_self);
        

        return new Promise( (resolve, reject)=>{
            this.getBooksData()
            .then( x => x.json() )
            .then( books =>{
                _self.data = books;
                _self.node = _self.render();
                resolve(_self);
            })
        });

    }

    render(){
        let node = createHTML(this);
        node.addEventListener("change", this.changeEventDelegation)
        node.addEventListener("click", this.clickEventDelegation)
        return node;

    }

    getBooksData(){
        return fetch(this.genre ? `${this.api}?genre=${this.genre}` : this.api)        
    }
    
    filterBooksByGenre(value){
        let _self = this;
        _self.genre = value === "All" ? null : value;
        refreshNode(_self);
    }

    clickEventDelegation(e){
        let info = getTargetInfo(e);
        let _self = this;

        if (!info.eventName) return;
        if (info.eventName === pubSub.actions.BOOKS.OPEN_VOCAB_PAGE){
            let id = info.target.dataset.bid;
            let book = _self.data.filter( x=> x.id === id);
            if (book.length > 0){
                let title = book[0].title;
                let vocabFilter = {type : "book", value : title.toLowerCase()}
                let navProps = {
                    navEvent : pubSub.actions.NAVIGATION.VOCAB,
                    filters : vocabFilter
                };

                pubSub.publish(
                    pubSub.actions.NAVIGATION.UPDATE, 
                    navProps
                );
            }
        }
    }

    changeEventDelegation(e){
        const info = getTargetInfo(e)
        
        if (!info.eventName) return;
        if (info.eventName === pubSub.actions.BOOKS.CHANGE_FILTER){ this.filterBooksByGenre(info.target.value) }
    }



}
export {
    BooksPage
};