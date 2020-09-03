import {properCapitalization, refreshNode} from "../../util/util.js";
import "./vocabPage.css"
import WordList from "./components/wordList/wordList.js";
import pubSub from "../../util/pubSub.js";
import ActiveVocabItem from "./components/activeWord/activeVocabItem.js";
import { Charts, chartTypesRef } from "../../modules/charts/charts.js"
import { VocabFilters } from "./components/filters/vocabFilters.js";
import { BannerPageTypeMap, Banner } from "../../modules/banner/banner.js";


const createHTML = state =>{
    let filteredWordList = state.data.filter( x =>{
        var filterProp = state.filters.type.toLowerCase();
        var filterVal = state.filters.value.toLowerCase();

        return (!x[filterProp] || filterVal === "all") || x[filterProp].toLowerCase() === filterVal;
    });

    let bannerProps = {
        pageState : {
            pageName : BannerPageTypeMap.VOCAB,
            filters : "none",
            showCharts : state.showCharts
        },
        data : {
            raw : state.data,
            filtered : filteredWordList
        }
    }
    let HTMLDefinitionString = `
        ${ new Banner( bannerProps ).node }
        <section id="main-vocab-section">
            ${ new VocabFilters(
                {
                    data : state.data,
                    filterInfo : state.filters,
                }
            ).node
            }
            ${
                new WordList(
                    { 
                        data : filteredWordList,
                        activeWord : state.active,
                        chartsShown : state.showCharts
                    } 
                ).node 
            }
            ${
                new Charts(
                    {
                        page : "vocab",
                        show : state.showCharts,
                        activeChart : state.activeChart,
                        groupType : state.filters.type,
                        activeFilters : state.filters
                    }
                ).node
            }
        </section>
        ${new ActiveVocabItem(state.active).node}
        `;

    let vocabPageContainer = document.createElement("div");
    vocabPageContainer.id = "vocab-page";
    vocabPageContainer.insertAdjacentHTML("afterbegin", HTMLDefinitionString)

    return vocabPageContainer;
}

const assignVocabPageClickEvents = e =>{
    let target = e.target
    let eventName = target.dataset.eventName || target.parentNode && target.parentNode.dataset.eventName;

    if (!eventName) return;

    if (eventName === pubSub.actions.VOCAB.SET_FILTER_VALUE){
        pubSub.publish(
            pubSub.actions.VOCAB.SET_FILTER_VALUE,
            target.value
        );
    }

    if (eventName === pubSub.actions.VOCAB.TOGGLE_ACTIVE_WORD){
        pubSub.publish(
            pubSub.actions.VOCAB.TOGGLE_ACTIVE_WORD,
            target
        )
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

const assignVocabPageChangeEvents = e =>{
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

class VocabPage {
    constructor(props){
        this.state = {
            filters : props || { type : "genre", value : "all"},
            data : undefined,
            baseApi : 'http://localhost:5000/api/v1/vocab',
            active : null,
            showCharts : true,
            activeChart : chartTypesRef.VOCAB.VOCAB_TIME
        };
        this.render = this.render.bind(this);
        this.setFilterValue = this.setFilterValue.bind(this);
        this.setFilterType = this.setFilterType.bind(this);
        this.toggleCharts = this.toggleCharts.bind(this)
        this.toggleChartType = this.toggleChartType.bind(this)

        let _self = this;
        const constructorPromise = new Promise( (resolve, reject) =>{
            _self.getVocabData()
                .then( x => x.json() )
                .then( x=>{
                    _self.state.data = x.filter( w => w.definition !== null && w.type !== null);
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
        let node = createHTML(this.state);
        node.addEventListener("click", assignVocabPageClickEvents);
        node.addEventListener("change", assignVocabPageChangeEvents);
        return node; 
    }

    getVocabData(){
        let apiURL = this.state.filters ?
            this.state.baseApi += `?action=SELECT&${this.state.filters.type}=${this.state.filters.value}` :
            this.state.baseApi;

        return fetch(apiURL)        
    }

    setFilterType(filterType){
        this.state.filters.type = filterType
        this.state.filters.value = "all";
        refreshNode(this);

    }

    setFilterValue(filterValue){
        this.state.filters.value = filterValue;
        refreshNode(this);
    }

    toggleCharts(showCharts){
        this.state.showCharts = showCharts;
        refreshNode(this);
    }

    toggleChartType(chartTypeCode){
        this.state.activeChart = parseInt(chartTypeCode, 10);
        refreshNode(this);
    }
}

export {
    VocabPage as VocabPage
}