
var map;
var overlayTree; // tree structure of historic overlayTree
var overlay; //current historic overlay node
var overlayOldName; // former historic overlay name
var overlayLayers;
var overlaySelected;
var baseLayers; // base layers include Google, Bing and OS maps, and OpenStreetMap
var initialisation = true; // initialisation mode
var args;
var urlLayerName;
var DEFAULT_LAT = 56.0;
var DEFAULT_LON = -4.0;
var DEFAULT_ZOOM = 5;
var opacity = 1;


proj4.defs("EPSG:27700", "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs");

var BingapiKey = "AgS4SIQqnI-GRV-wKAQLwnRJVcCXvDKiOzf9I1QpUQfFcnuV82wf1Aw6uw5GJPRz";

Number.prototype.toRad = function() {
               return this * Math.PI / 180;
}

var wgs84Sphere = new ol.Sphere(6378137);

function zoomtoextent() {
	var overlay = getOverlay(urlLayerName);
        var extent = [overlay.get('minx'), overlay.get('miny'), overlay.get('maxx'), overlay.get('maxy')];
        extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:4326", "EPSG:3857"));
        map.getView().fitExtent(extent, map.getSize());
}


function getOverlay(mosaic_id) {
    var layers = overlayLayers.slice();
    for (var x = 0; x < layers.length; x++) {
        if (layers[x].get('mosaic_id') == mosaic_id) return layers[x];
    }
}

function findByName(mosaic_id) {
		var layers = overlayLayers.slice();
		for (var i = 0; i < layers.length; i++) {
			if (mosaic_id == layers.item(i).get('mosaic_id')) {
			return layers.item(i);
			}
		}
	return null;
}


function setURL() {

	var zoom = map.getView().getZoom();
	var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");
	var mapgroupno = map.getLayers().getArray()[2].get('group_no');
     	if (mapgroupno == 7) { window.location = "http://maps.nls.uk/openlayers.cfm?id=22&zoom=" + zoom + "&lat=" + centre[1].toFixed(4) + "&lon=" + centre[0].toFixed(4); }
     	else if (mapgroupno == 9) { window.location = "http://maps.nls.uk/openlayers.cfm?id=11&zoom=" + zoom + "&lat=" + centre[1].toFixed(4) + "&lon=" + centre[0].toFixed(4); }
     	else if (mapgroupno == 18) { window.location = "http://maps.nls.uk/openlayers.cfm?id=25&zoom=" + zoom + "&lat=" + centre[1].toFixed(4) + "&lon=" + centre[0].toFixed(4); }
	else if (mapgroupno == 32) { window.location = "http://maps.nls.uk/openlayers.cfm?id=14&zoom=" + zoom + "&lat=" + centre[1].toFixed(4) + "&lon=" + centre[0].toFixed(4); }
	else if (mapgroupno == 34) { window.location = "http://maps.nls.uk/openlayers.cfm?id=8&zoom=" + zoom + "&lat=" + centre[1].toFixed(4) + "&lon=" + centre[0].toFixed(4); }
	else if (mapgroupno == 35) { window.location = "http://maps.nls.uk/openlayers.cfm?id=5&zoom=" + zoom + "&lat=" + centre[1].toFixed(4) + "&lon=" + centre[0].toFixed(4); }
	else if (mapgroupno == 36) { window.location = "http://maps.nls.uk/openlayers.cfm?id=6&zoom=" + zoom + "&lat=" + centre[1].toFixed(4) + "&lon=" + centre[0].toFixed(4); }
	else if (mapgroupno == 39) { window.location = "http://maps.nls.uk/openlayers.cfm?id=1&zoom=" + zoom + "&lat=" + centre[1].toFixed(4) + "&lon=" + centre[0].toFixed(4); }
	else if (mapgroupno == 40) { window.location = "http://maps.nls.uk/openlayers.cfm?id=4&zoom=" + zoom + "&lat=" + centre[1].toFixed(4) + "&lon=" + centre[0].toFixed(4); }
	else if (mapgroupno == 43) { window.location = "http://maps.nls.uk/openlayers.cfm?id=32&zoom=" + zoom + "&lat=" + centre[1].toFixed(4) + "&lon=" + centre[0].toFixed(4); }
	else if (mapgroupno == 45) { window.location = "http://maps.nls.uk/openlayers.cfm?id=34&zoom=" + zoom + "&lat=" + centre[1].toFixed(4) + "&lon=" + centre[0].toFixed(4); }
	else if (mapgroupno == 50) { window.location = "http://maps.nls.uk/openlayers.cfm?id=34&zoom=" + zoom + "&lat=" + centre[1].toFixed(4) + "&lon=" + centre[0].toFixed(4); }
	else if (mapgroupno == 55) { window.location = "http://maps.nls.uk/openlayers.cfm?id=13&zoom=" + zoom + "&lat=" + centre[1].toFixed(4) + "&lon=" + centre[0].toFixed(4); }
	else if (mapgroupno == 56) { window.location = "http://maps.nls.uk/openlayers.cfm?id=33&zoom=" + zoom + "&lat=" + centre[1].toFixed(4) + "&lon=" + centre[0].toFixed(4); }
	else if (mapgroupno == 57) { window.location = "http://maps.nls.uk/openlayers.cfm?id=38&zoom=" + zoom + "&lat=" + centre[1].toFixed(4) + "&lon=" + centre[0].toFixed(4); }
	else if (mapgroupno == 58) { window.location = "http://maps.nls.uk/openlayers.cfm?id=36&zoom=" + zoom + "&lat=" + centre[1].toFixed(4) + "&lon=" + centre[0].toFixed(4); }
	else if (mapgroupno == 59) { window.location = "http://maps.nls.uk/openlayers.cfm?id=39&zoom=" + zoom + "&lat=" + centre[1].toFixed(4) + "&lon=" + centre[0].toFixed(4); }
	else if (mapgroupno == 60) { window.location = "http://maps.nls.uk/openlayers.cfm?id=60&zoom=" + zoom + "&lat=" + centre[1].toFixed(4) + "&lon=" + centre[0].toFixed(4); }
	else if (mapgroupno == 61) { window.location = "http://maps.nls.uk/openlayers.cfm?id=61&zoom=" + zoom + "&lat=" + centre[1].toFixed(4) + "&lon=" + centre[0].toFixed(4); }
	else if (mapgroupno == 64) { window.location = "http://maps.nls.uk/openlayers.cfm?id=64&zoom=" + zoom + "&lat=" + centre[1].toFixed(4) + "&lon=" + centre[0].toFixed(4); }
	else if (mapgroupno == 65) { window.location = "http://maps.nls.uk/openlayers.cfm?id=65&zoom=" + zoom + "&lat=" + centre[1].toFixed(4) + "&lon=" + centre[0].toFixed(4); }
	else { 	window.location = "/geo/find/index.cfm#zoom=" + zoom + "&lat=" + centre[1].toFixed(4) + "&lon=" + centre[0].toFixed(4); }
}

function sidebysideURL() {
   var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");
   var urlLayerno = map.getLayers().getArray()[2].get('mosaic_id');
   window.location = "http://" + window.location.hostname + "/geo/explore/sidebyside.cfm#zoom=" + map.getView().getZoom()  + "&lat=" + centre[1].toFixed(4)  + "&lon=" + centre[0].toFixed(4) +  "&layers=" + urlLayerno + "&right=BingHyb";
}

function printURL() {
   // var permalink =  new OpenLayers.Control.Permalink({div: document.getElementById("permalink"), anchor: true});   
   // map.addControl(permalink);
   var a = document.createElement('a');
   a = window.location.hash;
   window.location = "print.cfm" + a ;
}

function printURLback() {
   // var zoom = map.getZoom();
   // var longlat = map.getCenter().transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326")); 
   var a = document.createElement('a');
   a = window.location.hash;
   window.location = "index.cfm" + a ;
}


function loadOptions()
{
	args = [];
	var hash = window.location.hash;
	if (hash.length > 0)
	{
		var elements = hash.split('&');
		elements[0] = elements[0].substring(1); /* Remove the # */

		for(var i = 0; i < elements.length; i++)
		{
			var pair = elements[i].split('=');
			args[pair[0]] = pair[1];
		}
	}
}

function setZoomLimit()
{ 
	updateUrl();
}

function setPanEnd()
{
	updateUrl();
}


function updateUrl()
{
	 if (urlLayerName == undefined)
	 {
		urlLayerName = '1';
	 }

	 else 
	{
	 if (overlay) urlLayerName = overlay.layer.get('mosaic_id');
	 }

	var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");
	window.location.hash = "zoom=" + map.getView().getZoom()  + "&lat=" + centre[1].toFixed(4)  + "&lon=" + centre[0].toFixed(4) +  "&layers=" + urlLayerName ; 
}


function getmapkey() {
    var keytext = map.getLayers().getArray()[2].get('key');
    newwindow= window.open("http://"+keytext, "popup", "height=500,width=850,status=no,toolbar=no,scrollbars=yes,menubar=no,location=no,fullscreen=no");
}



// From http://www.movable-type.co.uk/scripts/latlong-gridref.html NT261732
    function gridrefNumToLet(e, n, digits) {
        // get the 100km-grid indices
        var e100k = Math.floor(e / 100000),
        n100k = Math.floor(n / 100000);

        if (e100k < 0 || e100k > 6 || n100k < 0 || n100k > 12) return '';

        // translate those into numeric equivalents of the grid letters
        var l1 = (19 - n100k) - (19 - n100k) % 5 + Math.floor((e100k + 10) / 5);
        var l2 = (19 - n100k) * 5 % 25 + e100k % 5;

        // compensate for skipped 'I' and build grid letter-pairs
        if (l1 > 7) l1++;
        if (l2 > 7) l2++;
        var letPair = String.fromCharCode(l1 + 'A'.charCodeAt(0), l2 + 'A'.charCodeAt(0));

        // strip 100km-grid indices from easting & northing, and reduce precision
        e = Math.floor((e % 100000) / Math.pow(10, 5 - digits / 2));
        n = Math.floor((n % 100000) / Math.pow(10, 5 - digits / 2));

        Number.prototype.padLZ = function(w) {
            var n = this.toString();
            while (n.length < w) n = '0' + n;
            return n;
        }

        var gridRef = letPair + e.padLZ(digits / 2) + n.padLZ(digits / 2);

        return gridRef;
    }
	function gridrefLetToNum(gridref) {
	  // get numeric values of letter references, mapping A->0, B->1, C->2, etc:
	  var l1 = gridref.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
	  var l2 = gridref.toUpperCase().charCodeAt(1) - 'A'.charCodeAt(0);
	  // shuffle down letters after 'I' since 'I' is not used in grid:
	  if (l1 > 7) l1--;
	  if (l2 > 7) l2--;

	  // convert grid letters into 100km-square indexes from false origin (grid square SV):
	  var e = ((l1-2)%5)*5 + (l2%5);
	  var n = (19-Math.floor(l1/5)*5) - Math.floor(l2/5);

	  // skip grid letters to get numeric part of ref, stripping any spaces:
	  gridref = gridref.slice(2).replace(/ /g,'');

	  // append numeric part of references to grid index:
	  e += gridref.slice(0, gridref.length/2);
	  n += gridref.slice(gridref.length/2);

	  // normalise to 1m grid, rounding up to centre of grid square:
	  switch (gridref.length) {
		case 2: e += '5000'; n += '5000'; break;
	    case 4: e += '500'; n += '500'; break;
	    case 6: e += '50'; n += '50'; break;
	    case 8: e += '5'; n += '5'; break;
	    // 10-digit refs are already 1m
	  }

	  return [e, n];
	}

	var adchATTRIBUTION = new ol.Attribution({
	  html: 'We are very grateful to <a href="http://www.davidrumsey.com/">David Rumsey</a> for supporting the scanning and georeferencing of this chart' 
	});

	var RumseyATTRIBUTION = new ol.Attribution({
	  html: 'We are very grateful to <a href="http://www.davidrumsey.com/">David Rumsey</a> for supporting the scanning and georeferencing of this overlay' 
	});

	var LandUseATTRIBUTION = new ol.Attribution({
	  html: 'We are very grateful to Giles Clark for granting permission to display these maps' 
	});

	// OpenStreetMap
	var osm = new ol.layer.Tile({
	                        title: 'Background map - OpenStreetMap',
	  source: new ol.source.OSM({
	    // attributions: [ol.source.OSM.DATA_ATTRIBUTION],
	    url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
	  })/*,
	  opacity: 0.7*/
	});


       var mapMQ = new ol.layer.Tile({
		title: 'Background map - MapQuest Map',
		type: 'base', 
                source: new ol.source.MapQuest({
                            layer: 'osm'
                })
        });

       var mapMQsat = new ol.layer.Tile({
		title: 'Background map - MapQuest Satellite',
		type: 'base', 
                source: new ol.source.MapQuest({
                            layer: 'sat'
                })
        });

       var mapMQhyb = new ol.layer.Tile({
		title: 'Background map - MapQuest Hybrid',
		type: 'base', 
                source: new ol.source.MapQuest({
                            layer: 'hyb'
                })
        });

	var BingSatellite =   new ol.layer.Tile({
		title: 'Background map - Bing Satellite',
		type: 'base', 
	        source: new ol.source.BingMaps({
			key: BingapiKey,
			imagerySet: 'Aerial',
			maxZoom: 19
		    })
	});

	var BingRoad = new ol.layer.Tile({
	         title: 'Background map - Bing Road',
	         type: 'base',
	         source: new ol.source.BingMaps({
		      key: BingapiKey,
		      imagerySet: 'Road',
		      maxZoom: 19
		    })
	});

	var BingAerialWithLabels = new ol.layer.Tile({
	          title: 'Background map - Bing Hybrid',
	          type: 'base',
	          source: new ol.source.BingMaps({
			key: BingapiKey,
			imagerySet: 'AerialWithLabels',
			maxZoom: 19
		})
	});

	var mapboxsatellite =  	new ol.layer.Tile({
	            title: 'Background map - MapBox Satellite',
	            type: 'base',
		    source: new ol.source.XYZ({
				// attributions: [nlsTILEATTRIBUTION],
				url: 'http://api.tiles.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hyaXNmbGVldCIsImEiOiJqX1Z1RC1BIn0.EWTBwPuV5hT1bfnyP2cn_w',
				// minZoom: 10,
				// maxZoom: 15,
				 tilePixelRatio: 1
		})
          });

	var mapboxstreets =  	new ol.layer.Tile({
	            title: 'Background map - MapBox Streets',
	            type: 'base',
		    source: new ol.source.XYZ({
				// attributions: [nlsTILEATTRIBUTION],
				url: 'http://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hyaXNmbGVldCIsImEiOiJqX1Z1RC1BIn0.EWTBwPuV5hT1bfnyP2cn_w',
				// minZoom: 10,
				// maxZoom: 15,
				 tilePixelRatio: 1
		})
          });

	var StamenWatercolor =  new ol.layer.Tile({
	           title: 'Background map - Water color',
	           type: 'base',
	           source: new ol.source.Stamen({
	                  layer: 'watercolor'
	           })
	});


	var OS1920s =  	new ol.layer.Tile({
	            title: 'Background map - OS 1920s',
	            type: 'base',
		    source: new ol.source.XYZ({
				// attributions: [nlsTILEATTRIBUTION],
				url: 'http://geo.nls.uk/maps/api/nls/{z}/{x}/{y}.jpg',
				// minZoom: 10,
				maxZoom: 15,
				tilePixelRatio: 1
		})
          });


	var OSOpendata = new ol.layer.Tile({
	              title: 'Background map - OS Opendata',
	              type: 'base',
		      source: new ol.source.XYZ({
				    // attribution: '<a href="http://www.ordnancesurvey.co.uk/oswebsite/opendata/">Ordnance Survey OpenData</a> rendered by <a href="http://www.klokantech.com/" target="_blank">Klokan Technologies GmbH</a>',
				    url: 'http://geo.nls.uk/maps/opendata/{z}/{x}/{y}.png',
				    // minZoom: 10,
				    maxZoom: 15,
				    tilePixelRatio: 1
				  })
	                    });

	var baseLayers = [ BingAerialWithLabels, BingSatellite, BingRoad, mapboxsatellite, mapboxstreets, osm, OSOpendata, OS1920s, mapMQ, mapMQsat ];



	// Load overlay layers of current node

	    var layerSelect = document.getElementById('layerSelect');
	    for (var x = 0; x < baseLayers.length; x++) {
	        // if (!baseLayers[x].displayInLayerSwitcher) continue;
	        var option = document.createElement('option');
		option.appendChild(document.createTextNode(baseLayers[x].get('title')));
	        option.setAttribute('value', x);
	        option.setAttribute('id', 'baseOption' + baseLayers[x].get('title'));
	        layerSelect.appendChild(option);
	    }


    var oneinch2nd = new ol.layer.Tile({
			title: "Great Britain - OS One Inch, 1885-1900 - Outline", 
		        group_no: '39',
		        mosaic_id: '1',
			type: 'overlay',
        		visible: false,
		        minx: -7.68, 
			miny: 49.8, 
		        maxx: 1.77, 
		        maxy: 60.9,
		        key: 'geo.nls.uk/maps/os/1inch_2nd_ed/key/openlayers.html',
		      	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/1inch_2nd_ed/{z}/{x}/{-y}.png",
				minZoom: 8,
		              	maxZoom: 15
		  })
	        });


    var greatbritaincoasts = new ol.layer.Tile({
	title: "No overlay - display base map",
	source: new ol.source.XYZ({
				url: "http://geoserver.nls.uk/geoserver/gwc/service/gmaps?layers=nls:greatbritaincoasts/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 21
		  }),
        attribution: '', 
	type: 'overlay',        
	visible: false,
        minx: -8.4, 
        miny: 54.5, 
        maxx: -1.4, 
        maxy: 58.8
    });


    var trench_maps = new ol.layer.Tile({
	title: "",
	source: new ol.source.XYZ({
				url: "http://geoserver.nls.uk/geoserver/gwc/service/gmaps?layers=nls:TM_Combined_sorted_27700_explore_index&zoom={z}&x={x}&y={y}&format=image/png",
				minZoom: 8,
				maxZoom: 21
		  }),
        attribution: '', group_no: '60', visibility: true, 
        urlprefix: '',
        urlsuffix: '',
	maxResolution: 611.4962261962891,
	minResolution: 9.554628534317017,
        minx: 1.91,
        miny: 49.26, 
        maxx: 4.68, 
        maxy: 51.45
    });


 	var royhighlands = new ol.layer.Tile({
	title: "Scotland - Roy Highlands - 1747-52",
	source: new ol.source.XYZ({
				attributions: [new ol.Attribution({html:'Roy Map &copy; The <a href="http://www.bl.uk" target="_blank">British Library</a> Board'})],
				url: "http://geo.nls.uk/maps/roy/highlands/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        group_no: '47',
        mosaic_id: '3',
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay <a href="http://www.bl.uk" target="_blank"><img src="http://geo.nls.uk/img/british_library_logo.gif" width="36" height="70" border="0" alt="British Library logo" /></a>&nbsp; &copy; The <a href="http://www.bl.uk" target="_blank">British Library</a> Board',
        minx: -6.60310816079, 
        miny: 55.2288109306, 
        maxx: -1.55313293818, 
        maxy: 58.840920869
    });


    var roylowlands = new ol.layer.Tile({
	title: "Scotland - Roy Lowlands - 1752-55",
	source: new ol.source.XYZ({
				attributions: [new ol.Attribution({html:'Roy Map &copy; The <a href="http://www.bl.uk" target="_blank">British Library</a> Board'})],
				url: "http://geo.nls.uk/maps/roy/lowlands/{z}/{x}/{-y}.png",
				minZoom: 9,
				maxZoom: 14
		  }),
        group_no: '47',
        mosaic_id: '4',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay <a href="http://www.bl.uk" target="_blank"><img src="http://geo.nls.uk/img/british_library_logo.gif" width="36" height="70" border="0" alt="British Library logo" /></a>&nbsp; &copy; The <a href="http://www.bl.uk" target="_blank">British Library</a> Board',
        tileOptions: {crossOriginKeyword: null},        
	minx: -5.45258212238, 
        miny: 54.4957439532, 
        maxx: -1.91668863511, 
        maxy: 56.2131384315	                        
    });



var scot1944_1963 = new ol.layer.Tile({
	title: "Scotland - OS 1:1,250, 1944-1963 (Edinburgh)",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/os/edinburgh_1250_out/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 21
		  }),
        group_no: '61',
        mosaic_id: '170',
        type: 'overlay', 
        visible: false,
	keytext: 'View the individual sheets of this OS large-scale mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/mapdata3/os/1250_key/openlayers.html',
        attribution: '',
	minx: -5.45258212238, 
        miny: 54.4957439532, 
        maxx: -1.91668863511, 
        maxy: 56.2131384315
    });

    var sixinch = new ol.layer.Tile({
	title: "Scotland - OS Six Inch, 1843-1882",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/six_inch/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        group_no: '35',
        mosaic_id: '5',
        type: 'overlay', 
        visible: false,
	keytext: 'View the individual sheets of this OS six-inch mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/maps/os/six_inch/key/openlayers.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/os/6inch/index.html" target="_blank">Ordnance Survey Six Inch, 1843-1882</a> maps', 
        minx: -9.4, 
        miny: 54.5, 
        maxx: -0.6, 
        maxy: 60.9
	                        
    });



    var os25inch1890s = new ol.layer.Tile({
	title: "Scotland - OS 25 Inch, 1892-1905",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/os/25_inch/cb/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),

        group_no: '34',
        mosaic_id: '168',
        backgroundColor: '#ccc',
	type: 'overlay', 
        visible: false,
	keytext: 'View the individual sheets of this OS 25 inch mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/mapdata3/os/25_inch/cb/key/openlayers.html',
        attribution: 'This layer is in process. <a href="http://maps.nls.uk/os/25inch-2nd-and-later/index.html" target="_blank">25 inch, 1892-1949 home page</a>',
        minx: -4.4115, 
        miny: 55.4031, 
        maxx: -2.0084, 
        maxy: 56.4657 
    });

    var oneinch2nd = new ol.layer.Tile({
	title: "Great Britain - OS One Inch, 1885-1900 - Outline",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/1inch_2nd_ed/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        group_no: '39',
        mosaic_id: '1',
        type: 'overlay', 
        visible: false,
        minx: -7.68, 
	miny: 49.8, 
        maxx: 1.77, 
        maxy: 60.9,
        key: 'geo.nls.uk/maps/os/1inch_2nd_ed/key/openlayers.html'
    });
    

	var one_inch_2nd_hills = new ol.layer.Tile({
	title: "Great Britain - OS One-Inch, 1885-1903 - Hills",
	source: new ol.source.XYZ({
    				attributions: [RumseyATTRIBUTION],
				url: "http://geo.nls.uk/maps/os/1inch_2nd_hill/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        group_no: '58',
        mosaic_id: '161',
        type: 'overlay', 
        visible: false,
	keytext: 'View the individual sheets of this OS one-inch mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/maps/os/1inch_2nd_ed/key/openlayers.html',
        minx: -7.68, 
	miny: 49.8,
        maxx: 1.77, 
        maxy: 60.9
    });


    var oneinchpopular = new ol.layer.Tile({
	title: "Scotland - OS One Inch, 1921-1930",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/popular/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        group_no: '40',
        mosaic_id: '164',
        type: 'overlay', 
        visible: false,
        minx: -8.8, 
        miny: 54.5, 
        maxx: -0.6, 
        maxy: 60.9,
	keytext: 'View the individual sheets of this OS one-inch mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/os/one-inch-popular/index.html" target="_blank">OS Popular edition</a> home page' 
    });


    var oneinchlanduse = new ol.layer.Tile({
	title: "Scotland - Land Utilisation Survey, 1931-1935",
	source: new ol.source.XYZ({
			        attribution: [LandUseATTRIBUTION],
				url: "http://geo.nls.uk/mapdata2/land_uti/{z}/{x}/{y}.png",
				minZoom: 4,
				maxZoom: 16
		  }),
        group_no: '65',
        mosaic_id: '174',
        type: 'overlay', 
        visible: false,
        minx: -7.879323, 
        miny: 54.549396, 
        maxx: -0.604752, 
        maxy: 60.910351,
	keytext: 'View the individual sheets of this OS one-inch mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/mapdata2/land_uti/key/openlayers.html',

    });

	var OS1900sGB =  new ol.layer.Tile({
	            title: 'Great Britain - OS 1:1 million-1:10K, 1900s',
		        group_no: '',
		        mosaic_id: '172',

		    source: new ol.source.XYZ({
				url: 'http://nls-0.tileserver.com/NLS_API/{z}/{x}/{y}.jpg',
				minZoom: 8,
				maxZoom: 17

		}),
			        type: 'overlay', 
			        visible: false,
			        minx: -8.8, 
				miny: 49.8,
			        maxx: 1.77, 
			        maxy: 60.9
          });
    


	var OSsixinchcaithness =  new ol.layer.Tile({
		    source: new ol.source.XYZ({
				url: 'http://anzani.co/map/Caithness/{z}/{x}/{y}.png', 
		}),

          });

	var OSsixinchsutherland =  new ol.layer.Tile({
		    source: new ol.source.XYZ({
				url: 'http://anzani.co/map/Sutherland/{z}/{x}/{y}.png', 

		}),

          });

	var OSsixinchtest = new ol.layer.Group({
	            title: 'Scotland - OS six-inch test',
		        group_no: '',
		        mosaic_id: 'xxx',
	layers: [OSsixinchcaithness, OSsixinchsutherland],
			        type: 'overlay', 
			        visible: false,
			        minx: -8.8, 
				miny: 49.8,
			        maxx: 1.77, 
			        maxy: 60.9
	});

	var oneinchnatgrid = new ol.layer.Tile({
	title: "Scotland - OS One Inch, 1945-1948",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/1inch_pop_nat_grid/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        group_no: '37',
        mosaic_id: '2',
        type: 'overlay', 
        visible: false,
        minx: -8.4, 
        miny: 54.5, 
        maxx: -0.6, 
        maxy: 60.9,
	keytext: 'View the individual sheets of this OS one-inch mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/maps/os/1inch_pop_nat_grid/key/openlayers.html' 
    });


    var sixinch2scot = new ol.layer.Tile({
	title: "Scotland - OS Six Inch, 1888-1913", 
	source: new ol.source.XYZ({
				url: "http://nls-0.tileserver.com/os_6_inch_gb/{z}/{x}/{y}.jpg",
				minZoom: 8,
				maxZoom: 18
		  }),
        group_no: '36',
        mosaic_id: '6',
        type: 'overlay', 
        visible: false,
	keytext: 'View the individual sheets of this OS six-inch mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/maps/os/six_inch/key/openlayers.html',
        attribution: '',
        minx: -8.8, 
	miny: 49.8,
        maxx: 1.8, 
        maxy: 60.9
    });

    var sixinch2 = new ol.layer.Tile({
	title: "Great Britain - OS Six Inch, 1888-1913", 	
		source: new ol.source.XYZ({
				url: "http://nls-0.tileserver.com/os_6_inch_gb/{z}/{x}/{y}.jpg",
				minZoom: 8,
				maxZoom: 18
		  }),
        group_no: '36',
        mosaic_id: '6',
        type: 'overlay', 
        visible: false,
	keytext: 'View the individual sheets of this OS six-inch mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/maps/os/six_inch/key/openlayers.html',
        attribution: '',
        tileOptions: {crossOriginKeyword: null},      
        minx: -8.8, 
	miny: 49.8,
        maxx: 1.8, 
        maxy: 60.9
    });

    var oneinchseventhscot = new ol.layer.Tile({
	title: "Scotland - OS One Inch 7th series, 1955-61",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata2/os/seventh/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        group_no: '55',
        mosaic_id: '11',
        type: 'overlay', 
        visible: false,
        minx: -8.8, 
	miny: 49.8,
        maxx: 1.77, 
        maxy: 60.9,
	keytext: 'View the individual sheets of this OS one-inch mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/mapdata2/os/seventh/key/openlayers.html'
    });




    var oneinchseventh = new ol.layer.Tile({
	title: "Great Britain - OS One Inch 7th series, 1955-61",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata2/os/seventh/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        group_no: '55',
        mosaic_id: '11',
        type: 'overlay', 
        visible: false,
        minx: -8.8, 
	miny: 49.8,
        maxx: 1.77, 
        maxy: 60.9,
	keytext: 'View the individual sheets of this OS one-inch mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/mapdata2/os/seventh/key/openlayers.html'
    });
	


	var bartgreatbritain = new ol.layer.Tile({
	title: "Great Britain - Bartholomew Half Inch, 1897-1907",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata2/bartholomew/great_britain/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        group_no: '50',
        mosaic_id: '156',
        type: 'overlay', 
        visible: false,
	keytext: 'View the individual sheets of this Bartholomew half-inch mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/mapdata2/bartholomew/key/openlayers.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/mapmakers/bartholomew.html" target="_blank">Bartholomew Maps</a> home page',
        minx: -7.68, 
	miny: 49.8,
        maxx: 1.77, 
        maxy: 60.9
    });
	
	var bartsurveyatlas = new ol.layer.Tile({
	title: "Scotland - Bartholomew Survey Atlas, 1912",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata2/bartholomew/survey_atlas/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        group_no: '8',
        mosaic_id: '7',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/mapdata2/bartholomew/key/openlayers.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/atlas/bartholomew/index.html" target="_blank">Bartholomew Survey Atlas, 1912</a> home page',
        minx: -8.4, 
        miny: 54.5, 
        maxx: -0.6, 
        maxy: 60.9         
    });

	
	var barthalfinch = new ol.layer.Tile({
	title: "Scotland - Bartholomew Half-Inch, 1926-1935",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata2/bartholomew/half/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        group_no: '45',
        mosaic_id: '8',
        type: 'overlay', 
        visible: false,
	keytext: 'View the individual sheets of this Bartholomew half-inch mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/mapdata2/bartholomew/key/openlayers.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/series/bart_scotland_halfinch_list.html" target="_blank">Bartholomew Half-Inch, 1926-1935</a> home page',
        minx: -8.4, 
        miny: 54.5, 
        maxx: -0.6, 
        maxy: 60.9
    });


 	var twentyfivethousandscot = new ol.layer.Tile({
	title: "Scotland - OS 1:25,000, 1937-61",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata2/os/25000/{z}/{x}/{-y}.png",
				minZoom: 10,
				maxZoom: 16
		  }),
        group_no: '32',
        mosaic_id: '10',
        type: 'overlay', 
        visible: false,
        minx: -7.68, 
	miny: 49.8,
        maxx: 1.77, 
        maxy: 60.4,
	keytext: 'View the individual sheets of this OS 1:25,000 mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/mapdata2/os/25000/key/openlayers.html'        
    });


 	var twentyfivethousand = new ol.layer.Tile({
	title: "Great Britain - OS 1:25,000, 1937-61",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata2/os/25000/{z}/{x}/{-y}.png",
				minZoom: 10,
				maxZoom: 16
		  }),
        group_no: '32',
        mosaic_id: '10',
        type: 'overlay', 
        visible: false,
        minx: -7.68, 
	miny: 49.8,
        maxx: 1.77, 
        maxy: 60.4,
	keytext: 'View the individual sheets of this OS 1:25,000 mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/mapdata2/os/25000/key/openlayers.html'
    });


    var airphotos = new ol.layer.Tile({
	title: "Scotland - Air Photos, 1944-1950",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/air-photos/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        group_no: '31',
        mosaic_id: '9',
        type: 'overlay', 
        visible: false,
	keytext: 'View the individual OS air photos by selecting "Find by place" above',
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/os/air-photos/" target="_blank">Air Photo Mosaics, 1944-1950</a> home page',
        
        minx: -7.25110940799, 
        miny: 54.6068516052, 
        maxx: -0.441084986485, 
        maxy: 57.6147021742 
    });


    var quarterinch = new ol.layer.Tile({
	title: "Scotland - OS Quarter Inch, 1921-1923",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/quarter/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 12
		  }),
        group_no: '43',
        mosaic_id: '165',
        type: 'overlay', 
        visible: false,
        minx: -8.8, 
        miny: 54.5, 
        maxx: -1.4, 
        maxy: 60.9,
	keytext: 'View the individual sheets of this OS quarter-inch mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/os/quarter-inch/index.html" target="_blank">OS Quarter Inch edition</a> home page'
    });



	
	var bathlochawenorth = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Awe North [1902]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_awe_north/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        group_no: '12',
        mosaic_id: '15',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -5.34, 
        miny: 56.23, 
        maxx: -4.88, 
        maxy: 56.48
	});


	var bathlochawesouth = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Awe South [1902]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_awe_south/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        group_no: '12',
        mosaic_id: '16',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -5.55, 
        miny: 56.09, 
        maxx: -5.10, 
        maxy: 56.34
	});



	var bathlochcluanie = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Cluanie [1902]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_cluanie/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        group_no: '12',
        mosaic_id: '17',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -5.15, 
        miny: 57.11, 
        maxx: -4.97, 
        maxy: 57.16
	});



	var bathlochdoon = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Doon [1903]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_doon/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '18',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -4.42, 
        miny: 55.20, 
        maxx: -4.33, 
        maxy: 55.29
	});


	var bathlochduntelchaig = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Duntelchaig, 1903",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_duntelchaig/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '19',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -4.41, 
        miny: 57.29, 
        maxx: -4.17, 
        maxy: 57.40
	});


	var bathlochearn = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Earn, 1902",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_earn/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '20',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -4.30, 
        miny: 56.35, 
        maxx: -4.08, 
        maxy: 56.41
	});



