class PubSub{
    
constructor(){
        this.events = {};
        this.actions = {
            NAVIGATION : {
                UPDATE : "router_UpdateCurrentPage",
                HOME : "router_navToHomePage",
                BOOKS : "router_navToBooksPage",
                VOCAB : "router_navToVocabPage"
            },
            VOCAB : {
                SET_FILTER_TYPE : "vocabPage_setVocabFilterType",
                SET_FILTER_VALUE : "vocabPage_setFilterValue",
                TOGGLE_ACTIVE_WORD : "vocabPage_toggleActiveWord",
                TOGGLE_CHARTS_VIEW : "vocabPage_toggleCharts",
                TOGGLE_CHARTS_TYPE : "vocabPage_toggleChartType"
            },
            BOOKS: {
                CHANGE_FILTER : "bookPage_changeBookFilter",
                OPEN_VOCAB_PAGE: "bookPage_prefilteredVocabPage"
            },
            HOME : {},
            MISC : {}
        }

        this.publish = this.publish.bind(this);
        this.subscribe = this.subscribe.bind(this);

        return this;
    }

    publish(eventName, data){
        if (!this.events[eventName]) return;

        this.events[eventName].map( callback => callback(data))

    }

    subscribe(eventName, callbackFn){
        if (!this.events[eventName]) this.events[eventName] = [];
        this.events[eventName].push(callbackFn);
    };

    clearSubscriptions(eventName){
        if (this.events[eventName]) this.events[eventName] = []; 
    }
    
}

export default new PubSub();