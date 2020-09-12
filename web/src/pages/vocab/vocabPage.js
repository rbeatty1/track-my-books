import {properCapitalization, refreshNode} from "../../util/util.js";
import "./vocabPage.css"
import WordList from "./components/wordList/wordList.js";
import pubSub from "../../util/pubSub.js";
import ActiveVocabItem from "./components/activeWord/activeVocabItem.js";
import { Charts, chartTypesRef } from "../../modules/charts/charts.js"
import { VocabFilters } from "./components/filters/vocabFilters.js";
import { BannerPageTypeMap, Banner } from "../../modules/banner/banner.js";

class VocabPage {
    constructor(props){
        this.filters = props || { type : "genre", value : "all" }
        this.data = null;
        this.baseApi = 'http://localhost:5000/api/v1/vocab';
        this.activeWord = null;
        this.showCharts = true;
        this.activeChart = chartTypesRef.VOCAB.VOCAB_TIME.code;
        
        this.render = this.render.bind(this);
        this.setFilterValue = this.setFilterValue.bind(this);
        this.setFilterType = this.setFilterType.bind(this);
        this.toggleCharts = this.toggleCharts.bind(this);
        this.toggleChartType = this.toggleChartType.bind(this);
        this.delegateClickEvents = this.delegateClickEvents.bind(this);
        this.delegateChangeEvents = this.delegateChangeEvents.bind(this);

        let _self = this;
        const constructorPromise = new Promise( (resolve, reject) =>{
            _self.getVocabData()
                .then( x => x.json() )
                .then( x=>{
                    _self.data = x.filter( w => w.definition !== null && w.type !== null);
                    _self.node = _self.render();
                    resolve(_self);
                });

        })

        pubSub.clearSubscriptions(pubSub.actions.VOCAB.SET_ACTIVE_WORD);
        pubSub.clearSubscriptions(pubSub.actions.VOCAB.SET_FILTER_TYPE);
        pubSub.clearSubscriptions(pubSub.actions.VOCAB.TOGGLE_CHARTS_VIEW);
        pubSub.clearSubscriptions(pubSub.actions.MISC.TOGGLE_CHART);

        pubSub.subscribe(
            pubSub.actions.VOCAB.SET_FILTER_TYPE,
            this.setFilterType
        )

        pubSub.subscribe(
            pubSub.actions.VOCAB.TOGGLE_CHARTS_VIEW,
            this.toggleCharts
        )
        pubSub.subscribe(
            pubSub.actions.MISC.TOGGLE_CHART,
            this.toggleChartType
        )

        pubSub.subscribe(
            pubSub.actions.VOCAB.SET_FILTER_VALUE,
            this.setFilterValue
        )

        return constructorPromise;
    }

    render(){ 
        let filteredWordList = this.data.filter( x =>{
            var filterProp = this.filters.type.toLowerCase();
            var filterVal = this.filters.value.toLowerCase();
    
            return (!x[filterProp] || filterVal === "all") || x[filterProp].toLowerCase() === filterVal;
        });
    
        let bannerProps = {
            pageState : {
                pageName : BannerPageTypeMap.VOCAB,
                filters : "none",
                showCharts : this.showCharts
            },
            data : {
                raw : this.data,
                filtered : filteredWordList
            }
        }
        let HTMLDefinitionString = `
            ${ new Banner( bannerProps ).node }
            <section id="main-vocab-section" class="${this.activeWord ? "active-word" : ""}">
                ${ new VocabFilters(
                    {
                        data : this.data,
                        filterInfo : this.filters,
                    }
                ).node
                }
                ${
                    new WordList(
                        { 
                            data : filteredWordList,
                            activeWord : this.activeWord,
                            chartsShown : this.showCharts
                        } 
                    ).node 
                }
            </section>
            ${new ActiveVocabItem(this.activeWord).node}
            `;
    
        let vocabPageContainer = document.createElement("div");
        vocabPageContainer.id = "vocab-page";
        vocabPageContainer.insertAdjacentHTML("afterbegin", HTMLDefinitionString)

        if(this.showCharts){
            vocabPageContainer.querySelector("#main-vocab-section").insertAdjacentElement("beforeend",
            new Charts(
                {
                    page : "VOCAB",
                    show : this.showCharts,
                    activeChart : this.activeChart,
                    activeWord : this.activeWord,
                    activeFilters : this.filters,
                    data : this.data
                }
            ).node
            )
        }
    
        vocabPageContainer.addEventListener("click", this.delegateClickEvents );
        vocabPageContainer.addEventListener("change", this.delegateChangeEvents );
        return vocabPageContainer; 
    }

    getVocabData(){
        let apiURL = this.filters ?
            this.baseApi += `?action=SELECT&${this.filters.type}=${this.filters.value}` :
            this.baseApi;

        return fetch(apiURL)        
    }

    setFilterType(filterType){
        this.filters.type = filterType
        this.filters.value = "all";
        if(filterType == "book"){
            this.activeChart = chartTypesRef.VOCAB.VOCAB_GROUP.code;
        }
        else{
            this.activeChart == chartTypesRef.VOCAB.VOCAB_TIME.code;
        }
        refreshNode(this);
    }

    setFilterValue(filterValue){
        this.filters.value = filterValue;
        if(filterValue !== "all" && this.activeWord && this.activeWord[this.filters.type] !== filterValue){
            this.activeWord = null;
        }
        refreshNode(this);
    }

    toggleCharts(showCharts){
        this.showCharts = showCharts;
        refreshNode(this);
    }

    toggleChartType(chartTypeCode){
        this.activeChart = this.activeChart == chartTypeCode ? null : parseInt(chartTypeCode, 10);
        refreshNode(this);
    }

    delegateClickEvents(e){
        let target = e.target
        let eventName = target.dataset.eventName || target.parentNode && target.parentNode.dataset.eventName;

        if (!eventName) return;

        if (eventName === pubSub.actions.VOCAB.SET_FILTER_VALUE){
            this.setFilterValue(target.value);
        }

        if (eventName === pubSub.actions.VOCAB.TOGGLE_ACTIVE_WORD){
            let activeWord = this.data.find( w => w.id == target.dataset.wordId);
            if (!activeWord) return;
            this.activeWord = this.activeWord && this.activeWord.id === activeWord.id ? null : activeWord;
            refreshNode(this);
        }

        if (eventName === pubSub.actions.VOCAB.TOGGLE_CHARTS_VIEW){
            const chartState = {
                SHOW : 0,
                HIDE : 1
            }
            var showCharts = target.dataset.chartState != chartState.SHOW
            pubSub.publish(
                pubSub.actions.VOCAB.TOGGLE_CHARTS_VIEW,
                showCharts
            )
        }

        if (eventName === pubSub.actions.VOCAB.TOGGLE_CHARTS_TYPE){
            pubSub.publish(
                pubSub.actions.VOCAB.TOGGLE_CHARTS_VIEW,
                target.dataset.chartType
            )
        }
    }

    delegateChangeEvents(e){
        let target = e.target
        let eventName = target.dataset.eventName || target.parentNode.dataset.eventName;
    
        if (!eventName) return;
    
        if (eventName === pubSub.actions.VOCAB.SET_FILTER_TYPE){
            this.setFilterType(target.value);
        }

    }
}

export {
    VocabPage as VocabPage
}