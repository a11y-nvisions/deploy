const ToArray = (arr)=>{
    const EmptyArray = [];
    for(let i=0; i<arr.length; i++){
        EmptyArray[i] = arr[i];
    }
    return EmptyArray;
}

interface Element{
    checked?:boolean,
    disabled?:boolean,
    CustomConstructor?:RadioElement
}

//Code usage Example is at bottom of this code document

//common constructor
class CustomFormElement {
    //This class is not for creating an element. It's for managing the status of elements only.
    public ELEMENT: Element;
    private LABEL_ELEMENT:Element;
    constructor(
        element:Element
        ){
        const __this__ = this; // Temp
        this.ELEMENT = element; // main Element
        this.disabled=this.disabled; // initial disabled
        this.role = this.role ? this.role : ''; // initial disabled
        this.linkLabelToControlElement = this.getLinkedLabelElement; //code for linking the label to main Element
        this.ELEMENT.addEventListener('click',function(e){
            e.preventDefault();
        })
        Object.defineProperty(this.ELEMENT,'CustomConstructor',{//send this object for setting a states from HTMLElement
            get:function(){
                return __this__;
            }
        });
        //for Linking disabled state change method, get method at main element
        //You can get and set the disabled state by using Element.disabled.
        Object.defineProperty(this.ELEMENT,'disabled',{
            get:function(){
                return this.CustomConstructor.disabled;   
            },
            set:function(v){
                this.CustomConstructor.disabled = v;
            }
        });
    }


    get hasLabelingAttribute(){
        //get Checked result Is this object has attribute aria-labelledby
        const hasLabel = this.ELEMENT.hasAttribute('aria-labelledby');
        return hasLabel ? true : false;
    }

    get role(){
        //get role
        return this.ELEMENT.getAttribute('role');
    }

    set role(role_name:string){
        //set role
        if(role_name !== ''){
            this.ELEMENT.setAttribute('role',role_name);
        }
    }
    
    get getLinkedLabelElement(){
    //check an element that matched the id value string of an "aria-labelledby" attribute is exists in your HTML Document.
        if(this.hasLabelingAttribute){
            const LABEL_ELEMENT = document.getElementById(this.ELEMENT.getAttribute('aria-labelledby'));
            return LABEL_ELEMENT ? LABEL_ELEMENT : null;
        }
    }

    
    set linkLabelToControlElement(lb:Element){
        /*
        [What is this method for?]
        This method makes you can focus or click a custom form element by click a custom label. like just the native input element.

        [how-to-use?]
        get element value to use a getLinkedLabelElement method to get label element if an element is connected in the document and then assign to this setter property.
        
        */
        if(lb){
            this.LABEL_ELEMENT = lb;
            this.LABEL_ELEMENT.setAttribute('data-role','label');
            this.LABEL_ELEMENT.addEventListener('click',function(){
                if(!this.disabled){
                    this.ELEMENT.click();
                }
            }.bind(this));
        }
    }

    public get disabled(){
        //get disabled boolean state
        const state = this.ELEMENT.getAttribute('aria-disabled');
        return state === "true" ? true : false;
    }

    public set disabled(v:boolean){
        //set state to disabled by boolean
        this.ELEMENT.setAttribute('aria-disabled',String(v));
        this.focusable=!v;
        if(this.getLinkedLabelElement){
            this.getLinkedLabelElement.classList.toggle('disabled-label',v);
        }
    }

    get focusable(){
        //get foucsable info for the focus managing
        const state = this.ELEMENT.getAttribute('tabindex');
        return state === '0' ? true : false;
    }

    set focusable(v:boolean){
        //set foucsable info for the focus managing
        //It's a Material for disabled state
        const tabindex_value = v ? 0 : -1;
        this.ELEMENT.setAttribute('tabindex',tabindex_value.toString());
    }
}

