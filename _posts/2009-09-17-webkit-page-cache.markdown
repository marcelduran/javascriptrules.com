--- 
layout: post
title: WebKit Page Cache
author: Rafael Coelho
---
Performance on the web has always been a hot topic to talk about specially when you talk about page load, but you don't see as often people talking about perceived load which is related to how fast the interface responds to the user interaction, in this area <a href="http://en.wikipedia.org/wiki/WebKit#Browser_version_summary" target="_blank">WebKit based browsers</a> like Safari and Chrome from my point of view have always been ahead.

<!--more-->In the article <a href="http://webkit.org/blog/427/webkit-page-cache-i-the-basics/" target="_blank">WebKit Page Cache I – The Basics</a> Brady Eidson talks about the Page Cache feature on WebKit, as he stated it's not about caching in the HTTP sense, storing raw files on disk or even caching resources in memory. "More simply, when you leave the page we <em>pause</em> it and when you come back we press <em>play</em>.", this totally affects the perceived performance, when you hit the back button, even if you have files cached locally the browser will still have to load it again, run all your scripts, recreate the DOM and so on, so basically "When the Page Cache works it makes clicking the back button almost instantaneous."

The last time they updated Page Cache was back in '02 the web  has evolved a lot since then and it's not easy to keep up to date, you have to take in considetration HTTPS, plugins, frames, page events, although some of these issues have been fixed already like the frames problem, it still a long way to go, anyway it's great to see that they are working on it.
