// Define a new instance of the FES
var dfes

function saveDOMImage(el,opt){
	if(!opt) opt = {};
	if(!opt.src) opt.src = "map.png";
	if(opt.scale){
		if(!opt.height) opt.height = el.offsetHeight*2;
		if(!opt.width) opt.width = el.offsetWidth*2;
		// Force bigger size for element
		w = el.style.getPropertyValue('width');
		h = el.style.getPropertyValue('height');
		el.style.setProperty('width',(opt.width)+'px');
		el.style.setProperty('height',(opt.height)+'px');
	}
	el.classList.add('capture');
	domtoimage.toPng(el,opt).then(function(dataUrl){
		var link = document.createElement('a');
		link.download = opt.src;
		link.href = dataUrl;
		link.click();
		// Reset element
		if(opt.scale){
			el.style.setProperty('width',w);
			el.style.setProperty('height',h);
		}
		el.classList.remove('capture');
	});
}

S(document).ready(function(){

	dfes = new FES({
		"options": {
			"scenario": "Falling Short",
			"view": "LAD",
			"key": (new Date()).getFullYear()+"",
			"parameter": "bev",
			"scale": "relative",
			"years": {"min":2022,"max":2050},
			"map": {
				"bounds": [[50.7,-1.55],[53,2]],
				"attribution": "Vis: <a href=\"https://open-innovations.org/projects/\">Open Innovations</a>, Data: UK Power Networks",
				"quantised": 5
			}
		},
		"mapping": {
			"lsoa": {
				"LSOAlayer": {},
				"MSOAlayer": {
					"file": "data/lsoa2msoa.json"
				},
				"LADlayer": {
					"file": "data/lsoa2lad-compact.json",
					"process": function(d){
						// Work out mapping from LSOA to LAD
						// Data is saved as { LAD: [LSOA1,LSOA2,LSOA3...] }
						var a,data,i;
						data = {};
						for(a in d){
							for(i = 0; i < d[a].length; i++){
								data[d[a][i]] = {};
								data[d[a][i]][a] = 1;
							}
						}
						return data;
					}
				},
				"LEPlayer": {
					"file": "data/lsoa2lep-compact.json",
					"process": function(d){
						// Work out mapping from LSOA to LAD
						// Data is saved as { LEP: [LSOA1,LSOA2,LSOA3...] }
						var a,data,i;
						data = {};
						for(a in d){
							for(i = 0; i < d[a].length; i++){
								data[d[a][i]] = {};
								data[d[a][i]][a] = 1;
							}
						}
						return data;
					}
				},
				"Countylayer":{
					"file": "data/lsoa2cty.json",
					"process": function(d){
						// Work out mapping from LSOA to County
						// Data is saved as { CTY: [LSOA1,LSOA2,LSOA3...] }
						var a,data,i;
						data = {};
						for(a in d){
							for(i = 0; i < d[a].length; i++){
								data[d[a][i]] = {};
								data[d[a][i]][a] = 1;
							}
						}
						return data;
					}
				},
				"DNOlayer":{
					"file": "data/lsoa2dno.json",
					"process": function(d){
						// Work out mapping from LSOA to DNO
						// Data is saved as { DNO: [LSOA1,LSOA2,LSOA3...] }
						var a,data,i;
						data = {};
						for(a in d){
							for(i = 0; i < d[a].length; i++){
								data[d[a][i]] = {};
								data[d[a][i]][a] = 1;
							}
						}
						return data;
					}
				}
			},
			"msoa": {
				"LSOAlayer": {
					"file": "data/msoa2lsoa.json"			
				},
				"MSOAlayer": {},
				"LADlayer": {
					"file": "data/msoa2lad-compact.json",
					"process": function(d){
						// Work out mapping from MSOA to LAD
						// Data is saved as { LAD: [MSOA1,MSOA2,MSOA3...] }
						var a,data,i;
						data = {};
						for(a in d){
							for(i = 0; i < d[a].length; i++){
								data[d[a][i]] = {};
								data[d[a][i]][a] = 1;
							}
						}
						return data;
					}
				},
				"LEPlayer": {
					"file": "data/msoa2lep.json",
					"process": function(d){
						// Work out mapping from MSOA to LAD
						// Data is saved as { LEP: [MSOA1,MSOA2,MSOA3...] }
						var a,data,i;
						data = {};
						for(a in d){
							for(i = 0; i < d[a].length; i++){
								data[d[a][i]] = {};
								data[d[a][i]][a] = 1;
							}
						}
						return data;
					}
				},
				"Countylayer":{
					"file": "data/msoa2cty.json",
					"process": function(d){
						// Work out mapping from MSOA to County
						// Data is saved as { CTY: [MSOA1,MSOA2,MSOA3...] }
						var a,data,i;
						data = {};
						for(a in d){
							for(i = 0; i < d[a].length; i++){
								data[d[a][i]] = {};
								data[d[a][i]][a] = 1;
							}
						}
						return data;
					}
				},
				"DNOlayer":{
					"file": "data/msoa2dno.json",
					"process": function(d){
						// Work out mapping from MSOA to DNO
						// Data is saved as { DNO: [MSOA1,MSOA2,MSOA3...] }
						var a,data,i;
						data = {};
						for(a in d){
							for(i = 0; i < d[a].length; i++){
								data[d[a][i]] = {};
								data[d[a][i]][a] = 1;
							}
						}
						return data;
					}
				}
			}
		},
		"layers": {
			"LSOAlayer":{
				"geojson": "data/maps/LSOA2021-super-generalised-clipped.geojson",
				"key": "LSOA21CD",
				"name": "LSOA21NM"
			},
			"MSOAlayer":{
				"geojson": "data/maps/MSOA2021-super-generalised-clipped.geojson",
				"key": "MSOA21CD",
				"name": "MSOA21NM"
			},
			"LADlayer":{
				"geojson": "data/maps/LAD2022-super-generalised-clipped.geojson",
				"key": "LAD22CD",
				"name": "LAD22NM"
			},
			"LEPlayer":{
				"geojson": "data/maps/LEP2020-clipped-fullextent-simplified.geojson",
				"key": "lep20cd",
				"name": "lep20nm"
			},
			"Countylayer":{
				"geojson": "data/maps/Counties-clipped-simplified.geojson",
				"key": "cty19cd",
				"name": "cty19cd"
			},
			"DNOlayer":{
				"geojson": "data/maps/DNO-clipped-simplified.geojson",
				"key": "dnola22cd",
				"name": "LongName"
			}
		},
		"views":{
			"DNO":{
				"title":"DNO licence areas",
				"source": "lsoa",
				"layers":[{
					"id": "DNOlayer",
					"heatmap": true,
					"boundary":{"strokeWidth":2}
				}],
				"popup": {
					"text": function(attr){
						file = 'DNO-licence-areas-'+attr.properties.dnola22cd+'-'+this.options.scenario.replace(/ /,"").toLowerCase()+'-'+this.options.parameter+'.png';
						return '<h3>'+(attr.properties.LongName || '?')+'</h3><p>'+attr.parameter.title+': '+(typeof attr.value==="number" ? attr.value.toLocaleString() : '?')+attr.parameter.units+' ('+this.options.key+')</p><div id="barchart">barchart</div><p class="footnote capture-hide"><a href="#" onClick="saveDOMImage(document.querySelector(\'.dfes-popup-content\'),{\'src\':\''+file+'\',\'scale\':true});">Save chart as PNG</a></p>';
					},
					"open": function(attr){
						var data,c,p,key,values,l;
						if(!attr) attr = {};
						
						l = this.views[this.options.view].layers[0].id;
						key = this.layers[l].key;

						if(attr.id && key){

							data = [];							
							values = this.data.scenarios[this.options.scenario].data[this.options.parameter].layers[this.options.view].values;

							for(c in values[attr.id]){
								if(c >= this.options.years.min && c <= this.options.years.max){
									data.push([c,values[attr.id][c]]);
								}
							}

							// Create the barchart object. We'll add a function to
							// customise the class of the bar depending on the key.
							var chart = new S.barchart('#barchart',{
								'formatKey': function(key){
									return (key%10==0 ? key.substr(0,4) : '');
								},
								'formatY': function(key){
									return key.toLocaleString();
								},
								'formatBar': function(key,val,series){
									return (typeof series==="number" ? "series-"+series : "");
								}
							});

							// Send the data array and bin size then draw the chart
							chart.setData(data).setBins({ 'mintick': 5 }).draw();
							units = this.parameters[this.options.parameter].units;
							dp = this.parameters[this.options.parameter].dp;

							// Add an event
							chart.on('barover',function(e){
								S('.balloon').remove();
								var v = parseFloat(this.bins[e.bin].value.toFixed(dp));
								S(e.event.currentTarget).find('.bar.series-0').append(
									"<div class=\"balloon\">"+this.bins[e.bin].key+": "+v.toLocaleString()+(units ? '&thinsp;'+units : '')+"</div>"
								);
							});
							S('.barchart table .bar').css({'background-color':'#cccccc'});
							S('.barchart table .bar.series-0').css({'background-color':this.data.scenarios[this.options.scenario].color});
							
						}else{
							S(attr.el).find('#barchart').remove();
						}
					}
				}
				
			},
			"LEP":{
				"title":"Local Enterprise Partnerships",
				"source": "lsoa",
				"layers":[{
					"id": "LEPlayer",
					"heatmap": true,
					"boundary":{"strokeWidth":2}
				}],
				"popup": {
					"text": function(attr){
						file = 'LEP-'+attr.properties.lep20cd+'-'+this.options.scenario.replace(/ /,"").toLowerCase()+'-'+this.options.parameter+'.png';
						return '<h3>'+(attr.properties.lep20nm || '?')+'</h3><p>'+attr.parameter.title+': '+(typeof attr.value==="number" ? attr.value.toLocaleString() : '?')+attr.parameter.units+' ('+this.options.key+')</p><div id="barchart">barchart</div><p class="footnote">The LEP has been clipped to UKPN\'s area.</p><p class="footnote capture-hide"><a href="#" onClick="saveDOMImage(document.querySelector(\'.dfes-popup-content\'),{\'src\':\''+file+'\',\'scale\':true});">Save chart as PNG</a></p>';
					},
					"open": function(attr){
						var data,c,p,key,values,l;
						if(!attr) attr = {};
						
						l = this.views[this.options.view].layers[0].id;
						key = this.layers[l].key;

						if(attr.id && key){

							data = [];							
							values = this.data.scenarios[this.options.scenario].data[this.options.parameter].layers[this.options.view].values;

							for(c in values[attr.id]){
								if(c >= this.options.years.min && c <= this.options.years.max){
									data.push([c,values[attr.id][c]]);
								}
							}

							// Create the barchart object. We'll add a function to
							// customise the class of the bar depending on the key.
							var chart = new S.barchart('#barchart',{
								'formatKey': function(key){
									return (key%10==0 ? key.substr(0,4) : '');
								},
								'formatY': function(key){
									return key.toLocaleString();
								},
								'formatBar': function(key,val,series){
									return (typeof series==="number" ? "series-"+series : "");
								}
							});

							// Send the data array and bin size then draw the chart
							chart.setData(data).setBins({ 'mintick': 5 }).draw();
							units = this.parameters[this.options.parameter].units;
							dp = this.parameters[this.options.parameter].dp;

							// Add an event
							chart.on('barover',function(e){
								S('.balloon').remove();
								var v = parseFloat(this.bins[e.bin].value.toFixed(dp));
								S(e.event.currentTarget).find('.bar.series-0').append(
									"<div class=\"balloon\">"+this.bins[e.bin].key+": "+v.toLocaleString()+(units ? '&thinsp;'+units : '')+"</div>"
								);
							});
							S('.barchart table .bar').css({'background-color':'#cccccc'});
							S('.barchart table .bar.series-0').css({'background-color':this.data.scenarios[this.options.scenario].color});
							
						}else{
							S(attr.el).find('#barchart').remove();
						}
					}
				}
				
			},
			"County":{
				"title":"Counties and Unitary Authorities",
				"source": "lsoa",
				"layers":[{
					"id": "Countylayer",
					"heatmap": true,
					"boundary":{"strokeWidth":2}
				}],
				"popup": {
					"text": function(attr){
						file = 'County-'+attr.properties.cty19cd+'-'+this.options.scenario.replace(/ /,"").toLowerCase()+'-'+this.options.parameter+'.png';
						return '<h3>'+(attr.properties.cty19nm || '?')+'</h3><p>'+attr.parameter.title+': '+attr.value.toLocaleString()+attr.parameter.units+' ('+this.options.key+')</p><div id="barchart">barchart</div><p class="footnote">The area has been clipped to UKPN\'s area</p><p class="footnote capture-hide"><a href="#" onClick="saveDOMImage(document.querySelector(\'.dfes-popup-content\'),{\'src\':\''+file+'\',\'scale\':true});">Save chart as PNG</a></p>';
					},
					"open": function(attr){
						var data,c,p,key,values,l;
						if(!attr) attr = {};
						
						l = this.views[this.options.view].layers[0].id;
						key = this.layers[l].key;

						if(attr.id && key){

							data = [];							
							values = this.data.scenarios[this.options.scenario].data[this.options.parameter].layers[this.options.view].values;

							for(c in values[attr.id]){
								if(c >= this.options.years.min && c <= this.options.years.max){
									data.push([c,values[attr.id][c]]);
								}
							}

							// Create the barchart object. We'll add a function to
							// customise the class of the bar depending on the key.
							var chart = new S.barchart('#barchart',{
								'formatKey': function(key){
									return (key%10==0 ? key.substr(0,4) : '');
								},
								'formatY': function(key){
									return key.toLocaleString();
								},
								'formatBar': function(key,val,series){
									return (typeof series==="number" ? "series-"+series : "");
								}
							});

							// Send the data array and bin size then draw the chart
							chart.setData(data).setBins({ 'mintick': 5 }).draw();
							units = this.parameters[this.options.parameter].units;
							dp = this.parameters[this.options.parameter].dp;

							// Add an event
							chart.on('barover',function(e){
								S('.balloon').remove();
								var v = parseFloat(this.bins[e.bin].value.toFixed(dp));
								S(e.event.currentTarget).find('.bar.series-0').append(
									"<div class=\"balloon\">"+this.bins[e.bin].key+": "+v.toLocaleString()+(units ? '&thinsp;'+units : '')+"</div>"
								);
							});
							S('.barchart table .bar').css({'background-color':'#cccccc'});
							S('.barchart table .bar.series-0').css({'background-color':this.data.scenarios[this.options.scenario].color});
						}else{
							S(attr.el).find('#barchart').remove();
						}
					}
				}	
			},
			"LAD":{
				"title":"Local Authorities",
				"source": "lsoa",
				"layers":[{
					"id": "LADlayer",
					"heatmap": true,
					"boundary":{"strokeWidth":2}
				}],
				"popup": {
					"text": function(attr){
						file = 'LAD-'+attr.properties.LAD22CD+'-'+this.options.scenario.replace(/ /,"").toLowerCase()+'-'+this.options.parameter+'.png';
						return '<h3>'+(attr.properties.LAD22NM || '?')+'</h3><p>'+attr.parameter.title+': '+attr.value.toLocaleString()+attr.parameter.units+' ('+this.options.key+')</p><div id="barchart">barchart</div><p class="footnote">The local authority may have been clipped to UKPN\'s area</p><p class="footnote capture-hide"><a href="#" onClick="saveDOMImage(document.querySelector(\'.dfes-popup-content\'),{\'src\':\''+file+'\',\'scale\':true});">Save chart as PNG</a></p>';
					},
					"open": function(attr){

						var data,c,p,key,values,l;
						if(!attr) attr = {};
						
						l = 'LADlayer';
						key = this.layers[l].key;

						if(attr.id && key){

							data = [];
							
							values = this.data.scenarios[this.options.scenario].data[this.options.parameter].layers[this.options.view].values;

							for(c in values[attr.id]){
								if(c >= this.options.years.min && c <= this.options.years.max){
									data.push([c,values[attr.id][c]]);
								}
							}

							// Create the barchart object. We'll add a function to
							// customise the class of the bar depending on the key.
							var chart = new S.barchart('#barchart',{
								'formatKey': function(key){
									return (key%10==0 ? key.substr(0,4) : '');
								},
								'formatY': function(key){
									return key.toLocaleString();
								},
								'formatBar': function(key,val,series){
									return (typeof series==="number" ? "series-"+series : "");
								}
							});

							// Send the data array and bin size then draw the chart
							chart.setData(data).setBins({ 'mintick': 5 }).draw();
							units = this.parameters[this.options.parameter].units;
							dp = this.parameters[this.options.parameter].dp;

							// Add an event
							chart.on('barover',function(e){
								S('.balloon').remove();
								var v = parseFloat(this.bins[e.bin].value.toFixed(dp));
								S(e.event.currentTarget).find('.bar.series-0').append(
									"<div class=\"balloon\">"+this.bins[e.bin].key+": "+v.toLocaleString()+(units ? '&thinsp;'+units : '')+"</div>"
								);
							});
							S('.barchart table .bar').css({'background-color':'#cccccc'});
							S('.barchart table .bar.series-0').css({'background-color':this.data.scenarios[this.options.scenario].color});
						}else{
							S(attr.el).find('#barchart').remove();
						}
					}
				}
				
			},
			"MSOA":{
				"title":"MSOAs",
				"source": "msoa",
				"layers":[{
					"id":"LADlayer",
					"heatmap": false,
					"boundary":{"color":"#444444","strokeWidth":1,"opacity":0.5,"fillOpacity":0}
				},{
					"id": "MSOAlayer",
					"heatmap": true,
					"boundary":{"stroke":false}
				}],
				"popup": {
					"text": function(attr){
						file = 'MSOA-'+attr.properties.MSOA21CD+'-'+this.options.scenario.replace(/ /,"").toLowerCase()+'-'+this.options.parameter+'.png';
						return '<h3>'+(attr.properties.MSOA21NM || '?')+'</h3><p>'+attr.parameter.title+': '+(attr.value||0).toLocaleString()+attr.parameter.units+' ('+this.options.key+')</p><div id="barchart">barchart</div><p class="footnote">The MSOAs may have been clipped to UKPN\'s area</p><p class="footnote capture-hide"><a href="#" onClick="saveDOMImage(document.querySelector(\'.dfes-popup-content\'),{\'src\':\''+file+'\',\'scale\':true});">Save chart as PNG</a></p>';
					},
					"open": function(attr){

						var data,c,p,key,values,l;
						if(!attr) attr = {};
						
						l = 'MSOAlayer';
						key = this.layers[l].key;

						if(attr.id && key){

							data = [];

							values = this.data.scenarios[this.options.scenario].data[this.options.parameter].layers[this.options.view].values;

							for(c in values[attr.id]){
								if(c >= this.options.years.min && c <= this.options.years.max){
									data.push([c,values[attr.id][c]]);
								}
							}

							// Create the barchart object. We'll add a function to
							// customise the class of the bar depending on the key.
							var chart = new S.barchart('#barchart',{
								'formatKey': function(key){
									return (key%10==0 ? key.substr(0,4) : '');
								},
								'formatY': function(key){
									return key.toLocaleString();
								},
								'formatBar': function(key,val,series){
									return (typeof series==="number" ? "series-"+series : "");
								}
							});

							// Send the data array and bin size then draw the chart
							chart.setData(data).setBins({ 'mintick': 5 }).draw();
							units = this.parameters[this.options.parameter].units;
							dp = this.parameters[this.options.parameter].dp;

							// Add an event
							chart.on('barover',function(e){
								S('.balloon').remove();
								var v = parseFloat(this.bins[e.bin].value.toFixed(dp));
								S(e.event.currentTarget).find('.bar.series-0').append(
									"<div class=\"balloon\">"+this.bins[e.bin].key+": "+v.toLocaleString()+(units ? '&thinsp;'+units : '')+"</div>"
								);
							});
							S('.barchart table .bar').css({'background-color':'#cccccc'});
							S('.barchart table .bar.series-0').css({'background-color':this.data.scenarios[this.options.scenario].color});
						}else{
							S(attr.el).find('#barchart').remove();
						}
					}
				}
			},
			"LSOA":{
				"title":"LSOAs",
				"source": "lsoa",
				"layers":[{
					"id":"LADlayer",
					"heatmap": false,
					"boundary":{"color":"#444444","strokeWidth":1,"opacity":0.5,"fillOpacity":0}
				},{
					"id": "LSOAlayer",
					"heatmap": true,
					"boundary":{"stroke":false}
				}],
				"popup": {
					"text": function(attr){
						file = 'LSOA-'+attr.properties.LSOA21CD+'-'+this.options.scenario.replace(/ /,"").toLowerCase()+'-'+this.options.parameter+'.png';
						console.log(this.data.scenarios[this.options.scenario].data[this.options.parameter]);
						return '<h3>'+(attr.properties.LSOA21NM || '?')+'</h3><p>'+attr.parameter.title+': '+(attr.value||0).toLocaleString()+attr.parameter.units+' ('+this.options.key+')</p><div id="barchart">barchart</div><p class="footnote">'+(this.data.scenarios[this.options.scenario].data[this.options.parameter].dataBy=="msoa" ? 'The values for this parameter are provided at MSOA level so have been equally split between the LSOAs for this view.' : '')+'</p><p class="footnote capture-hide"><a href="#" onClick="saveDOMImage(document.querySelector(\'.dfes-popup-content\'),{\'src\':\''+file+'\',\'scale\':true});">Save chart as PNG</a></p>';
					},
					"open": function(attr){

						var data,c,p,key,values,l;
						if(!attr) attr = {};
						
						l = 'LSOAlayer';
						key = this.layers[l].key;

						if(attr.id && key){

							data = [];

							values = this.data.scenarios[this.options.scenario].data[this.options.parameter].layers[this.options.view].values;

							for(c in values[attr.id]){
								if(c >= this.options.years.min && c <= this.options.years.max){
									data.push([c,values[attr.id][c]]);
								}
							}

							// Create the barchart object. We'll add a function to
							// customise the class of the bar depending on the key.
							var chart = new S.barchart('#barchart',{
								'formatKey': function(key){
									return (key%10==0 ? key.substr(0,4) : '');
								},
								'formatY': function(key){
									return key.toLocaleString();
								},
								'formatBar': function(key,val,series){
									return (typeof series==="number" ? "series-"+series : "");
								}
							});

							// Send the data array and bin size then draw the chart
							chart.setData(data).setBins({ 'mintick': 5 }).draw();
							units = this.parameters[this.options.parameter].units;
							dp = this.parameters[this.options.parameter].dp;

							// Add an event
							chart.on('barover',function(e){
								S('.balloon').remove();
								var v = parseFloat(this.bins[e.bin].value.toFixed(dp));
								S(e.event.currentTarget).find('.bar.series-0').append(
									"<div class=\"balloon\">"+this.bins[e.bin].key+": "+v.toLocaleString()+(units ? '&thinsp;'+units : '')+"</div>"
								);
							});
							S('.barchart table .bar').css({'background-color':'#cccccc'});
							S('.barchart table .bar.series-0').css({'background-color':this.data.scenarios[this.options.scenario].color});
						}else{
							S(attr.el).find('#barchart').remove();
						}
					}
				}
				
			}
			
		},
		"on": {
			"buildMap": function(){
				var el,div,_obj;
				el = document.querySelector('.leaflet-top.leaflet-left');
				if(el){
					// Does the place search exist?
					if(!el.querySelector('.placesearch')){
						div = document.createElement('div');
						div.classList.add('leaflet-control');
						div.classList.add('leaflet-bar');
						div.innerHTML = '<div class="placesearch"><div class="submit" href="#" title="Search" role="button" aria-label="Search"></div><form class="placeform layersearch pop-left" action="search" method="GET" autocomplete="off"><input class="place" id="search" name="place" value="" placeholder="Search for a named area" type="text" /><div class="searchresults" id="searchresults"></div></div></form>';
						el.appendChild(div);
						
						function toggleActive(state){
							e = el.querySelector('.placesearch');
							if(typeof state!=="boolean") state = !e.classList.contains('typing');
							if(state){
								e.classList.add('typing');
								e.querySelector('input.place').focus();
							}else{
								e.classList.remove('typing');
							}
						}
					
						div.querySelector('.submit').addEventListener('click', function(e){ toggleActive(); });

						_obj = this;
						
						// Stop map dragging on the element
						el.addEventListener('mousedown', function(){ _obj.map.dragging.disable(); });
						el.addEventListener('mouseup', function(){ _obj.map.dragging.enable(); });

						// Define a function for scoring how well a string matches
						function getScore(str1,str2,v1,v2,v3){
							var r = 0;
							str1 = str1.toUpperCase();
							str2 = str2.toUpperCase();
							if(str1.indexOf(str2)==0) r += (v1||3);
							if(str1.indexOf(str2)>0) r += (v2||1);
							if(str1==str2) r += (v3||4);
							return r;
						}
						this.search = TypeAhead.init('#search',{
							'items': [],
							'render': function(d){
								// Construct the label shown in the drop down list
								return d.name+(d.layer=="LSOAlayer" ? ' ('+d.id+')' : '');
							},
							'rank': function(d,str){
								// Calculate the weight to add to this airport
								var r = 0;
								if(postcodes[postcode] && postcodes[postcode].data){
									_obj.log(d,d.id,postcodes[postcode].data.attributes.lep1);
									for(var cd in postcodes[postcode].data.attributes){
										if(postcodes[postcode].data.attributes[cd]==d.id){
											r += 1;
										}
									}
								}
								if(d['name']) r += getScore(d['name'],str);
								if(d['id']) r += getScore(d['name'],str);
								return r;
							},
							'process': function(d){
								// Format the result
								var l,ly,key,i;
								l = d['layer'];
								ly = _obj.layers[l].layer;
								key = _obj.layers[l].key;
								for(i in ly._layers){
									if(ly._layers[i].feature.properties[key]==d['id']){

										// Zoom to feature
										_obj.map.fitBounds(ly._layers[i]._bounds,{'padding':[5,5]});

										// Open the popup for this feature
										ly.getLayer(i).openPopup();
										
										// Change active state
										toggleActive(false);
									}
								}
							}
						});
						var postcode = "";
						var postcodes = {};
						var regex = new RegExp(/^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([AZa-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))[0-9][A-Za-z]{2})$/);
						this.search.on('change',{'me':this.search},function(e){
							var v = e.target.value.replace(/ /g,"");
							var m = v.match(regex)||[];
							if(m.length){
								_obj.log('INFO','Looks like a postcode',m[0]);
								postcode = m[0];
								if(!postcodes[m[0]]){
									postcodes[m[0]] = {};
									S().ajax('https://findthatpostcode.uk/postcodes/'+m[0]+'.json',{
										'dataType':'json',
										'postcode':m[0],
										'this': e.data.me,
										'success': function(data,attr){
											postcodes[attr.postcode] = data;
											this.update();
										}
									});
								}
							}else postcode = "";
						});
					}
					if(this.search){
						var l,f,i,j;
						this.search._added = {};
						this.search.clearItems();
						for(j = 0; j < this.views[this.options.view].layers.length; j++){
							l = this.views[this.options.view].layers[j].id;
							key = "";
							if(l=="LADlayer") key = "LAD22NM";
							else if(l=="Countylayer") key = "cty19nm";
							else if(l=="LEPlayer") key = "lep20nm";
							else if(l=="LSOAlayer") key = "LSOA21NM";
							else if(l=="MSOAlayer") key = "MSOA21NM";
							if(this.layers[l].geojson && this.layers[l].geojson.features && this.layers[l].key && key){
								// If we haven't already processed this layer we do so now
								if(!this.search._added[l]){
									f = this.layers[l].geojson.features;
									for(i = 0; i < f.length; i++) this.search.addItems({'name':f[i].properties[key]||"?",'id':f[i].properties[this.layers[l].key]||"",'i':i,'layer':l});
									this.search._added[l] = true;
								}
							}
						}
					}

					// Update the "moreinfo" box for screenshots
					div = el.querySelector('.moreinfo');
					if(!div){
						div = document.createElement('div');
						div.classList.add('leaflet-control');
						div.classList.add('moreinfo');
						el.appendChild(div);
					}
					div.innerHTML = 'Scenario: '+this.options.scenario+'<br />Parameter: '+this.parameters[this.options.parameter].title+'<br />View: '+this.views[this.options.view].title;
					div.setAttribute('style','border-color:'+this.data.scenarios[this.options.scenario].color)
				}
			},
			"setScale": function(t){
				var abs = document.querySelectorAll("[data-scale='absolute']");
				var rel = document.querySelectorAll("[data-scale='relative']");
				console.log('setScale',abs,rel,t);
				if(abs.length > 0) abs.forEach(function(e){ e.style.display = (t=="absolute") ? '' : 'none'; });
				if(rel.length > 0) rel.forEach(function(e){ e.style.display = (t=="relative") ? '' : 'none'; });
				return this;
			}
		}
	});


	// Add download button
	if(S('#download-csv')){
		S('#download-csv').on('click',{me:dfes},function(e){
			e.preventDefault();
			e.stopPropagation();
			var csv = "";
			var opt = e.data.me.options;
			var filename = ("DFES-2023--{{scenario}}--{{parameter}}--{{view}}.csv").replace(/\{\{([^\}]+)\}\}/g,function(m,p1){ return (opt[p1]||"").replace(/[ ]/g,"_") });
			var values,r,rs,y,v,l,layerid,p,ky,nm;
			values = e.data.me.data.scenarios[e.data.me.options.scenario].data[e.data.me.options.parameter].layers[e.data.me.options.view].values;
			v = e.data.me.options.view;
			layerid = '';
			// We need to loop over the view's layers
			for(l = 0; l < e.data.me.views[v].layers.length; l++){
				if(e.data.me.views[v].layers[l].heatmap) layerid = l;
			}
			ky = e.data.me.layers[e.data.me.views[v].layers[layerid].id].key;
			nm = e.data.me.layers[e.data.me.views[v].layers[layerid].id].name;
			if(typeof ky==="undefined") console.warn('No key provided for this layer in the layers structure.');
			if(typeof nm==="undefined") console.warn('No name provided for this layer in the layers structure.');

			rs = Object.keys(values).sort();
			csv = ky.toUpperCase()+','+e.data.me.views[v].title;
			for(y = e.data.me.options.years.min; y <= e.data.me.options.years.max; y++) csv += ','+y+(e.data.me.parameters[e.data.me.options.parameter] && e.data.me.parameters[e.data.me.options.parameter].units ? ' ('+e.data.me.parameters[e.data.me.options.parameter].units+')' : '');
			csv += '\n';
			for(i = 0; i < rs.length; i++){
				r = rs[i];
				p = getGeoJSONPropertiesByKeyValue(e.data.me.layers[e.data.me.views[v].layers[layerid].id].geojson,ky,r);
				csv += r;
				csv += ',';
				csv += (typeof nm==="string" && p[nm] ? (p[nm].match(',') ? '"'+p[nm]+'"' : p[nm]) : "?");
				for(y = e.data.me.options.years.min; y <= e.data.me.options.years.max; y++){
					csv += ',';
					if(typeof values[r][y]==="number") csv += (typeof e.data.me.parameters[e.data.me.options.parameter].dp==="number" ? values[r][y].toFixed(e.data.me.parameters[e.data.me.options.parameter].dp) : values[r][y]);
				}
				csv += '\n'
			}
			saveToFile(csv,filename,'text/plain');
		});
	}
	function saveToFile(txt,fileNameToSaveAs,mime){
		// Bail out if there is no Blob function
		if(typeof Blob!=="function") return this;

		var textFileAsBlob = new Blob([txt], {type:(mime||'text/plain')});

		function destroyClickedElement(event){ document.body.removeChild(event.target); }

		var dl = document.createElement("a");
		dl.download = fileNameToSaveAs;
		dl.innerHTML = "Download File";

		if(window.webkitURL != null){
			// Chrome allows the link to be clicked without actually adding it to the DOM.
			dl.href = window.webkitURL.createObjectURL(textFileAsBlob);
		}else{
			// Firefox requires the link to be added to the DOM before it can be clicked.
			dl.href = window.URL.createObjectURL(textFileAsBlob);
			dl.onclick = destroyClickedElement;
			dl.style.display = "none";
			document.body.appendChild(dl);
		}
		dl.click();
	}
	function getGeoJSONPropertiesByKeyValue(geojson,key,value){
		if(!geojson.features || typeof geojson.features!=="object"){
			fes.log('WARNING','Invalid GeoJSON',geojson);
			return {};
		}
		for(var i = 0; i < geojson.features.length; i++){
			if(geojson.features[i].properties[key] == value) return geojson.features[i].properties;
		}
		return {};
	};
	function getGeoJSONPropertyValue(l,value){
		if(!fes.layers[l].key){
			fes.log('WARNING','No key set for layer '+l);
			return "";
		}
		if(fes.layers[l] && fes.layers[l].geojson){
			key = (fes.layers[l].name||fes.layers[l].key);
			for(var i = 0; i < fes.layers[l].geojson.features.length; i++){
				if(fes.layers[l].geojson.features[i].properties[fes.layers[l].key] == value) return fes.layers[l].geojson.features[i].properties[key];
			}
			return "";
		}else return "";
	};
	
	
});
