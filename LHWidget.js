window.Leadhit.LHWidget = function(id, htmlVariables, cssVariables, jsVariables, options) {
    this.cookie = window.Leadhit.Util.cookie;
    this.console = window.Leadhit.Util.console;
    this.TIME = window.Leadhit.Util.TIME;

    // Заполняем параметры виджета
    this.param = {};
    this.id = id;
    this.param.html = htmlVariables;
    this.param.css = cssVariables;
    this.param.js = jsVariables;
    this.type = this.param.js.widgetType;
    this.iframeContainerId = this.param.js.iframeContainerId;
    this.iframeContainer = window.document.getElementById(this.iframeContainerId);

    // Заполняем опции
    this.options = {};
    this.options.showStatus = 'popup_view';
    this.options.preloadTimeout = 0;
    if (typeof options !== 'undefined') {
        if (typeof options.showStatus !== 'undefined') this.options.showStatus = options.showStatus;
        if (typeof options.preloadTimeout !== 'undefined') this.options.preloadTimeout = options.preloadTimeout;
    }

    this._initStatus = false;   // Статус инициализации

    this.init();
}

window.Leadhit.LHWidget.prototype.isYandexMarketRefer = function() {
    return (document.referrer.indexOf('market.yandex.ru') !== -1);
}

window.Leadhit.LHWidget.prototype.isDemo = function() {
    return (typeof window.top.lh_widgets_conf_demo !== 'undefined');
}

window.Leadhit.LHWidget.prototype.sendStats = function(status) {
    try {
        window.Leadhit.sendWidgetStats(this.id, status);
    } catch (e) {
        this.console.error('Statistics can not be sent!');
    }
}

window.Leadhit.LHWidget.prototype.start = function() {}

window.Leadhit.LHWidget.prototype.beforeInit = function() {
    return true;
}

window.Leadhit.LHWidget.prototype.afterInit = function() {}

window.Leadhit.LHWidget.prototype.preloadImages = function(images) {
    return ( typeof images === 'undefined' ? [] : images );
}

window.Leadhit.LHWidget.prototype.preload = function() {

    if (this.isDemo()) return;

    var preload_images = this.preloadImages();

    if (preload_images.length > 0) {
        var preload_element = document.createElement('div');
        preload_element.style.position = 'absolute';
        preload_element.style.left = '-900000px';
        preload_element.style.top = '-900000px';

        for (var i = 0; i < preload_images.length; i++) {
            preload_element.innerHTML += '<img src="' + preload_images[i] + '">';
        }
        preload_element.innerHTML += '<p style="font-family: a_futuraroundregular">!</p>';
        document.getElementsByTagName('body')[0].appendChild(preload_element);
    }
}

window.Leadhit.LHWidget.prototype.init = function() {
    this.start();
    if (this.beforeInit() || this.isDemo()) {
        this._initStatus = true;

        if (this.options.preloadTimeout) setTimeout(this.preload.bind(this), this.options.preloadTimeout);
        else this.preload();

        this.afterInit();
        window.lhWidgetSystem.register(this, this.id);
    } else {
        this._initStatus = false;
    }
}

window.Leadhit.LHWidget.prototype.beforeShow = function() {
    return true;
}

window.Leadhit.LHWidget.prototype.run = function() {}

window.Leadhit.LHWidget.prototype.show = function() {
    if ((this._initStatus && this.beforeShow()) || this.isDemo()) {
        this.sendStats(this.options.showStatus);
        this.run();
    }
}

window.Leadhit.LHWidget.context = new Array();