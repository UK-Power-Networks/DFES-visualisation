// Define a new instance of the FES
var dfes

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
				"attribution": "Vis: <a href=\"https://odileeds.org/projects/\">ODI Leeds</a>, Data: UK Power Networks"
			}
		},
		"layers": {
			"LAD":{
				"geojson": "data/maps/LAD2020-clipped.geojson",
				"key": "LAD20CD",
				"data": {
					"mapping": "data/lsoa2lad.json",
					"src": "lsoa"
				}
			},
			"LEP":{
				"geojson": "data/maps/LEP2020-clipped.geojson",
				"key": "lep20cd",
				"data": {
					"mapping": "data/lsoa2lep.json",
					"src": "lsoa"
				}
			},
			"lsoa":{
				"geojson":"data/maps/NEEDSUPDATING.geojson",
				"key": "",
				"data": {
					"src": "lsoa"	// This is the key used in data/scenarios/index.json
				}
			}
		},
		"views":{
			"LAD":{
				"title":"Local Authorities",
				"source": "lsoa",
				"layers":[{
					"id": "LAD",
					"heatmap": true,
					"boundary":{"strokeWidth":2}
				}],
				"popup": {
					"text": function(attr){
						return '<h3>'+(attr.properties.LAD20NM || '?')+'</h3><p>'+attr.parameter.title+'</p><div id="barchart">barchart</div><p class="footnote">The LA may have been clipped to UKPN\'s area</p>';
					},
					"open": function(attr){

						var data,c,p,key,values;
						if(!attr) attr = {};
						
						key = this.layers[this.options.view].key;

						if(attr.id && key){

							data = [];
							
							values = this.data.scenarios[this.options.scenario].data[this.options.parameter][this.options.source].layers[this.options.view].values;

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
					"id": "LEP",
					"heatmap": true,
					"boundary":{"strokeWidth":2}
				}],
				"popup": {
					"text": function(attr){
						return '<h3>'+(attr.properties.lep20nm || '?')+'</h3><p>'+attr.parameter.title+'</p><div id="barchart">barchart</div><p class="footnote">The LEP has been clipped to UKPN\'s area</p>';
					},
					"open": function(attr){

						var data,c,p,key,values;
						if(!attr) attr = {};
						
						key = this.layers[this.options.view].key;

						if(attr.id && key){

							data = [];
							
							values = this.data.scenarios[this.options.scenario].data[this.options.parameter][this.options.source].layers[this.options.view].values;

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
			"lsoa":{
				"title":"LSOA",
				"source": "lsoa",
				"inactive": true,
				"layers":[{
					"id": "lsoa",
					"heatmap": true,
				}]
			}
		}
	});
});
