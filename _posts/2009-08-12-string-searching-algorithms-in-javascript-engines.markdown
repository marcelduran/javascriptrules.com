--- 
layout: post
title: String searching algorithms in JavaScript engines
author: Marcel Duran
categories:
    - algorithm
    - browser
    - javascript
    - performance
tags:
    - boyer-moore
    - ecma
    - ecmascript
    - indexOf
    - javascriptcore
    - kjs
    - naïve
    - spidermonkey
    - string
    - tracemonkey
    - v8
    - webkit
---
I've just finished chapter 7: Writing Efficient JavaScript by [Nicholas Zakas][1] on [Steve Souders][2]' new book, [Even Faster Web Sites][3], where he presents several string optimization techniques to improve JavaScript performance and wondered which algorithm does `String.indexOf` method implements on [JavaScript engines][4] (aka [ECMAScript engines][5]).  
A few months ago I've asked this question to Yahoo! fellow [Douglas Crockford][6] and he said the ECMAScript standard does not require a specific algorithm, so it could vary with each browser. You can check that on section 15.5.4.7 of [Standard ECMA-262][7]. I decided then to download the most popular open-source JavaScript engines source codes and found mainly 3 algorithms:
 
*   [Naïve][8]: simple and least inefficient way to search in strings, it basically checks every position in the haystack then every position of the needle. The advantage of using this algorithm is that it needs no initial overhead such as auxiliary tables creation. It has O(mn) complexity, where m is the needle length and n the haystack length.
*   [Boyer-Moore][9]: Efficient searching string algorithm that preprocesses the needle and doesn't check every position in the haystack but rather skips some of them on each unsuccessful attempt. It has O(n) complexity with O(3n) in the worst case.
*   [Boyer-Moore-Horspool][10]: It's a simplification of Boyer-Moore's algorithm with less overhear during initial needle preprocessing. It also has O(n) complexity but O(mn) in the worst case.

### Algorithms by engines
The `String.indexOf` algorithms by JavaScript engines follows:

