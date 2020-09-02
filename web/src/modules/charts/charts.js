import * as nv from 'nvd3';
import * as d3 from 'd3';
import './charts.css';
import pubSub from '../../util/pubSub';

const chartTypesRef = {
    VOCAB : {
        VOCAB_TIME : 0,
        VOCAB_GROUP : 1
    },
    BOOKS : {
        BOOKS_TIME : 0,
        BOOKS_GROUP : 1,
    }
}

class Charts{
    constructor(props){
        this.state = props;
        this.baseApi = 'http://localhost:5000/api/v1/vocab'

        this.render = this.render.bind(this);

        this.node = this.render();

        return this
    }

    render(){
        let createChartTypeBtns = () =>{
            const chartTypes = {
                VOCAB : [
                    {
                        visible : true,
                        active : _self.state.activeChart == chartTypesRef.VOCAB.VOCAB_TIME,
                        label : "Words by Time",
                        code : chartTypesRef.VOCAB.VOCAB_TIME
                    },
                    {
                        visible : _self.state.groupType.toUpperCase() !== "BOOK",
                        active : _self.state.activeChart == chartTypesRef.VOCAB.VOCAB_GROUP,
                        label : "Group Distribution",
                        code : chartTypesRef.VOCAB.VOCAB_GROUP
                    }
                ],
                BOOKS : []
            }

            var validTypes = chartTypes[_self.state.page.toUpperCase()];

            return validTypes.filter( x => x.visible).map( btn => `<li class="${btn.active ? "active" : ""}" data-event-name="${pubSub.actions.VOCAB.TOGGLE_CHARTS_TYPE}" data-chart-type="${btn.code}">${btn.label}</li>`).join("");
        }

        function createChart(){
            function createStackedAreaChart(){
                function initializeChart(){
                    return nv.models.stackedAreaChart()
                        .y(d => d[1])
                        .x(d => d[0])
                        .useInteractiveGuideline(true)
                        .showControls(false)
                        .clipEdge(true)
                }

                function organizeByGroupType(){
                    return fetch(_self.baseApi+`?action=VOCAB_OVER_TIME&groupBy=${_self.state.activeFilters.type}`)
                }

                return organizeByGroupType()
                    .then(result => result.json())
                    .then(data =>{
                        nv.addGraph( function(){
                            var c = initializeChart()
                            c.yAxis
                                .tickFormat(d3.format('d'))
                            c.xAxis
                                .tickFormat( d => d3.time.format('%b-%y')(new Date(d*1000)) )

                            const filterValue = _self.state.activeFilters.value.toLowerCase();
                            d3.select("#charts div svg")
                                .datum(data.filter( d => filterValue === "all" || d.key.toLowerCase() === filterValue))
                                .transition()
                                .duration(500)
                                .call(c)

                            nv.utils.windowResize(c.update)

                            c.stacked.dispatch.on('areaClick', function(e){
                                // change vocab list filter to clicked area
                                pubSub.publish(
                                    pubSub.actions.VOCAB.SET_FILTER_VALUE,
                                    filterValue === "all" ? e.series.toLowerCase() : "all"
                                )
                            })
                            return c;
                        })
                    });;
            }

            function createTreeChart(){
                function processData(d){
                    var root = d3.hierarchy(d).sum()
                }

                var svg = d3.select("#div div svg")

                // d3.json()

                return '<h3>TREE CHART</h3>'
            }

            console.log(_self.state.activeChart);
            return _self.state.activeChart === chartTypesRef.VOCAB.VOCAB_TIME ?  createStackedAreaChart() : createTreeChart();
        }
        let _self = this;        
        
        const HTMLDefinitionString = `
            <section id="charts" class="${this.state.show ? 'charts-shown' : 'charts-hidden'}">
                <ul>${createChartTypeBtns()}</ul>
                <div>
                    <svg></svg>
                </div>
            </section>
        `;

        createChart()

        return HTMLDefinitionString
    }
}


export {
    Charts,
    chartTypesRef
}
