function humanize(string) {
  string = string.replace(/-/g, ' ');
	string = string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	return string;
}
