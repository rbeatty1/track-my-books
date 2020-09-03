import './banner.css';
import pubSub from '../../util/pubSub';

const pageBannerTypeMap = {
    BOOKS : "books",
    VOCAB : "vocab"
};

class Banner{
    constructor(props){
        this.pageState = props.pageState;
        this.data = props.data;


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

            return `${createSummaryInfoSection()}${createBookGenreFilter(this.pageState.filters)}`
        }

        const createVocabBannerHtml = () =>{
            let calcAvgWrdLength = this.data.filtered.reduce((sum, wordData) => sum + wordData.word.length, 0) / this.data.filtered.length
        
            return `
                <ul>
                    <li>
                        <strong>Vocabulary Word Count</strong> : ${this.data.filtered.length}
                    </li>
                    <li>
                        <strong>Average Word Length</strong> : ${Math.floor(calcAvgWrdLength)}
                    </li>
                </ul>
            </header>`
        
        }

        let bannerId = this.pageState.pageName === pageBannerTypeMap.BOOKS ? "books-page-banner" : 
            this.pageState.pageName === pageBannerTypeMap.VOCAB ? "vocab-page-banner" :
            "";
        let bannerInnerHTML = this.pageState.pageName === pageBannerTypeMap.BOOKS ? createBooksBannerHtml() : 
            this.pageState.pageName === pageBannerTypeMap.VOCAB ? createVocabBannerHtml() :
            "";

        return `<header class="page-banner" id="${bannerId}">${bannerInnerHTML}</header>`
    }
}

export {
    Banner,
    pageBannerTypeMap as BannerPageTypeMap
}


