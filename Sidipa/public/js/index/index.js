/**
 * Created by Ricardo on 23/04/2016.
 */

$(document).ready(function(){
    var canvas = $('#myCanvas')[0];
    resizeCanvas(canvas);

    window.onresize = function(){
        resizeCanvas(canvas);
    }

    /*
     * Panel Control chat
     */
    $('#btnChat').click(function(){
        show();
    });
    $('#btnCloseChat').click(function () {
        show();
    });

    /*
     * Panel Control simulacion
     */
    $('#controlPanel').click(function () {
        showControl();
    });
    $('#btnCloseControl').click(function () {
        showControl();
    });
})

function resizeCanvas(canvas){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 150;
    $('#ctr_amplitud')[0].max = (canvas.height/2).toFixed();
}

var controlVisible = false;
var chatVisible = false;

function show() {
    if (!chatVisible) {
        $('#chat').removeClass('hide');
        $('#chat').animateCss('flipInY');
        chatVisible = true;
    }
    else {
        $('#chat').addClass('animated  slideOutRight');
        $('#chat').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass('animated slideOutRight');
            $(this).addClass('hide');
        });
        chatVisible = false;
    }
}

function showControl() {
    if (!controlVisible) {
        $('#simulacionControl').removeClass('hide');
        $('#simulacionControl').animateCss('slideInUp');
        controlVisible = true;
    }
    else {
        $('#simulacionControl').addClass('animated  bounceOut');
        $('#simulacionControl').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass('animated bounceOut');
            $(this).addClass('hide');
        });
        controlVisible = false;
    }
}