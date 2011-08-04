--- 
layout: post
title: Harnessing the juice out of Yahoo! Pipes
author: Rafael Coelho
categories:
    - yql
tags:
    - pipes
    - webservice
    - ws
    - yahoo!
    - yql
---
While working on my current project at Yahoo! I had the need to aggregate different search feeds, the requirement was to have a way to pass a param to the url like *search=search_term*, and this would be passed along to the the feeds and it would return results from all the feeds (obviously it had to be done in the front end only), I thought about adding more [YQL][1] requests to my app but I didn't want to change the code since we were planning on having a re-factor of this part of the code, so super [Yahoo! Pipes][2] to the rescue, it was a really easy task and got more than I asked for, like filters and sorting... the example speaks for itself: [pipe example][3] you can clone it and play with it.

You can also check all the other cool examples created by Paul Donnelly <http://pipes.yahoo.com/31337> or even check [Pipes Blog][4] for their latest updates.

 [1]: http://developer.yahoo.com/yql/console
 [2]: http://pipes.yahoo.com
 [3]: http://pipes.yahoo.com/pipes/pipe.info?_id=4c40a274bec11e41ab22e5c91e5df9f2
 [4]: http://blog.pipes.yahoo.net/
