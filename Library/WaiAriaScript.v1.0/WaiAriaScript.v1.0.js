"use strict";
let NV_ALLOW_LOG_ARIA_WARN = false;

class CaseTranslator {
    static isKebabCase = (str = "") => /^[a-zA-Z](?:[a-zA-Z0-9]+)?(\-[a-zA-Z](?:[a-zA-Z0-9]+))+?$/.test(str);
    static isSnakeCase = (str = "") => /^[a-zA-Z](?:[a-zA-Z0-9]+)?(\_[a-zA-Z](?:[a-zA-Z0-9]+))+?$/.test(str);
    static isUpperSnakeCase = (str = "") => /^[A-Z](?:[A-Z0-9]+)?(\_[A-Z](?:[A-Z0-9]+))+?$/.test(str);
    static isUpperKebabCase = (str = "") => /^[A-Z](?:[A-Z0-9]+)?(\-[A-Z](?:[A-Z0-9]+))+?$/.test(str);
    static isPascalCase = (str = "") => /^[A-Z][a-z0-9]+?([A-Z][a-zA-Z0-9]+)+$/.test(str);
    static isCamelCase = (str = "") => /^[a-z][a-z0-9]+?([A-Z][a-zA-Z0-9]+)+$/.test(str);
    static isCaseTypeOf(str = "") {
        if (this.isCamelCase(str)) {
            return "camel";
        }
        else if (this.isPascalCase(str)) {
            return "pascal";
        }
        else if (this.isKebabCase(str) && !this.isUpperKebabCase(str)) {
            return "kebab";
        }
        else if (this.isSnakeCase(str) && !this.isUpperSnakeCase(str)) {
            return "snake";
        }
        else if (this.isUpperKebabCase(str)) {
            return "kebab-upper";
        }
        else if (this.isUpperSnakeCase(str)) {
            return "snake_upper";
        }
        else {
            return "NoC";
        }
    }
    static toSnakeCase(str) {
        if (str) {
            switch (this.isCaseTypeOf(str)) {
                case "NoC":
                    return null;
                case "camel":
                    return this.camelToSnake(str);
                case "kebab":
                    return this.kebabToSnake(str);
                case "pascal":
                    return this.pascalToSnake(str);
                case "kebab-upper":
                    return this.kebabToSnake(str);
                case "snake":
                case "snake_upper":
                    return str;
            }
        }
    }
    static toKebabCase(str) {
        if (str) {
            switch (this.isCaseTypeOf(str)) {
                case "NoC":
                    return null;
                case "camel":
                    return this.camelToKebab(str);
                case "snake":
                    return this.snakeToKebab(str);
                case "pascal":
                    return this.pascalToKebab(str);
                case "snake_upper":
                    return this.snakeToKebab(str);
                case "kebab":
                case "kebab-upper":
                    return str;
            }
        }
    }
    static toPascalCase(str) {
        if (str) {
            switch (this.isCaseTypeOf(str)) {
                case "NoC":
                    return null;
                case "camel":
                    return this.camelToPascal(str);
                case "snake":
                    return this.snakeToPascal(str);
                case "kebab":
                    return this.kebabToPascal(str);
                case "kebab-upper":
                    return this.kebabToPascal(str.toLowerCase());
                case "snake_upper":
                    return this.snakeToPascal(str.toLowerCase());
                case "pascal":
                    return str;
            }
        }
    }
    static toCamelCase(str) {
        if (str) {
            switch (this.isCaseTypeOf(str)) {
                case "NoC":
                    return null;
                case "pascal":
                    return this.pascalToCamel(str);
                case "snake":
                    return this.snakeToCamel(str);
                case "kebab":
                    return this.kebabToCamel(str);
                case "snake_upper":
                    return this.snakeToCamel(str.toLowerCase());
                case "kebab-upper":
                    return this.kebabToCamel(str.toLowerCase());
                case "camel":
                    return str;
            }
        }
    }
    static kebabToCamel = (str = "is-test") => {
        if (str && this.isKebabCase(str)) {
            let result = str;
            while (result.indexOf("-") >= 0) {
                result = result.replace(/(?![a-z]+(?=-))[a-z]+/, /(?![a-z]+(?=-))[a-z]+/.exec(result)[0]).replace(/(?![a-z]+(?=-))[a-z]/, /(?![a-z]+(?=-))[a-z]/.exec(result)[0]
                    .toUpperCase()).replace('-', '');
            }
            result = result.replace(/^[A-Z]/, result[0].toLowerCase());
            return result;
        }
    };
    static snakeToCamel = (str = "is_test") => {
        if (str && this.isSnakeCase(str)) {
            return this.kebabToCamel(this.snakeToKebab(str));
        }
    };
    static kebabToSnake = (str = "is-test") => {
        if (str && (this.isKebabCase(str) || this.isUpperKebabCase(str))) {
            return str.replace(/\-/g, "_");
        }
    };
    static snakeToKebab = (str = "is_test") => {
        if (str && (this.isSnakeCase(str) || this.isUpperSnakeCase(str))) {
            return str.replace(/\_/g, "-");
        }
    };
    static camelToPascal = (str = "isTest") => {
        if (str && this.isCamelCase(str)) {
            const result = [...str.split('')];
            const upperFirst = result[0].toUpperCase();
            result[0] = upperFirst;
            return result.join('');
        }
    };
    static pascalToCamel = (str = "IsTest") => {
        if (str && this.isPascalCase(str)) {
            const result = [...str.split("")];
            const lowerFirst = result[0].toLowerCase();
            result[0] = lowerFirst;
            return result.join('');
        }
    };
    static camelToKebab = (str = "isTest") => {
        if (str && this.isCamelCase(str)) {
            const source = /[a-z0-9]?(?=[A-Z])/.exec(str);
            const index = source.index ? source.index + 1 : 0;
            const catchedPrefix = str.slice(0, index);
            return str.replace(catchedPrefix, catchedPrefix + "-").toLowerCase();
        }
    };
    static camelToSnake = (str = "isTest") => {
        if (str && this.isCamelCase(str)) {
            return this.camelToKebab(str).replace(/\-/g, "_");
        }
    };
    static pascalToKebab = (str = "IsTest") => {
        if (str && this.isPascalCase(str)) {
            return this.camelToKebab(this.pascalToCamel(str));
        }
    };
    static pascalToSnake = (str = "IsTest") => {
        if (str && this.isPascalCase(str)) {
            return this.camelToSnake(this.pascalToCamel(str));
        }
    };
    static kebabToPascal = (str = "is-test") => {
        if (str && this.isKebabCase(str)) {
            return this.camelToPascal(this.kebabToCamel(str));
        }
    };
    static snakeToPascal = (str = "is_test") => {
        if (str && this.isSnakeCase(str)) {
            return this.camelToPascal(this.snakeToCamel(str));
        }
    };
}
;
// Event
class AriaValueChangeEvent extends CustomEvent {
    name;
    value;
    constructor(changedAria, postTarget) {
        super("ariaValueChange", {});
        this.name = changedAria;
        this.value = postTarget[changedAria];
    }
}
;
(() => {
    const ElementProto = Element.prototype;
    /**
      *  @param {Object} O any object
      *  @param {PropertyKey} PropName
      *  @param {PropertyDescriptor} PropDescriptor
      *  @returns {Void}
     */
    const defineProp = (O, PropName, PropDescriptor) => { Object.defineProperty(O, PropName, PropDescriptor); };
    /**
    * @param {Object} O any object
    * @returns {string[]}
    */
    const getPropNamesFrom = (O) => { return Object.keys(O); };
    /**
    * @param {Object} O any object
    * @returns {any[]}
    */
    const getPropValuesFrom = (O) => { return Object.values(O); };
    /**
     * @param {Object} O any object
     * @param {string} propName
     * @returns {boolean}
    */
    const isPropertyOf = (O, propName) => {
        return Object.prototype.hasOwnProperty.call(O, propName);
    };
    const Reflectable = ['ariaAtomic', 'ariaAutoComplete', 'ariaBusy', 'ariaChecked', 'ariaColCount', 'ariaColIndex', 'ariaColSpan', 'ariaCurrent', 'ariaDescription', 'ariaDisabled', 'ariaExpanded', 'ariaHasPopup', 'ariaHidden', 'ariaKeyShortcuts', 'ariaLabel', 'ariaLevel', 'ariaLive', 'ariaModal', 'ariaMultiLine', 'ariaMultiSelectable', 'ariaOrientation', 'ariaPlaceholder', 'ariaPosInSet', 'ariaPressed', 'ariaReadOnly', 'ariaRelevant', 'ariaRequired', 'ariaRoleDescription', 'ariaRowCount', 'ariaRowIndex', 'ariaRowSpan', 'ariaSelected', 'ariaSetSize', 'ariaSort', 'ariaValueMax', 'ariaValueMin', 'ariaValueNow', 'ariaValueText'];
    const Reflected = ['aria-atomic', 'aria-autocomplete', 'aria-busy', 'aria-checked', 'aria-colcount', 'aria-colindex', 'aria-colspan', 'aria-current', 'aria-description', 'aria-disabled', 'aria-expanded', 'aria-haspopup', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-level', 'aria-live', 'aria-modal', 'aria-multiline', 'aria-multiselectable', 'aria-orientation', 'aria-placeholder', 'aria-posinset', 'aria-pressed', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription', 'aria-rowcount', 'aria-rowindex', 'aria-rowspan', 'aria-selected', 'aria-setsize', 'aria-sort', 'aria-valuemax', 'aria-valuemin', 'aria-valuenow', 'aria-valuetext'];
    if (getPropNamesFrom(ElementProto).filter(el => Reflectable.indexOf(el) > -1).length > 0 && !NV_ALLOW_LOG_ARIA_WARN) {
        console.warn("[ARIA_REFLECTION_WARNING]\nBrowser that support an ARIA Reflection API detected! Original native properties that have the same name will be overwritten for implementation of extension!\n\nIf you want not to see this warning log, you can hide this by setting value of NV_ALLOW_LOG_ARIA_WARN to true from the global scope or deleting a line no. 6 of the ARIA Reflection script file.");
    }
    const IsNumber = (v) => /^-?\d+(\.\d+(e\+\d+)?)?$/.test((v));
    const IsBool = (v) => /^(true|false)$/.test(v);
    const IsNull = (v) => /^null$/.test(v);
    const IsUndefined = (v) => /^undefined$/.test(v);
    defineProp(ElementProto, Symbol.for("Is_AriaReflectionAPI_Available"), {
        get() {
            return true;
        }
    });
    (() => {
        const SupportedAriaDictionary = {};
        Reflectable.forEach((el, idx) => {
            SupportedAriaDictionary[el] = Reflected[idx];
        });
        ElementProto[Symbol.for("AVAILABLE_ARIA_REFLECTION_DICT_ORIGIN")] = SupportedAriaDictionary;
        if (!isPropertyOf(ElementProto, "AVAILABLE_ARIA_REFLECTION_DICT")) {
            defineProp(ElementProto, "AVAILABLE_ARIA_REFLECTION_DICT", {
                get() {
                    return this[Symbol.for("AVAILABLE_ARIA_REFLECTION_DICT_ORIGIN")];
                }
            });
            defineProp(ElementProto, "ARIA_ATTRIBUTE_LIST", {
                get() {
                    return getPropValuesFrom(this.AVAILABLE_ARIA_REFLECTION_DICT);
                }
            });
            defineProp(ElementProto, "ARIA_PROPERTY_LIST", {
                get() {
                    return getPropNamesFrom(this.AVAILABLE_ARIA_REFLECTION_DICT);
                }
            });
        }
        Reflectable.forEach((el, idx) => {
            (() => {
                /*    if ( Object.prototype.hasOwnProperty.call(ElementProto,el) ) {
                        return;
                      } else { */
                defineProp(ElementProto, el, {
                    get() {
                        const val = String(this.getAttribute(Reflected[idx]));
                        const isNumber = IsNumber(val);
                        const isBool = IsBool(val);
                        const isNull = IsNull(val);
                        const isUndefined = IsUndefined(val);
                        if (isBool) {
                            return val === "true" ? true : false;
                        }
                        if (isNumber) {
                            return Number(val);
                        }
                        else if (isNull) {
                            return null;
                        }
                        if (isUndefined) {
                            return undefined;
                        }
                        else {
                            return val;
                        }
                    },
                    set(value) {
                        if (IsNull(value) || IsUndefined(value)) {
                            this.removeAttribute(Reflected[idx]);
                        }
                        if (typeof value === "number") {
                            if (isNaN(value)) {
                                console.warn("NaN Value has been passed to ARIA Reflection Setter, Your requested reflection has sent as value of zero.");
                                this.setAttribute(Reflected[idx], "0");
                            }
                            else {
                                this.setAttribute(Reflected[idx], value);
                            }
                        }
                        else {
                            this.setAttribute(Reflected[idx], String(value));
                        }
                    }
                });
                /* } */
            })();
        });
    })();
    // ARIA_EXTEINSION 여기부터 아리아 익스텐션임.
    const registration = ElementProto[Symbol.for("AVAILABLE_ARIA_REFLECTION_DICT_ORIGIN")];
    if (ElementProto[Symbol.for("Is_AriaReflectionAPI_Available")]) {
        registration.role = 'role';
        registration.tabIndex = 'tabindex';
        registration.ariaLabelledBy = "aria-labelledby";
        registration.ariaDescrbiedBy = "aria-describedby";
        registration.ariaActiveDescendant = "aria-activedescendant";
        registration.ariaOwnsById = "aria-owns";
        registration.ariaControls = 'aria-controls';
        if (!isPropertyOf(ElementProto, "tabIndex")) {
            defineProp(ElementProto, 'tabIndex', {
                get() {
                    let tabIndex = this.getAttribute('tabindex');
                    if (/^(button|input|textarea|summary|select|video|audio|iframe|embed|a)$/.test(this.tagName)) {
                        return 0;
                    }
                    else {
                        if (!isNaN(Number(tabIndex))) {
                            return Number(tabIndex);
                        }
                        else {
                            return null;
                        }
                    }
                },
                set(value) {
                    if (value) {
                        this.setAttribute('tabindex', value);
                    }
                }
            });
        }
        if (!isPropertyOf(ElementProto, "role")) {
            // Add it to Supported List.
            defineProp(ElementProto, 'role', {
                get() {
                    return this.getAttribute('role');
                },
                set(value) {
                    if (typeof value === "string") {
                        this.setAttribute('role', value);
                    }
                }
            });
        }
        if (!isPropertyOf(ElementProto, "accessibilityInfo")) {
            defineProp(ElementProto, "accessibilityInfo", {
                get() {
                    class AccessibilityInfo {
                        constructor() { }
                    }
                    const info = new AccessibilityInfo();
                    this.ARIA_PROPERTY_LIST.forEach((el, idx) => {
                        const _this = this;
                        defineProp(info, el, {
                            get() {
                                const val = _this[el];
                                ;
                                const isBool = /^(true|false)$/.test(val);
                                const isNumber = /^-?\d(\.\d+)?$/.test(val);
                                if (isBool) {
                                    return _this[el] === "true" ? true : false;
                                }
                                if (isNumber) {
                                    return Number(val);
                                }
                                else {
                                    return val;
                                }
                            },
                            set(val) {
                                _this[el] = val;
                            }
                        });
                    });
                    return info;
                },
                set(AriaProps) {
                    if (typeof AriaProps === "object") {
                        for (let key in AriaProps) {
                            if (key in this) {
                                this[key] = AriaProps[key];
                            }
                            else if (this.ARIA_ATTRIBUTE_LIST.indexOf(key) > -1) {
                                AriaProps[CaseTranslator.kebabToCamel(key)] = AriaProps[key];
                                this[CaseTranslator.kebabToCamel(key)] = AriaProps[key];
                                delete AriaProps[key];
                            }
                        }
                    }
                }
            });
        }
    }
    // Id Reference
    if (!isPropertyOf(ElementProto, "ariaLabelledBy")) {
        defineProp(ElementProto, 'ariaLabelledBy', {
            get() {
                const labels = this.getAttribute('aria-labelledby');
                if (labels) {
                    return String(labels).split(" ");
                }
            },
            set(labels) {
                if (typeof labels === "string") {
                    this.setAttribute('aria-labelledby', labels);
                }
                else if (labels instanceof Array) {
                    this.setAttribute('aria-labelledby', labels.join(' '));
                }
            }
        });
    }
    if (!isPropertyOf(ElementProto, "ariaDescribedBy")) {
        defineProp(ElementProto, 'ariaDescribedBy', {
            get() {
                const descriptions = this.getAttribute('aria-describedby');
                if (descriptions) {
                    return String(descriptions).split(" ");
                }
            },
            set(descriptions) {
                if (typeof descriptions === "string") {
                    this.setAttribute('aria-describedby', descriptions);
                }
                else if (descriptions instanceof Array) {
                    this.setAttribute('aria-describedby', descriptions.join(' '));
                }
            }
        });
        if (!isPropertyOf(ElementProto, "ariaControls")) {
            defineProp(ElementProto, "ariaControls", {
                get() {
                    const controlsID = this.getAttribute('aria-controls');
                    if (controlsID) {
                        const controlsElem = document.getElementById(controlsID);
                        if (controlsElem) {
                            return controlsElem;
                        }
                        else {
                            return controlsID;
                        }
                    }
                    else {
                        return null;
                    }
                },
                set(ID_VALUE) {
                    if (typeof ID_VALUE === "string") {
                        this.getAttribute('aria-controls', ID_VALUE);
                    }
                }
            });
        }
        if (!isPropertyOf(ElementProto, "ariaActiveDescendant")) {
            defineProp(ElementProto, "ariaActiveDescendant", {
                get() {
                    const controlsID = this.getAttribute('aria-activedescendant');
                    if (controlsID) {
                        const controlsElem = document.getElementById(controlsID);
                        if (controlsElem) {
                            return controlsElem;
                        }
                        else {
                            return controlsID;
                        }
                    }
                    else {
                        return null;
                    }
                },
                set(ID_VALUE) {
                    if (typeof ID_VALUE === "string") {
                        this.getAttribute('aria-controls', ID_VALUE);
                    }
                }
            });
        }
    }
    if (!isPropertyOf(ElementProto, "ariaOwns")) {
        defineProp(ElementProto, "ariaOwns", {
            get() {
                const ownsID = this.getAttribute('aria-owns');
                if (ownsID) {
                    const ownsEl = document.getElementById(ownsID);
                    if (ownsEl) {
                        return ownsEl;
                    }
                    else {
                        return ownsID;
                    }
                }
                else {
                    return null;
                }
            },
            set(ID_VALUE) {
                if (typeof ID_VALUE === "string") {
                    this.getAttribute('aria-owns', ID_VALUE);
                }
            }
        });
    }
    const ObserveAttr = new MutationObserver((m) => {
        m.forEach((m) => {
            const attr = m.attributeName;
            const target = m.target;
            if (target.ARIA_ATTRIBUTE_LIST.indexOf(attr) > -1) {
                const _attr = CaseTranslator.isKebabCase(attr) ? CaseTranslator.kebabToCamel(attr) : attr;
                target.dispatchEvent(new AriaValueChangeEvent(_attr, target));
            }
        });
    });
    ObserveAttr.observe(document.body, { subtree: true, attributes: true });
})();
