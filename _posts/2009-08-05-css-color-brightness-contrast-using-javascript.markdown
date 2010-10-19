--- 
layout: post
title: CSS color brightness contrast using JavaScript
author: Marcel Duran
---
Dealing with foreground/background color contrast can be a bit tricky specially when you are a not a color-theory savvy or when using CSS color names as listed by <a href="http://www.crockford.com/wrrrld/color.html" target="_blank">Douglas Crockford's page</a>.
The most common problem is when you have to place a label over a color you don't know on beforehand, it can either be an arbitrary color chosen by the user or come from a random-color generator function and sometimes from a long list in a datasource. Usually you have to decide between labeling it in black or white. When a color is too bright, a black label over it might be the best choice but definitely won't be good over a very dark color, it can be really hard to read it, a white label should work better.

<!--more-->W3C advises:
<blockquote>Ensure that foreground and background color combinations provide sufficient contrast when viewed by someone having color deficits or when viewed on a black and white screen.</blockquote>

And suggests the following <a href="http://www.w3.org/WAI/ER/WD-AERT/#color-contrast" target="_blank">algorithm</a>* to calculate the perceived brightness of a color:

<code>brightness = ((REDvalue X 299) + (GREENvalue X 587) + (BLUEvalue X 114)) / 1000</code>

If the perceived brightness is greater than 125, choose black, otherwise white.

<em>* This algorithm is taken from a formula for converting RGB values to YIQ values.</em>

On Doug's CSS color names page, he listed all color names alphabetically in two columns, the first one uses a black label over the colors and the second one uses white. I have created a <a href="http://www.greasespot.net/" target="_blank">Greasemonkey</a> script that adds a third column to that page applying this brightness algorithm that decides between black and white which one works better over each color in the list. You can <a href="http://userscripts.org/scripts/show/53262" target="_blank">get and install the script here</a>.

<a href="http://www.crockford.com/wrrrld/color.html" target="_blank"><img src="http://cdn-javascriptrules.2static.it/i/posts/doug-css-colors.png" alt="Doug's CSS color names page with the Greasemonkey script" /></a>
<em>Doug's CSS color names page with the Greasemonkey script</em>

To get the RGB values from an element's background color you can use the <code>window.getComputedStyle</code>* method as follows:
<pre lang="javascript">
var element = document.getElementById('foobar'),
    rgb = window.getComputedStyle(element, null).backgroundColor;
</pre>
<em>* Use <code>currentStyle</code> on IE, see <a href="http://www.quirksmode.org/dom/getstyles.html" target="_blank">"Get Styles on PPK's QuirksMode"</a></em>

This will bring the RBG values list string in the format: "rgb(255, 255, 255)" for a white background color. You can use a regular expression and apply it over the RGB string in order to parse its values:
<pre lang="javascript">
var re = /rgb\((\d+), (\d+), (\d+)\)/;
rgb = re.exec(rgb);
</pre>

The <code>rgb</code> variable now has an array with the split background RGB color values, you can get the separated R, G and B values from the index 1 of the array:
<pre lang="javascript">
var
    r = parseInt(rgb[1], 10),
    g = parseInt(rgb[2], 10),
    b = parseInt(rgb[3], 10);
</pre>

Finally calculate the color brightness:
<pre lang="javascript">
var brightness = (r*299 + g*587 + b*114) / 1000;
if (brightness > 125) {
    // use black
} else {
    // use white
}
</pre>
