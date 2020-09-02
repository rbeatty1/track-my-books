import pubSub from "../../../../util/pubSub.js";
import "./vocabFilters.css";
import { properCapitalization } from "../../../../util/util.js";

class VocabFilters{
    constructor(props){
        this.data = props.data;
        this.filterType = props.filterInfo.type;
        this.activeFilterValue = props.filterInfo.value;

        this.filterTypeMap = {
            GENRE : {
                label : "Genre",
                prop : "genre"
            },
            BOOK : {
                label : "Book",
                prop : "book"
            },
            TYPE : {
                label : "Word Type",
                prop : "type"
            }
        };

        this.render = this.render.bind(this);

        this.node = this.render();

        return this;
    }
    render(){
        const createFilterTypeOptionHtml = filter => ` <option value="${filter.prop}" ${this.filterType === filter.prop ? "selected" : ""}> ${filter.label} </option>`

        const createFilterButtons = filterGroup => `<li> <button data-event-name="${pubSub.actions.VOCAB.SET_FILTER_VALUE}" type="button" value="${filterGroup.label}" class="${ this.activeFilterValue === filterGroup.label ? "active" : "" }" > ${properCapitalization(filterGroup.label)} (${filterGroup.count}) </button> </li>`


        var groupedData = this.groupDataByFilterType();

        return `<aside id="vocab-filters">
            <select data-event-name="${pubSub.actions.VOCAB.SET_FILTER_TYPE}">
                ${Object.values(this.filterTypeMap).map( createFilterTypeOptionHtml ).join("")}
            </select>
            <ul>
                <li><button data-event-name="${pubSub.actions.VOCAB.SET_FILTER_VALUE}" type="button" class="${this.activeFilterValue === "all" ? "active" : ""}" value="all">All (${this.data.length || 0}) </button> </li>
                ${groupedData.map( createFilterButtons ).join("")}
            </ul>
        </aside>`
    }
    groupDataByFilterType(){
        let groupedVocab = []
        let prop = this.filterType || "genre";

        this.data.map(word=>{
            let groupingValue = word[prop]
            let group = groupedVocab.find( g => g.label === groupingValue);
            if (!group){
                groupedVocab.push(
                    {
                        label : groupingValue,
                        count : 1
                    }
                );
            }
            else { group.count ++ }
        });
        return groupedVocab.sort( (a, b)=> a.label > b.label ); 
    }
}

export {
    VocabFilters
}