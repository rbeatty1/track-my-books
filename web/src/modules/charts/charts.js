import './charts.css';
import chart from 'tui-chart';
import pubSub from '../../util/pubSub';
import { getTargetInfo, properCapitalization, randomColorGenerator, hexToRGB, friendlyMonths} from '../../util/util';
import * as i from '@primer/octicons';

let baseColors = {
    1 : randomColorGenerator(1),
    2 : randomColorGenerator(2),
    3 : randomColorGenerator(3),
    4 : ["#1b5299", "#0087a5", "#5eaf8c", "#d1cb92"],
    5 : ["#323031", "#084C61", "#DB3A34", "#FFC857", "#177E89" ],
    6 : ["#f3de8a", "#e5be81", "#b38875", "#6e5e5e", "#92726c", "#cfa17b"],
    7 : [ "#1b5299", "#0073a9", "#0090aa", "#48aaa6", "#89c1a6", "#c1d7b3", "#f1ecce"],
    8 : [ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#fdbf6f", "#ff7f00", "#e31a1c"],
    9 : [ "#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999"],
    10 : [ "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd"],
    11 : [ "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ffed6f"],
    12 : [ "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"],
    13 : randomColorGenerator(13),
    14 : randomColorGenerator(14),
    15 : randomColorGenerator(15)
};

const chartTypesRef = {
    VOCAB : {
        VOCAB_TIME : {
            code : 0,
            type : chart.areaChart,
            title : "Words over Time",
            options : {
                usageStatistics : false,
                chart : {
                    width : window.innerWidth * .42,
                },
                yAxis : {
                    title : "",
                    // pointOnColumn : true
                },
                xAxis : {
                    title : {
                        text : "",
                        offsetX : -(window.innerWidth * .42)/2,
                    },
                    tickInterval : "auto"
                },
                series: {
                    stackType : "normal",
                    zoomable : false,
                    showDot : false,
                    pointWidth : 2,
                    areaOpacity : 0.5
                },
                tooltip : {
                    grouped : true
                },
                legend : {
                    visible : true,
                    showCheckbox : false,
                    align : "bottom"
                },
                chartExportMenu : {
                    visible : false
                },
            },
            theme : {
                name : "wordsOverTimeMainTheme",
                def : {
                    title : {
                        fontSize : 22,
                        fontFamily : "Lato",
                        color : "#333333"
                    },
                    yAxis: {
                        tickColor : "#111111",
                        title : {
                            fontSize : 14,
                            fontFamily : "Lato",
                            color: "#555555"
                        },
                        label : {
                            color : "#999999"
                        }
                    },
                    xAxis: {
                        tickColor : "#111111",
                        title : {
                            color: "#555555"
                        },
                        label : {
                            fontSize : 10,
                            fontFamily : "Lato",
                            color : "#999999"
                        }
                    },
                    plot : {
                        lineColor: "#7b0d1e",
                        background: '#f6f1e5'
                    }
                }
            }
        },
        VOCAB_GROUP : {
            code : 1,
            type : chart.treemapChart,
            title : "Groups by Word Type",
            options : {
                usageStatistics : false,
                chart : {
                    width : window.innerWidth * .42,
                },
                yAxis : {
                    title : "Count",
                    pointOnColumn : true
                },
                xAxis : {
                    title : {
                        text : "",
                        align : "center"
                    }
                },
                tooltip : {
                    template : function(category, data, idx){
                        var tooltip = document.createElement("div")
                        tooltip.style.width = "200px";
                        tooltip.style.padding = "10px";
                        tooltip.textContent = `${data.legend} : ${data.value} Words`
                        Object.assign(
                            tooltip.style,
                            {
                                width : "200px",
                                padding : "10px",
                                backgroundColor : "rgba(225, 225, 225, .3)",
                                borderRadius : "5px",
                                border : "1px solid #333333"

                            }
                        )

                        return tooltip.outerHTML;
                    }
                },
                series: {
                    showLabel: true,
                    zoomable: false,
                    useLeafLabel: false
                },
                chartExportMenu : {
                    visible : false
                },
                legend : {
                    visible : true
                }
            },
            theme : {
                name : "wordsByGroupTheme",
                def : {
                    title : {
                        fontSize : 22,
                        fontFamily : "Lato",
                        color : "#333333"
                    },
                    yAxis: {
                        tickColor : "#111111",
                        title : {
                            fontSize : 14,
                            fontFamily : "Lato",
                            color: "#555555"
                        },
                        label : {
                            color : "#999999"
                        }
                    },
                    xAxis: {
                        tickColor : "#111111",
                        title : {
                            color: "#555555"
                        },
                        label : {
                            fontSize : 16,
                            fontFamily : "Lato",
                            color : "#999999"
                        }
                    },
                    plot : {
                        lineColor: "#7b0d1e",
                        background: '#f6f1e5'
                    },
                    legend : {
                        label : {
                            color : "#ffffff"
                        }
                    }
                }
            }
        }
    },
    BOOKS : {
        BOOKS_TIME : 0,
        BOOKS_GROUP : 1,
    }
}

class Charts{
    constructor(props){
        this.data = props.data;
        this.page = props.page;
        this.chart = props.activeChart;
        this.activeWord = props.activeWord
        this.groupType = props.activeFilters.type;
        this.pageCharts = chartTypesRef[this.page];
        this.seriesValue = props.activeFilters.value;
        this.baseApi = 'http://localhost:5000/api/v1/vocab';


        this.groupData = this.groupData.bind(this);
        this.highlightSeries = this.highlightSeries.bind(this);
        this.getChartOptions = this.getChartOptions.bind(this);
        this.render = this.render.bind(this);
        this.delegateEvents = this.delegateEvents.bind(this);
        this.highlightSelectedWord = this.highlightSelectedWord.bind(this);

        this.groupedData = this.groupData();
        this.node = this.render();
        this.highlightSeries();

        this.page == "VOCAB" && this.chart == chartTypesRef.VOCAB.VOCAB_TIME.code && this.highlightSelectedWord();
        
        return this
    }

    groupData(){
        function groupForVocabPage(){
            function groupByTime(){
                function sortByDate(a,b){
                    let aDate = new Date(a.timestamp * 1000);
                    let bDate = new Date(b.timestamp * 1000);

                    if( aDate > bDate ) return 1;
                    if( aDate < bDate ) return -1
                    return 0;
                }

                function getDateRange(){
                    let start = {
                        month : minDate.getMonth(),
                        year : minDate.getFullYear()
                    };
                    let end = {
                        month : maxDate.getMonth(),
                        year : maxDate.getFullYear()
                    };

                    let dates = [];
                    for(var i = start.year; i <= end.year; i++){
                        var endMonth = i != end.year ? 11 : end.month;
                        var startMonth = i === start.year ? start.month : 0;

                        for(let j = startMonth; j <= endMonth; j = j > 12 ? j % 12 || 11 : j+1){
                            dates.push(
                                `${friendlyMonths[j]}-${i}`
                            );
                        }
                    }

                    return dates;
                }
                // get months
                let sortedByDate = _self.data.sort( sortByDate );

                let minDate = new Date( sortedByDate[0].timestamp );
                let maxDate = new Date( sortedByDate[ sortedByDate.length - 1].timestamp );
                let dateRange = getDateRange();

                // get series
                let series = [];
                _self.data.map( x=>{
                    let existingSeries = series.find( s => s.name == x[_self.groupType] );
                    if(!existingSeries){
                        series.push( 
                            {
                                name : x[_self.groupType],
                                data : []
                            }
                        );
                    }
                });
                // assign series

                series.map( function(s){
                    var filteredByGroup = _self.data.filter( x=> x[_self.groupType] === s.name);
                    dateRange.map( function(d,i){
                        let filteredByDate = filteredByGroup.filter( function(w){
                            let date = new Date(w.timestamp);
                            let monthYearStr = `${friendlyMonths[date.getMonth()]}-${date.getFullYear()}`;
                            let dateIdx = dateRange.indexOf(monthYearStr);
                            return dateIdx <= i;
                        })

                        s.data.push(filteredByDate.length);
                    })
                })

                return {
                    categories : dateRange,
                    series : series.sort( (a,b) => a.name < b.name )
                };
            }
            function groupByType(){
                function getGroups(){
                    let groups = [];
                    _self.data.map( d =>{
                        let doesGroupExist = groups.filter( l => l === d.type).length > 0;
                        if(!doesGroupExist){
                            groups.push(d.type);
                        }
                    });

                    return groups;
                }

                function getGroupWordData(groupName){
                    var filteredByGroup = _self.data.filter( d => d.type === groupName);
                    let childGroups = [];
                    
                    filteredByGroup.map( d=>{
                        let doesChildGroupExist = childGroups.find( g => g.label.toLowerCase() == d[_self.groupType].toLowerCase());
                        
                        if(!doesChildGroupExist){
                            childGroups.push( 
                                {
                                    label : d[_self.groupType],
                                    value : 1
                                }
                            )
                        }
                        else{
                            doesChildGroupExist.value ++
                        }
                    })
                    return childGroups;
                }



                let groups = getGroups();

                return {
                    series : groups.map( g=>{
                        return {
                            label : properCapitalization(g),
                            children : getGroupWordData(g)
                        }
                    })
                }
            }

            var groupedData;

            switch(_self.chart){
                case chartTypesRef.VOCAB.VOCAB_TIME.code:
                    groupedData = groupByTime();
                    break;
                case chartTypesRef.VOCAB.VOCAB_GROUP.code:
                    groupedData = groupByType();
                    break;
                default:
                    groupedData = _self.data;
                    break;
            }
            return groupedData;
        }
        function groupForBooksPage(){}

        let _self = this;

        return this.page === "VOCAB" ? groupForVocabPage() : 
            this.page === "BOOKS" ? groupForBooksPage() : 
            this.data;
    }

    getChartOptions(chartCode){
        let chartKey = Object.keys(this.pageCharts).find( k => this.pageCharts[k].code == chartCode);
        return this.pageCharts[chartKey];
    }
    render(){
        function buildTogglableChartSection(chartOptions){
            let chartContainer = document.createElement("article");
            let isActive = chartOptions.code == _self.chart;
            let bannerHtml = `
                <button 
                    type="button" 
                    aria-show="" 
                    class="collapsible-chart-banner ${isActive ? "active" : ""}" 
                    data-event-name="${pubSub.actions.MISC.TOGGLE_CHART}"
                    value="${chartOptions.code}"
                >
                ${isActive ? i["chevron-down"].toSVG() : i["chevron-right"].toSVG()}
                <h4>${chartOptions.title}</h4>
                </button>
            `
            chartContainer.insertAdjacentHTML("afterbegin", bannerHtml);
            if (chartOptions.code == _self.chart){
                buildChart(chartContainer); // if active chart, build it.
            }

            container.insertAdjacentElement("beforeend", chartContainer);
        }
        function buildChart(container){
            let chartEl = document.createElement("div");
            let activeChart = _self.getChartOptions(_self.chart);
            activeChart.options.chart.height =  (window.innerHeight * (_self.activeWord ? .55 : .75)) * .7
            var theme = activeChart.theme.def

            if( !theme.hasOwnProperty("series") || (theme.hasOwnProperty("series") && theme.series.colors.length !== _self.groupedData.series.length)){
                Object.assign(
                    activeChart.theme.def, 
                    { 
                        series : { 
                            colors : baseColors[ _self.groupedData.series.length  ],
                            borderColor : "#dddddd",
                            borderWidth : 2
                        }
                    }
                )
            }

            chart.registerTheme(activeChart.theme.name, activeChart.theme.def);
            activeChart.options.theme = activeChart.theme.name;
            _self.currentChart = activeChart.type(chartEl, _self.groupedData, activeChart.options);

            _self.currentChart.on("selectLegend", info => pubSub.publish(pubSub.actions.VOCAB.SET_FILTER_VALUE, info.legend ))

            container.insertAdjacentElement("beforeend", chartEl);
        }

        let _self = this;

        let container = document.createElement("section");
        container.id = "charts";

        for( let c in this.pageCharts) buildTogglableChartSection( this.getChartOptions(this.pageCharts[c].code) )

        container.addEventListener("click", this.delegateEvents);
        return container
    }

    highlightSeries(){
        if (this.chart == null) return;
        
        var legendIdx = -1;
        this.groupedData.series.map( (s, i)=>{
            if (s.name == this.seriesValue){
                legendIdx = i;
            }
        })
        let activeChart = this.getChartOptions(this.chart);

        activeChart.theme.def.series.colors = 
            this.seriesValue == "all" ? baseColors[this.groupedData.series.length] : 
            baseColors[this.groupedData.series.length].map( (c,i)=> i == legendIdx ? c : hexToRGB(c, .15));
        this.node = this.render();
    }

    highlightSelectedWord(){
        if (this.chart == null || this.activeWord == null ) return;

        let wordDate = new Date(this.activeWord.timestamp);
        this.currentChart.addPlotLine(
            {
                value : `${friendlyMonths[wordDate.getMonth()]}-${wordDate.getFullYear()}`,
                color : "#ff0000"
            }
        )
    }

    delegateEvents(e){

        var info = getTargetInfo(e);

        if(!info.eventName) return;

        switch(info.eventName){
            case pubSub.actions.MISC.TOGGLE_CHART:
                pubSub.publish(
                    pubSub.actions.MISC.TOGGLE_CHART,
                    parseInt(info.target.value, 10)
                );
                break;
            default:
                break;
        }
    }


}


export {
    Charts,
    chartTypesRef
}
