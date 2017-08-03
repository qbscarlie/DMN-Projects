# DMN-Projects

These are all the projects I made while interning with the Dallas Morning News during the summer of 2017. Here are links to the stories in which each project was included:

## maps
These are all maps I made using Mapbox and a script that connects Google Sheets to an S3 bucket so that they can be updated by the author whenever needed.

[lakes](https://www.guidelive.com/fun-places-and-events/2016/05/24/summer-chillout-lowdown-dfw-lakes): A map showing lakes around the DFW area and what they offer.

[spooky-map](https://www.guidelive.com/fun-places-and-events/2017/06/03/10-haunted-places-dallas-fort-worth-texas-ghosts): A map showing haunted locations around the DFW area and giving a brief overview of them.

[waterparks-map](https://www.guidelive.com/take-the-kids/2016/05/24/find-best-water-parks-free-splash-pads-dallas-fort-worth): A map showing waterparks around the DFW area, their contact info, and what they offer.

[skyline-map](http://interactives.dallasnews.com/embeds/2017/skyline-map/): A step through map of skyscrapers in Dallas over the decades.

[coffee-map](http://interactives.dallasnews.com/embeds/2017/coffee-map/): A map showing coffee shops around the DFW area, their contact info, and what their hours are.

## divine-nine-embed
This was a component of a feature story about the divine nine Greek chapters in Dallas and their history. I made this embeddable to show basic facts about all nine chapters, along with a picture and quote from each one.

I used Handlebars along with the script to connect a Google sheet to an S3 bucket so that the reporter could update information as she acquired it.

[story link](https://www.dallasnews.com/life/life/2017/06/08/long-college-divine-nine-fraternities-sororities-lifeline-black-members)

## people-slider-template
This was a template I made so that it would be easy for others on the Interactives team to make embeddable sliders for stories to introduce people/places/etc. in a story. This uses the same mechanics as the divine nine embeddable to retrieve data from a Google sheet.

[template example](http://interactives.dallasnews.com/embeds/2017/slider-template/)

## book-slider
This was an embeddable I made for a story on summer reading books that North Texas schools were assigning. I used a jQuery plugin to make a series of image sliders where the top image was a synopsis of the book and the image underneath revealed the book cover, title and author.

[story link](https://www.dallasnews.com/news/education/2017/07/11/high-school-flashback-can-name-summers-reading-assignments-just-books-plots)

## hazing-dashboard
This was an embeddable I made to showcase results from a survey given to high school sports coaches in the area about hazing. I wrote a lil Python to parse the survey results then built a dynamic bar chart in D3 that's controlled by two drop down menus (and then I filter through the data using lodash.)

[embed link](http://interactives.dallasnews.com/embeds/2017/hazing-dashboard/)
