
//获取本地存储
export const getStorage=(name)=>{
	let val=window.sessionStorage.getItem(name);
	return val
};

//写入本地存储
export const setStorage=(name,val)=>{
	if(typeof(val)=='string'){
		window.sessionStorage.setItem(name,val);
	}else{
		window.sessionStorage.setItem(name,JSON.stringify(val));
	}
}

//清空本地存储
export const delStorage=(name)=>{
	window.sessionStorage.removeItem(name)
}