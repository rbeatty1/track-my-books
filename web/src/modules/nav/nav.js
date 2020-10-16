import "./nav.css";
import {properCapitalization, getTargetInfo} from "../../util/util.js";
import pubSub from "../../util/pubSub";


const buildClickEvents = event => {
    let info = getTargetInfo(event);
    if (!info.eventName) return;

    let pageData = {
        navEvent : info.eventName
    }
    info.eventName === pubSub.actions.NAVIGATION.VOCAB ? pageData.filters = null : pageData.genre = null;
    pubSub.publish(
        pubSub.actions.NAVIGATION.UPDATE, 
        pageData
    );

}

const createHTML = () => {
    let links = Object
        .keys(pubSub.actions.NAVIGATION)
        .filter( k => k !== "UPDATE")
        .map( l => l == "HOME" ? 
            `<section><h3 data-event-name="${pubSub.actions.NAVIGATION[l]}">track-my-books</h3></section>` : 
            `<a href="#" data-event-name="${pubSub.actions.NAVIGATION[l]}">${properCapitalization(l)}</a>`
        )
        .join("");
    let navContainer = document.createElement("nav");
    navContainer.innerHTML =`
    <section>
        <h3 data-event-name="${pubSub.actions.NAVIGATION.HOME}">track-my-books</h3>
    </section>
    <ul>
        <li data-event-name="${pubSub.actions.NAVIGATION.BOOKS}">Books</li>
        <li data-event-name="${pubSub.actions.NAVIGATION.VOCAB}">Vocab</li>
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