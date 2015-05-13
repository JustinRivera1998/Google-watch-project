function getData(){
  
}

$("#searchbutton").click(function(){
  var location;
  var terms;
  location = $("#location").val().replace(/\s/g, '+');
  terms = $("#terms").val().replace(/\s/g, '+');
  searchYelp(terms,location);
});

function apiUrl(data){
  var request ="http://api.yelp.com";
  if(path=="search"){
    request_url+="/v2/search?";
  }
}

function printResult(business){
  console.log("business",business)
  var $result = $("<div class='business'></div>");
  $result.append("<h5>"+business.name+"</h5>");
  $result.append("<div class='address'>"+business.location.address+"</div>");
  $result.append("<div class='address'>"+business.location.city+"</div>");
  $("#results").append($result);
}

$(document).ready(function(){
  console.log('test2');
  $.get('http://api.yelp.com/v2/search?term=cream+puffs&location=San+Francisco',function(data){
     console.log(data)
  });
});

function searchYelp(terms, location){
  console.log("terms:",terms)
  console.log("location:",location)
var parameters = [];
parameters.push(['term', terms]);
parameters.push(['location', location]);
parameters.push(['callback', 'cb']);
parameters.push(['oauth_consumer_key', auth.consumerKey]);
parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
parameters.push(['oauth_token', auth.accessToken]);
parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
  
var message = {
  'action': 'http://api.yelp.com/v2/search',
  'method': 'GET',
  'parameters': parameters
};
var accessor = {
  consumerSecret: auth.consumerSecret,
  tokenSecret: auth.accessTokenSecret
};
OAuth.setTimestampAndNonce(message);
OAuth.SignatureMethod.sign(message, accessor);
var parameterMap = OAuth.getParameterMap(message.parameters);
parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
console.log(parameterMap);
  
  $.ajax({
    'url': message.action,
    'data': parameterMap,
    'cache': true,
    'dataType': 'jsonp',
    'jsonpCallback': 'cb',
    'success': function(data, textStats, XMLHttpRequest) {
      for(var i = 0; i < data.businesses.length; i++){
        printResult(data.businesses[i]);
      }
    }
  });
}


var auth = {
  //
  // Update with your auth tokens.
  //
  consumerKey: "0gWsIcN6PBLFr2Go0_DfMQ",
  consumerSecret: "Zq1Jv4yF2kIim6tTmBc9Zf9GCbI",
  accessToken: "x8NMNwRKESTGV-FSzbFIe_SvT9Dw5gHV",
  // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
  // You wouldn't actually want to expose your access token secret like this in a real application.
  accessTokenSecret: "VVbO0Hubrc9_ZEGpE2MX-Vz3ZJE",
  serviceProvider: {
    signatureMethod: "HMAC-SHA1"
  }
};
