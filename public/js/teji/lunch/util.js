define("teji/lunch/util", ["jquery"], function($){
    return {
        _mainPages: [],

        showPage: function(pageIndex, mainPages){
            mainPages = mainPages || this._mainPages;
            // hide other pages
            $.each(mainPages, function(i, selector){
                $(selector).hide().css({opacity: 0});
            });
            $(mainPages[pageIndex]).show().velocity({opacity: 1});
            this._mainPages = mainPages;
        },

        escapeHTML: function(text){
            return text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        },

        isMobileScreen: function(){
            return $(window).width() < 768;
        }
    };
});