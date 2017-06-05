;(function($) {
    $('body').on('click', '.open-pure-popup', function(e) {
        e.preventDefault();

        var selector = $(this).attr('href').substr(1);

        var $popup = $.popup._getPopup(selector);
        var position = $.popup.getPosition($popup);

        $popup.addClass('pure-popup');

        $popup.css(position);

        $popup.animate({ 'opacity': 'show' }, 250, function() {
            $('body').trigger('popup.after_open', $popup);
        }).addClass('is-open');

        $popup.find('.popup__btn-close').on('click', function(e) {
            e.preventDefault();

            $popup.animate({ 'opacity': 'hide' }, 250);

            return false;
        });

        return false;
    });
})(jQuery);