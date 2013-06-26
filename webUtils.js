/*
 * webUtils.js
 * Copyright (C) 2013 ronan <ronan@vostro1310>
 *
 * Distributed under terms of the MIT license.
 */
 
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function generateSerial(len) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var randomstring = "";
    for (var x=0;x<len;x++) {
        var letterOrNumber = Math.floor(Math.random() * 2);
        if (letterOrNumber == 0) {
            var newNum = Math.floor(Math.random() * 9);
            randomstring += newNum;
        } else {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum,rnum+1);
        }
    }
    return randomstring;
}

function getBrowserLangCode() {
    var lct='';
    if (navigator.language) { lct=navigator.language.toLowerCase().substring(0, 2); }
    else if (navigator.userLanguage) { lct=navigator.userLanguage.toLowerCase().substring(0, 2); }
    else if (navigator.userAgent.indexOf("[")!=-1) {
        var debut=navigator.userAgent.indexOf("[");    var fin=navigator.userAgent.indexOf("]");
        lct=navigator.userAgent.substring(debut+1, fin).toLowerCase();
    }
    return lct;
}

function deleteCookie( name, path, domain ) {
    document.cookie = name + "=" +( ( path ) ? ";path=" + path : "") +( ( domain ) ? ";domain=" + domain : "" ) +";expires=Thu, 01-Jan-1970 00:00:01 GMT";
}

function getElementsByClassName(classname, tag, node)  {
    if(!tag) tag = '*';
    if(!node) node = document;
    var a = [];   var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName(tag);
    for(var i=0,j=els.length; i<j; i++) {  if(re.test(els[i].className)) { a.push(els[i]); } }
    return a;
}

function getArrayMinValue(arr, sortColumn) {
var Min = parseInt(arr[0][sortColumn]);
if (isNaN(Min*1)) return '';
for (var i=0; i<arr.length; i++) {
if (parseInt(arr[i][sortColumn])*1<Min) Min = parseInt(arr[i][sortColumn]);
    }
    return Min;
}

function getArrayMaxValue(arr, sortColumn) {
var Max = parseInt(arr[0][sortColumn]);
if (isNaN(Max*1)) return '';
for (var i=0; i<arr.length; i++) {
if (parseInt(arr[i][sortColumn])*1>Max) Max = parseInt(arr[i][sortColumn]);
    }
    return Max;
}

function array_search(arr,val) {
    for(var j=0; j<arr.length; j++){
        if(arr[j]==val) return j;
    }
    return false;
}

function isSvgSupport() {   return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.0"); }

function getParamValue(param,url) {
    var u = url == undefined ? document.location.href : url;
    var reg = new RegExp('(\\?|&|^)'+param+'=(.*?)(&|$)');
    matches = u.match(reg);
    return matches[2] != undefined ? decodeURIComponent(matches[2]).replace(/\+/g,' ') : '';
}

function AddAnshor(elem) { elem.href += window.location.hash;}
function goToByScroll(id){ $jq("html,body").animate({scrollTop: $jq("#"+id).offset().top},"slow"); }


function randomToN(maxVal,floatVal) {
    var randVal = Math.random()*maxVal;
    return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
}