var bathlocherichtlower = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Ericht (Lower), 1900",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_ericht_lower/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '21',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -4.52, 
        miny: 56.72, 
        maxx: -4.32, 
        maxy: 56.85
});


var bathlocherichtupper = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Ericht (Upper), 1900",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_ericht_upper/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '22',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -4.41, 
        miny: 56.81, 
        maxx: -4.21, 
        maxy: 56.94
});


var bathlochfannich = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Fannich, 1902",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_fannich/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '23',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -5.10, 
        miny: 57.61, 
        maxx: -4.88, 
        maxy: 57.67
});



var bathlochgarryness = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Garry (Ness), 1903",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_garry_ness/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '24',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -5.00, 
        miny: 57.04, 
        maxx: -4.81, 
        maxy: 57.10
});



var bathlochgarrytay = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Garry (Tay), 1903",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_garry_tay/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '25',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -4.28, 
        miny: 56.77, 
        maxx: -4.20, 
        maxy: 56.82
});



var bathlochglass = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Glass, 1902",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_glass/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '26',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -4.58, 
        miny: 57.67, 
        maxx: -4.41, 
        maxy: 57.75
});


var bathlochharray = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Harray, 1906",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_harray/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 14,
        group_no: '12',
        mosaic_id: '27',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -3.31, 
        miny: 58.94, 
        maxx: -3.18, 
        maxy: 59.10
});



var bathlochlaidon = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Laidon, 1902",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_laidon/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '28',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -4.73, 
        miny: 56.61, 
        maxx: -4.54, 
        maxy: 56.71
});



var bathlochleven = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Leven, 1900",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_leven/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '29',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -3.43, 
        miny: 56.17, 
        maxx: -3.31, 
        maxy: 56.23
});



var bathlochlomondnorth = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Lomond (North), 1903",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_lomond_north/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '30',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -4.88, 
        miny: 56.12, 
        maxx: -4.51, 
        maxy: 56.36
});



var bathlochlomondsouth = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Lomond (South), 1903",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_lomond_south/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15

		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '31',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -4.76, 
        miny: 55.96, 
        maxx: -4.42, 
        maxy: 56.18
});




var bathlochloyne = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Loyne, 1903-04",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_loyne/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '32',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -5.10, 
        miny: 57.07, 
        maxx: -4.95, 
        maxy: 57.13
});




var bathlochluichart = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Luichart, 1902",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_luichart/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        mosaic_id: '33',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -4.84, 
        miny: 57.56, 
        maxx: -4.64, 
        maxy: 57.65
});




var bathlochlyon = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Lyon, 1902",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_lyon/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '34',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -4.64, 
        miny: 56.50, 
        maxx: -4.56, 
        maxy: 56.55
});




var bathlochmhor = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Mhor, 1903",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_mhor/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '35',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -4.51, 
        miny: 57.20, 
        maxx: -4.32, 
        maxy: 57.30
});





var bathlochmonar = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Monar, 1903",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_monar/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '36',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -5.15, 
        miny: 57.39, 
        maxx: -4.98, 
        maxy: 57.45
});


var bathlochmullardoch = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Mullardoch, 1903",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_mullardoch/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '37',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -5.07, 
        miny: 57.30, 
        maxx: -4.91, 
        maxy: 57.35
});


var bathlochquoich = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Quoich, 1903",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_quoich/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '38',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -5.38, 
        miny: 57.03, 
        maxx: -5.17, 
        maxy: 57.09
});


var bathlochrannoch = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Rannoch, 1903",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_rannoch/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '39',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -4.45, 
        miny: 56.66, 
        maxx: -4.16, 
        maxy: 56.71
});


var bathlochshiellower = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Shiel (Lower), 1902",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_shiel_lower/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '40',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -5.84, 
        miny: 56.68, 
        maxx: -5.54, 
        maxy: 56.82
});



var bathlochshielupper = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Shiel (Upper), 1902",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_shiel_upper/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        group_no: '12',
        mosaic_id: '41',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -5.66, 
        miny: 56.74, 
        maxx: -5.33, 
        maxy: 56.89
});


var bathlochshinlower = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Shin (Lower), 1902",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_shin_lower/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        group_no: '12',
        mosaic_id: '42',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -4.61, 
        miny: 57.98, 
        maxx: -4.33, 
        maxy: 58.13
});





var bathlochshinupper = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Shin (Upper), 1902",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_shin_upper/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '43',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -4.79, 
        miny: 58.07, 
        maxx: -4.51, 
        maxy: 58.22
});


var bathlochtayeast = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Tay (East), 1902",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_tay_east/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '44',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -4.19, 
        miny: 56.49, 
        maxx: -3.94, 
        maxy: 56.62
});



var bathlochtaywest = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Tay (West), 1902",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_tay_west/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '45',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -4.34, 
        miny: 56.42, 
        maxx: -4.09, 
        maxy: 56.55
});


var bathlochtreig = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Treig, 1902",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_treig/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '46',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -4.79, 
        miny: 56.75, 
        maxx: -4.65, 
        maxy: 56.87
});



var bathlochtummel = new ol.layer.Tile({
	title: "Scotland, Bathymetrical Charts - Loch Tummel, 1902",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/bathymetric/loch_tummel/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '12',
        mosaic_id: '47',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/bathymetric/index.html" target="_blank">Bathymetrical Survey</a> home page', 
        minx: -3.97, 
        miny: 56.68, 
        maxx: -3.84, 
        maxy: 56.73
});

 

    var aberdeen = new ol.layer.Tile({
	title: "Scotland, Town Plans - Aberdeen, OS [1866-7]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/aberdeen/{z}/{x}/{-y}.png",
				minZoom: 13,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '48',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -2.14064757623, 
        miny: 57.1121879214, 
        maxx: -2.04493826365, 
        maxy: 57.179012493       
    });



    var airdrie = new ol.layer.Tile({
	title: "Scotland, Town Plans - Airdrie, OS [1858]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/airdrie/{z}/{x}/{-y}.png",
				minZoom: 13,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '49',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page',     
	minx: -3.99338938046, 
        miny: 55.8640802967, 
        maxx: -3.9686429192, 
        maxy: 55.8736820863
    });


    var alexandria = new ol.layer.Tile({
	title: "Scotland, Town Plans - Alexandria, OS [1859]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/alexandria/{z}/{x}/{-y}.png",
				minZoom: 13,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '50',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -4.59104466569, 
        miny: 55.9753667346, 
        maxx: -4.55855810804, 
        maxy: 55.9955834505
    });


    var alloa = new ol.layer.Tile({
	title: "Scotland, Town Plans - Alloa, OS [1861-2]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/alloa/{z}/{x}/{-y}.png",
				minZoom: 13,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '51',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.81274453388, 
        miny: 56.098643705, 
        maxx: -3.77939691734, 
        maxy: 56.1221689482
    });


    var annan = new ol.layer.Tile({
	title: "Scotland, Town Plans - Annan, OS [1859]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/annan/{z}/{x}/{-y}.png",
				minZoom: 13,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '52',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.27960066623,
        miny:  54.9825213036,
        maxx:  -3.24828655521,
        maxy:  54.9949816233
    });


var arbroath = new ol.layer.Tile({
	title: "Scotland, Town Plans - Arbroath, OS [1858]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/arbroath/{z}/{x}/{-y}.png",
				minZoom: 13,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '53',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page',
        minx: -2.60764986877,
        miny:  56.539950796,
        maxx:  -2.56453587342,
        maxy:  56.5704254645
    });


var ayr = new ol.layer.Tile({
	title: "Scotland, Town Plans - Ayr, OS [1855]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/ayr/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '54',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -4.6708006238,
        miny: 55.4374882994,
        maxx: -4.60305481147,
        maxy: 55.4850348095
});


var berwick = new ol.layer.Tile({
	title: "Scotland, Town Plans - Berwick, OS [1852]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/berwick/{z}/{x}/{-y}.png",
				minZoom: 13,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '55',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -2.02118768749,
        miny: 55.7557760657,
        maxx: -1.98976925561,
        maxy: 55.7790430226
});


var brechin = new ol.layer.Tile({
	title: "Scotland, Town Plans - Brechin, OS [1852]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/brechin/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '56',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -2.6752117735,
        miny: 56.7145677618,
        maxx: -2.64280660902,
        maxy: 56.7375686882
});


var burntisland = new ol.layer.Tile({
	title: "Scotland, Town Plans - Burntisland, OS [1894]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/burntisland/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '57',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.24951825172,
        miny: 56.0424002226,
        maxx: -3.21760152094,
        maxy: 56.0650420349
});


var campbeltown = new ol.layer.Tile({
	title: "Scotland, Town Plans - Campbeltown, OS [1865]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/campbeltown/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '58',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -5.62631358601,
        miny: 55.4025597034,
        maxx: -5.57994013334,
        maxy: 55.4350375003

});


var coatbridge = new ol.layer.Tile({
	title: "Scotland, Town Plans - Coatbridge, OS [1858]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/coatbridge/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '59',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -4.05157067587,
        miny:  55.8464868654,
        maxx:  -4.01834707987,
        maxy:  55.870001833
});


var cupar1854 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Cupar, OS [1854]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/cupar1854/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '60',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.04890970636,
        miny:  56.2865314722,
        maxx:  -2.98381065965,
        maxy:  56.332716739
});




var cupar1893 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Cupar, OS [1893]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/cupar1893/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '61',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.03338448768,
        miny:  56.3024368374,
        maxx:  -3.0008701969,
        maxy:  56.3254635312


});


var dalkeith1852 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Dalkeith, OS [1852]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/dalkeith1852/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '62',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.07903815297,
        miny:  55.8890028197,
        maxx:  -3.05795081929,
        maxy:  55.9040767803
});


var dalkeith1893 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Dalkeith, OS [1893]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/dalkeith1893/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '63',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.08658593571,
        miny:  55.8793611491,
        maxx:  -3.04308634871,
        maxy:  55.9006307094
});


var dumbarton = new ol.layer.Tile({
	title: "Scotland, Town Plans - Dumbarton, OS [1859]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/dumbarton/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '64',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -4.58714250581,
        miny:  55.9274258006,
        maxx:  -4.55310961398,
        maxy:  55.9512387849
});


var dumfries1850 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Dumfries, OS [1850]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/dumfries1850/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '65',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.64116357596,
        miny:  55.0371596363,
        maxx:  -3.57642150365,
        maxy:  55.0840219905
});


var dumfries1893 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Dumfries, OS [1893]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/dumfries1893/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '66',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.63330667223,
        miny:  55.0415010659,
        maxx:  -3.58112105989,
        maxy:  55.079404078
});


var dundee1857 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Dundee, OS [1857]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/dundee1857/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '67',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.02656974554,
        miny:  56.4487917066,
        maxx:  -2.94643402056,
        maxy:  56.4762998097
});


var dundee1870 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Dundee, OS [1870]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/dundee1870/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '68',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.03497468194,
        miny:  56.4484970974,
        maxx:  -2.92265732155,
        maxy:  56.4852313436
});


var dunfermline1854 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Dunfermline, OS [1854]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/dunfermline1854/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '69',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.49116494089,
        miny:  56.0605976694,
        maxx:  -3.44305287259,
        maxy:  56.0795520478
});


var dunfermline1893 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Dunfermline, OS [1893]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/dunfermline1893/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '70',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.48399439808,
        miny:  56.0519822762,
        maxx:  -3.4409774452,
        maxy:  56.0824858388
});


 

var elgin = new ol.layer.Tile({
	title: "Scotland, Town Plans - Elgin, OS [1868]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/elgin/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '74',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.33776588691,
        miny:  57.6287899887,
        maxx:  -3.29273170899,
        maxy:  57.6595310856
});

var falkirk = new ol.layer.Tile({
	title: "Scotland, Town Plans - Falkirk, OS [1858]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/falkirk/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '75',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.79697788109,
        miny:  55.9934312659,
        maxx:  -3.76539705789,
        maxy: 56.017643446
});



var forfar = new ol.layer.Tile({
	title: "Scotland, Town Plans - Forfar, OS [1860]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/forfar/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '76',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -2.90378802696,
        miny:  56.6289469624,
        maxx:  -2.87177703548,
        maxy:  56.6511748641
});


var forres = new ol.layer.Tile({
	title: "Scotland, Town Plans - Forres , OS [1868]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/forres/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '77',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.63647643047,
        miny:  57.588878584,
        maxx:  -3.57625291115,
        maxy:  57.6187516804
});


var galashiels = new ol.layer.Tile({
	title: "Scotland, Town Plans - Galashiels, OS [1858]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/galashiels/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '78',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -2.82981277944,
        miny: 55.5958630311,
        maxx: -2.78835636279,
        maxy: 55.6258098946
});

  
var girvan = new ol.layer.Tile({
	title: "Scotland, Town Plans - Girvan, OS [1857]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/girvan/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '79',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -4.87587900296,
        miny:  55.2267973715,
        maxx:  -4.84285563349,
        maxy:  55.2501959425
});




var greenock = new ol.layer.Tile({
	title: "Scotland, Town Plans - Greenock, OS [1857]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/greenock/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '82',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -4.78382962654, 
        miny: 55.9261788475, 
        maxx: -4.72753763266, 
        maxy: 55.9655747154
});


var haddington1853 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Haddington, OS [1853]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/haddington1853/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '83',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -2.78888200919, 
        miny: 55.9451864517, 
        maxx: -2.76642590165, 
        maxy: 55.9613816693
});

var haddington1893 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Haddington, OS [1893]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/haddington1893/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '84',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -2.8021469876, 
        miny: 55.9342874722, 
        maxx: -2.75978915771, 
        maxy: 55.9647366688
});


var hamilton = new ol.layer.Tile({
	title: "Scotland, Town Plans - Hamilton, OS [1858]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/hamilton/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '85',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -4.06233208174,  
        miny: 55.7683249332,
        maxx: -4.02185975263, 
        maxy: 55.7840776034
});


var hawick = new ol.layer.Tile({
	title: "Scotland, Town Plans - Hawick, OS [1857-8]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/hawick/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '86',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -2.79808977222, 
        miny: 55.4160978694, 
        maxx: -2.77411782495, 
        maxy: 55.431137811
});


var irvine = new ol.layer.Tile({
	title: "Scotland, Town Plans - Irvine, OS [1859]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/irvine/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '87',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -4.67643257053,
        miny: 55.6064993409, 
        maxx: -4.65435796088, 
        maxy: 55.6220480868
});

 
var inverness = new ol.layer.Tile({
	title: "Scotland, Town Plans - Inverness, OS [1867-8]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/inverness/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '88',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -4.25752314036,  
        miny: 57.4591637142,
        maxx: -4.19450301104, 
        maxy: 57.5040902886
});


var jedburgh = new ol.layer.Tile({
	title: "Scotland, Town Plans - Jedburgh, OS [1858]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/jedburgh/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '89',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -2.56355507946,
        miny: 55.4710546667, 
        maxx: -2.54146125252, 
        maxy: 55.4872543459
});

 
var kelso = new ol.layer.Tile({
	title: "Scotland, Town Plans - Kelso, OS [1857]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/kelso/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '90',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -2.4494976215, 
        miny: 55.5839085111, 
        maxx: -2.41878614555, 
        maxy: 55.6060661421
});


var kilmarnock = new ol.layer.Tile({
	title: "Scotland, Town Plans - Kilmarnock, OS [1857-9]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/kilmarnock/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '91',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -4.51943475604, 
        miny: 55.5895095144, 
        maxx: -4.47482380324, 
        maxy: 55.6210407935
});


var kirkcaldy1855 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Kirkcaldy, OS [1855]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/kirkcaldy1855/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '92',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.17555000877, 
        miny: 56.0951893949, 
        maxx: -3.12895515209, 
        maxy: 56.1283283979
});


var kirkcaldy1894 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Kirkcaldy, OS [1894]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/kirkcaldy1894/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '93',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.16933794263, 
        miny: 56.0941779658, 
        maxx: -3.12826251921, 
        maxy: 56.1268571569
});


var kirkcudbright1850 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Kirkcudbright, OS [1850]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/kirkcudbright1850/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '94',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -4.06230815294, 
        miny: 54.8258632393, 
        maxx: -4.04126461332, 
        maxy: 54.8412036076
});


var kirkcudbright1893 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Kirkcudbright, OS [1893]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/kirkcudbright1893/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '93',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -4.06079040822,
        miny: 54.8272010424, 
        maxx: -4.03948653049,
        maxy: 54.8426915439
});


var kirkintilloch = new ol.layer.Tile({
	title: "Scotland, Town Plans - Kirkintilloch, OS [1859]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/kirkintilloch/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '96',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -4.16748407565,
        miny: 55.9312425277, 
        maxx: -4.14553991282, 
        maxy: 55.946682322
});

 
var kirriemuir = new ol.layer.Tile({
	title: "Scotland, Town Plans - Kirriemuir, OS [1861]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/kirriemuir/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '97',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.01302688483, 
        miny: 56.6589605575, 
        maxx: -2.9877013391, 
        maxy: 56.6766536262
});


var lanark = new ol.layer.Tile({
	title: "Scotland, Town Plans - Lanark, OS [1858]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/lanark/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '98',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.78710610364, 
        miny: 55.6630877033, 
        maxx: -3.76565668745, 
        maxy: 55.6783093184
});


var linlithgow = new ol.layer.Tile({
	title: "Scotland, Town Plans - Linlithgow, OS [1856]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/linlithgow/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '99',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.62033264042, 
        miny: 55.9554953619, 
        maxx: -3.57716795802, 
        maxy: 55.9859304394
});


var maybole = new ol.layer.Tile({
	title: "Scotland, Town Plans - Maybole, OS [1856-7]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/maybole/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '100',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -4.69188845469, 
        miny: 55.3434015263, 
        maxx: -4.66987967851, 
        maxy: 55.3589580992
});


var montrose = new ol.layer.Tile({
	title: "Scotland, Town Plans - Montrose, OS [1861-2]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/montrose/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '101',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -2.48622575227, 
        miny: 56.6964521539, 
        maxx: -2.45378021931, 
        maxy: 56.7193093768
});


var musselburgh1853 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Musselburgh, OS [1853]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/musselburgh1853/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '102',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.07954156669, 
        miny: 55.9337193231, 
        maxx: -3.03177968613, 
        maxy: 55.9577017418
});  

var musselburgh1893 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Musselburgh, OS [1893]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/musselburgh1893/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '103',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.07078966005, 
        miny: 55.9269412253, 
        maxx: -3.03928695146, 
        maxy: 55.9494409643
});


var nairn = new ol.layer.Tile({
	title: "Scotland, Town Plans - Nairn, OS [1867-8]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/nairn/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '104',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.88508499917, 
        miny: 57.5789593668, 
        maxx: -3.85863893639, 
        maxy: 57.5941314195
});


var oban = new ol.layer.Tile({
	title: "Scotland, Town Plans - Oban, OS [1867-8]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/oban/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '105',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -5.49836632381, 
        miny: 56.3908041671, 
        maxx: -5.45099436167, 
        maxy: 56.4234392957
});


var paisley = new ol.layer.Tile({
	title: "Scotland, Town Plans - Paisley, OS [1858]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/paisley/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '106',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -4.46105990416, 
        miny: 55.8124741092, 
        maxx: -4.39412479599, 
        maxy: 55.8595282899
});


var peebles = new ol.layer.Tile({
	title: "Scotland, Town Plans - Peebles, OS [1856]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/peebles/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '107',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.20990293086,
        miny: 55.6363583093,
        maxx: -3.17829091157, 
        maxy: 55.6590393156
});



var peterhead = new ol.layer.Tile({
	title: "Scotland, Town Plans - Peterhead, OS [1868]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/peterhead/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '109',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -1.80513753049, 
        miny: 57.4803752492, 
        maxx: -1.7513536841, 
        maxy: 57.5175540795
});


var portobello = new ol.layer.Tile({
	title: "Scotland, Town Plans - Portobello, OS [1893-4]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/portobello/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '110',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.12502345874, 
        miny: 55.938468932, 
        maxx: -3.09332217028, 
        maxy: 55.9609658309
});

var portglasgow = new ol.layer.Tile({
	title: "Scotland, Town Plans - Port Glasgow, OS [1856-7]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/portglasgow/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '111',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -4.70222031764, 
        miny: 55.9199599666, 
        maxx: -4.66927996593, 
        maxy: 55.9434523372
});


var rothesay = new ol.layer.Tile({
	title: "Scotland, Town Plans - Rothesay, OS [1862-3]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/rothesay/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '112',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -5.06569724636,
        miny: 55.8286408729, 
        maxx: -5.04294187948, 
        maxy: 55.8443951609
});

 
var standrews1854 = new ol.layer.Tile({
	title: "Scotland, Town Plans - St Andrews, OS [1854]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/standrews1854/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '113',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -2.81405809426,
        miny: 56.3209732255, 
        maxx: -2.7718379028, 
        maxy: 56.3508886181
});

 
var standrews1893 = new ol.layer.Tile({
	title: "Scotland, Town Plans - St Andrews, OS [1894]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/standrews1893/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '114',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -2.81609924811, 
        miny: 56.3186173771, 
        maxx: -2.77326805114, 
        maxy: 56.3490361645
});


var selkirk = new ol.layer.Tile({
	title: "Scotland, Town Plans - Selkirk, OS [1865]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/selkirk/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '115',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -2.86063264041, 
        miny: 55.5349956287, 
        maxx: -2.81941606523, 
        maxy: 55.5648757061
});


var stirling = new ol.layer.Tile({
	title: "Scotland, Town Plans - Stirling, OS [1858]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/stirling/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '116',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.95882983686,
        miny: 56.1075426483,
        maxx: -3.92598357192,
        maxy: 56.1305704339
});

   
var stonehaven = new ol.layer.Tile({
	title: "Scotland, Town Plans - Stonehaven, OS [1864]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/stonehaven/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '117',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -2.22025435506, 
        miny: 56.9565096472, 
        maxx: -2.1991654923, 
        maxy: 56.9713280682
});


var stranraer1847 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Stranraer, OS [1847]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/stranraer1847/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '118',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -5.05089544864, 
        miny: 54.8822997778, 
        maxx: -5.00726991044, 
        maxy: 54.9137127482
});

var stranraer1867 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Stranraer, OS [1867]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/stranraer1867/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '119',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -5.05107328969, 
        miny: 54.8822871793, 
        maxx: -5.00720437202, 
        maxy: 54.9137357911
});

var stranraer1893 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Stranraer, OS [1893]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/stranraer1893/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '120',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -5.04511030784, 
        miny: 54.8977387627, 
        maxx: -5.01313378941, 
        maxy: 54.9107738553
});


var strathaven = new ol.layer.Tile({
	title: "Scotland, Town Plans - Strathaven, OS [1893]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/strathaven/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '154',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -4.06954362395, 
        miny: 55.6724208059, 
        maxx: -4.05878173364, 
        maxy: 55.6800714657
});


var wick = new ol.layer.Tile({
	title: "Scotland, Town Plans - Wick, OS [1872]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/wick/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '121',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.10837930522, 
        miny: 58.4327756072, 
        maxx: -3.06567145322, 
        maxy: 58.447997853
});


var wigtown1848 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Wigtown, OS [1848]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/wigtown1848/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '122',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -4.45327289058, 
        miny: 54.8572293158, 
        maxx: -4.43163577492, 
        maxy: 54.8727431362
});


var wigtown1894 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Wigtown, OS [1894]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/wigtown1894/{z}/{x}/{-y}.png",
				minZoom: 14,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '123',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -4.45325428333, 
        miny: 54.8572111382, 
        maxx: -4.43166504522, 
        maxy: 54.8727841242
});





var edin1765 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Edgar, 1765",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/74400010/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '2',
        mosaic_id: '124',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>', 
        minx: -3.204, 
        miny: 55.944, 
        maxx: -3.168, 
        maxy: 55.956
});





var edin1784 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Kincaid, 1784",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/74400071/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        group_no: '2',
        mosaic_id: '125',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>', 
        minx: -3.214, 
        miny: 55.935, 
        maxx: -3.170, 
        maxy: 55.960
});



var edin1804 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Ainslie, 1804",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/74400072/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '2',
        mosaic_id: '126',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>', 
        minx: -3.218, 
        miny: 55.937, 
        maxx: -3.157, 
        maxy: 55.983
});

var edin1817 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Kirkwood, 1817",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/74400073-4/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '2',
        mosaic_id: '127',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>', 
        minx: -3.231, 
        miny: 55.924, 
        maxx: -3.123, 
        maxy: 55.991
});



var edin1821 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Kirkwood, 1821",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/74401133/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '2',
        mosaic_id: '128',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>', 
        minx: -3.216, 
        miny: 55.937, 
        maxx: -3.158, 
        maxy: 55.961
});



var edin1831 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Wood, 1831",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/74400027/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '2',
        mosaic_id: '129',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>', 
        minx: -3.217, 
        miny: 55.940, 
        maxx: -3.170, 
        maxy: 55.961
});


var edin1832 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Great Reform Act, 1832",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/74491845/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        group_no: '2',
        mosaic_id: '130',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>', 
        minx: -3.245, 
        miny: 55.923, 
        maxx: -3.124, 
        maxy: 55.989
});



var edin1849 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, OS [1849]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/edinburgh1849/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 22
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '71',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.23836402347,
        miny: 55.9213663008,
        maxx: -3.1398868214,
        maxy: 55.9931028532
});


var edin1865 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Bart PO, 1865",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/77775504/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        group_no: '2',
        mosaic_id: '132',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>', 
        minx: -3.246, 
        miny: 55.921, 
        maxx: -3.137, 
        maxy: 55.992
});



var edin1876 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, OS [1876]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/edinburgh1876/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 22
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '72',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.24989585975,
        miny: 55.9211654234,
        maxx: -3.12835862947,
        maxy: 55.9996605632
});



var edin1882 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Bart PO, 1882",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/90719488/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        group_no: '2',
        mosaic_id: '134',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>', 
        minx: -3.268,
        miny: 55.909, 
        maxx: -3.131, 
        maxy: 55.995
});


var edin1888 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Bart PO, 1888",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/90719488/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '2',
        mosaic_id: '135',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>', 
        minx: -3.262, 
        miny: 55.915, 
        maxx: -3.136, 
        maxy: 55.990
});


var edin1891 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Bartholomew, 1891",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/95751931/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        group_no: '2',
        mosaic_id: '136',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>', 
        minx: -3.248, 
        miny: 55.918, 
        maxx: -3.136, 
        maxy: 55.994
});


var edin1892 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Bart PO, 1891-2",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/90719479/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '2',
        mosaic_id: '137',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>', 
        minx: -3.265, 
        miny: 55.904, 
        maxx: -3.136, 
        maxy: 55.993
});



var edin1892b = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Bart PO, 1893-4",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/83546578/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '2',
        mosaic_id: '136',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>', 
        minx: -3.265, 
        miny: 55.904, 
        maxx: -3.138, 
        maxy: 55.993
});




var edin1893 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, OS [1893]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/edinburgh1893/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '73',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.26450428851,
        miny:  55.8955536443,
        maxx:  -3.11670255845,
        maxy:  56.0011912533
});



var edin1902 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Bart PO, 1902",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/90719482/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '2',
        mosaic_id: '140',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>', 
        minx: -3.284, 
        miny: 55.901, 
        maxx: -3.062, 
        maxy: 55.996
});


var edin1905 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Johnston PO, 1905-6",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/90719482/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        group_no: '2',
        mosaic_id: '141',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>', 
        minx: -3.284, 
        miny: 55.906, 
        maxx: -3.065, 
        maxy: 55.995
});



var edin1907 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Bart PO, 1907",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/90719485/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '2',
        mosaic_id: '142',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>', 
        minx: -3.282, 
        miny: 55.903, 
        maxx: -3.065, 
        maxy: 55.995
});


var edin1910 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Johnston PO, 1910",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/90721362/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '2',
        mosaic_id: '143',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>', 
        minx: -3.280, 
        miny: 55.906, 
        maxx: -3.067, 
        maxy: 55.993
});

var edin1912 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Bart Survey Atlas, 1912",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/74400474/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 17,
        group_no: '2',
        mosaic_id: '144',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>', 
        minx: -3.271, 
        miny: 55.911, 
        maxx: -3.083, 
        maxy: 55.993
});


var edin1917 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Bart PO, 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/90721368/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '2',
        mosaic_id: '145',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>', 
        minx: -3.282, 
        miny: 55.904, 
        maxx: -3.067, 
        maxy: 55.995
});
 

var edin1918 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Bart PO, 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/103247211/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 17,
        group_no: '2',
        mosaic_id: '103247211',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: '', 
        minx: -3.2807, 
        miny: 55.9053, 
        maxx: -3.0689, 
        maxy: 55.9931
});

var edin1932 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Bart PO, 1932-3",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/90720679/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '2',
        mosaic_id: '146',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>', 
        minx: -3.298, 
        miny: 55.895, 
        maxx: -3.070, 
        maxy: 56.001
});


var edin1939 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Bart PO, 1939-40",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/82833386/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '2',
        mosaic_id: '147',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>', 
        minx: -3.298, 
        miny: 55.895, 
        maxx: -3.071, 
        maxy: 56.001
});



var edin1944 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, Air Photos, 1944-1950",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/air-photos/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '31',
        mosaic_id: '148',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/os/air-photos/" target="_blank">Air Photo Mosaics, 1944-1950</a> home page',
        minx: -3.298, 
        miny: 55.895, 
        maxx: -3.071, 
        maxy: 56.001       
    });


var edin1944_1963 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Edinburgh, OS 1:1,250, 1944-63",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/os/edinburgh_1250_out/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 21
		  }),
        //numZoomLevels: 20,
        group_no: '61',
        mosaic_id: '170',
        type: 'overlay', 
        visible: false,
	keytext: 'View the individual sheets of this OS large-scale mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/mapdata3/os/1250_key/openlayers.html',
        attribution: '',
        minx: -3.3192, 
        miny: 55.8149, 
        maxx: -2.9892, 
        maxy: 55.9952       
    });


var glas1857 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Glasgow, OS [1857]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/glasgow1857/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '2',
        group_no: '41',
        mosaic_id: '80',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -4.31968305203, 
        miny: 55.8207204183, 
        maxx: -4.17344497705, 
        maxy: 55.8892807786
});



var glas1882 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Glasgow, Bart PO, 1882",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/90721371/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '2',
        mosaic_id: '150',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>',
        minx: -4.331, 
        miny: 55.821, 
        maxx: -4.169, 
        maxy: 55.895       
    });



var glas1888 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Glasgow, Bart PO, 1888",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/glasgow_1888/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '2',
        mosaic_id: '151',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>',
        minx: -4.336, 
        miny: 55.815, 
        maxx: -4.177, 
        maxy: 55.892       
    });


var glas1891 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Glasgow, Bart PO, 1891",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/urbhist/glasgow_1888/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '2',
        mosaic_id: '152',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by <a href="http://geo.nls.uk/urbhist/resources.html" target="_blank">Visualising Urban Geographies</a>',
        minx: -4.369, 
        miny: 55.804, 
        maxx: -4.158, 
        maxy: 55.916       
    });




var glas1894 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Glasgow, OS [1892-4]",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/glasgow1894/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '81',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -4.35157651552, 
        miny: 55.8145622058, 
        maxx: -4.1732180657, 
        maxy: 55.9012586677
});


var perth1716 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Perth, Petit, 1716",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/perth/2976/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '2',
        mosaic_id: '155',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by Michal Michalski', 
        minx: -3.453, 
        miny: 56.381, 
        maxx: -3.406, 
        maxy: 56.411
});


var perth1783 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Perth, Stobie, 1783",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/perth/74400315/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '2',
        mosaic_id: '74400315',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by Michal Michalski', 
        minx: -3.440, 
        miny: 56.390, 
        maxx: -3.420, 
        maxy: 56.401
});


var perth1823 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Perth, Wood, 1823",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/perth/74400053/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '2',
        mosaic_id: '74400053',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by Michal Michalski', 
        minx: -3.453, 
        miny: 56.381, 
        maxx: -3.406, 
        maxy: 56.411
});



