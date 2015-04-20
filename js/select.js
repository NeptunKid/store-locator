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
	map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
	map.setCurrentCity("上海");          // 设置地图显示的城市 此项是必须设置的
	map.enableScrollWheelZoom();
	$.getJSON ('js/stores.json', function(data) {
		var stores = [];
		var menu = [];
		$.each (data['Provinces'], function(i, pval) {
			var name = pval['Name'];
			//provinces.push(name);
			var item = $('<li><a role="menu-item">' + name +'</a></li>' );
			item.val(name);
			/* Add each city to the menu and create event handlers. */

			// var cityMenu = $('<ul id="city-menu" class="dropdown-menu" role="menu" aria-labelledby="city-input"></ul>');
			var cityMenu =$('<ul></ul>');
			var cityList = [];
			$.each(pval['Cities'], function(i, cval) {
				var citem = createCity(cval['Name'], cval['Stores']);
				citem.appendTo(cityMenu);
				cityList.push(citem);
			});	
			item.data('cityList', cityList);
			item.data('cities', cityMenu); // Bind the city selector to province selector's data.
			/* Click event handler for province selector.*/
			item.on('click', function(){
				$('#prov-input').val(name);
				$('#city-input').val('');
				$('#city-menu').empty();
				// $(this).data('cities').appendTo('#city-menu');// Replace the dropdown menu for cities.
					$.each($(this).data('cityList'), function(i, city) {
						city.clone(true).appendTo('#city-menu'); // Deep clone of the city menu.
				} );
			})
			item.appendTo('#prov-menu');
		});
	});

	var createCity = function(name, storeList) {
		var city = $('<li><a role="menu-item">' + name + '</a></li>');
		/* Use the data- property to store all store information belong to this city. */
		city.val(name);
		city.data('stores', storeList);
		city.data('drawn', false); // Newly created city is not drawn yet.
		/* Click event handler for city dropdown selector. */
		city.on('click', function () {
			$('#city-input').val(name);
			map.setCurrentCity(name); // TODO: make a closure for name. 
			if ($(this).data('drawn') == false) { // don't drawn the same city twice.
				var storeList = $(this).data('stores');
			    var pointList = [];
				$.each(storeList, function(i, store){
					var point = new BMap.Point(store['Longitude'], store['Latitude']);    
					pointList.push(point);
					drawOnMap(map, store['Name'], store['Address'], point);
				});
				$(this).data('pointList', pointList);
				$(this).data('drawn', true);
			}
			map.setViewport($(this).data('pointList')); 
		});
		return city;
	}
}  

function drawOnMap(map, name, address, point) {
	var marker = new BMap.Marker(point);        // Create a marker    
	var opts = {    
		width : 250,     // 信息窗口宽度    
		height: 100,     // 信息窗口高度    
		title : name  // 信息窗口标题   
	}    
	var infoWindow = new BMap.InfoWindow(address, opts);  // 创建信息窗口对象    
	marker.infoWindow = infoWindow;
	marker.addEventListener("click", function(e){//添加标注的点击事件回调
		this.openInfoWindow(e.target.infoWindow); 
	});
	map.addOverlay(marker);    
}
