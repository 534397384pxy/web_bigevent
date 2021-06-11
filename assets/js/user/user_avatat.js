$(function() {
	var layer = layui.layer
	// 1.1 获取裁剪区域的 DOM 元素
	var $image = $('#image')
	// 1.2 配置选项
	const options = {
		// 纵横比
		//指定裁剪框的形状，1代表正方形
		aspectRatio: 1,
		// 指定预览区域
		preview: '.img-preview'
	}

	// 1.3 创建裁剪区域
	$image.cropper(options)

	//为上传按钮绑定事件
	$('#btnChooseImage').on('click', function() {
		$('#file').click()
	})

	//为文件选择框绑定change事件
	$('#file').on('change', function(e) {
		var filelist = e.target.files
		if (filelist.length === 0) {
			return layer.msg('请选择照片!')
		}
		//1.拿到用户选择的文件
		var file = filelist[0]
		//2.将文件转换为路径
		var newImageURL = URL.createObjectURL(file)
		
		//3.重新初始化裁剪区域
		//.cropper('destroy')方法：摧毁旧的裁剪区域
		//.attr('url', newImageURL)重新设置路径
		//.cropper(options)重新初始化裁剪区域
		$image.cropper('destroy').attr('src', newImageURL).cropper(options)
	})
	
	//为确定按钮绑定点击事件
	$('#btnUpload').on('click', function() {
		//1.拿到用户裁剪之后的头像
		 var dataURL = $image.cropper('getCroppedCanvas',{
			 //创建一个Canvas 画布
			 width:100,
			 height:100
		 }).toDataURL('image/png')//将Canvas 画布上的内容，转化为 base64 格式的字符串.base64 格式的字符串的形式展示的图片的优点：url路径的形式要发送请求，而base64 格式不用发送请求就能渲染出图片。缺点：体积比较大，一般比源文件大30%左右。所以一般用于小图片
		 
		//2.调用接口，把头像上传到服务器
		 $.ajax({
			 method: 'POST',
			 url:"/my/update/avatar",
			 data:{
				 avatar:dataURL
			 },
			 success: function(res) {
				 if(res.status !== 0) {
					 return layer.msg('更换头像失败！')
				 }
				 layer.msg('更换头像成功！')
				 window.parent.getUserInfo()
			 }
		 })
	})
})
