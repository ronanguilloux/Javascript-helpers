/*
 * Array.js
 * Copyright (C) 2013 ronan <ronan@studio1555>
 *
 * Distributed under terms of the MIT license.
 */

/* a sort of bubble sort
 */
var bubbleSort = function (arr, objetKey) {
    return arr.sort(function(a,b){
        if(a[key]<b[key]) return -1;
        if(a[key]>b[key]) return 1;
        return 0;
    });
}


var in_array = function(needle, haystack) {
    for(var i in haystack) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

/*
 * Array Diff
 *
 * @author Kevin van Zonneveld (http://kevin.vanzonneveld.net)
 * @author Sanjoy Roy
 * @author Brett Zamir (http://brett-zamir.me)
 * @example : array_diff(['Kevin', 'van', 'Zonneveld'], ['van', 'Zonneveld']); // would returns 1: {0:'Kevin'}
 */

  var array_diff = function(arr1) {
      var retArr = {},
      argl = arguments.length,
      k1 = '',
      i = 1,
      k = '',
      arr = {};

      arr1keys: for (k1 in arr1) {
          for (i = 1; i < argl; i++) {
              arr = arguments[i];
              for (k in arr) {
                  if (arr[k] === arr1[k1]) {
                      // If it reaches here, it was found in at least one array, so try next value
                      continue arr1keys;
                  }
              }
              retArr[k1] = arr1[k1];
          }
      }

      return retArr;
  }


