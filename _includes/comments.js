disqus_shortname = 'javascriptrules';
disqus_identifier = '{{ page.url }}';
disqus_url = '{{ site.uri }}{{ page.url }}/';

(function (doc, tag, place, script) {
    place = doc.getElementsByTagName(tag)[0];
    script = doc.createElement(tag);
    script.src = '//javascriptrules.disqus.com/embed.js';
    setTimeout(function () {
        place.parentNode.insertBefore(script, place);
    }, 0);
}(document, 'script'));
