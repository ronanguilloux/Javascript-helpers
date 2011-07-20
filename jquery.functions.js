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
