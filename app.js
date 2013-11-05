var request = require('request');
var cheerio = require('cheerio');
var _ = require('underscore');
var reduce = _.reduce;

var url = 'http://si3.bcentral.cl/indicadoresvalores/secure/indicadoresvalores.aspx';

var partition = function (items, size) {
    var result = _.groupBy(items, function(item, i) {
        return Math.floor(i/size);
    });
    return _.values(result);
}

request(url, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    var $table = $('div#ind-dia table tr td');
    
    var list = $table.map(function(index, element){
        var $this = $(this);
        return ($this.text()).trim();
    });
    
    list = partition(list, 2);
    
    var result = reduce(list, function(memo, vec) {
        var key = vec[0];
        var value = vec[1];
        
        memo[key] = value;
        
        return memo;
    }, {});
    
    console.log(result);
  }
});
