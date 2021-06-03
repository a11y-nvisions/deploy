'use strict'

export default class CustomLabelElement extends HTMLElement {

  constructor(){
    super();
    this.setHTMLForById=this.getCustomHTMLForValue;
    if(this.getCustomHTMLForElement){
      this.setToDisabledLabel = this.getCustomHTMLForElement.disabled;
    }
  }

  set setToDisabledLabel(v){
    this.classList.toggle('is-disabled',v);
  }

  _Target = null;
  
  targetClickListener(){
    this.getCustomHTMLForElement.click();
  }

  get getCustomHTMLForElement(){
    return this._Target;
  }

  get getCustomHTMLForValue(){
    return this.getAttribute('for');
  }

  set setHTMLForById ( targetElement_IDREF ) {
    if(typeof targetElement_IDREF === 'string' &&
    targetElement_IDREF.length > 0){
      const temp = document.getElementById(targetElement_IDREF);
      if(temp){
        this.attachHTMLFor = temp;
      }
    }
  }

  set attachHTMLFor(targetElement){
    if(targetElement instanceof HTMLElement){
      if(this._Target){
        targetElement.labelElement = null;
      }

      this._Target = targetElement;
      this._Target.labelElement = this;
      this._Target.setAttribute('aria-label',this.innerHTML);
      this.removeEventListener('click',this.targetClickListener);
      this.addEventListener('click',this.targetClickListener);

    }
  }

  static observedAttribute(){
    return ['for'];
  }

  attribteChangedCallback(key,oldValue,newValue){
    if(key === 'for'){
      if(typeof newValue === 'string'
      && newValue.length > 0){
        const target = document.getElementById(newValue);
        if(target){
          this.attachHTMLFor = target;
        }else{
          this.attachHTMLFor = null;
        }
      }
    }
  }
  
}