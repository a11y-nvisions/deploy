'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CustomButton = /*#__PURE__*/function () {
  function CustomButton(TargetElement) {
    _classCallCheck(this, CustomButton);

    _defineProperty(this, "attrObserve", new ElementObserver(this.element, function (m) {
      m.forEach(function (e) {
        var target = e.target;
        var attrName = e.attributeName;
        var newValue = target.getAttribute(attrName);
        var isTrue = newValue === "true";

        switch (attrName) {
          case 'aria-disabled':
            if (isTrue) {
              this.disabled = true;
            } else {
              this.disabled = false;
            }

            break;
        }
      });
    }, {
      attributeFilter: ['aria-disabled', 'tabindex']
    }));

    if (TargetElement instanceof HTMLElement) {
      this.element = TargetElement;

      if (this.isAnchorTag()) {
        this.element.addEventListener('click', function (evt) {
          evt.preventDefault();
        });
      }

      this.InitialRender();
    }
  }

  _createClass(CustomButton, [{
    key: "disabled",
    get: function get() {
      return this.element.getAttribute('aria-disabled') === 'true' ? true : false;
    },
    set: function set(v) {
      if (v) {
        var _isAnchor = this.isAnchorTag();

        this.element.setAttribute('aria-disabled', 'true');

        if (_isAnchor) {
          this.element.removeAttribute('href');
        }

        this.element.removeAttribute('tabindex');
      } else {
        this.element.setAttribute('aria-disabled', 'false');

        if (isAnchor) {
          this.element.href = "#";
        }

        this.element.setAttribute('tabindex', 0);
      }
    }
  }, {
    key: "isAnchorTag",
    value: function isAnchorTag() {
      return this.element instanceof HTMLAnchorElement;
    }
  }, {
    key: "InitialRender",
    value: function InitialRender() {
      function keyboardClickHandler(e) {
        switch (e.key) {
          case ' ':
          case 'Enter':
            e.preventDefault();
            e.target.click();
            break;
        }
      }

      this.element.addEventListener('keydown', keyboardClickHandler);
      this.element.addEventListener('mousedown', function (e) {
        if (e.detail < 1) {
          e.preventDefault();
        }
      });
      this.attrObserve.ON();
    }
  }]);

  return CustomButton;
}();

var ObserverOption = function ObserverOption() {
  var sbTree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var chList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var attrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var attrFilter = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var attrOldValue = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var charData = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
  var charDataOldValue = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

  _classCallCheck(this, ObserverOption);

  this.subtree = sbTree, this.childList = chList, this.attributes = attrs, this.attributeFilter = attrFilter, this.attributeOldValue = attrOldValue, this.characterData = charData, this.characterDataOldValue = charDataOldValue;
};

;

var ElementObserver = function ElementObserver(target) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new ObserverOption();

  _classCallCheck(this, ElementObserver);

  this.observer = new MutationObserver(callback);
  this.observer.observe(target, option);
};

CustomButton.collection = [];

CustomButton.setCustomButtons = function () {
  var CustomButtons = document.querySelectorAll('[role="button"]');
  var collection = CustomButton.collection;

  for (var i = 0; i < CustomButtons.length; i++) {
    var cButton = CustomButtons[i];
    collection.push(new CustomButton(cButton));
  }

  ;
};

CustomButton.setCustomButtons();