var perth1827 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Perth, Thomson, 1827",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/perth/74400163/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '2',
        mosaic_id: '74400163',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by Michal Michalski', 
        minx: -3.440, 
        miny: 56.390, 
        maxx: -3.420, 
        maxy: 56.402
});



var perth1832 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Perth, Reform Act, 1832",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/perth/74491926/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        group_no: '2',
        mosaic_id: '74491926',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by Michal Michalski', 
        minx: -3.488, 
        miny: 56.369, 
        maxx: -3.388, 
        maxy: 56.424
});


var perth1860 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Perth, OS 1:2,500, 1860",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/perth/74479254/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        group_no: '2',
        mosaic_id: '74479254',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by Michal Michalski', 
        minx: -3.456, 
        miny: 56.387, 
        maxx: -3.416, 
        maxy: 56.402
});


var perth1860b = new ol.layer.Tile({
	title: "Scotland, Town Plans - Perth, OS 1:500, 1860",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/towns/perth/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 20
		  }),
        numZoomLevels: 22,
        group_no: '41',
        mosaic_id: '108',
        type: 'overlay', 
        visible: false,
        key: 'maps.nls.uk/townplans/symbols.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/townplans/index.html" target="_blank">Ordnance Survey Town Plans, 1847-1895</a> home page', 
        minx: -3.45416669547, 
        miny: 56.3779424162, 
        maxx: -3.41076671142, 
        maxy: 56.4083877384
});



var perth1893 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Perth, Leslie, 1893",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/perth/97145793/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        group_no: '2',
        mosaic_id: '97145793',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by Michal Michalski', 
        minx: -3.463, 
        miny: 56.377, 
        maxx: -3.404, 
        maxy: 56.411
});



var perth1895 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Perth, Leslie, 1895",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/perth/97145795/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        group_no: '2',
        mosaic_id: '97145795',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by Michal Michalski', 
        minx: -3.463, 
        miny: 56.377, 
        maxx: -3.404, 
        maxy: 56.411
});


var perth1901 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Perth, Leslie, 1901",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/perth/97145798/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        group_no: '2',
        mosaic_id: '97145798',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by Michal Michalski', 
        minx: -3.463,
        miny: 56.377, 
        maxx: -3.404, 
        maxy: 56.411
});



var perth1902 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Perth, OS, 1:10,560, 1902",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/perth/75655778/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        group_no: '36',
        mosaic_id: '75655778',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by Michal Michalski', 
        minx: -3.457, 
        miny: 56.386, 
        maxx: -3.376, 
        maxy: 56.417
});


var perth1907 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Perth, Leslie, 1907",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/perth/97145804/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        group_no: '2',
        mosaic_id: '97145804',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by Michal Michalski', 
        minx: -3.464, 
        miny: 56.377, 
        maxx: -3.404, 
        maxy: 56.412
});


var perth1912 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Perth, Bartholomew, 1912",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/perth/78055336/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        group_no: '8',
        mosaic_id: '78055336',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by Michal Michalski', 
        minx: -3.451, 
        miny: 56.375, 
        maxx: -3.410, 
        maxy: 56.413
});



var perth1933 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Perth, OS 1:10,560, 1933",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/perth/75655775/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        group_no: '36',
        mosaic_id: '75655775',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by Michal Michalski', 
        minx: -3.457, 
        miny: 56.386, 
        maxx: -3.376, 
        maxy: 56.417
});



var perth1948 = new ol.layer.Tile({
	title: "Scotland, Town Plans - Perth, OS Air Photo, 1948",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/air-photos/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        group_no: '31',
        mosaic_id: '9',
        type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay georeferenced by Michal Michalski', 
        minx: -3.457, 
        miny: 56.386, 
        maxx: -3.376, 
        maxy: 56.417
});


	var OStwentyfiveinchholes =  new ol.layer.Tile({
		source: new ol.source.XYZ({
					url: "http://geo.nls.uk/mapdata2/os/25_inch/england_holes/{z}/{x}/{y}.png", 
					minZoom: 4,
					maxZoom: 18
		}),

          });

	var OStwentyfiveinchbuckingham =  new ol.layer.Tile({
		source: new ol.source.XYZ({
					url: "http://geo.nls.uk/mapdata2/os/25_inch/buckingham/{z}/{x}/{y}.png", 
					minZoom: 4,
					maxZoom: 18
		}),

          });

	var OStwentyfiveinchessex =  new ol.layer.Tile({
		source: new ol.source.XYZ({
					url: "http://geo.nls.uk/mapdata2/os/25_inch/essex/{z}/{x}/{y}.png", 
					minZoom: 4,
					maxZoom: 18
		}),

          });

	var OStwentyfiveinchkent =  new ol.layer.Tile({
		source: new ol.source.XYZ({
					url: "http://geo.nls.uk/mapdata2/os/25_inch/kent/{z}/{x}/{y}.png", 
					minZoom: 4,
					maxZoom: 18
		}),

          });

	var OStwentyfiveinchmiddlesex =  new ol.layer.Tile({
		source: new ol.source.XYZ({
					url: "http://geo.nls.uk/mapdata2/os/25_inch/middlesex/{z}/{x}/{y}.png", 
					minZoom: 4,
					maxZoom: 18
		}),

          });

	var OStwentyfiveinchsurrey =  new ol.layer.Tile({
		source: new ol.source.XYZ({
					url: "http://geo.nls.uk/mapdata2/os/25_inch/surrey/{z}/{x}/{y}.png", 
					minZoom: 4,
					maxZoom: 18
		}),

          });

	var OStwentyfiveinchsussex =  new ol.layer.Tile({
		source: new ol.source.XYZ({
					url: "http://geo.nls.uk/mapdata2/os/25_inch/sussex/{z}/{x}/{y}.png", 
					minZoom: 4,
					maxZoom: 18
		}),

          });

	var OStwentyfiveinchlondon =  new ol.layer.Tile({
		source: new ol.source.XYZ({
					url: "http://geo.nls.uk/mapdata2/os/25_inch/london/{z}/{x}/{y}.png", 
					minZoom: 4,
					maxZoom: 18
		}),

          });



	var twentyfiveinchengwal = new ol.layer.Group({
	            title: 'England and Wales - OS 25 inch, 1890s-1920s',
		        group_no: '64',
		        mosaic_id: '176',
			layers: [OStwentyfiveinchholes, OStwentyfiveinchbuckingham, OStwentyfiveinchessex, OStwentyfiveinchmiddlesex, OStwentyfiveinchkent, OStwentyfiveinchsurrey, OStwentyfiveinchsussex, OStwentyfiveinchlondon],
			type: 'overlay', 
			visible: false,
			minx: -1.989, 
			miny: 50.515, 
			maxx: 1.537, 
			maxy: 52.191,
			keytext: 'The scanning of this series is in progress and at present we just have selective coverage for south-eastern counties of England. View the individual sheets of this OS 25 inch mapping by selecting "Find by place" above',
       			key: 'geo.nls.uk/mapdata3/os/25_inch/cb/key/openlayers.html'
	});


    var sixinchenglandwales = new ol.layer.Tile({
	title: "England and Wales - OS Six Inch, 1888-1913",
	source: new ol.source.XYZ({
				url: "http://nls-0.tileserver.com/os_6_inch_gb/{z}/{x}/{y}.jpg", 
		  }),
        numZoomLevels: 18,
        mosaic_id: '171',
        group_no: '59',    
    	type: 'overlay',
    	visible: false,
        minx: -8.8, 
	miny: 49.8,
        maxx: 1.8, 
        maxy: 60.9,
	keytext: 'View the individual sheets of this OS six-inch mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/maps/os/six_inch/key/openlayers.html',
        attribution: '<a href="http://maps.nls.uk/os/6inch-england-and-wales/index.html" target="_blank">OS six-inch England and Wales home page</a>'
  });

 	var twentyfivethousandengwal = new ol.layer.Tile({
	title: "England and Wales - OS 1:25,000, 1937-61",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata2/os/25000/{z}/{x}/{-y}.png",
				minZoom: 10,
				maxZoom: 16
		  }),
        numZoomLevels: 17,
        group_no: '32',
        mosaic_id: '10',
        type: 'overlay', 
        visible: false,
        minx: -7.68, 
	miny: 49.8,
        maxx: 1.77, 
        maxy: 60.4,
	keytext: 'View the individual sheets of this OS 1:25,000 mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/mapdata2/os/25000/key/openlayers.html'        
    });


   var oneinchnewpop = new ol.layer.Tile({
	title: "England and Wales - OS One Inch, 1945-47",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/newpopular/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '56',
        mosaic_id: '12',
        type: 'overlay', 
        visible: false,
        minx: -8.4, 
	miny: 49.8,
        maxx: 1.7, 
        maxy: 55.9,
	keytext: 'View the individual sheets of this OS one-inch mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/os/oneinch_new_popular_list.html" target="_blank">OS New Popular edition</a> home page'
    });


   var oneinchnewpop2 = new ol.layer.Tile({
	title: "England and Wales - OS One Inch, 1945-47, retiled",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/popular_tile/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '56',
        mosaic_id: '12',
        type: 'overlay', 
        visible: false,
        minx: -8.4, 
	miny: 49.8,
        maxx: 1.7, 
        maxy: 55.9,
	keytext: 'View the individual sheets of this OS one-inch mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay NLS <a href="http://maps.nls.uk/os/oneinch_new_popular_list.html" target="_blank">OS New Popular edition</a> home page'
    });


    var oneinchseventhengwal = new ol.layer.Tile({
	title: "England and Wales - OS One Inch 7th series, 1955-61",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata2/os/seventh/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        group_no: '55',
        mosaic_id: '11',
        type: 'overlay', 
        visible: false,
        minx: -8.8, 
	miny: 49.8,
        maxx: 1.77, 
        maxy: 60.9,
	keytext: 'View the individual sheets of this OS one-inch mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/mapdata2/os/seventh/key/openlayers.html'
    });


   var os_london_1056 = new ol.layer.Tile({
	title: "England and Wales - London, 1:1,056, 1893-1895",
	source: new ol.source.XYZ({
    				attributions: [RumseyATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/os/london/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 21
		  }),
        numZoomLevels: 21,
        group_no: '57',
        mosaic_id: '163',
        type: 'overlay', 
        visible: false,
        minx: -0.3707, 
        miny: 51.3479, 
        maxx: 0.1046, 
        maxy: 51.6331,
	keytext: 'View the individual sheets of this OS five-foot mapping by selecting "Find by place" above',
        key: 'maps.nls.uk/townplans/symbols.html'     
    });

   var os_london_1250 = new ol.layer.Tile({
	title: "England and Wales - London/TQ, 1:1,250/1:2,500, 1947-1964",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/os/ldn_tile/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 20
		  }),
        numZoomLevels: 20,
        group_no: '61',
        mosaic_id: '173',
        type: 'overlay', 
        visible: false,
        minx: -0.5709, 
        miny: 50.7736, 
        maxx: 0.8774, 
        maxy: 51.6912,
	keytext: 'View the individual sheets of this OS 1:1,250/1:2,500 mapping by selecting "Find by place" above',
        key: 'geo.nls.uk/mapdata3/os/1250_key/openlayers.html'
    });


   var irelandbart = new ol.layer.Tile({
	title: "Ireland - Bartholomew Quarter-Inch, 1940",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/ireland/bartholomew/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 13
		  }),
        numZoomLevels: 13,
        group_no: '',
        mosaic_id: '13',
        type: 'overlay', 
        visible: false,
        minx: -10.6, 
        miny: 51.3, 
        maxx: -5.3, 
        maxy: 55.4,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: ''
    });




   var irelandgsgs = new ol.layer.Tile({
	title: "Ireland - GSGS One-Inch, 1941-3",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/ireland/gsgs4136/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        group_no: '',
        mosaic_id: '14',
        type: 'overlay', 
        visible: false,
        minx: -10.6, 
        miny: 51.3, 
        maxx: -5.3, 
        maxy: 55.4,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: ''
    });




    var nls = new ol.layer.Tile({
	title: "Great Britain - OS 1:1m to 1:63K, 1920s-1940s",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/api/nls/{z}/{x}/{y}.jpg",
				minZoom: 8,
				maxZoom: 15
		  }),
        group_no: '1',
        mosaic_id: '172',
        backgroundColor: '#cedfe4',
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: 'Overlay <a href="http://geo.nls.uk/maps/api/" target="_blank">NLS Maps API</a> and <a href="http://www.klokantech.com/" target="_blank">Klokan Technologies GmbH</a>',
        minx: -8.4, 
	miny: 49.8,
        maxx: 1.9, 
        maxy: 60.4       
    });


    var admin = new ol.layer.Tile({
	title: "Great Britain - OS 10 mile, Admin Areas, 1956",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/ten_mile/admin/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 10
		  }),
        mosaic_id: '162',
        group_no: '44',
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/os/ten_mile/admin/key/openlayers.html',    
        minx: -8.4, 
        miny: 50.5, 
        maxx: 1.9, 
        maxy: 60.4
    });


    var coal_iron = new ol.layer.Tile({
	title: "Great Britain - OS 10 mile, Coal & Iron, 1945",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/ten_mile/coal_iron/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 10
		  }),
        mosaic_id: '10coal',
        numZoomLevels: 10,
        group_no: '44',
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/os/ten_mile/coal_iron/key/openlayers.html',
        minx: -8.4, 
        miny: 50.5, 
        maxx: 1.9, 
        maxy: 60.4
    });


 var farming = new ol.layer.Tile({
	title: "Great Britain - OS 10 mile, Farming, 1944",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/ten_mile/farming/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 10
		  }),
        mosaic_id: '10farm',
        numZoomLevels: 10,
        group_no: '44',
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/os/ten_mile/farming/key/openlayers.html',
        minx: -8.4, 
        miny: 50.5, 
        maxx: 1.9, 
        maxy: 60.4
    });

    var general = new ol.layer.Tile({
	title: "Great Britain - OS 10 mile, General, 1955",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/ten_mile/general/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 10
		  }),
        mosaic_id: '10gen',
        group_no: '44',
        numZoomLevels: 10,
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/os/ten_mile/general/key/openlayers.html',
        minx: -8.4, 
        miny: 50.5, 
        maxx: 1.9, 
        maxy: 60.4

    });


    var geological = new ol.layer.Tile({
	title: "Great Britain - OS 10 mile, Geological, 1955",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/ten_mile/geological/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 10
		  }),
        mosaic_id: '10geol',
        group_no: '44',
        numZoomLevels: 10,
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/os/ten_mile/geological/key/openlayers.html',
        minx: -8.4, 
        miny: 50.5, 
        maxx: 1.9, 
        maxy: 60.4
    });



    var iron_steel = new ol.layer.Tile({
	title: "Great Britain - OS 10 mile, Iron and Steel, 1945",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/ten_mile/iron_steel/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 10
		  }),
        mosaic_id: '10iron',
        group_no: '44',
        numZoomLevels: 10,
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/os/ten_mile/iron_steel/key/openlayers.html',
        minx: -8.4, 
        miny: 50.5, 
        maxx: 1.9, 
        maxy: 60.4
    });


    var land_classification = new ol.layer.Tile({
	title: "Great Britain - OS 10 mile, Land Classification, 1945",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/ten_mile/land_classification/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 10
		  }),
        mosaic_id: '10landcl',
        group_no: '44',
        numZoomLevels: 10,
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/os/ten_mile/land_classification/key/openlayers.html',
        minx: -8.4, 
        miny: 50.5, 
        maxx: 1.9, 
        maxy: 60.4
    });



    var land_utilisation = new ol.layer.Tile({
	title: "Great Britain - OS 10 mile, Land Utilisation, 1944",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/ten_mile/land_utilisation/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 10
		  }),
        mosaic_id: '10landut',
        group_no: '44',
        numZoomLevels: 10,
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/os/ten_mile/land_utilisation/key/openlayers.html',
        minx: -8.4, 
        miny: 50.5, 
        maxx: 1.9, 
        maxy: 60.4
    });



    var limestone = new ol.layer.Tile({
	title: "Great Britain - OS 10 mile, Limestone, 1955",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/ten_mile/limestone/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 10
		  }),
        mosaic_id: '10lime',
        group_no: '44',
        numZoomLevels: 10,
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/os/ten_mile/limestone/key/openlayers.html',
        minx: -8.4, 
        miny: 50.5, 
        maxx: 1.9, 
        maxy: 60.4
    });


    var local_access = new ol.layer.Tile({
	title: "Great Britain - OS 10 mile, Local Accessibility, 1942",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/ten_mile/local_access/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 10
		  }),
        mosaic_id: '10local',
        group_no: '44',
        numZoomLevels: 10,
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/os/ten_mile/local_access/key/openlayers.html',
        minx: -8.4, 
        miny: 50.5, 
        maxx: 1.9, 
        maxy: 60.4
    });



    var physical = new ol.layer.Tile({
	title: "Great Britain - OS 10 mile, Physical, 1957",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/ten_mile/physical/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 10
		  }),
        mosaic_id: '10phys',
        group_no: '44',
        numZoomLevels: 10,
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/os/ten_mile/physical/key/openlayers.html',
        minx: -8.4, 
        miny: 50.5, 
        maxx: 1.9, 
        maxy: 60.4
    });



    var population_change_1921 = new ol.layer.Tile({
	title: "Great Britain - OS 10 mile, Population Change, 1921",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/ten_mile/population_change_1921/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 10
		  }),
        mosaic_id: '10popch21',
        group_no: '44',
        numZoomLevels: 10,
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/os/ten_mile/population_change_1921/key/openlayers.html',
        minx: -8.4, 
        miny: 50.5, 
        maxx: 1.9, 
        maxy: 60.4
    });


    var population_change_1931 = new ol.layer.Tile({
	title: "Great Britain - OS 10 mile, Population Change, 1931",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/ten_mile/population_change_1931/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 10
		  }),
        mosaic_id: '10popch31',
        group_no: '44',
        numZoomLevels: 10,
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/os/ten_mile/population_change_1931/key/openlayers.html',
        minx: -8.4, 
        miny: 50.5, 
        maxx: 1.9, 
        maxy: 60.4
    });


    var population_change_1939 = new ol.layer.Tile({
	title: "Great Britain - OS 10 mile, Population Change, 1939",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/ten_mile/population_change_1939/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 10
		  }),
        mosaic_id: '10popch39',
        group_no: '44',
        numZoomLevels: 10,
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/os/ten_mile/population_change_1939/key/openlayers.html',
        minx: -8.4, 
        miny: 50.5, 
        maxx: 1.9, 
        maxy: 60.4
    });


    var population_density_1931 = new ol.layer.Tile({
	title: "Great Britain - OS 10 mile, Population Density, 1931",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/ten_mile/population_density_1931/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 10
		  }),

        mosaic_id: '10popden31',
        group_no: '44',
        numZoomLevels: 10,
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/os/ten_mile/population_density_1931/key/openlayers.html',
        minx: -8.4, 
        miny: 50.5, 
        maxx: 1.9, 
        maxy: 60.4
    });


    var population_density_1951 = new ol.layer.Tile({
	title: "Great Britain - OS 10 mile, Population Density, 1951",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/ten_mile/population_density_1951/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 10
		  }),

        mosaic_id: '10popden51',
        group_no: '44',
        numZoomLevels: 10,
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/os/ten_mile/population_density_1951/key/openlayers.html',
        minx: -8.4, 
        miny: 50.5, 
        maxx: 1.9, 
        maxy: 60.4
    });





    var railways = new ol.layer.Tile({
	title: "Great Britain - OS 10 mile, Railways, 1946",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/ten_mile/railways/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 10
		  }),
        mosaic_id: '10rail',
        group_no: '44',
        numZoomLevels: 10,
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/os/ten_mile/railways/key/openlayers.html',
        minx: -8.4, 
        miny: 50.5, 
        maxx: 1.9, 
        maxy: 60.4
    });


    var rainfall = new ol.layer.Tile({
	title: "Great Britain - OS 10 mile, Rainfall, 1881-1915",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/ten_mile/rainfall/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 10
		  }),
        mosaic_id: '10rain',
        group_no: '44',
        numZoomLevels: 10,
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/os/ten_mile/rainfall/key/openlayers.html',
        minx: -8.4, 
        miny: 50.5, 
        maxx: 1.9, 
        maxy: 60.4
    });



    var roads_46 = new ol.layer.Tile({
	title: "Great Britain - OS 10 mile, Roads, 1946",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/ten_mile/roads_46/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 10
		  }),
        mosaic_id: '10road46',
        group_no: '44',
        numZoomLevels: 10,
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/os/ten_mile/roads_46/key/openlayers.html',
        minx: -8.4, 
        miny: 50.5, 
        maxx: 1.9, 
        maxy: 60.4
    });


    var roads_56 = new ol.layer.Tile({
	title: "Great Britain - OS 10 mile, Roads, 1956",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/ten_mile/roads_56/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 10
		  }),
        mosaic_id: '10road56',
        group_no: '44',
        numZoomLevels: 10,
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/os/ten_mile/roads_56/key/openlayers.html',
        minx: -8.4, 
        miny: 50.5, 
        maxx: 1.9, 
        maxy: 60.4
    });



    var veg_north = new ol.layer.Tile({
	title: "Great Britain - OS 10 mile, Vegetation - North, 1953",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/ten_mile/vegetation_north/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 10
		  }),
        mosaic_id: '10vegn',
        group_no: '44',
        numZoomLevels: 10,
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/os/ten_mile/vegetation_north/key/openlayers.html',
        minx: -8.4, 
        miny: 50.5, 
        maxx: 1.9, 
        maxy: 60.4
    });


    var veg_south = new ol.layer.Tile({
	title: "Great Britain - OS 10 mile, Vegetation - South, 1945",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/ten_mile/vegetation_south/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 10
		  }),
        mosaic_id: '10vegs',
        group_no: '44',
        numZoomLevels: 10,
	type: 'overlay', 
        visible: false,
        key: 'geo.nls.uk/maps/os/ten_mile/vegetation_south/key/openlayers.html',
        minx: -8.4, 
        miny: 50.5, 
        maxx: 1.9, 
        maxy: 60.4
    });



    var belgiumgsgs4042 = new ol.layer.Tile({
	title: "Belgium WW2 - GSGS Quarter-Inch, 1937-42",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/belgium/gsgs4042/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 12
		  }),
        numZoomLevels: 12,
        mosaic_id: 'gsgs4042',
        group_no: '',
	type: 'overlay', 
        visible: false,
        minx: 2.5, 
        miny: 49.4, 
        maxx: 6.5, 
        maxy: 51.5,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: ''
    });



    var belgiumgsgs4336 = new ol.layer.Tile({
	title: "Belgium WW2 - GSGS 1:100K, 1937-44",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/belgium/gsgs4336/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 13
		  }),
        numZoomLevels: 13,
        mosaic_id: 'gsgs4336',
        group_no: '',
	type: 'overlay', 
        visible: false,
        minx: 2.5, 
        miny: 49.4, 
        maxx: 6.5, 
        maxy: 51.5,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: ''
        
    });



    var belgiumgsgs4040 = new ol.layer.Tile({
	title: "Belgium WW2 - GSGS 1:50K, 1943-44",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/belgium/gsgs4040/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 13
		  }),
        numZoomLevels: 13,
        mosaic_id: 'gsgs4040',
        group_no: '',
	type: 'overlay', 
        visible: false,
        minx: 2.5, 
        miny: 49.4, 
        maxx: 6.5, 
        maxy: 51.5,
        key: 'geo.nls.uk/maps/nokey.html',
        attribution: ''
    });


    var trench101723168 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:5K) Aveluy, 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723168/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723168',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.6145, 
        miny: 50.0146, 
        maxx: 2.6734, 
        maxy: 50.0455,
	        
                
        attribution: ''
    });

    var trench101723205 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:5K) Beaumont-Hamel, 14 Nov 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723205/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723205',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.6490, 
        miny: 50.0675, 
        maxx: 2.6785, 
        maxy: 50.0885,
        attribution: ''    
	});

    var trench101723208 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:5K) Beauregard, 30 Sept 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723208/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723208',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7083, 
        miny: 50.1011, 
        maxx: 2.7346, 
        maxy: 50.1221,
        attribution: ''
    });

    var trench101723211 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:5K) Bois d'Hollande, 1 Sept 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723211/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723211',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.6779, 
        miny: 50.0678, 
        maxx: 2.7102, 
        maxy: 50.0845,
        attribution: ''
    });

    var trench101723214 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:5K) Bois d'Hollande, 19 Nov 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723214/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723214',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.6779, 
        miny: 50.0678, 
        maxx: 2.7102, 
        maxy: 50.0845,
        attribution: ''
    });

    var trench101724055  = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:5K) Eaucourt l'Abbaye, 9 Sept 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101724055/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101724055',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7730, 
        miny: 50.0603, 
        maxx: 2.8077, 
        maxy: 50.07845,
        attribution: ''
    });

    var trench101723220 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:5K) Grandcourt, 30 Aug 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723220/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723220',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.6963, 
        miny: 50.0637, 
        maxx: 2.7235, 
        maxy: 50.0851,
        attribution: ''
    });

    var trench101723223 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:5K) Grandcourt, 3 Nov 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723223/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723223',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.6963, 
        miny: 50.0637, 
        maxx: 2.7235, 
        maxy: 50.0851,
        attribution: ''
    });

    var trench101723229 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:5K) Irles, 4 Oct 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723229/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723229',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7408, 
        miny: 50.0933, 
        maxx: 2.7737, 
        maxy: 50.1102,
        attribution: ''
    });

    var trench101724060 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:5K) Loupart Wood, 25 Oct 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101724060/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101724060',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7723, 
        miny: 50.0932, 
        maxx: 2.8062, 
        maxy: 50.1106,
        attribution: ''
    });

    var trench101723232 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:5K) Miraumont, 14 Nov 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723232/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723232',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7079, 
        miny: 50.0841, 
        maxx: 2.7422, 
        maxy: 50.1019,
        attribution: ''
    });

    var trench101724050 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:5K) Neuve Chapelle, 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101724050/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101724050',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7626, 
        miny: 50.5682, 
        maxx: 2.79822, 
        maxy: 50.6040,
        attribution: ''
    });

    var trench101724027 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:5K) Pendant Copse, 30 Sept 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101724027/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101724027',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.67643, 
        miny: 50.08386, 
        maxx: 2.7104, 
        maxy: 50.1015,
        attribution: ''
    });

    var trench101724030 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:5K) Pendant Copse, 15 Nov 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101724030/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101724030',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.6763, 
        miny: 50.0839, 
        maxx: 2.7106, 
        maxy: 50.1015,
        attribution: ''
    });

    var trench101723171 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:5K) Pys, 2 Nov 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723171/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723171',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7413, 
        miny: 50.0769, 
        maxx: 2.7743, 
        maxy: 50.0937,
        attribution: ''
    });

    var trench101723174 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:5K) Ravine, 16 Sept 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723174/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723174',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7226, 
        miny: 50.0642, 
        maxx: 2.7487, 
        maxy: 50.0851,
        attribution: ''
    });

    var trench101723196 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:5K) Ravine, 3 Nov 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723196/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723196',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7226, 
        miny: 50.0642, 
        maxx: 2.7487, 
        maxy: 50.0851,
        attribution: ''
    });

    var trench101723217 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:5K) Redan, 3 Oct 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723217/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723217',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.6519, 
        miny: 50.0839, 
        maxx: 2.6780, 
        maxy: 50.1006,
        attribution: ''
    });

    var trench101723199 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:5K) St Pierre Divion, 17 Aug 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723199/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723199',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.6721, 
        miny: 50.0596, 
        maxx: 2.7045, 
        maxy: 50.0778,
        attribution: ''
    });

    var trench101724033 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:5K) Star Wood, 4 Oct 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101724033/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101724033',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.6563, 
        miny: 50.0998, 
        maxx: 2.6844, 
        maxy: 50.1214,
        attribution: ''
    });

    var trench101724036 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:5K) Twenty, 7 Oct 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101724036/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101724036',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.6818, 
        miny: 50.1003, 
        maxx: 2.7103, 
        maxy: 50.1221,
        attribution: ''
    });

    var trench101464585 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 5.NW.4, 3 Feb 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464585/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464585',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.2735, 
        miny: 51.3566, 
        maxx: 3.3948, 
        maxy: 51.4054,
        attribution: ''
    });

    var trench101464588 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 5.SW.1, 3 Feb 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464588/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464588',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1607, 
        miny: 51.3105, 
        maxx: 3.2816, 
        maxy: 51.3598,
        attribution: ''
    });

    var trench101464591 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 5.SW.2, 3 Feb 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464591/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464591',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.2758, 
        miny: 51.3114, 
        maxx: 3.3956, 
        maxy: 51.3627,
        attribution: ''
    });

    var trench101464594 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 12.NE.1, 19 Oct 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464594/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464594',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9277, 
        miny: 51.2079, 
        maxx: 3.0641, 
        maxy: 51.2722,
        attribution: ''
    });

    var trench101464609 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 12.SW.1, 19 May 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464609/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464609',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7022, 
        miny: 51.1139, 
        maxx: 2.8360, 
        maxy: 51.1784,
        attribution: ''
    });

    var trench101464612 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 12.SW.1, 25 July 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464612/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464612',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7022, 
        miny: 51.1139, 
        maxx: 2.8360, 
        maxy: 51.1784,
        attribution: ''
    });

    var trench101464615 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 12.SW.2, 3 July 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464615/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464615',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.8172, 
        miny: 51.1164, 
        maxx: 2.9508, 
        maxy: 51.1805,
        attribution: ''
    });

    var trench101464618 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 12.SW.4, 3 July 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464618/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464618',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.8169, 
        miny: 51.0717, 
        maxx: 2.9534, 
        maxy: 51.1352,
        attribution: ''
    });


    var trench101464630 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 20.SW.4, 5 May 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464630/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464630',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.8217, 
        miny: 50.8903, 
        maxx: 2.9586, 
        maxy: 50.9559,
        attribution: ''
    });

    var trench101464627 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 20.SE.3, 17 Sept 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464627/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464627',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9384, 
        miny: 50.8931, 
        maxx: 3.0733, 
        maxy: 50.9561,
        attribution: ''
    });

    var trench101464639 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 28NW2 & 28NE1, 30/06/1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464639/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464639',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.8254, 
        miny: 50.8490, 
        maxx: 3.0771, 
        maxy: 50.9120,
        attribution: ''
    });

    var trench101464642 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 28.NW.4 & NE.3, 1/04/1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464642/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464642',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.8775, 
        miny: 50.8038, 
        maxx: 3.0132, 
        maxy: 50.8675,
        attribution: ''
    });


    var trench101464645 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 28.NW.4 & NE.3, 30/06/1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464645/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464645',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.8775, 
        miny: 50.8038, 
        maxx: 3.0122, 
        maxy: 50.8663,
        attribution: ''
    });

    var trench101464636 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 28.NE.3, 30 June 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464636/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464636',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9397, 
        miny: 50.8032, 
        maxx: 3.0753, 
        maxy: 50.8660,
        attribution: ''
    });

    var trench101464681 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 28.SW.2, 1 April 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464681/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464681',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.8312, 
        miny: 50.7578, 
        maxx: 2.9633, 
        maxy: 50.8214,
        attribution: ''
    });

    var trench101464684 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 28.SW.2, 18 July 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464684/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464684',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.8312, 
        miny: 50.7578, 
        maxx: 2.9633, 
        maxy: 50.8214,
        attribution: ''
    });

    var trench101464687 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 28.SW.4, 18 July 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464687/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464687',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.8295, 
        miny: 50.7118, 
        maxx: 2.9652, 
        maxy: 50.7754,
        attribution: ''
    });

    var trench101464648 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 28.SE.1, 3 July 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464648/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464648',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9427, 
        miny: 50.7591, 
        maxx: 3.0764, 
        maxy: 50.8223,
        attribution: ''
    });

    var trench101464651 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 28.SE.1, 30 Aug 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464651/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464651',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9427, 
        miny: 50.7591, 
        maxx: 3.0764, 
        maxy: 50.8223,
        attribution: ''
    });

    var trench101464654 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 28.SE.1, 1 Nov 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464654/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464654',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9427, 
        miny: 50.7591, 
        maxx: 3.0764, 
        maxy: 50.8223,
        attribution: ''
    });

    var trench101464657 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 28.SE.1, 7 Aug 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464657/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464657',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9427, 
        miny: 50.7591, 
        maxx: 3.0764, 
        maxy: 50.8223,
        attribution: ''
    });

    var trench101464660 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 28.SE.2, 13 Aug 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464660/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464660',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.0560, 
        miny: 50.7598, 
        maxx: 3.1911, 
        maxy: 50.8236,
        attribution: ''
    });

    var trench101464663 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 28.SE.2, 27 Dec 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464663/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464663',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.0560, 
        miny: 50.7598, 
        maxx: 3.1911, 
        maxy: 50.8236,
        attribution: ''
    });

    var trench101464666 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 28.SE.3, 28 July 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464666/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464666',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9411, 
        miny: 50.7119, 
        maxx: 3.0796, 
        maxy: 50.7766,
        attribution: ''
    });

    var trench101464669 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 28.SE.3, 30 Aug 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464669/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464669',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9411, 
        miny: 50.7119, 
        maxx: 3.0796, 
        maxy: 50.7766,
        attribution: ''
    });

    var trench101464672 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 28.SE.3, 1 Nov 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464672/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464672',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9411, 
        miny: 50.7119, 
        maxx: 3.0796, 
        maxy: 50.7766,
        attribution: ''
    });

    var trench101464675 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 28.SE.4, 1 Sept 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464675/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464675',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.0586, 
        miny: 50.7145, 
        maxx: 3.1923, 
        maxy: 50.7777,
        attribution: ''
    });

    var trench101464693 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 36.NE.3, 6 May 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464693/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464693',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9433, 
        miny: 50.6245, 
        maxx: 3.0800, 
        maxy: 50.6906,
        attribution: ''
    });

    var trench101464696 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 36.NE.3, 28 Sept 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464696/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464696',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9453, 
        miny: 50.6314, 
        maxx: 3.0762, 
        maxy: 50.6874,
        attribution: ''
    });

    var trench101464705 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 36.SW.1, 15 Dec 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464705/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464705',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7233, 
        miny: 50.5794, 
        maxx: 2.8256, 
        maxy: 50.6375,
        attribution: ''
    });

    var trench101464708 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 36.SW.3, 28 Jan 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464708/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464708',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7216, 
        miny: 50.5287, 
        maxx: 2.8581, 
        maxy: 50.5948,
        attribution: ''
    });

    var trench101464711 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 36.SW.3, 22 Dec 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464711/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464711',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7216, 
        miny: 50.5287, 
        maxx: 2.8581, 
        maxy: 50.5948,
        attribution: ''
    });

    var trench101464714 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 36.SW.4, 8 Aug 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464714/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464714',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.8343, 
        miny: 50.5298, 
        maxx: 2.9707, 
        maxy: 50.5954,
        attribution: ''
    });

    var trench101464699 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 36.SE.1, 30 Jul 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464699/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464699',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9506, 
        miny: 50.5857, 
        maxx: 3.0776, 
        maxy: 50.6426,
        attribution: ''
    });

    var trench101464702 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 36.SE.3, 30 Jul 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464702/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464702',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9509, 
        miny: 50.5397, 
        maxx: 3.0775, 
        maxy: 50.5975,
        attribution: ''
    });

    var trench101464726 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 36B.SE4/36C.SW3, 8/4/16",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464726/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464726',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7018, 
        miny: 50.3483, 
        maxx: 2.8388, 
        maxy: 50.4135,
        attribution: ''
    });

    var trench101464729 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 36C.NW.1, 4 May 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464729/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464729',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7223, 
        miny: 50.4871, 
        maxx: 2.8583, 
        maxy: 50.5523,
        attribution: ''
    });

    var trench101464732 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 36C.NW.1, 15 Nov 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464732/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464732',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7223, 
        miny: 50.4871, 
        maxx: 2.8583, 
        maxy: 50.5523,
        attribution: ''
    });

    var trench101464735 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 36C.NW.1, 2 May 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464735/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464735',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7223, 
        miny: 50.4871, 
        maxx: 2.8583, 
        maxy: 50.5523,
        attribution: ''
    });

    var trench101464738 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 36C.NW.2, 4 May 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464738/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464738',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.8348, 
        miny: 50.4885, 
        maxx: 2.9722, 
        maxy: 50.5538,
        attribution: ''
    });

    var trench101464741 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 36C.NW.2, 3 Nov 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464741/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464741',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.8348, 
        miny: 50.4885, 
        maxx: 2.9722, 
        maxy: 50.5538,
        attribution: ''
    });

    var trench101464744 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 36C.SW.1,10 Feb 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464744/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464744',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7252, 
        miny: 50.3937, 
        maxx: 2.8627, 
        maxy: 50.4594,
        attribution: ''
    });

    var trench101464747 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 36C.SW.4, 8 Aug 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464747/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464747',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.8397, 
        miny: 50.3486, 
        maxx: 2.9762, 
        maxy: 50.4157,
        attribution: ''
    });

    var trench101464750 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 36C.SW.4, 23 Nov 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464750/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464750',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.8397, 
        miny: 50.3486, 
        maxx: 2.9762, 
        maxy: 50.4157,
        attribution: ''
    });

    var trench101464753 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 51B.NW.1, 27 Dec 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464753/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464753',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7299, 
        miny: 50.3037, 
        maxx: 2.8658, 
        maxy: 50.3691,
        attribution: ''
    });

    var trench101464756 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 51B.SW.2, 30 Aug 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464756/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464756',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.8457, 
        miny: 50.2179, 
        maxx: 2.9783, 
        maxy: 50.2811,
        attribution: ''
    });

    var trench101464759 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 51C.SE & 51B.SW, 7/10/1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464759/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464759',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.6721, 
        miny: 50.2063, 
        maxx: 2.7887, 
        maxy: 50.2575,
        attribution: ''
    });

    var trench101464762 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 57B.NW3, 20 Nov 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464762/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464762',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1861, 
        miny: 50.0871, 
        maxx: 3.3200, 
        maxy: 50.1497,
        attribution: ''
    });

    var trench101464768 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 57C.NW.1, 2 Nov 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464768/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464768',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7371, 
        miny: 50.1241, 
        maxx: 2.8720, 
        maxy: 50.1894,
        attribution: ''
    });

    var trench101464765 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 57C.NE.4, 6 March 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464765/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464765',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.0729, 
        miny: 50.0829, 
        maxx: 3.2079, 
        maxy: 50.1485,
        attribution: ''
    });

    var trench101464774  = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 57C.SW.1, 2 December 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464774/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464774',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7389, 
        miny: 50.0348, 
        maxx: 2.8747, 
        maxy: 50.1004,
        attribution: ''
    });

    var trench101464777  = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 57C.SW.3, 3 Sept 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464777/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464777',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7398, 
        miny: 49.9899, 
        maxx: 2.8753, 
        maxy: 50.0549,
        attribution: ''
    });

    var trench101464780 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 57C.SW.4, 24 Sept 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464780/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464780',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.8591, 
        miny: 49.9974, 
        maxx: 2.9854, 
        maxy: 50.0557,
        attribution: ''
    });

    var trench101464783 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 57C.SW.4, 20 Nov 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464783/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464783',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.8514, 
        miny: 49.9917, 
        maxx: 2.9864, 
        maxy: 50.0560,
        attribution: ''
    });

    var trench101464771 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 57C.SE.1, 12 Feb 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464771/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464771',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9623, 
        miny: 50.0371, 
        maxx: 3.0975, 
        maxy: 50.1021,
        attribution: ''
    });

    var trench101464786 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 57D.NE4/57C.NW3, 11/5/16",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464786/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464786',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7003, 
        miny: 50.0791, 
        maxx: 2.8309, 
        maxy: 50.1445,
        attribution: ''
    });

    var trench101464789 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 57D.NE.1&2, 16 May 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464789/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464789',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5979, 
        miny: 50.1363, 
        maxx: 2.7144, 
        maxy: 50.1830,
        attribution: ''
    });

    var trench101464792 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 57D.NE.3&4, 2 Aug 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464792/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464792',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5992, 
        miny: 50.0907, 
        maxx: 2.7155, 
        maxy: 50.1381,
        attribution: ''
    });

    var trench101464795 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 57D.NE.3&4, 16 Oct 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464795/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464795',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5992, 
        miny: 50.0907, 
        maxx: 2.7155, 
        maxy: 50.1381,
        attribution: ''
    });

    var trench101464798 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 57DSE2&57CSW1, 16/8/16",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464798/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464798',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7006, 
        miny: 50.0328, 
        maxx: 2.8351, 
        maxy: 50.0980,
        attribution: ''
    });

    var trench101464801 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 57D.SE4, 27 April 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464801/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464801',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.6359, 
        miny: 49.9927, 
        maxx: 2.7592, 
        maxy: 50.0537,
        attribution: ''
    });

    var trench101464804 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 57D.SE4, 19 Aug 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464804/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464804',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.6359, 
        miny: 49.9927, 
        maxx: 2.7592, 
        maxy: 50.0537,
        attribution: ''
    });

    var trench101464807 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 57D.SE4, 1 Sept 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464807/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464807',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.6313, 
        miny: 49.9930, 
        maxx: 2.7615, 
        maxy: 50.0521,
        attribution: ''
    });

    var trench101464810 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 62D.NE2, 15 June 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464810/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464810',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.6333, 
        miny: 49.9448, 
        maxx: 2.7634, 
        maxy: 50.0075,
        attribution: ''
    });

    var trench101464813 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 66C.NW.1, 8 Nov 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464813/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464813',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1992, 
        miny: 49.7820, 
        maxx: 3.3167, 
        maxy: 49.8323,
        attribution: ''
    });

    var trench101464816 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 66C.NW.2, 8 Nov 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464816/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464816',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.3109, 
        miny: 49.7839, 
        maxx: 3.4284, 
        maxy: 49.8328,
        attribution: ''
    });

    var trench101464822 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 66C.SW.2, 8 Nov 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464822/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464822',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.3125, 
        miny: 49.6933, 
        maxx: 3.4297, 
        maxy: 49.7427,
        attribution: ''
    });

    var trench101464825 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 66C.SW.4, 8 Nov 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464825/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464825',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.3126, 
        miny: 49.6484, 
        maxx: 3.4309, 
        maxy: 49.6986,
        attribution: ''
    });

    var trench101464828 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 66D.NW.1, 21 Feb 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464828/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464828',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7551, 
        miny: 49.7766, 
        maxx: 2.8725, 
        maxy: 49.8273,
        attribution: ''
    });

    var trench101464831 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) 66E.NE.4, 21 Feb 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464831/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464831',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.6404, 
        miny: 49.7186, 
        maxx: 2.7718, 
        maxy: 49.7829,
        attribution: ''
    });


    var trench101724021  = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) Bas Maisnel, etc., 1915",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101724021/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101724021',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.8243, 
        miny: 50.5619, 
        maxx: 2.8976, 
        maxy: 50.6409,
        attribution: ''
    });

    var trench101723247 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) Demicourt (57c), 7 Nov 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723247/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723247',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.0058, 
        miny: 50.1073, 
        maxx: 3.1193, 
        maxy: 50.1606,
        attribution: ''
    });

    var trench101723250 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) Double Crassier / Loos, 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723250/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723250',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7588, 
        miny: 50.4305, 
        maxx: 2.8159, 
        maxy: 50.4585,
        attribution: ''
    });

    var trench101723244 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) Fauquissart-Aubers, 1915",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723244/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723244',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7672, 
        miny: 50.5560, 
        maxx: 2.8367, 
        maxy: 50.6206,
        attribution: ''
    });

    var trench101723253 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:10K) Premy, 8 January 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723253/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723253',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1085, 
        miny: 50.0958, 
        maxx: 3.2265, 
        maxy: 50.1496,
        attribution: ''
    });

