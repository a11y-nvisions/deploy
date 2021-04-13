
export class ObserverInitOptions {
  constructor(
    childList=true,//childList
    subtree=false,//subtree
    attributes=false,//attributes
    attributeFilter=[],//attributeFilter
    attributeOldValue=false,//attributeOldValue
    characterData=false,//characterData
    chararacterDataOldValue=false//chararacterDataOldValue
  ){
    this.subtree=subtree;
    this.childList=childList;
    this.attributes=attributes;
    this.attributeOldValue=attributeOldValue;
    this.attributeFilter=attributeFilter;
    this.chararacterData=characterData;
    this.chararacterDataOldValue=chararacterDataOldValue;
  }
}

export class MutationObserverManager {
  #Observer=null;
  #Option=null;
  constructor(targetElement,Observer,Option = new ObserverInitOptions() ){
    this.target = targetElement;
    this.refreshObserverAutomatically = true;
    this.#Option = Option;
    this.#Observer = Observer;
  }

  connect(){
    this.#Observer.observe(this.target,this.#Option);
  }
  disconnect(){
    this.#Observer.disconnect;
  }

  setTargetElement(targetElement){
    this.target = targetElement;
    if(this.refreshObserverAutomatically){
      this.refreshObserver();
    }
  }
  
  resetObserver(Observer){
    this.#Observer = Observer;
    if(this.refreshObserverAutomatically){
      this.refreshObserver();
    }
  }
  resetObserverOption(option = new ObserverInitOptions()){
    this.#Option = option;
    if(this.refreshObserverAutomatically){
      this.refreshObserver();
    }
  }

  refreshObserver(){
    this.#Observer.disconnect();
    console.log('observer state is on refresh')
    this.#Observer.observe(this.target,this.#Option);
    console.log('refreshed!')
  }
}

//template
/* const ButtonCreator = new MutationObserverManager(document.body,Observer,{//Observer Option
  childList:false,
  attributes:true,
  subtree:true,
  attributeFilter:['role'],
}) */