/**
 * Test cases for train.js
 * @author Willem Marx
 */

const assert = require('assert');
const trains = require('../trains');

// Supplied sample data
const test_graph = "AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7";
const test_routes_distances = [
    ['A-B-C', 9],
    ['A-D', 5],
    ['A-D-C', 13],
    ['A-E-B-C-D', 22],
    ['A-E-D', "NO SUCH ROUTE"]
];
const test_routes = [
    "CDC",
    "CEBC",
    "CEBCDC",
    "CDCEBC",
    "CDEBC",
    "CEBCEBC",
    "CEBCEBCEBC"
];

describe('Graph Test', () => {
    describe('Generate Graph', () => {
        it('should return null if no graph is specified', () =>{
            assert.equal(trains.generateGraph(), null); 
        })
        
        it('should return null if empty string is specified', () =>{
            assert.equal(trains.generateGraph(""), null);
        })
    
        it('should return null if any route definition structure is too long/short', () => {
            assert.equal(trains.generateGraph(test_graph + ", AED2"), null)
        })        
        
        it('should generate weighted adjacency list valid graph definition', () => {
            let alternative_test_g = 'AB7, BC8, CD1, DB3, DA4, BE5, ED7';

            let aj = new Map([
                ['A', new Map([['B', 7]])],
                ['B', new Map([['C', 8], ['E', 5]])],
                ['C', new Map([['D', 1]])],
                ['D', new Map([['A', 4], ['B', 3]])],
                ['E', new Map([['D', 7]])]
            ]);
            
            let gen_g = trains.generateGraph(alternative_test_g);
            let match = false;
            
            aj.forEach((v, k) => {
                if (gen_g.getNode(k)){
                    v.forEach( (_v, _k) => {
                        match = (gen_g.getNode(_k) && (gen_g.getEdge(k, _k) == _v));
                        if (!match) return
                    });
                }else{
                    match = false;
                    return;
                }
            });
            assert(match);
        })
    });

    describe('Functions operating on graph', () => {
        var graph = trains.generateGraph(test_graph);
        describe('#getDistance', () => {
            it('should return null on undefined params', () => {
                assert.equal(trains.getDistance(), null);
            });

            test_routes_distances.forEach( (rd) => {
                let [route, distance] = [...rd];
                let cDistance = trains.getDistance(route, graph);
    
                it(`should calculate the route ${route} to be ${distance}`, ()=>{                          
                    assert.equal(cDistance, distance);
                })
            });            
        });
    
        describe('#getNTripsByStops', () =>{
            it('the number of trips starting from C and ending in C with a max of 3 stops should be 2', () =>{
                assert.equal(trains.getNTripsByStops("C", "C", graph, 3, true), 2);
            });
    
            it('the number of trips between A and C with exactly 4 stops should be 3', () =>{
                assert.equal(trains.getNTripsByStops("A", "C", graph, 4, false), 3);
            });
        });

        describe("#getNTripsByDistance", () =>{
            it('the number of different routes from C to C with a distance less than 30 should be 7', () =>{
                assert.equal(trains.getNTripsByDistance("C", "C", graph, 30), 7);
            });
        });
    
        describe('#getSPNStops', () => {
            it('should return null on undefined params', () => {
                assert.equal(trains.getSPNStops(), null);
            });
    
            it('the length of the shortest route in terms of distance from A->C should be 9', () =>{
                assert.equal(trains.getSPNStops("A", "C", graph), 9);
            });
    
            it('the length of the shortest route in terms of distance from B->B should be 9', () =>{
                assert.equal(trains.getSPNStops("B", "B", graph), 9);
            });
        });
    });
});