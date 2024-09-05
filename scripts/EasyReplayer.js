/**
 * @class EasyReplayer
 * @classdesc This class is used to replay the user's website session.
 */
class EasyReplayer {
	constructor() {
		this.startTime = 0; // The time the replay started.
		this.replayTime = 0; // The time the replay is currently at.
		this.recording = [];
		this.currentEvent = 0; // The event currently being replayed.
		this.cursor = null;
		this.styles = null;
		this.idMap = new Map();
	}

	async load(options, start = false) {
		options = {
			recording: null,
			styles: null,
			elements: null,
			scripts: null,
			...options
		};

		if (options.elements != null) await this.loadElements(elements);
		if (options.styles != null) await this.loadStyles(styles);
		if (options.scripts != null) await this.loadScripts(scripts);
		await this.loadRecording(recording);
		if (start) this.start();
	}

	async loadRecording(data) {
		const decodedData = await EasyDecompress.decompress(data);
		
		const raw = JSON.parse(decodedData);
		this.recording = this.parse(raw);
		
		return this;
	}

	async loadStyles(data) {
		const raw = await EasyDecompress.decompress(data);
		this.styles = new EasyStyles(JSON.parse(raw));

		return this;
	}

	async loadScripts(data) {
		const raw = await EasyDecompress.decompress(data);
		const scripts = JSON.parse(raw);

		const promises = [];

		for (let m = 0; m < scripts.length; m++) {
			let masterElement = m ? document.body : document.head;
			for (let i = 0; i < scripts[m].length; i++) {
				if (scripts[m][i].startsWith("~s~")) {
					const script = document.createElement("script");
					script.src = scripts[m][i].slice(3);
					const promise = new Promise((resolve, reject) => {
						script.onload = resolve;
						script.onerror = reject;
					});
					promises.push(promise);
					masterElement.appendChild(script);
				}
			}
		}

		await Promise.all(promises);

		for (let m = 0; m < scripts.length; m++) {
			let masterElement = m ? document.body : document.head;
			for (let i = 0; i < scripts[m].length; i++) {
				if (!scripts[m][i].startsWith("~s~")) {
					const script = document.createElement("script");
					script.textContent = scripts[m][i];
					masterElement.appendChild(script);
				}
			}
		}

		return this;
	}

	async loadElements(data) {
		 if (!document.body.hasAttribute("easy-id")) {
			document.body.setAttribute("easy-id", "0");
			this.idMap.set("0", document.body);
		}

		const raw = await EasyDecompress.decompress(data);
		const elements = JSON.parse(raw);

		const parser = new DOMParser();
		elements.forEach(elementHTML => {
			const doc = parser.parseFromString(elementHTML, "text/html");
			const element = doc.body.firstChild;
			if (element) {
				this.registerElements(element);
				document.body.appendChild(element);
			}
		});

		return this;
	}

	registerElements(element) {
		const id = element.getAttribute("easy-id");
		if (id !== null) this.idMap.set(id, element);

		Array.from(element.children).forEach(child => {
			this.registerElements(child);
		});
	}

	parse(raw) {
		return raw.map(event => {
			switch (event.e) {
				case 0:
					return EasyMouseMoveEvent.parse(event);
				case 1:
					return EasyMouseClickEvent.parse(event);
				case 2:
					return EasyKeyboardEvent.parse(event);
				case 3:
					return EasyScrollEvent.parse(event);
				case 4:
					return EasyMutationEvent.parse(event);
			}
		});
	}

	start() {
		if (this.cursor == null) this.cursor = new EasyCursor();

		this.triggerNextEvent(this.recording[this.currentEvent]);
	}

	triggerNextEvent(event) {
		setTimeout(() => {
			this.replayEvent(event);
			this.replayTime = event.time;
			this.currentEvent++;
			if (this.currentEvent < this.recording.length) {
				this.triggerNextEvent(this.recording[this.currentEvent]);
			}
		}, event.time - this.replayTime);
	}

	replayEvent(event) {
		if (event.event === "mouse") {
			this.replayMouseMoveEvent(event);
		} else if (event.event === "click") {
			this.replayMouseClickEvent(event);
		} else if (event.event === "keyboard") {
			this.replayKeyboardEvent(event);
		} else if (event.event === "scroll") {
			window.scrollTo(event.x, event.y);
		} else if (event.event === "mutation") {
			this.replayMutationEvent(event);
		}
	}

	replayMouseMoveEvent(event) {
		this.cursor.setPosition(event.x, event.y);
		if (event.cursorPosition) this.cursor.setSelection(event);
	}

