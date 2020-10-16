import './homePage.css'
import * as i from '@primer/octicons';
import SPARouter from '../../router';

class HomePage{
    constructor(){
        this.sections = {
            BOOKS : {
                title : "Books",
                desc : [
                    "Take a look at all the books (since I've started to track them, that is!) I've read!",
                    "The information displayed is a combination of data stored on my Kindle Paperwhite and on my Goodreads page.",
                    "<strong>Coming Soon :</strong> Data visualizations!"
                ]
            },
            VOCAB: {
                title : "Vocabulary",
                desc : [
                    "A list of vocabulary words I've stumbled upon while reading on my Kindle Paperwhite.",
                    "I've leveraged my Kindle's internal SQLite database to pull the stored vocabulary words, along with some context about my encounter with them, and then run them through a Dictionary API to get additional information.",
                    "Take a look at what words I've come across that I've needed to look up, and visualize some trends about them."
                ]
            },
        }
        
        this.render = this.render.bind(this);
        this.navToSection = this.navToSection.bind(this);

        this.node = this.render();
    }

    render(){
        function createSectionBtns(sections){
            return Object.keys(sections).map( s =>{
                var sectionInfo = sections[s]
                return `
                    <button type='button' data-page-name="#${s.toLowerCase()}">
                        <h3>${sectionInfo.title}</h3>
                        ${s == 'VOCAB' ? i.checklist.toSVG( { width : 75, height : 75}) : i.book.toSVG( { width : 75, height : 75}) }
                    </button>
                `
            }).join("")
        }
        var container = document.createElement("div")
        container.id = "home-page";
        var HTMLstring = `
            <header>
                <h1>track-my-books</h1>
            </header>
            <section>
            ${createSectionBtns(this.sections)}
            </section>
        `

        container.addEventListener("click", this.navToSection)

        container.innerHTML = HTMLstring;
        return container;
    }

    navToSection(e){
        var page = e.target.dataset.pageName || e.target.parentNode && e.target.parentNode.dataset.pageName;

        if (!page) return;

        history.pushState(
            { page : page },
            `Navigation to ${page.slice(1)} page from home screen`,
            page
        )
        SPARouter.getPageFromURL()
    }
}


export {
    HomePage
}