//here



    var trench101464837 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 12.NW, 5 May 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464837/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464837',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.693223, 
        miny: 51.148699, 
        maxx: 2.958607, 
        maxy: 51.274570,
        attribution: ''
    });

    var trench101464834 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 12.NW, 14 Aug 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464834/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464834',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.69192063, 
        miny: 51.14676, 
        maxx: 2.9579, 
        maxy: 51.27258,
        attribution: ''
    });




    var trench101464840 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 12.NE, 19 May 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464840/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464840',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.91, 
        miny: 51.14, 
        maxx: 3.19, 
        maxy: 51.27,
        attribution: ''
    });


    var trench101464843 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 12.SW, 3 July 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464843/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464843',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.69, 
        miny: 51.05, 
        maxx: 2.96, 
        maxy: 51.18,
        attribution: ''
    });



    var trench101464846 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 12.SW, 7 May 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464846/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464846',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.69, 
        miny: 51.06, 
        maxx: 2.95, 
        maxy: 51.18,
        attribution: ''
    });


    var trench101464849 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 12.SE, 3 November 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464849/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464849',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9196, 
        miny: 51.057, 
        maxx: 3.1905, 
        maxy: 51.1854,
        attribution: ''
    });



    var trench101464855 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 20.NW, 7 May 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464855/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464855',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.70, 
        miny: 50.96, 
        maxx: 2.96, 
        maxy: 51.09,
        attribution: ''
    });


    var trench101464858 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 20.NE, 10 October 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464858/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464858',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.92, 
        miny: 50.97, 
        maxx: 3.19, 
        maxy: 51.09,
        attribution: ''
    });



    var trench101464861 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 20.SW, 17 October 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464861/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464861',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.70, 
        miny: 50.88, 
        maxx: 2.97, 
        maxy: 51.00,
        attribution: ''
    });



    var trench101464864 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 20.SW, 3 July 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464864/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464864',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.70, 
        miny: 50.88, 
        maxx: 2.96, 
        maxy: 51.00,
        attribution: ''
    });



    var trench101464867 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 20.SW, 5 May 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464867/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464867',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.70, 
        miny: 50.88, 
        maxx: 2.96, 
        maxy: 51.00,
        attribution: ''
    });


    var trench101464870 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 20.SE, 17 December 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464870/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464870',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.93, 
        miny: 50.88, 
        maxx: 3.19, 
        maxy: 51.00,
        attribution: ''
    });


    var trench101464879 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 27.NE, 22 May 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464879/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464879',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.4811, 
        miny: 50.7968, 
        maxx: 2.7377, 
        maxy: 50.912,
        attribution: ''
    });


    var trench101464876 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 27.NW, 22 May 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464876/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464876',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.2535, 
        miny: 50.7926, 
        maxx: 2.5110, 
        maxy: 50.9083,
        attribution: ''
    });

    var trench101464885 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 27.SE, 21 May 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464885/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464885',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.4925, 
        miny: 50.7077, 
        maxx: 2.7348, 
        maxy: 50.8183,
        attribution: ''
    });


    var trench101464882 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 27.SW, 27 July 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464882/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464882',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.2572, 
        miny: 50.7082, 
        maxx: 2.5181, 
        maxy: 50.8186,
        attribution: ''
    });





    var trench101464873 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 20.SE, 17 September 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464873/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464873',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.93, 
        miny: 50.88, 
        maxx: 3.19, 
        maxy: 51.00,
        attribution: ''
    });


    var trench101464897 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 28.NW, 1 April 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464897/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464897',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.70, 
        miny: 50.79, 
        maxx: 2.97, 
        maxy: 50.91,
        attribution: ''
    });


    var trench101464900 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 28.NW, 15 May 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464900/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464900',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.70, 
        miny: 50.78, 
        maxx: 2.96, 
        maxy: 50.91,
        attribution: ''
    });



    var trench101464903 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 28.NW, 30 June 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464903/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464903',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.70, 
        miny: 50.79, 
        maxx: 2.97, 
        maxy: 50.91,
        attribution: ''
    });


    var trench101464900 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 28.NW, 15 May 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464900/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464900',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.704, 
        miny: 50.7896, 
        maxx: 2.9698, 
        maxy: 50.9150,
        attribution: ''
    });


    var trench101464897 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 28.NW, 1 April 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464897/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464897',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.70, 
        miny: 50.79, 
        maxx: 2.97, 
        maxy: 50.91,
        attribution: ''
    });


    var trench101464900 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 28.NW, 15 May 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464900/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464900',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.70, 
        miny: 50.78, 
        maxx: 2.96, 
        maxy: 50.91,
        attribution: ''
    });



    var trench101464903 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 28.NW, 30 June 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464903/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464903',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.70, 
        miny: 50.79, 
        maxx: 2.97, 
        maxy: 50.91,
        attribution: ''
    });



    var trench101464909 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 28.NE, 5 December 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464909/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464909',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.93, 
        miny: 50.79, 
        maxx: 3.19, 
        maxy: 50.91,
        attribution: ''
    });



    var trench101464912 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 28.NE, 1 October 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464912/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464912',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.93, 
        miny: 50.79, 
        maxx: 3.20, 
        maxy: 50.91,
        attribution: ''
    });



    var trench101464915 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 28.NE, 3 July 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464915/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464915',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.93, 
        miny: 50.79, 
        maxx: 3.19, 
        maxy: 50.92,
        attribution: ''
    });



    var trench101464918 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 28.NE, 1 April 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464918/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464918',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.93, 
        miny: 50.79, 
        maxx: 3.19, 
        maxy: 50.91,
        attribution: ''
    });



    var trench101464921 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 28.SW, 25 September 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464921/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464921',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.70, 
        miny: 50.71, 
        maxx: 2.96, 
        maxy: 50.82,
        attribution: ''
    });


    var trench101464924 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 28.SW, 11 July 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464924/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464924',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.71, 
        miny: 50.71, 
        maxx: 2.96, 
        maxy: 50.82,
        attribution: ''
    });



    var trench101464927 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 28.SW, 11 May 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464927/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464927',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.71, 
        miny: 50.71, 
        maxx: 2.97, 
        maxy: 50.82,
        attribution: ''
    });



    var trench101464930 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 28.SW, 1 October 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464930/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464930',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.70, 
        miny: 50.70, 
        maxx: 2.97, 
        maxy: 50.82,
        attribution: ''
    });


    var trench101464933 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 28.SW, 1 April 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464933/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464933',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.71, 
        miny: 50.70, 
        maxx: 2.97, 
        maxy: 50.82,
        attribution: ''
    });



    var trench101464936 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 28.SW, 28 December 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464936/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464936',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.70, 
        miny: 50.69, 
        maxx: 2.97, 
        maxy: 50.82,
        attribution: ''
    });


    var trench101464939 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 28.SW, 22 June 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464939/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464939',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.70, 
        miny: 50.69, 
        maxx: 2.97, 
        maxy: 50.82,
        attribution: ''
    });



    var trench101464942 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 28.SE, 6 September 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464942/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464942',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.94, 
        miny: 50.71, 
        maxx: 3.19, 
        maxy: 50.82,
        attribution: ''
    });



    var trench101464945 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 28.SE, 27 December 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464945/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464945',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.94, 
        miny: 50.71, 
        maxx: 3.19, 
        maxy: 50.82,
        attribution: ''
    });



    var trench101464948 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 28.SE, 1 April 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464948/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464948',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.94, 
        miny: 50.70, 
        maxx: 3.20, 
        maxy: 50.82,
        attribution: ''
    });

    var trench101464951 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 29.NW, 13 October 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464951/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464951',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1636, 
        miny: 50.8094, 
        maxx: 3.4246, 
        maxy: 50.9203,
        attribution: ''
    });

    var trench101464954 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 29.NE, 16 October 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464954/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464954',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.3894, 
        miny: 50.8094, 
        maxx: 3.6441, 
        maxy: 50.9237,
        attribution: ''
    });

    var trench101464957 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 29.SW, 10 October 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464957/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464957',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1655, 
        miny: 50.7192, 
        maxx: 3.4251, 
        maxy: 50.8303,
        attribution: ''
    });



    var trench101464960 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 29.SE, 16 October 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464960/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464960',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.3919, 
        miny: 50.7190, 
        maxx: 3.6464, 
        maxy: 50.8333,
        attribution: ''
    });

    var trench101464966 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36.NW, 24 September 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464966/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464966',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7154, 
        miny: 50.6232, 
        maxx: 2.9667, 
        maxy: 50.7360,
        attribution: ''
    });

    var trench101464963 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36.NW, 26 June 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464963/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464963',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7154, 
        miny: 50.6232, 
        maxx: 2.9667, 
        maxy: 50.7360,
        attribution: ''
    });

    var trench101464972 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36.NE, 21 October 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/10146492/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464972',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9421, 
        miny: 50.6251, 
        maxx: 3.1939, 
        maxy: 50.7384,
        attribution: ''
    });

    var trench101464969 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36.NE, 11 September 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464969/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464969',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9421, 
        miny: 50.6251, 
        maxx: 3.1939, 
        maxy: 50.7384,
        attribution: ''
    });

    var trench101464978 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36.SW, 14 February 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464978/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464978',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7150, 
        miny: 50.5204, 
        maxx: 2.9790, 
        maxy: 50.6457,
        attribution: ''
    });

    var trench101464975 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36.SW, 22 December 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464975/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464975',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7150, 
        miny: 50.5204, 
        maxx: 2.9790, 
        maxy: 50.6457,
        attribution: ''
    });

    var trench101464987 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36.SE, 22 October 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464987/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464987',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9443, 
        miny: 50.5354, 
        maxx: 3.1958, 
        maxy: 50.6495,
        attribution: ''
    });

    var trench101464984 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36.SE, 11 October 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464984/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464984',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9443, 
        miny: 50.5354, 
        maxx: 3.1958, 
        maxy: 50.6495,
        attribution: ''
    });

    var trench101464981 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36.SE, 1 October 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464981/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464981',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9443, 
        miny: 50.5354, 
        maxx: 3.1958, 
        maxy: 50.6495,
        attribution: ''
    });


    var trench101464990 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36A.NW, 27 July 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464990/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464990',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.2610, 
        miny: 50.6161, 
        maxx: 2.5203, 
        maxy: 50.7280,
        attribution: ''
    });

    var trench101464999 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36A.NE, 22 May 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464999/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464999',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.4916, 
        miny: 50.6202, 
        maxx: 2.7417, 
        maxy: 50.7323,
        attribution: ''
    });

    var trench101464996 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36A.NE, 19 June 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464996/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464996',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.4916, 
        miny: 50.6202, 
        maxx: 2.7417, 
        maxy: 50.7323,
        attribution: ''
    });

    var trench101464993 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36A.NE, 7 September 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101464993/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101464993',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.4877, 
        miny: 50.6205, 
        maxx: 2.7398, 
        maxy: 50.7334,
        attribution: ''
    });


    var trench101465002 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36A.SW, 30 May 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465002/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465002',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.2641, 
        miny: 50.5280, 
        maxx: 2.5243, 
        maxy: 50.6372,
        attribution: ''
    });


    var trench101465011 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36C.NW, 12 June 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465011/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465011',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7149, 
        miny: 50.4262, 
        maxx: 2.9785, 
        maxy: 50.5560,
        attribution: ''
    });



    var trench101465008 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36C.NW, 15 November 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465008/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465008',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7198, 
        miny: 50.4367, 
        maxx: 2.9834, 
        maxy: 50.5532,
        attribution: ''
    });



    var trench101465005 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36C.NW, 13 September 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465005/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465005',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7236, 
        miny: 50.4426, 
        maxx: 2.9732, 
        maxy: 50.5550,
        attribution: ''
    });

    var trench101465020 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36C.NE, 22 July 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465020/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465020',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9472, 
        miny: 50.4468, 
        maxx: 3.1997, 
        maxy: 50.5597,
        attribution: ''
    });

    var trench101465017 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36C.NE, 1 October 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465017/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465017',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9480, 
        miny: 50.4463, 
        maxx: 3.1986, 
        maxy: 50.5591,
        attribution: ''
    });

    var trench101465023 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36C.SW, 15 February 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465023/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465023',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7210, 
        miny: 50.332, 
        maxx: 2.9849, 
        maxy: 50.4678,
        attribution: ''
    });



    var trench101465029 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36C.SW, 23 November 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465029/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465029',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7290, 
        miny: 50.3474, 
        maxx: 2.9819, 
        maxy: 50.4663,
        attribution: ''
    });

    var trench101465032 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36C.SW, 13 September 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465032/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465032',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7264, 
        miny: 50.3517, 
        maxx: 2.9779, 
        maxy: 50.4661,
        attribution: ''
    });

    var trench101465035 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 36C.SE, 16 Nov 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465035/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465035',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9447, 
        miny: 50.3420, 
        maxx: 3.2079, 
        maxy: 50.4683,
        attribution: ''
    });


    var trench101465050 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 51A.SE, 26 September 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465050/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465050',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.4043, 
        miny: 50.1791, 
        maxx: 3.6521, 
        maxy: 50.2929,
        attribution: ''
    });

    var trench101465044 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 51A.SW, 18 September 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465044/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465044',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1808, 
        miny: 50.1806, 
        maxx: 3.4273, 
        maxy: 50.2903,
        attribution: ''
    });

    var trench101465047 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 51A.SE, 12 October 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465047/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465047',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.3996, 
        miny: 50.1821, 
        maxx: 3.6577, 
        maxy: 50.2927,
        attribution: ''
    });

    var trench101465071 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 51B.NW, 10 October 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465071/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465071',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7340, 
        miny: 50.2670, 
        maxx: 2.9726, 
        maxy: 50.3767,
        attribution: ''
    });

    var trench101465068 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 51B.NW, 4 March 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465068/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465068',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7340, 
        miny: 50.2670, 
        maxx: 2.9726, 
        maxy: 50.3767,
        attribution: ''
    });

    var trench101465065 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 51B.NW, 25 May 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465065/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465065',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7340, 
        miny: 50.2670, 
        maxx: 2.9726, 
        maxy: 50.3767,
        attribution: ''
    });

    var trench101465062 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 51B.NW, 20 November 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465062/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465062',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7340, 
        miny: 50.2670, 
        maxx: 2.9726, 
        maxy: 50.3767,
        attribution: ''
    });

    var trench101465059 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 51B.NW, 6 March 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465059/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465059',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7340, 
        miny: 50.2670, 
        maxx: 2.9726, 
        maxy: 50.3767,
        attribution: ''
    });

    var trench101465056 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 51B.NW, 8 July 1918 (ed.10e)",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465056/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465056',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7325, 
        miny: 50.2656, 
        maxx: 2.9811, 
        maxy: 50.3745,
        attribution: ''
    });

    var trench101465053 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 51B.NW, 8 July 1918 (ed.11a)",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465053/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465053',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7286, 
        miny: 50.2630, 
        maxx: 2.9790, 
        maxy: 50.3762,
        attribution: ''
    });

    var trench101465095 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 51B.NE, 3 February 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465095/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465095',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9554, 
        miny: 50.2691, 
        maxx: 3.2033, 
        maxy: 50.3784,
        attribution: ''
    });

    var trench101465092 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 51B.NE, 13 April 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465092/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465092',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9554, 
        miny: 50.2691, 
        maxx: 3.2033, 
        maxy: 50.3784,
        attribution: ''
    });

    var trench101465089 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 51B.NE, 2 January 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465089/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465089',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9554, 
        miny: 50.2691, 
        maxx: 3.2033, 
        maxy: 50.3784,
        attribution: ''
    });

    var trench101465086 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 51B.NE, 22 August 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465086/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465086',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9554, 
        miny: 50.2691, 
        maxx: 3.2033, 
        maxy: 50.3784,
        attribution: ''
    });

    var trench101465083 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 51B.SW, 9 August 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465083/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465083',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7292, 
        miny: 50.1591, 
        maxx: 2.9907, 
        maxy: 50.2847,
        attribution: ''
    });

    var trench101465080 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 51B.SW, 4 March 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465080/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465080',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7292, 
        miny: 50.1591, 
        maxx: 2.9907, 
        maxy: 50.2847,
        attribution: ''
    });

    var trench101465077 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 51B.SW, 8 March 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465077/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465077',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7292, 
        miny: 50.1591, 
        maxx: 2.9907, 
        maxy: 50.2847,
        attribution: ''
    });

    var trench101465074 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 51B.SW, 25 April 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465074/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '10146507',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7292, 
        miny: 50.1591, 
        maxx: 2.9907, 
        maxy: 50.2847,
        attribution: ''
    });

    var trench101465098 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 51B.SE, 30 October 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465098/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465098',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9510, 
        miny: 50.1643, 
        maxx: 3.2122, 
        maxy: 50.2903,
        attribution: ''
    });

    var trench101465104 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 51C.NE, 16 March 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465104/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465104',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.4996, 
        miny: 50.2600, 
        maxx: 2.7561, 
        maxy: 50.3705,
        attribution: ''
    });

    var trench101465101 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 51C.NE, 6 May 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465101/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465101',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.4996, 
        miny: 50.2600, 
        maxx: 2.7561, 
        maxy: 50.3705,
        attribution: ''
    });

    var trench101465107 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 51C.SE, 22 June 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465107/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465107',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5047, 
        miny: 50.1527, 
        maxx: 2.7656, 
        maxy: 50.2813,
        attribution: ''
    });

    var trench101465119 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57B.NW, 28 October 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465119/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465119',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1764, 
        miny: 50.0904, 
        maxx: 3.4347, 
        maxy: 50.2011,
        attribution: ''
    });

    var trench101465116 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57B.NW, 7 October 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465116/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465116',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1764, 
        miny: 50.0904, 
        maxx: 3.4347, 
        maxy: 50.2011,
        attribution: ''
    });

    var trench101465122 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57B.NE, 29 September 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465122/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465122',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.4066, 
        miny: 50.0926, 
        maxx: 3.6530, 
        maxy: 50.2027,
        attribution: ''
    });

    var trench101465137 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57B.SW, 8 November 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465137/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465137',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1805, 
        miny: 49.9863, 
        maxx: 3.4406, 
        maxy: 50.1123,
        attribution: ''
    });

    var trench101465134 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57B.SW, 20 January 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465134/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465134',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1805, 
        miny: 49.9863, 
        maxx: 3.4423, 
        maxy: 50.1132,
        attribution: ''
    });

    var trench101465131 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57B.SW, 29 August 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465131/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465131',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1805, 
        miny: 49.9863, 
        maxx: 3.4423, 
        maxy: 50.1132,
        attribution: ''
    });

    var trench101465128 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57B.SW, 21 September 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465128/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465128',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1805, 
        miny: 49.9863, 
        maxx: 3.4423, 
        maxy: 50.1132,
        attribution: ''
    });

    var trench101465140 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57B.SE, 30 September 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465140/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465140',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.4077, 
        miny: 50.0017, 
        maxx: 3.6550, 
        maxy: 50.1125,
        attribution: ''
    });

    var trench101465161 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57C.NW, 9 August 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465161/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465161',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7306, 
        miny: 50.0713, 
        maxx: 2.9906, 
        maxy: 50.1943,
        attribution: ''
    });

    var trench101465158 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57C.NW, 27 November 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465158/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465158',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7306, 
        miny: 50.0714, 
        maxx: 2.9912, 
        maxy: 50.1964,
        attribution: ''
    });

    var trench101465155 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57C.NW, 13 April 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465155/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465155',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7290, 
        miny: 50.0714, 
        maxx: 2.9888, 
        maxy: 50.1963,
        attribution: ''
    });

    var trench101465152 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57C.NW, 27 October 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465152/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465152',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7309, 
        miny: 50.0699, 
        maxx: 2.9903, 
        maxy: 50.1947,
        attribution: ''
    });

    var trench101465149 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57C.NW, 21 March 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465149/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465149',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7297, 
        miny: 50.0808, 
        maxx: 2.9858, 
        maxy: 50.2007,
        attribution: ''
    });

    var trench101465146 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57C.NW, 4 July 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465146/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465146',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7311, 
        miny: 50.0846, 
        maxx: 2.9858, 
        maxy: 50.1937,
        attribution: ''
    });

    var trench101465164 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57C.NE, 20 September 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465164/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465164',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9535, 
        miny: 50.0729, 
        maxx: 3.2143, 
        maxy: 50.1983,
        attribution: ''
    });

    var trench101465167 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57C.NE, 21 September 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465167/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465167',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9539, 
        miny: 50.0896, 
        maxx: 3.2103, 
        maxy: 50.1986,
        attribution: ''
    });

    var trench101465194 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57C.SW, 5 May 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465194/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465194',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.73518, 
        miny: 49.9797, 
        maxx: 2.9951, 
        maxy: 50.10386,
        attribution: ''
    });

    var trench101465191 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57C.SW, 21 July 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465191/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465191',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7350, 
        miny: 49.9813, 
        maxx: 2.9958, 
        maxy: 50.1049,
        attribution: ''
    });

    var trench101465188 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57C.SW, 3 September 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465188/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465188',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7360, 
        miny: 49.9815, 
        maxx: 2.9942, 
        maxy: 50.1047,
        attribution: ''
    });

    var trench101465185 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57C.SW, 7 October 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465185/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465185',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.732, 
        miny: 49.9804, 
        maxx: 2.9940, 
        maxy: 50.1048,
        attribution: ''
    });

    var trench101465182 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57C.SW, 5 December 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465182/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465182',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7318, 
        miny: 49.9790, 
        maxx: 2.9920, 
        maxy: 50.1034,
        attribution: ''
    });

    var trench101465179 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57C.SW, 5 Dec 1916 (additions)",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465179/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465179',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7302, 
        miny: 49.9774, 
        maxx: 2.9913, 
        maxy: 50.1025,
        attribution: ''
    });

    var trench101465176 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57C.SW, 1 January 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465176/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465176',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7347, 
        miny: 49.9802, 
        maxx: 2.9947, 
        maxy: 50.1046,
        attribution: ''
    });

    var trench101465170 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57C.SW, 16 March 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465170/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465170',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7427, 
        miny: 49.9944, 
        maxx: 2.9989, 
        maxy: 50.1027,
        attribution: ''
    });

    var trench101465209 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57C.SE, 11 May 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465209/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465209',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9559, 
        miny: 49.9846, 
        maxx: 3.2158, 
        maxy: 50.1093,
        attribution: ''
    });

    var trench101465206 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57C.SE, 24 October 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465206/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465206',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9722, 
        miny: 49.9978, 
        maxx: 3.2062, 
        maxy: 50.1063,
        attribution: ''
    });

    var trench101465203 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57C.SE, 20 November 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465203/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465203',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9557, 
        miny: 49.9834, 
        maxx: 3.2166, 
        maxy: 50.1104,
        attribution: ''
    });

    var trench101465200 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57C.SE, 10 March 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465200/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465200',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9655, 
        miny: 49.9977, 
        maxx: 3.2052, 
        maxy: 50.1086,
        attribution: ''
    });


    var trench101465197 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57C.SE, 22 September 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465197/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465197',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9620, 
        miny: 49.9984, 
        maxx: 3.2079, 
        maxy: 50.1079,
        attribution: ''
    });

    var trench101465224 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57D.NE, 8 March 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465224/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465224',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5081, 
        miny: 50.0628, 
        maxx: 2.7682, 
        maxy: 50.1926,
        attribution: ''
    });

    var trench101465221 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57D.NE, 16 May 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465221/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465221',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5068, 
        miny: 50.0654, 
        maxx: 2.7696, 
        maxy: 50.1919,
        attribution: ''
    });

    var trench101465218 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57D.NE, 20 October 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465218/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465218',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5068, 
        miny: 50.0654, 
        maxx: 2.7696, 
        maxy: 50.1919,
        attribution: ''
    });

    var trench101465215 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57D.NE, 8 April 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465215/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465215',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5071, 
        miny: 50.0851, 
        maxx: 2.7595, 
        maxy: 50.1931,
        attribution: ''
    });

    var trench101465212 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57D.NE, 22 April 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465212/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465212',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5076, 
        miny: 50.0850, 
        maxx: 2.7622, 
        maxy: 50.1931,
        attribution: ''
    });

    var trench101465251 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57D.SE, 28 April 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465251/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465251',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5107, 
        miny: 49.9779, 
        maxx: 2.7711, 
        maxy: 50.1018,
        attribution: ''
    });

    var trench101465248 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57D.SE, 15 August 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465248/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465248',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5107, 
        miny: 49.9779, 
        maxx: 2.7711, 
        maxy: 50.1018,
        attribution: ''
    });

    var trench101465245 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57D.SE, 6 February 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465245/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465245',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5107, 
        miny: 49.9779, 
        maxx: 2.7711, 
        maxy: 50.1018,
        attribution: ''
    });

    var trench101465242 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57D.SE, 17 February 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465242/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465242',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5107, 
        miny: 49.9779, 
        maxx: 2.7711, 
        maxy: 50.1018,
        attribution: ''
    });

    var trench101465239 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57D.SE, 7 April 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465239/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465239',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5107, 
        miny: 49.9779, 
        maxx: 2.7711, 
        maxy: 50.1018,
        attribution: ''
    });

    var trench101465236 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57D.SE, 3 May 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465236/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465236',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5107, 
        miny: 49.9779, 
        maxx: 2.7711, 
        maxy: 50.1018,
        attribution: ''
    });

    var trench101465233 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57D.SE, 22 May 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465233/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465233',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5107, 
        miny: 49.9779, 
        maxx: 2.7711, 
        maxy: 50.1018,
        attribution: ''
    });

    var trench101465230 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57D.SE, 15 June 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465230/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465230',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5107, 
        miny: 49.9779, 
        maxx: 2.7711, 
        maxy: 50.1018,
        attribution: ''
    });

    var trench101465227 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 57D.SE, 17 July 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465227/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465227',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5107, 
        miny: 49.9779, 
        maxx: 2.7711, 
        maxy: 50.1018,
        attribution: ''
    });

    var trench101465257 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62B.NW, 21 November 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465257/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465257',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1808, 
        miny: 49.9113, 
        maxx: 3.4379, 
        maxy: 50.0200,
        attribution: ''
    });

    var trench101465257 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62B.NW, 21 November 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465257/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465257',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1833, 
        miny: 49.8970, 
        maxx: 3.4435, 
        maxy: 50.0209,
        attribution: ''
    });



    var trench101465254 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62B.NW, 19 September 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465254/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465254',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1808, 
        miny: 49.9113, 
        maxx: 3.4379, 
        maxy: 50.0200,
        attribution: ''
    });

    var trench101465263 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62B.NE, 2 September 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465263/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465263',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.4118, 
        miny: 49.9107, 
        maxx: 3.6663, 
        maxy: 50.0213,
        attribution: ''
    });

    var trench101465260 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62B.NE, 1 October 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465260/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465260',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.4118, 
        miny: 49.9107, 
        maxx: 3.6663, 
        maxy: 50.0213,
        attribution: ''
    });

    var trench101465269 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62B.SW, 6 November 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465269/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465269',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1861, 
        miny: 49.8078, 
        maxx: 3.4452, 
        maxy: 49.9330,
        attribution: ''
    });

    var trench101465266 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62B.SW, 3 February 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465266/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465266',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1861, 
        miny: 49.8078, 
        maxx: 3.4452, 
        maxy: 49.9330,
        attribution: ''
    });

    var trench101465275 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62B.SE, 2 September 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465275/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465275',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.4119, 
        miny: 49.8201, 
        maxx: 3.6711, 
        maxy: 49.9318,
        attribution: ''
    });

    var trench101465272 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62B.SE, 9 October 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465272/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465272',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.4119, 
        miny: 49.8201, 
        maxx: 3.6711, 
        maxy: 49.9318,
        attribution: ''
    });

    var trench101465287 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62C.NW, 3 September 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465287/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465287',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7413, 
        miny: 49.9028, 
        maxx: 2.9940, 
        maxy: 50.0108,
        attribution: ''
    });

    var trench101465284 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62C.NW, 20 November 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465284/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465284',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7413, 
        miny: 49.9028, 
        maxx: 2.9940, 
        maxy: 50.0108,
        attribution: ''
    });

    var trench101465281 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62C.NW, 8 January 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465281/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465281',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7413, 
        miny: 49.9028, 
        maxx: 2.9940, 
        maxy: 50.0108,
        attribution: ''
    });

    var trench101465278 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62C.NW, 6 March 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465278/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465278',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7413, 
        miny: 49.9028, 
        maxx: 2.9940, 
        maxy: 50.0108,
        attribution: ''
    });

    var trench101465293 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62C.NE, 2 July 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465293/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465293',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9597, 
        miny: 49.8946, 
        maxx: 3.2196, 
        maxy: 50.0198,
        attribution: ''
    });

    var trench101465290 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62C.NE, 21 February 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465290/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465290',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9597, 
        miny: 49.8946, 
        maxx: 3.2196, 
        maxy: 50.0198,
        attribution: ''
    });

    var trench101465302 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62C.SW, 14 January 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465302/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465302',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7363, 
        miny: 49.79806, 
        maxx: 2.9968, 
        maxy: 49.9260,
        attribution: ''
    });

    var trench101465296 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62C.SW, 11 March 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465296/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465296',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7363, 
        miny: 49.79806, 
        maxx: 2.9968, 
        maxy: 49.9260,
        attribution: ''
    });

    var trench101465308 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62C.SE, 30 January 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465308/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465308',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9599, 
        miny: 49.8001, 
        maxx: 3.2189, 
        maxy: 49.9294,
        attribution: ''
    });

    var trench101465305 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62C.SE, 2 February 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465305/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465305',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9599, 
        miny: 49.8001, 
        maxx: 3.2189, 
        maxy: 49.9294,
        attribution: ''
    });

    var trench101465311 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62C.NW, 2 July 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465311/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465311',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.2906, 
        miny: 49.9001, 
        maxx: 2.5449, 
        maxy: 50.0087,
        attribution: ''
    });


    var trench101465323 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62D.NE, 25 April 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465323/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465323',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5139, 
        miny: 49.8867, 
        maxx: 2.7733, 
        maxy: 50.0106,
        attribution: ''
    });

    var trench101465320 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62D.NE, 30 April 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465320/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465320',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5139, 
        miny: 49.8867, 
        maxx: 2.7733, 
        maxy: 50.0106,
        attribution: ''
    });

    var trench101465317 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62D.NE, 28 May 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465317/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465317',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5139, 
        miny: 49.9038, 
        maxx: 2.7688, 
        maxy: 50.0122,
        attribution: ''
    });

    var trench101465314 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62D.NE, 3 August 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465314/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465314',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5139, 
        miny: 49.9038, 
        maxx: 2.7688, 
        maxy: 50.0122,
        attribution: ''
    });


    var trench101465368 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62.NE/NW, 17 Nov 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465368/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465368',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.6429, 
        miny: 49.7308, 
        maxx: 2.8731, 
        maxy: 49.8266,
        attribution: ''
    });

    var trench101465365 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62.NE/NW, 21 Feb 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465365/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465365',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.6429, 
        miny: 49.7308, 
        maxx: 2.8731, 
        maxy: 49.8266,
        attribution: ''
    });



    var trench101465329 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62D.SE, 5 June 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465329/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465329',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5210, 
        miny: 49.8101, 
        maxx: 2.7671, 
        maxy: 49.9220,
        attribution: ''
    });

    var trench101465326 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62D.SE, 31 July 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465326/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465326',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5210, 
        miny: 49.8101, 
        maxx: 2.7671, 
        maxy: 49.9220,
        attribution: ''
    });

    var trench101465332 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62E.NE, 22 May 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465332/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465332',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.0756, 
        miny: 49.8934, 
        maxx: 2.3193, 
        maxy: 50.0043,
        attribution: ''
    });

    var trench101465341 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62C.NW, 8 November 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465341/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465341',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1877, 
        miny: 49.7159, 
        maxx: 3.4469, 
        maxy: 49.8416,
        attribution: ''
    });

    var trench101465344 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62C.NW, 12 December 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465344/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465344',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1865, 
        miny: 49.7281, 
        maxx: 3.3314, 
        maxy: 49.8424,
        attribution: ''
    });

    var trench101465338 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62C.NW, 13 January 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465338/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465338',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1877, 
        miny: 49.7159, 
        maxx: 3.4469, 
        maxy: 49.8416,
        attribution: ''
    });

    var trench101465335 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 62C.NW, 20 March 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465335/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465335',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1877, 
        miny: 49.7159, 
        maxx: 3.4469, 
        maxy: 49.8416,
        attribution: ''
    });

    var trench101465347 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 66C.NE, 12 February 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465347/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465347',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.4068, 
        miny: 49.7269, 
        maxx: 3.6625, 
        maxy: 49.8432,
        attribution: ''
    });

    var trench101465350 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 66C.SW, 5 January 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465350/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465350',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1894, 
        miny: 49.6253, 
        maxx: 3.4483, 
        maxy: 49.7512,
        attribution: ''
    });

    var trench101465353 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 66D.NE, 3 February 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465353/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465353',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9723, 
        miny: 49.7289, 
        maxx: 3.2100, 
        maxy: 49.8396,
        attribution: ''
    });

    var trench101465356 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 66D.SW, 10 November 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465356/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465356',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7566, 
        miny: 49.6419, 
        maxx: 2.98746, 
        maxy: 49.7385,
        attribution: ''
    });

    var trench101465359 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 66D.SE, 11 January 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465359/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465359',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9655, 
        miny: 49.6368, 
        maxx: 3.2239, 
        maxy: 49.7489,
        attribution: ''
    });

    var trench101465371 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 66D.SE/SW, 14 March 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465371/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465371',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.6455, 
        miny: 49.6402, 
        maxx: 2.8773, 
        maxy: 49.7373,
        attribution: ''
    });

    var trench101465362 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 66E.NE, 14 March 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465362/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465362',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5260, 
        miny: 49.7212, 
        maxx: 2.7698, 
        maxy: 49.8322,
        attribution: ''
    });

    var trench101465377 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 70D.NW, 12 October 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465377/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465377',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1929, 
        miny: 49.5344, 
        maxx: 3.4518, 
        maxy: 49.6607,
        attribution: ''
    });

    var trench101465374 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 70D.NW, 16 February 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465374/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465374',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1929, 
        miny: 49.5344, 
        maxx: 3.4518, 
        maxy: 49.6607,
        attribution: ''
    });

    var trench101465380 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 70D.SW, 9 January 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465380/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465380',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.1922, 
        miny: 49.4565, 
        maxx: 3.4452, 
        maxy: 49.5735,
        attribution: ''
    });

    var trench101465383 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 70E.NE, 18 March 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465383/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465383',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9712, 
        miny: 49.5407, 
        maxx: 3.2238, 
        maxy: 49.6618,
        attribution: ''
    });

    var trench101465386 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 70E.SE, 11 January 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465386/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465386',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9741, 
        miny: 49.4550, 
        maxx: 3.2278, 
        maxy: 49.5756,
        attribution: ''
    });

    var trench101465389 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 75.NE, 20 April 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465389/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465389',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.4153, 
        miny: 49.3568, 
        maxx: 3.6746, 
        maxy: 49.4839,
        attribution: ''
    });

    var trench101465392 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 76.NW, 22 April 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465392/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465392',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.6345, 
        miny: 49.3580, 
        maxx: 3.8931, 
        maxy: 49.4855,
        attribution: ''
    });

    var trench101465395 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 76.NE, 20 April 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465395/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465395',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.8570, 
        miny: 49.3580, 
        maxx: 4.1151, 
        maxy: 49.4868,
        attribution: ''
    });

    var trench101465398 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) 76.SE, 20 April 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101465398/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101465398',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.8575, 
        miny: 49.2683, 
        maxx: 4.1165, 
        maxy: 49.3952,
        attribution: ''
    });

    var trench101723235 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) First Army Front. Map C, 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723235/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723235',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7090, 
        miny: 50.3948, 
        maxx: 2.8157, 
        maxy: 50.4506,
        attribution: ''
    });

    var trench101723238 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) First Army Front. Map E, 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723238/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723238',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7359, 
        miny: 50.3215, 
        maxx: 2.8456, 
        maxy: 50.3787,
        attribution: ''
    });

    var trench101723833 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) Hendecourt, 25 Sept 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723833/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723833',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.8497, 
        miny: 50.1598, 
        maxx: 3.07370, 
        maxy: 50.2620,
        attribution: ''
    });

    var trench101723202 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) Maurepas, ca. 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723202/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723202',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.7487, 
        miny: 49.9299, 
        maxx: 2.8643, 
        maxy: 50.0703,
        attribution: ''
    });

    var trench101724065 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) Merris, 15 June 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101724065/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101724065',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5225, 
        miny: 50.6627, 
        maxx: 2.7740, 
        maxy: 50.7649,
        attribution: ''
    });

    var trench101724042 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) Moeuvres, 14 December 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101724042/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101724042',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9541, 
        miny: 50.0863, 
        maxx: 3.1785, 
        maxy: 50.1893,
        attribution: ''
    });

    var trench101724045 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) Moeuvres, 3 January 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101724045/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101724045',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.9538, 
        miny: 50.0863, 
        maxx: 3.1785, 
        maxy: 50.1904,
        attribution: ''
    });

    var trench101724024 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) Niergnies, 24 November 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101724024/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101724024',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.0772, 
        miny: 50.0954, 
        maxx: 3.3081, 
        maxy: 50.1914,
        attribution: ''
    });

    var trench101724039 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) Sauchy-Cauchy, 19 Nov 1917",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101724039/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101724039',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 3.0663, 
        miny: 50.1846, 
        maxx: 3.2917, 
        maxy: 50.2834,
        attribution: ''
    });

    var trench101723830 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:20K) Vieille Chapelle, 18 June 1918",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723830/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723830',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.5568, 
        miny: 50.5463, 
        maxx: 2.7911, 
        maxy: 50.6509,
        attribution: ''
    });

    var trench101723165 = new ol.layer.Tile({
	title: "Belgium/France, WW1 Trench maps - (1:40K) Map of the Somme, Dec 1916",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata3/trench/101723165/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101723165',
        group_no: '60',
        key: 'geo.nls.uk/mapdata3/trench/key/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: 2.6136, 
        miny: 49.9085, 
        maxx: 3.0981, 
        maxy: 50.1688,
        attribution: ''
    });



    var adch101942045 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 35.Scapa Flow North, 1944",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942045/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942045',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.3627, 
        miny: 58.7770, 
        maxx: -2.8122, 
        maxy: 58.9693,
    });


    var adch101942048 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 35.Scapa Flow North, 1946",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942048/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942048',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.3627, 
        miny: 58.7770, 
        maxx: -2.8122, 
        maxy: 58.9693,
          attribution: 'We are very grateful to <a href="http://www.davidrumsey.com/">David Rumsey</a> for supporting the scanning and georeferencing of this chart'
    });

    var adch101942078 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 41.Port Ellen or Loch Leodamis, 1832",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942078/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942078',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.28, 
        miny: 55.58, 
        maxx: -6.12, 
        maxy: 55.65
    });




    var adch101942108 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 46.Ailsa Craig to Bl. Foreland, 1913",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942108/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942108',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -8.3983, 
        miny: 54.7090, 
        maxx: -5.6126, 
        maxy: 55.7490
    });

    var adch101942111 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 46.Ailsa Craig to Bl. Foreland, 1941",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942111/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942111',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -8.3983, 
        miny: 54.7090, 
        maxx: -5.6126, 
        maxy: 55.7490
    });

    var adch101942114 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 46.Ailsa Craig to Bl. Foreland, 1948",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942114/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942114',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -8.4373, 
        miny: 54.7143, 
        maxx: -4.9900, 
        maxy: 55.7498
    });

    var adch101942117 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 46.Ailsa Craig to Bl. Foreland, 1958",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942117/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942117',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -8.4082, 
        miny: 54.7111, 
        maxx: -5.0070, 
        maxy: 55.7568
    });





