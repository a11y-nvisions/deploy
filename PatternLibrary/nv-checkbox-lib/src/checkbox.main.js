import {compose} from 'lodash-fp';
import State_Checked from './Mixins/customElements.state.checked.js';
import State_Essentials from './Mixins/customElements.state.essentials.js';

export const CustomCheckboxElementMixin = (base) => class extends compose(
  State_Essentials,
  State_Checked)(base){
  constructor(){
    super();
    this.setAttribute('role','checkbox');
    const EventInitValue = !this.disabled;
    this.setCheckedEvent = EventInitValue;
  }

  defaultClickEvent () {

    this.checked = !this.checked;
    if(this._ChildCheckboxes){
      this._ChildCheckboxes.toggleAll();
    }
  }

  defaultKeydownEvent (e) {

    const key = e.key;
    switch(key){
      case ' ':
        this.click();
      break;
    }
  }



  static get observedAttributes() {
    return ['checked','focusable','disabled'];
  }

  get getCheckedEventState (){
    return this._EventState;
  }

  set setCheckedEvent (v){
    if(v){
      this.addEventListener('click',this.defaultClickEvent);
      this.addEventListener('keydown',this.defaultKeydownEvent);
      this._EventState = 'on';
    } else if(!v){
      this.removeEventListener('click',this.defaultClickEvent);
      this.removeEventListener('keydown',this.defaultKeydownEvent);
      this._EventState = 'off';
    }
  }

  get disabled(){
    return super.disabled;
  }

  set disabled(v){
    super.disabled = v;
    this.setCheckedEvent = !this.disabled;
  }

  attributeChangedCallback(key,oldValue,newValue){
    this.checkedStateChangedCallback(key,oldValue,newValue);
    this.EssentialStateChangedCallback(key,oldValue,newValue);
  }

  connectedCallback(){
    window.addEventListener('keydown',function(e){
      if(e.target.getAttribute('role') === 'checkbox'){
        
        if(e.key === ' '){
          e.preventDefault();
        }
      }
    })
    if(this._ChildCheckboxes){
      setTimeout(()=>{
        if(this._ChildCheckboxes.CheckedLength === this._ChildCheckboxes.CheckLength || this._ChildCheckboxes.CheckedLength === 0){
          this._ChildCheckboxes.toggleAll();
        }else{
          this.checked = 'mixed';
        }
      },100)
    }
  }
}

class CustomCheckboxElement extends compose(CustomCheckboxElementMixin)(HTMLElement){
  constructor(){
    super()
  }
}

export default CustomCheckboxElement;