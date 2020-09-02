import { properCapitalization } from "../../../../../util/util.js";
import "./vocabListItem.css";
import pubSub from "../../../../../util/pubSub.js";

const clearAllActiveWords = () => {
    let activeWords =  document.querySelectorAll(".vocab-list-item.active") ;
    for ( let word of activeWords) word.classList.remove( "active" );
}
class VocabListItem {
    constructor( props ) {
        this.data = props.data
        this.active = props.active;

        this.getData = this.getData.bind(this);
        this.createHTMLString = this.createHTMLString.bind(this);
        this.toggleActiveState = this.toggleActiveState.bind(this);

        pubSub.subscribe(pubSub.actions.VOCAB.TOGGLE_ACTIVE_WORD, this.toggleActiveState);


        this.node = this.createHTMLString();

        return this
     }


     getData(){ return this.data; }

     createHTMLString(){
         let classList = this.active ? "vocab-list-item active" : "vocab-list-item";
         return `<li class="${classList}" data-word-id="${this.data.id}" data-event-name="${pubSub.actions.VOCAB.TOGGLE_ACTIVE_WORD}">${properCapitalization(this.data.word)}</li>`
     }

     toggleActiveState(target){
         if (target.dataset.wordId != this.data.id) return;
         this.active = this.active ? false : true;
         
         if (this.active) pubSub.publish(pubSub.actions.VOCAB.SET_ACTIVE_WORD, this.data)
         clearAllActiveWords();

        document.querySelector(`li[data-word-id="${this.data.id}"]`).outerHTML = this.createHTMLString();

        
     }
}

export default VocabListItem;