var adch101942630 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114b.Fisherrow to Queensferry, 1860",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942630/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942630',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.4592, 
        miny: 55.9352, 
        maxx: -3.0431, 
        maxy: 56.0903
    });

  var adch74412450 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114b.Fisherrow to Port Edgar, 1899",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74412450/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74412450',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.4592, 
        miny: 55.9352, 
        maxx: -3.0431, 
        maxy: 56.0903
    });

  var adch101942603 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114b.Fisherrow to Port Edgar, 1901",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942603/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942603',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.4592, 
        miny: 55.9352, 
        maxx: -3.0431, 
        maxy: 56.0903
    });

  var adch101942606 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114b.Fisherrow to Port Edgar, 1907",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942606/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942606',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.4592, 
        miny: 55.9352, 
        maxx: -3.0431, 
        maxy: 56.0903
    });

  var adch101942612 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114b.Fisherrow to Port Edgar, 1919",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942612/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942612',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.4592, 
        miny: 55.9352, 
        maxx: -3.0431, 
        maxy: 56.0903
    });

  var adch101942615 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114b.Fisherrow to Port Edgar, 1920",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942615/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942615',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.4592, 
        miny: 55.9352, 
        maxx: -3.0431, 
        maxy: 56.0903
    });

  var adch101942618 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114b.Fisherrow to Port Edgar, 1929",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942618/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942618',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.4592, 
        miny: 55.9352, 
        maxx: -3.0431, 
        maxy: 56.0903
    });

  var adch101942621 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114b.Fisherrow to Port Edgar, 1938",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942621/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942621',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.4397, 
        miny: 55.9390, 
        maxx: -3.0431, 
        maxy: 56.0886
    });

  var adch101942624 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114b.Fisherrow to Port Edgar, 1946",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942624/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942624',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.4397, 
        miny: 55.9390, 
        maxx: -3.0384, 
        maxy: 56.0886
    });

  var adch101942627 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114b.Fisherrow to Port Edgar, 1952",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942627/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942627',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.4422, 
        miny: 55.9390, 
        maxx: -3.03407, 
        maxy: 56.0900
    });

  var adch101942633 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114c.Queensferry to Stirling, 1860",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942633/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942633',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.9648, 
        miny: 55.9730, 
        maxx: -3.3698, 
        maxy: 56.1536
    });

  var adch101942687 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114c.Port Edgar to Carron, 1899",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942687/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942687',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.7052, 
        miny: 55.9571, 
        maxx: -3.3716, 
        maxy: 56.07622
    });

  var adch101942690 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114c.Port Edgar to Carron, 1906",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942690/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942690',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.7052, 
        miny: 55.9571, 
        maxx: -3.3716, 
        maxy: 56.07681
    });

  var adch101942693 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114c.Port Edgar to Carron, 1913",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942693/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942693',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.7052, 
        miny: 55.9571, 
        maxx: -3.3716, 
        maxy: 56.07681
    });

  var adch101942696 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114c.Port Edgar to Carron, 1915",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942696/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942696',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.7052, 
        miny: 55.9571, 
        maxx: -3.3740, 
        maxy: 56.07681
    });

  var adch101942699 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114c.Port Edgar to Carron, 1918",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942699/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942699',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.7052, 
        miny: 55.9560, 
        maxx: -3.3737, 
        maxy: 56.07681
    });

  var adch101942702 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114c.Port Edgar to Carron, 1919",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942702/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942702',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.7052, 
        miny: 55.9560, 
        maxx: -3.3737, 
        maxy: 56.07681
    });

  var adch101942705 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114c.Port Edgar to Carron, 1925",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942705/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942705',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.7052, 
        miny: 55.9601, 
        maxx: -3.3716, 
        maxy: 56.07684
    });

  var adch101942708 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114c.Port Edgar to Carron, 1929",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942708/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942708',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.7102, 
        miny: 55.9601, 
        maxx: -3.3694, 
        maxy: 56.07939
    });

  var adch101942711 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114c.Port Edgar to Carron, 1930",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942711/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942711',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.7102, 
        miny: 55.9601, 
        maxx: -3.3694, 
        maxy: 56.07939
    });

  var adch101942714 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114c.Port Edgar to Carron, 1952",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942714/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942714',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.7050, 
        miny: 55.9594, 
        maxx: -3.3738, 
        maxy: 56.0779
    });

  var adch101942717 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114c.Port Edgar to Carron, 1960",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942717/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942717',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.7050, 
        miny: 55.9594, 
        maxx: -3.3738, 
        maxy: 56.0779
    });

  var adch101942669 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114c.Port Edgar to Carron, 1960",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942669/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942669',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.9594, 
        miny: 55.9849, 
        maxx: -3.6510, 
        maxy: 56.1451
    });

  var adch101942672 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114d.Carron River to Stirling, 1918",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942672/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942672',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.9633, 
        miny: 55.9851, 
        maxx: -3.6443, 
        maxy: 56.14485
    });

  var adch101942675 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114d.Carron River to Stirling, 1925",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942675/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942675',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.9633, 
        miny: 55.9851, 
        maxx: -3.6443, 
        maxy: 56.14485
    });

  var adch101942675 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114d.Carron River to Stirling, 1925",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942675/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942675',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.9633, 
        miny: 55.9851, 
        maxx: -3.6443, 
        maxy: 56.14485
    });

  var adch101942678 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114d.Carron River to Stirling, 1929",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942678/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942678',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.9633, 
        miny: 55.9851, 
        maxx: -3.6443, 
        maxy: 56.14485
    });

  var adch101942681 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 114d.Carron River to Stirling, 1941",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942681/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942681',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.9598, 
        miny: 55.9724, 
        maxx: -3.6477, 
        maxy: 56.1468
    });


    var adch101942735 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 115.The Pentland Firth, 1830",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942735/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        mosaic_id: '101942735',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.4578, 
        miny: 58.5968, 
        maxx: -2.8169, 
        maxy: 58.8577
    });

    var adch101942726 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 115.Peterhead to Pentland Firth, 1916",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942726/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '101942726',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.4303, 
        miny: 57.3984, 
        maxx: -1.4810, 
        maxy: 58.9038
    });

    var adch101942729 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 115.Peterhead to Pentland Firth, 1935",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942729/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '101942729',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.4303, 
        miny: 57.4138, 
        maxx: -1.4810, 
        maxy: 58.9038
    });

    var adch101942732 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 115.Peterhead to Pentland Firth, 1942",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942732/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '101942732',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.4569, 
        miny: 57.4206, 
        maxx: -1.4541, 
        maxy: 58.9140
    });

    var adch101942741 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 116.Balta Sound, Unst 1827",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942741/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101942741',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -0.8736, 
        miny: 60.7265, 
        maxx: 0.7296, 
        maxy: 60.7810
    });

    var adch101942738 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 116.Firth of Forth, 1960",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942738/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '101942738',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.4218, 
        miny: 55.9829, 
        maxx: -3.2576, 
        maxy: 56.0457
    });

    var adch101942759 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 119.Forth Bridge to Crombie Pr, 1960",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942759/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '101942759',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.541289, 
        miny: 55.9829, 
        maxx: -3.37771, 
        maxy: 56.0457
    });

    var adch101942762 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 119.Forth Bridge to Crombie Pr, 1963",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942762/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '101942762',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.5412, 
        miny: 55.9829, 
        maxx: -3.3770, 
        maxy: 56.0459
    });

    var adch101942906_inset2 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 137.inset Burntisland, 1918",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942906_inset2/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: 'adch101942906_inset2',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.2504, 
        miny: 56.0474, 
        maxx: -3.2188, 
        maxy: 56.0653
    });

    var adch101942909_inset2 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 137.inset Burntisland, 1945",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942909_inset2/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101942909_inset2',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.2504, 
        miny: 56.0474, 
        maxx: -3.2188, 
        maxy: 56.0653
    });

    var adch101942912_inset2 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 137.inset Burntisland, 1957",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942912_inset2/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101942912_inset2',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.2504, 
        miny: 56.0474, 
        maxx: -3.2188, 
        maxy: 56.0653
    });

    var adch101942915_inset2 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 137.inset Burntisland, 1962",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942915_inset2/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101942915_inset2',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.2504, 
        miny: 56.0474, 
        maxx: -3.2188, 
        maxy: 56.0653
    });

    var adch101942912_inset4 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 137.inset Eyemouth, 1957",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942912_inset4/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101942912_inset4',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.0976, 
        miny: 55.8686, 
        maxx: -2.0790, 
        maxy: 55.8826
    });

    var adch101942915_inset4 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 137.inset Eyemouth, 1962",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942915_inset4/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101942915_inset4',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.0976, 
        miny: 55.8686, 
        maxx: -2.0790, 
        maxy: 55.8826
    });

    var adch101942906_inset3 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 137.inset Kirkcaldy, 1918",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942906_inset3/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101942906_inset3',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.1596, 
        miny: 56.1092, 
        maxx: -3.1424, 
        maxy: 56.1210
    });

    var adch101942909_inset3 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 137.inset Kirkcaldy, 1953",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942909_inset3/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101942909_inset3',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.1596, 
        miny: 56.1092, 
        maxx: -3.1424, 
        maxy: 56.1210
    });

    var adch101942912_inset3 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 137.inset Kirkcaldy, 1957",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942912_inset3/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101942912_inset3',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.1596, 
        miny: 56.1092, 
        maxx: -3.1424, 
        maxy: 56.1210
    });

    var adch101942915_inset3 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 137.inset Kirkcaldy, 1962",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942915_inset3/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101942915_inset3',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.1596, 
        miny: 56.1092, 
        maxx: -3.1424, 
        maxy: 56.1210
    });

    var adch101942906_inset1 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 137.inset Methil, 1918",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942906_inset1/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101942906_inset1',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.0283, 
        miny: 56.1649, 
        maxx: -2.9791, 
        maxy: 56.1942
    });

    var adch101942909_inset1 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 137.inset Methil, 1953",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942909_inset1/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101942909_inset1',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.0283, 
        miny: 56.1649, 
        maxx: -2.9791, 
        maxy: 56.1942
    });

    var adch101942912_inset1 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 137.inset Methil, 1957",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942912_inset1/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101942912_inset1',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.0283, 
        miny: 56.1649, 
        maxx: -2.9791, 
        maxy: 56.1942
    });

    var adch101942915_inset1 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 137.inset Methil, 1962",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942915_inset1/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101942915_inset1',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.0283, 
        miny: 56.1649, 
        maxx: -2.9791, 
        maxy: 56.1942
    });

    var adch101942975 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 149.Elie to Arbroath, 1914",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942975/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101942975',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.8620, 
        miny: 56.1651, 
        maxx: -2.2952, 
        maxy: 56.6314
    });

    var adch101942978 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 149.Elie to Arbroath, 1915",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942978/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101942978',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.8620, 
        miny: 56.1651, 
        maxx: -2.2952, 
        maxy: 56.6314
    });

    var adch101942981 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 149.Elie to Arbroath, 1920",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942981/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101942981',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.8620, 
        miny: 56.1651, 
        maxx: -2.2952, 
        maxy: 56.6314
    });

    var adch101942984 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 149.Elie to Arbroath, 1923",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942984/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101942984',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.8620, 
        miny: 56.1651, 
        maxx: -2.2952, 
        maxy: 56.6314
    });

    var adch101942987 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 149.Elie to Arbroath, 1930",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942987/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101942987',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.8620, 
        miny: 56.1651, 
        maxx: -2.2952, 
        maxy: 56.6314
    });

    var adch101942990 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 149.Elie to Arbroath, 1939",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942990/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101942990',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.8642, 
        miny: 56.1591, 
        maxx: -2.2824, 
        maxy: 56.6268
    });



    var adch101942993 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 149.Elie to Arbroath, 1952",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942993/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101942993',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.8620, 
        miny: 56.1651, 
        maxx: -2.2952, 
        maxy: 56.6314
    });

    var adch101942996 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 149.Elie to Arbroath, 1963",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101942996/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '101942996',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.8620, 
        miny: 56.1651, 
        maxx: -2.2952, 
        maxy: 56.6314
    });





    var adch101943347 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 219.Orkney & Shetland - West, 1945",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101943347/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 13
		  }),
        numZoomLevels: 13,
        mosaic_id: '101943347',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -8.7669, 
        miny: 58.0898, 
        maxx: 0.3051, 
        maxy: 61.2614
    });

    var adch101943350 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 219.Orkney & Shetland - West, 1948",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101943350/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 13
		  }),
        numZoomLevels: 13,
        mosaic_id: '101943350',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -8.8070, 
        miny: 58.0701, 
        maxx: 0.2934, 
        maxy: 61.2554
    });


    var adch101943353 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 219.Orkney & Shetland - West, 1955",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101943353/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 13
		  }),
        numZoomLevels: 13,
        mosaic_id: '101943353',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -8.7936, 
        miny: 58.0575, 
        maxx: 0.2602, 
        maxy: 61.2281
    });

    var adch101943356 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 219.Orkney & Shetland - West, 1961",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101943356/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 13
		  }),
        numZoomLevels: 13,
        mosaic_id: '101943353',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -8.8582, 
        miny: 58.0562, 
        maxx: 0.2602, 
        maxy: 61.2439
    });

    var adch101943491 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 245.Scotland to Iceland, 1940",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101943491/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 13
		  }),
        numZoomLevels: 13,
        mosaic_id: '101943491',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -19.9221, 
        miny: 56.3029, 
        maxx: 3.0146, 
        maxy: 64.0359
    });

    var adch101943494 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 245.Scotland to Iceland, 1945",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101943494/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 13
		  }),
        numZoomLevels: 13,
        mosaic_id: '101943494',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -19.7741, 
        miny: 56.4123, 
        maxx: 3.1384, 
        maxy: 64.2090
    });

    var adch101943500 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 245.Scotland to Iceland, 1955",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101943500/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 13
		  }),
        numZoomLevels: 13,
        mosaic_id: '101943500',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -19.8621, 
        miny: 56.3386, 
        maxx: 3.0712, 
        maxy: 64.0887
    });

    var adch101943503 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 245.Scotland to Iceland, 1960",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101943503/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 13
		  }),
        numZoomLevels: 13,
        mosaic_id: '101943503',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -19.8888, 
        miny: 56.2482, 
        maxx: 3.1054, 
        maxy: 64.1614
    });

    var adch101943506 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 246.Scotland to Greenland, 1946",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101943506/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 13
		  }),
        numZoomLevels: 13,
        mosaic_id: '101943506',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -49.5592, 
        miny: 53.9786, 
        maxx: -0.1718, 
        maxy: 69.5290
    });

    var adch101943509 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 246.Scotland to Greenland, 1955",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101943509/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 13
		  }),
        numZoomLevels: 13,
        mosaic_id: '101943509',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -49.8245, 
        miny: 53.8519, 
        maxx: -0.2205, 
        maxy: 69.5937
    });

    var adch101943512 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 246.Scotland to Greenland, 1955",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101943512/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 13
		  }),
        numZoomLevels: 13,
        mosaic_id: '101943512',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -49.8245, 
        miny: 53.8519, 
        maxx: -0.1825, 
        maxy: 69.5937
    });

    var adch101944457 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 512.Stornoway approaches, 1901",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944457/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944457',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.4087, 
        miny: 58.1366, 
        maxx: -6.1924, 
        maxy: 58.2214
    });

    var adch101944460 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 512.Stornoway approaches, 1910",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944460/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944460',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.4087, 
        miny: 58.1366, 
        maxx: -6.1924, 
        maxy: 58.2214
    });


    var adch101944463 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 512.Stornoway approaches, 1929",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944463/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944463',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.4087, 
        miny: 58.1366, 
        maxx: -6.1924, 
        maxy: 58.2214
    });

    var adch74401001 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 531.Loch Moidart, 1865",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401001/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401001',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.9166, 
        miny: 56.7695, 
        maxx: -5.7820, 
        maxy: 56.8216
    });


    var adch101944847_inset3 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Blue Mull Sound, 1895",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944847_inset3/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944847_inset3',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.0267, 
        miny: 60.6610, 
        maxx: -0.9426, 
        maxy: 60.7335
    });

    var adch101944850_inset3 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Blue Mull Sound, 1916",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944850_inset3/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944850_inset3',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.0267, 
        miny: 60.6610, 
        maxx: -0.9426, 
        maxy: 60.7335
    });


    var adch101944853_inset3 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Blue Mull Sound, 1924",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944853_inset3/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944853_inset3',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.0267, 
        miny: 60.6610, 
        maxx: -0.9426, 
        maxy: 60.7335
    });

    var adch101944856_inset3 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Blue Mull Sound, 1931",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944856_inset3/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944856_inset3',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.0267, 
        miny: 60.6610, 
        maxx: -0.9426, 
        maxy: 60.7335
    });

    var adch101944847_inset4 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Leven and Sand Wicks, 1895",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944847_inset4/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944847_inset4',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.2802, 
        miny: 59.9652, 
        maxx: -1.1965, 
        maxy: 60.0003
    });

    var adch101944850_inset4 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Leven and Sand Wicks, 1916",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944850_inset4/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944850_inset4',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.2802, 
        miny: 59.9652, 
        maxx: -1.1965, 
        maxy: 60.0003
    });

    var adch101944853_inset4 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Leven and Sand Wicks, 1924",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944853_inset4/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944853_inset4',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.2802, 
        miny: 59.9652, 
        maxx: -1.1965, 
        maxy: 60.0003
    });

    var adch101944856_inset4 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Leven and Sand Wicks, 1931",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944856_inset4/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944856_inset4',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.2802, 
        miny: 59.9652, 
        maxx: -1.1965, 
        maxy: 60.0003
    });

    var adch101944847_inset2 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Quendale Bay, 1895",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944847_inset2/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944847_inset2',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.3569, 
        miny: 59.8612, 
        maxx: -1.3002, 
        maxy: 59.9058
    });

    var adch101944850_inset2 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Quendale Bay, 1916",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944850_inset2/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944850_inset2',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.3569, 
        miny: 59.8612, 
        maxx: -1.3002, 
        maxy: 59.9058
    });

    var adch101944853_inset2 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Quendale Bay, 1924",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944853_inset2/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944853_inset2',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.3569, 
        miny: 59.8612, 
        maxx: -1.3002, 
        maxy: 59.9058
    });

    var adch101944856_inset2 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Quendale Bay, 1931",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944856_inset2/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944856_inset2',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.3569, 
        miny: 59.8612, 
        maxx: -1.3002, 
        maxy: 59.9058
    });



    var adch101944847_inset1 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Ronas Voe, 1895",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944847_inset1/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944847_inset1',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.5358, 
        miny: 60.5006, 
        maxx: -1.3891, 
        maxy: 60.5681
    });


    var adch101944850_inset1 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Ronas Voe, 1916",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944850_inset1/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944847_inset1',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        minx: -1.5358, 
        miny: 60.5006, 
        maxx: -1.3891, 
        maxy: 60.5681
    });

    var adch101944853_inset1 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Ronas Voe, 1924",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944853_inset1/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944853_inset1',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        minx: -1.5358, 
        miny: 60.5006, 
        maxx: -1.3891, 
        maxy: 60.5681
    });

    var adch101944856_inset1 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Ronas Voe, 1931",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944856_inset1/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944856_inset1',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        minx: -1.5358, 
        miny: 60.5006, 
        maxx: -1.3891, 
        maxy: 60.5681
    });

    var adch101944847_inset5 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Ura Firth, 1895",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944847_inset5/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944847_inset5',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        minx: -1.5195, 
        miny: 60.4445, 
        maxx: -1.4247, 
        maxy: 60.4920
    });

    var adch101944850_inset5 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Ura Firth, 1916",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944850_inset5/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944850_inset5',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        minx: -1.5195, 
        miny: 60.4445, 
        maxx: -1.4247, 
        maxy: 60.4920
    });

    var adch101944853_inset5 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Ura Firth, 1924",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944853_inset5/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944853_inset5',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        minx: -1.5195, 
        miny: 60.4445, 
        maxx: -1.4247, 
        maxy: 60.4920
    });

    var adch101944856_inset5 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Ura Firth, 1931",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944856_inset5/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944856_inset5',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        minx: -1.5195, 
        miny: 60.4445, 
        maxx: -1.4247, 
        maxy: 60.4920
    });

    var adch101944847_inset6 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Uyea and Skuda, 1895",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944847_inset6/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944847_inset6',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        minx: -0.9539, 
        miny: 60.6530, 
        maxx: -0.8349, 
        maxy: 60.6931
    });

    var adch101944850_inset6 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Uyea and Skuda, 1916",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944850_inset6/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944850_inset6',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        minx: -0.9539, 
        miny: 60.6530, 
        maxx: -0.8349, 
        maxy: 60.6931
    });

    var adch101944853_inset6 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Uyea and Skuda, 1924",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944853_inset6/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944853_inset6',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        minx: -0.9539, 
        miny: 60.6530, 
        maxx: -0.8349, 
        maxy: 60.6931
    });

    var adch101944856_inset6 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Uyea and Skuda, 1931",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944856_inset6/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944856_inset6',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        minx: -0.9539, 
        miny: 60.6530, 
        maxx: -0.8349, 
        maxy: 60.6931
    });

    var adch101944847_inset7 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Vaila Sound, 1895",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944847_inset7/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944847_inset7',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        minx: -1.6293, 
        miny: 60.1859, 
        maxx: -1.5465, 
        maxy: 60.2309
    });

    var adch101944850_inset7 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Vaila Sound, 1916",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944850_inset7/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944850_inset7',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        minx: -1.6293, 
        miny: 60.1859, 
        maxx: -1.5465, 
        maxy: 60.2309
    });

    var adch101944853_inset7 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 606.inset: Vaila Sound, 1924",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944853_inset7/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944853_inset7',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        minx: -1.6293, 
        miny: 60.1859, 
        maxx: -1.5465, 
        maxy: 60.2309
    });

    var adch101944865 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 611.Sullom Voe, 1924",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944865/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944865',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        minx: -1.3984, 
        miny: 60.3846, 
        maxx: -1.2302, 
        maxy: 60.5065
    });


    var adch101944883 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 618.Loch Boisdale, 1891",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944883/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944883',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -7.3921, 
        miny: 57.0917, 
        maxx: -7.1834, 
        maxy: 57.1782
    });

    var adch101944874 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 614.Fortrose and Approaches, 1912",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944874/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944874',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.2220, 
        miny: 57.5189, 
        maxx: -4.0096, 
        maxy: 57.6055
    });



    var adch101944886 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 618.Loch Boisdale, 1903",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944886/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944886',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -7.3921, 
        miny: 57.0917, 
        maxx: -7.1834, 
        maxy: 57.1782
    });

    var adch101944889 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 618.Loch Boisdale, 1912",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944889/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944889',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -7.3921, 
        miny: 57.0917, 
        maxx: -7.1834, 
        maxy: 57.1782
    });

    var adch101944892 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 618.Loch Boisdale, 1924",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944892/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944892',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -7.3921, 
        miny: 57.0917, 
        maxx: -7.1834, 
        maxy: 57.1782
    });

    var adch101944895 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 618.Loch Boisdale, 1942",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101944895/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101944895',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -7.3921, 
        miny: 57.1232, 
        maxx: -7.1834, 
        maxy: 57.1730
    });

    var adch101945726 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 838.Brodick Bay, 1910",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101945726/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '101945726',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.1837, 
        miny: 55.5535, 
        maxx: -5.0980, 
        maxy: 55.6188
    });

    var adch101945729 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 838.Brodick Bay, 1925",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101945729/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '101945729',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.1837, 
        miny: 55.5535, 
        maxx: -5.0980, 
        maxy: 55.6188
    });

    var adch74400307 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1118.Shetland Islands, 1833",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74400307/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74400307',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.2833, 
        miny: 59.7747, 
        maxx: -0.4853, 
        maxy: 60.8801
    });

    var adch101946716 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1118.Shetland Islands, 1856",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101946716/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101946716',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.2833, 
        miny: 59.7747, 
        maxx: -0.4853, 
        maxy: 60.8801
    });

    var adch101946695 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1118.Shetland Islands, 1916",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101946695/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 17,
        mosaic_id: '101946695',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.2833, 
        miny: 60.3173, 
        maxx: -0.4853, 
        maxy: 60.9246
    });

    var adch101946698 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1118.Shetland Islands, 1924",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101946698/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 17,
        mosaic_id: '101946698',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.2833, 
        miny: 60.3173, 
        maxx: -0.4853, 
        maxy: 60.9246
    });



    var adch74400307_inset1 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1118.inset Hillswick, 1833",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74400307_inset1/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '74400307_inset1',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.5601, 
        miny: 60.4362, 
        maxx: -1.4226, 
        maxy: 60.5020
    });

    var adch101946716_inset1 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1118.inset Hillswick, 1856",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101946716_inset1/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '101946716_inset1',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.5601, 
        miny: 60.4362, 
        maxx: -1.4226, 
        maxy: 60.5020
    });


    var adch74400307_inset2 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1118.Balta Sound, 1833",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74400307_inset2/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '74400307_inset2',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -0.8663, 
        miny: 60.7265, 
        maxx: -0.7772, 
        maxy: 60.7759
    });

    var adch101946716_inset2 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1118.Balta Sound, 1856",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101946716_inset2/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '101946716_inset2',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -0.8663, 
        miny: 60.7265, 
        maxx: -0.7772, 
        maxy: 60.7759
    });

    var adch101946695_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1118a.Balta Sound, 1916",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101946695_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '101946695_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -0.8663, 
        miny: 60.7265, 
        maxx: -0.7772, 
        maxy: 60.7759
    });

    var adch101946698_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1118a.Balta Sound, 1924",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101946698_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '101946698_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -0.8663, 
        miny: 60.7265, 
        maxx: -0.7772, 
        maxy: 60.7759
    });


    var adch74400307_inset3 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1118.Scalloway, 1833",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74400307_inset3/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '74400307_inset3',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.4089, 
        miny: 60.0871, 
        maxx: -1.2599, 
        maxy: 60.1637
    });

    var adch101946716_inset4 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1118.Scalloway, 1856",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101946716_inset4/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '101946716_inset4',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.4089, 
        miny: 60.0871, 
        maxx: -1.2599, 
        maxy: 60.1637
    });


    var adch74400307_inset4 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1118.Bressa / Lerwick, 1833",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74400307_inset4/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '74400307_inset4',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.1658, 
        miny: 60.1179, 
        maxx: -1.0841, 
        maxy: 60.1997
    });

    var adch101946716_inset3 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1118.Bressay / Lerwick, 1856",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101946716_inset3/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '101946716_inset3',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.1658, 
        miny: 60.1179, 
        maxx: -1.0841, 
        maxy: 60.1997
    });




    var adch74401002 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1154.Lochs Erisort, Leurbost etc 1889",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401002/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401002',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.6491, 
        miny: 58.0718, 
        maxx: -6.3273, 
        maxy: 58.1632
    });

    var adch101947403_dunvegan = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1202.Lochs Dunvegan & Snizort 1897",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101947403_dunvegan/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101947403_dunvegan',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.7241, 
        miny: 57.4004, 
        maxx: -6.5486, 
        maxy: 57.5528
    });

    var adch101947403_snizort = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1202.Lochs Dunvegan & Snizort 1897",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101947403_snizort/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101947403_snizort',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.4881, 
        miny: 57.4478, 
        maxx: -6.2405, 
        maxy: 57.6042
    });

    var adch101947406 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1202.Lochs Diubaig, Greshornish 1907",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101947406/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '101947406',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.5067, 
        miny: 57.4730, 
        maxx: -6.2985, 
        maxy: 57.5420
    });

    var adch101947409 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1202.Lochs Diubaig, Greshornish 1938",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101947409/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '101947409',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.5067, 
        miny: 57.4730, 
        maxx: -6.2985, 
        maxy: 57.5420
    });

    var adch101947898 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1344.Kirkcudbright Bay, 1960",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101947898/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101947898',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.1401, 
        miny: 54.7402, 
        maxx: -3.9934, 
        maxy: 54.8551
    });

    var adch101947901 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1346.Firth of Solway, 1840",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101947901/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        mosaic_id: '101947901',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.0181, 
        miny: 54.5788, 
        maxx: -2.8936, 
        maxy: 55.0842
    });

    var adch101947907 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1346.Firth of Solway, 1844",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101947907/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        mosaic_id: '101947907',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.0181, 
        miny: 54.5788, 
        maxx: -2.8936, 
        maxy: 55.0842
    });

    var adch101947910 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1346.Firth of Solway, 1856",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101947910/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        mosaic_id: '101947910',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.0181, 
        miny: 54.5788, 
        maxx: -2.8936, 
        maxy: 55.0842
    });

    var adch101947916 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1346.Firth of Solway, 1902",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101947916/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        mosaic_id: '101947916',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.0181, 
        miny: 54.5788, 
        maxx: -2.8936, 
        maxy: 55.0842
    });

    var adch101947919 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1346.Firth of Solway, 1929",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101947919/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        mosaic_id: '101947919',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.0181, 
        miny: 54.5788, 
        maxx: -2.8936, 
        maxy: 55.0842
    });

    var adch101947922 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1346.Firth of Solway, 1931",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101947922/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        mosaic_id: '101947922',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.0181, 
        miny: 54.4255, 
        maxx: -3.1768, 
        maxy: 55.1290
    });

    var adch101947925 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1346.Firth of Solway, 1938",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101947925/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        mosaic_id: '101947925',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.0181, 
        miny: 54.4255, 
        maxx: -3.1768, 
        maxy: 55.1290
    });

    var adch101947919_inset1 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1346.Whitehaven, 1929",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101947919_inset1/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101947919_inset1',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.6080, 
        miny: 54.5450, 
        maxx: -3.5854, 
        maxy: 54.5609
    });

    var adch101947922_inset1 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1346.Whitehaven, 1931",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101947922_inset1/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101947922_inset1',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.6080, 
        miny: 54.5450, 
        maxx: -3.5854, 
        maxy: 54.5609
    });

    var adch101947922_inset2 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1346.Workington, 1931",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101947922_inset2/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101947922_inset2',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.5827, 
        miny: 54.6454, 
        maxx: -3.5559, 
        maxy: 54.6549
    });

    var adch101947925_inset1 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1346.Whitehaven, 1938",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101947925_inset1/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101947925_inset1',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.6082, 
        miny: 54.5451, 
        maxx: -3.5851, 
        maxy: 54.5610
    });

    var adch101947925_inset2 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1346.Workington, 1938",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101947925_inset2/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101947925_inset2',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.5826, 
        miny: 54.6454, 
        maxx: -3.5559, 
        maxy: 54.6548
    });

    var adch74401003 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1403.Loch Ryan, 1841",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401003/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '74401003',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.2371, 
        miny: 54.8610, 
        maxx: -4.9325, 
        maxy: 55.0510
    });

    var adch101948129 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1403.Loch Ryan, 1885",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948129/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101948129',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.2371, 
        miny: 54.8610, 
        maxx: -4.9325, 
        maxy: 55.0510
    });

    var adch101948132 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1403.Loch Ryan, 1901",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948132/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101948132',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.2371, 
        miny: 54.8610, 
        maxx: -4.9325, 
        maxy: 55.0510
    });

    var adch101948135 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1403.Loch Ryan, 1917",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948135/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101948135',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.2371, 
        miny: 54.8610, 
        maxx: -4.9325, 
        maxy: 55.0510
    });

    var adch101948138 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1403.Loch Ryan, 1945",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948138/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101948138',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.1659, 
        miny: 54.8610, 
        maxx: -4.9325, 
        maxy: 55.0510
    });

    var adch101948141 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1403.Loch Ryan, 1952",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948141/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101948141',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.1659, 
        miny: 54.8610, 
        maxx: -4.9325, 
        maxy: 55.0510
    });

    var adch101948132_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1403.Stranraer Harbour, 1901",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948132_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '101948132_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.0410, 
        miny: 54.9007, 
        maxx: -5.0128, 
        maxy: 54.9148
    });

    var adch101948135_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1403.Stranraer Harbour, 1917",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948135_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '101948135_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.0410, 
        miny: 54.9007, 
        maxx: -5.0128, 
        maxy: 54.9148
    });

    var adch101948138_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1403.Stranraer Harbour, 1945",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948138_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '101948138_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.0410, 
        miny: 54.9007, 
        maxx: -5.0128, 
        maxy: 54.9148
    });

    var adch101948141_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1403.Stranraer Harbour, 1952",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948141_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '101948141_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.1678, 
        miny: 54.8864, 
        maxx: -4.9676, 
        maxy: 55.0460
    });

    var adch74401004 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1404.Ardrossan Harbour, 1848",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401004/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '74401004',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.8744, 
        miny: 55.6221, 
        maxx: -4.7954, 
        maxy: 55.6625
    });

    var adch101948144 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1404.Ardrossan Harbour, 1848",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948144/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101948144',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.8744, 
        miny: 55.6221, 
        maxx: -4.7954, 
        maxy: 55.6625
    });

    var adch101948147 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1404.Ardrossan Harbour, 1898",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948147/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101948147',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.8599, 
        miny: 55.6273, 
        maxx: -4.7935, 
        maxy: 55.6545
    });

    var adch101948150 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1404.Ardrossan Harbour, 1901",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948150/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101948150',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.8599, 
        miny: 55.6273, 
        maxx: -4.7935, 
        maxy: 55.6545
    });

    var adch101948153 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1404.Ardrossan Harbour, 1908",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948153/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101948153',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.8592, 
        miny: 55.6273, 
        maxx: -4.7935, 
        maxy: 55.6545
    });

    var adch101948225 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1407.Eyemouth to the Tay, 1842",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948225/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948225',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.6140, 
        miny: 55.8305, 
        maxx: -1.9634, 
        maxy: 56.5150
    });

    var adch101948228 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1407.Eyemouth to the Tay, 1854",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948228/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948228',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.6140, 
        miny: 55.8305, 
        maxx: -2.0217, 
        maxy: 56.5165
    });


    var adch101948234 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1407.St Abbs Head to Aberdeen 1903",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948234/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948234',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.3748, 
        miny: 55.8177, 
        maxx: -1.7452, 
        maxy: 57.2016
    });

    var adch101948237 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1407.St Abbs Head to Aberdeen 1909",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948237/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948237',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.3704, 
        miny: 55.8179, 
        maxx: -1.7576, 
        maxy: 57.2075
    });

    var adch101948240 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1407.St Abbs Head to Aberdeen 1910",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948240/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948240',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.3747, 
        miny: 55.8031, 
        maxx: -1.7169, 
        maxy: 57.2363
    });

    var adch101948243 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1407.St Abbs Head to Aberdeen 1912",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948243/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948243',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.3998, 
        miny: 55.8037, 
        maxx: -1.7443, 
        maxy: 57.2369
    });

    var adch101948246 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1407.St Abbs Head to Aberdeen 1915",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948246/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948246',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.3957, 
        miny: 55.8106, 
        maxx: -1.7240, 
        maxy: 57.2127
    });

    var adch101948249 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1407.St Abbs Head to Aberdeen 1919",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948249/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948249',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.4152, 
        miny: 55.8176, 
        maxx: -1.7385, 
        maxy: 57.1960
    });

    var adch101948252 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1407.St Abbs Head to Aberdeen 1926",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948252/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948252',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.3999, 
        miny: 55.8230, 
        maxx: -1.7304, 
        maxy: 57.1975
    });

    var adch101948276 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1408.Firth of Tay to Aberdeen 1845",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948276/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948276',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.3999, 
        miny: 55.8230, 
        maxx: -1.7304, 
        maxy: 57.1975
    });


    var adch101948285 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1409.Aberdeen to Banff, 1842",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948285/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948285',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.6987, 
        miny: 57.1016, 
        maxx: -1.4074, 
        maxy: 57.9721
    });

    var adch74412387 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1409.Aberdeen to Banff, 1902",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74412387/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '74412387',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.6624, 
        miny: 57.0630, 
        maxx: -1.4423, 
        maxy: 57.9758
    });

    var adch101948291 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1409.Aberdeen to Banff, 1907",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948291/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948291',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.6624, 
        miny: 57.0630, 
        maxx: -1.4423, 
        maxy: 57.9758
    });

    var adch101948294 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1409.Aberdeen to Banff, 1912",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948294/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948294',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.6624, 
        miny: 57.0630, 
        maxx: -1.4423, 
        maxy: 57.9758
    });

    var adch101948297 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1409.Aberdeen to Banff, 1936",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948297/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948297',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.6624, 
        miny: 57.0630, 
        maxx: -1.4423, 
        maxy: 57.9758
    });

    var adch101948300 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1409.Aberdeen to Banff, 1944",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948300/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948300',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.6624, 
        miny: 57.0630, 
        maxx: -1.4423, 
        maxy: 57.9758
    });

    var adch101948303 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1409.Aberdeen to Banff, 1945",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948303/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948303',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.6624, 
        miny: 57.0630, 
        maxx: -1.4423, 
        maxy: 57.9758
    });

    var adch101948306 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1409.Aberdeen to Banff, 1947",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948306/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948306',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.6624, 
        miny: 57.0630, 
        maxx: -1.4423, 
        maxy: 57.9758
    });

    var adch101948279 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1409.Montrose to Banff, 1957",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948279/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948279',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.7750, 
        miny: 56.5782, 
        maxx: 0.8198, 
        maxy: 57.9384
    });


    var adch74400302 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1419.Shetland, 1795",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74400302/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 14,
        mosaic_id: '74400302',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.7933, 
        miny: 58.4701, 
        maxx: -0.3765, 
        maxy: 60.9275
    });

    var adch101948390 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1419.Shetland, 1807",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948390/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948390',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.7933, 
        miny: 58.4701, 
        maxx: -0.4210, 
        maxy: 61.08467
    });




    var adch74401005 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1426.Loch Eil, 1842",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401005/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '74401005',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.3530, 
        miny: 56.6680, 
        maxx: -5.0718, 
        maxy: 56.8635
    });

    var adch101948420 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1426.Loch Linnhe North, 1865",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948420/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948420',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.5721, 
        miny: 56.5423, 
        maxx: -4.8150, 
        maxy: 56.9863
    });

    var adch101948423 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1426.Loch Linnhe North, 1887",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948423/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948423',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.5721, 
        miny: 56.5423, 
        maxx: -4.8150, 
        maxy: 56.9863
    });

    var adch101948426 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1426.Loch Linnhe North, 1912",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948426/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948426',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.5721, 
        miny: 56.5423, 
        maxx: -4.8150, 
        maxy: 56.9863
    });

    var adch101948429 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1426.Loch Linnhe North, 1914",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948429/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948429',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.5721, 
        miny: 56.5423, 
        maxx: -4.8150, 
        maxy: 56.9863
    });

    var adch101948432 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1426.Loch Linnhe North, 1928",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948432/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948432',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.5721, 
        miny: 56.5423, 
        maxx: -4.8150, 
        maxy: 56.9863
    });

    var adch101948435 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1426.Loch Linnhe North, 1932",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948435/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948435',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.5721, 
        miny: 56.5423, 
        maxx: -4.8150, 
        maxy: 56.9863
    });

    var adch101948438 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1426.Loch Linnhe North, 1945",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948438/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948438',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.5721, 
        miny: 56.5423, 
        maxx: -4.8150, 
        maxy: 56.9863
    });

    var adch101948441 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1426.Loch Linnhe North, 1953",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948441/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948441',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.5721, 
        miny: 56.5423, 
        maxx: -4.8150, 
        maxy: 56.9863
    });

    var adch101948444 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1426.Loch Linnhe North, 1962",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948444/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948444',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.5721, 
        miny: 56.5423, 
        maxx: -4.8150, 
        maxy: 56.9863
    });

    var adch101948420_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1426.inset: The Narrows, 1865",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948420_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948420_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.0542, 
        miny: 56.7014, 
        maxx: -5.0395, 
        maxy: 56.7093
    });

    var adch101948423_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1426.inset: The Narrows, 1887",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948423_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948423_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.0542, 
        miny: 56.7014, 
        maxx: -5.0395, 
        maxy: 56.7093
    });

    var adch101948426_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1426.inset: The Narrows, 1912",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948426_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948426_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.0542, 
        miny: 56.7014, 
        maxx: -5.0395, 
        maxy: 56.7093
    });

    var adch101948429_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1426.inset: The Narrows, 1914",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948429_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948429_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.0542, 
        miny: 56.7014, 
        maxx: -5.0395, 
        maxy: 56.7093
    });

    var adch101948432_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1426.inset: The Narrows, 1928",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948432_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948432_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.0542, 
        miny: 56.7014, 
        maxx: -5.0395, 
        maxy: 56.7093
    });

    var adch101948435_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1426.inset: The Narrows, 1932",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948435_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948435_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.0542, 
        miny: 56.7014, 
        maxx: -5.0395, 
        maxy: 56.7093
    });

    var adch101948438_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1426.inset: The Narrows, 1945",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948438_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948438_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.0542, 
        miny: 56.7014, 
        maxx: -5.0395, 
        maxy: 56.7093
    });

    var adch101948441_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1426.inset: The Narrows, 1953",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948441_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948441_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.0542, 
        miny: 56.7014, 
        maxx: -5.0395, 
        maxy: 56.7093
    });

    var adch101948444_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1426.inset: The Narrows, 1962",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948444_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 14,
        mosaic_id: '101948444_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.0542, 
        miny: 56.7014, 
        maxx: -5.0395, 
        maxy: 56.7093
    });



    var adch101948504 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1438.Peterhead, 1854",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948504/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101948504',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.8136, 
        miny: 57.4607, 
        maxx: -1.7063, 
        maxy: 57.5205
    });

    var adch101948507 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1438.Peterhead, 1859",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948507/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101948507',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.8136, 
        miny: 57.4607, 
        maxx: -1.7063, 
        maxy: 57.5205
    });

    var adch101948510 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1438.Peterhead, 1902",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948510/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '101948510',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.8136, 
        miny: 57.4607, 
        maxx: -1.7063, 
        maxy: 57.5205
    });

    var adch101948513 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1438.Peterhead, 1953",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948513/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '101948513',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.8136, 
        miny: 57.4607, 
        maxx: -1.7063, 
        maxy: 57.5205
    });

    var adch101948516 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1438.Peterhead, 1963",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948516/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '101948516',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.8136, 
        miny: 57.4607, 
        maxx: -1.7063, 
        maxy: 57.5205
    });

    var adch101948510_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1438.inset Peterhead Harbours, 1902",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948510_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101948510_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.7798, 
        miny: 57.4983, 
        maxx: -1.7617, 
        maxy: 57.5097
    });

    var adch101948513_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1438.inset Peterhead Harbours, 1953",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948513_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101948513_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.7798, 
        miny: 57.4983, 
        maxx: -1.7617, 
        maxy: 57.5097
    });

    var adch101948516_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1438.inset Peterhead Harbours, 1963",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948516_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '101948516_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -1.7798, 
        miny: 57.4983, 
        maxx: -1.7617, 
        maxy: 57.5097
    });

    var adch74412388 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1439.Fraserburgh, 1902",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74412388/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '74412388',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.0309, 
        miny: 57.6610, 
        maxx: -1.9072, 
        maxy: 57.7107
    });

    var adch74412388_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1439.inset Fraserburgh, 1902",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74412388_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '74412388_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.007, 
        miny: 57.6882, 
        maxx: -1.9906, 
        maxy: 57.6978
    });

    var adch101948543 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1442.Banff and Macduff, 1842",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/101948543/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '101948543',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.5913, 
        miny: 57.6523, 
        maxx: -2.4832, 
        maxy: 57.6987
    });

    var adch74412457 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1443.Stonehaven Bay, 1842",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74412457/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74412457',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.2326, 
        miny: 56.9370, 
        maxx: -2.1203, 
        maxy: 56.9891
    });


    var adch74412457_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1443.Johnshaven, 1842",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74412457_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74412457_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.3650, 
        miny: 56.7781, 
        maxx: -2.3070, 
        maxy: 56.8025
    });

    var adch74413949 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1444.Montrose, 1895",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74413949/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '74413949',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -2.4820, 
        miny: 56.6932, 
        maxx: -2.4172, 
        maxy: 56.7203
    });


    var adch74412463 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1444.Thurso Bay, 1844",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74412463/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '74412463',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.5903, 
        miny: 58.5711, 
        maxx: -3.3143, 
        maxy: 58.6829
    });

    var adch74401006_oban = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1790.Oban, 1847",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401006_oban/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '74401006_oban',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.5039, 
        miny: 56.4044, 
        maxx: -5.4649, 
        maxy: 56.4332
    });

    var adch74401006_troon = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1804.Troon, 1841",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401006_troon/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '74401006_troon',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.7011, 
        miny: 55.5325, 
        maxx: -4.6536, 
        maxy: 55.55941
    });

    var adch74401007 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1836.Tobermory Harbour, 1848",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401007/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '74401007',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.0917, 
        miny: 56.5953, 
        maxx: -6.0134, 
        maxy: 56.6440
    });

    var adch74401008 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1864.Campbeltown Loch, 1848",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401008/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '74401008',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.6249, 
        miny: 55.4027, 
        maxx: -5.5230, 
        maxy: 55.4472
    });

    var adch74401009 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1919.Stornoway Harbour, 1849",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401009/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '74401009',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.4296, 
        miny: 58.1713, 
        maxx: -6.3245, 
        maxy: 58.2334
    });

    var adch74401010 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1953.Loch Inver, 1849",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401010/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '74401010',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.3400, 
        miny: 58.1264, 
        maxx: -5.2236, 
        maxy: 58.1736
    });

    var adch74401011 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1971.Solway Firth to Loch Ryan 1846",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401011/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '74401011',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.5660, 
        miny: 54.3594, 
        maxx: -3.8960, 
        maxy: 55.11847
    });

    var adch74401012 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 1979.Kirkcudbright Bay, 1850",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401012/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401012',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.1669, 
        miny: 54.7256, 
        maxx: -3.96387, 
        maxy: 54.8801
    });

  var adch74401014 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2007.Dumbarton to Glasgow, 1850",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401014/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '74401014',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.5933, 
        miny: 55.8480, 
        maxx: -4.20469, 
        maxy: 55.9533
    });

  var adch74401015 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2037.Gigha Sound, 1851",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401015/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401015',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.8063, 
        miny: 55.5910, 
        maxx: -5.5976, 
        maxy: 55.7462
    });

  var adch74401016 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2131.Firth of Clyde, 1852",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401016/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '74401016',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.0557, 
        miny: 55.6893, 
        maxx: -4.8044, 
        maxy: 55.8724
    });

  var adch74401017 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2155.Sound of Mull, 1852",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401017/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '74401017',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.3650, 
        miny: 56.3995, 
        maxx: -5.5260, 
        maxy: 56.7076
    });

  var adch74412462 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2170.Firth of Dornoch, 1853",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74412462/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '74412462',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.3724, 
        miny: 57.7960, 
        maxx: -3.7373, 
        maxy: 58.0241
    });

  var adch74400305 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2180.Orkney Islands, 1850",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74400305/{z}/{x}/{y}.png",
		  }),
        numZoomLevels: 20,
        mosaic_id: '74400305',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.5119, 
        miny: 58.5862, 
        maxx: -2.1876, 
        maxy: 59.4556
    });

  var adch74412454 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2181.Ord of Caithness to Thurso, 1850",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74412454/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '74412454',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.7861, 
        miny: 58.0897, 
        maxx: -2.4509, 
        maxy: 59.0270
    });

  var adch74401019 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2321.Loch Fyne, 1856",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401019/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '74401019',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.4845, 
        miny: 55.8366, 
        maxx: -5.2306, 
        maxy: 56.0854
    });

  var adch74401019_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2321.Loch Fyne, 1856 - inset",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401019_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        mosaic_id: '74401019_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.3232, 
        miny: 56.0330, 
        maxx: -4.8816, 
        maxy: 56.2813
    });

  var adch74401020 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2326.Loch Crinan / Cuan Sound, 1856",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401020/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '74401020',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.8631, 
        miny: 56.0468, 
        maxx: -5.4437, 
        maxy: 56.2811
    });

  var adch74401022 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2386.The North Minch, 1849",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401022/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '74401022',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.6489, 
        miny: 57.9433, 
        maxx: -4.8857, 
        maxy: 58.67849
    });

  var adch74401023 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2418.Colonsay and Oronsay, 1856",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401023/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401023',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.3780, 
        miny: 55.9399, 
        maxx: -6.0968, 
        maxy: 56.17167
    });

  var adch74400296 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2474.Hebrides or Western Isles, 1869",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74400296/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '74400296',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -8.7984, 
        miny: 56.5548, 
        maxx: -6.74867, 
        maxy: 58.1469
    });

  var adch74400296_inset1 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2474.inset: Vatersay Sound, 1869",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74400296_inset1/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '74400296_inset1',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -7.5854, 
        miny: 56.9324, 
        maxx: -7.50504, 
        maxy: 56.9627
    });

  var adch74400296_inset2 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2474.inset: Castle Bay, 1869",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74400296_inset2/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '74400296_inset2',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -7.5427, 
        miny: 56.91494, 
        maxx: -7.3835, 
        maxy: 56.9592
    });

  var adch74400296_inset3 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2474.inset: Sound of Bernera, 1869",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74400296_inset3/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '74400296_inset3',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -7.6959, 
        miny: 56.77037, 
        maxx: -7.54056, 
        maxy: 56.81107
    });

  var adch74401025 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2475.Ardnamurchan & Summer I 1857",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401025/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '74401025',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.6851, 
        miny: 56.5765, 
        maxx: -4.8332, 
        maxy: 58.1447
    });

  var adch74401026 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2476.Sound of Seil to Mull, 1857",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401026/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401026',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.7217, 
        miny: 56.2581, 
        maxx: -5.4027, 
        maxy: 56.4879
    });

  var adch74401027 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2477.West Loch Tarbert, 1856",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401027/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '74401027',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.7838, 
        miny: 55.7140, 
        maxx: -5.3680, 
        maxy: 55.8936
    });

  var adch74401028 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2481.Sound of Islay, 1856",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401028/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401028',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.1776, 
        miny: 55.7519, 
        maxx: -5.9070, 
        maxy: 55.9857
    });

  var adch74401029 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2496.Sleat Sound, 1856",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401029/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '74401029',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.0575, 
        miny: 56.8600, 
        maxx: -5.5945, 
        maxy: 57.2388
    });

  var adch74401030 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2497.Loch Hourn, 1857",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401030/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401030',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.7544, 
        miny: 57.0584, 
        maxx: -5.3253, 
        maxy: 57.2104
    });

  var adch74401031 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2498.Sound of Raasay, etc, 1857",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401031/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401031',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.2373, 
        miny: 57.2832, 
        maxx: -5.7598, 
        maxy: 57.4517
    });

  var adch74401032 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2500.Lochs Broom, 1857",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401032/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401032',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.5609, 
        miny: 57.8064, 
        maxx: -5.0326, 
        maxy: 57.9929
    });

  var adch74401033 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2500.Loch Inver & Broom, 1857",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401033/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401033',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.5416, 
        miny: 57.9083, 
        maxx: -5.2311, 
        maxy: 58.1578
    });

  var adch74401034 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2502.Eddrachillis Bay, 1857",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401034/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401034',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.3275, 
        miny: 58.2022, 
        maxx: -4.8824, 
        maxy: 58.3562
    });

  var adch74401035 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2503.Lochs Laxford & Inchard, 1856",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401035/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401035',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.3871, 
        miny: 58.3443, 
        maxx: -4.9447, 
        maxy: 58.4965
    });

  var adch74401036 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2507.Ardnamurchan to L Bhreatal, 1852",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401036/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        mosaic_id: '74401036',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.8536, 
        miny: 56.6460, 
        maxx: -5.3014, 
        maxy: 57.2297
    });

  var adch74401037 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2509.Ru Ruag to Gruinard, 1857",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401037/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '74401037',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.9017, 
        miny: 57.6121, 
        maxx: -5.4533, 
        maxy: 57.9754
    });

  var adch74401000 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2515.Islay, Jura, Colonsay etc, 1855",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401000/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '74401000',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -7.0857, 
        miny: 55.5038, 
        maxx: -5.53886, 
        maxy: 56.1991
    });

  var adch74401000_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2515.inset, Port Ellen, 1852",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401000_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 16
		  }),
        numZoomLevels: 16,
        mosaic_id: '74401000_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.2237, 
        miny: 55.6162, 
        maxx: -6.1735, 
        maxy: 55.6361
    });

  var adch74412461 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2550.inset, Wick, 1857",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74412461/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 19
		  }),
        numZoomLevels: 19,
        mosaic_id: '74412461',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -3.1081, 
        miny: 58.4201, 
        maxx: -3.0252, 
        maxy: 58.4502
    });


  var adch74401038 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2570.Sound of Raasay (North), 1857",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401038/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401038',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.2075, 
        miny: 57.4492, 
        maxx: -5.7755, 
        maxy: 57.6068
    });

  var adch74401039 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2617.Sound of Iona, 1860",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401039/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401039',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.5923, 
        miny: 56.16899, 
        maxx: -6.3197, 
        maxy: 56.4014
    });

  var adch74400294 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2635.Scotland W Coast, 1903",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74400294/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 14
		  }),
        numZoomLevels: 14,
        mosaic_id: '74400294',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -9.6600, 
        miny: 54.9195, 
        maxx: -4.3550, 
        maxy: 59.1974
    });


  var adch74401040 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2638.Lochs Torridon & Shieldag, 1858",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401040/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401040',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.9126, 
        miny: 57.4969, 
        maxx: -5.4815, 
        maxy: 57.6506
    });

  var adch74401041 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2639.Lochs Carron and Kishorn, 1859",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401041/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401041',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.8196, 
        miny: 57.29462, 
        maxx: -5.39606, 
        maxy: 57.4489
    });

  var adch74401042 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2642.Sound of Harris, 1859",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401042/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401042',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -7.3507, 
        miny: 57.5887, 
        maxx: -6.8613, 
        maxy: 57.88078
    });

  var adch74401043 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2652.Loch Tuadh & Isles, 1859",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401043/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401043',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.52969, 
        miny: 56.3986, 
        maxx: -6.1092, 
        maxy: 56.5502
    });

  var adch74401044 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2676.Loch Alsh & Loch Duich, 1859",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401044/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401044',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.7688, 
        miny: 57.1850, 
        maxx: -5.34726, 
        maxy: 57.3414
    });

  var adch74401045 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2750.Loch Skiport, 1874",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401045/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '74401045',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -7.31194, 
        miny: 57.29415, 
        maxx: -7.17429, 
        maxy: 57.35189
    });

  var adch74401046 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2770.Sound of Barra, 1874",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401046/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401046',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -7.569, 
        miny: 56.9138, 
        maxx: -7.1090, 
        maxy: 57.19576
    });

  var adch74401047 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2771.Loch Scridain, 1871",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401047/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401047',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.3569, 
        miny: 56.2828, 
        maxx: -5.9396, 
        maxy: 56.4388
    });

  var adch74401048 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2805.Monach and Haskeir I, 1882",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401048/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401048',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -7.7639, 
        miny: 57.4852, 
        maxx: -7.4725, 
        maxy: 57.71972
    });

  var adch74401048_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2805.inset: Sound of Shillay, 1882",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401048_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '74401048_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -7.7160, 
        miny: 57.5143, 
        maxx: -7.6583, 
        maxy: 57.5369
    });

  var adch74401049 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2813.Lochs Buie and Spelve, 1862",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401049/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401049',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.0749, 
        miny: 56.2658, 
        maxx: -5.66819, 
        maxy: 56.42245
    });

  var adch74401052 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2817.Arisaig Harbour, 1861",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401052/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '74401052',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.9610, 
        miny: 56.8780, 
        maxx: -5.8367, 
        maxy: 56.9289
    });

  var adch74401053 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2832.Treshnish Pt. and Mull, 1864",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401053/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401053',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.5212, 
        miny: 56.5362, 
        maxx: -6.10315, 
        maxy: 56.70428
    });

  var adch74401053_inset = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2832.inset: Loch Cuan, Mull, 1864",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401053_inset/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '74401053_inset',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.2654, 
        miny: 56.59427, 
        maxx: -6.1992, 
        maxy: 56.63698
    });

  var adch74401054 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2841.Sound of Harris & W Harris 1872",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401054/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '74401054',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -7.3241, 
        miny: 57.74280, 
        maxx: -6.7777, 
        maxy: 58.16272
    });

  var adch74401055 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2905.East Loch Tarbert, 1876",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401055/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '74401055',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -6.8271, 
        miny: 57.8210, 
        maxx: -6.6034, 
        maxy: 57.9053
    });

  var adch74401056 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2909.Loch Awe, 1861",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401056/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401056',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.6135, 
        miny: 56.10978, 
        maxx: -4.9222, 
        maxy: 56.51812
    });

  var adch74412460 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 3110.Cromarty Firth anchorage, 1900",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74412460/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74412460',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.2796, 
        miny: 57.6085, 
        maxx: -3.9584, 
        maxy: 57.7258
    });

  var adch74401057 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 3510.Loch Nevis - Inverie Bay, 1905",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401057/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '74401057',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.8202, 
        miny: 56.9998, 
        maxx: -5.6398, 
        maxy: 57.0685
    });

  
  var adch74401060 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2006.Greenock to Dumbarton, 1850",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401060/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 18
		  }),
        numZoomLevels: 18,
        mosaic_id: '74401060',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -4.8018, 
        miny: 55.9147, 
        maxx: -4.5568, 
        maxy: 56.01021
    });

  var adch74401051 = new ol.layer.Tile({
	title: "Scotland, Admiralty Charts - 2841b.Lochs Etive and Creran, 1874",
	source: new ol.source.XYZ({
    				attributions: [adchATTRIBUTION],
				url: "http://geo.nls.uk/mapdata3/ad_chart/74401051/{z}/{x}/{y}.png",
				minZoom: 8,
				maxZoom: 17
		  }),
        numZoomLevels: 17,
        mosaic_id: '74401051',
        group_no: '18',
        key: 'geo.nls.uk/mapdata3/ad_chart/index/openlayers.html',
	type: 'overlay', 
        visible: false,
        minx: -5.3568, 
        miny: 56.4180, 
        maxx: -5.0098, 
        maxy: 56.64913
    });

  var jamaica = new ol.layer.Tile({
	title: "Jamaica - James Robertson, 1804",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata2/jamaica/{z}/{x}/{-y}.png",
				minZoom: 8,
				maxZoom: 15
		  }),
        numZoomLevels: 15,
        mosaic_id: '74428076',
        group_no: '63',
        key: 'geo.nls.uk/maps/nokey.html',
	keytext: "View the individual sheets of James Robertson's maps of Jamaica mapping by selecting 'Find by place' above",
	type: 'overlay', 
        visible: false,
        minx: -78.4711, 
        miny: 17.6095, 
        maxx: -75.9799, 
        maxy: 18.6501,
        attribution: ''
    });





