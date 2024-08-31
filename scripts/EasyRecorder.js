/**
 * @class EasyRecorder
 * @classdesc This class is used to record the user's website session.
 */
class EasyRecorder {
	constructor() {
		this.startTime = Date.now();
		this.recording = [];
		this.idCounter = 0;
		this.idMap = new Map();

		this.registerEvents();
	}

	async data () {
		const data = JSON.stringify(this.recording.map(x => x.min));
		return EasyCompress.compress(data);
	}

	get currentTime() {
		return Date.now() - this.startTime;
	}

	async styles() {
		let styles = [];

		for (let i = 0; i < document.styleSheets.length; i++) {
			const stylesheet = document.styleSheets[i];
			styles[i] = ``;
			try {
				const rules = stylesheet.cssRules || stylesheet.rules;
				for (let j = 0; j < rules.length; j++) {
					styles[i] += rules[j].cssText.replaceAll(`\n`, ``);
				}
			} catch (e) {
				console.warn("Could not access stylesheet:", stylesheet.href);
			}
		}

		return EasyCompress.compress(JSON.stringify(styles));
	}

	async scripts() {
		let data = [];
		const ignoreElements = /EasyRecorder|EasyCompress|EasyEvent|matomo|Matomo/;
		for (let m = 0; m <= 1; m++) {
			const masterElement = m ? document.body : document.head;
			let scripts = [];
			const scriptElements = masterElement.getElementsByTagName("script");
			for (let i = 0; i < scriptElements.length; i++) {
				const script = scriptElements[i];
				if (script.src) {
					if (script.src.match(ignoreElements)) continue;
					scripts.push(`~s~` + script.src);
				} else {
					if (script.textContent.match(ignoreElements)) continue;
					scripts.push(script.textContent);
				}
			}
			data[m] = scripts;
		}

		return EasyCompress.compress(JSON.stringify(data));
	}

	async bodyElements() {
		// Assign an ID to body even though we don't bother storing it.
		if (!this.bodyID) {
			this.bodyID = this.getUniqueID(document.body);
			this.idMap.set(this.bodyID, document.body);
		}
		
		const elements = Array.from(document.body.children).filter(el => el.tagName.toLowerCase() !== "script");
		const serialise = elements.map((el, i) => {
			const clone = el.cloneNode(true);
			const uniqueID = this.getUniqueID(el);
			clone.setAttribute("easy-id", uniqueID);
			this.idMap.set(uniqueID, el);
			return clone.outerHTML;
		});
		return EasyCompress.compress(JSON.stringify(serialise));
	}

	registerEvents() {
		document.addEventListener("DOMContentLoaded", async () => {
			this.styles().then(data => {
				console.log("styles");
				console.log(data);
			});
			
			this.scripts().then(data => {
				console.log("scripts");
				console.log(data);
			})

			this.bodyElements().then(data => {
				console.log("elements");
				console.log(data);

				this.observeMutations();
			});
		});

		document.addEventListener("mousemove", this.mouseMoveEvent.bind(this));
		
		document.addEventListener("mousedown", this.mouseClickEvent.bind(this));
		document.addEventListener("mouseup", this.mouseClickEvent.bind(this));
		document.addEventListener("contextmenu", this.mouseClickEvent.bind(this));
		
		document.addEventListener("keydown", this.keyboardEvent.bind(this));
		document.addEventListener("keyup", this.keyboardEvent.bind(this));

		document.addEventListener("scroll", this.scrollEvent.bind(this));
	}

	mouseMoveEvent(event) {
		this.recording.push(new EasyMouseMoveEvent(this.currentTime, event.clientX, event.clientY));
	}

	mouseClickEvent(event) {
		this.recording.push(new EasyMouseClickEvent(this.currentTime, event.clientX, event.clientY, event.type == "mouseup" ? 1 : 0, event.type === "contextmenu" ? 2 : event.button, document.activeElement));
	}

