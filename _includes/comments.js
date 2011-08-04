var disqus_shortname = 'javascriptrules',
    disqus_identifier = '{{ page.url }}',
    disqus_url = '{{ site.uri }}{{ page.url }}';

(function (doc, tag) {
    var h = doc.getElementsByTagName(tag)[0],
        s = doc.createElement(tag);

    s.src = 'http://javascriptrules.disqus.com/embed.js';
    s.async = 1;
    setTimeout(function () {h.parentNode.insertBefore(s, h);}, 0);
}(document, 'script'));
