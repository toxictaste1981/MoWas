(function(jsonString) {
	var defaults = {"identifier":"","sender":"","sent":"","status":"","msgType":"","source":"","scope":"","code":["",""],"incidents":"","references":"","info":[{"language":"","category":[""],"event":"","responseType":[""],"urgency":"","severity":"","certainty":"","eventCode":[{"valueName":"","value":""}],"effective":"","onset":"","expires":"","senderName":"","headline":"","description":"","instruction":"","web":"","contact":"","parameter":[{"valueName":"","value":""},{"valueName":"","value":""}],"area":[{"areaDesc":"","polygon":[""],"geocode":[{"valueName":"","value":""}],"altitude":"","ceiling":""}]}]};
	var NULL = {"identifier":"","sender":"","sent":"NULL","status":"","msgType":"","source":"","scope":"","code":"","incidents":"","references":"","info":[{"language":"","category":"","event":"","responseType":"","urgency":"","severity":"","certainty":"","eventCode":[{"valueName":"","value":""}],"effective":"","onset":"","expires":"","senderName":"","headline":"","description":"","instruction":"","web":"","contact":"","parameter":[{"valueName":"","value":""},{"valueName":"","value":""}],"area":[{"areaDesc":"","polygon":[""],"geocode":[{"valueName":"","value":""}],"altitude":"","ceiling":""}]}]};
	var realMerge = function (defaults, msg) {
	for (n in msg) {
		if (typeof defaults[n] != 'object') {
			defaults[n] = msg[n];
		} else if (typeof msg[n] == 'object') {
			defaults[n] = realMerge(defaults[n], msg[n]);
		}
	}
	return defaults;
};

	function inside(point, vs) {
		var x = point[0], y = point[1];

		var inside = false;
		for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
			var xi = vs[i][0], yi = vs[i][1];
			var xj = vs[j][0], yj = vs[j][1];
			var intersect = ((yi > y) != (yj > y))
				&& (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
			if (intersect) inside = !inside;
		}
		return inside;
	};

	jsonString = jsonString.replace(/[<]br[^>]*[>]/gi," ");
	jsonString = jsonString.replace(/\r?\n|\r/g," ");
	var newJSON = JSON.parse(jsonString);
	var position = newJSON[1].reverse();
	var jsonResult = JSON.stringify(NULL);
	var polygon=[];
	newJSON=newJSON[0];
	for (var i = 0; i < newJSON.length; i++) {
		for (var e = 0; e < (newJSON[i]['info'][0]['area']).length; e++) {
			polygon=newJSON[i]['info'][0]['area'][e]['polygon'];
			var lonlat=[];
			for (var u = 0; u < polygon.length; u++) {
				polygon[u]=polygon[u].split(', ').join(',');
				lonlat=polygon[u].split(' ');
				var latlon=[];
				for (var o = 0; o < lonlat.length; o++) {
					latlon[o]=(lonlat[o].split(',')).map(Number);
				}
				if (inside(position,latlon)){
					newJSON[i] = realMerge(defaults,newJSON[i]);
					if (Array.isArray(newJSON[i]['info'][0]['area'][e]['polygon']) == true){newJSON[i]['info'][0]['area'][0]['polygon']=((newJSON[i]['info'][0]['area'][e]['polygon'])).join('|')}
					if ((newJSON[i]['info'][0]['headline']).indexOf('Entwarnung:')!== -1){newJSON[i]['msgType'] = 'Cancel';}
					if (Array.isArray(newJSON[i]['code']) == true){newJSON[i]['code']=((newJSON[i]['code'])).join(', ')}
					if (Array.isArray(newJSON[i]['info'][0]['category']) == true){newJSON[i]['info'][0]['category']=((newJSON[i]['info'][0]['category'])).join(', ')}
					if (Array.isArray(newJSON[i]['info'][0]['responseType']) == true){newJSON[i]['info'][0]['responseType']=((newJSON[i]['info'][0]['responseType']).join(', '))}
					jsonResult = JSON.stringify(newJSON[i]);
				} 
			}
		}
	}
return jsonResult;
})(input)

