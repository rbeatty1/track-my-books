import VocabListItem from "./item/vocabListItem.js";

class WordList{
    constructor(props){
        this.data = props.data;
        this.activeWord = props.active;
        this.chartsShown = props.chartsShown;

        this.render.bind(this);
        this.node = this.render();

        return this;
    }

    render(){
        
        return `<section id="vocab-word-list" class="${this.chartsShown ? 'charts-shown' : 'charts-hidden'}">
            <ul>
                ${ this.data.map(w => new VocabListItem( { data : w, active : w.word === this.activeWord}).node).join(" ") }
            </ul>
        </section>`
    }
}

export default WordList;