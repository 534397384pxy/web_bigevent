$(function() {
	var form = layui.form
	var layer = layui.layer
	//初始化富文本编辑器
	layui.use('layedit', function() {
		var layedit = layui.layedit;
		layedit.build('content'); //建立编辑器
	})
	
	//1.初始化图片裁剪器
	var $image = $('#image')
	//2.裁剪选项
	var options = {
		aspectRatio: 400 / 200,
		preview: '.img-preview'
	}
	//3.初始化裁剪区域
	$image.cropper(options)
	
	//为选择封面按钮模拟文件框打开
	$('#btnChooseImage').on('click', function() {
		$('#coverFile').click()
	})
	
	//监听 coverFile 的change事件,获取用户选择的文件列表
	$('#coverFile').on('change', function(e) {
		//获取选择的文件列表
		var files = e.target.files
		if(files.length === 0) {
			return layer.msg('请选择图片')
		}
		//根据文件创建对应的URL地址
		var newImgURL = URL.createObjectURL(files[0])
		//为裁剪区重新设置图片
		$image.cropper('destroy').attr('src', newImgURL).cropper(options)
	})
	
	initEdit()
	//初始化修改文章的内容
	function initEdit() {
		var id = window.localStorage.getItem('Id')
		console.log(id)
		$.ajax({
			method: 'GET',
			url: '/my/article/' + id,
			success: function(res) {
				console.log(res.data)
				form.val('form-edit', res.data)
			}
		})	
	}
	
	//定义发布的状态
	var art_state = '已发布'
	//为存为草稿按钮绑定点击事件处理函数
	$('#btnSave2').on('click', function() {
		art_state = '草稿'
	})
	
	//为表单绑定 submit 提交事件
	$('#form-edit').on('submit', function(e) {
		e.preventDefault()
		//基于form表单快速创建一个formDate对象
		var fd = new FormData($(this)[0])
		
		//将文章的发布状态，存到fd中
		fd.append('state', art_state)
		
		//将封面裁剪过后的图片输出为一个文件对象
		$image.cropper('getCroppedCanvas', {
				//创建一个画布对象
				width: 400,
				height: 280
			})
			.toBlob(function(blob) {
				//将Canvas画布上的内容，转化为文件对象
				//得到文件对象后，进行后续的操作
				//将文件对象存储到fd中
				fd.append('cover_img', blob)
				//发起ajax 数据请求
				publishArticle(fd)
			})
	
	})
	//定义一个发布文章的方法
	function publishArticle(fd) {
		$.ajax({
			method: 'POST',
			url: '/my/article/edit',
			data: fd,
			//注意：如果向服务器提交的是FormDate格式的数据
			//必须添加以下两个配置项
			contentType: false,
			processData: false,
			success: function(res) {
				if (res.status !== 0) {
					return layer.msg('发布文章失败')
				}
				layer.msg('发布文章成功')
				//发布文章成功后跳转到文章列表页面
				location.href = './art_list.html'
			}
		})
	}
})