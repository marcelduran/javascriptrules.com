--- 
layout: post
title: String searching algorithms in JavaScript engines
author: Marcel Duran
---
I've just finished chapter 7: Writing Efficient JavaScript by <a href="http://www.nczonline.net/" target="_blank">Nicholas Zakas</a> on <a href="http://stevesouders.com/" target="_blank">Steve Souders</a>' new book, <a href="http://www.javascriptrules.com/books/#stevesouders-evenfaster" target="_blank">Even Faster Web Sites</a>, where he presents several string optimization techniques to improve JavaScript performance and wondered which algorithm does <code>String.indexOf</code> method implements on <a href="http://en.wikipedia.org/wiki/JavaScript_engine" target="_blank">JavaScript engines</a> (aka <a href="http://en.wikipedia.org/wiki/List_of_ECMAScript_engines" target="_blank">ECMAScript engines</a>).
A few months ago I've asked this question to Yahoo! fellow <a href="http://crockford.com/" target="_blank">Douglas Crockford</a> and he said the ECMAScript standard does not require a specific algorithm, so it could vary with each browser. You can check that on section 15.5.4.7 of <a href="http://www.ecma-international.org/publications/standards/Ecma-262.htm" target="_blank">Standard ECMA-262</a>. I decided then to download the most popular open-source JavaScript engines source codes and found mainly 3 algorithms:

<!--more--><ul>
        <li><a href="http://en.wikipedia.org/wiki/String_searching_algorithm#Na.C3.AFve_string_search" target="_blank">Naïve</a>: simple and least inefficient way to search in strings, it basically checks every position in the haystack then every position of the needle. The advantage of using this algorithm is that it needs no initial overhead such as auxiliary tables creation. It has O(mn) complexity, where m is the needle length and n the haystack length.</li>
	<li><a href="http://en.wikipedia.org/wiki/Boyer_moore" target="_blank">Boyer-Moore</a>: Efficient searching string algorithm that preprocesses the needle and doesn't check every position in the haystack but rather skips some of them on each unsuccessful attempt. It has O(n) complexity with O(3n) in the worst case.</li>
	<li><a href="http://en.wikipedia.org/wiki/Boyer-Moore-Horspool_algorithm" target="_blank">Boyer-Moore-Horspool</a>: It's a simplification of Boyer-Moore's algorithm with less overhear during initial needle preprocessing. It also has O(n) complexity but O(mn) in the worst case.</li>
</ul>

