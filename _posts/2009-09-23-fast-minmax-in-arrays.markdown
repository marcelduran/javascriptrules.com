--- 
layout: post
title: Fast min/max in arrays
author: Marcel Duran
categories:
    - algorithm
    - javascript
    - performance
tags:
    - array
    - math
    - max
    - min
---
This morning while commuting to the office, reading [JavaScript for Web Developers][1], I bumped into a question: how could I improve a well known algorithm that gets the smallest or the largest number in an array by using built-in Math methods such as <a href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Math/min">Math.min</a> and <a href="https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Math/max">Math.max</a>. For those not familiar with these methods, they return the smallest or the largest number respectively from a list of zero or more numbers passed as parameters, e.g.: `Math.min(4,3,9,6)` returns 3, `Math.max(4,3,9,6)` returns 9. I was wondering if calling such methods using `apply` and an `Array` as argument would work. I could hardly wait to get to the office to test it out on my [Firebug][2] console. I first tried:

{% highlight js %}
Math.max.apply(Math, [4,8,3,5,1,2]);
{% endhighlight %}

And bingo! It works! 

### Previous work
Since it seemed so easy I thought that somebody else would had already figured this out before and I did a [quick search][3] for `Math.max.apply` and \*bam!\*: the first occurrence was a [John Resig's post][4] back in 07's where he describes such technique for augmenting `Array` type. Really handy. 

### Performance
My main concern to decide whether to use this technique was its performance, so I ran a quick test comparing it to a very popular `for` loop algorithm and an optimized loop for a given array of random numbers:

{% highlight js %}
var i, max,
    a = [],
    len = 1e4;

/* create an array of ten thousand random numbers */
console.time('array creation');
for (i = 0; i &lt; len; i += 1) {
    a[i] = Math.floor(Math.random() * 1e4);
}
console.timeEnd('array creation');

/* for loop */
max = -Infinity;
console.time('for loop');
for (i = 0; i &lt; len; i += 1) {
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
{% endhighlight %}

Running this code on my firebug console (Firefox 3.0.14), I got the same largest number on each technique within the array as expected and the following times: 

*   array creation: **89ms**
*   for loop: **29ms**
*   optimized loop: **20ms**
*   Math.max: **1ms**

Wow! This is pretty fast! Huh? You can copy the code above and paste on your firebug console in order to get your own results or you can [check it out here][5]. 

### Conclusion
This technique deserves lots of credit for its simplicity and speed, it's those one-line codes that beats any fancy and complex algorithm that once you get to know, you start using every time you need, however it's not true for all browsers :-(

 [1]: http://www.javascriptrules.com/books/#nicholaszakas-professionaljavascript
 [2]: http://getfirebug.com/
 [3]: http://search.yahoo.com/search?p=Math.max.apply
 [4]: http://ejohn.org/blog/fast-javascript-maxmin/
 [5]: http://sandbox.javascriptrules.com/fastminmax/
