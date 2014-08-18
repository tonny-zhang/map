!function(){
    var $loading = $('#loading');
    var showDataKey;
    var isData_1 = isData_2 = true;
    var $sort_nav = $('#sort_nav').click(function(e){
        $(this).toggleClass('on');
        var $target = $(e.target);
        if($target.is('li') && !$target.hasClass('on')){
            $show_sort.text($target.text());
            $target.siblings().removeClass('on');
            $target.addClass('on');
            var toKey = $target.data('name');
            if(!showDataKey){
                showDataKey = toKey;
            }else{
                if(showDataKey != toKey){
                    showDataKey = toKey;
                    resetOverlay();
                }
            }    
        }
    });
    $('#data_type input').click(function(){
        var $this = $(this);
        var v = $this.val();
        if(v == 1){
            isData_1 = $this.prop('checked');
        }else{
            isData_2 = $this.prop('checked');
        }
        resetOverlay();
    });
    var $show_sort = $sort_nav.find('span');
    $sort_nav.find('li:first').click();
    $sort_nav.toggleClass('on');
    /*自定义覆盖物*/
    (function(global){
        var isCanSeeAllData = true;
        /*配色方案*/
        var COLOR = {
            'precipitationb1h': function(val){
                val = parseFloat(val);
                if(val >= 0 && val < 1){
                    return 'js_1';
                }else if(val >= 1 && val < 10){
                    return 'js_2';
                }else if(val >= 10 && val < 25){
                    return 'js_3';
                }else if(val >= 25 && val < 50){
                    return 'js_4';
                }else if(val >= 50){
                    return 'js_5';
                }
            },
            'temp': function(val){
                val = parseFloat(val);
                return val > 0?'temp_1':val == 0?'temp_2':'temp_3'
            },
            'hnmidity': function(val){
                // return '#000';
                val = parseFloat(val);
                if(val >= 0 && val < 10){
                    return 'shidu_1';
                }else if(val >= 10 && val < 30){
                    return 'shidu_2';
                }else if(val >= 30 && val < 50){
                    return 'shidu_3';
                }else if(val >= 50){
                    return 'shidu_4';
                }
            }
        };
        var UNIT = {
            temp: '℃',
            maxtemp: '℃',
            mintemp: '℃',
            hnmidity: '%',
            pressure: 'Pa',
            windspeed: 'm/s',
            precipitationb1h: 'mm',
            visibility: 'm'
        }
        function getShowTextFromData(data){
            var d = data[showDataKey];
            if(!isNaN(d)){
                d = parseFloat(d);
            }
            if(showDataKey == 'winddirection'){
                d = parseWind(data,showDataKey);
            }
            return d + (UNIT[showDataKey] || '');
        }
        function parseWind(data,type){
            var txt = '';
            var direc = data.winddirection;
                if(direc == 0 || direc == 360){
                    txt = '↓'
                }else if(direc == 90){
                    txt = '←';
                }else if(direc == 180){
                    txt = '↑';
                }else if(direc == 270){
                    txt = '→';
                }else if(direc > 0 && direc < 90){
                    txt = '↙';
                }else if(direc > 90 && direc < 180){
                    txt = '↖';
                }else if(direc > 180 && direc < 270){
                    txt = '↗';
                }else{//270 - 360
                    txt = '↘';
                }
            return '&nbsp;'+txt + '&nbsp;';
        }
        function WeatherOverlay(data){//point,icon,text
            this._point = new BMap.Point(data.lon, data.lat);
            if(data.precipitationb1h == 0){
                data.precipitationb1h = 999999;
            }
            // this._icon = icon;
            // this._text = text;
            this.data = data;
        }
        function isLegal(val){
            return !/999\d{3}/.test(val);
        }
        WeatherOverlay.prototype = new BMap.Overlay();
        WeatherOverlay.prototype.initialize = function(map){
            this._map = map;
            var data = this.data;
            var info = '';
            if(isCanSeeAllData){
                info += '<ul>';
                if(data.weather){
                    info += '<li>'+data.weather+'</li>';
                }
                if(data.isStation){
                    info += '<li>站号:'+data.stationid+'</li>';
                }
                if(isLegal(data.stationheight)){
                    info += '<li>经度:'+data.lon+'</li>';
                }
                if(isLegal(data.stationheight)){
                    info += '<li>纬度:'+data.lat+'</li>';
                }
                if(isLegal(data.stationheight)){
                    info += '<li>海拔:'+data.stationheight+'米</li>';
                }
                if(isLegal(data.temp)){
                    info += '<li>温度:'+data.temp+'℃</li>';
                }
                if(isLegal(data.ptime)){
                    info += '<li>发布时间:'+data.ptime+'</li>';
                }
                if(isLegal(data.pressure)){
                    info += '<li>本站气压:'+data.pressure+'帕</li>';
                }
                if(isLegal(data.winddirection)){
                    info += '<li>风向:'+data.winddirection+'</li>';
                }
                if(isLegal(data.windspeed)){
                    info += '<li>风速:'+data.windspeed+'米/秒</li>';
                }
                if(isLegal(data.hnmidity)){
                    info += '<li>相对湿度:'+data.hnmidity+'%</li>';
                }
                if(isLegal(data.precipitationb1h)){
                    info += '<li>观测前1小时降水量:'+data.precipitationb1h+'mm</li>';
                }
                if(isLegal(data.maxtemp)){
                    info += '<li>24小时最高气温:'+data.maxtemp+'℃</li>';
                }
                if(isLegal(data.mintemp)){
                    info += '<li>24小时最低气温:'+data.mintemp+'℃</li>';
                }
                info += '</ul>';
            }
            var $span = $('<span></span>');
            if(data.isStation){
                $span.append('<a></a>');
            } 
            $span.append('<i></i>').append('<b></b>');
            var $_div = $('<div></div>').append($span);
            
            var $div = $('<div></div>').addClass('weatherOverlay').append($_div.append(info));
            if(isCanSeeAllData){
                $div.on('mouseenter',function(){
                    $div.addClass('on');
                }).on('mouseleave',function(){
                    $div.removeClass('on');
                });
            }
            
            var div = $div.get(0);
            // var div = document.createElement('div');
            // div.className = 'weatherOverlay';
            // div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
            // div.innerHTML = '<img src="'+this._icon+'"/>'+this._text;
            // div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
            map.getPanes().labelPane.appendChild(div);
            this._div = div;
            this.resetData();
            return div;
        }
        WeatherOverlay.prototype.draw = function(){
            var map = this._map;
            var pixel = map.pointToOverlayPixel(this._point);
            this._div.style.left = pixel.x + "px";
            this._div.style.top  = pixel.y + "px";
        }
        WeatherOverlay.prototype.resetData = function(){
            var data = this.data;
            var colorFn = COLOR[showDataKey];
            var txt = getShowTextFromData(data);
            var $div = $(this._div).find('div');
            if(isLegal(txt)){
                var color = '';
                if(colorFn){
                    color = colorFn(txt);
                }
                $div.removeClass().addClass(color);
                var weather_code = this.data.weathercode;
                var weather_img = '';
                if(!isNaN(weather_code)){
                    $div.removeClass('no_img');
                    weather_img = '<img src="http://www.weather.com.cn/m/i/weatherpic/29x20/d'+parseInt(weather_code)+'.gif"/>';
                }else{
                    $div.addClass('no_img');
                }
                $div.find('span i').html(weather_img+txt);
                $div.find('span b').css('border-top-color',$div.css('background-color'));
                if(data.isStation && isData_2 || (!data.isStation && isData_1)){
                    $div.show();
                }else{
                    $div.hide();
                }
            }else{
                $div.hide();
            }
        }
        WeatherOverlay.prototype.remove = function(){
            $(this._div).remove();
        }
        global.WeatherOverlay = WeatherOverlay;
    })(this);

    //跨度，单位公里,等级[3,18]
    var span = [2000,2000,2000,1000,500,200,100,50,25,20,10,5,2,1,0.5,0.2,0.1,0.05];
    // 百度地图API功能
    var map = new BMap.Map("allmap");
    var currentZoom = 6;
    map.setMinZoom(6);
    map.setMaxZoom(14);
    map.enableScrollWheelZoom();    //启用滚轮放大缩小，默认禁用
    map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
    map.centerAndZoom(new BMap.Point(104.408836,34.899005), currentZoom);
    map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
    map.addControl(new BMap.ScaleControl());                    // 添加默认比例尺控件
    // map.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP]}));     //2D图，卫星图
    map.addControl(new BMap.MapTypeControl({type:BMAP_MAPTYPE_CONTROL_DROPDOWN,anchor: BMAP_ANCHOR_TOP_RIGHT}));    //左上角，默认地图控件

    map.addEventListener("dragend", dragendOrZoomend);
    map.addEventListener("zoomend", dragendOrZoomend);
    function dragendOrZoomend(){
        var zoom = map.getZoom();
        if(zoom < currentZoom){
            map && map.clearOverlays();
        }
        
        currentZoom = zoom;
        var bs = map.getBounds();   //获取可视区域
        var bssw = bs.getSouthWest();   //可视区域左下角
        var bsne = bs.getNorthEast();   //可视区域右上角
                   // http://10.16.45.145:9526/weather/gridData?slon=115.148258&slat=40.315695&elon=117.581301&elat=39.581143&maplevel=10
        var url = 'http://61.4.184.31/weather/gridData?slon='+bssw.lng + "&slat=" + bsne.lat+'&elon='+bsne.lng + "&elat=" + bssw.lat+'&maplevel='+map.getZoom();
        // url = 'http://10.16.45.145:9526/weather/gridData?slon='+bssw.lng + "&slat=" + bsne.lat+'&elon='+bsne.lng + "&elat=" + bssw.lat+'&maplevel='+map.getZoom();
        loadData(url,initData);
    }
    (function(global){
        var dataCache = {};
        var tt;
        var jqueryAjax;
        var _callback;
        function loadData(url,callback){
            var data = dataCache[url];
             _callback = callback
            if(data){
                _callback && _callback(data);
            }else{
                clearTimeout(tt);
                tt = setTimeout(function(){
                    if(!$loading.is(':visible')){
                        $loading.show();
                    }
                    if(jqueryAjax){
                        jqueryAjax.abort();
                    }
                    jqueryAjax = $.getJSON(url, function(d){
                        dataCache[url] = d;
                        $loading.fadeOut();
                        _callback && _callback(d);
                    }).error(function(a,b,c){
                        if(b != 'abort'){
                            alert('加载数据出现错误，即将刷新页面！');
                            location.reload();
                        }
                    });
                },50);
            }
        }

        global.loadData = loadData;
    })(this);
    function resetOverlay(){
        $.each(map.getOverlays(),function(i,v){
            v.resetData();
        });
    }
    function initData(data){
        map && map.clearOverlays();
        var numArr = {};
        $.each(data,function(i,v){
            var name = (''+v.ptime).substr(0,10);
            if(!numArr[name]){
                numArr[name] = 0;
            }
            numArr[name] ++;
            map.addOverlay(new WeatherOverlay(v));
        });
        var maxNum = Number.MIN_VALUE;
        var lastTime;
        for(var i in numArr){
            var v = numArr[i];
            if(v > maxNum){
                maxNum = v;
                lastTime = i;
            }
        }
        if(lastTime){
            var m = /(\d{4})(\d{2})(\d{2})(\d{2})/.exec(lastTime);
            if(m){
                $('#data_time').text(m[1]+'年'+m[2]+'月'+m[3]+'日'+m[4]+'时').show();
            }else{
                $('#data_time').hide();
            }
        }else{
            $('#data_time').hide();
        }
    }

    // 第一次初始化自定义覆盖
    dragendOrZoomend();
}
();