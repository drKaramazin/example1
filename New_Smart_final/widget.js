var LHWidget = window.parent.Leadhit.LHWidget;
var widgetContext = LHWidget.context['{{{widgetId}}}'];

function NewSmartFinal() {
    LHWidget.apply(this, arguments);
}
NewSmartFinal.prototype = Object.create(LHWidget.prototype);
NewSmartFinal.prototype.constructor = NewSmartFinal;

NewSmartFinal.prototype.start = function() {
    this.visibleContainer = document.getElementById('lh_desktop_smartoffer');

    this.HIDDEN_CLASS = 'display_none';
    this.INVISIBLE_CLASS = 'visibility_none';
    this.SUBMIT_ACTIVE_CLASS = 'widget--submit-active';
    this.EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.PHONE_REGEX = /[0-9]{7,}/;

    this.isAgreement = this.param.html['agreement_text'];
    this.agreement = document.getElementById('agreement-val');
    this.agreementText = document.getElementById('agreement_text');
    if (this.isAgreement) {
        var agreement_links = this.agreementText.getElementsByTagName('a');
        for (var i = 0; i < agreement_links.length; i++) {
            if (!agreement_links[i].getAttribute('target')) agreement_links[i].setAttribute('target', '_blank');
        }
    }

    this.iframeContainer.style.width = '100%';
    this.iframeContainer.style.height = '100%';
    this.iframeContainer.style.position = 'fixed';
    this.iframeContainer.style.top = 0;
    this.iframeContainer.style.left = 0;
    this.iframeContainer.style.right = 0;
    this.iframeContainer.style.bottom = 0;
    this.iframeContainer.style.zIndex = 9999;

    this.isFormSended = false;
    this.isValid = false;

    this.inputMode = this.param.js['input_mode'];
    this.displayBeforeSubmit = this.param.js['display_before_submit'];
    this.closedCookieName = this.param.js['closed_cookie_name'] || "lh_banner_closed";
    this.filledCookieName = this.param.js['filled_cookie_name'] || "lh_banner_filled";
    this.showedCookieName = this.param.js['showed_cookie_name'] || "lh_banner_showed";

    this.form = this.visibleContainer.querySelector('form');

    this.form.addEventListener('submit', this.submit.bind(this));

    this.widgetFormContainer = this.visibleContainer.querySelector('.widget--info');
    this.successText = this.visibleContainer.querySelector('.widget--success-text');

    this.errorText = this.form.querySelector('.widget--error_text');
    this.submit = this.form.querySelector('.widget--submit');

    this.input = this.form.querySelector('.widget--input');
    this.regex = this.inputMode === 'email' ? this.EMAIL_REGEX : this.PHONE_REGEX;

    this.input.addEventListener('input', this.checkForm.bind(this));
    if (this.isAgreement) this.agreement.addEventListener('change', this.checkForm.bind(this));

    this.closeButton = this.visibleContainer.querySelector('.widget--close');
    this.closeButton.addEventListener('click', this.close.bind(this));
}

NewSmartFinal.prototype.checkForm = function() {
    this.isValid = this.regex.test(this.input.value);

    if (this.isValid) {
        this.errorText.classList.add(this.INVISIBLE_CLASS);
        if (this.isAgreement) {
            if (this.agreement.checked) {
                this.submit.classList.add(this.SUBMIT_ACTIVE_CLASS);
            } else {
                this.submit.classList.remove(this.SUBMIT_ACTIVE_CLASS);
            }
        } else {
            this.submit.classList.add(this.SUBMIT_ACTIVE_CLASS);
        }
    } else {
        this.submit.classList.remove(this.SUBMIT_ACTIVE_CLASS);
        this.errorText.classList.remove(this.INVISIBLE_CLASS);
    }
}

NewSmartFinal.prototype.submit = function(e) {
    e.preventDefault();

    if (this.isAgreement && !this.agreement.checked) return false;

    if (!this.isValid) return false;

    window.parent.lh_sf(this.form);
    this.sendStats('fill');

    this.isFormSended = true;

    this.cookie.set(this.filledCookieName, true, {expires: this.TIME.YEAR});

    while (this.widgetFormContainer.lastChild) {
        this.widgetFormContainer.removeChild(this.widgetFormContainer.lastChild);
    }
    this.widgetFormContainer.appendChild(this.successText);

    this.successText.classList.remove(this.HIDDEN_CLASS);
    this.closeButton.textContent = '';

    if (!this.displayBeforeSubmit) {
        setTimeout(function () {
            this.visibleContainer.className += " animated fadeOut";
            setTimeout(this.hide.bind(this), 700);
        }.bind(this), 800);
    }

    return false;
}

NewSmartFinal.prototype.close = function() {
    if (this.isFormSended) {
        this.cookie.set(this.filledCookieName, true, {expires: this.TIME.YEAR});
    } else {
        this.cookie.set(this.closedCookieName, true, {expires: this.TIME.WEEK});
        this.sendStats(this.id, 'close');
    }

    this.hide();
}

NewSmartFinal.prototype.beforeInit = function() {
    return !( this.cookie.get(this.closedCookieName)
        || this.cookie.get(this.filledCookieName)
        || this.isYandexMarketRefer() );
}

NewSmartFinal.prototype.beforeShow = function() {
    return Date.now() - this.cookie.get(this.showedCookieName) > 2000;
}

NewSmartFinal.prototype.preloadImages = function() {
    var preloadImages = [];

    this.param.html['img_src'] && preloadImages.push(this.param.html['img_src']);
    this.param.html['img_src_second'] && preloadImages.push(this.param.html['img_src_second']);
    this.param.html['img_src_third'] && preloadImages.push(this.param.html['img_src_third']);
    this.param.css['close_icon'] && preloadImages.push(this.param.css['close_icon']);
    this.param.css['widget_background_image'] && preloadImages.push(this.param.css['widget_background_image']);

    return preloadImages;
}

NewSmartFinal.prototype.showTick = function () {
    this.cookie.set(this.showedCookieName, Date.now());
}

NewSmartFinal.prototype.run = function() {
    setInterval(this.showTick.bind(this), 1000);
    this.iframeContainer.style.display = 'block';
    this.visibleContainer.style.display = 'block';
}

NewSmartFinal.prototype.hide = function() {
    this.iframeContainer.style.display = 'none';
    this.visibleContainer.style.display = 'none';
}

new NewSmartFinal('{{{widgetId}}}', widgetContext.html, widgetContext.css, widgetContext.js);