class CheckableElement extends CustomFormElement {
    /***
     
    Do not use a CheckableElement Class to Constructor();

    It is only for the status management.

     ***/
    constructor(element){
        super(element);
        Object.defineProperty(this.ELEMENT,'checked',{
            get:function(){
                return this.CustomConstructor.checked;
            },
            set:function(v){
                this.CustomConstructor.checked=v;
            }
        });

        this.ELEMENT.addEventListener('keydown',function(e){
            const code = e.code;
            if(code === "Enter" &&
            (e.target instanceof HTMLAnchorElement ||
            e.target instanceof HTMLButtonElement )
            ){
                e.preventDefault();
            }
        }.bind(this))
    }

    public get isCheckable(){
        return ( (this.role === 'checkbox') ||
        (this.role === 'radio') ||
        (this.role === 'menuitemcheckbox') ||
        (this.role === 'menuitemradio') ) ? true : false;
    }

    public get checked(){
        if(this.isCheckable){
            return this.ELEMENT.getAttribute('aria-checked') === 'true' ? true : false;
        }
    }

    public set checked(v:boolean){
        if(this.isCheckable){
            this.ELEMENT.setAttribute('aria-checked',v.valueOf().toString())
        }
    }
}

//common constructor end


//Checkbox instance Class
class CheckboxElement extends CheckableElement{
    
    //for check all
    private CHECKBOX_GROUP_ELEMENT_TOBE_MANAGED:Element;
    
    //this element is for displaying icons only.
    private CHECKBOX_MARK_ELEMENT:Element = document.createElement('span');
    
    // child checkbox list
    private childCheckboxes? = [];

    constructor(element:Element){
        super(element);
        
        //initial checked state, default is false
        //You can initialize the checkbox default value to true by aria-checked="true" on pattern markup
        this.checked = this.checked;
        this.CHECKBOX_MARK_ELEMENT.classList.add('material-icons','checkbox-checked');
        this.CHECKBOX_MARK_ELEMENT.setAttribute('aria-hidden','true');
        this.ELEMENT.append(this.CHECKBOX_MARK_ELEMENT);
        this.CHECKBOX_GROUP_ELEMENT_TOBE_MANAGED = document.getElementById(this.ELEMENT.getAttribute('aria-controls'));
        this.setManagerCheckbox = this.isManagerCheckbox;
        

        //Events

        //Click to Toggle State
        this.ELEMENT.addEventListener('click',function(){
            if(!this.disabled){
                this.toggle();
                this.ELEMENT.focus();
            }
        }.bind(this));

        //keyboard Event: Press Spcae ket to Toggle State
        this.ELEMENT.addEventListener('keydown',function(e){
            const c = e.code;
            switch(c){
                case "Space":
                    this.toggle();
                break;
            }
        }.bind(this));
    }


    
    public static CustomCheckboxCollection:CheckboxElement[] = [];
    /*
    It's a static property, you can't access it as InstanceName.
    You must access this property as below line. 
    >>CheckboxElement.CustomCheckboxCollection
    */

    public static startReconfiguration(){
        //It's a static method, you must access and use likes "CheckboxElement.startReconfiguration()".
        const Elements = document.querySelectorAll('[role=checkbox]');
        CheckboxElement.CustomCheckboxCollection = [];
        for(let i=0; i<Elements.length; i++){
            const element = Elements[i];
            CheckboxElement.CustomCheckboxCollection[i] = new CheckboxElement(element);
        }
    }

    checkAll(v:boolean){
        //This method's purpose is just the same as the method name. If this checkbox is manager, make child checkboxes to checked or not checked state when you clicked to toggle the check state of this element..
        const childCheckboxes = this.childCheckboxes;
        const childsLength = childCheckboxes.length;
        for(let i = 0; i<childsLength; i++){
            const element = childCheckboxes[i];
            element.checked = v;
        }
    }

