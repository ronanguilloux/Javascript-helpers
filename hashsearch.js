// source : http://goo.gl/nerZM
/*

   Using it:

   Check if a "hash key" is present:

   HashSearch.keyExists("thekey");
   Get the value for a hash key:

   HashSearch.get('thekey');
   Set the value for a hash key, and update the URL hash:

   HashSearch.set('thekey', 'hey');
   Reload the hash into the local object:

   HashSearch.load();
   Push the current key value set to the URL hash:

   HashSearch.push();

   Note that when a key does not exist and you try to get it,
   it will returned undefined. However, a key could exist with no value
   -- for example #key=val&novalue where novalue is a key with no value.
   If you do HashSearch.get("novalue") it would also return undefined.
   In which case, you should use HashSearch.keyExists("novalue") to verify that it is indeed a key.

 */
var HashSearch = new function () {
    var params;

    this.set = function (key, value) {
        params[key] = value;
        this.push();
    };

    this.get = function (key, value) {
        return params[key];
    };

    this.keyExists = function (key) {
        return params.hasOwnProperty(key);
    };

    this.push= function () {
        var hashBuilder = [], key, value;

        for(key in params) if (params.hasOwnProperty(key)) {
            key = escape(key), value = escape(params[key]); // escape(undefined) == "undefined"
            hashBuilder.push(key + ( (value !== "undefined") ? '=' + value : "" ));
        }

        window.location.hash = hashBuilder.join("&");
    };

    (this.load = function () {
        params = {}
        var hashStr = window.location.hash, hashArray, keyVal
        hashStr = hashStr.substring(1, hashStr.length);
    hashArray = hashStr.split('&');

    for(var i = 0; i < hashArray.length; i++) {
        keyVal = hashArray[i].split('=');
        params[unescape(keyVal[0])] = (typeof keyVal[1] != "undefined") ? unescape(keyVal[1]) : keyVal[1];
    }
    })();
}
