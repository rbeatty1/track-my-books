import pubSub from "./util/pubSub";
import { NavBar } from "./modules/nav/nav.js";
import { HomePage } from "./pages/home/homePage.js";
import { VocabPage } from "./pages/vocab/vocabPage.js";
import { BooksPage } from "./pages/books/booksPage.js";

class Router{
    constructor(){
        // page change events;
        pubSub.subscribe(
            pubSub.actions.NAVIGATION.UPDATE,
            this.updatePage.bind(this)
        );

        this.routes = {
            "#" : pubSub.actions.NAVIGATION.HOME,
            "#home" : pubSub.actions.NAVIGATION.HOME,
            "#vocab" : pubSub.actions.NAVIGATION.VOCAB,
            "#books" : pubSub.actions.NAVIGATION.BOOKS
        };

        this.getPageFromURL = this.getPageFromURL.bind(this);
        return this;
    }

    updatePage(props){
        const app = document.getElementById("app");
        while(app.firstChild) app.removeChild(app.firstChild);
        let nav = new NavBar().node;


        switch(props.navEvent){
            case pubSub.actions.NAVIGATION.VOCAB:
                app.insertAdjacentElement("afterbegin", nav);
                new VocabPage(props.filters).then( x =>{ app.appendChild(x.node); })
                break;
            case pubSub.actions.NAVIGATION.BOOKS:
                app.insertAdjacentElement("afterbegin", nav);
                new BooksPage(props.genre).then( x=> app.appendChild(x.node) )
                break;
            default:
                app.appendChild(new HomePage().node);
                break;
        }
    }

    getPageFromURL(){
        let pageName = window.location.hash;
        this.updatePage( { navEvent : this.routes[pageName] })
    }
}

let SPARouter = new Router();

export default SPARouter;