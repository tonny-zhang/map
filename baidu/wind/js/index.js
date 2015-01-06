!function(){
	loadWind();
	require.config({
		packages: [
            {
                name: 'zrender',
                location: '../../../git_project/zrender/src',
                main: 'zrender'
            }
        ],
        paths: {
            echarts: '../../../git_project/echarts/build/source'
        }
    });
    var $chart_container = $('#chart_container');
    function clearData(){
    	current_map_point = null;
    	$air_ul.removeData('flag');
    }
    var $btn_close = $('.btn_close').click(function(){
    	$chart_container.hide();
    	clearData();
    });
    $('#btn_back').click(function(){
    	$chart_container.removeClass('show_air');
    });
    
    var arr_week = ['周日','周一','周二','周三','周四','周五', '周六'];
    var today = new Date().getDay();
    var $air_ul = $('.air ul');
    var $loading_wind = $('#loading_wind'),
    	$loading_air = $('#loading_air');
    $('#btn_air').click(function(){
    	$chart_container.addClass('show_air');
    	if(current_map_point){
    		if($air_ul.data('flag')){
    			return;
    		}
    		$loading_air.show();
    		loadAir(current_map_point.lng, current_map_point.lat, function(data){
    			if(data){
    				var arr = [parseFloat(data['024']), parseFloat(data['048']), parseFloat(data['072'])];
    				var html = '';
    				$.each(arr, function(i,v){
    					var week_index = today+i+1;
    					week_index = week_index % 7;
    					var text = '',
    						color = '',
    						week = arr_week[week_index];
    					if(v >= 0 && v < 50){
    						text = '好';
    						color = 'rgb(0, 255, 0)';
    					}else if(v >= 50 && v < 100){
    						text = '较好';
    						color = 'rgb(150, 230, 0)';
    					}else if(v >= 100 && v < 150){
    						text = '一般';
    						color = 'rgb(255, 255,0)';
    					}else if(v >= 150 && v < 200){
    						text = '较差';
    						color = 'rgb(255, 100, 0)';
    					}else if(v >= 200 && v < 300){
    						text = '差';
    						color = 'rgb(255, 0, 0)';
    					}else{
    						text = '极差';
    						color = 'rgb(126, 0, 35)';
    					}
    					html += '<li>'+week+'<span style="background-color: '+color+'"></span>'+text+'</li>';
    				});
    				$air_ul.html(html);
    				$loading_air.hide();
    				$air_ul.data('flag', true);
    			}
    		});
    	}
    });
	var $no_data = $('#no_data');
    var current_map_point;
	require([
        'echarts',
        'echarts/chart/line'
    ], function (ec) {
    	var marker;
    	var myChart = ec.init(document.getElementById('chart'));
    	var tt;
    	function dragendOrZoomend(){
    		clearTimeout(tt);
    		tt = setTimeout(function(){
    			if(marker && $chart_container.is(':visible')){
    				var pos = marker.getPosition();
    				var pixel = map.pointToPixel(pos);
    				$chart_container.css({
		    			left: pixel.x+15,
		    			top: pixel.y-30
		    		});
    			}
    		},100);
    	}
    	map.addEventListener("dragend", dragendOrZoomend);
	    map.addEventListener("zoomend", dragendOrZoomend);
    	map.addEventListener("click", function(e){
    		clearData();
    		current_map_point = e.point;
    		if(!marker){
    			marker = new BMap.Marker(current_map_point);
    			map.addOverlay(marker);
    		}else{
    			marker.setPosition(current_map_point);
    		}
    		$chart_container.removeClass().css({
    			left: e.offsetX+15,
    			top: e.offsetY-30
    		}).show();
    		$loading_wind.show();
    		console.log(current_map_point.lng, current_map_point.lat, getWind(current_map_point.lng, current_map_point.lat).length());
    		loadWindSpeed(current_map_point.lng, current_map_point.lat, function(data){
    			var hwind = data.hwindspeed || [],
    				fwind = data.fwindspeed || [];
    			var windspeed = [].concat(hwind, fwind);
    			if(windspeed.length == 0){
    				return $chart_container.addClass('no_data_container');
    			}
    			var arr_val = [],
    				arr_time = [];
    			$.each(windspeed,function(i, v){
    				arr_val.push(parseFloat(v.jd));
    				arr_time.push(parseInt(v.jf.substr(8,2))+'时');
    			});
    			myChart.setOption({
    				title : {
				        text: '未来12小时风速预测',
				        textStyle: {
				        	fontWeight: 'bold',
				        	color: '#E36A0C'
				        }
				    },
    				tooltip : {
		                trigger: 'axis',
		                formatter: function(params,ticket,callback){
		                	var param = params[0];
		                	var index = param['dataIndex'];
		                	var day = '';
		                	try{
			                	day = parseInt(windspeed[index].jf.substr(6,2))+'日';
			                }catch(e){}
		                	return day+param[1]+'风速：'+param['value']+'米/秒';
		                }
		            },
    				calculable : true,
    				xAxis : [
		                {
		                	type: "category",
							boundaryGap: !0,
							data: arr_time,
							axisLine: {
								show: !1
							},
							axisTick: {
								show: !1
							},
							axisLabel: {
								margin: 10,
								interval: 1,
								textStyle: {
									fontSize: 10,
									fontWeight: "lighter"
								}
							},
							splitLine: {
								show: !1
							},
							splitArea: {
								show: !1
							}
						}
		            ],
		            yAxis : [
		            	{
		            		type: "value",
		            		name: '风速(m/s)',
		            		min: 0,
							boundaryGap: !1,
							precision: 0,
							axisLine: {
								show: true
							},
							axisTick: {
								show: true
							},
							splitNumber: 4,
							splitArea: {
								show: false
							},
							scale: true,
							boundaryGap: true,
							boundaryGap: [.1, .1],
							axisLabel: {
								margin: 20
							}
		            	}
		            ],
		            grid: {
						x: 50,
						y: 50,
						x2: 30,
						y2: 70,
						borderWidth: 0
					},
		            series : [
		                // {
		                //     name: '风速',
		                //     type: 'line',
		                //     smooth: true,
		                //     data: arr_val.slice(0,Math.floor(arr_val.length/2))
		                // },
		                {
		                    name: '风速',
		                    type: 'line',
		                    smooth: true,
		                    symbol: "circle",
							symbolSize: 3,
							showAllSymbol: !0,
		                    data: arr_val,//.slice(Math.ceil(arr_val.length/2)),
		                    itemStyle: {
								normal: {
									color: "#006fc9",
									lineStyle: {
										color: "#006fc9",
										type: "dotted"
									},
									borderColor: "#006fc9",
									borderWidth: 2
								},
								emphasis: {
									color: "#006fc9",
									borderColor: "#006fc9",
									borderWidth: 2
								}
							}
		                }
		            ]
    			});
				
				$loading_wind.hide();
    		});
			e.domEvent.preventDefault();
    	});
    });
	loadXSC();
}();