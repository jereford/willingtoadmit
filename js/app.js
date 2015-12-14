
$(function() {
    console.log('running');

    // var slider = $('#slider');
    $('.slider').slick({
        dots: true,
        infinite: true,
        speed: 100,
        fade: true,
        cssEase: 'linear',
        autoplay: true,
        variableWidth: true
    });

});
