--- 
layout: post
title: Finding prime numbers with Javascript
author: Rafael Coelho
categories:
    - javascript
tags:
    - algorithm
    - chrome
    - erastothenes
    - jvm
    - opera
    - primalty
    - prime
    - rhino
    - sieve
    - spoj
    - v8
---
A few days ago I introduced a friend of mine Jorge Rocha to [SPOJ][1] an online judge system for user-submitted programs, one of the first problems that he tried was the [Prime Generator][2] it consisted in finding all primes in a given range of numbers, after some time and few different algorithms he asked me if I had any tips to help him, although he had the correct algorithm [(Sieve of Eratosthenes)][3] something was clearly missing, the solution wasn't fast enough and I had no clue where to go from there, so as usual when a question like that comes up I resort to [Mauro Persano][4]... and obviously he knew the answer, he taught us how to apply a heuristic to the algorithm to help solve the problem and after doing so the code worked and the solution was approved.

Although I'm not really into crazy algorithms challenges I thought I'd give it a try just to see how fast the solution would be in JS, note that most of the solutions submitted are in C/C++ or Java, much faster than JS and to make things worst the interpreter was [Rhino][5], anyways we went ahead and recreated the solution in Javascript, so now it was time to test it... a little more tweaking to make it receive inputs via console and we had it running, right away we realized that our output via [stdout][6] was slowing us down, printing 10 times in a row all primes until 1 billion in the shell is not really fast but it was required to, I knew we had little or no chances to get approved but anyways we tried... and as I suspected we didn't get approved :(, but I decided to test locally in different browsers/engines with and without output.

Here are the results, I also built a [test runner][7] so you can test on your own: 
*   Chrome is usually the best, [V8][8] is blazing fast but it chokes when outputting the results through [WebKit][9]
*   Rhino does a great job specially with a high number of runs because of [JVM][10]
*   Firefox runs nicely with short ranges but stops the script because of the [long time running][11]
*   Opera wasn't fast but it never crashed or stopped

| Browser/Engine   | # of runs  | Avg(ms) 0 - 100 thousand | Avg(ms) 0 - 1 million |
| ---------------- | :--------: | -----------------------: | --------------------: |
| Rhino 1.7 \*     | 10         | 250                      | 2330                  |
| Firefox 3.5.3 \* | 10         | 670                      | Stopped               |
| Chrome 4.0 \*    | 10         | 32                       | 3050                  |
| Opera 10 \*      | 10         | 540                      | 4956                  |
| Rhino 1.7        | 100        | 34                       | 304                   |
| Firefox 3.5.3    | 100        | 20                       | Stopped               |
| Chrome 4.0       | 100        | 9                        | 128                   |
| Opera 10         | 100        | 100                      | 1213                  |

*\* With output (tested under [Ubuntu 9.04 Jaunty][12])*


 [1]: https://www.spoj.pl/
 [2]: https://www.spoj.pl/problems/PRIME1/
 [3]: http://en.wikipedia.org/wiki/Sieve_of_Eratosthenes
 [4]: http://fzort.org/mpr/
 [5]: http://www.mozilla.org/rhino/
 [6]: http://en.wikipedia.org/wiki/Standard_streams#Standard_output_.28stdout.29
 [7]: http://sandbox.javascriptrules.com/prime1/
 [8]: http://code.google.com/p/v8/
 [9]: http://webkit.org/
 [10]: http://en.wikipedia.org/wiki/Java_Virtual_Machine
 [11]: http://www.nczonline.net/blog/2009/01/05/what-determines-that-a-script-is-long-running/
 [12]: http://www.ubuntu.com/