    CheckboxManageListener(v:boolean){
        /*
            This code will be run If this checkbox is a manager checkbox.

            if the child checkbox is not all checked or all not checked, this code will make a checked state of the manager checkbox to a "mixed" state.
        */
        if(v){
            const _this=this
            if(this.CHECKBOX_GROUP_ELEMENT_TOBE_MANAGED){
                const childList = this.CHECKBOX_GROUP_ELEMENT_TOBE_MANAGED.querySelectorAll('[role="checkbox"],input[type="checkbox"]');
                this.childCheckboxes = ToArray(childList);

                const detector = new MutationObserver((m)=>{
                    const currentChecked = Array.prototype.filter.call(childList,(e)=>{
                        return e.getAttribute('aria-checked') === true || e.checked;
                    })

                    if(currentChecked.length !== 0 || currentChecked.length !== childList.length){
                        _this.ELEMENT.setAttribute('aria-checked','mixed');
                    }
                    
                    if(currentChecked.length === 0 ){
                        _this.checked = false;
                    }
                    
                    if(currentChecked.length === childList.length){
                        _this.checked = true;
                    }
                })
                
                detector.observe(_this.CHECKBOX_GROUP_ELEMENT_TOBE_MANAGED,{
                    attributes:true,
                    attributeFilter:['aria-checked'],
                    subtree:true
                });
            }
        }
    }

    set setManagerCheckbox(v:boolean){//set manager checkbox Programmatically
        this.ELEMENT.setAttribute('data-manager-checkbox',v.valueOf().toString());
        this.CheckboxManageListener(v);
    }

    get isManagerCheckbox(){// This getter is a property for check this checkbox is a manager checkbox.
        return this.ELEMENT.getAttribute('data-manager-checkbox') === 'true' ? 
        true : false;
    }

    toggle(){ /* The purpose of this property is the same as the property name. 
        Method for toggling checked or unchecked state*/
        if(this.isCheckable && !this.disabled){
            this.ELEMENT.setAttribute('aria-checked',
            (!this.checked).valueOf().toString())
            this.checkAll(this.checked);
        }
    };
};



CheckboxElement.startReconfiguration();

//checkbox end


//radio button class

class RadioElement extends CheckableElement {
    

    private RadioGroup:any[]=ToArray(document.querySelectorAll('[role="radio"]'));
    public index:number;

    //this element is for displaying icons only.
    private RADIO_MARK_ELEMENT:Element = document.createElement('span');
    constructor(element){
        super(element);
        this.RadioGroup = this.getCurrentGroupRadioObjects;
        this.index = this.getIndexFromGroup;
        this.RADIO_MARK_ELEMENT.classList.add('material-icons','radio-selected');
        this.RADIO_MARK_ELEMENT.setAttribute('aria-hidden','true');
        this.ELEMENT.appendChild(this.RADIO_MARK_ELEMENT);

        if(
            document.querySelector(`[data-radio-name="${this.getGroupName}"][aria-checked="true"]`)
        ) {
            document.querySelector(`[data-radio-name="${this.getGroupName}"][aria-checked="true"]`).CustomConstructor.select(true);
        } else {
            this.select(false);
            this.RadioGroup[0].CustomConstructor.focusable = true;
        }

        this.ELEMENT.addEventListener('click',function(){
            this.select(true);
        }.bind(this));

        this.ELEMENT.addEventListener('keydown',function(e){
            const code = e.code;
            const NEXT1 = "ArrowDown";
            const NEXT2 = "ArrowRight";
            const PREV1 = "ArrowUp";
            const PREV2 = "ArrowLeft";
            if(code === NEXT1 || code === NEXT2){
                if(this.NextRadioButton){
                    this.NextRadioButton.CustomConstructor.select(true);
                    this.NextRadioButton.focus();
                } else{
                    this.getSelectableRadioButtons[0].CustomConstructor.select(true);
                    this.getSelectableRadioButtons[0].focus();
                }
            } 
            if (code === PREV1 || code === PREV2){
                if(this.PreviousRadioButton){
                    this.PreviousRadioButton.CustomConstructor.select(true);
                    this.PreviousRadioButton.focus();
                }else{
                    this.getSelectableRadioButtons[
                        this.getSelectableRadioButtons.length-1
                    ].CustomConstructor.select(true);
                    this.getSelectableRadioButtons[
                        this.getSelectableRadioButtons.length-1
                    ].focus();
                }
            }
            if(code === 'Space'){
                this.ELEMENT.click();
            }
        }.bind(this));
    }

    get getSelectableRadioButtons(){
        return Array.prototype.filter.call(this.RadioGroup,(e)=>{
           return e.getAttribute('aria-disabled') !== 'true';
        });
    }

