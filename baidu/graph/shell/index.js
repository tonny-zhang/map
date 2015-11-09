var fs = require('fs'),
	path = require('path'),
	crypto = require('crypto');

/*加密字符串*/
var encrypt = function (str, private_key){
    if(str && str.toString){
        return crypto.createHash('sha1').update(str.toString()+(private_key||'util')).digest('hex');
    }
    return '';
}
function rmfileSync(p, is_not_rmmyself_if_directory) {
    //如果文件路径不存在或文件路径不是文件夹则直接返回
    try{
    	if(fs.existsSync(p)){
	    	var stat = fs.statSync(p);
	    	if(stat.isDirectory()){
	    		var files = fs.readdirSync(p);
	    		files.forEach(function(file) {
		            var fullName = path.join(p, file);
		            if (fs.statSync(fullName).isDirectory()) {
		                rmfileSync(fullName);
		            } else {
		                fs.unlinkSync(fullName);
		            }
		        });
			    !is_not_rmmyself_if_directory && fs.rmdirSync(p);
	    	}else{
	    		fs.unlinkSync(p);
	    	}
	    }
    	return true;
    }catch(e){}
}
// 同步新建目录
function mkdirSync(mkPath){
	try{
		var parentPath = path.dirname(mkPath);
		if(!fs.existsSync(parentPath)){
			mkdirSync(parentPath);
		}
		if(!fs.existsSync(mkPath)){
			fs.mkdirSync(mkPath);
		}
		return true;
	}catch(e){}
}
// 同步拷贝文件
function copySync(fromPath,toPath){
	try{
		if(fs.existsSync(toPath)){
			fs.unlinkSync(toPath);
		}else{
			mkdirSync(path.dirname(toPath));
		}
		var BUF_LENGTH = 64*1024
		var buff = new Buffer(BUF_LENGTH)
		var fdr = fs.openSync(fromPath, 'r');
		var fdw = fs.openSync(toPath, 'w');
		var bytesRead = 1;
		var pos = 0;
		while (bytesRead > 0){
			bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
			fs.writeSync(fdw,buff,0,bytesRead);
			pos += bytesRead;
		}
		
		fs.closeSync(fdr);
		fs.closeSync(fdw);
		return true;
	}catch(e){}
}

var dir_current = __dirname;
var dir_project = path.join(dir_current, '../');
var dir_data_source = path.join(dir_project, 'data-source');
var dir_data = path.join(dir_project, 'data');

rmfileSync(dir_data, true);
mkdirSync(dir_data);

var time = new Date().getTime();
fs.readdir(dir_data_source, function(err, files){
	if(err){
		console.log(err);
	}else{
		var list_data = [];
		files.forEach(function(file){
			var file_path = path.join(dir_data_source, file);
			var file_name_new = encrypt(file_path+time)+'.json';
			var save_file_path = path.join(dir_data, file_name_new);
			copySync(file_path, save_file_path);
			list_data.push({
				n: file.replace('.json', ''),
				p: file_name_new
			});
		});

		var save_path = path.join(dir_data, 'list.json');
		fs.writeFileSync(save_path, JSON.stringify(list_data));
		console.log('save listfile: ', save_path);
	}
});