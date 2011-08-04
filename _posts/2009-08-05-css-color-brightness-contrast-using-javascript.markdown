--- 
layout: post
title: CSS color brightness contrast using JavaScript
author: Marcel Duran
categories:
    - css
    - javascript
tags:
    - brightness
    - color
    - contrast
    - greasemonkey
    - rgb
---
Dealing with foreground/background color contrast can be a bit tricky specially when you are a not a color-theory savvy or when using CSS color names as listed by [Douglas Crockford's page][1].  
The most common problem is when you have to place a label over a color you don't know on beforehand, it can either be an arbitrary color chosen by the user or come from a random-color generator function and sometimes from a long list in a datasource. Usually you have to decide between labeling it in black or white. When a color is too bright, a black label over it might be the best choice but definitely won't be good over a very dark color, it can be really hard to read it, a white label should work better.

W3C advises:

> Ensure that foreground and background color combinations provide sufficient contrast when viewed by someone having color deficits or when viewed on a black and white screen.
And suggests the following [algorithm][2]\* to calculate the perceived brightness of a color:

`brightness = ((REDvalue X 299) + (GREENvalue X 587) + (BLUEvalue X 114)) / 1000`

If the perceived brightness is greater than 125, choose black, otherwise white.

*\* This algorithm is taken from a formula for converting RGB values to YIQ values.*

On Doug's CSS color names page, he listed all color names alphabetically in two columns, the first one uses a black label over the colors and the second one uses white. I have created a [Greasemonkey][3] script that adds a third column to that page applying this brightness algorithm that decides between black and white which one works better over each color in the list. You can [get and install the script here][4].

[![Doug's CSS color names page with the Greasemonkey script][5]][6]  
*Doug's CSS color names page with the Greasemonkey script* 

To get the RGB values from an element's background color you can use the `window.getComputedStyle`\*\* method as follows:

{% highlight js %}
var element = document.getElementById('foobar'),
    rgb = window.getComputedStyle(element, null).backgroundColor;
{% endhighlight %}

*\*\* Use `currentStyle` on IE, see ["Get Styles on PPK's QuirksMode"][7]*

This will bring the RBG values list string in the format: "rgb(255, 255, 255)" for a white background color. You can use a regular expression and apply it over the RGB string in order to parse its values:

{% highlight js %}
var re = /rgb\((\d+), (\d+), (\d+)\)/;
rgb = re.exec(rgb);
{% endhighlight %}

The `rgb` variable now has an array with the split background RGB color values, you can get the separated R, G and B values from the index 1 of the array:

{% highlight js %}
var
    r = parseInt(rgb[1], 10),
    g = parseInt(rgb[2], 10),
    b = parseInt(rgb[3], 10);
{% endhighlight %}

Finally calculate the color brightness: 

{% highlight js %}
var brightness = (r*299 + g*587 + b*114) / 1000;
if (brightness > 125) {
    // use black
} else {
    // use white
}
{% endhighlight %}

 [1]: http://www.crockford.com/wrrrld/color.html
 [2]: http://www.w3.org/WAI/ER/WD-AERT/#color-contrast
 [3]: http://www.greasespot.net/
 [4]: http://userscripts.org/scripts/show/53262
 [5]: /images/doug-css-colors.png
 [6]: http://www.crockford.com/wrrrld/color.html
 [7]: http://www.quirksmode.org/dom/getstyles.html