    get NextRadioButton(){
        const NextRadioElement = this.getSelectableRadioButtons[this.index+1];
        return NextRadioElement ? NextRadioElement : null;
    }

    get PreviousRadioButton(){
        const PreviousRadioElement = this.getSelectableRadioButtons[this.index-1];
        return PreviousRadioElement ? PreviousRadioElement : null;
    }

    get getIndexFromGroup(){
        return Array.prototype.indexOf.call(this.RadioGroup,this.ELEMENT);
    }

    get getGroupName(){
        const hasGroupNameAttribute:boolean = this.ELEMENT.hasAttribute('data-radio-name');
        const getGroupNameAttributeValue:string = this.ELEMENT.getAttribute('data-radio-name');
        if(hasGroupNameAttribute) {
            return getGroupNameAttributeValue;
        }else{
            throw Error("Radio Components must have data-radio-name!");
        }
    }

    public get checked(){
        if(this.isCheckable){
            return this.ELEMENT.getAttribute('aria-checked') === 'true' ? true : false;
        }
    }

    public set checked(v:boolean){
        if(this.isCheckable){
            this.ELEMENT.setAttribute('aria-checked',v.valueOf().toString());            
            this.focusable = v;
        }
    }

    public select (v:boolean){
        if(!this.disabled){
            this.checked = v;
            const ToBeUnselected = this.getColleagueRadioButton;
            const ToBeUnselected_length = ToBeUnselected.length
            for(let i=0; i<ToBeUnselected_length; i++){
                ToBeUnselected[i].checked = false;
            }
        }
    }

    get getColleagueRadioButton(){//get the radio button list that has the same data-radio-name as this and excepted for this instance.
        const _this = this;
        const result = Array.prototype.filter.call(this.getCurrentGroupRadioObjects,function(e){
            return e !== _this.ELEMENT;
        })

        return result;
    }

    get getCurrentGroupRadioObjects(){//get all radio button that has the same name
        const _this = this;
        if(this.getGroupName){
            const result = Array.prototype.filter.call(this.RadioGroup,(e)=>{
                return e.getAttribute('data-radio-name') === _this.getGroupName;
            })
            return result;
        }
    }

    public static CustomRadioCollection:RadioElement[] = [];//custom radio button collection(static)

    public static startReconfiguration(){
        //It's a static method, you must access and use likes "RadioElement.startReconfiguration()".
        const Elements = document.querySelectorAll('[role="radio"]');
        RadioElement.CustomRadioCollection = [];
        for(let i=0; i<Elements.length; i++){
            const element = Elements[i];
            RadioElement.CustomRadioCollection[i] = new RadioElement(element);
        }
    }
}

RadioElement.startReconfiguration();//start reconfigure the elements that written by a valid pattern.

/*Checkbox Markup
<span id="label">Example</span>
<div role="checkbox" aria-labelledby="label"></div>
*/

/*Manager Checkbox Markup
<span id="manager-label">Check-All</span>
<div role="checkbox" aria-labelledby="manager-label" aria-controls="for-check-all"></div>
<div id="for-check-all">
    <span id="managed-1">Check Option 1</span>
    <div role="checkbox" aria-labelledby="managed-1"></div>
    <span id="managed-2">Check Option 2</span>
    <div role="checkbox" aria-labelledby="managed-2"></div>
    <span id="managed-3">Check Option 3</span>
    <div role="checkbox" aria-labelledby="managed-3"></div>
</div>
*/

/*
Radio Markup

    <div role="radio" data-radio-name="good" aria-labelledby="FavorColor1"></div>
    <span id="FavorColor1">Black</span>
    
    <div aria-checked="true" aria-labelledby="FavorColor2" role="radio" data-radio-name="good"></div>
    <span id="FavorColor2">Red</span>

    <div aria-disabled="true" aria-labelledby="FavorColor3" role="radio" data-radio-name="good"></div>
    <span id="FavorColor3">Blue</span>

    <div aria-disabled="true" aria-labelledby="FavorColor4" role="radio" data-radio-name="good"></div>
    <span id="FavorColor4">White</span>
*/