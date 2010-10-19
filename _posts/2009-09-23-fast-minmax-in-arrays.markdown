--- 
layout: post
title: Fast min/max in arrays
author: Marcel Duran
---
This morning while commuting to the office, reading <a href="http://www.javascriptrules.com/books/#nicholaszakas-professionaljavascript" target="_blank">JavaScript for Web Developers</a>, I bumped into a question: how could I improve a well known algorithm that gets the smallest or the largest number in an array by using built-in Math methods such as <code><a href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Math/min" target="_blank">Math.min</a></code> and <code><a href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Math/max" target="_blank">Math.max</a></code>. For those not familiar with these methods, they return the smallest or the largest number respectively from a list of zero or more numbers passed as parameters, e.g.: <code>Math.min(4,3,9,6)</code> returns 3, <code>Math.max(4,3,9,6)</code> returns 9. I was wondering if calling such methods using <code>apply</code> and an <code>Array</code> as argument would work. I could hardly wait to get to the office to test it out on my <a href="http://getfirebug.com/" target="_blank">Firebug</a> console. I first tried:
<pre lang="javascript">
Math.max.apply(Math, [4,8,3,5,1,2]);
</pre>
And bingo! It works!

<!--more--><h3>Previous work</h3>
Since it seemed so easy I thought that somebody else would had already figured this out before and I did a <a href="http://search.yahoo.com/search?p=Math.max.apply" target="_blank">quick search</a> for <code>Math.max.apply</code> and *bam!*: the first occurrence was a <a href="http://ejohn.org/blog/fast-javascript-maxmin/" target="_blank">John Resig's post</a> back in 07's where he describes such technique for augmenting <code>Array</code> type. Really handy.

<h3>Performance</h3>
My main concern to decide whether to use this technique was its performance, so I ran a quick test comparing it to a very popular <code>for</code> loop algorithm and an optimized loop for a given array of random numbers:
<pre lang="javascript">
var i, max,
    a = [],
    len = 1e4;

/* create an array of ten thousand random numbers */
console.time('array creation');
for (i = 0; i < len; i += 1) {
    a[i] = Math.floor(Math.random() * 1e4);
}
console.timeEnd('array creation');

/* for loop */
max = -Infinity;
console.time('for loop');
for (i = 0; i < len; i += 1) {
    if (a[i] > max) {
        max = a[i];
    }
}
console.timeEnd('for loop');
console.log(max);

/* optimized loop */
max = -Infinity;
i = len;
console.time('optimized loop');
while (i--) {
    if (a[i] > max) {
        max = a[i];
    }
}
console.timeEnd('optimized loop');
console.log(max);

/* Math.max */
console.time('Math.max');
max = Math.max.apply(Math, a);
console.timeEnd('Math.max');
console.log(max);
</pre>

Running this code on my firebug console (Firefox 3.0.14), I got the same largest number on each technique within the array as expected and the following times:
<ul>
	<li>array creation: <strong>89ms</strong></li>
	<li>for loop: <strong>29ms</strong></li>
	<li>optimized loop: <strong>20ms</strong></li>
	<li>Math.max: <strong>1ms</strong></li>
</ul>

Wow! This is pretty fast! Huh? You can copy the code above and paste on your firebug console in order to get your own results or you can <a href="http://sandbox.javascriptrules.com/fastminmax/" target="_blank">check it out here</a>.

<h3>Conclusion</h3>
This technique deserves lots of credit for its simplicity and speed, it's those one-line codes that beats any fancy and complex algorithm that once you get to know, you start using every time you need, however it's not true for all browsers :-(
