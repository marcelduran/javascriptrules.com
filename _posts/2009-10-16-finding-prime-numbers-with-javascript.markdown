--- 
layout: post
title: Finding prime numbers with Javascript
author: Rafael Coelho
---
A few days ago I introduced a friend of mine Jorge Rocha to <a href="https://www.spoj.pl/">SPOJ</a> an online judge system for user-submitted programs, one of the first problems that he tried was the <a href="https://www.spoj.pl/problems/PRIME1/">Prime Generator</a> it consisted in finding all primes in a given range of numbers, after some time and few different algorithms he asked me if I had any tips to help him, although he had the correct algorithm <a href="http://en.wikipedia.org/wiki/Sieve_of_Eratosthenes">(Sieve of Eratosthenes)</a> something was clearly missing, the solution wasn't fast enough and I had no clue where to go from there, so as usual when a question like that comes up I resort to <a href="http://fzort.org/mpr/">Mauro Persano</a>... and obviously he knew the answer, he taught us how to apply a heuristic to the algorithm to help solve the problem and after doing so the code worked and the solution was approved.

<!--more-->Although I'm not really into crazy algorithms challenges I thought I'd give it a try just to see how fast the solution would be in JS, note that most of the solutions submitted are in C/C++ or Java, much faster than JS and to make things worst the interpreter was <a href="http://www.mozilla.org/rhino/">Rhino</a>, anyways we went ahead and recreated the solution in Javascript, so now it was time to test it... a little more tweaking to make it receive inputs via console and we had it running, right away we realized that our output via <a href="http://en.wikipedia.org/wiki/Standard_streams#Standard_output_.28stdout.29">stdout</a> was slowing us down, printing 10 times in a row all primes until 1 billion in the shell is not really fast but it was required to, I knew we had little or no chances to get approved but anyways we tried... and as I suspected we didn't get approved :(, but I decided to test locally in different browsers/engines with and without output.

Here are the results, I also built a <a href="http://sandbox.javascriptrules.com/prime1/" target="_blank">test runner</a> so you can test on your own:

<ul>
<li>Chrome is usually the best, <a href="http://code.google.com/p/v8/">V8</a> is blazing fast but it chokes when outputting the results through <a href="http://webkit.org/">WebKit</a></li>
<li>Rhino does a great job specially with a high number of runs because of <a href="http://en.wikipedia.org/wiki/Java_Virtual_Machine">JVM</a></li>
<li>Firefox runs nicely with short ranges but stops the script because of the <a href="http://www.nczonline.net/blog/2009/01/05/what-determines-that-a-script-is-long-running/">long time running</a></li>
<li>Opera wasn't fast but it never crashed or stopped</li>
</ul>
<br/>
<table border="0" align="center" width="100%">
	<tr>
		<th rowspan="2">Browser/Engine</th>
		<th rowspan="2"># of runs</th>
		<th colspan="2">Avg Time (ms)</th>
	</tr>
	<tr>
		<th>Range: 0 - 100 thousand</th>
		<th>Range: 0 - 1 million</th>
	</tr>
	<tr>
		<td>Rhino 1.7 *</td>
		<td align="center">10</td>
		<td align="right">250</td>
		<td align="right">2330</td>
	</tr>
	<tr>
		<td>Firefox 3.5.3 *</td>
		<td align="center">10</td>
		<td align="right">670</td>
		<td align="right">Stopped</td>
	</tr>
	<tr>
		<td>Chrome 4.0 *</td>
		<td align="center">10</td>
		<td align="right">32</td>
		<td align="right">3050</td>
	</tr>
	<tr>
		<td>Opera 10 *</td>
		<td align="center">10</td>
		<td align="right">540</td>
		<td align="right">4956</td>
	</tr>
	<tr>
		<td>Rhino 1.7</td>
		<td align="center">100</td>
		<td align="right">34</td>
		<td align="right">304</td>
	</tr>
	<tr>
		<td>Firefox 3.5.3</td>
		<td align="center">100</td>
		<td align="right">20</td>
		<td align="right">Stopped</td>
	</tr>
	<tr>
		<td>Chrome 4.0</td>
		<td align="center">100</td>
		<td align="right">9</td>
		<td align="right">128</td>
	</tr>
	<tr>
		<td>Opera 10</td>
		<td align="center">100</td>
		<td align="right">100</td>
		<td align="right">1213</td>
	</tr>
	<tr>
		<td colspan="4">* With output (tested under <a href="http://www.ubuntu.com/">Ubuntu 9.04 Jaunty</a>)</td>
	</tr>
</table>
