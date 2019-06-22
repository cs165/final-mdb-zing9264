class App {
    constructor() {
        this._changeToDiary=this._changeToDiary.bind(this);


        const homeElement = document.querySelector('.home');
        this.homeScreen = new HomeScreen(homeElement);
        const diaryElement = document.querySelector('.display-journal');
        this.diaryScreen = new DiaryScreen(diaryElement);
        addEventListener('changeToDiary',this._changeToDiary)
        addEventListener('postdata',diaryElement._postdata);
    }
     _changeToDiary(){
        this.homeScreen.hide();
        window.location.href = '/id/'+this.homeScreen.newId;
    }
}