	replayMouseClickEvent(event) {
		this.cursor.setPosition(event.x, event.y);
		this.cursor.setButton(event.button);
		this.cursor.click(event);
		if (event.button === 2) {
			setTimeout(() => {
				this.cursor.setButton(-1);
			}, 200);
		} else if (event.phase) {
			this.cursor.setButton(-1);
		} else {
			this.cursor.setButton(event.button);
		}
		if (event.cursorPosition) this.cursor.setSelection(event);
	}

	replayKeyboardEvent(event) {
		EasyKeyboard.typeKey(event);
	}

	replayMutationEvent(event) {
		const parser = new DOMParser();
        const target = this.idMap.get(String(event.target));

		if (!target) return;

        switch (event.type) {
            case 'childList':
				event.nodes.forEach(nodeData => {
					console.log(nodeData);
					if (nodeData.action === 0) { // Remove node (0)
						if (nodeData.text === true) {
							// Find and remove the text node at the specified index
							const textNode = target.childNodes[nodeData.index];
							if (textNode && textNode.nodeType === Node.TEXT_NODE && textNode.textContent === nodeData.html) {
								textNode.remove();
							}
						} else {
							const existingNode = this.idMap.get(String(nodeData.id));
							if (existingNode) {
								existingNode.remove();
							}
						}
					} else { // Add node (1)
						if (nodeData.text) {
							let node = document.createTextNode(nodeData.html);
							// Insert the text node at the correct position
							if (nodeData.index !== undefined && nodeData.index < target.childNodes.length) {
								target.insertBefore(node, target.childNodes[nodeData.index]);
							} else {
								target.appendChild(node);
							}
						} else {
							let node = parser.parseFromString(nodeData.html, 'text/html').body.firstChild;
							this.idMap.set(String(nodeData.id), node);
							// Insert the node at the correct position
							if (nodeData.index !== undefined && nodeData.index < target.childNodes.length) {
								target.insertBefore(node, target.childNodes[nodeData.index]);
							} else {
								target.appendChild(node);
							}
						}
					}
				});
                break;
            case 'attributes':
                if (event.newValue !== null) {
                    target.setAttribute(event.attributeName, event.newValue);
                } else {
                    target.removeAttribute(event.attributeName);
                }
                break;
            case 'characterData':
                target.textContent = event.oldValue;
                break;
        }
	}
}

class EasyStyles {
	constructor(data) {
		this.styles = [];
		for (let [index, style] of data.entries()) {
			this.styles[index] = document.createElement("style");
			this.styles[index].innerHTML = style;
			document.head.appendChild(this.styles[index]);
		}
	}
}

class EasyCursor {
	constructor() {
		this.element = document.createElement("div");
		this.element.classList.add("easy-replayer", "cursor");
		document.body.appendChild(this.element);
	}

	setPosition(x, y) {
		this.element.style.left = x + "px";
		this.element.style.top = y + "px";
	}

	setButton(button) {
		if (button === -1) {
			this.element.classList.remove("left", "right", "other");
		}else if (button === 0) {
			this.element.classList.remove("right", "other");
			this.element.classList.add("left");
		} else if (button === 2) {
			this.element.classList.remove("left", "other");
			this.element.classList.add("right");
		} else {
			this.element.classList.remove("left", "right");
			this.element.classList.add("other");
		}
	}

	setSelection(event) {
		const target = event.focusedElement ? document.querySelector(event.focusedElement) : document.body;
		target.setSelectionRange(event.cursorPosition.start, event.cursorPosition.end);
	}

	click(event) {
		const target = event.focusedElement ? document.querySelector(event.focusedElement) : document.body;
		if (target != document.body && target != null) target.focus()
		else document.activeElement.blur();
	}
}

// TODO: This needs to be fleshed out a bit more with more key command combination logic.
class EasyKeyboard {
	static typeKey(event) {
		const target = event.focusedElement ? document.querySelector(event.focusedElement) : document.body;
		if (target != document.body) target.focus()
		else document.activeElement.blur();
		// Doesn't work properly, but might be useful for canvas elements.
		target.dispatchEvent(new KeyboardEvent(event.phase ? "keyup" : "keydown", { key: event.key, ctrlKey: event.mods.includes(0), altKey: event.mods.includes(1), shiftKey: event.mods.includes(2), metaKey: event.mods.includes(3) }));

		if ((target.tagName === "INPUT" || target.tagName === "TEXTAREA") && event.key.length === 1 && event.phase === 0 && !(event.mods.includes(0) || event.mods.includes(3))) {
			if (event.cursorPosition) {
				target.value = target.value.slice(0, event.cursorPosition.start) + event.key + target.value.slice(event.cursorPosition.end);
			} else {
				target.value += event.key;
			}
		}
	}
}