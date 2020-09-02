import './banner.css';
import { properCapitalization } from '../../util/util';
import pubSub from '../../util/pubSub';

const pageBannerTypeMap = {
    BOOKS : "books",
    VOCAB : "vocab"
};

class Banner{
    constructor(props){
        this.activePage = props.page;
        this.data = props.data;
        this.filters = props.filters;


        this.render = this.render.bind(this);

        this.node = this.render();

        return this;
    }

    render(){
        const createBooksBannerHtml = () =>{
            // HTML helpers
            const createSummaryInfoSection = ()=>{
                let infoContainer = document.createElement("ul");
                infoContainer.innerHTML = `
                    <li>
                        <strong>Books Finished</strong> : ${finishedBooks.length > 0 ? finishedBooks.length.toLocaleString() : 0}
                    </li>
                    <li>
                        <strong>Pages Read </strong> : ${pagesRead ? pagesRead.toLocaleString() : 0}
                    </li>
                    <li>
                        <strong>Vocab Words Encountered</strong> : ${vocabWords > 0 ? vocabWords.toLocaleString() : 0}
                    </li>
                `

                return infoContainer.outerHTML;
            }
            const createBookGenreFilter = filters =>{
                return `
                <select data-event-name="${pubSub.actions.BOOKS.CHANGE_FILTER}">
                    <option value="All" ${filters.genre && filters.genre == "all" ? "selected" : ""}>All</option>
                    ${ bookGenres.map( g => `<option value="${g}" ${filters.genre && filters.genre == g ? "selected" : ""}>${g}</option>`)}
                </select>`;
            }

            // data helpers
            const isBookRead = book => (!book.start && !book.end) || book.start && book.end
            const isBookInProgress = book => book.start && !book.end
            const sumPagesRead = (accumulator, book) => accumulator + book.pages
            const vocabWordCount = (accumulator, book) => book.wordCount > 0 ? accumulator + book.wordCount : accumulator;
            const getBookGenres = (accumulator, book) => {
                if (accumulator.indexOf(book.genre) === -1) accumulator.push(book.genre)
                return accumulator
            };
            
            //filter books to read
            const filteredBooks = this.data.filtered;
            const allBooks = this.data.raw;

            const finishedBooks = filteredBooks.filter( isBookRead );
            const booksInProgress = filteredBooks.filter( isBookInProgress );
            // calculate pages read
            const pagesRead = finishedBooks.reduce(sumPagesRead, 0)
            const vocabWords = filteredBooks.reduce(vocabWordCount, 0);
            // get book genres
            const bookGenres = allBooks.reduce(getBookGenres, []).sort()

            return `${createSummaryInfoSection()}${createBookGenreFilter(this.filters)}`
        }

        const createVocabBannerHtml = () =>{
            const createSummaryInfoSection = () => {}
        }

        var banner = document.createElement("header");

        banner.id = this.activePage === pageBannerTypeMap.BOOKS ? "books-page-banner" : "vocab-page-banner";
        banner.innerHTML = this.activePage === pageBannerTypeMap.BOOKS ? createBooksBannerHtml() : createVocabBannerHtml();

        return banner.outerHTML;
    }
}

export {
    Banner,
    pageBannerTypeMap as BannerPageTypeMap
}


