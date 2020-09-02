import { properCapitalization } from "../../../../util/util.js";
// import pubSub from "../../util/pubSub.js";
import './activeVocabItem.css';
import pubSub from "../../../../util/pubSub.js";

export default class ActiveVocabItem{
    constructor(data){
        this.data = data;
        this.selector = "active-word-container";

        this.updateActiveWord = this.updateActiveWord.bind(this);

        pubSub.clearSubscriptions(pubSub.actions.VOCAB.SET_ACTIVE_WORD);
        pubSub.subscribe(pubSub.actions.VOCAB.SET_ACTIVE_WORD, this.updateActiveWord);
        this.node = this.createHTMLString();

        return this;
    }

    createHTMLString(){
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

    updateActiveWord(activeWord){
        this.data = activeWord;
        document.getElementById(this.selector).outerHTML = this.createHTMLString();
    }
}