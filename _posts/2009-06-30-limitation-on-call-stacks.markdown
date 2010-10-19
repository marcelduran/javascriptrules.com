--- 
layout: post
title: Limitation on call stacks
author: Marcel Duran
---
Fellow Yahoo! <a href="http://www.nczonline.net/about/">Nicholas Zakas</a> has blogged about some browsers limitations and recently ran some tests in order to check <a href="http://www.nczonline.net/blog/2009/05/19/javascript-stack-overflow-error/">browsers call stack sizes</a>.
<blockquote>
Not surprisingly, different browsers have different call stack sizes. Also not surprisingly, the method that they use to determine the call stack varies as well. The various call stack sizes I could measure are (give or take, might be off by 1 or 2):
<ul>
	<li>Internet Explorer 7: 1,789</li>
	<li>Firefox 3: 3,000</li>
	<li>Chrome 1: 21,837</li>
	<li>Opera 9.62: 10,000</li>
	<li>Safari 3.2: 500</li>
</ul>

In each case, the browser will end up stopping your code and (hopefully) display a message about the issue:
<ul>
	<li>Internet Explorer 7: “Stack overflow at line x”</li>
	<li>Firefox 3:”Too much recursion”</li>
	<li>Chrome 1: n/a</li>
	<li>Opera 9.62: “Abort (control stack overflow)”</li>
	<li>Safari 3.2:”RangeError: Maximum call stack size exceeded.”</li>
</ul>
</blockquote>

<!--more-->We ran some tests ourselves in order to get the call stack sizes on other browsers/hosts/OSs using this simple code:

<pre lang="javascript">
var i = 0;
 
function recurse () {
    i++;
    recurse();
}
 
try {
    recurse();
} catch (ex) {
    alert('i = ' + i + '\nerror: ' + ex);
}
</pre>

And got some interesting numbers/errors results:

on Ubuntu 8.04:
<em>stack sizes</em>
<ul>
	<li>Firefox 3.0.10: 3,000</li>
	<li>Chromium 2.0.174.0~svn20090412r13572: 21,828</li>
	<li>Rhino 1.4r2: 338</li>
	<li>SpiderMonkey 1.7.0: 1,000</li>
</ul>
<em>errors</em>
<ul>
	<li>Firefox 3.0.10: InternalError: too much recursion</li>
	<li>Chromium 2.0.174.0~svn20090412r13572: RangeError: Maximum call stack size exceeded</li>
	<li>Rhino 1.4r2: js: exception from uncaught JavaScript throw: java.lang.StackOverflowError</li>
	<li>SpiderMonkey 1.7.0: InternalError: too much recursion</li>
</ul>

on Windows XP SP3:
<em>stack sizes</em>
<ul>
	<li>Internet Explorer 6.0.2900.5512 SP3: 2,541</li>
	<li>Internet Explorer 7.0.5730.13: 2,555</li>
	<li>Internet Explorer 8.0.6001.18702: 3,076</li>
	<li>Firefox 2.0.0.20: 1,000</li>
	<li>Firefox 3.0.10: 3,000</li>
	<li>Firefox 3.5 Beta 4: 3,000</li>
	<li>Chrome 2.0.172.31: 21,838</li>
	<li>Safari 4 Public Beta (528.16): 43,688</li>
	<li>Opera 9.64: n/a</li>
</ul>

<em>errors</em>
<ul>
	<li>Internet Explorer 6.0.2900.5512 SP3: Error: Out of stack space</li>
	<li>Internet Explorer 7.0.5730.13: Error: Out of stack space</li>
	<li>Internet Explorer 8.0.6001.18702: Error: Out of stack space</li>
	<li>Firefox 2.0.0.20: InternalError: too much recursion</li>
	<li>Firefox 3.0.10: InternalError: too much recursion</li>
	<li>Firefox 3.5 Beta 4: InternalError: too much recursion</li>
	<li>Chrome 2.0.172.31: name: RangeError, type: stack_overflow, message: Maximum call stack size exceeded</li>
	<li>Safari 4 Public Beta (528.16): RangeError: Maximum call stack size exceeded</li>
	<li>Opera 9.64: Abort (control stack overflow). Script terminated.</li>
</ul>

You can see this code live and running <a href="http://sandbox.javascriptrules.com/stackoverflow/" target="_blank">here</a>.
