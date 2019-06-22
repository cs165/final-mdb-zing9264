
class DiaryScreen {

    constructor(containerElement){
        this.containerElement = containerElement;
        this.today = new Date();
        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);
        this._getInfo = this._getInfo.bind(this);
        this._postdata = this._postdata.bind(this);
        this._changeDate = this._changeDate.bind(this);
        this._gohome = this._gohome.bind(this);
        this.currentDate =  this.today;

        this.herf= location.href.split('/')[4];
        this.title= null;
        this.contents=null;

        this.form= containerElement.querySelector("form");
        this.form.addEventListener('submit',this._postdata);

        this.back=containerElement.querySelector(".back");
        this.back.addEventListener('pointerdown',this._changeDate);
        this.forward=containerElement.querySelector(".forward");
        this.forward.addEventListener('pointerdown',this._changeDate);
        this.home=containerElement.querySelector(".home");
        this.home.addEventListener('pointerdown',this._gohome);
        this._changeDate(null);
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
        this.containerElement.querySelector('.date h1').innerHTML = today.toLocaleDateString('en-US', options);
        this.containerElement.querySelector('.title h4').innerHTML = this.title;
        this.containerElement.querySelector('.context .textarea').value =this.contents;


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

    _changeDate(event) {
        var num=func(location.href,'/')
        console.log(location.href+ " --- "+num);
        if(num!==4){
            return;
        }

        if(event!=null) {
            var page = event.srcElement.classList[1];
            console.log();

            if (page == 'back') {
                this.currentDate.setDate(this.currentDate.getDate() - 1);
                console.log(this.currentDate);
            }
            else if (page == 'forward') {
                this.currentDate.setDate(this.currentDate.getDate() + 1);
                console.log(this.currentDate);
            }
        }

        const params = {
            DiaryId: this.herf,
            Dbdate: this.currentDate.toLocaleDateString().replace(new RegExp('/', 'g'),"-")
        };

        fetch("/getinfo/"+params.DiaryId+"/"+params.Dbdate)
            .then((response) => response.json())
            .then((responseJsonData) => {
                console.log("success");
                this.title=responseJsonData.title;
                this.contents=responseJsonData.Content;
                console.log(responseJsonData);
                this._getInfo(this.currentDate);
            })
            .catch((error) => {

            });

    }
    _gohome(event){
        window.location.href = '/id/'+this.herf;
    }


}

function func(str,char){ var str=str; var num=(str.split(char)).length-1; return num};
