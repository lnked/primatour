var body = document.body, timer;

window.addEventListener('scroll', function() {
    clearTimeout(timer);
    if(!body.classList.contains('disable-hover'))
    {
        body.classList.add('disable-hover')
    }

    timer = setTimeout(function(){
        body.classList.remove('disable-hover')
    }, 500);
}, false);

// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
;(function(){
    var cache = {};

    this.tmpl = function tmpl(str, data){
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
            cache[str] = cache[str] ||
                tmpl(document.getElementById(str).innerHTML) :

            // Generate a reusable function that will serve as a template
            // generator (and which will be cached).
            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +

                    // Introduce the data as local variables using with(){}
                    "with(obj){p.push('" +

                    // Convert the template into pure JavaScript
                    str
                        .replace(/[\r\t\n]/g, " ")
                        .split("<%").join("\t")
                        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                        .replace(/\t=(.*?)%>/g, "',$1,'")
                        .split("\t").join("');")
                        .split("%>").join("p.push('")
                        .split("\r").join("\\'")
                    + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn( data ) : fn;
    };
})();

(function($) {
    $.app = {
        run: function()
        {
            $('body').on('click', '.toggle-trigger', function(){
                var id = $(this).attr('href');
                if( $(id).length > 0 )
                {
                    if( $(this).hasClass('ul_list_item_link-drop') )
                    {
                        $(this).toggleClass('ul_list_item_link-drop-up');
                    }

                    $(id).slideToggle(150);
                    $('html, body').animate({ scrollTop: $(this).offset().top }, 'slow');
                }
                return false;
            });

            if( typeof $.initPopups !== 'undefined' )
            {
                $.initPopups();

                if(window.location.hash.length > 1 && $(window.location.hash).hasClass('popup') )
                {
                    try {
                        $.popup.open(window.location.hash.substr(1));
                    }
                    catch(e) {}
                }
            }
        }
    };

    $.app.form_validation_default = function($form, errors) {
        $form.find('.form_error_block').hide();
        $form.find('.error').removeClass('error');
        $form.find('.checkbox__label-error').removeClass('checkbox__label-error');
        if(errors) {
            $form.find('.form_error_block').show();
            for(fieldName in errors)
            {
                if( $form.find('input[name="'+fieldName+'"]').length > 0 )
                {
                    $field = $form.find('input[name="'+fieldName+'"]');
                }

                if( $form.find('select[name="'+fieldName+'"]').length > 0 )
                {
                    $field = $form.find('select[name="'+fieldName+'"]');
                }

                if( $form.find('textarea[name="'+fieldName+'"]').length > 0 )
                {
                    $field = $form.find('textarea[name="'+fieldName+'"]');
                }

                if( $field.closest('.checkbox__label').length > 0 )
                {
                    $field.closest('.checkbox__label').addClass('checkbox__label-error');
                }
                else
                {
                    $field.addClass('error');
                }
            }
        }
    };

    $.app.callback_stack = {};
    $.app.callback_stack.form_ajax_default = function($form, response) {
        if(response.status) {
            if(response.hasOwnProperty('redirect_url')) {
                window.location.href = response.redirect_url;
            }
        }
        else if(response.errors) {
            $.app.form_validation_default($form, response.errors);
        }
        
        if(response.hasOwnProperty('message')) {
            $.popup.message(response.title, response.message);
        }
    };

    $.app.form_ajax = function() {
        $('body').on('submit' ,'.form-ajax', function(e) {
            var $form = $(this);
            e.preventDefault();
            
            $.ajax({
                url: $form.attr('action'),
                type: ($form.attr('method') || 'post'),
                data: $form.serialize(),
                dataType: 'json',
                success: function(response)
                {
                    if($form.data('callback') && $.app.callback_stack.hasOwnProperty($form.data('callback'))) {
                        $.app.callback_stack[$form.data('callback')]($form, response);
                    }
                    else {
                        $.app.callback_stack.form_ajax_default($form, response);
                    }

                    if( response.status === true && response.message !== '' )
                    {
                        $.popup.message( response.title, response.message );
                    }
                },
                error: function(response)
                {
                    $.app.callback_stack.form_ajax_default($form, response);
                    alert("error");
                }
            });
        });
    };

    $.app.form_ajax();

    $.app.run();
})(jQuery);