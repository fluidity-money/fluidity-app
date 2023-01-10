import jquery from 'https://cdn.skypack.dev/jquery';

const $ = jquery;

$(document).ready(function() {
    // Little lazy, but we're building a new site sooo...
    // A11y is still a concern as our select isn't _real_ per se
    $('.navbar-menu').fadeToggle(0);
    $('.navbar-beta-button-wrapper')
        .click(function() {
            $('.navbar-menu').fadeToggle("fast", "linear");
        });
    $('.navbar-menu')
        .children()
        .click(function() {
            window.location.href = $(this).attr("data-value");
        });
});
