// ==UserScript==
// @namespace         https://greasyfork.org/en/users/106222-qxin-i

// @name              Remove web limits(modified)
// @name:en           Remove web limits(modified)
// @name:zh           网页限制解除(改)
// @name:ja           ウェブの規制緩和(変更)

// @author            Cat73 & iqxin(modified) 
// @contributor       iqxin

// @description       Bypasses restrictions on most websites, allowing you to copy, cut, select text, and use the right-click menu. Original author is cat73. This version is modified to avoid conflicts with a search redirection script.
// @description:en    Bypasses restrictions on most websites, allowing you to copy, cut, select text, and use the right-click menu. Original author is cat73. This version is modified to avoid conflicts with a search redirection script.
// @description:zh    通杀大部分网站,可以解除禁止复制、剪切、选择文本、右键菜单的限制。原作者cat73,因为和搜索跳转脚本冲突,遂进行了改动
// @description:zh-TW 通殺大部分網站,可以解除禁止復制、剪切、選擇文本、右鍵菜單的限制。
// @description:ja    サイトのほとんどを殺すために渡し、あなたは、コピー切り取り、テキスト、右クリックメニューを選択することは禁止の制限を解除することができます。

// @description       The original author is https://www.github.com/Cat7373/. This version is modified to avoid conflicts with a search redirection script.
// @homepageURL       https://cat7373.github.io/remove-web-limits/
// @supportURL        https://greasyfork.org/zh-CN/scripts/28497

// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAABpElEQVR4nO3Vv2uUQRDG8c/ebSMWqay0trATAxrUSi1S2AiWFoJYpNCgoBjURsHWJKeNRfAvsDgFixQqKdPZ2ViEiCJYBOQu8f1hEXO59713j7MUfLZ6d2a/O8vMO0OzDnin9Ku2Mjvuaw07xgSAYEVXe2indMhj92zpKJLnBhF8MDeye9hn6zbN70eRiqCw02Bra3up8BBLu1FEBxsBucXqW4csz0ULe4jorSCMuPU89boRELDMHiI6Y8V65bbCUTccc70RkaOwKLOg0IkyXa9qTjOu2LAs6NZuD86hrdTyxRNTkUqqdhXlHrngGRVEZsMpJwex9DxIZSHYclesIb65LCoHgIs66UJq6btDBZHZrPh8V6YBOX66LbOkTGckBYimBW2FVTNeuOZNyrFJ236Yl4NSy5SbVm1PDvhodqgyMledTdRlAtDzqfL9tfkwUtyaRkv9LwFj9B/w7wPycXOhqlJ0yZHKPChMi5MCiM47XhsopbVJAUHfrYbmN/EToN+02eLPfz9OYyZhFJzW1Jn3lTsxaKQjCkp52jy45r1ZvSbTb9M0d4PBozGZAAAAAElFTkSuQmCC

// @version           4.4.8
// @license           LGPLv3

// @match             *://*/*
// @exclude        *www.bilibili.com/video*
// @exclude        *www.bilibili.com/v*
// @exclude        *www.bilibili.com/s/*
// @exclude        *www.bilibili.com/bangumi*
// @exclude        https://www.bilibili.com/medialist/play/*
// @exclude        *www.youtube.com/watch*
// @exclude        *www.panda.tv*
// @exclude        *www.github.com*
// @exclude        https://lanhuapp.com/*
// @exclude        https://www.douyu.com/*
// @exclude        https://www.zhihu.com/signin?*
// @exclude        https://tieba.baidu.com/*
// @exclude        https://v.qq.com/*
// @exclude        *.taobao.com/*
// @exclude        *tmall.com*
// @exclude        *signin*

