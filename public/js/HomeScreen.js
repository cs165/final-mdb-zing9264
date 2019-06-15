class HomeScreen {

    constructor(containerElement){
        this.containerElement = containerElement;
        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);
        this._creatJournal = this._creatJournal.bind(this);

        this.creatbtn = this.containerElement.querySelector('.creatbtn');
        this.creatbtn.addEventListener('click', this._creatJournal );
        this.newId=0;

    }
    hide(){
        this.containerElement.classList.add('inactive');
    }
    show(){
        this.containerElement.classList.remove('inactive');
    }
    async _creatJournal(){
        event.preventDefault();

        console.log(this.creatbtn);

        const result =await fetch('/creatNewDiary');
        const json = await result.json();
        console.log(result);
        console.log(json);
        this.newId=json.DiaryId;
        console.log(this.newId);
        let changeToDiary = new CustomEvent('changeToDiary');
        dispatchEvent(changeToDiary);
    }
}
