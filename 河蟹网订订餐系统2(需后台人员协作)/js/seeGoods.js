// JavaScript Document

yc.addEvent('seeGoods','click',function(){
	var options={
			"completeListener":checkLogin
		}
	yc.xssRequest("http://218.196.14.220:8080/res/resuser.action?op=checkLogin",options);
	//查看登录
	function checkLogin(){
		if(this.responseJSON.code==0){
			var iWidth=520; //弹出窗口的宽度;
			var iHeight=630; //弹出窗口的高度;
			var iTop = (window.screen.availHeight-30-iHeight)/2; //获得窗口的垂直位置;
			var iLeft = (window.screen.availWidth-10-iWidth)/2; //获得窗口的水平位置;
			var result=window.open("loginShow.html","_blank","height="+iHeight+", width="+iWidth+", top="+iTop+", left="+iLeft);
			window.open("loginShow.html","_blank","height="+iHeight+", width="+iWidth+", top="+iTop+", left="+iLeft);
		}else if(this.responseJSON.code==1){
			var options_getCart={
				"completeListener":lookPaying
			}
			yc.xssRequest("http://218.196.14.220:8080/res/resorder.action?op=getCartInfo",options_getCart);
		}else{
			alert("系统繁忙，请稍后再试");
		}
	}
});

//查看购物车
//{"code":1,"obj":{"1":{"food":{"fid":1,"fname":"素炒莴笋丝","normprice":22.0,"realprice":20.0,"detail":"营养丰富","fphoto":"500008.jpg"},"num":1,"smallCount":20.0}}}
function lookPaying(){
	if(this.responseJSON.code==1){
		yc.$("conRight").innerHTML="";
		yc.$("myform").style.display='none';

		var paydiv=document.createElement("div");
		paydiv.setAttribute('id','paydiv');
		var table=document.createElement("table");
		table.setAttribute('id','payTable');
		table.setAttribute('border','1px');
		table.setAttribute('cellpadding',0);
		table.setAttribute('cellspcing',0);
		//thead部分
		var theadtitle=["菜名","成交价","数量","小计","操作"];
		var thead=document.createElement("thead");
		var theadtrs=document.createElement("tr");
		for(var i=0;i<theadtitle.length;i++){
			var theadtds=document.createElement("td");
			theadtds.innerHTML=theadtitle[i];
			theadtrs.appendChild(theadtds);
		}
		thead.appendChild(theadtrs);
		//tbody部分
		var tbody=document.createElement("tbody");
		var count=0;//计算总价格

		table.appendChild(thead);
		table.appendChild(tbody);
		paydiv.appendChild(table);
		yc.$("conRight").appendChild(paydiv);

		
		//1:{"food":{"fid":1,"fname":"素炒莴笋丝","normprice":22.0,"realprice":20.0,"detail":"营养丰富","fphoto":"500008.jpg"},"num":1,"smallCount":20.0}
		for(var i in this.responseJSON.obj){
			if(this.responseJSON.obj.hasOwnProperty(i)){//容错
				var str=this.responseJSON.obj;
				var jsonobj=str[i];
				count+=jsonobj.smallCount;
				var tbodytrs=document.createElement("tr");
				tbodytrs.innerHTML="<td id=foodid_'"+i+"'>"+jsonobj.food.fname+"</td><td>"+jsonobj.food.realprice+"</td><td id='numobj''>"+jsonobj.num+"</td><td id='delsmallCount'>"+jsonobj.smallCount+"</td><td><a id='jian_"+i+"'>减少</a>&nbsp;&nbsp;<a id='add_"+i+"'>增加</a>&nbsp;&nbsp;<a id='delfood_"+i+"'>删除</a></td>";
				tbody.appendChild(tbodytrs);

				

				(function(index){
					yc.addEvent('add_'+index,'click',function(){
						var urls="http://218.196.14.220:8080/res/resorder.action?op=orderJson&num=1&fid="+index;
						var options={
							"completeListener":function(){
								if(this.responseJSON.code==1){
									yc.$("conRight").innerHTML="";
									var options_getCart={
										"completeListener":lookPaying
									}
									yc.xssRequest("http://218.196.14.220:8080/res/resorder.action?op=getCartInfo",options_getCart);
								}
							}
						};
						yc.xssRequest(urls,options);
					})
				})(i);

				(function(index){
					yc.addEvent('jian_'+index,'click',function(){
						var urls="http://218.196.14.220:8080/res/resorder.action?op=orderJson&num=-1&fid="+index;
						var options={
							"completeListener":function(){
								if(this.responseJSON.code==1){
									yc.$("conRight").innerHTML="";
									var options_getCart={
										"completeListener":lookPaying
									}
									yc.xssRequest("http://218.196.14.220:8080/res/resorder.action?op=getCartInfo",options_getCart);
								}
							}
						};
						yc.xssRequest(urls,options);
					})
				})(i);

				(function(index){
					//var myid=str[index].food.fid;
					yc.addEvent("delfood_"+index,'click',function(){//删除一项物品
						var options_del={
							"completeListener":function(){
								if(this.responseJSON.code==1){
									yc.$("conRight").innerHTML="";
									var options_getCart={
										"completeListener":lookPaying
									}
									yc.xssRequest("http://218.196.14.220:8080/res/resorder.action?op=getCartInfo",options_getCart);
								}
							}
						}

						yc.xssRequest("http://218.196.14.220:8080/res/resorder.action?op=delorder&fid="+index,options_del);
					});
				})(i);
			}

		}
		var total=document.createElement("p");
		total.innerHTML="<span class='totalpay'>合计："+count+"</span><a  id='payfood'>结账</a>"
		paydiv.appendChild(total);
		
		
		yc.addEvent('payfood','click',function(){
			paydiv.innerHTML="";
			yc.$("conRight").innerHTML="";
			document.getElementById("myform").style.display='block';
			//提交订购
			yc.addEvent('submit','click',submitok);
			
		});
		
	}else if(this.responseJSON.code == 0){
		alert("购物车是空的");
	}else{
		alert("系统繁忙，请稍后再试");
	
	}
}