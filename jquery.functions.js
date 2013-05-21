// source : http://www.learningjquery.com/2007/08/clearing-form-data
$.fn.clearForm = function() {
  return this.each(function() {
    var type = this.type, tag = this.tagName.toLowerCase();
    if (tag == 'form')
      return $(':input',this).clearForm();
    if (type == 'text' || type == 'password' || tag == 'textarea')
      this.value = '';
    else if (type == 'checkbox' || type == 'radio')
      this.checked = false;
    else if (tag == 'select')
      this.selectedIndex = 0;//-1;
  });
};

// blink an element
// default is normal speed, 1 time.
function blink(obj, repeatIndex, speed){
    speed = speed || 'normal';
    repeatIndex = repeatIndex || 1;
    obj.fadeOut(speed); // slow/normal/fast
    obj.fadeIn(speed); // slow/normal/fast
    repeatIndex--;
    if(repeatIndex > 0){
        blink(obj,repeatIndex, speed);
    }
}

// ajax form submit func
// ctrl = booleen true if client-side control ok, else false;
jQuery.fn.submitForm = function (frm, ctrl)
{
    //return false;
    if (ctrl) {
        jQuery.post(jQuery(frm).attr('action'), jQuery(frm).serialize(), function(data) {
            jquery.fn.confirmationForm(); // do anything here
        });
    }
    return false;
}

// source : http://goo.gl/bJmRv
$.fn.extractObject = function() {
  var accum = {};
  function add(accum, namev, value) {
    if (namev.length == 1)
      accum[namev[0]] = value;
    else {
      if (accum[namev[0]] == null)
        accum[namev[0]] = {};
      add(accum[namev[0]], namev.slice(1), value);
    }
  };
  this.find('input, textarea, select').each(function() {

    // checkboxes' "checked" attribute handling :
    if( $(this).attr('checked') && ('checked' == $(this).attr('checked'))) {
        $(this).val(true); // on-the-fly reset value to true, see serialize();
    }

    add(accum, $(this).attr('name').split('.'), $(this).val());
  });
  return accum;
};

// Javascript array sort and unique
// source: http://stackoverflow.com/a/7076202/490589
$.fn.sortUnique = function(myData) {
return myData.sort().filter(function(el,i,a){if(i==a.indexOf(el))return 1;return 0});
}
