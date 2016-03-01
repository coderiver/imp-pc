$(function() {
    var root = $('body');
    var openedStack = [];

    $('[data-trigger]').on('click', function(e) {
        var _this = $(this);
        var parent = _this.parents('.drop');

        e.preventDefault();

        parent.toggleClass('is-open');
    });
});
