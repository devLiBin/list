var person = [{
		name: '刘小华',
		src: './img/1.jpg',
		sex: 'male',
		des: '漂亮的女孩子'
	},
	{
		name: '王花',
		src: './img/2.jpg',
		sex: 'male',
		des: '漂亮的程序猿'
	},
	{
		name: '陈军',
		src: './img/3.jpg',
		sex: 'female',
		des: '我是一个学霸'
	},
	{
		name: '王华',
		src: './img/4.jpg',
		sex: 'female',
		des: '我喜欢游泳'
	},
	{
		name: '陈思思',
		src: './img/5.jpg',
		sex: 'male',
		des: '我喜欢看电影'
	},
	{
		name: '陈学习',
		src: './img/6.jpg',
		sex: 'female',
		des: '我爸我妈爱学习'
	},
	{
		name: '王美丽',
		src: './img/7.jpg',
		sex: 'male',
		des: '我妈是美丽得妈妈'
	}
]

var listUl = document.getElementById('list');
var oInp = document.getElementById('inp');
var sUl = document.getElementById('seach');

function debounce(handler, delay) {
	var timer = null
	return function () {
		var self = this
		arg = arguments
		clearTimeout(timer)
		timer = setTimeout(function () {
			handler.apply(self, arg)
		}, delay)
	}
}

//1. 默认情况下(不考虑筛选的情况)，应该把所有的数据动态的插入到DOM结构中
//通过render方法往DOM结构里插li
function render(list) {
	var str = ''; /*字符串拼接的方法，把结构放到字符串中*/
	list.forEach(function (ele, index) {
		str += '<li>\
					<img src="' + ele.src + '" alt="">\
					<span class="name">' + ele.name + '</span>\
					<span class="des">' + ele.des + '</span>\
					</li>'
	})
	listUl.innerHTML = str;
}
// 把person数据渲染到页面中
render(person);

// 2.然后根据输入的关键字(input的值)进行筛选，就得获取input的值

// 给oInp绑定一个oninput事件，监听input里面输入的值
function deal() {
	// 这里打印的是记录input输入的值(不需要写出来，方便理解用的)
	console.log(this.value);
	// 使用一个text变量来获得input输入的值(需要筛选的值)
	state.text = this.value;
	// 情况一 ：render(filterText(text,person))---只单独根据input里面的text值进行筛选时的写法
	// filterText(text,person)---这里表示根据text的内容进行筛选，筛选的数组为实际数组person
	// 这里一定要记得把调用filterText筛选的值传到render里面进行渲染 

	// 情况二写法：情况二是在文档最下处写完根据多重条件筛选后时的写法（最完美情况）
	render(addFn(objFilter, person))
}

oInp.oninput = debounce(deal, 1000)


function filterText(text, arr) {
	return arr.filter(function (ele, index) {
		// 根据name值来进行筛选
		if (ele.name.indexOf(text) !== -1) {
			return true;
		}
	})
}

// 3.根据点击按钮进行筛选

// 给ul绑定点击事件，通过事件冒泡获取事件源对象找到li
sUl.addEventListener('click', function (e) {
	// e.target.tagName表示点击后获取的事件源对象
	if (e.target.tagName == 'LI') {
		// 需要给li里面创建自定义数据（属性），与原数据person里面的all,male,female保持一致，详细见html文档中的注释
		// 找到当前触发的源事件，通过getAttribute获取到自定义设置的sex属性，这个属性值就是专门做标记
		state.sex = e.target.getAttribute('sex')
		// 这里还有一个class名的切换，点击哪个就切换样式
		// 找到class名为active的元素，给他置空
		document.getElementsByClassName('active')[0].className = '';
		// 点到谁就给谁添加一个active的class类名，其他的就得移除一下，通过上面进行属性置空
		e.target.className = 'active'
		// console.log(filterSex(sex,person))
		// 情况一 ：render(filterSex(sex,person))---只单独根据sex值进行筛选时的写法
		// 情况二：原理和上面input筛选一样
		render(addFn(objFilter, person))
	}

})

function filterSex(sex, arr) {
	if (sex == 'all') { /*在这儿需要判断一下，当点击All的时候不需要筛选，直接显示全部就行*/
		return arr;
	} else {
		return arr.filter(function (ele, index) {
			// 当取到的sex与原数组里面得sex值相符的话就返回这个数组
			if (sex == ele.sex) {
				return true;
			}
		})
	}
}

// 4.多重条件筛选
// 原理：当输入name值"王"的时候会显示三个人，然后同时再在这三个人中根据性别进行筛选


// state表示改变后(筛选后的)的条件
// 里面存着两个筛选的默认条件
var state = {
	text: '',
	sex: 'all'
}
// 将筛选的条件存在objFilter里面
// 里面存着的是筛选条件要执行的函数
var objFilter = {
	// 这里表示如果要根据text筛选，就要执行filterText
	text: filterText,
	// 和text同理
	sex: filterSex
}

// 多重条件筛选方法
function addFn(obj, arr) {
	// 下面obj里面每次一改变，就应该拿一个改变后的数组（lastArr）来接收他
	// 例如：如果你当前用性别改变的话，改变之后的数组就放到lastArr里面
	// 这里第一次lastArr的值应该为arr
	var lastArr = arr;
	// 通过for in 来遍历一下obj
	for (var prop in obj) {
		// obj[prop]:obj里面的text或者sex通过调用他们各自的方法后会发生改变，obj[prop]就可以获取到
		//           改变的函数
		// state[prop]：表示对应obj里面改变的值
		lastArr = obj[prop](state[prop], lastArr)
		// console.log(lastArr)
	}
	return lastArr
}

// addFn(objFilter,person)