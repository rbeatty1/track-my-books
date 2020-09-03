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
        this.active = null;
        this.showCharts = false;
        this.activeChart = chartTypesRef.VOCAB.VOCAB_TIME;
        
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
        pubSub.clearSubscriptions(pubSub.actions.VOCAB.SET_FILTER_VALUE);
        pubSub.clearSubscriptions(pubSub.actions.VOCAB.TOGGLE_CHARTS_VIEW);
        pubSub.clearSubscriptions(pubSub.actions.VOCAB.TOGGLE_CHART_TYPE);

        pubSub.subscribe(
            pubSub.actions.VOCAB.SET_FILTER_TYPE,
            this.setFilterType
        )

        pubSub.subscribe(
            pubSub.actions.VOCAB.SET_FILTER_VALUE,
            this.setFilterValue
        )
        pubSub.subscribe(
            pubSub.actions.VOCAB.TOGGLE_CHARTS_VIEW,
            this.toggleCharts
        )
        pubSub.subscribe(
            pubSub.actions.VOCAB.TOGGLE_CHARTS_VIEW,
            this.toggleChartType
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
            <section id="main-vocab-section" class="${this.active ? "active-word" : ""}">
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
                            activeWord : this.active,
                            chartsShown : this.showCharts
                        } 
                    ).node 
                }
                ${
                    new Charts(
                        {
                            page : "vocab",
                            show : this.showCharts,
                            activeChart : this.activeChart,
                            groupType : this.filters.type,
                            activeFilters : this.filters
                        }
                    ).node
                }
            </section>
            ${new ActiveVocabItem(this.active).node}
            `;
    
        let vocabPageContainer = document.createElement("div");
        vocabPageContainer.id = "vocab-page";
        vocabPageContainer.insertAdjacentHTML("afterbegin", HTMLDefinitionString)
    
        vocabPageContainer.addEventListener("click", this.delegateClickEvents );
        vocabPageContainer.addEventListener("change", this.delegateClickEvents );
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
        refreshNode(this);

    }

    setFilterValue(filterValue){
        this.filters.value = filterValue;
        if(filterValue !== "all" && this.active && this.active[this.filters.type] !== filterValue){
            this.active = null;
        }
        refreshNode(this);
    }

    toggleCharts(showCharts){
        this.showCharts = showCharts;
        refreshNode(this);
    }

    toggleChartType(chartTypeCode){
        this.activeChart = parseInt(chartTypeCode, 10);
        refreshNode(this);
    }

    delegateClickEvents(e){
        let target = e.target
        let eventName = target.dataset.eventName || target.parentNode && target.parentNode.dataset.eventName;

        if (!eventName) return;

        if (eventName === pubSub.actions.VOCAB.SET_FILTER_VALUE){
            pubSub.publish(
                pubSub.actions.VOCAB.SET_FILTER_VALUE,
                target.value
            );
            refreshNode(this);
        }

        if (eventName === pubSub.actions.VOCAB.TOGGLE_ACTIVE_WORD){
            let activeWord = this.data.find( w => w.id == target.dataset.wordId);
            if (!activeWord) return;
            this.active = this.active && this.active.id === activeWord.id ? null : activeWord;
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
            pubSub.publish(
                pubSub.actions.VOCAB.SET_FILTER_TYPE,
                target.value
            );
        }

    }
}

export {
    VocabPage as VocabPage
}