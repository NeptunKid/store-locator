/**
 * @author: Ruoyi Chen
 **/
$(function () {
	$.getJSON ('js/stores.json', function(data) {
		var stores = [];
		var menu = [];
		$.each (data['Provinces'], function(i, pval) {
			var name = pval['Name'];
			var item = $('<li><a role="menu-item">' + name +'</a></li>' );
			item.val(name);
			// Add each city to the menu.
			var cityMenu = $('<ul id="city-menu" class="dropdown-menu" role="menu" aria-labelledby="city-input">');
			$.each(pval['Cities'], function(i, cval) {
				var citem = createCityDom(cval['Name'], cval['Stores']);
				citem.appendTo(cityMenu);
			});	
			item.data('cityMenu', cityMenu);
			// Click event handler for province selector.
			item.on('click', function(){
				$('#prov-input').val(name);
				$('#city-input').val('');
				$('#search-btn').data('city', null);
				$('#city-menu').detach();
			    $(this).data('cityMenu').appendTo('#city-dropdown');
				// TODO: Add event listeners of city-menu items here.
			});
			item.appendTo('#prov-menu');
		});
	});
	loadMap();
});

// Create a jQuery object containing dom and data values for a given city.
var createCityDom = function(name, storeList) {
	var city = $('<li><a role="menu-item">' + name + '</a></li>');
	/* Use the data- property to store all store information belong to this city. */
	city.val(name);
	city.data('stores', storeList);
	city.data('drawn', false); // Newly created city is not drawn yet.
	return city;
}

function loadMap() { // Asynchronously load the lib script.
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://api.map.baidu.com/api?v=2.0&ak=Ch1jgxD8xmtI5tObYIoEZ9dL&callback=initMap";
	document.body.appendChild(script);
}

function initMap() {
	var map = new BMap.Map("map-pane");    
	var originP = new BMap.Point(116.404, 39.915);
	map.centerAndZoom(originP, 5);
	var leftNavigation = new BMap.NavigationControl();  
	map.addControl(leftNavigation);     
	map.setCurrentCity("上海");
	map.enableScrollWheelZoom();

	$.each($('#prov-menu').children(), function(i, prov) {
		$.each($(prov).data('cityMenu').children(), function(j, city) {
			$(city).on('click', function () {
				$('#city-input').val($(city).text());
				if ($('#search-btn').is(':visible')) { // Don't trigger search event handler when search button is shown.
					$('#search-btn').data('city', $(city));
				    return;
				}
				searchEventHandler.bind($(city))(map);
			});
		});
	});

	$('#search-btn').on('click', function() {
		if ($(this).data('city')) {
			searchEventHandler.bind($(this).data('city'))(map);	
		} else { // When no city is chosen, show China map;
			map.centerAndZoom(originP, 5);	
		}
	});
}  

function searchEventHandler(map) { // Use this to refer to the city item.
	var name = this.text();
	map.setCurrentCity(name); 
	$('.info-list').empty(); // Empty the list pane;
	var storeList = $(this).data('stores');
	if ($(this).data('drawn') == false) { // Don't drawn the same city twice.
		var pointList = [];
	    $.each(storeList, function(i, store){
			var point = new BMap.Point(store['Longitude'], store['Latitude']);    
			pointList.push(point);
			drawOnMap(map, store['Name'], store['Address'], point);
		});
		$(this).data('pointList', pointList);
		$(this).data('drawn', true);
	}
	// Show store infor on the list pane.
	$.each(storeList, function(i, store){
		showOnList(store['Name'], store['Address']);
	});
	// Use this line to show all points within the map view.
	// map.setViewport($(this).data('pointList')); 
	map.centerAndZoom(name, 12);
}

function drawOnMap(map, name, address, point) {
	var marker = new BMap.Marker(point);        // Create a marker    
	var opts = {    
		width : 150,         
		height: 100,       
		title: "<b>"+name+"</b>"   
	}    
	var infoWindow = new BMap.InfoWindow(address, opts);  // Create infor window object.    
	marker.infoWindow = infoWindow;
	marker.addEventListener("click", function(e){ // Open the inforWindow when clicking on marker.
		this.openInfoWindow(e.target.infoWindow); 
	});
	map.addOverlay(marker);    
}

function showOnList(name, address) {
	var item = $('<li></li>').addClass('info-list-item row');
	var icon = $('<span></span>').addClass('map-marker').appendTo(item);
	var title = $('<div></div>').addClass('info-name').append('<a href="#">' + name + '</a>');
	title.appendTo(item);
	var info = $('<div></div>').addClass('info-address').append('<b>地址:</b><span href="#">' + address + '</span>');
	info.appendTo(item);
	item.appendTo('.info-list');
}
