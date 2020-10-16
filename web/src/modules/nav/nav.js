import "./nav.css";
import {properCapitalization, getTargetInfo} from "../../util/util.js";
import pubSub from "../../util/pubSub";
import SPARouter from "../../router";


const buildClickEvents = event => {
    let info = getTargetInfo(event);
    if (!info.eventName) return;

    let page = info.target.dataset.pageName;
    history.pushState(
        { page : page },
        `Navigation to ${page.slice(1)} page via navigation bar`,
        page
    )
    SPARouter.getPageFromURL();
}

const createHTML = () => {
    let navContainer = document.createElement("nav");
    navContainer.innerHTML =`
    <section>
        <h3 data-page-name="#home" data-event-name="${pubSub.actions.NAVIGATION.HOME}">track-my-books</h3>
    </section>
    <ul>
        <li data-page-name="#books" data-event-name="${pubSub.actions.NAVIGATION.BOOKS}">Books</li>
        <li data-page-name="#vocab" data-event-name="${pubSub.actions.NAVIGATION.VOCAB}">Vocab</li>
    </ul>`
    return navContainer;
}

class NavBar{
    constructor(){

        this.render = this.render.bind(this);
        this.node = this.render();

        this.node.addEventListener("click", buildClickEvents);

        return this;
    }

    render(){
        return createHTML();
    }
}

export {
    NavBar
};