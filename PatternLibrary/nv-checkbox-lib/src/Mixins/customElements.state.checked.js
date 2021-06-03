'use strict'

import { toArray } from 'lodash';
import {dedent} from '../utilities.js';

const createChildCheckboxGroup = (C_ChildContainer,C_parent) => {
  if(C_ChildContainer instanceof HTMLElement){
    return new ChildCheckboxGroup(C_ChildContainer,C_parent);
  }else{
    return null;
  }
}

class ChildCheckboxGroup {

  constructor(C_ChildContainer,C_parent){
    
    this.parent = C_parent;
    
    this.ChildCheckboxesContainer = C_ChildContainer;
    this.ChildCheckboxesContainer.setAttribute('role','group');
    
    this.CheckList = toArray(this.ChildCheckboxesContainer.querySelectorAll('input[type="checkbox"],nv-checkbox'));
    this.CheckLength = this.CheckList.length;

    this.watchStart();
  }

  watchChilds = new MutationObserver((m)=>{
    this.setParentCheckboxState(this.CheckedLength);
  })

  watchStart(){
    this.watchChilds.observe(this.ChildCheckboxesContainer,{
        
      attributeFilter:['checked'],
      attributes:true,
      subtree:true,

    })
  }

  get CheckedLength (){ 
    return this.CheckList.filter((e)=>{
      return e.hasAttribute('checked');
    }).length;
  }

  toggleAll(){
    for(const element of this.CheckList){
      element.checked = this.parent.checked;
    }
  }

  setParentCheckboxState (val) {
    const isAllChecked = (val === this.CheckLength);
    const isAllNotChecked = (val === 0);
    const isMixed = ( (val !== 0) && (val !== this.CheckLength) );
 /*    console.log(
      `
      MaxLength: ${this.CheckLength}
      checkedLength ${this.CheckedLength}
      allChecked ${isAllChecked}
      allNotChecked ${isAllNotChecked}
      Mixed ${isMixed}
      `
    ); */

    if ( isAllNotChecked ) {
      this.parent.checked = false;
    } else if ( isAllChecked ) {
      
      this.parent.checked = true;

    }  else if ( isMixed ){

      this.parent.checked = 'mixed';

    }

  }
};

const State_Checked = base => class extends base {

  constructor() {

    super();

    this.CHECKED_INIT();
    this._ChildCheckboxes = (this.getAttribute('aria-controls') !== null) && 
    createChildCheckboxGroup(
      document.querySelector('#'+this.getAttribute('aria-controls')),this
    );
    this.iconElement = document.createElement('div');
    this.iconElement.classList.add('state-icon');
    this.appendChild(this.iconElement);
  }

  checkedStateChangedCallback(key,oldValue,newValue){

    const StackObject = new Error();
    const Stack = StackObject.stack;

    if( /attributeChangedCallback/.test( Stack ) ){

      if( key === 'aria-controls' ) { 

        this._ChildCheckboxes = (this.getAttribute('aria-controls') !== null) && 
        createChildCheckboxGroup(
          document.querySelector('#'+this.getAttribute('aria-controls')),this
        );

       }

      if ( key === 'checked' ) {

        if ( newValue === '' ) {

          this.setAttribute('aria-checked','true');

        } if ( newValue === 'mixed' ) {

          this.setAttribute('aria-checked','mixed');

        } else if (newValue === null ) {

          this.setAttribute( 'aria-checked' , 'false' );

        }

      }

    }

  }
  
  CHECKED_INIT (){
    if ( !this.isCheckedInitialized ) {

      !this.checked ? this.setAttribute( 'aria-checked' , 'false' ) : null;

    } else {
      const ErrorMessage=dedent(
        `%cYOU'RE USING IT AS INVALID USAGE
        
        %cthe Explanation for this Error :
        %cThe state of this element has already been initialized!
        This method is not to be re-use by calling from object because it's a only for initializing a default state when the element is ready.`
      )

      console.error(
        ErrorMessage,
        //colors
        'color:#ff3f22; font-weight:bold; font-size:26px; text-align:center;', // Error Header
        'color:white; font-weight:bold; font-size:16px;', // Error Description Header
        'color:#ccc;', // Error Description Content
      )

    }
  
    Object.defineProperty(this, 'isCheckedInitialized' , {
      configurable: false,
      writable: false,
      value: true,
    })
  }
  

  get checked () {

    if ( this.getAttribute('checked') === '' ) {
      return true;
    } else if ( this.getAttribute('checked') === null ||  this.getAttribute('checked') === 'mixed' ) {
      return false;
    } 

  }

  set checked ( val ) {
    if(val === true ){
      
      this.setAttribute('checked','');
      
    } else if ( val === 'mixed' ) {
      
      this.setAttribute('checked','mixed')

    } else if (val === false) {

        this.removeAttribute('checked');

    }

  }

}

export default State_Checked;