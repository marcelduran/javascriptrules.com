--- 
layout: post
title: "JavaScript Challenge Revisited: Lotto Number Generator in Chains"
author: Marcel Duran
---
Matthias Reuter from <a href="http://www.united-coders.com/" target="_blank">United Coders</a> proposed a <a href="http://www.united-coders.com/matthias-reuter/javascript-challenge-lotto-number-generator" target="_blank">JavaScript Challenge: A Lotto Number Generator</a> which the rules follow:

<blockquote>Write a JavaScript function that generates random lotto numbers. This function has to return an array of six different numbers from 1 to 49 (including both) in ascending order. You may use features of <a href="http://www.ecma-international.org/publications/standards/Ecma-262.htm" target="_blank">ECMA-262</a> only, that means no Array.contains and stuff. You must not induce global variables.

The function has to look like this

<pre lang="javascript">
var getRandomLottoNumbers = function () {
    // your implementation here
};
</pre>
Minify your function using <a href="http://javascript.crockford.com/jsmin.html" target="_blank">JSMin</a> (level aggressive) and count the bytes between the outer curly braces.</blockquote>

<!--more-->It might look simple but it turns out to be an interesting challenge considering there's a bunch of ways to solve it where the length of the minified final implementation is the main concern: the smaller the better. He describes his solution and invites others to post their solutions as comments. His final solution for such challenge has 86 bytes:
<pre lang="javascript">
var n=[],i=0;for(;++i<50;)n.push(i);for(;--i>6;)n.splice(i*Math.random()|0,1);return n
</pre>

Some readers wrote even smaller solutions such as:
<pre lang="javascript">
return [,,,,,,].map(function()Math.random()*50|1)
</pre>
However this one is by far the smallest, 49 bytes only, it is invalid because it doesn't fulfill the rules for the following reasons:
<ol>
	<li><code>map</code> is not part of ECMA-262 specification</li>
	<li><code>[,,,,,,]</code> is inconsistent across browsers, IE would create an array of 7 <code>undefined</code> values</li>
	<li>it's not in ascending order</li>
	<li>may contain duplicated values</li>
</ol>

So far the smallest solution that fulfills all the rules has 65 bytes:
<pre lang="javascript">
for(var v=[],m=6,n=49;m;--n)Math.random()*n>m?0:v[--m]=n;return v
</pre>

<h3>Revisiting</h3>
I've also contributed with my solution but with another fashion way: Using a single line chaining solution, i.e. no semi-colons separating statements, like: <code>return a().b.c().d.e()</code>

My solution has 200 bytes:
<pre lang="javascript">
return [0,0,0,0,0,0].join().replace(/0/g,function(){Array.a=Array.a||{};var x;while((x=Math.random()*50|1)in Array.a){}Array.a[x]=1;return x}).split(',').sort(function(a,b){delete Array.a;return a-b})
</pre>

It's not the smallest compared to the other solutions but it does fulfill the rules and is in a single line chaining. It might be a little obscure for some but I will break it down into smaller peaces:
<pre lang="javascript">
return
    [0,0,0,0,0,0]   // creates an array with 6 positions filled with 0's
    .join()         // converts the array into string: "0,0,0,0,0,0"
    .replace(/0/g,  // replaces all 0's in the string using the following function
        function () {
            Array.a = Array.a || {};        // augments Array with an object property only once
            var x;                          // variable to store a random number
            while (                         // while condition: assures no dupes
                (x =                        // assigning a value to x:
                    Math.random() * 50 | 1  // generates a random number times 50 or 1 (when 0)
                ) in Array.a                // checks if x isn't in the augmented Array object
            ) {}                            // empty block for while statement
            Array.a[x] = 1;                 // adds number as property into Array object
            return x                        // replaces the "0" found by the random x number
        }
    )               // end of replace function
    .split(',')     // converts string into array of strings using comma as separator
    .sort(          // sorts the array using the following compare function
        function (a, b) {   // elements to be compared
            delete Array.a; // restores Array, removing previously augmented property
            return a - b    // < 0 then a < b; = 0 then a = b; > 0 a > b
        }
    )               // end of sort, a sorted array is returned
</pre>

I also invite you to post your single line chaining solution as a comment. Happy chaining. ;-)