| JavaScript Engine   | Layout Engine       | Browsers            | String.indexOf algorithm                               |
| ------------------- | ------------------- | ------------------- | ------------------------------------------------------ |
| [SpiderMonkey][12]  | [Gecko][13]         | Firefox up to 3.0.\*| Boyer-Moore-Horspool                                   |
| [TraceMonkey][14]   | [Gecko][13]         | Firefox from 3.1.\* | Boyer-Moore-Horspool                                   |
| [KJS][15]           | [KHTML][16]         | Konqueror           | Naïve                                                  |
| [JavaScriptCore][17]| [WebKit][18]        | Safari up to 3.\*   | Naïve                                                  |
| [SquirrelFish][19]  | [WebKit][18]        | Safari from 4.\*    | Naïve                                                  |
| [JScript][20]       | [Trident][21]       | Internet Explorer   | ?                                                      |
| [V8][22]            | [WebKit][18]        | Chrome              | Strategy: Naïve, Boyer-Moore-Horspool and Boyer-Moore  |
| Linear B            | [Presto][23]        | Opera 7.0 - 9.50\[  | ?                                                      |
| Futhark             | [Presto Core 2][24] | Opera from 9.50     | ?                                                      |
| [Rhino][25]         | -                   | -                   | java.lang.String.indexOf                               |

#### SpiderMonkey
Implements the `String.indexOf` in C with some verifications in string lengths prior to run BMH algorithm in order to avoid long searching for relatively small strings.

Source code available at: <ftp://ftp.mozilla.org/pub/mozilla.org/firefox/releases/3.0.13/source/firefox-3.0.13-source.tar.bz2> 

#### TraceMonkey
It has exactly the same `String.indexOf` implementation as SpiderMonkey but in C++.

Source code available at: <ftp://ftp.mozilla.org/pub/mozilla.org/firefox/releases/3.5.2/source/firefox-3.5.2-source.tar.bz2> 

#### KJS
The main part of the naïve implementation of `indexOf` follows\*:
{% highlight cpp %}
/* ... */
for (const UChar* c = data_ + pos; c &lt;= end; c++)
    if (c->uc == fchar && !memcmp(c + 1, fdata, fsizeminusone))
        return (c - data_);

return -1;
{% endhighlight %}

*\* taken from KDE 4.0 API reference*

Files related to `String.indexOf` method: 
*   string_object.cpp: defines the prototype for String object where `indexOf` is in a switch case statement and calls `find` function.
*   ustring.cpp: defines the `find` function where the naïve algorithm is implemented.

Browse the source code online: <http://api.kde.org/4.0-api/kdelibs-apidocs/kjs/html/files.html> 

#### JavaScriptCore & SquirrelFish
These engines are known as JavaScriptCore in WebKit Project and was originally derived from KJS, hence still shares the same algorithm for `String.indexOf`.

Files related to `String.indexOf` method: 
*   root/trunk/JavaScriptCore/runtime/StringPrototype.cpp: this is where `indexOf` method is defined and call `find` function
*   root/trunk/JavaScriptCore/runtime/UString.cpp: look for `find` function

Source code available at: <http://webkit.org/building/checkout.html>  
Browse the source code online: <http://trac.webkit.org/browser> 

#### V8
A very smart strategy is applied to the string searching in order to choose the best algorithm based on the length of the needle: 

*   First of all it checks if there is a non-ASCII needle for an ASCII haystack and bail out if there is.
*   Checks if the needle length is less than 5 then uses a naïve solution called `simpleIndexOf`, because the max shift of Boyer-Moore on such needle length doesn't compensate for the overhead. This `simpleIndexOf` function never bails out, it means that the needle will be checked for a match in the whole haystack.
*   If the needle length is greater than or equals to 5 another `simpleIndexOf` function is called. This one considers how much work have been done (unsuccessful matches) in order to stop trying and switch for a better algorithm. This is called the "badness count" which once reached the max, stop the search and returns the index in the haystack where the next algorithm should continue from.
*   The next algorithm in the strategy chain is Boyer-Moore-Horspool which also consider the badness count prior to jump to the next algorithm.
*   The last one is Boyer-Moore which has some initial overhead when creating good and bad shift tables.

Source code available at: <http://code.google.com/p/v8/wiki/Source?tm=4> 

#### Rhino
Rhino runs on top of Java Virtual Machine and uses the `java.lang.String.indexOf` from Java language implemented for such JVM. Interestingly there is a comment saying:

*"Uses Java String.indexOf(). OPT to add - BMH searching from jsstr.c".*

Where jsstr.c is the file for SpiderMonkey JavaScript String implementation. Implementing such algorithm in Java might degrade the search performance, unless the `java.lang.String.indexOf` implementation is much worse than that. 

Source code available at: <http://www.mozilla.org/rhino/download.html> 

#### Other engines
What about Internet Explorer, Opera and other browsers JavaScript engines? As they aren't open-source projects I could not check their codes out. :-( 

### Benchmark
By running a simple test across some browsers we can have an idea how fast/slow is `String.indexOf` on some JavaScript engines although this doesn't necessarily mean an algorithm is better than another because the performance of the engine itself might affect the outcome.  
The test consists of the average of a 100 times running a search for the word "*foobar*" in the middle of a ~1200 length "*ipsum lorem*" text iterating 1 million times each search. [Try it][11] yourself.

The results in the follow table were taken by running this test on the same machine (Pentium 4HT, 3GHz, 1Gb RAM, Windows XP SP3).

| JavaScript Engine | Browser           | Version      | Average (ms) |
| ----------------- | ----------------- | ------------ | ------------ |
| V8                | Chrome            | 2.0.172.39   | 827.66       |
| SpiderMonkey      | Firefox           | 3.0.13       | 947.97       |
| TraceMonkey       | Firefox           | 3.5.2        | 1169.25      |
| SquirrelFish      | Safari            | 4.0.2        | 1207.02      |
| KJS\*             | Konqueror         | 4.2.2        | 1361.59      |
| SpiderMonkey      | Firefox           | 2.0.0.20     | 1456.57      |
| Futhark           | Opera             | 10.00 beta 2 | 1549.06      |
| Futhark           | Opera             | 9.64         | 1613.02      |
| JScript\*\*       | Internet Explorer | 8.0          | 3101.23      |
| Rhino\*\*\*       | -                 | -            | 4103.64      |
| JScript           | Internet Explorer | 6.0          | 4479.82      |
| JScript           | Internet Explorer | 7.0          | 4515.08      |

*\* running on the same machine with Ubuntu 9.04 live cd*  
*\*\* running on a VM on a different computer*  
*\*\*\* running on Sun JRE 6 - 1.6.0_14*

Again, these results don't prove which algorithm is the best due to different browser performances, however it is worth noting that Firefox 3.0.13 performed better than Firefox 3.5.2 on this benchmark. Internet Explorer had the worst results, it can be either the algorithm or the browser performance itself or even both. :-)

 [1]: http://www.nczonline.net/
 [2]: http://stevesouders.com/
 [3]: http://www.javascriptrules.com/books/#stevesouders-evenfaster
 [4]: http://en.wikipedia.org/wiki/JavaScript_engine
 [5]: http://en.wikipedia.org/wiki/List_of_ECMAScript_engines
 [6]: http://crockford.com/
 [7]: http://www.ecma-international.org/publications/standards/Ecma-262.htm
 [8]: http://en.wikipedia.org/wiki/String_searching_algorithm#Na.C3.AFve_string_search
 [9]: http://en.wikipedia.org/wiki/Boyer_moore
 [10]: http://en.wikipedia.org/wiki/Boyer-Moore-Horspool_algorithm
 [11]: http://sandbox.javascriptrules.com/indexof/
 [12]: https://developer.mozilla.org/en/SpiderMonkey
 [13]: http://www.mozilla.org/newlayout/
 [14]: https://wiki.mozilla.org/JavaScript:TraceMonkey
 [15]: http://api.kde.org/4.0-api/kdelibs-apidocs/kjs/html/index.html
 [16]: http://www.konqueror.org/features/browser.php
 [17]: http://webkit.org/projects/javascript/
 [18]: http://webkit.org/
 [19]: http://trac.webkit.org/wiki/SquirrelFish
 [20]: http://msdn.microsoft.com/en-us/library/hbxc2t98(VS.85).aspx
 [21]: http://msdn.microsoft.com/en-us/library/aa741317(VS.85).aspx
 [22]: http://code.google.com/p/v8/
 [23]: http://en.wikipedia.org/wiki/Presto_(layout_engine)
 [24]: http://dev.opera.com/articles/view/presto-2-2-and-opera-10-a-first-look/
 [25]: http://www.mozilla.org/rhino/
