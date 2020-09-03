import { properCapitalization } from "../../../../util/util.js";
import './activeVocabItem.css';

export default class ActiveVocabItem{
    constructor(data){
        this.data = data;
        this.selector = "active-word-container";

        this.node = this.render();

        return this;
    }

    render(){
        let htmlString = "";
        if (!this.data){
            htmlString = `
                <section id="${this.selector}" class="hidden">
                </section>
                `
        }
        else{
            htmlString = `
                <section id="${this.selector}">
                    <article>
                        <header>
                            <h2>${properCapitalization(this.data.word)}</h2>
                            <h4>${properCapitalization(this.data.type)}</h4>
                        </header>
                        <p>${properCapitalization(this.data.definition)}</p>
                    </article>
                    <article id="book-context" class="${this.data.genre.replace(" ", "-").toLowerCase()}">
                        <header>
                            <h2>${this.data.book}</h3>
                            <h4>${this.data.author}</h4>
                        </header>
                        <strong>${properCapitalization(this.data.genre)}</strong>
                        <p><i>"${this.data.context}"</i></p>
                    </article>
                </section>
                `
        }
        return htmlString;

    }
}