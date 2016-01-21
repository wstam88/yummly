var Needle = require('needle');
var Q = require('q');
var fs = require('fs'); 
var chunk = require('lodash.chunk');

var Config = {
	"endpoints" : {
	  	"recipe" : "https://api.yummly.com/v1/api/recipe/",
	  	"recipes" : "https://api.yummly.com/v1/api/recipes",
	  	"meta" : "https://api.yummly.com/v1/api/metadata/"
	  }
};

exports.config = function (input) {

	if(input.app_id && input.app_key){

		Config.app_id = input.app_id;
		Config.app_key = input.app_key;
		Config.app_id_query = '?_app_id=' + input.app_id + '&_app_key=' + input.app_key;

	}
}

var Recipe = Config.endpoints.recipe;

var set_metadata = function(meta, data) {
	return data;
};

var validMetaRequests = ['holiday', 'allergy', 'course', 'cuisine', 'diet', 'ingredient'];

function fetchMeta(url, path, type, display) {

    var deferred = Q.defer();

    // fetch result from yummly
    Needle.get(url, function(error, response) {

      if (!error && response.statusCode == 200) {

        var result = eval(response.body);
        var items = [];

        if (display == 'raw') {
          deferred.resolve(result);
        } else {

          if (type != 'allergy') {
            var pattern = type + '\\^' + type + '\-';
            for (var i = 0; i < result.length; i++) {
              var regex = new RegExp(pattern, 'ig');
              var clean = result[i].searchValue.replace(regex, '');
              items.push(clean);
            };

            deferred.resolve(items.sort());
          } else {
            for (var i = 0; i < result.length; i++) {
              items.push(result[i].shortDescription);
            };
            deferred.resolve(items.sort());
          }

        }

      } else {
      	console.log(response);
        deferred.reject(new Error('Invalid meta request'));
      }

    });

    return deferred.promise;
  }


