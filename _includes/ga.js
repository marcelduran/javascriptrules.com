(function (doc, tag) {
    var h = doc.getElementsByTagName(tag)[0],
        s = doc.createElement(tag);

    _gaq = [['_setAccount', 'UA-8130902-1'],
        ['_trackPageview'], ['_trackPageLoadTime']];
    s.src = 'http://www.google-analytics.com/ga.js';
    s.async = 1;
    setTimeout(function () {h.parentNode.insertBefore(s, h);}, 0);
}(document, 'script'));
