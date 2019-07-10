//不能为空
function isBlank(str) {
	var re=/^\s*$/;
	return re.test(str);
}
// 判断是不是数字
function isNum(str) {
	var re=/^[0-9]*$/;
	return re.test(str);
}
// 判断3位 通用服务号码 以1开头
function isThreeNum(str){
	var re=/^[1][0-9]{2}$/;
	return re.test(str);
}
// 判断5位  常用服务号码 以1和9开头
function isFiveNum(str){
	var re=/^[1|9][0-9]{4}$/;
	return re.test(str);
}
// 判断7位  普通城市没有区号的号码
function isSevenNun(str){
	var re=/^[2-8][0-9]{6}$/;
	return re.test(str);
}
// 判断8位  一线城市没有区号的号码
function isEightNun(str){
	var re=/^[2-8][0-9]{7}$/;
	return re.test(str);
}
// 判断11位
function isElevenNum(str){
	var re=/^[0|1]\d{10}$/;
	return re.test(str);
}
// 手机号码 以1开头第二位为3456789 需要进一步判断
function isElevenNum1(str){
	var re=/^1[3456789]\d{9}$/;
	return re.test(str);
}
// 电话号码 必须有“-”
function isElevenNum2(str){
	var re=/^[0|1](\d{2}-|\s)?[2-8]\d{7}|^[0|1](\d{3}-|\s)?[2-8]\d{6}$/;
	return re.test(str);
}
// 中国移动
function isChinaMobile(str){
	var re=/^(134[0-8]|170[3|5|6])\d{7}$|^(?:13[5-9]|147|15[0|1|2|7|8|9]|172|178|18[2|3|4|7|8]|198)\d{8}$/; 
	return re.test(str);
}
// 中国联通
function isChinaUnion(str){
	var re=/^170[4|7-9]\d{7}$|^(?:13[0-2]|145|15[5|6]|166|17[1|5|6]|18[5|6])\d{8}$/;
	return re.test(str);
}
// 中国电信
function isChinaTelcom(str){
	var re=/^170[0-2]\d{7}$|^(?:133|149|153|17[3|7]|18[0|1|9]|199)\d{8}$/;
	return re.test(str);
}
// 卫星通信
function isOtherTelphone(str){
	var re=/^134([9])\d{7}$/;
	return re.test(str);
}
//号码判断
function chkPhoneNum() {
	// 不能为空
	if (!isBlank($("#phonenum").val())) {
		// 判断是否是数字
		if (isNum($("#phonenum").val())) {
			if (isThreeNum($("#phonenum").val())) {
				digtal3();
				return true;
			}
			else if (isFiveNum($("#phonenum").val())) {
				digtal5();
				return true;
			}			
			else if (isSevenNun($("#phonenum").val())|isEightNun($("#phonenum").val())) {
				$("#phonenumPrompt").text("无区号电话号码");
				return true;
			}
			else if (isElevenNum($("#phonenum").val())) {
				if (isElevenNum1($("#phonenum").val())) {
					// 网络正常时在线查询
					$.ajax({
						url: 'http://api.online-service.vip/phone?number=',
						success: function(result){
						    port();
						}, 
						error: function(result){
						    digit_11();
						    // operator();
						}
					});
				}
				else{
					digit_12_2();
				}											
			}
			else {
				$("#phonenumPrompt").text("号码格式不正确，请重新输入！");
				return true;
			}
		}
		else if (!isNum($("#phonenum").val())) {
			if (isElevenNum2($("#phonenum").val())) {
				digit_12();
				return true;
			}
			else{
				$("#phonenumPrompt").text("号码格式不正确，请重新输入！");
				return false;
			}
		}		
	}
	else {
		$("#phonenumPrompt").text("不能为空,请填写号码！");
		return false;
	}
}
// 接口调用在线查询
function port(){
	$.ajax(
	{
	    type:'get',
	    url : 'http://api.online-service.vip/phone?number='+$("#phonenum").val(),
	    dataType : 'json',
	    cache: false,
	    success : function(data) {
	    	var obj = data;
	    	if (obj.mobiletype!=null) {
	    		$("#result").text(obj.mobiletype+" "+obj.province+obj.city);
	    	}
	    	else{
	    		$("#result").text("不存在该号码！");
	    	}    
	    }
	});
}

