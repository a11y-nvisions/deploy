'use strict'

import {compose} from 'lodash-fp';
import CustomCheckboxElement,{CustomCheckboxElementMixin} from './checkbox.main.js';
import CustomLabelElement from './label.main.js';
import { dedent } from './utilities.js';
import './style/drawing.scss';
import './style/color.scss';

customElements.define('nv-checkbox',CustomCheckboxElement);
customElements.define('nv-span-checkbox',class extends compose(CustomCheckboxElementMixin)(HTMLSpanElement){},{extends:'span'});
customElements.define('nv-div-checkbox',class extends compose(CustomCheckboxElementMixin)(HTMLDivElement){},{extends:'div'});
customElements.define('nv-a-checkbox',class extends compose(CustomCheckboxElementMixin)(HTMLAnchorElement){
  constructor(){
    super();
    this.cleanHREF();
  }

  static observedAttribute(){
    return ['href'];
  }

  cleanHREF(){
    const WarningMessage = dedent(
      `
      %c[Warning] 'href' attribute has removed.
      %c[Description]
      %c You mede CustomCheckbox using the anchor tag with the 'is' attribute.
      the CustomCheckbox prohibit a 'href' Attribute beause 'href' attribute make element focusable forced. but, href attribute has used. 
      `
    );
    if(this.getAttribute('href') !== null){
      this.removeAttribute('href');
      console.warn(WarningMessage,
      'border-bottom:solid 1px; margin-bottom:1rem; font-weight:bold;','color:#fff;','color:#fff');
    }
  }
  attributeChangedCallback(v,o,n){
    super.attributeChangedCallback(v,o,n);
    if(v==='href' && typeof n === 'string'){
      this.cleanHREF();
    }
  }
},{extends:"a"});
customElements.define('nv-p-checkbox',class extends compose(CustomCheckboxElementMixin)(HTMLParagraphElement){},{extends:"p"});
customElements.define('nv-label',CustomLabelElement);
setTimeout(()=>{
Element.prototype.setTestCheckbox = function () {
    const element=this;
    
    function getTagNameOfInstance(t){
      if(t instanceof HTMLDivElement){
        return 'div';
      }
      if(t instanceof HTMLSpanElement){
        return 'span';
      }
      if(t instanceof HTMLAnchorElement){
        return 'a';
      }
      if(t instanceof HTMLParagraphElement){
        return 'p';
      }else{
        return 'not applicable';
      }
    }

    // prepare the elements
    if(getTagNameOfInstance(this) !== 'not applicable'){
      const NV_TAG_EXTENSION_NAME = `nv-${getTagNameOfInstance(this)}-checkbox`;
      const newElem = document.createElement(getTagNameOfInstance(this),{is:NV_TAG_EXTENSION_NAME})
      const clone = element.cloneNode(true)
    
      // move the children from the clone to the new element
      while (clone.firstChild) {
        newElem.appendChild(clone.firstChild)
      }
    
      // copy the attributes
      for (const attr of clone.attributes) {
        newElem.setAttribute(attr.name, attr.value)
      }
      newElem.setAttribute('is',NV_TAG_EXTENSION_NAME)

      console.log(getTagNameOfInstance(this),newElem)
      element.parentElement.replaceChild(newElem,element);
    }
}
},100)
