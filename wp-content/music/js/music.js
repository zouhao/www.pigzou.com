$(function(){
	changeMusic();
	/*初始化数据*/
	var player=new jPlayerPlaylist({
		jPlayer: "#jplayer",
		cssSelectorAncestor: "#jp_container_1"
	},m,{
		swfPath: "swf",
		supplied: "oga, mp3",
		wmode: "window",
		smoothPlayBar: true,
		keyEnabled: false,
		loop:true
	});
	function changeMusic(){
		$("#answer").val("");
		if(m[currentIndex]){
			$("#author_music").html(m[currentIndex].text);
			$(".question-type").html(m[currentIndex].question+"("+m[currentIndex].title.length+"个字)");
		}
	}
	function success(content){
		++currentIndex;
		if(currentIndex>=m.length){
			showArtDialog("您已经通过了!没有音乐库了,请反馈给管理员让管理员添加音乐库",3);
			submit=true;
			return false;
		}
		$("#play-level").html(parseInt($("#play-level").html())+1);
		changeMusic();
		player.next();
		$("#jplayer").jPlayer("stop");
		showArtDialog(content);
		/**五角星更换*/
		$("#score").html("*"+score);
	}
	function showArtDialog(content){
		var timer;
		art.dialog({
			content: content,
			icon:"face-smile",
			lock:true,
			init: function () {
				var that = this, i = 3;
				var fn = function () {
					that.title(i + '秒后关闭');
					!i && that.close();
					i --;
				};
				timer = setInterval(fn, 1000);
				fn();
			},
			close: function () {
				clearInterval(timer);
			}
		}).show();
	}
	function error(){
		//摇摇脑袋
		$(".question-answer li").addClass("error animated shake");
		setTimeout('$(".question-answer li").removeClass("error animated shake");',1000);
	}
	$(".submit-question").click(function(){
		if(submit){
			submit=false;
			//如果答题成功的话
			if($("#answer").val()==m[currentIndex].title){
				$.post("music.php?act=success",{music_id:m[currentIndex].id},function(e){
					if(e=='1'){
						score++;
						success("好厉害!答对了,下一关开始");
					}else{
						showArtDialog('异常情况,请报告给管理员!');
					}
					submit=true;
				});
			}else{
				error();
				submit=true;
			}
		}else{
			showArtDialog('不用重复提交,正在请求后台处理!');
		}
	});
	$(".skip").click(function(){
		if(submit){
			submit=false;
			if(score<5){
				showArtDialog("你的五角星不足5个,不能跳过这关");
				return false;
			}
			score-=5;
			$.post("music.php?act=skip",{music_id:m[currentIndex].id},function(e){
				if(e=='1'){
					success("跳过此关,下一关开始");
				}else{
					showArtDialog('异常情况,请报告给管理员!');
				}
				submit=true;
			});
		}else{
			showArtDialog('不用重复提交,正在请求后台处理!');
		}
	})
	$(".clear-record").click(function(){
		art.dialog({
			id:"clear-record",
			title:"确定清除",
			content:"你确定要清除答题记录,重新开始吗?",
			icon:"question",
			cancel:true,
			ok:function(){
				$.post("music.php?act=clear-record",function(e){
					if(e=='1'){
						location.reload();
					}else{
						showArtDialog('异常情况,请报告给管理员!');
					}
					submit=true;
				});
			}
		});
	});
});