exports.query = function(input) {

  var url = Config.endpoints.recipes + Config.app_id_query;
  var settings = {};

  if (input && input.length > 0 && typeof input == 'string') {
    url += '&q=' + encodeURIComponent(input);
  }

  return {

    maxTotalTimeInSeconds: function(input) {
      if (input && typeof input == 'number') {
        url += '&maxTotalTimeInSeconds=' + input;
        settings.maxTotalTimeInSeconds = input;
      }

      return this;
    },

    maxResults: function(input) {

      if (input && typeof input == 'number') {
        url += '&maxResult=' + input;
        settings.maxResults = input;
      }

      return this;
    },

    start: function(input) {

      if (input && typeof input === 'number') {
        url += '&start=' + input;
        settings.start = input;
      }

      return this;
    },

    minRating: function(input) {

      if (typeof input == 'number') {

        if(settings.maxRating && input < settings.maxRating){
	      	url += '&minRating=' + input;
	    }
	    else if(!settings.minRating){
	    	url += '&minRating=' + input;
	    	settings.minRating = input;
	    }

      }

      return this;
    },

    maxRating: function(input) {

      if (typeof input == 'number') {
      	
      	if(settings.minRating && input > settings.minRating){
	      	url += '&maxRating=' + input;
	      	settings.maxRating = input;
	    }
	    else if(!settings.minRating){
	    	url += '&maxRating=' + input;
	    	settings.maxRating = input;
	    }

	    
      }

      return this;
    },

    allowedIngredients: function(input) {

      if (input && input.length) {

      	settings.allowedIngredients = settings.allowedIngredients || [];

        if (input instanceof Array) {
        	
          input.forEach(function(item) {
            url += '&allowedIngredient[]=' + encodeURIComponent(item);
            settings.allowedIngredients.push(item);

          });
        } else if (typeof input == 'string') {

          url += '&allowedIngredient[]=' + encodeURIComponent(input);
          settings.allowedIngredients.push(input);

        }

      }

      return this;
    },
    excludedIngredients: function(input) {

      if (input && input.length) {

      	settings.excludedIngredients = settings.excludedIngredients || [];

        if (input instanceof Array) {
          input.forEach(function(item) {
            url += '&excludedIngredient[]=' + encodeURIComponent(item);
            settings.excludedIngredients.push(item);
          });
        } else if (typeof input == 'string') {
          url += '&excludedIngredient[]=' + encodeURIComponent(input);
          settings.excludedIngredients.push(input);
        }
      }

      return this;
    },
    allowedAllergies: function(input) {
      if (input && input.length) {

      	settings.allowedAllergies = settings.allowedAllergies || [];

        if (input instanceof Array) {
          input.forEach(function(item) {
            url += '&allowedAllergy[]=' + encodeURIComponent(item);
            settings.allowedAllergies.push(item);
          });
        } else if (typeof input == 'string') {
          url += '&allowedAllergy[]=' + encodeURIComponent(input);
          settings.allowedAllergies.push(input);
        }
      }

      return this;
    },
    excludedAllergies: function(input) {
      if (input && input.length) {

      	settings.excludedAllergies = settings.excludedAllergies || [];

        if (input instanceof Array) {
          input.forEach(function(item) {
            url += '&excludedAllergy[]=' + encodeURIComponent(item);
            settings.excludedAllergies.push(input);
          });
        } else if (typeof input == 'string') {
          url += '&excludedAllergy[]=' + encodeURIComponent(input);
          settings.excludedAllergies.push(input);
        }
      }

      return this;
    },
    allowedDiets: function(input) {

      if (input && input.length) {

      	settings.allowedDiets = settings.allowedDiets || [];

        if (input instanceof Array) {
          input.forEach(function(item) {
            url += '&allowedDiet[]=' + encodeURIComponent(item);
            settings.allowedDiets.push(item);
          });
        } else if (typeof input == 'string') {
          url += '&allowedDiet[]=' + encodeURIComponent(input);
          settings.allowedDiets.push(input);
        }
      }

      return this;
    },
    excludedDiets: function(input) {
      if (input && input.length) {

      	settings.excludedDiets = settings.excludedDiets || [];

        if (input instanceof Array) {
          input.forEach(function(item) {
            url += '&excludedDiet[]=' + encodeURIComponent(item);
            settings.excludedDiets.push(item);
          });
        } else if (typeof input == 'string') {
          url += '&excludedDiet[]=' + encodeURIComponent(input);
          settings.excludedDiets.push(input);
        }
      }

      return this;
    },
    allowedCuisines: function(input) {
      if (input && input.length) {
      	settings.allowedCuisines = settings.allowedCuisines || [];
        if (input instanceof Array) {
          input.forEach(function(item) {
            url += '&allowedCuisine[]=cuisine^cuisine-' + encodeURIComponent(item);
            settings.allowedCuisines.push(item);
          });
        } else if (typeof input == 'string') {
          url += '&allowedCuisine[]=cuisine^cuisine-' + encodeURIComponent(input);
          settings.allowedCuisines.push(input);
        }
      }

      return this;
    },
    excludedCuisines: function(input) {
      if (input && input.length) {
      	settings.excludedCuisines = settings.excludedCuisines || [];
        if (input instanceof Array) {
          input.forEach(function(item) {
            url += '&excludedCuisine[]=cuisine^cuisine-' + encodeURIComponent(item);
            settings.excludedCuisines.push(item);
          });
        } else if (typeof input == 'string') {
          url += '&excludedCuisine[]=cuisine^cuisine-' + encodeURIComponent(input);
          settings.excludedCuisines.push(input);
        }
      }

      return this;
    },
    allowedCourses: function(input) {
      if (input && input.length) {
      	settings.allowedCourses = settings.allowedCourses || [];
        if (input instanceof Array) {
          input.forEach(function(item) {
            url += '&allowedCourse[]=course^course-' + encodeURIComponent(item);
            settings.allowedCourses.push(item);
          });
        } else if (typeof input == 'string') {
          url += '&allowedCourse[]=course^course-' + encodeURIComponent(input);
          settings.allowedCourses.push(input);
        }
      }

      return this;
    },
    excludedCourses: function(input) {
      if (input && input.length) {
      	settings.excludedCourses = settings.excludedCourses || [];
        if (input instanceof Array) {
          input.forEach(function(item) {
            url += '&excludedCourse[]=course^course-' + encodeURIComponent(item);
            settings.excludedCourses.push(item);
          });
        } else if (typeof input == 'string') {
          url += '&excludedCourse[]=course^course-' + encodeURIComponent(input);
          settings.excludedCourses.push(input);
        }
      }

      return this;
    },
    allowedHolidays: function(input) {

      if (input && input.length) {

      	settings.allowedHolidays = settings.allowedHolidays || [];

        if (input instanceof Array) {

          for (var i = 0; i < input.length; i++) {


              url += '&allowedHoliday[]=holiday^holiday-' + encodeURIComponent(input[i]);
              settings.allowedHolidays.push(input[i]);
       

          };

        } else if (typeof input == 'string') {

          url += '&allowedHoliday[]=holiday^holiday-' + encodeURIComponent(input);
          settings.allowedHolidays.push(input);

        }
      }

      return this;
    },
    excludedHolidays: function(input) {

      if (input && input.length) {
      	
      	settings.excludedHolidays = settings.excludedHolidays || [];
        if (input instanceof Array) {
          input.forEach(function(item) {
            url += '&excludedHoliday[]=holiday^holiday-' + encodeURIComponent(item);
            settings.excludedHolidays.push(item);
          });
        } else if (typeof input == 'string') {
          url += '&excludedHoliday[]=holiday^holiday-' + encodeURIComponent(input);
          settings.excludedHolidays.push(input);
        }

      }

      return this;
    },
    requirePictures: function(input) {
      if (input == true) {
        url += '&requirePictures=true'
      }
      else if(input == false){
      	settings.requirePictures = input;
      }

      return this;
    },
    paginate: function(input) {

      if (input && typeof input == 'number') {
        settings.paginate = input;
      }

      return this;
    },
    getURL: function() {
      return url;
    },
    getSettings: function() {
      return settings;
    },
    get: function() {

      var deferred = Q.defer();

      if(!Config.app_id || !Config.app_id){
	  	deferred.reject(new Error('Invalid API config settings'));
	  	return deferred.promise;
	  }

      Needle.get(url, function(error, response) {

        url = Config.endpoints.recipes + Config.app_id_query;

        if (!error && response.statusCode == 200) {

          if (settings.paginate) {

            response.body.matches = chunk(response.body.matches, settings.paginate);
            deferred.resolve(response.body);

          } else {
            deferred.resolve(response.body);
          }

        } else {
          deferred.reject(new Error(error));
        }

      });

      return deferred.promise;

    }
  }

}

