var compressor = require('yuicompressor');
var fs = require('fs');

compressor.compress('game.js', {
    //Compressor Options: 
    charset: 'utf8',
    type: 'js',
    nomunge: false,
    'line-break': 600
}, function(err, data, extra) {
    //err   If compressor encounters an error, it's stderr will be here 
    //data  The compressed string, you write it out where you want it 
    //extra The stderr (warnings are printed here in case you want to echo them 
    fs.writeFile("minifiedgame.js", data, function(er) {
    if(er) {
        return console.log(er);
    }
    console.log("The file was saved!");
}); 
});