var overlayLayersAll = [oneinch2nd, one_inch_2nd_hills, sixinch2, bartgreatbritain, twentyfivethousand,  OS1900sGB, nls, oneinchseventh, admin, coal_iron, farming, general, geological, iron_steel, land_classification, land_utilisation, limestone, local_access, physical, population_change_1921, population_change_1931, population_change_1939, population_density_1931, population_density_1951, railways, rainfall, roads_46, roads_56, veg_north, veg_south, royhighlands, roylowlands, sixinch, sixinch2scot, os25inch1890s, bartsurveyatlas, oneinchpopular, barthalfinch,  quarterinch, oneinchlanduse, oneinchnatgrid, oneinchseventhscot, twentyfivethousandscot, scot1944_1963, airphotos, adch101942045, adch101942048, adch101942078, adch101942108, adch101942111, adch101942114, adch101942117, adch101942630, adch74412450, adch101942603, adch101942606, adch101942612, adch101942615, adch101942618, adch101942621, adch101942624, adch101942627, adch101942633, adch101942687, adch101942690, adch101942693, adch101942696, adch101942699, adch101942702, adch101942705, adch101942708, adch101942711, adch101942714, adch101942669, adch101942672, adch101942675, adch101942678, adch101942681, adch101942735, adch101942726, adch101942729, adch101942732, adch101942741, adch101942738, adch101942759, adch101942762, adch101943347, adch101942906_inset2, adch101942909_inset2, adch101942912_inset2, adch101942915_inset2, adch101942915_inset4, adch101942906_inset3, adch101942909_inset3, adch101942912_inset3, adch101942915_inset3, adch101942906_inset1, adch101942909_inset1, adch101942912_inset1, adch101942915_inset1, adch101942975, adch101942981, adch101942984, adch101942987, adch101942993, adch101942996, adch101943350, adch101943353, adch101943356, adch101943491, adch101943494, adch101943500, adch101943503, adch101943506, adch101943509, adch101943512, adch101944457, adch101944460, adch101944463, adch74401001, adch101944847_inset3, adch101944847_inset4, adch101944847_inset2, adch101944847_inset1, adch101944847_inset5, adch101944847_inset6, adch101944847_inset7, adch101944850_inset3, adch101944850_inset4, adch101944850_inset2, adch101944850_inset1, adch101944850_inset5, adch101944850_inset6, adch101944850_inset7, adch101944853_inset3, adch101944853_inset4, adch101944853_inset2, adch101944853_inset1, adch101944853_inset5, adch101944853_inset6, adch101944853_inset7, adch101944856_inset3, adch101944856_inset4, adch101944856_inset2, adch101944856_inset1, adch101944856_inset5, adch101944856_inset6, adch101944883, adch101944865, adch101944874, adch101944886, adch101944889, adch101944892, adch101944895, adch101945726, adch101945729, adch74400307, adch74400307_inset1, adch74400307_inset2, adch74400307_inset3, adch74400307_inset4, adch101946716, adch101946716_inset2, adch101946716_inset3, adch101946716_inset4, adch101946716_inset1, adch101946695_inset, adch101946695, adch101946698_inset, adch101946698, adch74401002, adch101947403_dunvegan, adch101947403_snizort, adch101947406, adch101947409, adch101947898, adch101947901, adch101947907, adch101947910, adch101947916, adch101947919, adch101947922, adch101947925, adch101947919_inset1, adch101947922_inset1, adch101947922_inset2, adch101947925_inset1, adch101947925_inset2, adch74401003, adch101948129, adch101948132, adch101948135, adch101948138, adch101948141, adch101948132_inset, adch101948135_inset, adch101948138_inset, adch101948141_inset, adch74401004, adch101948144, adch101948147, adch101948150, adch101948153, adch101948225, adch101948228, adch101948234, adch101948237, adch101948240, adch101948243, adch101948246, adch101948249, adch101948252, adch101948276, adch101948285, adch74412387, adch101948291, adch101948294, adch101948297, adch101948300, adch101948303, adch101948306, adch101948279, adch74400302, adch101948390, adch74401005, adch101948420_inset, adch101948420, adch101948423_inset, adch101948423, adch101948426_inset, adch101948426, adch101948429_inset, adch101948429, adch101948432_inset, adch101948432, adch101948435_inset, adch101948435, adch101948438_inset, adch101948438, adch101948441_inset, adch101948441, adch101948444_inset, adch101948444, adch101948504, adch101948507, adch101948510, adch101948513, adch101948516, adch101948510_inset, adch101948513_inset, adch101948516_inset, adch74412388, adch74412388_inset, adch101948543, adch74412457, adch74412457_inset, adch74413949, adch74412463, adch74401006_oban, adch74401006_troon, adch74401007, adch74401008, adch74401009, adch74401010, adch74401011, adch74401012, adch74401060, adch74401014, adch74401015, adch74401016, adch74401017, adch74412462, adch74400305, adch74412454, adch74401019, adch74401019_inset, adch74401020, adch74401022, adch74401023, adch74400296, adch74400296_inset1, adch74400296_inset2, adch74400296_inset3, adch74401025, adch74401026, adch74401027, adch74401028, adch74401029, adch74401030, adch74401031, adch74401032, adch74401033, adch74401034, adch74401035, adch74401036, adch74401037, adch74401000, adch74401000_inset, adch74412461, adch74401038, adch74401039, adch74400294, adch74401040, adch74401041, adch74401042, adch74401043, adch74401044, adch74401045, adch74401046, adch74401047, adch74401048, adch74401048_inset, adch74401049, adch74401052, adch74401053, adch74401053_inset, adch74401054, adch74401051, adch74401055, adch74401056, adch74412460, adch74401057, bathlochawenorth, bathlochawesouth, bathlochcluanie, bathlochdoon, bathlochduntelchaig, bathlochearn, bathlocherichtlower, bathlocherichtupper, bathlochfannich, bathlochgarryness, bathlochgarrytay, bathlochglass, bathlochharray, bathlochlaidon, bathlochleven, bathlochlomondnorth, bathlochlomondsouth, bathlochloyne, bathlochluichart, bathlochlyon, bathlochmhor, bathlochmonar, bathlochmullardoch, bathlochquoich, bathlochrannoch, bathlochshiellower, bathlochshielupper, bathlochshinlower, bathlochshinupper, bathlochtayeast, bathlochtaywest, bathlochtreig, bathlochtummel, aberdeen, airdrie, alexandria, alloa, annan, arbroath, ayr, berwick, brechin, burntisland, campbeltown, coatbridge, cupar1854, cupar1893, dalkeith1852, dalkeith1893, dumbarton, dumfries1850, dumfries1893, dundee1857, dundee1870, dunfermline1854, dunfermline1893, edin1765, edin1784, edin1804, edin1817, edin1821, edin1831, edin1832, edin1849, edin1865, edin1876, edin1882, edin1888, edin1891, edin1892, edin1892b, edin1893, edin1902, edin1905, edin1907, edin1910, edin1912, edin1917, edin1918, edin1932, edin1939, edin1944, edin1944_1963, elgin, falkirk, forfar, forres, galashiels, girvan,  glas1857, glas1882, glas1888, glas1891, glas1894, greenock, haddington1853, haddington1893, hamilton, hawick, irvine, inverness, jedburgh, kelso, kilmarnock, kirkcaldy1855, kirkcaldy1894, kirkcudbright1850, kirkcudbright1893, kirkintilloch, kirriemuir, lanark, linlithgow, maybole, montrose, musselburgh1853, musselburgh1893, nairn, oban, paisley, peebles, perth1716, perth1783, perth1823, perth1827, perth1832, perth1860, perth1860b, perth1893, perth1895, perth1901, perth1902, perth1907, perth1912, perth1933, perth1948, peterhead, portobello, portglasgow, rothesay, standrews1854, standrews1893, selkirk, stirling, stonehaven, stranraer1847, stranraer1867, stranraer1893, strathaven, wick, wigtown1848, wigtown1894, twentyfiveinchengwal, sixinchenglandwales, twentyfivethousandengwal, oneinchnewpop, oneinchseventhengwal, os_london_1056, os_london_1250, irelandbart, irelandgsgs, trench101723168, trench101723205, trench101723208, trench101723211, trench101723214, trench101724055, trench101723220, trench101723223, trench101723229, trench101724060, trench101723232, trench101724050, trench101724027, trench101724030, trench101723171, trench101723174, trench101723196, trench101723217, trench101723199, trench101724033, trench101724036, trench101464585, trench101464588, trench101464591, trench101464594, trench101464609, trench101464612, trench101464615, trench101464618, trench101464630, trench101464627, trench101464639, trench101464642, trench101464645, trench101464636, trench101464681, trench101464684, trench101464687, trench101464648, trench101464651, trench101464654, trench101464657, trench101464660, trench101464663, trench101464666, trench101464669, trench101464672, trench101464675, trench101464693, trench101464696, trench101464705, trench101464708, trench101464711, trench101464714, trench101464699, trench101464702, trench101464726, trench101464729, trench101464732, trench101464735, trench101464738, trench101464741, trench101464744, trench101464747, trench101464750, trench101464753, trench101464756, trench101464759, trench101464762, trench101464765, trench101464768, trench101464765, trench101464774, trench101464777, trench101464780, trench101464783, trench101464771, trench101464786, trench101464789, trench101464792, trench101464795, trench101464798, trench101464801, trench101464804, trench101464807, trench101464810, trench101464813, trench101464816, trench101464822, trench101464825, trench101464828, trench101464831, trench101724021, trench101723247, trench101723250, trench101723253, trench101464837, trench101464834, trench101464840, trench101464846, trench101464843, trench101464849, trench101464855, trench101464858, trench101464867, trench101464864, trench101464861, trench101464873, trench101464870, trench101464876, trench101464879, trench101464882, trench101464885, trench101464897, trench101464903, trench101464900, trench101464918, trench101464915, trench101464912, trench101464909, trench101464939, trench101464936, trench101464933, trench101464930, trench101464927, trench101464924, trench101464921, trench101464948, trench101464945, trench101464942, trench101464951, trench101464954, trench101464957, trench101464960, trench101464966, trench101464963, trench101464969, trench101464978, trench101464975, trench101464987, trench101464984, trench101464981, trench101464990, trench101464999, trench101464996, trench101464993, trench101465002, trench101465011, trench101465008, trench101465005, trench101465020, trench101465017, trench101465023, trench101465029, trench101465032, trench101465035, trench101465050, trench101465047, trench101465044, trench101465071, trench101465068, trench101465065, trench101465062, trench101465059, trench101465056, trench101465053, trench101465095, trench101465092, trench101465089, trench101465086, trench101465083, trench101465080, trench101465077, trench101465074, trench101465098, trench101465104, trench101465101, trench101465107, trench101465119, trench101465116, trench101465122, trench101465137, trench101465134, trench101465131, trench101465128, trench101465140, trench101465161, trench101465158, trench101465155, trench101465152, trench101465149, trench101465146, trench101465164, trench101465167, trench101465194, trench101465191, trench101465188, trench101465185, trench101465182, trench101465176, trench101465170, trench101465209, trench101465206, trench101465203, trench101465200, trench101465197, trench101465224, trench101465221, trench101465218, trench101465215, trench101465251, trench101465248, trench101465245, trench101465242, trench101465239, trench101465236, trench101465233, trench101465230, trench101465227, trench101465257, trench101465254, trench101465263, trench101465260, trench101465269, trench101465266, trench101465275, trench101465272, trench101465287, trench101465284, trench101465281, trench101465278, trench101465293, trench101465290, trench101465302, trench101465296, trench101465308, trench101465305, trench101465311, trench101465323, trench101465320, trench101465317, trench101465314, trench101465329, trench101465326, trench101465332, trench101465368, trench101465365, trench101465341, trench101465344, trench101465338, trench101465335, trench101465347, trench101465350, trench101465353, trench101465356, trench101465359, trench101465371, trench101465362, trench101465377, trench101465374, trench101465380, trench101465383, trench101465386, trench101465389, trench101465392, trench101465395, trench101465398, trench101723235, trench101723238, trench101723833, trench101723202, trench101724065, trench101724042, trench101724045, trench101724024, trench101724039, trench101723830, trench101723165, belgiumgsgs4042, belgiumgsgs4336, belgiumgsgs4040, jamaica]; 

    overlayLayers = [oneinch2nd, one_inch_2nd_hills, sixinch2, bartgreatbritain, twentyfivethousand,  OS1900sGB, nls, oneinchseventh, admin, coal_iron, farming, general, geological, iron_steel, land_classification, land_utilisation, limestone, local_access, physical, population_change_1921, population_change_1931, population_change_1939, population_density_1931, population_density_1951, railways, rainfall, roads_46, roads_56, veg_north, veg_south, royhighlands, roylowlands, sixinch, sixinch2scot, os25inch1890s, bartsurveyatlas, oneinchpopular, barthalfinch,  quarterinch, oneinchlanduse, oneinchnatgrid, oneinchseventhscot, twentyfivethousandscot, scot1944_1963, airphotos, adch101942045, adch101942048, adch101942078, adch101942108, adch101942111, adch101942114, adch101942117, adch101942630, adch74412450, adch101942603, adch101942606, adch101942612, adch101942615, adch101942618, adch101942621, adch101942624, adch101942627, adch101942633, adch101942687, adch101942690, adch101942693, adch101942696, adch101942699, adch101942702, adch101942705, adch101942708, adch101942711, adch101942714, adch101942669, adch101942672, adch101942675, adch101942678, adch101942681, adch101942735, adch101942726, adch101942729, adch101942732, adch101942741, adch101942738, adch101942759, adch101942762, adch101943347, adch101942906_inset2, adch101942909_inset2, adch101942912_inset2, adch101942915_inset2, adch101942915_inset4, adch101942906_inset3, adch101942909_inset3, adch101942912_inset3, adch101942915_inset3, adch101942906_inset1, adch101942909_inset1, adch101942912_inset1, adch101942915_inset1, adch101942975, adch101942981, adch101942984, adch101942987, adch101942993, adch101942996, adch101943350, adch101943353, adch101943356, adch101943491, adch101943494, adch101943500, adch101943503, adch101943506, adch101943509, adch101943512, adch101944457, adch101944460, adch101944463, adch74401001, adch101944847_inset3, adch101944847_inset4, adch101944847_inset2, adch101944847_inset1, adch101944847_inset5, adch101944847_inset6, adch101944847_inset7, adch101944850_inset3, adch101944850_inset4, adch101944850_inset2, adch101944850_inset1, adch101944850_inset5, adch101944850_inset6, adch101944850_inset7, adch101944853_inset3, adch101944853_inset4, adch101944853_inset2, adch101944853_inset1, adch101944853_inset5, adch101944853_inset6, adch101944853_inset7, adch101944856_inset3, adch101944856_inset4, adch101944856_inset2, adch101944856_inset1, adch101944856_inset5, adch101944856_inset6, adch101944883, adch101944865, adch101944874, adch101944886, adch101944889, adch101944892, adch101944895, adch101945726, adch101945729, adch74400307, adch74400307_inset1, adch74400307_inset2, adch74400307_inset3, adch74400307_inset4, adch101946716, adch101946716_inset2, adch101946716_inset3, adch101946716_inset4, adch101946716_inset1, adch101946695_inset, adch101946695, adch101946698_inset, adch101946698, adch74401002, adch101947403_dunvegan, adch101947403_snizort, adch101947406, adch101947409, adch101947898, adch101947901, adch101947907, adch101947910, adch101947916, adch101947919, adch101947922, adch101947925, adch101947919_inset1, adch101947922_inset1, adch101947922_inset2, adch101947925_inset1, adch101947925_inset2, adch74401003, adch101948129, adch101948132, adch101948135, adch101948138, adch101948141, adch101948132_inset, adch101948135_inset, adch101948138_inset, adch101948141_inset, adch74401004, adch101948144, adch101948147, adch101948150, adch101948153, adch101948225, adch101948228, adch101948234, adch101948237, adch101948240, adch101948243, adch101948246, adch101948249, adch101948252, adch101948276, adch101948285, adch74412387, adch101948291, adch101948294, adch101948297, adch101948300, adch101948303, adch101948306, adch101948279, adch74400302, adch101948390, adch74401005, adch101948420_inset, adch101948420, adch101948423_inset, adch101948423, adch101948426_inset, adch101948426, adch101948429_inset, adch101948429, adch101948432_inset, adch101948432, adch101948435_inset, adch101948435, adch101948438_inset, adch101948438, adch101948441_inset, adch101948441, adch101948444_inset, adch101948444, adch101948504, adch101948507, adch101948510, adch101948513, adch101948516, adch101948510_inset, adch101948513_inset, adch101948516_inset, adch74412388, adch74412388_inset, adch101948543, adch74412457, adch74412457_inset, adch74413949, adch74412463, adch74401006_oban, adch74401006_troon, adch74401007, adch74401008, adch74401009, adch74401010, adch74401011, adch74401012, adch74401060, adch74401014, adch74401015, adch74401016, adch74401017, adch74412462, adch74400305, adch74412454, adch74401019, adch74401019_inset, adch74401020, adch74401022, adch74401023, adch74400296, adch74400296_inset1, adch74400296_inset2, adch74400296_inset3, adch74401025, adch74401026, adch74401027, adch74401028, adch74401029, adch74401030, adch74401031, adch74401032, adch74401033, adch74401034, adch74401035, adch74401036, adch74401037, adch74401000, adch74401000_inset, adch74412461, adch74401038, adch74401039, adch74400294, adch74401040, adch74401041, adch74401042, adch74401043, adch74401044, adch74401045, adch74401046, adch74401047, adch74401048, adch74401048_inset, adch74401049, adch74401052, adch74401053, adch74401053_inset, adch74401054, adch74401051, adch74401055, adch74401056, adch74412460, adch74401057, bathlochawenorth, bathlochawesouth, bathlochcluanie, bathlochdoon, bathlochduntelchaig, bathlochearn, bathlocherichtlower, bathlocherichtupper, bathlochfannich, bathlochgarryness, bathlochgarrytay, bathlochglass, bathlochharray, bathlochlaidon, bathlochleven, bathlochlomondnorth, bathlochlomondsouth, bathlochloyne, bathlochluichart, bathlochlyon, bathlochmhor, bathlochmonar, bathlochmullardoch, bathlochquoich, bathlochrannoch, bathlochshiellower, bathlochshielupper, bathlochshinlower, bathlochshinupper, bathlochtayeast, bathlochtaywest, bathlochtreig, bathlochtummel, aberdeen, airdrie, alexandria, alloa, annan, arbroath, ayr, berwick, brechin, burntisland, campbeltown, coatbridge, cupar1854, cupar1893, dalkeith1852, dalkeith1893, dumbarton, dumfries1850, dumfries1893, dundee1857, dundee1870, dunfermline1854, dunfermline1893, edin1765, edin1784, edin1804, edin1817, edin1821, edin1831, edin1832, edin1849, edin1865, edin1876, edin1882, edin1888, edin1891, edin1892, edin1892b, edin1893, edin1902, edin1905, edin1907, edin1910, edin1912, edin1917, edin1918, edin1932, edin1939, edin1944, edin1944_1963, elgin, falkirk, forfar, forres, galashiels, girvan,  glas1857, glas1882, glas1888, glas1891, glas1894, greenock, haddington1853, haddington1893, hamilton, hawick, irvine, inverness, jedburgh, kelso, kilmarnock, kirkcaldy1855, kirkcaldy1894, kirkcudbright1850, kirkcudbright1893, kirkintilloch, kirriemuir, lanark, linlithgow, maybole, montrose, musselburgh1853, musselburgh1893, nairn, oban, paisley, peebles, perth1716, perth1783, perth1823, perth1827, perth1832, perth1860, perth1860b, perth1893, perth1895, perth1901, perth1902, perth1907, perth1912, perth1933, perth1948, peterhead, portobello, portglasgow, rothesay, standrews1854, standrews1893, selkirk, stirling, stonehaven, stranraer1847, stranraer1867, stranraer1893, strathaven, wick, wigtown1848, wigtown1894, twentyfiveinchengwal, sixinchenglandwales, twentyfivethousandengwal, oneinchnewpop, oneinchseventhengwal, os_london_1056, os_london_1250, irelandbart, irelandgsgs, trench101723168, trench101723205, trench101723208, trench101723211, trench101723214, trench101724055, trench101723220, trench101723223, trench101723229, trench101724060, trench101723232, trench101724050, trench101724027, trench101724030, trench101723171, trench101723174, trench101723196, trench101723217, trench101723199, trench101724033, trench101724036, trench101464585, trench101464588, trench101464591, trench101464594, trench101464609, trench101464612, trench101464615, trench101464618, trench101464630, trench101464627, trench101464639, trench101464642, trench101464645, trench101464636, trench101464681, trench101464684, trench101464687, trench101464648, trench101464651, trench101464654, trench101464657, trench101464660, trench101464663, trench101464666, trench101464669, trench101464672, trench101464675, trench101464693, trench101464696, trench101464705, trench101464708, trench101464711, trench101464714, trench101464699, trench101464702, trench101464726, trench101464729, trench101464732, trench101464735, trench101464738, trench101464741, trench101464744, trench101464747, trench101464750, trench101464753, trench101464756, trench101464759, trench101464762, trench101464765, trench101464768, trench101464765, trench101464774, trench101464777, trench101464780, trench101464783, trench101464771, trench101464786, trench101464789, trench101464792, trench101464795, trench101464798, trench101464801, trench101464804, trench101464807, trench101464810, trench101464813, trench101464816, trench101464822, trench101464825, trench101464828, trench101464831, trench101724021, trench101723247, trench101723250, trench101723253, trench101464837, trench101464834, trench101464840, trench101464846, trench101464843, trench101464849, trench101464855, trench101464858, trench101464867, trench101464864, trench101464861, trench101464873, trench101464870, trench101464876, trench101464879, trench101464882, trench101464885, trench101464897, trench101464903, trench101464900, trench101464918, trench101464915, trench101464912, trench101464909, trench101464939, trench101464936, trench101464933, trench101464930, trench101464927, trench101464924, trench101464921, trench101464948, trench101464945, trench101464942, trench101464951, trench101464954, trench101464957, trench101464960, trench101464966, trench101464963, trench101464969, trench101464978, trench101464975, trench101464987, trench101464984, trench101464981, trench101464990, trench101464999, trench101464996, trench101464993, trench101465002, trench101465011, trench101465008, trench101465005, trench101465020, trench101465017, trench101465023, trench101465029, trench101465032, trench101465035, trench101465050, trench101465047, trench101465044, trench101465071, trench101465068, trench101465065, trench101465062, trench101465059, trench101465056, trench101465053, trench101465095, trench101465092, trench101465089, trench101465086, trench101465083, trench101465080, trench101465077, trench101465074, trench101465098, trench101465104, trench101465101, trench101465107, trench101465119, trench101465116, trench101465122, trench101465137, trench101465134, trench101465131, trench101465128, trench101465140, trench101465161, trench101465158, trench101465155, trench101465152, trench101465149, trench101465146, trench101465164, trench101465167, trench101465194, trench101465191, trench101465188, trench101465185, trench101465182, trench101465176, trench101465170, trench101465209, trench101465206, trench101465203, trench101465200, trench101465197, trench101465224, trench101465221, trench101465218, trench101465215, trench101465251, trench101465248, trench101465245, trench101465242, trench101465239, trench101465236, trench101465233, trench101465230, trench101465227, trench101465257, trench101465254, trench101465263, trench101465260, trench101465269, trench101465266, trench101465275, trench101465272, trench101465287, trench101465284, trench101465281, trench101465278, trench101465293, trench101465290, trench101465302, trench101465296, trench101465308, trench101465305, trench101465311, trench101465323, trench101465320, trench101465317, trench101465314, trench101465329, trench101465326, trench101465332, trench101465368, trench101465365, trench101465341, trench101465344, trench101465338, trench101465335, trench101465347, trench101465350, trench101465353, trench101465356, trench101465359, trench101465371, trench101465362, trench101465377, trench101465374, trench101465380, trench101465383, trench101465386, trench101465389, trench101465392, trench101465395, trench101465398, trench101723235, trench101723238, trench101723833, trench101723202, trench101724065, trench101724042, trench101724045, trench101724024, trench101724039, trench101723830, trench101723165, belgiumgsgs4042, belgiumgsgs4336, belgiumgsgs4040, jamaica]; 


	loadOptions();

		var currentZoom = DEFAULT_ZOOM;
		var currentLat = DEFAULT_LAT;
		var currentLon = DEFAULT_LON;
		if (args['zoom'])
		{
			currentZoom = args['zoom'];
		}
		if (args['lat'] && args['lon'])
		{
			currentLat = parseFloat(args['lat']); /* Necessary for lat (only) for some reason, otherwise was going to 90-val. Very odd... */
			currentLon = parseFloat(args['lon']);		
		}
		if (args['zoom'] && args['lat'] && args['lon'])
		{
			defaultLLZ = false;	
		}
		if (args['layers'])
		{
			urlLayerName = args['layers'];
		}








		var map = new ol.Map({
		  target: 'map',
		  renderer: 'canvas',
		  layers: [BingAerialWithLabels, trench_maps],
		  controls: ol.control.defaults({ attributionOptions: { collapsed: true, collapsible: true }}),
		  logo: false,
		  view: new ol.View({
		    center: ol.proj.transform([currentLon, currentLat], 'EPSG:4326', 'EPSG:3857'),
		    zoom: currentZoom
		  })
		});






        map.getView().on('change:resolution', setZoomLimit);
	// map.on("moveend", setPanEnd);

	// Change historical map
	var changemap = function(index) {
	  map.getLayers().removeAt(0);
	  map.getLayers().insertAt(0,baseLayers[index]);
	  // map.getLayers().getArray()[1].setOpacity(opacity);
	}


    var zoomslider = new ol.control.ZoomSlider();
    map.addControl(zoomslider);
    map.addControl(new ol.control.ScaleLine({ units:'metric' }));

    var mouseposition = new ol.control.MousePosition({
            projection: 'EPSG:4326',
            coordinateFormat: function(coordinate) {
	    // BNG: ol.extent.applyTransform([x, y], ol.proj.getTransform("EPSG:4326", "EPSG:27700"), 
		var coord27700 = ol.proj.transform(coordinate, 'EPSG:4326', 'EPSG:27700');
		var templatex = '{x}';
		var outx = ol.coordinate.format(coord27700, templatex, 0);
		var templatey = '{y}';
		var outy = ol.coordinate.format(coord27700, templatey, 0);
		NGR = gridrefNumToLet(outx, outy, 6);
		var hdms = ol.coordinate.toStringHDMS(coordinate);
		if ((outx  < 0) || (outx > 700000 ) || (outy < 0) || (outy > 1300000 )) {
	        return '<strong>' + ol.coordinate.format(coordinate, '{x}, {y}', 4) + '&nbsp; <br/>&nbsp;' + hdms + ' &nbsp;'; 
		}
		else 
                { return '<strong>' + NGR + '</strong>&nbsp; <br/>' + ol.coordinate.format(coord27700, '{x}, {y}', 0) + 
			'&nbsp; <br/>' + ol.coordinate.format(coordinate, '{y}, {x}', 4) + '&nbsp; <br/>&nbsp;' + hdms + ' &nbsp;'; }
            	}
    });

    map.addControl(mouseposition);



	// updateUrl();

	if (getOverlay(urlLayerName) == undefined) {
		overlaySelected = overlayLayers[0];
	}
	else
	{
	var overlaySelected = getOverlay(urlLayerName);
	}

	if ((!map.getView().getCenter()) && (overlaySelected)) {
		var extent = [overlaySelected.get('minx'), overlaySelected.get('miny'), overlaySelected.get('maxx'), overlaySelected.get('maxy')];
	        extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:4326", "EPSG:3857"));
	        map.getView().fitExtent(extent, map.getSize());
	  }






	updateOverlaySwitcher();
        loadOverlayNode();


	overlayOldName = overlaySelected.get('title');
        overlayLayers = [];
        // var extent = map.getExtent();     map.getView().calculateExtent(map.getSize());
        var extent = map.getView().calculateExtent(map.getSize());
      	var bounds = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857" , "EPSG:4326"));
	for (var i = 0; i < overlayLayersAll.length; i++) {
	  var layerOL = overlayLayersAll[i];
          var overlayBounds = [layerOL.get('minx'), layerOL.get('miny'), layerOL.get('maxx'), layerOL.get('maxy')];
	   // if(overlayBounds.intersectsExtent(bounds)) overlayLayers.push(layerOL);  (ol.extent.containsExtent(overlayBounds, bounds)
	  if(ol.extent.intersects(overlayBounds, bounds)) overlayLayers.push(layerOL);  
	}
 	
	updateOverlaySwitcher();
        loadOverlayNode();
	switchOverlayinitial();

  // jQuery( document ).ready(function() {
	jQuery('#mapslider').slider({
	  formater: function(value) {
	    opacity = value / 100;
	    map.getLayers().getArray()[2].setOpacity(opacity);
	    // overlay.layer.setOpacity(opacity);
	    return 'Opacity: ' + value + '%';
	  }
	});
   // 	});


 

    function onMoveEnd(evt) {
	updateUrl();
        var map = evt.map; 
	overlayOldName = map.getLayers().getArray()[2].get('title');
        overlayLayers = [];
        var extent = map.getView().calculateExtent(map.getSize());
      	var bounds = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857" , "EPSG:4326"));
	for (var i = 0; i < overlayLayersAll.length; i++) {
	  var layerOL = overlayLayersAll[i];
          var overlayBounds = [layerOL.get('minx'), layerOL.get('miny'), layerOL.get('maxx'), layerOL.get('maxy')];
	  if (ol.extent.intersects(overlayBounds, bounds)) overlayLayers.push(layerOL); 

	}

	updateOverlaySwitcher();


        loadOverlayNode();
		var overlaycurrent = map.getLayers().getArray()[2];
		var e1 = document.getElementById('overlaySelectNode');
            var selNode1Index = e1.options[e1.selectedIndex].value;
            var node1 = overlayTree.subnodes[selNode1Index];
            var e2 = document.getElementById('overlaySelectLayer');
            var selNode2Index = e2.options[e2.selectedIndex].value;
            var selOverlay = node1.subnodes[selNode2Index];
            //set switchers to permalink overlay
            if(selOverlay.layer!==overlaycurrent) {
                e1.options[overlaycurrent.overlayNodePath[0]].selected = true;
                loadOverlayNode();
                e2.options[overlaycurrent.overlayNodePath[1]].selected = true;
                switchOverlay();
            } 
     } 

    map.on('moveend', onMoveEnd);

		// jQuery(map.getViewport()).on('mousemove', mouseMoveHandler);

	var source = new ol.source.Vector();
	
	var vector = new ol.layer.Vector({
	  source: source,
	  style: new ol.style.Style({
	    fill: new ol.style.Fill({
	      color: 'rgba(255, 255, 255, 0.2)'
	    }),
	    stroke: new ol.style.Stroke({
	      color: '#ffcc33',
	      width: 2
	    }),
	    image: new ol.style.Circle({
	      radius: 7,
	      fill: new ol.style.Fill({
	        color: '#ffcc33'
	      })
	    })
	  })
	});

	/**
	 * Currently drawn feature.
	 * @type {ol.Feature}
	 */
	var sketch;
	
	
	/**
	 * The help tooltip element.
	 * @type {Element}
	 */
	var helpTooltipElement;
	
	
	/**
	 * Overlay to show the help messages.
	 * @type {ol.Overlay}
	 */
	var helpTooltip;
	
	
	/**
	 * The measure tooltip element.
	 * @type {Element}
	 */
	var measureTooltipElement;
	
	
	/**
	 * Overlay to show the measurement.
	 * @type {ol.Overlay}
	 */
	var measureTooltip;
	
	
	/**
	 * Message to show when the user is drawing a polygon.
	 * @type {string}
	 */
	var continuePolygonMsg = 'Single-click to continue drawing the polygon. Double-click to stop';
	
	
	/**
	 * Message to show when the user is drawing a line.
	 * @type {string}
	 */
	var continueLineMsg = 'Single-click to continue drawing the line. Double-click to stop';



	/**
	 * Handle pointer move.
	 * @param {ol.MapBrowserEvent} evt
	 */
	var pointerMoveHandler = function(evt) {
	  if (evt.dragging) {
	    return;
	  }
	  /** @type {string} */
	  var helpMsg = 'Click to start drawing. Double-click to stop.';
	  /** @type {ol.Coordinate|undefined} */
	  var tooltipCoord = evt.coordinate;
	
	  if (sketch) {
	    var output;
	    var geom = (sketch.getGeometry());
	    if (geom instanceof ol.geom.Polygon) {
	      output = formatArea(/** @type {ol.geom.Polygon} */ (geom));
	      helpMsg = continuePolygonMsg;
	      tooltipCoord = geom.getInteriorPoint().getCoordinates();
	    } else if (geom instanceof ol.geom.LineString) {
	      output = formatLength( /** @type {ol.geom.LineString} */ (geom));
	      helpMsg = continueLineMsg;
	      tooltipCoord = geom.getLastCoordinate();
	    }
	    measureTooltipElement.innerHTML = output;
	    measureTooltip.setPosition(tooltipCoord);
	  }
		  if (helpTooltipElement) 
	  helpTooltipElement.innerHTML = helpMsg;
	  helpTooltip.setPosition(evt.coordinate);
	
	};





	


	var typeSelect = document.getElementById('type');
	
	var draw; // global so we can remove it later
	function addInteraction() {
	  var type = (typeSelect.value == 'area' ? 'Polygon' : 'LineString');
	  draw = new ol.interaction.Draw({
	    source: source,
	    type: /** @type {ol.geom.GeometryType} */ (type),
	    style: new ol.style.Style({
	      fill: new ol.style.Fill({
	        color: 'rgba(255, 255, 255, 0.2)'
	      }),
	      stroke: new ol.style.Stroke({
	        color: 'rgba(0, 0, 0, 0.5)',
	        lineDash: [10, 10],
	        width: 2
	      }),
	      image: new ol.style.Circle({
	        radius: 5,
	        stroke: new ol.style.Stroke({
	          color: 'rgba(0, 0, 0, 0.7)'
	        }),
	        fill: new ol.style.Fill({
	          color: 'rgba(255, 255, 255, 0.2)'
	        })
	      })
	    })
	  });
	 map.addInteraction(draw);


	

	
	  draw.on('drawstart',
	      function(evt) {
	        // set sketch
	        sketch = evt.feature;
	      }, this);
	
	  draw.on('drawend',
	      function(evt) {
	        measureTooltipElement.className = 'tooltip1 tooltip-static';
	        measureTooltip.setOffset([0, -7]);
	        // unset sketch
	        sketch = null;
	        // unset tooltip so that a new one can be created
	        measureTooltipElement = null;
	        createMeasureTooltip();
	      }, this);
	}
	
	/**
	 * Creates a new help tooltip
	 */
	function createHelpTooltip() {
	  if (helpTooltipElement) {
	    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
	  }
	  helpTooltipElement = document.createElement('div');
	  helpTooltipElement.className = 'tooltip1';
	  helpTooltip = new ol.Overlay({
	    element: helpTooltipElement,
	    offset: [35, 0],
	    positioning: 'center-left'
	  });
	  map.addOverlay(helpTooltip);
	}
	
	
	/**
	 * Creates a new measure tooltip
	 */
	function createMeasureTooltip() {
	  if (measureTooltipElement) {
	    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
	  }
	  measureTooltipElement = document.createElement('div');
	  measureTooltipElement.className = 'tooltip1 tooltip-measure';
	  measureTooltip = new ol.Overlay({
	    element: measureTooltipElement,
	    offset: [0, -45],
	    positioning: 'bottom-center'
	  });
	  map.addOverlay(measureTooltip);
	}

	var maplayerlength = map.getLayers().getLength();
	map.getLayers().insertAt((maplayerlength),vector);
	
	
	/**
	 * Let user change the geometry type.
	 * @param {Event} e Change event.
	*/

	function toggleControl() { 
	  var measurecontrol = document.getElementById('type').value;
		 if (measurecontrol == "none")
		{
		  map.removeInteraction(draw);
		  document.getElementById('stopmeasuringmessage').innerHTML = '';
		  var overlayslength = map.getOverlays().getLength();
		  if (overlayslength > 0) {map.getOverlays().clear();}
		  if (map.getLayers().getLength() ==  4)
		  map.getLayers().getArray()[3].getSource().clear();
			}
		 else if (measurecontrol != "none")
		 {
		  map.removeInteraction(draw);
		  addInteraction();
		  document.getElementById('stopmeasuringmessage').innerHTML = '<a href="javascript:stopmeasuring()">Return to normal mouse navigation</a>';
		  createMeasureTooltip();
		  createHelpTooltip();
		  map.on('pointermove', pointerMoveHandler);
		 }
		};


	function stopmeasuring() {
		document.getElementById('type').selectedIndex = 0;
		map.removeInteraction(draw);
		var overlayslength = map.getOverlays().getLength();
		if (overlayslength > 0) {map.getOverlays().clear();}
		if (map.getLayers().getLength() ==  4)
		map.getLayers().getArray()[3].getSource().clear();
		document.getElementById('stopmeasuringmessage').innerHTML = '';
		} 




	/**
	 * format length output
	 * @param {ol.geom.LineString} line
	 * @return {string}
	 */
	  var formatLength = function(line) {
	  var length;
	{
	    var coordinates = line.getCoordinates();
	    length = 0;
	    var sourceProj = map.getView().getProjection();
	    for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
	      var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
	      var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
	      length += wgs84Sphere.haversineDistance(c1, c2);
	    }
	  } 
	  var output;
	if (length > 1000) {
	    output = ' ' + (parseFloat(length / 1000 * 100) / 100).toFixed(3) +
	        ' ' + 'kilometres / ' +  (parseFloat(length / 1000 * 62.1371192) / 100).toFixed(3) + ' ' + 'miles &nbsp;';
	  } else {
	    output = ' ' + (parseFloat(length * 100) / 100).toFixed(3) +
	        ' ' + 'metres / ' +  (parseFloat(length * 100 / 100 * 3.2808399)).toFixed(3) + ' ' + 'feet &nbsp;';
	  }
	  return output ;
	};
	



	/**
	 * format length output
	 * @param {ol.geom.Polygon} polygon
	 * @return {string}
	 */
	var formatArea = function(polygon) {
	  var area;
		 {
	    var sourceProj = map.getView().getProjection();
	    var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(
	        sourceProj, 'EPSG:4326'));
	    var coordinates = geom.getLinearRing(0).getCoordinates();
	    area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
	  } 
	  var output;
	  if (area > 10000) {
	    output = (parseFloat(area / 1000000 * 100) / 100).toFixed(3) +
	        ' ' + 'square kilometres / '  +  (parseFloat(area / 1000000 * 38.610) / 100).toFixed(3) + ' ' + 'square miles &nbsp;';
	  } else {
	    output = (parseFloat(area * 100) / 100).toFixed(3) +
	        ' ' + 'square metres / '  +  (parseFloat(area / 100 * 107639.104) / 100).toFixed(3) + ' ' + 'square feet &nbsp;';
	  }
	  return output;
	};
	
	var measurecontrol = document.getElementById('type').value;
	if (measurecontrol != "none") {
	addInteraction();
	}

    // Initialize the Gazetteer with autocomplete and County+Parish selector
     nlsgaz(function(minx,miny,maxx,maxy){
      // alert(minx + ' ' + miny + ' ' + maxx + ' ' + maxy);

      // zoom to gridref
      if (miny == null) {
         var osgbnum = gridrefLetToNum(minx);
	 // console.log(osgbnum);
         // var osgb = new OpenLayers.LonLat(osgbnum[0], osgbnum[1]);
	 point27700 = [];
	 point27700.push(parseFloat(osgbnum[0]), parseFloat(osgbnum[1]));
	 console.log(point27700);
	 point3857 = [];
	 point3857 = ol.proj.transform(point27700,"EPSG:27700", "EPSG:3857");
	 var a = map.getView().setCenter(point3857);
    	 var b = map.getView().setZoom(6+minx.length);

	 return a && b;

      }
      // zoom to bbox
      var extent = [minx, miny, maxx, maxy];
        extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:4326", "EPSG:3857"));
        map.getView().fitExtent(extent, map.getSize());
       
     });



