/* True Wind Calculator Logic */
(function () {
	const el = {
		vHeading: document.getElementById("v-heading"),
		vSpeed: document.getElementById("v-speed"),
		vSpeedSlider: document.getElementById("v-speed-slider"),
		rwAngle: document.getElementById("rw-angle"),
		rwSpeed: document.getElementById("rw-speed"),
		rwSpeedSlider: document.getElementById("rw-speed-slider"),
		sidePort: document.getElementById("side-port"),
		sideStarboard: document.getElementById("side-starboard"),
		vesselArrow: document.getElementById("vesselArrow"),
		relativeArrow: document.getElementById("relativeArrow"),
		trueArrow: document.getElementById("trueArrow"),
		twDir: document.getElementById("tw-dir"),
		twSpeed: document.getElementById("tw-speed"),
		twBft: document.getElementById("tw-bft"),
		twDesc: document.getElementById("tw-desc"),
	};

	let side = "port";

	// helpers
	const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
	const degToRad = (d) => (d * Math.PI) / 180;
	const radToDeg = (r) => (r * 180) / Math.PI;
	const norm360 = (d) => ((d % 360) + 360) % 360;

	// No custom arcs for consistency with app styling

	function setSide(next) {
		side = next;
		if (next === "port") {
			el.sidePort.classList.add("segmented__btn--active");
			el.sideStarboard.classList.remove("segmented__btn--active");
		} else {
			el.sideStarboard.classList.add("segmented__btn--active");
			el.sidePort.classList.remove("segmented__btn--active");
		}
		update();
	}

	function beaufort(speedKn) {
		// Knots (approximate ranges)
		if (speedKn < 1) return [0, "Calm"];
		if (speedKn < 3) return [1, "Light air"];
		if (speedKn < 6) return [2, "Light breeze"];
		if (speedKn < 10) return [3, "Gentle breeze"];
		if (speedKn < 16) return [4, "Moderate breeze"];
		if (speedKn < 21) return [5, "Fresh breeze"];
		if (speedKn < 27) return [6, "Strong breeze"];
		if (speedKn < 33) return [7, "Near gale"];
		if (speedKn < 40) return [8, "Gale"];
		if (speedKn < 48) return [9, "Strong gale"];
		if (speedKn < 56) return [10, "Storm"];
		if (speedKn < 65) return [11, "Violent storm"];
		return [12, "Hurricane"];
	}

	// Compute true wind from vessel velocity and apparent/relative wind
	function compute() {
		const heading = norm360(parseFloat(el.vHeading.value) || 0); // degrees true (towards)
		const vSpeed = clamp(parseFloat(el.vSpeed.value) || 0, 0, 100); // kn
		const rwAng = clamp(parseFloat(el.rwAngle.value) || 0, 0, 180); // degrees off bow
		const rwSpeed = clamp(parseFloat(el.rwSpeed.value) || 0, 0, 100);

		// Vessel velocity vector (to direction = heading)
		const vhx = vSpeed * Math.sin(degToRad(heading));
		const vhy = vSpeed * Math.cos(degToRad(heading));

		// Relative wind 'from' bearing = heading +/- angle depending on side
		const signed = side === "port" ? -rwAng : rwAng; // port is to the left (counter-clockwise)
		const rwFromBearing = norm360(heading + signed);

		// Apparent wind velocity vector points TO the opposite of 'from'
		const rwToBearing = norm360(rwFromBearing + 180);
		const awx = rwSpeed * Math.sin(degToRad(rwToBearing));
		const awy = rwSpeed * Math.cos(degToRad(rwToBearing));

		// True wind velocity vector: Vt = Va + Vv
		const twx = awx + vhx;
		const twy = awy + vhy;

		const twSpeed = Math.sqrt(twx * twx + twy * twy);
		const twToBearing = norm360(radToDeg(Math.atan2(twx, twy))); // angle TO where wind flows
		const twFromBearing = norm360(twToBearing + 180);

		return {
			heading,
			vSpeed,
			rwAng,
			rwSpeed,
			rwFromBearing,
			twSpeed,
			twFromBearing,
		};
	}

	function formatDir(d) {
		const deg = d.toFixed(1) + "°";
		const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
		const idx = Math.round(norm360(d) / 45) % 8;
		return deg + " (" + dirs[idx] + ")";
	}

	function update() {
		const r = compute();

		// sync sliders with number inputs
		el.vSpeedSlider.value = r.vSpeed;
		el.rwSpeedSlider.value = r.rwSpeed;

		// rotate dials (CSS transforms for smooth animation)
		el.vesselArrow.style.transform = `rotate(${norm360(r.heading)}deg)`;
		el.relativeArrow.style.transform = `rotate(${norm360(r.rwFromBearing)}deg)`;
		el.trueArrow.style.transform = `rotate(${norm360(r.twFromBearing)}deg)`;

		// textual details
		el.twDir.textContent = formatDir(r.twFromBearing);
		el.twSpeed.textContent = r.twSpeed.toFixed(1) + " kn";

		const [bft, desc] = beaufort(r.twSpeed);
		el.twBft.textContent = String(bft);
		el.twDesc.textContent = desc;
	}

	// events
	["input", "change"].forEach((evt) => {
		el.vHeading.addEventListener(evt, update);
		el.vSpeed.addEventListener(evt, update);
		el.rwAngle.addEventListener(evt, update);
		el.rwSpeed.addEventListener(evt, update);
	});

	// Slider events - sync with number inputs
	["input", "change"].forEach((evt) => {
		el.vSpeedSlider.addEventListener(evt, () => {
			el.vSpeed.value = el.vSpeedSlider.value;
			update();
		});
		el.rwSpeedSlider.addEventListener(evt, () => {
			el.rwSpeed.value = el.rwSpeedSlider.value;
			update();
		});
	});

	el.sidePort.addEventListener("click", () => setSide("port"));
	el.sideStarboard.addEventListener("click", () => setSide("starboard"));

	// initial render
	update();
})();
