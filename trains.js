/**
 * @author Willem Marx
 * @summary Kitomba Interview test: Problem One, Railroad in kiwiland, 
 *          ShortestPath, Trips by stops visited and distance travelled
 */

const {Graph} = require('graphs-adt');

/**
 * Generate a graph from a given sequence, <NodeA><NodeB><Weight>, <NodeA><NodeB><Weight>
 * @param  {string} s comma delimited graph definition
 * @return {Graph} A directed graph or null if input invalid
 */
const generateGraph = function(s){
    const g = new Graph({directed: true});

    if (!s) return null;

    let edgeList = s.split(',').map((v) => { return v.trim(); });   

    if (Math.max.apply( null, edgeList.map( (s) => { return s.length})) != 3){
        return null;
    }
    
    let avs = new Set();  
    for (let i in edgeList){
        let nodeA = edgeList[i][0];
        let nodeB = edgeList[i][1];
        let weight = Number(edgeList[i][2]);

        if (!avs.has(nodeA)){
            avs.add(nodeA);
            g.addNode(nodeA);
        }
        if (!avs.has(nodeB)){
            avs.add(nodeB);
            g.addNode(nodeB);
        }
        g.addEdge(nodeA, nodeB, weight);
    }
    return g;
};

/**
 * Calculate the distance travelled along a route on a graph
 * @param  {string} route A dash delimited string defining a route eg. A-B-C-D
 * @param  {Graph}  graph The target graph
 * @return {number} route distance or null if input invalid
 */
const getDistance = function(route, graph){
    if (!route || !graph) return null;

    let stops = route.split('-');

    let distance = 0;
    let _va = stops.shift();

    while (stops.length > 0){        
        let _vb = stops.shift();
        let _e = graph.getEdge(_va, _vb);

        if (!_e) 
            return 'NO SUCH ROUTE'; 
        
        distance += graph.getEdge(_va, _vb);
        _va = _vb;
    }
    return distance;
}

/**
 * Find the length of the shortest route
 * @param  {string} start Starting point
 * @param  {string} stop Ending point
 * @param  {Graph}  graph The target graph
 * @return {number} length of route
 */
const getSPNStops = function(start, stop, graph){
    if (!start || !stop || !graph) return null;
    let shortestDistance = Infinity;
    if (start === stop){
        const ns = graph.getNode(start).neighbours;
        for (let _n of ns){
            let path = graph.getPath(_n.key, stop);
            let distance = getDistance([start].concat(path).join('-'), graph);
            if (distance < shortestDistance){
                shortestDistance = distance;
            }
        }        
        return shortestDistance;
    }else{
        return getDistance(graph.getPath(start, stop, graph).join('-'), graph);
    }
};

/**
 * Find the number of trips that can be taken with a maximum number of stops
 * @param  {string} start Starting point
 * @param  {string} stop Ending point
 * @param  {Graph}  graph The target graph
 * @param  {boolean} maxStops exactly{false}, or as max{true}
 * @return {number} number of trips
 */
const getNTripsByStops = function(start, stop, graph, stops, maxStops){
    if (!start || !stop || !graph) return null;
    let trips = 0;
    if (stops == 0) return 0;

    let neighbours = graph.getNode(start).neighbours;
    for (let i in neighbours){
          if ((maxStops || (stops == 1)) && (neighbours[i].key === stop) ){
              trips++;
          }

          trips += getNTripsByStops(neighbours[i].key, stop, graph, stops - 1, maxStops);
    }
    return trips;
};

/**
 * Get the number of trips that can be made without exceeding a max distance
 * @param  {string} start Starting point
 * @param  {string} stop Ending point
 * @param  {Graph}  graph The target graph
 * @param  {number} maxDistance the max allowed distance
 * @return {number} number of trips
 */
const getNTripsByDistance = function(start, stop, graph, maxDistance){
    if (!start || !stop || !graph) return null;
    let trips = 0;

    let neighbours = graph.getNode(start).neighbours;
    for (let i in neighbours){
        let edgew = graph.getEdge(start, neighbours[i].key);

        if ((neighbours[i].key === stop) && (edgew < maxDistance)) trips++;
        if (edgew < maxDistance) trips += getNTripsByDistance(neighbours[i].key, stop, graph, maxDistance - edgew);
    }
    return trips;
};

let logOutput = (n, o) =>{
    console.log(`Output #${n}: ${o}`);
}

let ex = (graph_definition)=>{
    let g = generateGraph(graph_definition);

    // inputs 1 to 5 getDistance
    let distances = ['A-B-C', 'A-D', 'A-D-C', 'A-E-B-C-D', 'A-E-D'];
    for (let i = 0; i  < distances.length; i++){
        logOutput(i+1, getDistance(distances[i], g));
    }

    // inputs 6 & 7 getNTripsByStops
    logOutput(6, getNTripsByStops("C", "C", g, 3, true));
    logOutput(7, getNTripsByStops("A", "C", g, 4, false));

    // inputs 8 & 9 getSPNStops
    logOutput(8, getSPNStops("A", "C", g));
    logOutput(9, getSPNStops("B", "B", g));
    
    // input 10
    logOutput(10, getNTripsByDistance("C", "C", g, 30));

}
ex("AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7");

module.exports = { 
    generateGraph,
    getDistance,
    getSPNStops,
    getNTripsByStops,
    getNTripsByDistance
};