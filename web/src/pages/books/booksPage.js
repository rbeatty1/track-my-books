import "./booksPage.css";
import {getTargetInfo, properCapitalization, refreshNode} from "../../util/util.js"
import BookTile from "./components/tiles/bookTile.js";
import pubSub from "../../util/pubSub";
import { Banner, BannerPageTypeMap } from "../../modules/banner/banner";


const createHTML = component =>{
    let books = component.data;
    let filteredBooks = books.filter( x => component.genre == "All" || x.genre === component.genre)
    let bannerProps = { 
        pageState : {
            pageName : BannerPageTypeMap.BOOKS,
            filters : {
                genre : component.genre 
            }
        },
        data : { 
            filtered : filteredBooks,
            raw : component.data
        } 
    }

    let bookTiles = filteredBooks.map( x => new BookTile(x).node.outerHTML).join("");
    let booksPage = `${new Banner( bannerProps ).node}
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
        this.genre = props || "All";
        let _self = this;
        
        this.render = this.render.bind(this);
        this.getBooksData = this.getBooksData.bind(this);
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
        return fetch(this.api)        
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
        if (info.eventName === pubSub.actions.BOOKS.CHANGE_FILTER){ 
            this.genre = info.target.value;
            refreshNode(this);
        }
    }



}
export {
    BooksPage
};