requirejs.config({
    baseUrl: "/js",
    paths: {
        "jquery": "lib/jquery/jquery",
        "text": "lib/requirejs-text/text",
        "bootstrap": "lib/bootstrap/bootstrap",
        "backbone": "lib/backbone/backbone",
        "underscore": "lib/underscore/underscore",
        "flipsnap":  "lib/flipsnap/flipsnap"
    },
    shim: {
       "bootstrap": {
            deps: ["jquery"]
        },
        "backbone": {
            deps: ["underscore"]
        },
        "flipsnap": {
            exports: 'Flipsnap'
        }
    }
});

require([
    "jquery",
    "bootstrap",
    "teji/lunch/fbInit",
    "teji/lunch/view/ShopListView",
    "teji/lunch/collection/ShopCollection"], function($, bootstrap, fbInit, ShopListView, ShopCollection) {
        // initialize views
        var shopCollection = new ShopCollection();
        var shopListView = new ShopListView({el: ".fnResultViewList", collection: shopCollection});
        // set callback for initial FB sdk load and <fb:login-button>
        fbInit.loginSuccessCallback = function(response){
            // initial load
            shopCollection.loadList(response.authResponse);
            $(".fnDefaultContent").hide();
        };
        fbInit.loginFailCallback = function(response){
            $(".fnDefaultContent").show();
        };
        fbInit.logoutCallback = function(){
            shopListView.clearView();
            $(".fnDefaultContent").show();
        };
        fbInit.load();
        // prevent keep opening dropdown after page load
        $('.dropdown-menu').dropdown('toggle');
});