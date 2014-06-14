requirejs.config({
    baseUrl: "/js",
    paths: {
        "jquery": "lib/jquery/jquery",
        "text": "lib/requirejs-text/text",
        "bootstrap": "lib/bootstrap/bootstrap"
    },
    shim: {
       "bootstrap": {
          deps: ["jquery"]
        }
    }
});

require(["jquery", 
    "bootstrap",
    "teji/lunch/fbInit"], function($, bootstrap) {
    fbInit.load();
    // prevent keep opening dropdown after page load
    $('.dropdown-menu').dropdown('toggle');
});