# people-slider

View the example at http://interactives.dallasnews.com/embeds/2017/people-slider/

## Usage
To make a people slider, create a Google sheet with columns for name, id (start at 0 and increment), description, and img. (You can also include cutline if you really want to.) Then activate it using https://github.com/DallasMorningNews/GS3.

Note: keep description length to one paragraph.

Put the data url in the src/js/scripts.js file on the way bottom where the current dummy template URL resides.

Then add your images in the dist/images/ folder, make sure your filename is the same as it appears in your spreadsheet. Then change your h4 and chatter in the html embed-content div.

#### Embedding in Serif

The below embed code can be pasted into a Serif "code block":

```html
<div id="embed-people-slider" class="embed-preview"></div>

<script src="//pym.nprapps.org/pym.v1.min.js"></script>
<script>new pym.Parent('embed-people-slider', '//interactives.dallasnews.com/embeds/2017/people-slider/', {})</script>
```

## Copyright

&copy;2017 The Dallas Morning News
