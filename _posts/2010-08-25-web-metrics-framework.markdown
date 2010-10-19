--- 
layout: post
title: Web Metrics Framework
author: Marcel Duran
---
Recently <a href="http://code.google.com/speed/articles/web-metrics.html" target="_blank">Google Web Metrics</a> report came across and inspired by my co-worker Stoyan Stefanov's <a href="http://www.phpied.com/wtf/" target="_blank">WTF - Web Testing Framework</a> I decided to build my own ruleset for <a href="http://developer.yahoo.com/yslow/" target="_blank">YSlow</a> using these metrics to check how good or bad pages are compared to Top and All Sites averages.

<!--more-->Last edition of <a href="http://en.oreilly.com/velocity2010" target="_blank">O'Reilly Velocity Conference</a>, Stoyan demonstrated <a href="http://en.oreilly.com/velocity2010/public/schedule/detail/15306" target="_blank">how easy is to build your own YSlow ruleset</a> and following his <a href="http://www.phpied.com/wtf/" target="_blank">post</a> and <a href="http://github.com/stoyan/Web-Testing-Framework/" target="_blank">source code</a> I was able to make it.
This first release of this <a href="http://labs.javascriptrules.com/wmf/" target="_blank">extension</a> of <a href="http://developer.yahoo.com/yslow/" target="_blank">extension</a> of <a href="http://getfirebug.com/" target="_blank">extension</a> features:
<ul>
	<li>Google Web Metrics from 2010-05-26</li>
	<li>Top and All Sites metrics rulesets</li>
	<li>Use percentile to score when available</li>
	<li>Use SSH metrics for HTTPS pages</li>
</ul>
<img src="http://cdn-javascriptrules.2static.it/i/posts/wmf.png" alt="Screenshot: Web Metrics Framework for YSlow for Firebug for Firefox" />
<h3>Gimme!</h3>
<ul>
	<li>The code is <a href="http://github.com/marcelduran/Web-Metrics-Framework" target="_blank">in GitHub</a></li>
	<li>Install it from <a href="https://addons.mozilla.org/en-US/firefox/addon/221495/">Mozilla Addon Page</a> or <a href="http://labs.javascriptrules.com/wmf/download/">Download Page</a></li>
</ul>

<h3>Usage</h3>
After installing this extension you will see 2 new rulesets in the YSlow rulesets drop down list:
<ol>
	<li>Web Metrics Framework - Top Sites</li>
	<li>Web Metrics Framework - All Sites</li>
</ol>
Choose one of these rulesets and click <strong>Run Test</strong> button. The current page will be evaluated using the Google web metrics data.

<h3>Metrics</h3>
The metrics provided by Google on its article are mainly averages with some percentiles and SSL data. YSlow rules need a lint function that evaluates an input returning a score from 0 to 100 which is later used to give the F to A score system using weights.
Since not all metrics have percentiles I had to compare the page metrics with the average multiplied by a magic number (4) to create a range from 0 to 4*average (if any statistic savvy here has comments on it please help me out to find a better way to evaluate) which is good enough to have an outcome where being in the average deserves a C. Perhaps Google releases new reports in future updates with all metrics percentiles, this extension could benefit from those numbers and become more accurate. 
If the page being checked is secure (HTTPS), the SSL data available on the report is used instead.
The weighting distribution was given by:
<ol>
	<li>Every metric starts with 1</li>
	<li>Metrics with percentile get 1 more</li>
	<li>Metrics directly related to wire traffic payload or number of requests also get 1 more</li>
</ol>

<em>* Again: statistics savvy, help me improving this extension with your valuable feedback</em>

<h3>Conclusion</h3>
Although these metrics aren't 100% accurate (see <a href="http://code.google.com/speed/articles/web-metrics.html" target="_blank"> <strong>Caveats section</strong></a> on Google's article) it's a good resource to compare your site with a sample of several billion pages crawled by Googlebot. Have fun!

WARNING: Like <a href="http://jslint.com/" target="_blank">JSLint</a>, Web Metrics Framework might hurt your feelings :-)

DISCLAIMER: This extension is not related with Google Inc. or Yahoo! Inc.
