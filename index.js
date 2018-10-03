var oInp = document.getElementById('inp');



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

function event() {
	console.log(this.value)
}

oInp.oninput = debounce(event, 1000)