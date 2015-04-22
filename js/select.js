/*
* In this case, we read and store all the data once for all. 
* */

$(function () {
	loadMap();
});

function loadMap() {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://api.map.baidu.com/api?v=2.0&ak=Ch1jgxD8xmtI5tObYIoEZ9dL&callback=initEverything";
	document.body.appendChild(script);
}

function initEverything() {
	var map = new BMap.Map("map-pane");            // 创建Map实例
	map.centerAndZoom(new BMap.Point(116.404, 39.915), 5);  // 初始化地图,设置中心点坐标和地图级别
	var leftNavigation = new BMap.NavigationControl();  
	map.addControl(leftNavigation);     
	map.setCurrentCity("上海");          // 设置地图显示的城市 此项是必须设置的
	map.enableScrollWheelZoom();
	$.getJSON ('js/stores.json', function(data) {
		var stores = [];
		var menu = [];
		$.each (data['Provinces'], function(i, pval) {
			var name = pval['Name'];
			var item = $('<li><a role="menu-item">' + name +'</a></li>' );
			item.val(name);
			/* Add each city to the menu and create event handlers. */

			var cityMenu = $('<ul id="city-menu" class="dropdown-menu col-md-12 col-sm-12 col-xs-12" role="menu" aria-labelledby="city-input">');
			// var cityList = []; //
			$.each(pval['Cities'], function(i, cval) {
				var citem = createCity(cval['Name'], cval['Stores']);
				// cityList.push(citem);
				citem.appendTo(cityMenu);
			});	
			item.data('cityMenu', cityMenu);
			/* Click event handler for province selector.*/
			item.on('click', function(){
				$('#prov-input').val(name);
				$('#city-input').val('');
				$('#city-menu').detach();
			    $(this).data('cityMenu').appendTo('#city-dropdown');
				// TODO: Add event listeners of city-menu items here.
			});
			item.appendTo('#prov-menu');
		});
	});

	var createCity = function(name, storeList) {
		var city = $('<li><a role="menu-item">' + name + '</a></li>');
		/* Use the data- property to store all store information belong to this city. */
		city.val(name);
		city.data('stores', storeList);
		city.data('drawn', false); // Newly created city is not drawn yet.
		/*
		 * Click event handler for city dropdown selector.
		 * TODO: Move the event binding process to click event handler of province seletor.
		 * Since it's better practice to delete event listeners when an element is off dom tree,
		 * and re-bind it when added to document structure again.
		 */
		city.on('click', function (e) {
			$('#city-input').val(name);
			map.setCurrentCity(name); // TODO: make a closure for name.
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
            /* Show store infor on the list pane. */
			$.each(storeList, function(i, store){
					showOnList(store['Name'], store['Address']);
			});
			// Use this line to show all points within the map view.
			// map.setViewport($(this).data('pointList')); 
			map.centerAndZoom(name, 12);
		});
		return city;
	}
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