function updateOverlaySwitcher() {
  // Initialize tree overlay switcher
  overlayTree = {title: 'Historic Overlays', layer: null, subnodes: []};
  for (var x = 0; x < overlayLayers.length; x++) {
      // if (!overlayLayers[x].displayInLayerSwitcher) continue;
      //historical overlayTree
      var titleArray = overlayLayers[x].get('title').split('-');
      var title1 = jQuery.trim(titleArray.shift());
      var title2 = jQuery.trim(titleArray.join('-'));
      var node = {title: title1, subnodes: [{title: title2, layer: overlayLayers[x]}]};
      addNode(overlayTree, node);
      var overlayNodePath = [];
      var node1 = getNode(overlayTree, title1);
      overlayNodePath.push(indexOf(overlayTree.subnodes, node1));
      var node2 = getNode(node1, title2);
      overlayNodePath.push(indexOf(node1.subnodes, node2));
      overlayLayers[x].overlayNodePath = overlayNodePath;
  }

 // Initialize overlay switcher

 var overlaySelectNode = document.getElementById('overlaySelectNode');
  if (!initialisation) {
    while (overlaySelectNode.hasChildNodes()) {
      overlaySelectNode.removeChild(overlaySelectNode.lastChild);
    }
  } else {
    initialisation = false;
  }
  
  for(var i1 = 0; i1 < overlayTree.subnodes.length; i1++) {
    var node1 = overlayTree.subnodes[i1];
    var option = document.createElement('option');
    option.appendChild(document.createTextNode(node1.title));
    option.setAttribute('value', i1);
    option.setAttribute('id', 'overlayOption' + node1.title);
    overlaySelectNode.appendChild(option);
  }

}


