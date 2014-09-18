var fs = require('fs');
var data = require('./arr.json');
var result = {};
console.log(data.length);
data.forEach(function(v,i){
	result[v[0]] = [v[1],v[2]];
});
fs.writeFile('./station_auto_lnglat.json',JSON.stringify(result));