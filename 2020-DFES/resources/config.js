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
						var popup,title,dp,value;
						popup = '<h3>%TITLE%</h3><p>%VALUE%</p>';

						title = (attr.properties.LAD20NM || '?');
						dp = (typeof attr.parameter.dp==="number" ? attr.parameter.dp : 2);
						value = '<strong>'+attr.parameter.title+' '+this.options.key+':</strong> '+(dp==0 ? Math.round(attr.value) : attr.value.toFixed(dp)).toLocaleString()+''+(attr.parameter.units ? '&thinsp;'+attr.parameter.units : '');

						// Replace values
						return popup.replace(/\%VALUE\%/g,value).replace(/\%TITLE\%/g,title);
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
						var popup,title,dp,value;
						popup = '<h3>%TITLE%</h3><p>%VALUE%</p>';

						title = (attr.properties.lep20nm || '?');
						dp = (typeof attr.parameter.dp==="number" ? attr.parameter.dp : 2);
						value = '<strong>'+attr.parameter.title+' '+this.options.key+':</strong> '+(dp==0 ? Math.round(attr.value) : attr.value.toFixed(dp)).toLocaleString()+''+(attr.parameter.units ? '&thinsp;'+attr.parameter.units : '');

						// Replace values
						return popup.replace(/\%VALUE\%/g,value).replace(/\%TITLE\%/g,title);
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
