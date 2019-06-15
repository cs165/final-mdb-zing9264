
class DiaryScreen {

    constructor(containerElement){
        this.containerElement = containerElement;
        this.today = new Date();
        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);
        this._getInfo = this._getInfo.bind(this);
        this._postdata = this._postdata.bind(this);


        this.herf= location.href.split('/')[4];

        this._getInfo(this.today);

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        this.form= containerElement.querySelector("form");
        this.form.addEventListener('submit',this._postdata);
    }

    hide(){
        this.containerElement.classList.add('inactive');
    }
    show(){
        this.containerElement.classList.remove('inactive');
    }
    async _getInfo( today ){
        const options = { month: 'long', day: 'numeric' };
        console.log( today.toLocaleDateString('en-US', options));
        console.log( today.toLocaleDateString());
        var todayslash = today.toLocaleDateString();
        var day= todayslash.split('/')[2];
        this.containerElement.querySelector('.date h1').innerHTML = today.toLocaleDateString('en-US', options)+'---'+ todayslash;

        const title= await fetch('../js/title.json');
        const json = await title.json();
        console.log(json);

        this.containerElement.querySelector('.title h4').innerHTML=json.title[day-1];

    }

     _postdata(){
        const contents=this.containerElement.querySelector('.context .textarea').value;
        console.log("contents="+contents);
        event.preventDefault();

         const params = {
             DiaryId: this.herf,
             Dbdate: this.today.toLocaleDateString(),
             Dbcontents:contents
         };

        fetch("/save",{
             method:'POST',
             headers:{
                 'Accept': 'application/json',
                 'Content-Type': 'application/json'
             },
            body: JSON.stringify(params)
         })
             .then((response)=>response.json())
             .then((responseJsonData)=>{
                 alert("success");
                 console.log(responseJsonData);
             })
             .catch((error)=>{
                 alert(error);
             });
    }


}

