disqus_shortname = 'javascriptrules';

(function (doc, tag, place, script) {
    place = doc.getElementsByTagName(tag)[0];
    script = doc.createElement(tag);
    script.src = '//javascriptrules.disqus.com/count.js';
    setTimeout(function () {
        place.parentNode.insertBefore(script, place);
    }, 0);
}(document, 'script'));
