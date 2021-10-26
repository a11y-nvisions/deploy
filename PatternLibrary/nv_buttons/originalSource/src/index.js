import CustomButton from './custom-button.comcept2.js';

[HTMLAnchorElement,HTMLDivElement,HTMLSpanElement].forEach(function(el){
    el.prototype.isCustomButton = false;
    el.prototype.setItAsNormalButton=function(
        initDisabled=false
    ) {
        if(!this.isCustomButton){
            const newBtn = new CustomButton(this);
            newBtn.disabled = initDisabled;
            CustomButton.collection.push(newBtn);
        }
    };
    Element.prototype.setItAsSwitchButton=function(
        initDisabled=false,
        initPressed=false
    ) {
        if(!this.isCustomButton){
            this.dataset.buttonRole="switch";
            const newBtn = new CustomButton(this);
            newBtn.disabled = initDisabled;
            newBtn.pressed = initPressed;
            CustomButton.collection.push(newBtn);
        }
    }
    Element.prototype.setItAsAccordionButton=function(
        initDisabled=false,
        initExpanded=false,
        contentElementId = null
    ) {
        if(!this.isCustomButton){
            this.dataset.buttonRole = "accordion";
            if(contentElementId){
                this.setAttribute('aria-controls',contentElementId);
            }
            const newBtn = new CustomButton(this);
            newBtn.disabled = initDisabled;
            newBtn.pressed = initExpanded;
            CustomButton.collection.push(newBtn);
        }
    }
})

window.CustomButtonAutoCreation = CustomButton.startCreation;
CustomButtonAutoCreation();