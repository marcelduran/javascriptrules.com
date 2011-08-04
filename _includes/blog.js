(function (doc) {
    var lbl = doc.getElementById('lbl'),
        sbx = doc.getElementById('sbx');

    sbx.onfocus = function () {
        lbl.className = 'offscreen';
    };
    sbx.onblur = function () {
        if (!sbx.value) {
            lbl.className = '';
        }
    }
}(document));
