import BookTile from './tiles/bookTile.js';
import './bookTileSection.css';

class BookTileSection{
    constructor(props){
        this.data = props.data;

        this.render = this.render.bind(this);
        this.node = this.render();

        return this;
    }
    render(){
        return `
            <section id="books-tile-section">
                ${ this.data.map( b => new BookTile( { data : b } ).node).join("") }
            </section>
        `
    }
}

export {
    BookTileSection
}