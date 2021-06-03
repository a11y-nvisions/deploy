'use strict'

import {dedent} from '../utilities.js';

const State_Essentials = base => class extends base{
  constructor(){
    super();
    this.ESSENTIAL_INIT();
    this.labelElement = null;
  }

  EssentialStateChangedCallback( key , oldValue , newValue ){

    const StackObject = new Error();
    const Stack = StackObject.stack;

    if( /attributeChangedCallback/.test( Stack ) ){

      if ( key === 'focusable' ) {
        if ( newValue === '' ) {

          this.setAttribute( 'tabindex' , '0' );

        } else {

          this.removeAttribute( 'tabindex' );

        }

      }

      if ( key === 'disabled' ) {
        if ( !oldValue && newValue === '' ) {

          this.setAttribute( 'aria-disabled' , 'true' );
          this.focusable = false;

        }  else {

          this.setAttribute('aria-disabled','false');
          this.focusable = true;

        }
      
      }

    }

  }
  
  ESSENTIAL_INIT (){

    if ( !this.isEssentialStateInitialized ) {
      
      this.disabled ? this.setAttribute('aria-disabled',true) : this.setAttribute('aria-disabled',false);
      if(!this.focusable && !this.disabled){
        this.setAttribute('focusable','');
        this.setAttribute('tabindex','0');
      }else{
        this.removeAttribute('focusable');
      }

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
    
    Object.defineProperty( this , 'isEssentialStateInitialized', 
    {
      configurable: false ,
      writable: false ,
      value: true ,
    } );

  }

  get focusable () {
    if( this instanceof HTMLElement ){

      return this.hasAttribute( 'focusable' );

    }
  }
  set focusable ( bool ) {

    if ( this instanceof HTMLElement ) {

      if( typeof bool === 'boolean' ) {
      
        this.toggleAttribute('focusable',bool)
      
      }

    }
  }

  get disabled () {

    if( this instanceof HTMLElement ){

      return this.hasAttribute('disabled');
       
    }
  }
  set disabled ( bool ) {

    if ( this instanceof HTMLElement ) {

      if( typeof bool === 'boolean' ) {
        this.toggleAttribute( 'disabled' , bool )
        if(this.labelElement){
          this.labelElement.setToDisabledLabel = bool;
        }
      }

    }

  }

}

export default State_Essentials;