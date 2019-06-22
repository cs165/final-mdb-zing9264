class HomeScreen {

    constructor(containerElement){
        this.containerElement = containerElement;
        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);
        this._creatJournal = this._creatJournal.bind(this);
        this._loadJournal = this._loadJournal.bind(this);
        this.deleteJournal = this.deleteJournal.bind(this);
        this.loadChangePage = this.loadChangePage.bind(this);

        this.creatbtn = this.containerElement.querySelector('.creatbtn');
        this.creatbtn.addEventListener('click', this._creatJournal );

        this.loadbtn = this.containerElement.querySelector('.loadbtn');
        this.loadbtn.addEventListener('click', function () {
            document.querySelector('#savedDiary').classList.remove('inactive');
        } );
        this.newId=0;
        this._loadJournal();
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

    loadChangePage(event){
        event.preventDefault();
        console.log(event.srcElement.innerHTML.split(" ")[1]);
       this.newId=event.srcElement.innerHTML.split(" ")[1];
        console.log(this.newId);
        let changeToDiary = new CustomEvent('changeToDiary');
        dispatchEvent(changeToDiary);
    }

    async _loadJournal(){
        const result =await fetch('/loadDiary');
        const json = await result.json();
        console.log(result);
        console.log(json);

        for(let i=0;i<json.length;i++){
            var DiaryId= json[i].DiaryId;
            var loaddiary =document.createElement("div");
            var node =  document.createElement("button");
            var denode= document.createElement("button");
            var br =  document.createElement("br");
            node.innerText="Diary: "+DiaryId;
            node.classList.add("loadDiary");
            console.log(node);
            denode.innerText="delete";
            denode.id=DiaryId;
            denode.classList.add("deleteDiary");
            loaddiary.id="loaddiary_"+json.length;
            loaddiary.classList.add("loadBlock");
            var a=document.getElementById("savedDiary").appendChild(loaddiary);
            a.appendChild(node);
            a.appendChild(denode);
            a.appendChild(br);

            denode.addEventListener('click',this.deleteJournal);
            node.addEventListener('click',this.loadChangePage);
        }
    }


    async deleteJournal(event){
        console.log(event.srcElement.id);

        const json=await fetch("/delete/" + event.srcElement.id, {
            method: 'delete'
        })
            .then(response => response.json());

        console.log(json.Content);
        location.reload()
    }

}
