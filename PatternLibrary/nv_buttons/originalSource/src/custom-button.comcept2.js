'use strict'
import { MutationObserverManager, ObserverInitOptions } from "./ObserverManager.js";
import { compose } from "lodash-fp";
import { forEach } from "lodash";

const functionRegex = /([const|let|var]\s+|[\S\d\s]*?|=$)\s*?[function]*?\s*?\(([\s\S\d]*?)\)+[=>]*?\s*?\{+([\s\d\S]*?)\}+$/;

function preventPrimativeOnClickWhenDisabled(element){
  const functionExecution = functionRegex.exec(element.onclick)[1];
  element.setAttribute('onclick',`if(
  this.getAttribute('aria-disabled') !== 'true'
  ){
    ${functionExecution}
  }`);
}

const DoubleClickUnselectableMixin = base => class extends base {
  PreventTextSelection(){
    this.element.addEventListener('mousedown',function(event){
      if(event.detail > 1){
        event.preventDefault();
      }
    })
  }
}

const ControlableMixin = base => class extends base {
  CLASS_CONTAINER_COLLAPSED = 'collapsed';

  get disabled (){
    return (this.element.getAttribute('aria-disabled') === 'true' 
    ? true : false);
  }
  set disabled (v){
    if(typeof v === 'boolean'){
      this.element.setAttribute('aria-disabled',v);
      if(v){
        this.element.removeAttribute('tabindex')  
      }else{
        this.element.tabIndex = 0;
      }
    }
  }
}

const SwitchableMixin = base => class extends base{
  setInitializeSwitchableButton () {
    if( this.isSwitchableButton ){
      this.pressed = this.pressed;
      this.element.addEventListener('click',function(){
        this.togglePressedState();
      }.bind(this));
    }
  }

  get isSwitchableButton(){
    return this.element.dataset.buttonRole === 'switch';
  }
  
  get pressed () {
    return this.element.getAttribute('aria-pressed') === 'true';
  }

  set pressed (v) {
    if( this.isSwitchableButton ) {
      this.element.setAttribute('aria-pressed',v);
    }
  }

  togglePressedState(){
    this.pressed = !this.pressed;
  }
}

const ExpandableMixin = base => class extends base{
  setInitializeContentExpandableButton(){
    if(this.isContentExpandableButton){
      this.expanded = this.expanded;
      this.element.addEventListener('click',function(){
        this.ToggleExpandedState();
      }.bind(this))
    }
  }

  get isContentExpandableButton(){
    return this.element.dataset.buttonRole === 'accordion';
  }

  set setCollapsedContainerHTMLClass(v){
    if(typeof v === 'string'){
      this.CLASS_CONTAINER_COLLAPSED = v;
    }
  }

  ToggleExpandedState(){
    this.expanded = !this.expanded;
  }

  get expanded(){
    return this.element.getAttribute('aria-expanded') == "true" ? true : false;
  }

  set expanded(v){
    if(typeof v === 'boolean'){
      if(this.isContentExpandableButton){
        this.element.setAttribute('aria-expanded',v);
        if( this.getControlsElement ){
          this.getControlsElement.classList.toggle(this.CLASS_CONTAINER_COLLAPSED,!v);
        }
      }
    }
  }

  get getControlsElement(){
    const controls = this.element.getAttribute('aria-controls');
    const hasControls = controls !== null;
    const controlsElement = hasControls ? document.getElementById(controls) : null;
    if(controlsElement){
      this.controlsElement = controlsElement;
      return controlsElement;
    }else{
      this.controlsElement = null;
      return null;
    }
  }
  set setControlsElement(idRefString){
    const controls = document.getElementById(idRefString);
    if(controls){
      this.controlsElement = controls;
    }else{
      this.controlsElement = null;
    }
  }

}

class CustomControl {
  constructor(_element){
    this.element = _element;
    this.element.customElementInfo = this;    
    const _this = this;
    Object.defineProperties(this.element,{
      disabled:{
        set(v){
          const isBool = typeof v === 'boolean';
          isBool ? _this.disabled = v : this.disabled = false;
        },
        get(){
          return _this.disabled;
        }
      }
    })
    
    if( this.element.getAttribute('onclick') ){
      preventPrimativeOnClickWhenDisabled(this.element);
    }

    if(this.isAnchorElement){
      this.element.removeAttribute('href');
      this.element.addEventListener('click',preventLink);
      this.element.addEventListener('keydown',preventLink);
      function preventLink(event){
        switch(event.type){
          case 'click':
            event.preventDefault();
          break;
          case "keydwon":
          case "keyup":
            switch(event.key){
              case 'Enter':
                event.preventDefault();
              break;
            }
          break;
        }
      }
    }
  }

  get isAnchorElement(){
    return this.element instanceof HTMLAnchorElement;
  }
}


class CustomButton extends compose(
  ControlableMixin,
  DoubleClickUnselectableMixin,
  ExpandableMixin,
  SwitchableMixin
)(CustomControl) {
  constructor(_element){
    super(_element);
    this.disabled = this.disabled;
    this.setInitializeContentExpandableButton();
    this.setInitializeSwitchableButton();
    this.PreventTextSelection();
    this.element.addEventListener('keydown',CustomButton.keyClickHandler);
    this.element.isCustomButton = true;

  }
  
  setOnClickListener (handler){
    if(typeof handler === 'function'){
      const executions = functionRegex.exec(handler)[1];
      const handleName = handler.name;
      `function ${handleName} (${params}){
        ${executions}
      }`;

      this.element.addEventListener('click',handler);
    }
  }

  static keyClickHandler=function(event){
    const key = event.key;
    switch (key){
      case " ":
      case "Enter":
        event.target.click();
        event.stopPropagation();
      break;
    }
  }
  static collection = [];
  static Observer = new MutationObserver(
    (m)=>{
      m.forEach(e => {
        const attrName = e.attributeName;
        const attrNewValue = e.target.getAttribute(e.attributeName)
        if(attrName == 'role' && attrNewValue == 'button'){
          const newButton = new CustomButton(e.target);
          CustomButton.collection.push(newButton);
        }
        if(attrName === 'onclick' && attrNewValue !== null){
          preventPrimativeOnClickWhenDisabled(e.target);
        }
      });
    }
  );
  static ObserverManager = new MutationObserverManager(
    //MutationObserver Observe Target
    document.body,
    
    //MutationObserver
    CustomButton.Observer,
    
    {//MutationObserver Option
    childList:false,
    attributes:true,
    subtree:true,
    attributeFilter:['role','onclick'],
  })

  static startCreation(){
    const BUTTONS = document.querySelectorAll('[role="button"]');

    forEach(BUTTONS,(el)=>{
      const CButton = new CustomButton(el);
      CustomButton.collection.push(CButton);
    })
    //Live Creation
    CustomButton.ObserverManager.connect();
  }
}

export default CustomButton;