function switchOverlayinitial() {

    	overlaySelected.setVisible(true);
    	map.getLayers().insertAt(2,overlaySelected);
    	var map_group = overlaySelected.get('group_no');
    		if (document.getElementById('URHere') != null) { setResults1(map_group); }
    		var map_group_keytext = overlaySelected.get('keytext');
    		if (map_group_keytext != null) { document.getElementById('layertext').innerHTML = map_group_keytext; }

	var e1 = document.getElementById('overlaySelectNode');
        var selNode1Index = e1.options[e1.selectedIndex].value;
        var node1 = overlayTree.subnodes[selNode1Index];
        var e2 = document.getElementById('overlaySelectLayer');
        var selNode2Index = e2.options[e2.selectedIndex].value;
        var selOverlay = node1.subnodes[selNode2Index];
            //set switchers to permalink overlay
        if(selOverlay.layer!==overlaySelected) {
                e1.options[overlaySelected.overlayNodePath[0]].selected = true;
                loadOverlayNode();
                e2.options[overlaySelected.overlayNodePath[1]].selected = true;
                // switchOverlay();
        } 
}


function switchOverlay() {

	// if (overlay) overlay.layer.setVisible(false);
	// if (map.getLayers().getLength() == 3) map.getLayers().removeAt(2);
	map.getLayers().removeAt(2);
	// if (map.getLayers().getLength() == 2) map.getLayers().removeAt(1);


        document.getElementById('layertext').innerHTML = "";
	if (document.getElementById('overlaySelectNode').length !=0) {
    		var e1 = document.getElementById('overlaySelectNode');
    		var selNode1Index = e1.options[e1.selectedIndex].value;
    		var node1 = overlayTree.subnodes[selNode1Index];
    		var e2 = document.getElementById('overlaySelectLayer');
    		var selNode2Index = e2.options[e2.selectedIndex].value;
    		overlay = node1.subnodes[selNode2Index];
    		overlay.layer.setVisible(true);
    // map.getLayers().getArray()[1].setVisible();
    // layers.setAt(index + 1, layer);
    		map.getLayers().insertAt(2,overlay.layer);
		map.getLayers().getArray()[2].setOpacity(opacity);
    		var map_group = overlay.layer.get('group_no');
    			if (document.getElementById('URHere') != null) { setResults1(map_group); }
    			var map_group_keytext = overlay.layer.get('keytext');
    			if (map_group_keytext != null) { document.getElementById('layertext').innerHTML = map_group_keytext; }
    			updateUrl();
	}
}



function switchOverlayUpdateMode() { 
  var titleArray = overlayOldName.split('-'); 
  // var titleArray = overlayOldName.get('title').split('-');      
  var title1 = jQuery.trim(titleArray.shift());
  var title2 = jQuery.trim(titleArray.join('-'));
  var layerIsInSelection = false;
  for (var i = 0; i < overlayLayers.length; i++) {
    if (overlayLayers[i].name === overlayOldName) {
      var e1 = document.getElementById('overlaySelectNode');
      for (var ii = 0 ; ii < e1.options.length; ii++) {
        if (e1.options[ii].text === title1) {
          e1.value = ii;
        }
      }
      loadOverlayNode();
      var e2 = document.getElementById('overlaySelectLayer');
      for (var ii = 0 ; ii < e2.options.length; ii++) {
        if (e2.options[ii].text === title2) {
          e2.value = ii;
        }
      }
      layerIsInSelection = true;
    }
  }
  
  // if (!layerIsInSelection) switchOverlay();
}

// Return direct subnode from given tree
function getNode(tree, nodeTitle) {
    if(tree.subnodes) {
        for(var i = 0; i < tree.subnodes.length; i++) {
            if(tree.subnodes[i].title==nodeTitle) {
                return tree.subnodes[i];
            }
        }
    }
    return false;
};

// Add given node to given tree
function addNode(tree, nodeToAdd) {
    var existingNode = getNode(tree, nodeToAdd.title);
    if(existingNode && nodeToAdd.subnodes) {
        for(var i = 0; i < nodeToAdd.subnodes.length; i++) {
            addNode(existingNode, nodeToAdd.subnodes[i]);
        }
    } else {
        tree.subnodes.push(nodeToAdd);
    }
};



// Load overlay layers of current node
function loadOverlayNode() {
    var e1 = document.getElementById('overlaySelectNode');
    var e2 = document.getElementById('overlaySelectLayer');    
    while (e2.hasChildNodes()) {
      e2.removeChild(e2.lastChild);
    }
    if (e1.length != 0) {
      var selNodeIndex = e1.options[e1.selectedIndex].value;
      var node1 = overlayTree.subnodes[selNodeIndex]; 

      for(var i2 = 0; i2 < node1.subnodes.length; i2++) {
        var node2 = node1.subnodes[i2];
        var option = document.createElement('option');
        option.appendChild(document.createTextNode(node2.title));
        option.setAttribute('value', i2);
        option.setAttribute('id', 'overlayOption' + node2.title);
        e2.appendChild(option);
      }
    }
}

// IE7- do not support Array.indexOf
function indexOf(array, item) {
    for(var i=0; i<array.length; i++) {
        if(array[i]==item) {
            return i;
        }
    }
    return null;
}

var exportPNGElement = document.getElementById('export-png');
/*
*if ('download' in exportPNGElement) {
*  exportPNGElement.addEventListener('click', function(e) {
*    map.once('postcompose', function(event) {
*      var canvas = event.context.canvas;
*      exportPNGElement.href = canvas.toDataURL('image/png');
*    });
*    map.renderSync();
*  }, false);
*} else {
*  var info = document.getElementById('no-download');
*  info.style.display = '';
*}
*/






function setResults1(str) {  
       if (str == 2)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/towns/index.html\">Town Plans \/ Views, 1580-1919</a>";
  }
       else if (str == 3)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/atlas/thomson/index.html\">John Thomson's Atlas of Scotland, 1832</a>";
  }
       else if (str == 4)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/counties/index.html\">Counties of Scotland, 1580-1928</a>";
  }
       else if (str == 5) 
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/scotland/index.html\">Maps of Scotland, 1560-1928</a>";
  }
       else if (str == 6)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/atlas/taylor-skinner/index.html\">Taylor and Skinner\'s Survey, 1776</a>";
  }
       else if (str == 8)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/atlas/bartholomew/index.html\">Bartholomew Survey Atlas of Scotland, 1912</a>";
  }
       else if (str == 12)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/bathymetric/index.html\">Bathymetrical Survey of Fresh-Water Lochs, 1897-1909</a>";
  }
       else if (str == 15)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/coasts/index.html\">Coasts of Scotland on marine charts, 1580-1850</a>";
  }
       else if (str == 18)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/coasts/admiralty_charts_list.html\">Admiralty Charts of Scotland, 1795-1963</a>";
  }
       else if (str == 20)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/atlas/blaeu/index.html\">Blaeu Atlas of Scotland, 1654</a>";
  }
       else if (str == 22)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/roy/antiquities/index.html\">Roy Military Antiquities of the Romans, 1793</a>";
  }
       else if (str == 23)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/estates/golspie-loth/index.html\">Survey of farms in Golspie and Loth, Sutherland, 1772</a>";
  }
       else if (str == 25)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/pont/index.html\">Maps by Timothy Pont</a>";
  }
       else if (str == 26)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/mapmakers/gordon.html\">Maps by Robert &amp; James Gordon, ca.1636-1652</a>";
  }
       else if (str == 27)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/mapmakers/adair.html\">Maps by John Adair</a>";
  }
       else if (str == 28)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/mapmakers/moll.html\">Maps by Herman Moll</a>";
  }
       else if (str == 31)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/os/air-photos/index.html\">OS Air Photo Mosaics of Scotland, 1944-1950</a>";
  }
       else if (str == 32)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/os/25k-gb-1937-61/index.html\">OS 1:25,000 maps of Great Britain, 1937-1961</a>";
  }
       else if (str == 33)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/os/25inch/index.html\">OS 25 inch to the mile, 1st edition, 1855-1882</a>";
  }
       else if (str == 34)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/os/25inch-2nd-and-later/index.html\">OS 25 inch 2nd and later eds, 1892-1949</a>";
  }
       else if (str == 35)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/os/6inch/index.html\">OS Six-inch 1st edition, 1843-1882</a>";
  }
       else if (str == 36)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/os/6inch-2nd-and-later/index.html\">OS Six-inch Scotland 1892-1960;</a> or <a href=\"/os/6inch-england-and-wales/index.html\">England and Wales, 1842-1952</a>";
  }
       else if (str == 37)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/os/one-inch-popular-nat-grid/index.html\">OS One-inch Popular with Nat Grid, 1945-1947</a>";
  }
       else if (str == 38)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/os/one-inch-1st/index.html\">OS One-inch to the mile, Scotland, 1st Edition, 1856-1891</a>";
  }
       else if (str == 39)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/os/one-inch-2nd/index.html\">OS One-inch Scotland, 1885-1900</a> or <a href=\"/os/one-inch-rev-new-series/index.html\">England and Wales, 1892-1908</a>";
  }
       else if (str == 40)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/os/one-inch-popular/index.html\">OS One-inch \"Popular\" edition, Scotland, 1921-1930</a>";
  } 
       else if (str == 41)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/townplans/index.html\">OS large scale Scottish town plans, 1847-1895</a>";
  }
       else if (str == 42)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/os/county-series/index.html\">OS Indexes to the County Series maps, Scotland, 1854-1886</a>";
  }
       else if (str == 43)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/os/quarter-inch/index.html\">OS Quarter Inch to the Mile Maps of Scotland, 1921-1923</a>";
  }
       else if (str == 44)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/os/ten-mile/index.html\">OS ten-mile Planning Maps of Great Britain, 1944-1960</a>";
  }
       else if (str == 45)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/series/bart_scotland_halfinch_list.html\">Bartholomew\'s \"Half Inch to the Mile Maps\" of Scotland, 1926-1935</a>";
  }
       else if (str == 47)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/military/scotland.html\">Military Maps of Scotland (18th century)</a>";
  }
       else if (str == 50)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/bart_half_england.html\">Bartholomew's Half Inch England and Wales, 1902-1906</a>";
  }
       else if (str == 54)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/os/one-inch-rev-new-series/index.html\">OS One-Inch, England and Wales, Rev New Series</a>";
  }
       else if (str == 55)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/os/one-inch-seventh-series/index.html\">OS One-inch, Seventh Series, 1952-1961</a>";
  }
       else if (str == 56)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/os/one-inch-new-popular/index.html\">OS One-inch England and Wales, New Popular, 1945-1947</a>";
  }

       else if (str == 57)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/os/london-1890s/index.html\">OS Five feet to the mile, London, 1893-6</a>";
  }

       else if (str == 59)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/os/6inch-england-and-wales/index.html\">England and Wales, 1842-1952</a> or <a href=\"/os/6inch-2nd-and-later/index.html\">OS Six-inch Scotland 1892-1960</a> ";
  }

       else if (str == 60)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/ww1/trenches/index.html\">British First World War Trench Maps, 1915-1918</a>";
  }
       else if (str == 61)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/os/national-grid/index.html\">OS National Grid Maps, 1940s-1960s</a>";
  }
       else if (str == 63)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/jamaica/index.html\">James Robertson's Maps of Jamaica, 1804</a>";
  }
       else if (str == 64)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/os/25inch-england-and-wales/index.html\">OS 25 inch England and Wales, 1841-1952</a>";
  }
       else if (str == 65)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/series/land-utilisation-survey/index.html\">Land Utilisation Survey, Scotland, 1931-1935</a>";
  }

       else if (str == 96)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/coasts/index.html\">Coasts of Scotland on marine charts, 1580-1850</a> <a href=\"/coasts/admiralty_charts_list.html\">Admiralty Charts of Scotland, 1795-1963</a>";
  }

       else if (str == 98)
  {
  document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> <a href=\"/os/index.html\">Ordnance Survey Maps, 1840s-1960s</a>";
  }

  else {
    document.getElementById('URHere').innerHTML = "<a href=\"/index.html\">Maps home</a> \> ";
  }
}




