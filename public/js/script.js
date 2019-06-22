//
// TODO(you): Add the JavaScript necessary to complete your final project.
//
const app = new App();

settextarea(0);

    function setbg(color)
    {
        document.getElementById("styled").style.background=color
    }

function settextarea(i) {
        var area=  document.getElementById("styled");
    if(i===1) {
        area.style.height = "540px";
        area.style.width ="960px";
    }
    else {
        area.style.height = "360px";
        area.style.width ="640px";
    }
}