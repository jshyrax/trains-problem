Trains Test ReadMe

Assumptions:
 - Inputs are somewhat sanitized, for example
 	- Formatting of graph follows ABN format
	- Formatting of path follows A-B-C format
 - Queried nodes exist in graph
 - Input graphs remain relatively small
 - Max stops and max distances are <100
 - Provided input and outputs guides automated testing

Improvements:
This is by no means the best solution to the problem,
as some of the graph transversal functions require optimization.

Writing the solution in TypeScript instead of JavaScript would
produce a cleaner result. If this was a production solution I 
would consider a lower level language if possible.

Design:
A weighted directed graph was implemented using the 
graphs-adt library to save time. Some of the supplied
methods in this library were superfluous and not fully
utilised. BFS, DFS and Dijkstra algorithms were
used on the graph to solve the problems.

Please find more info relating to the solution in the
code comments

Solution written for nodejs in JavaScript.

Steps to run:
Make sure you have node installed

#grap the dependencies
npm install 

#run test
npm test

#run with supplied inputs
node trains.js