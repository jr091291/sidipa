/**
 * Created by Ricardo on 23/04/2016.
 */
$(document).ready(function(){
    /*
    * Plugin animate Css
    */
    $.fn.extend({
        animateCss: function (animationName) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            $(this).addClass('animated ' + animationName).one(animationEnd, function () {
                $(this).removeClass('animated ' + animationName);
            });
        }
    });

    /*
     * Evento Scroll
     */
    var logo = $('#logo')[0];
    logo.style.marginBottom = 0;
    window.onscroll = function() {
        altoLogo = logo.height;
        scroll = window.scrollY;
        ope = altoLogo - scroll;
        margin = parseInt(logo.style.marginBottom);
        if (ope > 60) {
            logo.height = ope;
        }
        if((margin - scroll)>-100){
            logo.style.marginBottom = margin - scroll;
        }
    }
});

function htmldecode(s)
{
    var el = document.createElement("div");
    el.innerHTML = s;
    s = el.innerHTML;
    return s;
}