<h3>Algorithms by engines</h3>
The <code>String.indexOf</code> algorithms by JavaScript engines follows:
<table border="0">
<tr><th>JavaScript Engine</th><th>Layout Engine</th><th>Browsers</th><th>String.indexOf algorithm</th></tr>
<tr><td><a href="https://developer.mozilla.org/en/SpiderMonkey" target="_blank">SpiderMonkey</a></td><td><a href="http://www.mozilla.org/newlayout/" target="_blank">Gecko</a></td><td>Firefox up to 3.0.*</td><td>Boyer-Moore-Horspool</td></tr>
<tr><td><a href="https://wiki.mozilla.org/JavaScript:TraceMonkey" target="_blank">TraceMonkey</a></td><td><a href="http://www.mozilla.org/newlayout/" target="_blank">Gecko</a></td><td>Firefox from 3.1.*</td><td>Boyer-Moore-Horspool</td></tr>
<tr><td><a href="http://api.kde.org/4.0-api/kdelibs-apidocs/kjs/html/index.html" target="_blank">KJS</a></td><td><a href="http://www.konqueror.org/features/browser.php" target="_blank">KHTML</a></td><td>Konqueror</td><td>Naïve</td></tr>
<tr><td><a href="http://webkit.org/projects/javascript/" target="_blank">JavaScriptCore</a></td><td><a href="http://webkit.org/" target="_blank">WebKit</a></td><td>Safari up to 3.*</td><td>Naïve</td></tr>
<tr><td><a href="http://trac.webkit.org/wiki/SquirrelFish" target="_blank">SquirrelFish</a></td><td><a href="http://webkit.org/" target="_blank">WebKit</a></td><td>Safari from 4.*</td><td>Naïve</td></tr>
<tr><td><a href="http://msdn.microsoft.com/en-us/library/hbxc2t98(VS.85).aspx" target="_blank">JScript</a></td><td><a href="http://msdn.microsoft.com/en-us/library/aa741317(VS.85).aspx" target="_blank">Trident</a></td><td>Internet Explorer</td><td>?</td></tr>
<tr><td><a href="http://code.google.com/p/v8/" target="_blank">V8</a></td><td><a href="http://webkit.org/" target="_blank">WebKit</a></td><td>Chrome</td><td>Strategy: Naïve, Boyer-Moore-Horspool and Boyer-Moore</td></tr>
<tr><td>Linear B</td><td><a href="http://en.wikipedia.org/wiki/Presto_(layout_engine)" target="_blank">Presto</a></td><td>Opera 7.0 - 9.50[</td><td>?</td></tr>
<tr><td>Futhark</td><td><a href="http://dev.opera.com/articles/view/presto-2-2-and-opera-10-a-first-look/" target="_blank">Presto Core 2</a></td><td>Opera from 9.50</td><td>?</td></tr>
<tr><td><a href="http://www.mozilla.org/rhino/" target="_blank">Rhino</a></td><td>-</td><td>-</td><td>java.lang.String.indexOf</td></tr>
</table>

<h4>SpiderMonkey</h4>
Implements the <code>String.indexOf</code> in C with some verifications in string lengths prior to run BMH algorithm in order to avoid long searching for relatively small strings.

Source code available at: <a href="ftp://ftp.mozilla.org/pub/mozilla.org/firefox/releases/3.0.13/source/firefox-3.0.13-source.tar.bz2" target="_blank">ftp://ftp.mozilla.org/pub/mozilla.org/firefox/releases/3.0.13/source/firefox-3.0.13-source.tar.bz2</a>
<h4>TraceMonkey</h4>
It has exactly the same <code>String.indexOf</code> implementation as SpiderMonkey but in C++.

Source code available at: <a href="ftp://ftp.mozilla.org/pub/mozilla.org/firefox/releases/3.5.2/source/firefox-3.5.2-source.tar.bz2" target="_blank">ftp://ftp.mozilla.org/pub/mozilla.org/firefox/releases/3.5.2/source/firefox-3.5.2-source.tar.bz2</a>
<h4>KJS</h4>
The main part of the naïve implementation of <code>indexOf</code> follows*:
<pre lang="cpp">
/* ... */
for (const UChar* c = data_ + pos; c <= end; c++)
    if (c->uc == fchar && !memcmp(c + 1, fdata, fsizeminusone))
        return (c - data_);

return -1;
</pre>
<em>* taken from KDE 4.0 API reference</em>

Files related to <code>String.indexOf</code> method:
<ul>
	<li>string_object.cpp: defines the prototype for String object where <code>indexOf</code> is in a switch case statement and calls <code>find</code> function.</li>
	<li>ustring.cpp: defines the <code>find</code> function where the naïve algorithm is implemented.</li>
</ul>

Browse the source code online: <a href="http://api.kde.org/4.0-api/kdelibs-apidocs/kjs/html/files.html" target="_blank">http://api.kde.org/4.0-api/kdelibs-apidocs/kjs/html/files.html</a>

<h4>JavaScriptCore & SquirrelFish</h4>
These engines are known as JavaScriptCore in WebKit Project and was originally derived from KJS, hence still shares the same algorithm for <code>String.indexOf</code>.

Files related to <code>String.indexOf</code> method:
<ul>
	<li>root/trunk/JavaScriptCore/runtime/StringPrototype.cpp: this is where <code>indexOf</code> method is defined and call <code>find</code> function</li>
	<li>root/trunk/JavaScriptCore/runtime/UString.cpp: look for <code>find</code> function</li>
</ul>

Source code available at: <a href="http://webkit.org/building/checkout.html" target="_blank">http://webkit.org/building/checkout.html</a>
Browse the source code online: <a href="http://trac.webkit.org/browser" target="_blank">http://trac.webkit.org/browser</a>

<h4>V8</h4>
A very smart strategy is applied to the string searching in order to choose the best algorithm based on the length of the needle:
<ul>
	<li>First of all it checks if there is a non-ASCII needle for an ASCII haystack and bail out if there is.</li>
	<li>Checks if the needle length is less than 5 then uses a naïve solution called <code>simpleIndexOf</code>, because the max shift of Boyer-Moore on such needle length doesn't compensate for the overhead. This <code>simpleIndexOf</code> function never bails out, it means that the needle will be checked for a match in the whole haystack.</li>
	<li>If the needle length is greater than or equals to 5 another <code>simpleIndexOf</code> function is called. This one considers how much work have been done (unsuccessful matches) in order to stop trying and switch for a better algorithm. This is called the "badness count" which once reached the max, stop the search and returns the index in the haystack where the next algorithm should continue from.</li>
	<li>The next algorithm in the strategy chain is Boyer-Moore-Horspool which also consider the badness count prior to jump to the next algorithm.</li>
	<li>The last one is Boyer-Moore which has some initial overhead when creating good and bad shift tables.</li>
</ul>

Source code available at: <a href="http://code.google.com/p/v8/wiki/Source?tm=4" target="_blank">http://code.google.com/p/v8/wiki/Source?tm=4</a>

<h4>Rhino</h4>
Rhino runs on top of Java Virtual Machine and uses the <code>java.lang.String.indexOf</code> from Java language implemented for such JVM. Interestingly there is a comment saying:

"Uses Java String.indexOf(). OPT to add - BMH searching from jsstr.c".

Where jsstr.c is the file for SpiderMonkey JavaScript String implementation. Implementing such algorithm in Java might degrade the search performance, unless the <code>java.lang.String.indexOf</code> implementation is much worse than that.

Source code available at: <a href="http://www.mozilla.org/rhino/download.html" target="_blank">http://www.mozilla.org/rhino/download.html</a>

<h4>Other engines</h4>
What about Internet Explorer, Opera and other browsers JavaScript engines? As they aren't open-source projects I could not check their codes out. :-(

<h3>Benchmark</h3>
By running a simple test across some browsers we can have an idea how fast/slow is <code>String.indexOf</code> on some JavaScript engines although this doesn't necessarily mean an algorithm is better than another because the performance of the engine itself might affect the outcome.
The test consists of the average of a 100 times running a search for the word "<em>foobar</em>" in the middle of a ~1200 length "<em>ipsum lorem</em>" text iterating 1 million times each search. <a href="http://sandbox.javascriptrules.com/indexof/" target="_blank">Try it</a> yourself.

The results in the follow table were taken by running this test on the same machine (Pentium 4HT, 3GHz, 1Gb RAM, Windows XP SP3).
<table>
<tr><th>JavaScript Engine</th><th>Browser</th><th>Version</th><th>Average (ms)</th></tr>
<tr><td>V8</td><td>Chrome</td><td>2.0.172.39</td><td class="right">827.66</td></tr>
<tr><td>SpiderMonkey</td><td>Firefox</td><td>3.0.13</td><td class="right">947.97</td></tr>
<tr><td>TraceMonkey</td><td>Firefox</td><td>3.5.2</td><td class="right">1169.25</td></tr>
<tr><td>SquirrelFish</td><td>Safari</td><td>4.0.2</td><td class="right">1207.02</td></tr>
<tr><td>KJS*</td><td>Konqueror</td><td>4.2.2</td><td class="right">1361.59</td></tr>
<tr><td>SpiderMonkey</td><td>Firefox</td><td>2.0.0.20</td><td class="right">1456.57</td></tr>
<tr><td>Futhark</td><td>Opera</td><td>10.00 beta 2</td><td class="right">1549.06</td></tr>
<tr><td>Futhark</td><td>Opera</td><td>9.64</td><td class="right">1613.02</td></tr>
<tr><td>JScript**</td><td>Internet Explorer</td><td>8.0</td><td class="right">3101.23</td></tr>
<tr><td>Rhino***</td><td>-</td><td>-</td><td class="right">4103.64</td></tr>
<tr><td>JScript</td><td>Internet Explorer</td><td>6.0</td><td class="right">4479.82</td></tr>
<tr><td>JScript</td><td>Internet Explorer</td><td>7.0</td><td class="right">4515.08</td></tr>
</table>
<em>* running on the same machine with Ubuntu 9.04 live cd</em>
<em>** running on a VM on a different computer</em>
<em>*** running on Sun JRE 6 - 1.6.0_14</em>

Again, these results don't prove which algorithm is the best due to different browser performances, however it is worth noting that Firefox 3.0.13 performed better than Firefox 3.5.2 on this benchmark. Internet Explorer had the worst results, it can be either the algorithm or the browser performance itself or even both. :-)
