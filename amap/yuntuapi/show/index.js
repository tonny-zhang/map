!function () {
	var mapObj; //地图对象
	 
	/*
	 *初始化地图
	 *param mapObj 地图对象
	 */
	var marker;
	function mapInit() {
	     
	    mapObj = new AMap.Map("map", {
	        view: new AMap.View2D({
		        center:new AMap.LngLat(116.397428,39.90923),//地图中心点
		        zoom: 8 //地图显示的缩放级别
	        })
	    });
	    marker = new AMap.Marker({
	        position: mapObj.getCenter(),
	        draggable: true, //点标记可拖拽
	        cursor: 'move',  //鼠标悬停点标记时的鼠标样式
	        raiseOnDrag: true//鼠标拖拽点标记时开启点标记离开地图的效果
	 
	    });
	    marker.setMap(mapObj);
	}
	function resetMaker(){

	}
	function loadData(page){
		var url = 'http://yuntuapi.amap.com/datasearch/local?key=b275e5bb60f88f24dc042cb1d1a518d0&tableid=53f1740be4b0dfd37f7460ab&keywords= &city=全国&filter=mobile_item_id:1+d_ctime:['+new Date('2014-08-18 19:00:00').getTime()+','+new Date('2014-08-18 22:00:00').getTime()+']&limit=100&page='+page;
		console.log(url);
		$.getJSON(url,function(data){
			var lineArr = [];
			$.each(data.datas,function(i,v){
				var lnglat = v._location.split(',');
				lineArr.push(new AMap.LngLat(lnglat[0],lnglat[1]));
			});
			//绘制轨迹
		    var polyline = new AMap.Polyline({
		        map: mapObj,
		        path: lineArr,
		        strokeColor: "#00A",//线颜色
		        strokeOpacity: 1,//线透明度
		        strokeWeight: 3,//线宽
		        strokeStyle: "solid"//线样式
		    });
		    mapObj.setFitView();
		    marker.moveAlong(lineArr,5000);
		});
	}
	mapInit();
	loadData(6);
}();