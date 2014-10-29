$(document).ready(function() {
    var setHeight = function() {
        $('#hello').css('height', $(window).height());
    };
    $(window).resize(setHeight);
    setHeight();
});