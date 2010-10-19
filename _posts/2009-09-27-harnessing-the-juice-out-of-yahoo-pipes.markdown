--- 
layout: post
title: Harnessing the juice out of Yahoo! Pipes
author: Rafael Coelho
---
While working on my current project at Yahoo! I had the need to aggregate different search feeds, the requirement was to have a way to pass a param to the url like <em>search=search_term</em>, and this would be passed along to the the feeds and it would return results from all the feeds (obviously it had to be done in the front end only), I thought about adding more <a href="http://developer.yahoo.com/yql/console" target="_blank">YQL</a> requests to my app but I didn't want to change the code since we were planning on having a re-factor of this part of the code, so super <a href="http://pipes.yahoo.com" target="_self">Yahoo! Pipes</a> to the rescue, it was a really easy task and got more than I asked for, like filters and sorting... the example speaks for itself: <a href="http://pipes.yahoo.com/pipes/pipe.info?_id=4c40a274bec11e41ab22e5c91e5df9f2" target="_self">pipe example</a> you can clone it and play with it.

You can also check all the other cool examples created by Paul Donnelly <a href="http://pipes.yahoo.com/31337" target="_self">http://pipes.yahoo.com/31337</a> or even check <a href="http://blog.pipes.yahoo.net/">Pipes Blog</a> for their latest updates.
