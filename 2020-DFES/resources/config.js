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
			"scenario": "Steady Progression",
			"view": "LAD",
			"key": (new Date()).getFullYear()+"",
			"parameter": "bev",
			"scale": "relative",
			"source": null,
			"years": {"min":2020,"max":2050},
			"map": {
				"bounds": [[50.6,-1.55],[53,2]],
				"attribution": "Vis: <a href=\"https://odileeds.org/projects/\">ODI Leeds</a>, Data: UK Power Networks",
				"quantised": 5
			}
		},
		"layers": {
			"LADlayer":{
				"geojson": "data/maps/LAD2020-clipped-fullextent-simplified.geojson",
				"key": "lad20cd",
				"data": {
					"mapping": {
						"src": "data/lsoa2lad-compact.json",
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
					"src": "lsoa"
				}
			},
			"LSOAlayer":{
				"geojson": "data/maps/LSOA11-rough.geojson",
				"key": "LSOA11CD",
				"data": {
					"src": "lsoa"
				}
			},
			"LEPlayer":{
				"geojson": "data/maps/LEP2020-clipped-fullextent-simplified.geojson",
				"key": "lep20cd",
				"data": {
					"mapping": {
						"src": "data/lsoa2lep-compact.json",
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
					"src": "lsoa"
				}
			},
			"Countylayer":{
				"geojson": "data/maps/Counties-clipped-simplified.geojson",
				"key": "cty20cd",
				"data": {
					"mapping": {
						"src": "data/lsoa2lep-compact.json",
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
					"src": "lsoa"
				}
			}
		},
		"views":{
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
						return '<h3>'+(attr.properties.lep20nm || '?')+'</h3><p>'+attr.parameter.title+': '+attr.value.toLocaleString()+attr.parameter.units+' ('+this.options.key+')</p><div id="barchart">barchart</div><p class="footnote">The LEP has been clipped to UKPN\'s area.</p><p class="footnote capture-hide"><a href="#" onClick="saveDOMImage(document.querySelector(\'.dfes-popup-content\'),{\'src\':\''+file+'\',\'scale\':true});">Save chart as PNG</a></p>';
					},
					"open": function(attr){
						var data,c,p,key,values,l;
						if(!attr) attr = {};
						
						l = this.views[this.options.view].layers[0].id;
						key = this.layers[l].key;

						if(attr.id && key){

							data = [];							
							values = this.data.scenarios[this.options.scenario].data[this.options.parameter][this.options.source].layers[l].values;

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
						file = 'County-'+attr.properties.cty20cd+'-'+this.options.scenario.replace(/ /,"").toLowerCase()+'-'+this.options.parameter+'.png';
						return '<h3>'+(attr.properties.cty20nm || '?')+'</h3><p>'+attr.parameter.title+': '+attr.value.toLocaleString()+attr.parameter.units+' ('+this.options.key+')</p><div id="barchart">barchart</div><p class="footnote">The area has been clipped to UKPN\'s area</p><p class="footnote capture-hide"><a href="#" onClick="saveDOMImage(document.querySelector(\'.dfes-popup-content\'),{\'src\':\''+file+'\',\'scale\':true});">Save chart as PNG</a></p>';
					},
					"open": function(attr){
						var data,c,p,key,values,l;
						if(!attr) attr = {};
						
						l = this.views[this.options.view].layers[0].id;
						key = this.layers[l].key;

						if(attr.id && key){

							data = [];							
							values = this.data.scenarios[this.options.scenario].data[this.options.parameter][this.options.source].layers[l].values;

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
						file = 'LAD-'+attr.properties.lad20cd+'-'+this.options.scenario.replace(/ /,"").toLowerCase()+'-'+this.options.parameter+'.png';
						return '<h3>'+(attr.properties.lad20nm || '?')+'</h3><p>'+attr.parameter.title+': '+attr.value.toLocaleString()+attr.parameter.units+' ('+this.options.key+')</p><div id="barchart">barchart</div><p class="footnote">The LA may have been clipped to UKPN\'s area</p><p class="footnote capture-hide"><a href="#" onClick="saveDOMImage(document.querySelector(\'.dfes-popup-content\'),{\'src\':\''+file+'\',\'scale\':true});">Save chart as PNG</a></p>';
					},
					"open": function(attr){

						var data,c,p,key,values,l;
						if(!attr) attr = {};
						
						l = 'LADlayer';
						key = this.layers[l].key;

						if(attr.id && key){

							data = [];
							
							values = this.data.scenarios[this.options.scenario].data[this.options.parameter][this.options.source].layers[l].values;

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
						file = 'LSOA-'+attr.properties.LSOA11CD+'-'+this.options.scenario.replace(/ /,"").toLowerCase()+'-'+this.options.parameter+'.png';
						return '<h3>'+(attr.properties.LSOA11CD || '?')+'</h3><p>'+attr.parameter.title+': '+(attr.value||0).toLocaleString()+attr.parameter.units+' ('+this.options.key+')</p><div id="barchart">barchart</div><p class="footnote">The LSOAs may have been clipped to UKPN\'s area</p><p class="footnote capture-hide"><a href="#" onClick="saveDOMImage(document.querySelector(\'.dfes-popup-content\'),{\'src\':\''+file+'\',\'scale\':true});">Save chart as PNG</a></p>';
					},
					"open": function(attr){

						var data,c,p,key,values,l;
						if(!attr) attr = {};
						
						l = 'LSOAlayer';
						key = this.layers[l].key;

						if(attr.id && key){

							data = [];

							values = this.data.scenarios[this.options.scenario].data[this.options.parameter][this.options.source].layers[l].values;

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
								return d['name']+(d['type'] ? ' ('+d['type']+')':'');
							},
							'rank': function(d,str){
								// Calculate the weight to add to this airport
								var r = 0;
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

					}
					if(this.search){
						var l,f,i,j;
						this.search._added = {};
						this.search.clearItems();
						//console.log(this,this.options.view,this.layers[this.options.view]);
						for(j = 0; j < this.views[this.options.view].layers.length; j++){
							l = this.views[this.options.view].layers[j].id;
							key = "";
							if(l=="LADlayer") key = "lad20nm";
							else if(l=="LEPlayer") key = "lep20nm";
							else if(l=="LSOAlayer") key = "LSOA11NM";
							if(this.layers[l].geojson && this.layers[l].geojson.features && this.layers[l].key && key){
								// If we haven't already processed this layer we do so now
								if(!this.search._added[l]){
									//console.log('adding',l);
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
			}
		}
	});

	
/*	

*/	
	
	
	
});
