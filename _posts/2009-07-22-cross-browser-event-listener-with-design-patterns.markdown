--- 
layout: post
title: Cross-browser event listener with design patterns
author: Marcel Duran
categories:
    - browser
    - javascript
tags:
    - closure
    - design patterns
    - event listener
    - facade
    - lazy loading
    - memoization
    - singleton
---
A lot of the power of JavaScript comes from the ability to be an event-driven language. Dealing with event listeners is not a simple task considering different implementations by Internet Explorer and the rest of the world. After some searching on internet you have probably found some cross-browser solutions, although they are not always as efficient as it possibly could.  
I'll present some of them and explain their design pros and cons. All them do exactly the same, attach actions to events, none of them does [browser sniffing][1] to determine which event attachment technique to use, they use feature detection instead. For clarity sake, browser sniffing is a common technique on which an application tries to find out the user's browser, usually by examining the useragent string looking for vendor/version and is a common source of detection problems. On the other hand, feature detection is a much safer technique where the application checks if a certain feature (function, property) exists (is implemented) in the browser and once this feature is defined, use it, otherwise another feature is checked as a fallback.  
Some [design patterns][2] presented here are well covered in [Ross Harmes & Dustin Diaz's Pro JavaScript Design Patterns][3] book.

### facade

Very intuitive and also popular when quick searching on internet. Here the facade pattern simplifies the interface for attaching events by providing a common method to be used on your code which does the task of detecting features in order to provide a safe cross-browser implementation.

{% highlight js linenos %}
var addEvent = function (el, ev, fn) {
    if (el.addEventListener) {
        el.addEventListener(ev, fn, false);
    } else if (el.attachEvent) {
        el.attachEvent('on' + ev, fn);
    } else {
        el['on' + ev] = fn;
    }
};
{% endhighlight %}

**pros:** easy and clear to understand, small.  
**cons:** inefficient when used consecutive times, every time it's called a new checking is made in order to determine which feature is available for attaching event listeners. 

### memoization *version a*

Function rewriting is a powerful feature on JavaScript, it allows a function to be redefined by itself. When a function is invoked it can perform some tasks and before it returns, it can be redefined. Here memoization happens on lines 4, 9 and 14 depending on which feature is available in the host environment (browser). During the feature detection on this *version a* of memoization, the appropriate event attacher is first invoked then the function is rewritten.

{% highlight js linenos %}
var addEvent = function (el, ev, fn) {
    if (el.addEventListener) {
        el.addEventListener(ev, fn, false);
        addEvent = function (el, ev, fn) {
            el.addEventListener(ev, fn, false);
        };
    } else if (el.attachEvent) {
        el.attachEvent('on' + ev, fn);
        addEvent = function (el, ev, fn) {
            el.attachEvent('on' + ev, fn);
        };
    } else {
        el['on' + ev] = fn;
        addEvent = function (el, ev, fn) {
            el['on' + ev] =  fn;
        };
    }
};
{% endhighlight %}

**pros:** very efficient, feature detection is made only once as the addEvent function is rewritten with the appropriate event listener attacher function.  
**cons:** cost of the event listener function invocation prior to function rewriting, cost of function rewriting. 

### memoization *version b*

This technique is pretty similar to the one above except that during the feature detection the function is first rewritten with the appropriate event attacher then it is invoked only in the first execution.

{% highlight js linenos %}
var addEvent = function (el, ev, fn) {
    if (el.addEventListener) {
        addEvent = function (el, ev, fn) {
            el.addEventListener(ev, fn, false);
        };
    } else if (el.attachEvent) {
        addEvent = function (el, ev, fn) {
            el.attachEvent('on' + ev, fn);
        };
    } else {
        addEvent = function (el, ev, fn) {
            el['on' + ev] =  fn;
        };
    }
    addEvent(el, ev, fn);
};
{% endhighlight %}

**pros:** as efficient as version a, feature detection is made only once too.  
**cons:** cost of function rewriting first then cost of first invocation. 

### closure

A closure is a protected variable space, created by using nested functions.

{% highlight js linenos %}
var addEvent = (function () {
    if (window.addEventListener) {
        return function (el, ev, fn) {
            el.addEventListener(ev, fn, false);
        };
    } else if (window.attachEvent) {
        return function (el, ev, fn) {
            el.attachEvent('on' + ev, fn);
        };
    } else {
        return function (el, ev, fn) {
            el['on' + ev] =  fn;
        };
    }
}());
{% endhighlight %}

**pros:** detection is made as soon as the script where this function resides in is executed (note parenthesis on line 15), hence the detection is made only once, returning the appropriate event listener attacher to be used on new calls, useful when using it consecutively.  
**cons:** initial execution cost as it is executed right after loading, but considering its size and complexity can barely be noticed. Can be a bit obscure for beginners unfamiliar with closures. For those I suggest reading [Douglas Crockford's Private Members in JavaScript][4]. Closure consumes more memory because it carries with them the containing function's scope. 

### closure + singleton + lazy loading This technique makes use of 3 patterns: 

*   **closure** is defined by nested functions (lines 1 and 4) where the inner function (line 4) has access to its outer function variable *setListener* (line 2), it is invoked on line 22.
*   **singleton** is defined by using a single variable (line 2) that defines a function on lines 7, 11 and 15. It is checked on line 5 and always invoked on line 20.
*   **lazy loading** is used here for assigning the singleton variable when demanded as opposed to immediately after singleton definition.

{% highlight js linenos %}
var addEvent = (function () {
    var setListener;

    return function (el, ev, fn) {
        if (!setListener) {
            if (el.addEventListener) {
                setListener = function (el, ev, fn) {
                    el.addEventListener(ev, fn, false);
                };
            } else if (el.attachEvent) {
                setListener = function (el, ev, fn) {
                    el.attachEvent('on' + ev, fn);
                };
            } else {
                setListener = function (el, ev, fn) {
                    el['on' + ev] =  fn;
                };
            }
        }
        setListener(el, ev, fn);
    };
}());
{% endhighlight %}

**pros:** no time consuming when script is loaded, first execution (closure) is very fast as it only returns a function, event listener attacher is defined only once on demand.  
**cons:** it can be a bit obscure by mixing up 3 different techniques, after the first invocation every subsequent invocation has a verification on line 5 which will always return false however this is very subtle and also very cheap in JavaScript. All cons listed on closure pattern above. 

### closure + memoization **version a**

Here, closure takes part by returning an inner function that has access to its outer function *setListener* on line 2, it immediately invoked on line 24 returning a function that invokes *setListener* function. Within *setListener* function definition (lines 2-19) the memoization takes part inside every *if-else* by rewriting itself with the appropriate event attacher. In this technique the appropriate event attacher is first invoked during feature detection then the *setListener* function is rewritten.

{% highlight js linenos %}
var addEvent = (function () {
    var setListener = function (el, ev, fn) {
        if (el.addEventListener) {
            el.addEventListener(ev, fn, false);
            setListener = function (el, ev, fn) {
                el.addEventListener(ev, fn, false);
            };
        } else if (el.attachEvent) {
            el.attachEvent('on' + ev, fn);
            setListener = function (el, ev, fn) {
                el.attachEvent('on' + ev, fn);
            };
        } else {
            el['on' + ev] =  fn;
            setListener = function (el, ev, fn) {
                el['on' + ev] =  fn;
            };
        }
    };

    return function (el, ev, fn) {
        setListener(el, ev, fn);
    };
}());
{% endhighlight %}

**pros:** very efficient when used consecutively, pretty elegant code (you can use to impress your boss)  
**cons:** it can also be a bit obscure, specially for those not familiar to JavaScript patterns. All cons listed on closure pattern above. 

### closure + memoization *version b*

This technique is pretty much the same as above the only difference is that during feature detection which happens only once, the *setListener* function is first rewritten (lines 4,8,12) then it's invoked on line 16, only during the first call.

{% highlight js linenos %}
var addEvent = (function () {
    var setListener = function (el, ev, fn) {
        if (el.addEventListener) {
            setListener = function (el, ev, fn) {
                el.addEventListener(ev, fn, false);
            };
        } else if (el.attachEvent) {
            setListener = function (el, ev, fn) {
                el.attachEvent('on' + ev, fn);
            };
        } else {
            setListener = function (el, ev, fn) {
                el['on' + ev] =  fn;
            };
        }
        setListener(el, ev, fn);
    };

    return function (el, ev, fn) {
        setListener(el, ev, fn);
    };
}());
{% endhighlight %}

**pros:** same *pros* on *version a* above  
**cons:** same *cons* on *version a* above 

### conclusion

Very different techniques were presented in this post, all them have their pros and cons, it's up to the developer to choose which one to use, however the facade one is not indicated for performance issues but it can be useful to explain/introduce this design patterns for beginners.  
The examples above uses the most common JavaScript design patterns and can be combined in your applications for different purposes rather then event attacher, chosen for being a real world situation where developers face everyday.

 [1]: http://en.wikipedia.org/wiki/Browser_sniffing
 [2]: http://en.wikipedia.org/wiki/Design_pattern_(computer_science)
 [3]: http://www.javascriptrules.com/books/#rossharmes-dustindiaz
 [4]: http://www.crockford.com/javascript/private.html
