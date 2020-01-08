const idMain = "MAIN";
const idWatch = "WATCH";
const idStrap = "STRAP";
const idUpperStrap = "UPPER_STRAP";
const idLowerStrap = "LOWER_STRAP";

window.onload = () => {
	tizen.power.request("SCREEN", "SCREEN_NORMAL");
	document.body.style.backgroundColor = "gray";
	
	const canvas = document.getElementById('canvas');
	const socket = io(server);
	

	socket.on('connect', () => {
		socket.emit('handshake', idWatch);
	});

	socket.on('handshake', () => { document.body.style.backgroundColor = "green"; });
	socket.on('connect_error', () => { document.body.style.backgroundColor = "red"; });
	socket.on('connect_timeout', () => { document.body.style.backgroundColor = "red"; });

	socket.on('err', data => {
	    console.log("error", data);
	});

	socket.on('msg', msg => {
		switch (msg.type) {
			case "imageData":
				var ctx = canvas.getContext('2d');
				var img = new Image;
				img.onload = () => {
					ctx.drawImage(img, 0, 0, 360, 360);
				}
				img.src = msg.payload;
				break;
			case "exit":
				try { tizen.application.getCurrentApplication().exit(); }
				catch (ignore) { }
				break;
	    }
	});
	
	function sendEvent(type, event) {
		socket.emit('msg', {
			target: idMain,
			sender: idWatch,
			type: type,
			payload: event
		});
	}
	
	function formatTouchEvent(event) {
		console.log(event.touches.length, event);
		let pos = {};
		if (event.type === "touchend") {
			pos.x = event.changedTouches[0].clientX;
			pos.y = event.changedTouches[0].clientY;
		} else {
			pos.x = event.touches[0].clientX;
			pos.y = event.touches[0].clientY;
		}
		var e = {
			pos: pos,
			timeStamp: event.timeStamp,
			type: event.type
		};
		sendEvent('touch', e);
	}
	
	function formatBezelEvent(event) {
		var e = {
			touches: event.touches,
			timeStamp: event.timeStamp,
			direction: event.detail.direction,
			type: "bezelrotate"
		};
		sendEvent('bezelrotate', e);
	}
	
	// Listener for hardware buttons
	document.addEventListener('tizenhwkey', (event) => {
		if (event.keyName === "back") {
			try {
				// tizenhwkey back event can also be triggered by a swipe down.
				var e = {
					key: event.keyName,
					type: 'hwkey'
				}
				sendEvent('hwkey', e);
			} catch (ignore) { }
		}
		
		if (e.keyName === "menu") {
			try { tizen.application.getCurrentApplication().exit(); }
			catch (ignore) { }
		}
	});
	
	// Listener for rotatable bezel
	document.addEventListener('rotarydetent', (e) => { formatBezelEvent(e); });
	
	// Listener for touch events
	canvas.addEventListener('touchstart', (e) => { formatTouchEvent(e); });
	canvas.addEventListener('touchmove', (e) => { formatTouchEvent(e); });
	canvas.addEventListener('touchend', (e) => { formatTouchEvent(e); });
	
}