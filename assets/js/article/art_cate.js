$(function() {
	var layer = layui.layer
	var form = layui.form
	initArtCateList()
	//获取文章分类列表
	function initArtCateList() {
		$.ajax({
			method: 'GET',
			url: '/my/article/cates',
			success: function(res) {
				var htmlstr = template('tpl-table', res)
				$('tbody').html(htmlstr)
			}
		})
	}

	var indexAdd = null
	//为添加类别按钮绑定点击事件
	$('#btnAddCate').on('click', function() {
		indexAdd = layer.open({
			type: 1,
			area: ['500px', '250px'],
			title: '添加文章分类',
			content: $('#dialog-add').html()
		})
	})

	//通过代理的形式为form-add表单绑定submit事件
	//因为form-add表单是动态添加的，所以不能直接绑定提交事件
	$('body').on('submit', '#form-add', function(e) {
		e.preventDefault()
		$.ajax({
			method: 'POST',
			url: '/my/article/addcates',
			data: $(this).serialize(),
			success: function(res) {
				if (res.status !== 0) {
					return layer.msg('新增分类失败！')
				}
				initArtCateList()
				layer.msg('新增分类成功！')
				//根据索引关闭对应弹出层
				layer.close(indexAdd)
			}
		})
	})

	//通过代理的形式为btn-edit表单绑定点击事件
	var indexEdit = null
	$('tbody').on('click', '.btn-edit', function() {
		//弹出一个修改文章分类信息的层
		indexEdit = layer.open({
			type: 1,
			area: ['500px', '250px'],
			title: '修改文章分类',
			content: $('#dialog-edit').html()
		})

		var id = $(this).attr('data-id')

		//发起请求获取分类数据
		$.ajax({
			type: 'GET',
			url: '/my/article/cates/' + id,
			success: function(res) {
				form.val('form-edit', res.data)
			}
		})
	})

	//通过代理的形式为form-edit表单绑定submit事件
	$('body').on('submit', '#form-edit', function(e) {
		e.preventDefault()
		$.ajax({
			method: 'POST',
			url: '/my/article/updatecate',
			data: $(this).serialize(),
			success: function(res) {
				if (res.status !== 0) {
					return layer.msg('更新分类数据失败')
				}
				layer.msg('更新分类数据成功！')
				layer.close(indexEdit)
				initArtCateList()
			}
		})
	})

	//通过代理的形式为删除按钮绑定点击事件
	$('tbody').on('click', '.btn-delete', function() {
		var id = $(this).attr('data-id')
		//提示用户是否要删除
		layer.confirm('确认删除', {
			icon: 3,
			title: '提示'
		}, function(index) {
			$.ajax({
				method: 'GET',
				url: '/my/article/deletecate/' + id,
				success: function(res) {
					if (res.status !== 0) {
						return layer.msg('删除分类失败')
					}
					layer.msg('删除分类成功！')
					layer.close(index)
					initArtCateList()
				}
			})


		})
	})
})
