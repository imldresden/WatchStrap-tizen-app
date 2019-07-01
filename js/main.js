const identifier = "WATCH";

window.onload = () => {
	tizen.power.request("SCREEN", "SCREEN_NORMAL");
	document.body.style.backgroundColor = "gray";
	const socket = io('http://141.76.67.139:31415');

	socket.on('connect', () => {
		socket.emit('handshake', identifier);
	});

	socket.on('handshake', () => { document.body.style.backgroundColor = "green"; });
	socket.on('connect_error', () => { document.body.style.backgroundColor = "red"; });
	socket.on('connect_timeout', () => { document.body.style.backgroundColor = "red"; });

	socket.on('err', data => {
	    console.log("error", data);
	});

	socket.on('msg', msg => {
	    if (msg.type === "imageData") {
	    	var canavs = document.getElementById('canvas');
	    	var ctx = canvas.getContext('2d');
	    	var img = new Image;
	    	img.onload = () => {
	    		ctx.drawImage(img, 0, 0);
	    	}
	    	img.src = msg.payload;
	    }
	});
}