	keyboardEvent(event) {
		this.recording.push(new EasyKeyboardEvent(this.currentTime, event.key, event.type === "keydown" ? 0 : 1, [event.ctrlKey, event.altKey, event.shiftKey, event.metaKey], document.activeElement));
	}

	// TODO: Need to differentiate between element scroll and window scroll.
	scrollEvent(event) {
		this.recording.push(new EasyScrollEvent(this.currentTime, window.scrollX, window.scrollY));
	}

	getUniqueID(element) {
		if (!this.idMap.has(element)) {
			this.idMap.set(element, this.idCounter++);
		}
		const uniqueID = this.idMap.get(element);
		return uniqueID;
	}

	observeMutations() {
		const observer = new MutationObserver(mutations => {
			const mutationMap = new Map();
			let lastEventType = null;
		
			mutations.forEach(mutation => {
				const key = this.getUniqueID(mutation.target) + "|" + this.currentTime;
		
				if (mutation.type === 'childList') {
					// Handle added nodes
					if (mutation.addedNodes.length > 0) {
						const addKey = key + "|add";
						if (!mutationMap.has(addKey) || lastEventType === 'remove') {
							mutationMap.set(addKey, {
								target: mutation.target,
								type: mutation.type,
								attributeName: mutation.attributeName,
								oldValue: mutation.oldValue,
								removedNodes: [],
								addedNodes: [],
							});
						}
						const groupedMutation = mutationMap.get(addKey);
						mutation.addedNodes.forEach(node => {
							const index = Array.from(mutation.target.childNodes).indexOf(node);
							if (node.nodeType === Node.TEXT_NODE) {
								groupedMutation.addedNodes.push({
									nodeType: node.nodeType,
									textContent: node.textContent,
									index
								});
							} else {
								node.index = index;
								groupedMutation.addedNodes.push(node);
							}
						});
						lastEventType = 'add';
					}
		
					// Handle removed nodes
					if (mutation.removedNodes.length > 0) {
						const removeKey = key + "|remove";
						if (!mutationMap.has(removeKey) || lastEventType === 'add') {
							mutationMap.set(removeKey, {
								target: mutation.target,
								type: mutation.type,
								attributeName: mutation.attributeName,
								oldValue: mutation.oldValue,
								removedNodes: [],
								addedNodes: [],
							});
						}
						const groupedMutation = mutationMap.get(removeKey);
						mutation.removedNodes.forEach(node => {
							const index = Array.from(mutation.target.childNodes).indexOf(node);
							if (node.nodeType === Node.TEXT_NODE) {
								groupedMutation.removedNodes.push({
									nodeType: node.nodeType,
									textContent: node.textContent,
									index
								});
							} else {
								node.index = index;
								groupedMutation.removedNodes.push(node);
							}
						});
						lastEventType = 'remove';
					}
				} else if (mutation.type === 'attributes') {
					// Handle attribute changes
					if (!mutationMap.has(key)) {
						mutationMap.set(key, {
							target: mutation.target,
							type: mutation.type,
							attributeName: mutation.attributeName,
							oldValue: mutation.oldValue,
							newValue: mutation.target.getAttribute(mutation.attributeName), // Capture new value
							removedNodes: [],
							addedNodes: [],
						});
					}
					const groupedMutation = mutationMap.get(key);
				} else {
					// Handle other mutation types (characterData)
					if (!mutationMap.has(key)) {
						mutationMap.set(key, {
							target: mutation.target,
							type: mutation.type,
							attributeName: mutation.attributeName,
							oldValue: mutation.oldValue,
							removedNodes: [],
							addedNodes: [],
						});
					}
					const groupedMutation = mutationMap.get(key);
				}
			});
		
			mutationMap.forEach(groupedMutation => {
				groupedMutation.addedNodes.forEach(node => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						const uniqueID = this.getUniqueID(node);
						node.setAttribute("easy-id", uniqueID);
					}
				});
				const e = new EasyMutationEvent(this.currentTime, groupedMutation, this.getUniqueID.bind(this));
				this.recording.push(e);
			});
		});
	
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			characterData: true
		});
	}
}