var Datas;
// 查文件判断服务号码
function digtal3(){
	var chenknum = $("#phonenum").val();
	$.each(Datas.digit_3,function(i,item){
		if(i==chenknum){
			$("#result").text(item);
			return false;
		}
		else{
			$("#result").text("未知号码");
		}
	});

}
// 查文件判断服务号码
function digtal5(){
	var chenknum = $("#phonenum").val();
	$.each(Datas.digit_5,function(i,item){
		if(i==chenknum){
			$("#result").text(item);
			return false;
		}
		else{
			$("#result").text("未知号码");
		}
	});
}
// 查文件判断运营商
function digit_11(){
	var num = $("#phonenum").val();
	var chenknum = num.substr(0,3);
	if (chenknum==170) {
		var chenknum = num.substr(0,4);
	}
	$.each(Datas.digit_11,function(i,item){
		if(i==chenknum){
			$("#result").text(item);
			return false;
		}
		else{
			$("#result").text("不存在该号码！");
		}
	});
}
// 查文件判断归属地
function digit_12(){
	var num = $("#phonenum").val();
	var chenknum = num.split("-",1);
	$.each(Datas.digit_12,function(i,item){
		if(i==chenknum){
			$("#result").text(item);
			return false;
		}
		else{
			$("#result").text("未找到该号码 ");
		}
	});
}
// 查文件判断归属地
function digit_12_1(){
	var num = $("#phonenum").val();
	var chenknum = num.substr(0,3);
	var chenknum1 = num.substr(3,1);
	$.each(Datas.digit_12,function(i,item){
		if(i==chenknum){
			if (chenknum1 != 0 && chenknum1 != 1 && chenknum1 != 9){
				$("#result").text(item);
				return false;		
			}
			else{
				$("#result").text("未找到该号码 ");
				return false;		
			}
		}
		else{
			$("#result").text("未找到该号码 ");
		}
	});
}
// 查文件判断归属地
function digit_12_2(){
	var num = $("#phonenum").val();
	var chenknum = num.substr(0,4);
	var chenknum1 = num.substr(4,1);
	$.each(Datas.digit_12,function(i,item){
		if(i==chenknum){
			if (chenknum1 != 0 && chenknum1 != 1 && chenknum1 != 9){
				$("#result").text(item);
				return false;		
			}
			else{
				$("#result").text("未找到该号码");
				return false;		
			}	
		}
		else{
			digit_12_1();
		}
	});
}
// 正则判断运营商
function operator(){	
	if (isChinaMobile($("#phonenum").val())) {
		$("#phonenumPrompt").text("中国移动 "+$("#phonenum").val());
		return true;
	}
	else if (isChinaUnion($("#phonenum").val())) {
		$("#phonenumPrompt").text("中国联通 "+$("#phonenum").val());
		return true;
	}
	else if (isChinaTelcom($("#phonenum").val())) {
		$("#phonenumPrompt").text("中国电信 "+$("#phonenum").val());
		return true;
	}
	else if (isOtherTelphone($("#phonenum").val())) {
		$("#phonenumPrompt").text("卫星通信 "+$("#phonenum").val());
		return true;
	}
	else{
		$("#phonenumPrompt").text("不存在该号码！");
		return true;	
	}
}

var oBtn = document.getElementById('phonenum');
var oTi = document.getElementById('phonenumPrompt');
var oTi2 = document.getElementById('result');

if('oninput' in oBtn){ 
    oBtn.addEventListener("input",getWord,false); 
}else{ 
    oBtn.onpropertychange = getWord; 
}

// 实时输出
function getWord(){
    oTi.innerHTML = oBtn.value;
    oTi2.innerHTML = " ";
}
 