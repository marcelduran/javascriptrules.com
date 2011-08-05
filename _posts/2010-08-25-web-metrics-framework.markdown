--- 
layout: post
title: Web Metrics Framework
author: Marcel Duran
categories:
    - performance
tags:
    - google
    - metrics
    - yslow
---
Recently [Google Web Metrics][1] report came across and inspired by my co-worker Stoyan Stefanov's [WTF - Web Testing Framework][2] I decided to build my own ruleset for [YSlow][3] using these metrics to check how good or bad pages are compared to Top and All Sites averages.

Last edition of [O'Reilly Velocity Conference][4], Stoyan demonstrated [how easy is to build your own YSlow ruleset][5] and following his [post][2] and [source code][6] I was able to make it. This first release of this [extension][7] of [extension][3] of [extension][8] features: 
*   Google Web Metrics from 2010-05-26
*   Top and All Sites metrics rulesets
*   Use percentile to score when available
*   Use SSH metrics for HTTPS pages

![Screenshot: Web Metrics Framework for YSlow for Firebug for Firefox][9] 
### Gimme!
*   The code is [in GitHub][10]
*   Install it from [Mozilla Addon Page][11] or [Download Page][12]

### Usage
After installing this extension you will see 2 new rulesets in the YSlow rulesets drop down list: 
1.  Web Metrics Framework - Top Sites
2.  Web Metrics Framework - All Sites

Choose one of these rulesets and click **Run Test** button. The current page will be evaluated using the Google web metrics data. 

### Metrics
The metrics provided by Google on its article are mainly averages with some percentiles and SSL data. YSlow rules need a lint function that evaluates an input returning a score from 0 to 100 which is later used to give the F to A score system using weights.  
Since not all metrics have percentiles I had to compare the page metrics with the average multiplied by a magic number (4) to create a range from 0 to 4 * average (if any statistic savvy here has comments on it please help me out to find a better way to evaluate) which is good enough to have an outcome where being in the average deserves a C. Perhaps Google releases new reports in future updates with all metrics percentiles, this extension could benefit from those numbers and become more accurate.  
If the page being checked is secure (HTTPS), the SSL data available on the report is used instead. The weighting distribution was given by:
1.  Every metric starts with 1
2.  Metrics with percentile get 1 more
3.  Metrics directly related to wire traffic payload or number of requests also get 1 more

*Again: statistics savvy, help me improving this extension with your valuable feedback*

### Conclusion
Although these metrics aren't 100% accurate (see [**Caveats section**][1] on Google's article) it's a good resource to compare your site with a sample of several billion pages crawled by Googlebot. Have fun!

WARNING: Like [JSLint][13], Web Metrics Framework might hurt your feelings :-)

DISCLAIMER: This extension is not related with Google Inc. or Yahoo! Inc.

 [1]: http://code.google.com/speed/articles/web-metrics.html
 [2]: http://www.phpied.com/wtf/
 [3]: http://developer.yahoo.com/yslow/
 [4]: http://en.oreilly.com/velocity2010
 [5]: http://en.oreilly.com/velocity2010/public/schedule/detail/15306
 [6]: http://github.com/stoyan/Web-Testing-Framework/
 [7]: http://labs.javascriptrules.com/wmf/
 [8]: http://getfirebug.com/
 [9]: {{ site.uri }}/images/wmf.png
 [10]: http://github.com/marcelduran/Web-Metrics-Framework
 [11]: https://addons.mozilla.org/en-US/firefox/addon/221495/
 [12]: http://labs.javascriptrules.com/wmf/download/
 [13]: http://jslint.com/