// @connect     eemm.me
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/28497/Remove%20web%20limits%28modified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/28497/Remove%20web%20limits%28modified%29.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var settingData = {
        "status":1,
        "version" : 0.1,
        "message" : "La la la, la la la, I am a little expert in selling newspapers",
        "positionTop":"0",
        "positionLeft":"0",
        "positionRight":"auto",
        "addBtn" : true,
        "connectToTheServer" : false,
        "waitUpload":[],
        "currentURL":"null",
        "shortcut":3,
        // Domain Name Rule List
        "rules" : {
            "rule_def": {
                "name": "default",
                "hook_eventNames": "contextmenu|select|selectstart|copy|cut|dragstart|mousemove|beforeunload",
                "unhook_eventNames": "mousedown|mouseup|keydown|keyup",
                "dom0": true,
                "hook_addEventListener": true,
                "hook_preventDefault": true,
                "hook_set_returnValue": true,
                "add_css": true
            },
            "rule_plus": {
                "name": "default",
                "hook_eventNames": "contextmenu|select|selectstart|copy|cut|dragstart|mousedown|mouseup|mousemove|beforeunload",
                "unhook_eventNames": "keydown|keyup",
                "dom0": true,
                "hook_addEventListener": true,
                "hook_preventDefault": true,
                "hook_set_returnValue": true,
                "add_css": true
            },
            "rule_zhihu": {
                "name": "default",
                "hook_eventNames": "contextmenu|select|selectstart|copy|cut|dragstart|mousemove",
                "unhook_eventNames": "keydown|keyup",
                "dom0": true,
                "hook_addEventListener": true,
                "hook_preventDefault": true,
                "hook_set_returnValue": true,
                "add_css": true
            }
        },
        "data": [
            "b.faloo.com",
            "bbs.coocaa.com",
            "book.hjsm.tom.com",
            "book.zhulang.com",
            "book.zongheng.com",
            "chokstick.com",
            "chuangshi.qq.com",
            "city.udn.com",
            "cutelisa55.pixnet.net",
            "huayu.baidu.com",
            "imac.hk",
            "life.tw",
            "luxmuscles.com",
            "news.missevan.com",
            "read.qidian.com",
            "www.15yan.com",
            "www.17k.com",
            "www.18183.com",
            "www.360doc.com",
            "www.coco01.net",
            "www.eyu.com",
            "www.hongshu.com",
            "www.hongxiu.com",
            "www.imooc.com",
            "www.jjwxc.net",
            "www.readnovel.com",
            "www.tadu.com",
            "www.xxsy.net",
            "www.z3z4.com",
            "www.zhihu.com",
            "yuedu.163.com",
            "www.ppkao.com",
            "movie.douban.com",
            "www.ruiwen.com",
            "vipreader.qidian.com",
            "www.pigai.org",
            "www.shangc.net",
            "www.myhtlmebook.com",
            "www.yuque.com",
            "www.longmabookcn.com",
            "www.alphapolis.co.jp",
            "www.sdifen.com",
            "votetw.com",
            "boke112.com",
            "www.myhtebooks.com",
            "www.xiegw.cn",
            "chuangshi.qq.com",
            "www.uta-net.com",
            "www.bimiacg.net",
            "www.dianyuan.com",
            "origenapellido.com",
            "3g.163.com",
            "www.lu-xu.com",
            "leetcode.cn",
            "www.jianbiaoku.com",
            "www.soyoung.com",
            "doc.guandang.net",
            "www.51dongshi.com",
            "m.haodf.com",
            "www.daodoc.com",
            "www.wcqjyw.com",
            "www.szxx.com.cn",
        ]
    }
 
    var rwl_userData = null;
    var hostname = window.location.hostname;
    var btn_node = null;   
    var rule = null;
    var list = null;
    var hasFrame = false;
 
    // Storage name
    var storageName = "iqxinStorageName";
    // List of events to be processed
    var hook_eventNames, unhook_eventNames, eventNames;
    // Store hooked functions
    var EventTarget_addEventListener = EventTarget.prototype.addEventListener;
    var document_addEventListener = document.addEventListener;
    var Event_preventDefault = Event.prototype.preventDefault;
 
    // Check if old data exists locally
    rwl_userData = GM_getValue("rwl_userData");
    if(!rwl_userData){
        rwl_userData = settingData
        // GM_setValue("rwl_userData",rwl_userData);
    }
    // Automatic data update
    for(let value in settingData){
        if(!rwl_userData.hasOwnProperty(value)){
            rwl_userData[value] = settingData[value];
            GM_setValue("rwl_userData",rwl_userData);
        }
    }
 
    version_up_3_to_4();
 
    // Get blacklisted websites
    list = get_black_list();
 
    // Add button
    // if(rwl_userData.addBtn){
        addBtn();  // Add
        btn_node = document.getElementById("black_node");
 
        var timer = setInterval(function(){
            if(document.getElementById("black_node")){
                clearInterval(timer);
                qxinStart();
            } else {
                addBtn();
            }
        },500)
 
    // }
 
    GM_registerMenuCommand("Remove Copy Restriction Settings", setMenu)
    var userSetting = GM_getValue("rwl_userData");
 
    // // ------------------------------function func
 
    function qxinStart(){
        console.log("Script: Remove web limits(modified) --- Start execution --- Publisher: qxin --- GitHub: https://github.com/qxinGitHub/Remove-web-limits-");
        addDragEven();
        setBtnClick();
 
        // Check if it is in the blacklist
        if(check_black_list(list,hostname)){
            try {
                if(rwl_userData.addBtn){
                    btn_node.checked = true;
                }
            } catch (e) {
                console.error("Script rwl-error:\n btn_node : %s\n%s\nScript rwl-error location: btn_node.checked = true;",btn_node,e);
            } finally {
                init();
            }
        }
    }
 
    //Add button func
    function addBtn(){
        var node = document.createElement("remove-web-limits-iqxin");
        node.id = "rwl-iqxin";
        node.className = "rwl-exempt";
 
        // Re-opening the window is smaller than the previous window, causing the button to appear outside the visible window
        var screenClientHeight = document.documentElement.clientHeight;
        var tempHeight;
        if (rwl_userData.positionTop>screenClientHeight){
            tempHeight  = screenClientHeight -40;
        } else{
            tempHeight = rwl_userData.positionTop;
        }
        // When changing the window size
        window.onresize=function(){
            var screenClientHeight = document.documentElement.clientHeight;
            var tempHeight;
 
            if (rwl_userData.positionTop>screenClientHeight){
                    tempHeight  = screenClientHeight -40;
            } else{
                tempHeight = rwl_userData.positionTop;
            }
 
            node.style.top =  tempHeight + "px";
        }
 
        tempHeight = tempHeight<0?0:tempHeight
        node.style.cssText = "position:fixed;top:"+tempHeight+"px;left:"+rwl_userData.positionLeft+"px;right:"+rwl_userData.positionRight+"px;";
        // node.innerHTML = '<label><input type="checkbox" name="" id="black_node">Blacklist</label><qxinbutton id="delete">delete</btton>';
        // node.innerHTML = '<label>Remove Restriction <input type="checkbox"  name="" id="black_node"></label>';
        node.innerHTML = '<qxinbutton type="qxinbutton" id="rwl-setbtn"> set </qxinbutton> <lalala style="cursor:move; font-size:12px;">Remove Restriction</lalala> <input type="checkbox" name="" id="black_node" >';
        if(window.self === window.top){
            if (document.querySelector("body")){
                document.body.appendChild(node);
            } else {
                document.documentElement.appendChild(node);
            }
        }
        node.addEventListener("mouseover",function(){
            node.classList.add("rwl-active-iqxin");
        });
        node.addEventListener("mouseleave",function(){
            setTimeout(function(){
                node.classList.remove("rwl-active-iqxin");
                black_check(black_node.checked);
            },100)
        });
 
        var style = document.createElement("style");
        style.type="text/css";
 
        var styleInner = "#rwl-iqxin{"
                + "position:fixed;"
                + "transform:translate(-95%,0);"
                + "width:85px;"
                + "height:25px;"
                + "font-size:12px;"
                + "font-weight: 500;"
                + "font-family:Verdana, Arial, 'SimSun';"
                + "color:#fff;"
                + "background:#333;"
                + "z-index:2147483647;"
                + "margin: 0;"
                + "opacity:0.05;"
                + "transition:0.3s;"
                + "overflow:hidden;"
                + "user-select:none;"
                + "text-align:center;"
                + "white-space:nowrap;"
                + "line-height:25px;"
                + "padding:0 16px;"
                + "border:1px solid #ccc;"
                + "border-width:1px 1px 1px 0;"
                + "border-bottom-right-radius:5px;"
                + "box-sizing: content-box;"
            + "}" + "#rwl-iqxin input{"
                + "margin: 0;"
                + "padding: 0;"
                + "vertical-align:middle;"
                + "-webkit-appearance:checkbox !important;"
                + "-moz-appearance:checkbox;"
                + "position: static;"
                + "clip: auto;"
                + "opacity: 1;"
                + "cursor: pointer;"
            + "}" + "#rwl-iqxin.rwl-active-iqxin{"
                + "left: 0px;"
                + "transform:translate(0,0);"
                + "opacity: 0.9;"
                + "height: 32px;"
                + "line-height: 32px"
            + "}" + "#rwl-iqxin label{"
                + "margin:0;"
                + "padding:0;"
                + "font-weight:500;"
            + "}" + "#rwl-iqxin #rwl-setbtn{"
                + "margin: 0 4px 0 0;"
                + "padding: 0 0 0 4px;"
                + "border: none;"
                + "border-radius: 2px;"
                + "cursor: pointer;"
                + "background: #fff;"
                + "color: #000;"
            + "}" + " "
            
        if(!rwl_userData.addBtn){
            var styleTemp = "#rwl-iqxin{display:none}";
            style.innerHTML = styleInner + styleTemp;
        } else {
            style.innerHTML = styleInner;
        }
        if(document.querySelector("#rwl-iqxin")){
            // console.log("Insert via style");
            document.querySelector("#rwl-iqxin").appendChild(style);
        } else {
            // console.log("Insert via GM");
            GM_addStyle(styleInner);
        }
    };
 
    // Bind click event to button
    function setBtnClick(){
        document.querySelector("#rwl-setbtn").addEventListener("click",setMenu);
    }
 
    // Menu
     function setMenu(){
            var oldEditBox = document.querySelector("#rwl-setMenu");
            if(oldEditBox){
                oldEditBox.parentNode.removeChild(oldEditBox);
                return;
            }
            var userSetting = GM_getValue("rwl_userData");
            var upload_checked = userSetting.connectToTheServer?"checked":"";
            var btnchecked =  userSetting.addBtn?'checked':''
 
            var odom = document.createElement("div");
            odom.id = "rwl-setMenu";
            odom.style.cssText ="position: fixed;" +
                "top: 100px;" +
                "left: 50px;" +
                "padding: 10px;" +
                "background: #fff;" +
                "border-radius: 4px;";
            GM_addStyle("#rwl-setMenuSave," +
                "#rwl-reset," +
                "#rwl-setMenuClose{"
                    + "margin: 0;" +
                    + "padding: 0 2px;" +
                    + "border: none;" +
                    + "border-radius: 2px;" +
                    + "cursor: pointer;" +
                    + "background: #fff;" +
                    + "color: #000;"
                + "}" +
                "#rwl-reset{"
                    + "border: 1px solid #666;"
                + "}" +
                "#rwl-setMenuSave{"
                    + "border: 1px solid green;"
                + "}" +
                "#rwl-setMenuClose{"
                    + "border: 1px solid red;"
                + "}" +
                "#rwl-setMenu{"
                    + "text-align:left;" +
                    + "font-size:14px;" +
                    + "z-index:999999;" +
                    + "border: 1px solid cornflowerblue;"
                + "}" +
                "#rwl-setMenu p{"
                    + "margin:5px auto;"
                + "}" +
                " ")
            var innerH = "" +
                "<p>Distance from top (pixels) <input id='positiontop' type='text' value=" + userSetting.positionTop + "></p>" + "" +
                // "<laberl> <p>Allow uploading blacklist<input id='uploadchecked'  type='checkbox' " + upload_checked + "></p>" + "</laberl>" +
                "<p id='rwl-shortcuts' title='Shortcut'>Shortcut: " +
                    "<select id='rwl-shortcut'>" +
                        "<option value='off'" + (userSetting.shortcut == 0?"selected":"")  + ">Off</option>" +
                        "<option value='f1'" + (userSetting.shortcut == 1?"selected":"")  + "> F1 </option>" +
                        "<option value='ctrlf1'" + (userSetting.shortcut == 2?"selected":"")  + ">ctrl + F1</option>" +
                        "<option value='ctrlc'" + (userSetting.shortcut == 3?"selected":"")  + ">ctrl + C</option>" +
                    "</select>" +
                "</p> " +
                "<laberl> <p>Show button<input id='btnchecked'  type='checkbox' " + btnchecked + "> Click the script management extension to open the settings again</p>" + "</laberl>" +
                "<p>Feedback address: <a target='_blank' href='https://github.com/qxinGitHub/Remove-web-limits-'>GitHub(qxin)</a>, <a target='_blank' href='https://greasyfork.org/zh-CN/scripts/28497-remove-web-limits-modified'>GreasyFork(qxin)</a>  </P>" +
                "<p>The original author of the project is <a target='_blank' href='https://cat7373.github.io/remove-web-limits/'>cat7373</a>, <a target='_blank' href='https://github.com/Cat7373/remove-web-limits'>Project homepage</a> </P>" +
                "<p>Limited ability, not every website can be perfect</P>" +
                "<p>If you give feedback, be sure to bring the detailed URL</P>" +
                "<p>  </P>" +
                // "<p><s>Show button (to be added)</s></p>" +
                // "<p><s>Button transparency (to be added)</s></p>" +
                // "<p><s>Quick copy (to be added)</s></p>" +
                // "<p><s>Other (to be added)</s></p>" +
                "<p>The data storage method is JSON. If you modify it here, pay attention to the quotation marks and commas.</P>" +
                "<textarea wrap='off' cols='45' rows='20' style='overflow:auto;border-radius:4px;'>" + JSON.stringify(userSetting.data,false,4) + "</textarea>" + 
                "<br>" +
                "<qxinbutton id='rwl-reset'>Clear settings</qxinbutton> &nbsp;&nbsp;&nbsp;" +
                "<qxinbutton id='rwl-setMenuSave'>Save</qxinbutton> &nbsp;&nbsp;&nbsp;" +
                "<qxinbutton id='rwl-setMenuClose' onclick='this.parentNode.parentNode.removeChild(this.parentNode);' title='If it cannot be closed, please refresh the interface' >Close</qxinbutton> &nbsp;&nbsp;&nbsp;" +
                "<span style='font-size:0.7em;'>--| qxin v4.4.8 2022-12-13 |--</span>" +
                ""
            "";
            odom.innerHTML = innerH;
            document.body.appendChild(odom);
 
            document.querySelector("#rwl-setMenuSave").addEventListener("click",saveSetting);
            document.querySelector("#rwl-setMenuClose").addEventListener("click",closeMenu);
            document.querySelector("#rwl-reset").addEventListener("click",rwlReset);
 
        }
 
    // Save options
    function saveSetting(){
        var positionTop = document.querySelector("#rwl-setMenu #positiontop").value;
        // var uploadChecked = document.querySelector("#rwl-setMenu #uploadchecked").checked;
        var shortcut = document.querySelector("#rwl-setMenu #rwl-shortcut").selectedIndex;
        var addBtnChecked = document.querySelector("#rwl-setMenu #btnchecked").checked;
        var codevalue = document.querySelector("#rwl-setMenu textarea").value;
        if(codevalue){
            var userSetting = GM_getValue("rwl_userData");
 
            userSetting.addBtn = addBtnChecked;
            userSetting.data = JSON.parse(codevalue);
            userSetting.positionTop = parseInt(positionTop);
            userSetting.shortcut = parseInt(shortcut);
            // userSetting.connectToTheServer = uploadChecked;
 
            GM_setValue("rwl_userData",userSetting);
            // Refresh page
            setTimeout(function(){
                window.location.reload();
            },300);
        } else {
            alert("Input is empty");
            // this.reset();
        }
        closeMenu();
    }
    // Restore menu
    function rwlReset(){
        GM_deleteValue("rwl_userData");
        window.location.reload();
    }
 
    //Close menu
    function closeMenu(){
        var oldEditBox = document.querySelector("#rwl-setMenu");
        if(oldEditBox){
            oldEditBox.parentNode.removeChild(oldEditBox);
            return;
        }
    }
 
    // Add drag and drop event to bind
    function addDragEven(){
        setTimeout(function(){
            try {
                dragBtn()
            } catch (e) {
                console.error("dragBtn function error");
            }
        },1000)
        // dragBtn();  // Add drag event
    }
 
    // Add drag event func
    function dragBtn(){
        var rwl_node = document.querySelector("#rwl-iqxin");
        rwl_node.addEventListener("mousedown",function(event){
            rwl_node.style.transition = "null";
            var disX = event.clientX - rwl_node.offsetLeft;
            var disY = event.clientY - rwl_node.offsetTop;
 
            var move = function(event){
                rwl_node.style.left = event.clientX - disX + "px" ;
                rwl_node.style.top  = event.clientY - disY + "px" ;
            }
 
            document.addEventListener("mousemove",move);
            document.addEventListener("mouseup",function(){
                rwl_node.style.transition = "0.3s";
                document.removeEventListener("mousemove",move);
                // All comment statements in this function are useful
                    // After opening, it can be dragged to the right side of the screen, but css has not been added yet
                    // Add left and right judgment to the place where rwl-active-iqxin is added, and then add the corresponding css.
                    // Lazy 2018-04-18 21:51:32
                // var bodyWidth = document.body.clientWidth;
                var rwl_nodeWidth = rwl_node.offsetLeft + rwl_node.offsetWidth/2;
                // if(rwl_nodeWidth > bodyWidth/2){
                //     rwl_node.style.left = "auto";
                //     rwl_node.style.right = 0;
                //     rwl_userData.positionLeft = "auto";
                //     rwl_userData.positionRight = "0";
                // } else {
                    rwl_node.style.right = rwl_userData.positionRight = "auto";
                    rwl_node.style.left = rwl_userData.positionLeft =  0;
                // }
                rwl_userData.positionTop = rwl_node.offsetTop;
                GM_setValue("rwl_userData",rwl_userData);
 
            })
        })
    }
 
    // Initialization init func  This is the core
    function init() {
        // Adopt different strategies for individual websites
        rule = clear();
        // Set event list
        hook_eventNames = rule.hook_eventNames.split("|");
        // TODO Allowed to return value
        unhook_eventNames = rule.unhook_eventNames.split("|");
        eventNames = hook_eventNames.concat(unhook_eventNames);
 
        // Call the loop of the method to clear DOM0 event
        if(rule.dom0) {
            setInterval(clearLoop, 10 * 1000);
            setTimeout(clearLoop, 1500);
            window.addEventListener('load', clearLoop, true);
            clearLoop();
        }
 
        // hook addEventListener //The reason why the search jump fails
        if(rule.hook_addEventListener) {
            EventTarget.prototype.addEventListener = addEventListener;
            document.addEventListener = addEventListener;
 
            if(hasFrame){
                for(let i = 0;i<hasFrame.length;i++){
                    hasFrame[i].contentWindow.document.addEventListener = addEventListener;
                }
            }
 
        }
 
        // hook preventDefault
        if(rule.hook_preventDefault) {
            Event.prototype.preventDefault = function() {
                if(hook_eventNames.indexOf(this.type) < 0) {
                    Event_preventDefault.apply(this, arguments);
                }
            };
 
            if(hasFrame){
                for(let i = 0;i<hasFrame.length;i++){
                    hasFrame[i].contentWindow.Event.prototype.preventDefault = function() {
                        if(hook_eventNames.indexOf(this.type) < 0) {
                            Event_preventDefault.apply(this, arguments);
                        }
                    };
                }
            }
        }
 
        // Hook set returnValue
        if(rule.hook_set_returnValue) {
            Event.prototype.__defineSetter__('returnValue', function() {
                if(this.returnValue !== true && hook_eventNames.indexOf(this.type) >= 0) {
                    this.returnValue = true;
                }
            });
        }
 
        // Add CSS     // console.debug('url: ' + url, 'storageName：' + storageName, 'rule: ' + rule.name);
        if(rule.add_css) {
            GM_addStyle('html, :not([class*="rwl-exempt"]) {-webkit-user-select:text!important; -moz-user-select:text!important;} :not([class*="rwl-exempt"]) ::selection {color:#fff; background:#3390FF!important;}');
        } //else {
            //GM_addStyle('html, :not([class*="rwl-exempt"]) {-webkit-user-select:text!important; -moz-user-select:text!important;}');
        //}
    }
 
    // Hook addEventListener proc
    function addEventListener(type, func, useCapture) {
        var _addEventListener = this === document ? document_addEventListener : EventTarget_addEventListener;
        if(hook_eventNames.indexOf(type) >= 0) {
            _addEventListener.apply(this, [type, returnTrue, useCapture]);
        } else if(unhook_eventNames.indexOf(type) >= 0) {
            var funcsName = storageName + type + (useCapture ? 't' : 'f');
 
            if(this[funcsName] === undefined) {
                this[funcsName] = [];
                _addEventListener.apply(this, [type, useCapture ? unhook_t : unhook_f, useCapture]);
            }
 
            this[funcsName].push(func);
        } else {
            _addEventListener.apply(this, arguments);
        }
    }
 
    // Cleanup loop
    function clearLoop() {
        rule = clear() // For dynamically generated nodes, detect at any time
        var elements = getElements();
 
        for(var i in elements) {
          for(var j in eventNames) {
            var name = 'on' + eventNames[j];
 
            // ;?unsolved
                // 2018-04-02 A string will appear in the elements, the original version will not, the problem is unknown, the root cause has not been resolved
                // Related feedback  https://greasyfork.org/zh-CN/forum/discussion/36014
                // Problem version number  v3.0.7
                // Additional information: It was usable before, the specific version has not been tested (2018-04-02 21:27:53), the original version can be used
            if(Object.prototype.toString.call(elements[i])==="[object String]"){
                continue;
            }
 
            // console.log(elements[i])
            // if(typeof elements[i][name] === "object"){
            //     console.log(typeof elements[i][name])
            // }
            if(elements[i][name] !== null && elements[i][name] !== onxxx) {
                if(unhook_eventNames.indexOf(eventNames[j]) >= 0) {
                    elements[i][storageName + name] = elements[i][name];
                    elements[i][name] = onxxx;
              } else {
                    elements[i][name] = null;
              }
            }
          }
        }
        
        document.onmousedown = function(){return true;};
    }
 
    // Function that returns true
    function returnTrue(e) {
        return true;
    }
    function unhook_t(e) {
        return unhook(e, this, storageName + e.type + 't');
    }
    function unhook_f(e) {
        return unhook(e, this, storageName + e.type + 'f');
    }
    function unhook(e, self, funcsName) {
        var list = self[funcsName];
        for(var i in list) {
            list[i](e);
        }
 
        e.returnValue = true;
        return true;
    }
    function onxxx(e) {
        var name = storageName + 'on' + e.type;
        this[name](e);
 
        e.returnValue = true;
        return true;
    }
 
    // Get all elements including document
    function getElements() {
        var elements = Array.prototype.slice.call(document.getElementsByTagName('*'));
        elements.push(document);
 
        // Loop all frame windows
        var frames = document.querySelectorAll("frame")
        if(frames){
            hasFrame = frames;
            var frames_element;
            for (let i = 0;i<frames.length;i++){
                frames_element = Array.prototype.slice.call(frames[i].contentWindow.document.querySelectorAll("*"))
                elements.push(frames[i].contentWindow.document)
                elements = elements.concat(frames_element);
            }
        }
        return elements;
    };
 
    // Get blacklisted websites Func
    function get_black_list(){
        // Previous versions may cause empty strings to be stored
            // 2018-06-11 15:11:44 Reserved for fault tolerance
        var data_temp = rwl_userData.data;
        data_temp = data_temp.filter(function(item){
                return item.length>1;
            })
        return data_temp;
    }
    
    // Check if it exists in the blacklist and return the position func
    function check_black_list(list,host){
        for(let i=0;i<list.length;i++){
            if(~hostname.indexOf(list[i])){
                return i+1;  //In case the first one is matched, return 0
            }
        }
        return false;
    }
 
    // After clicking the button, check if it is in the blacklist
    function black_check(bool){
        var list = GM_getValue("rwl_userData").data
        var check = check_black_list(list,hostname);
 
        if (bool && !check) {
            list = list.concat(hostname);
            // console.log("Selected, not in blacklist, add",hostname,list);
            rwl_userData.waitUpload.push(hostname); //Ready to upload
            rwl_userData.currentURL = window.location.href;
            // console.log("after: ",rwl_userData.waitUpload)
 
            saveData(list);
            init();
 
        }else if(!bool && check){
            list.splice(check-1,1);
            saveData(list);
            // Refresh page
            setTimeout(function(){
                window.location.reload(true);
                console.log("Refreshing page loading");
            },350);
        }else{
            return false;
        }
    }
 
    // Save local data and upload it to the server
    function saveData(lists){
        lists = lists.filter(function(item){
            return item.length>1;
        })
 
        // Update data
        rwl_userData.data = lists.sort();
 
        // Upload local blacklist
        // if (rwl_userData.waitUpload.length > 0 && rwl_userData.connectToTheServer){
        //     // console.log("rwl : Uploading...",rwl_userData.waitUpload);
        //     // console.log("rwl : Start uploading-----");
        //     GM_xmlhttpRequest({
        //       method: "POST",
        //       // url: "http://127.0.0.1:8000/tool/testajax/",
        //       url: "http://eemm.me/tool/rwl_upload/",
        //       data: JSON.stringify(rwl_userData),
        //       headers: {
        //         "Content-Type": "application/x-www-form-urlencoded"
        //       },
        //       onload: function(response) {
        //         // console.log("rwl : Upload successful----");
        //       }
        //     });
        //     rwl_userData.waitUpload = [];
        // }
 
        GM_setValue("rwl_userData",rwl_userData);
        return rwl_userData;
    }
 
    // Array deduplication
    function unique(arr) {
      var ret = []
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i]
        if (ret.indexOf(item) === -1) {
          ret.push(item)
        }
      }
      return ret;
    }
 
    // Copy to clipboard
    function setClipboard(){
        var text_obj = window.getSelection();
        var text = text_obj.toString();
        GM_setClipboard(text);
 
    }
 
    // Shortcut F1 (ctrl+f1) copy
    function hotkey() {
        var a = window.event.keyCode;
        // if ((a == 112) && (event.ctrlKey)) {
        if (a == 112 && userSetting.shortcut == 1) {
            event.preventDefault();
            setClipboard();
            event.keyCode=0;
            event.returnValue=false;
            return false; 
        } else if (a == 112 && (event.ctrlKey) && userSetting.shortcut == 2){
            setClipboard();
        } else if((a == 67) && (event.ctrlKey) && userSetting.shortcut == 3){
            setClipboard();
        }else {
            console.log("Shortcut key is off");
        }
    } 
    document.onkeydown = hotkey; //When the onkeydown event occurs, call the hotkey function
 
    // Some websites use other anti-copying methods
    function clear(){
        // console.log("Entering clear",hostname,rwl_userData.rules);
        switch (hostname){
            case "chuangshi.qq.com": clear_chuangshi();break;
            case "votetw.com": clear_votetw();break;
            case "www.myhtebooks.com": clear_covers(".fullimg");break;
            case "www.z3z4.com": clear_covers(".moviedownaddiv"); break;
            case "huayu.baidu.com": clear_covers("#jqContextMenu"); break;
            case "www.myhtlmebook.com": clear_covers("img.fullimg"); break;
            case "www.szxx.com.cn": clear_covers("img#adCover"); break;
            case "zhihu.com":
            case "www.zhihu.com": return rwl_userData.rules.rule_zhihu; break;
            case "t.bilibili.com": clear_link_bilibili(); break;
            case "www.uslsoftware.com": clear_covers(".protect_contents-overlay");clear_covers(".protect_alert"); return rwl_userData.rules.rule_plus; break;
            case "www.longmabookcn.com": clear_covers(".fullimg"); return rwl_userData.rules.rule_plus; break;
            case "boke112.com": return rwl_userData.rules.rule_plus; break;
            case "www.shangc.net": return rwl_userData.rules.rule_plus; break;
            // Remove pop-up window
            case "www.daodoc.com": clear_marks(".marks"); break;
            case "www.wcqjyw.com": clear_marks(".marks"); break;
            case "www.jianbiaoku.com": clear_marks(".layui-layer-shade"); break;
        }
        return rwl_userData.rules.rule_def;
    }
    // Remove overlay
    function clear_covers(ele){
        var odiv = document.querySelector(ele);
        if(odiv){
            odiv.parentNode.removeChild(odiv);
        }
    }
    // Bilibili nests text in links
    function clear_link_bilibili(){
        var odiv = document.querySelector(".description");
        if(odiv){
            var tDiv = odiv.querySelector(".content-ellipsis");
            var aDiv = odiv.querySelector("a");
             odiv.appendChild(tDiv);
        }
    }
    // https://votetw.com/wiki/%E6%9E%97%E6%99%BA%E5%A0%85
    // It will create multiple divs without id and class, covering the upper layer of the text
    function clear_votetw(){
        var odivs = document.querySelectorAll(".mw-parser-output>div")
        odivs.forEach(function(value){
            value.setAttribute("style","");
        })
    }

    // Remove the pop-up window, a pop-up prompt will appear after copying, but the copy has actually been successful
    function clear_marks(node){
        GM_addStyle(`
            ${node} {
                display: none !important;
            }
        `)
    }
 
    // Chuangshi Chinese Network
    function clear_chuangshi(){
        console.log("Chuangshi Chinese Network starts execution");

        // Mutual conversion between Chinese characters and Unicode codes in JS
            // https://www.cnblogs.com/wwlhome/p/5650744.html
        function tounicode(data)
        {
            if(data == '') return 'Please enter Chinese characters';
            var str =''; 
            for(var i=0;i<data.length;i++)
            {
                str+="\u"+parseInt(data[i].charCodeAt(0),10).toString(16);
            }
            return str;
        }
        function tohanzi(data)
        {
            if(data == '') return 'Please enter hexadecimal unicode';
            data = data.split("\u");
            var str ='';
            for(var i=0;i<data.length;i++)
            {
                str+=String.fromCharCode(parseInt(data[i],16).toString(10));
            }
            return str;
        }
        // The replace function in javascript replaces multiple strings at the same time
            // https://bbs.csdn.net/topics/320097246
        Array.prototype.each = function(trans) {
                for (var i=0; i<this.length; i++)
                    this[i] = trans(this[i], i, this);
                return this;
            };
        Array.prototype.map = function(trans) {
            return [].concat(this).each(trans);
        };
        RegExp.escape = function(str) {
            return new String(str).replace(/([.*+?^=!:${}()|[\/\\])/g, '\$1');
        };
        function properties(obj) {
            var props = [];
            for (var p in obj) props.push(p);
            return props;
        }
        // ---------------------------------------------
        var bookreadercontent = document.querySelector(".bookreadercontent");
        if(bookreadercontent){
            var str = bookreadercontent.innerText;
            var strUnicode = tounicode(str);
            var replacements = {"e2af":"4e09","e2af":"4e0b","e2c9":"4e3b","e2d6":"4e48","e2b2":"4e4b","e2a6":"4e5f","e294":"4e8b","e2e9":"4e8c","e30a":"4e8e","e292":"4e94","e298":"4e9b","e2a2":"4ee3","e2f0":"4f46","e30e":"4f4d","e305":"4f53","e296":"4f5c","e2d3":"4f60","e2db":"4f7f","e29b":"516c","e2b0":"5176","e2ed":"51fa","e2eb":"5206","e2f1":"5229","e307":"5230","e2ce":"5236","e2e6":"524d","e2ea":"529b","e2a8":"52a0","e2a5":"5316","e2bd":"5341","e302":"539f","e2df":"53bb","e2c7":"53c8","e303":"53cd","e2ac":"53d1","e2f8":"53ea","e30b":"5404","e29c":"5408","e2d7":"540c","e2d8":"540e","e306":"5411","e2c5":"547d","e2b4":"56db","e2f9":"56e0","e2ca":"5730","e2ef":"5916","e2bc":"591a","e301":"5929","e29a":"597d","e2b7":"5b50","e2cc":"5b83","e2ee":"5b9a","e2ff":"5bb6","e2e8":"5c0f","e2d4":"5c31","e2d5":"5c55","e2a1":"5de5","e2a0":"5e73","e2fe":"5e74","e2c4":"5e76","e2c8":"5ea6","e2ae":"5efa","e304":"5f62","e291":"5f88","e2e2":"5f97","e2f2":"5fc3","e295":"6027","e2d9":"60c5","e2be":"60f3","e2c3":"610f","e30d":"6210","e2ba":"6216","e2fa":"6240","e29e":"628a","e2a7":"63d0","e2d2":"653f","e2ad":"6599","e2cd":"65b0","e2f3":"65b9"};
            var regex = new RegExp(properties(replacements).map(RegExp.escape).join("|"), "g");
            strUnicode = strUnicode.replace(regex, function($0) { return replacements[$0]; });
            
            // console.log(strUnicode)
            strUnicode = strUnicode.replace("u0","");
            str = tohanzi(strUnicode);
    
            bookreadercontent.innerText = str;
        }


    }
 
    // 3.x.x transition to 4.x.x version
    function version_up_3_to_4(){
        var old_version = GM_getValue("black_list");
        if(!old_version){return};
        rwl_userData.data = unique(rwl_userData.data.concat(old_version.data));
        GM_setValue("rwl_userData",rwl_userData);
 
        GM_deleteValue("black_list");
        GM_deleteValue("rwl_userdata");
    }
})(); 