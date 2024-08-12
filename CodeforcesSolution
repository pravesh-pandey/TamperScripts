// ==UserScript==
// @name         CodeforcesSolution
// @version      1.1
// @description  try to take over the world!
// @author       https://www.linkedin.com/in/pravesh25/
// @match        https://codeforces.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @grant        none
// ==/UserScript==
(function() {
    const url = document.URL
    let url_parts=url.split("/")
    let new_url;
    if(url_parts.includes('contest') && url_parts.length>5){
        new_url = "https://codeforces.com/problemset/status/"
            +url_parts[url_parts.length-3]
            +"/problem/"
            +url_parts[url_parts.length-1]
            +"?order=BY_CONSUMED_TIME_ASC"
    } else if(url_parts.includes('problemset')){
        new_url = "https://codeforces.com/problemset/status/"
            +url_parts[url_parts.length-2]
            +"/problem/"
            +url_parts[url_parts.length-1]
            +"?order=BY_CONSUMED_TIME_ASC"
    }else{
        return;
    }
    var mainMenu = document.querySelector(".main-menu-list");

    var solution_li = document.createElement("li");

    var btn = document.createElement('a');
    btn.setAttribute('href',new_url);
    btn.innerHTML = "Solution";

    solution_li.appendChild(btn);
    mainMenu.appendChild(solution_li);
})();

