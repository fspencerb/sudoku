var letters = "ABCDEFGHI";
var digits = "123456789";
var qv = "tttmmmbbb";
var qh = "lllcccrrr";
var puzzle = "008160090010004006726000000800951003507208901100476008000000562600300010050047800";
var squares = {};
var unitlist = {};
var units = {};
var peers = {};

Array.prototype.contains = function(v){
    return this.indexOf(v) >= 0;
}
String.prototype.contains = function(v){
    return this.indexOf(v) >= 0;
}
//create all the squares and unitlists
for(var i=0;i < letters.length;i++){
    for(var j=0;j< digits.length;j++){
        var row = letters[i];
        var col = digits[j];
        var name = row+col;
        squares[name] = true;
        unitlist[row] = (unitlist[row] || []).concat([name]);
        unitlist[col] = (unitlist[col] || []).concat([name]);
        unitlist[qv[i]+qh[j]] = (unitlist[qv[i]+qh[j]] || []).concat([name]);
    }
}

for (var s in squares){
    units[s] = [];
    for(var key in unitlist){
        if(unitlist[key].indexOf(s) >= 0){
            units[s].push(unitlist[key]);
        }
    }
}

for(var s in squares){
    peers[s] = [];
    units[s].forEach(function(unit){
        unit.forEach(function(p){
            if(p !==s && peers[s].indexOf(p)===-1){
                peers[s].push(p);
            }
        });
    });
}

function assign(values, s, d){
    var otherVals = values[s].replace(d,'');
    
    for (var i=0; i < otherVals.length;i++){
        if(!eliminate(values,s,otherVals[i])){
            return false; //contradiction encountered.
        }
    }
    
    return values;
    
}

function parseGrid(grid){
    var values = {};
    
    for(var s in squares){
        values[s] = digits;
    }
    
    var gridVals = {};
    Object.keys(squares).forEach(function(s,i){
        gridVals[s] = grid[i];
    });
    
    for(var s in gridVals){
        if(digits.contains(gridVals[s])){
            if(!assign(values,s,gridVals[s])){
                return false;
            }
        }
    }  
    return values;
}
/* Values is an object. that looks like this:

    {
    A1:"123456789"
    ...
    B@:"12",
    C1:"1279",
    }
    
    s= "A1", square to reduce,
    d= "5" The number you're going to eliminate from that square.

*/
var counter = 0;
function eliminate(values,s,d){
  // eliminate the value d in the square s from values
  // values, 'A1', '5'
  // check to see if 5 in A1.
  // replace the digit d in values[s];
    if (!values[s].contains(d)) {
        return values;
    }
    counter++:
        // replace function below
    
    values[s] = values[s].replace(d,'')
        // check the reduced values of the square
        // to see if it's down to 1 last possibility.
        // if the length is equal to 1, we can 
        // eliminate that value from it's peers. then 
        // we can assign that value to the square.
        if (values[s].length === 1){ //peers = Example: 'A1'
            peers[s].forEach(function(peer){
                eliminate(values,peer,values[s]);//eliminate
            });
        }
    
    return values;
}


function draw(values){
    for(var key in values){
        document.getElementById(key).innerHTML = values[key]; 
    }
}

var x = parseGrid(puzzle);
draw(x);
console.log(counter);