exports.getByURL = function(url) {

  var deferred = Q.defer();

  if(!Config.app_id || !Config.app_id){
  	deferred.reject(new Error('Invalid API config settings'));
  	return deferred.promise;
  }

  Needle.get(url, function(error, response) {

    if (!error && response.statusCode == 200) {

      deferred.resolve(response.body);

    } else {
      deferred.reject(new Error(error));
    }

  });

  return deferred.promise;

}

exports.getMeta = function(input, display) {

  var deferred = Q.defer();
  var display = display || 'raw';

  if(!Config.app_id || !Config.app_id){
  	deferred.reject(new Error('Incomplete API settings'));
  	return deferred.promise;
  }

  if(!~validMetaRequests.indexOf(input)){
  	deferred.reject(new Error('Invalid meta value'));
  	return deferred.promise;
  }

  // place URL in fetchMeta
  var url = Config.endpoints.meta + input + Config.app_id_query;
  var path = './meta/' + input + '.json';

  fs.stat(path, function(err, stat) {

    if (err == null) {
      fs.readFile(path, function(err, obj) {
        // console.log(obj || err); 
        deferred.resolve(obj);
      });
    } else if (err.code == 'ENOENT') {
      fetchMeta(url, path, input, display).then(function(resp) {
        // console.log(resp); 
        deferred.resolve(resp);
      }).catch(function(error) {
        deferred.reject(error);
      });
    } else {
      deferred.reject(new Error('Invalid something'));
    }

  });

  return deferred.promise;

}