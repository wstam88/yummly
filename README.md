## Synopsis
A simple to use Yummly API wrapper for Nodejs.

## Installation

    $ npm install ws-yummly
    
## Usage
    var Yummly = require("ws-yummly");
    
    Yummly.config({
		app_id : 'YOUR_APP_ID',
		app_key : 'YOUR_APP_KEY',
	});

## API

### getMeta(type, [display])

**type**: holiday, allergy, course, cuisine, diet, ingredient
 
**display**: clean, raw (default)
 
    Yummly.getMeta('diet', 'raw').then(function (meta) {
    	console.log(meta); 
    }).catch(function (error) {
    	console.log(error);
    });
    
    # output
    [ { id: '388',
        shortDescription: 'Lacto vegetarian',
        longDescription: 'Lacto vegetarian',
        searchValue: '388^Lacto vegetarian',
        type: 'diet',
        localesAvailableIn: [ 'en-US' ] 
        ....
        ....
    }]

### maxTotalTimeInSeconds(number)
Maximum time in seconds it may take to prepare the meal
### maxResults(number)
Maximum results from the API
### start(number)
Start getting recipes from start number
### minRating(number)
Minumum rating a recipe can have (1-5)
### maxRating(number)
Maximum rating a recipe can have (1-5)

*maxRating value will be ignored when lower then minRating*
### allowedIngredients(string or array)
for the list of allowed ingredients use:

    Yummly.getMeta('ingredients')
### excludedIngredients(string or array)
for the list of allowed ingredients use:

    Yummly.getMeta('ingredients')
### allowedAllergies(string or array)
for the list of possible values use:

    Yummly.getMeta('allergy')
### excludedAllergies(string or array)
for the list of possible values use:

    Yummly.getMeta('allergy')
### allowedDiets(string or array)
for the list of possible values use:

    Yummly.getMeta('diet')
### excludedDiets(string or array)
for the list of possible values use:

    Yummly.getMeta('diet')
### allowedCuisines(string or array)
for the list of possible values use:

    Yummly.getMeta('cuisine')
### excludedCuisines(string or array)
for the list of possible values use:

    Yummly.getMeta('cuisine')
### allowedCourses(string or array)
for the list of possible values use:

    Yummly.getMeta('course')
### excludedCourses(string or array)
for the list of possible values use:

    Yummly.getMeta('course')
### allowedHolidays(string or array)
for the list of possible values use:

    Yummly.getMeta('holiday')
### excludedHolidays(string or array)
for the list of possible values use:

    Yummly.getMeta('holiday')
### requirePictures(boolean)
Wheter or not the recipes must have a image attached
### paginate(number)
Paginates the result array into chunks
    
    Yummly.query('pineapple').maxResults(40).paginate(10).get().then(function(resp){
        console.log(resp.matches); // 4 arrays within each 10 recipes
    });
### getURL()
Returns the current generated url
    
    var url = Yummly.query('pineapple').maxResults(40).paginate(10).excludedHolidays('halloween').getURL();
    
    // url: https://api.yummly.com/v1/api/recipes?_app_id=YOUR_APP_ID&_app_key=YOUR_APP_KEY&q=pineapple&maxResult=40&excludedHoliday[]=holiday^holiday-halloween
### getWithURL()
Returns the current generated url
    
    var url = https://api.yummly.com/v1/api/recipes?_app_id=YOUR_APP_ID&_app_key=YOUR_APP_KEY&q=pineapple&maxResult=10;
    
    Yummly.getWithURL(url).then(function(resp){
        console.log(resp);
    }));
    
    // url: https://api.yummly.com/v1/api/recipes?_app_id=YOUR_APP_ID&_app_key=YOUR_APP_KEY&q=pineapple&maxResult=40&excludedHoliday[]=holiday^holiday-halloween
    
### getSettings()
Returns the current generated setting object
    
    var settings = Yummly.query('pineapple').maxResults(40).paginate(10).excludedHolidays('halloween').getURL();
    
    // settings: { maxResults: 40, paginate: 10, excludedHolidays: [ 'halloween' ] }

### getDetails()
Returns details for recipes

    var recipes = [
        'Apple-Walnut-Cranberry-Salad-898353',
        'Heavenly-Strawberry_s-650499',
        'Chopped-Taco-Mason-Jar-Salad-1266468'
    ];

    Yummly.getDetails(recipes).then(function (resp) {
        resp.forEach(function (recipe) {
            console.log(recipe.name);
        });
    }).catch(function (error) {
        console.log(error);
    });
    
## Example

    Yummly.query('pineapple')
        .maxTotalTimeInSeconds(1400)
        .maxResults(20)
        .allowedDiets(['Pescetarian', 'Vegan'])
        .allowedCuisines(['asian'])
        .minRating(3)
        .get()
        .then(function(resp){
            resp.matches.forEach(function(recipe){
                console.log(recipe.recipeName);
            });
        });

        # Thai Shrimp and Pineapple Curry
        # Thai Pineapple Fried Rice
        # Asian Pineapple Sauce
        # Thai Pineapple Fried Rice
        # Asian Caramelized Pineapple
        # Thai Pineapple Fried Rice
        # ...