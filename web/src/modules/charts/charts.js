import './charts.css';
import chart from 'tui-chart';
import pubSub from '../../util/pubSub';
const baseColors = ['#7b0d1e', '#a84024', '#cf7128', "#eca72f", "#ffdf45"];
const chartTypesRef = {
    VOCAB : {
        VOCAB_TIME : {
            code : 0,
            type : chart.areaChart,
            options : {
                chart : {
                    width : 1000,
                    height : 500,
                    title : {
                        text : "Words over Time",
                        align : "center"
                    }
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
                series: {
                    stackType : "normal",
                    zoomable : false,
                    showDot : false,
                    pointWidth : 2
                },
                tooltip : {
                    grouped : true
                },
                legend : {
                    visible : true,
                    showCheckbox : false
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
                            fontSize : 14,
                            fontFamily : "Lato",
                            color: "#555555"
                        },
                        label : {
                            color : "#999999"
                        }
                    },
                    series: {
                        colors: baseColors
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
            type : chart.treemapChart
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
        this.groupType = props.groupType;
        this.baseApi = 'http://localhost:5000/api/v1/vocab';


        this.groupData = this.groupData.bind(this);
        this.getActiveChartOptions = this.getActiveChartOptions.bind(this);
        this.render = this.render.bind(this);

        this.node = this.render();

        return this
    }

    groupData(){
        function groupForVocabPage(){
            function groupByTime(){
                let friendlyMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
            function groupByType(){}

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

    getActiveChartOptions(){
        var pageCharts = chartTypesRef[this.page];
        let activeChartKey = Object.keys(pageCharts).find( k => pageCharts[k].code == this.chart);
        return pageCharts[activeChartKey];
    }
    render(){
        function buildChart(){
            let activeChart = _self.getActiveChartOptions();
            chart.registerTheme(activeChart.theme.name, activeChart.theme.def);
            activeChart.options.theme = activeChart.theme.name;
            _self.currentChart = activeChart.type(container, _self.groupedData, activeChart.options);
        }

        this.groupedData = this.groupData();
        let _self = this;

        let container = document.createElement("section");
        container.id = "charts";

        buildChart();

        var strokes = container.querySelectorAll("[clip-path]")
        for (let s of strokes){
            s.removeAttribute("clip-path");
        }
        return container.outerHTML
    }
}


export {
    Charts,
    chartTypesRef
}
