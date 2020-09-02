import './homePage.css'
import pubSub from '../../util/pubSub';

class HomePage{
    constructor(){
        this.sections = {
            VOCAB: {
                title : "Vocabulary",
                desc : [
                    "A list of vocabulary words I've stumbled upon while reading on my Kindle Paperwhite.",
                    "I've leveraged my Kindle's internal SQLite database to pull the stored vocabulary words, along with some context about my encounter with them, and then run them through a Dictionary API to get additional information.",
                    "Take a look at what words I've come across that I've needed to look up, and visualize some trends about them."
                ]
            },
            BOOKS : {
                title : "Books",
                desc : [
                    "Take a look at all the books (since I've started to track them, that is!) I've read!",
                    "The information displayed is a combination of data stored on my Kindle Paperwhite and on my Goodreads page.",
                    "<strong>Coming Soon :</strong> Data visualizations!"
                ]
            }
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
                    <button type='button' data-event-name="${pubSub.actions.NAVIGATION[s]}">
                        <h3>${sectionInfo.title}</h3>
                        ${sectionInfo.desc.map( d => {
                            var p = document.createElement('p');
                            p.innerHTML = d;
                            return p.outerHTML
                        }).join("")}
                    </button>
                `
            }).join("")
        }
        var container = document.createElement("div")
        container.id = "home-page";
        var HTMLstring = `
            <header>
                <h1>TrackMyBooks</h1>
                <p>This is an application to play around with some data I created to track my reading habits and create some data visualizations in the process. Click a button below to navigate to a section and begin!</p>
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
        var page = e.target.dataset.eventName || e.target.parentNode && e.target.parentNode.dataset.eventName;

        if (!page) return;

        pubSub.publish(
            pubSub.actions.NAVIGATION.UPDATE,
            { navEvent : page}
        );
    }
}


export {
    HomePage
}