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
    	$air_legend.removeData('flag');
    }
    var $btn_close = $('.btn_close').click(function(){
    	$chart_container.hide();
    	clearData();
    });
    $('#btn_back').click(function(){
    	$chart_container.removeClass('show_air');
    });
    var $nav_h3 = $('.nav h3').click(function(){
        var $this = $(this);
        $module_move.css('margin-left', $this.is('.second')?'-100%': 0);
        $nav_h3.removeClass('on');
        $this.addClass('on');
    });
    var $wind_air = $('.air');
    var DESC_AIR = [
        ['好','rgb(0, 255, 0)','非常有利于空气污染物稀释、扩散和清除','icon_1'],
        ['较好','rgb(150, 230, 0)','较有利于空气污染物稀释、扩散和清除','icon_2'],
        ['一般','rgb(255, 255,0)','对空气污染物稀释、扩散和清除无明显影响','icon_3'],
        ['较差','rgb(255, 100, 0)','不利于空气污染物稀释、扩散和清除','icon_4'],
        ['差','rgb(255, 0, 0)','很不利于空气污染物稀释、扩散和清除','icon_5'],
        ['极差','rgb(126, 0, 35)','极不利于空气污染物稀释、扩散和清除','icon_6']
    ];
    var $module_move = $('.module_move');
    var $air_legend = $('.legend'),
        $desc_air = $('.desc_air'),
        $air_day = $('.day');
    var html_air = '';
    $.each(DESC_AIR, function(i, v){
        html_air += '<li style="background-color: '+v[1]+';color:'+(i<3?'#3d3d3d':'white')+'" class="li_'+(i+1)+'">'+v[0]+'<span></span></li>'
    });
    $air_legend.html(html_air+'<li class="arrowli animate"></li>');

    $air_day.delegate('li', 'mouseenter', function(){
        // $(this).addClass('on').siblings().removeClass('on');
        _change_icon($(this).index());
    });

    var $icon = $('.icon'),
        $legend_li = $air_legend.find('li');
    var $arrow = $('.arrow'),
        $arrowli = $air_legend.find('.arrowli');
    var ALIGN_VAL = ['left', 'center', 'right'];
    function _change_icon(index){
        var $li = $air_day.find('li').eq(index);
        var desc = $li.data('desc'),
            c = $li.data('class'),
            level = $li.data('level');

        $desc_air.text(desc).css('text-align', ALIGN_VAL[index]);
        $icon.removeClass().addClass('icon '+c);
        var $legend_on = $legend_li.removeClass('on').eq(level).addClass('on');
        $arrow.css('left', $li.position().left + $li.width()/2 - 13);
        $arrowli.css('left', $legend_on.position().left + $legend_on.width()/2 - 17);
    }
    $nav_h3.eq(1).click(function(){
        if($air_legend.data('flag')){
            return;
        }
        $wind_air.addClass('data_loading');
        loadAir(current_map_point.lng, current_map_point.lat, function(data){
            if(data){
                $wind_air.removeClass('data_loading');
                $wind_air.removeClass('no_data');

                var arr = [parseFloat(data['024']), parseFloat(data['048']), parseFloat(data['072'])];
                var m = /(\d{4})(\d{2})(\d{2})(\d{2})/.exec(data.timestamp);
                if(m){
                    var date = new Date(m[1]+'-'+m[2]+'-'+m[3]+' '+m[4]+':00');
                }else{
                    var date = new Date();
                }
                function _format_num(num){
                    if(num < 10){
                        return '0'+num;
                    }
                    return num;
                }
                function _format_date(d){
                    return _format_num(d.getMonth()+1)+'-'+_format_num(d.getDate());
                }
                var arr_date = ['今天', '明天', '后天'];
                var html = '';
                $.each(arr, function(i, v){
                    var d = new Date(date.getTime());
                    d.setDate(d.getDate()+i+1);
                    var level_index = parseInt(data['0'+(24*(i+1))]-60);
                    var val = DESC_AIR[level_index];
                    html += '<li data-level="'+level_index+'" data-desc="'+val[2]+'" data-class="'+val[3]+'"><b>'+arr_date[i]+'</b><span>'+_format_date(d)+'</span></li>';
                });
                $air_day.html(html);
                _change_icon(0);
                $air_legend.data('flag', true);
            }else{
                $wind_air.addClass('no_data');
            }
        });
    });
    
    var arr_week = ['周日','周一','周二','周三','周四','周五', '周六'];
    var today = new Date().getDay();
    
    var $loading_wind = $('#loading_wind'),
    	$loading_air = $('#loading_air');
    
    var current_map_point;
    var $wind_chart = $('.wind_chart');
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
    	// map.addEventListener("dragend", dragendOrZoomend);
	    // map.addEventListener("zoomend", dragendOrZoomend);
    	map.addEventListener("click", function(e){
    		clearData();
    		current_map_point = e.point;
    		if(!marker){
    			marker = new BMap.Marker(current_map_point);
    			map.addOverlay(marker);
    		}else{
    			marker.setPosition(current_map_point);
    		}
    		$chart_container.removeClass().show();
            $wind_chart.addClass('data_loading');
            $nav_h3.first().click();
    		// console.log(current_map_point.lng, current_map_point.lat, getWind(current_map_point.lng, current_map_point.lat).length());
    		loadWindSpeed(current_map_point.lng, current_map_point.lat, function(data){
                $wind_chart.removeClass('data_loading');
                if(!data){
                    $wind_chart.addClass('no_data');
                }else{
                    $wind_chart.removeClass('no_data');
                }

                var m = /(\d{4})(\d{2})(\d{2})(\d{2})/.exec(data.timestamp);
                if(m){
                    var date = new Date(m[1]+'-'+m[2]+'-'+m[3]+' '+m[4]+':00');
                }else{
                    var date = new Date();
                }
                var hour = date.getHours();
                delete data.timestamp;
                var arr_val = [],
                    arr_time = [];
                for(var i in data){
                    arr_val.push(parseFloat(data[i].windspeed));
                    var h = parseInt(i) + hour;
                    h %= 24;
                    arr_time.push(h + ':00');
                }
                var splitLineColor = 'rgba(255, 255, 255, 0.15)';
    			myChart.setOption({
    				tooltip : {
		                trigger: 'axis',
                        backgroundColor: 'white',
                        borderRadius : 5,
                        textStyle: {
                            color: '#ed415a',
                            fontSize: 24
                        },
                        padding: [5, 20, 5, 20],
                        axisPointer: {
                            lineStyle: {
                                color: 'red'
                            }
                        },
		                formatter: function(params,ticket,callback){
		                	var param = params[0];
		                	var index = param['dataIndex'];

		                	return param[1]+'风速：'+param['value']+'米/秒';
		                }
		            },
    				calculable : true,
    				xAxis : [
		                {
		                	type: "category",
							boundaryGap: !0,
							data: arr_time,
							axisLine: {
								show: false,
                                lineStyle: {
                                    color: splitLineColor
                                }
							},
							axisTick: {
								show: true
							},
							axisLabel: {
								margin: 10,
								interval: 1,
								textStyle: {
                                    color: 'white',
									fontSize: 10,
									fontWeight: "lighter"
								}
							},
							splitLine: {
								show: true,
                                lineStyle: {
                                    color: splitLineColor
                                }
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
							boundaryGap: false,
							precision: 0,
							axisLine: {
								show: false,
                                lineStyle: {
                                    color: splitLineColor
                                }
							},
							axisTick: {
								show: true
							},
							splitArea: {
								show: false
							},
							scale: true,
							boundaryGap: [.1, .1],
							axisLabel: {
								margin: 20,
                                textStyle: {
                                    color: 'white'
                                }
							},
                            splitLine: {
                                onGap: true,
                                lineStyle: {
                                    color: splitLineColor
                                }
                            }
		            	}
		            ],
		            grid: {
						x: 50,
						y: 50,
						x2: 30,
						y2: 70,
						borderWidth: 1,
                        borderColor: splitLineColor
					},
		            series : [
		                {
		                    type: 'line',
		                    smooth: true,
		                    symbol: "circle",
							symbolSize: 3,
							showAllSymbol: !0,
		                    data: arr_val,
                            markPoint: {
                                data: [
                                    {
                                        symbol: 'circle',
                                        symbolSize: 8,
                                        xAxis: 0,
                                        yAxis: arr_val[0],
                                        itemStyle: {
                                            normal: {
                                                color: "white",
                                                borderColor: "white",
                                                borderWidth: 5
                                            }
                                        }
                                    },
                                    {
                                        symbol: 'circle',
                                        symbolSize: 8,
                                        xAxis: arr_val.length-1,
                                        yAxis: arr_val[arr_val.length-1],
                                        itemStyle: {
                                            normal: {
                                                color: "white",
                                                borderColor: "white",
                                                borderWidth: 5
                                            }
                                        }
                                    }
                                ]
                            },
		                    itemStyle: {
								normal: {
									color: "#070d29",
									lineStyle: {
                                        width: 7,
										color: "white",
										type: "dotted"
									},
									borderColor: "white",
									borderWidth: 0
								}
							}
		                }
		            ]
    			});
    		});
			e.domEvent.preventDefault();
    	});
    });
	// loadXSC();
}();