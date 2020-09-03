import "./booksPage.css";
import {getTargetInfo, refreshNode} from "../../util/util.js"
import pubSub from "../../util/pubSub";
import { Banner, BannerPageTypeMap } from "../../modules/banner/banner";
import { BookTileSection } from "./components/bookTileSection";

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
        let filteredBooks = this.data.filter( x => this.genre == "All" || x.genre === this.genre)
        let bannerProps = { 
            pageState : {
                pageName : BannerPageTypeMap.BOOKS,
                filters : {
                    genre : this.genre 
                }
            },
            data : { 
                filtered : filteredBooks,
                raw : this.data
            } 
        };
    
        let booksPage = `
        ${new Banner( bannerProps ).node}
        ${new BookTileSection( { data : filteredBooks } ).node}
        `
    
        let booksPageContainer = document.createElement("div");
        booksPageContainer.id = "books-page";
        booksPageContainer.insertAdjacentHTML("afterbegin", booksPage)
    
        booksPageContainer.addEventListener("change", this.changeEventDelegation)
        booksPageContainer.addEventListener("click", this.clickEventDelegation)
        return booksPageContainer;

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
            let book = _self.data.find( x=> x.id === id);
            if (book){
                let title = book.title;
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