--- 
layout: post
title: Limitation on call stacks
author: Marcel Duran
categories: [browser, javascript]
tags: [call stack, error, limitation]
---
Fellow Yahoo! [Nicholas Zakas][1] has blogged about some browsers limitations and recently ran some tests in order to check [browsers call stack sizes][2].

> Not surprisingly, different browsers have different call stack sizes. Also not surprisingly, the method that they use to determine the call stack varies as well. The various call stack sizes I could measure are (give or take, might be off by 1 or 2): 
> *   Internet Explorer 7: 1,789
> *   Firefox 3: 3,000
> *   Chrome 1: 21,837
> *   Opera 9.62: 10,000
> *   Safari 3.2: 500 In each case, the browser will end up stopping your code and (hopefully) display a message about the issue: 
> 
> *   Internet Explorer 7: "Stack overflow at line x"
> *   Firefox 3: "Too much recursion"
> *   Chrome 1: n/a
> *   Opera 9.62: "Abort (control stack overflow)"
> *   Safari 3.2: "RangeError: Maximum call stack size exceeded."

We ran some tests ourselves in order to get the call stack sizes on other browsers/hosts/OSs using this simple code:

{% highlight js%}
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
{% endhighlight %}

And got some interesting numbers/errors results:

on Ubuntu 8.04:  
*stack sizes*  
*   Firefox 3.0.10: 3,000
*   Chromium 2.0.174.0~svn20090412r13572: 21,828
*   Rhino 1.4r2: 338
*   SpiderMonkey 1.7.0: 1,000

*errors*  
*   Firefox 3.0.10: InternalError: too much recursion
*   Chromium 2.0.174.0~svn20090412r13572: RangeError: Maximum call stack size exceeded
*   Rhino 1.4r2: js: exception from uncaught JavaScript throw: java.lang.StackOverflowError
*   SpiderMonkey 1.7.0: InternalError: too much recursion

on Windows XP SP3:  
*stack sizes*  
*   Internet Explorer 6.0.2900.5512 SP3: 2,541
*   Internet Explorer 7.0.5730.13: 2,555
*   Internet Explorer 8.0.6001.18702: 3,076
*   Firefox 2.0.0.20: 1,000
*   Firefox 3.0.10: 3,000
*   Firefox 3.5 Beta 4: 3,000
*   Chrome 2.0.172.31: 21,838
*   Safari 4 Public Beta (528.16): 43,688
*   Opera 9.64: n/a

*errors*  
*   Internet Explorer 6.0.2900.5512 SP3: Error: Out of stack space
*   Internet Explorer 7.0.5730.13: Error: Out of stack space
*   Internet Explorer 8.0.6001.18702: Error: Out of stack space
*   Firefox 2.0.0.20: InternalError: too much recursion
*   Firefox 3.0.10: InternalError: too much recursion
*   Firefox 3.5 Beta 4: InternalError: too much recursion
*   Chrome 2.0.172.31: name: RangeError, type: stack_overflow, message: Maximum call stack size exceeded
*   Safari 4 Public Beta (528.16): RangeError: Maximum call stack size exceeded
*   Opera 9.64: Abort (control stack overflow). Script terminated.

You can see this code live and running [here][3].

 [1]: http://www.nczonline.net/about/
 [2]: http://www.nczonline.net/blog/2009/05/19/javascript-stack-overflow-error/
 [3]: http://sandbox.javascriptrules.com/stackoverflow/
