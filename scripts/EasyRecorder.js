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
		this.baseURL = window.location.origin;
		//this.baseURL = "https://online.supaigaleongatha.com.au";

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
				console.warn(e);
			}
		}

		return EasyCompress.compress(JSON.stringify(styles));
	}

	async scripts() {
		let data = [];
		const ignoreElements = /EasyRecorder|EasyCompress|EasyEvent|matomo|Matomo|gtag|clarity/;
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
		}
		
		const ignoreElements = ["SCRIPT", "STYLE", "LINK"];
		const elements = Array.from(document.body.children).filter(el => !ignoreElements.includes(el.tagName));
		const serialise = elements.map((el, i) => {
			const clone = el.cloneNode(true);
			const uniqueID = this.getUniqueID(el);
			clone.setAttribute("easy-id", uniqueID);

			this.convertRelativeURLs(clone);

			this.assignElementIDs(el, clone);

			return clone.outerHTML;
		});
		return EasyCompress.compress(JSON.stringify(serialise));
	}

	assignElementIDs(originalNode, clonedNode) {
        if (!originalNode || !clonedNode) return;

        // Assign unique ID to the original node and set it on the cloned node
        if (originalNode.nodeType === Node.ELEMENT_NODE) {
            const uniqueID = this.getUniqueID(originalNode);
            clonedNode.setAttribute("easy-id", uniqueID);
        }

        // Recursively process child nodes
        const originalChildren = Array.from(originalNode.childNodes);
        const clonedChildren = Array.from(clonedNode.childNodes);

        for (let i = 0; i < originalChildren.length; i++) {
            this.assignElementIDs(originalChildren[i], clonedChildren[i]);
        }
    }

	convertRelativeURLs(element) {
		[...(element.tagName === "IMG" ? [element] : []), ...element.querySelectorAll('img')].forEach(img => {
			const src = img.getAttribute('src');
			if (src && !src.startsWith('http')) {
				img.setAttribute('src', new URL(src, this.baseURL).href);
			}
		});

		[...(element.tagName === "LINK" ? [element] : []), ...element.querySelectorAll('link')].forEach(link => {
			const href = link.getAttribute('href');
			if (href && !href.startsWith('http')) {
				link.setAttribute('href', new URL(href, this.baseURL).href);
			}
		});
	
		[...(element.tagName === "A" ? [element] : []), ...element.querySelectorAll('a')].forEach(a => {
			const href = a.getAttribute('href');
			if (href && !href.startsWith('http')) {
				a.setAttribute('href', new URL(href, this.baseURL).href);
			}
		});
	
		[...(element.tagName === "SCRIPT" ? [element] : []), ...element.querySelectorAll('script')].forEach(script => {
			const src = script.getAttribute('src');
			if (src && !src.startsWith('http')) {
				script.setAttribute('src', new URL(src, this.baseURL).href);
			}
		});
	
		[...(element.hasAttribute("style") ? [element] : []), ...element.querySelectorAll('[style]')].forEach(el => {
			const style = el.getAttribute('style');
			if (style) {
				el.setAttribute('style', style.replace(/url\((?!['"]?(?:http|data):)['"]?([^'")]+)['"]?\)/g, (match, p1) => {
					return `url(${new URL(p1, this.baseURL).href})`;
				}));
			}
		});
	
		[...(element.tagName === "STYLE" ? [element] : []), ...element.querySelectorAll('style')].forEach(style => {
			style.textContent = style.textContent.replace(/url\((?!['"]?(?:http|data):)['"]?([^'")]+)['"]?\)/g, (match, p1) => {
				return `url(${new URL(p1, this.baseURL).href})`;
			});
		});
	}

	registerEvents() {
		document.addEventListener("DOMContentLoaded", async () => {
			this.observeMutations();

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
					if (!mutationMap.has(key)) {
						mutationMap.set(key, {
							target: mutation.target,
							type: mutation.type,
							nodes: []
						});
					}

					const groupedMutation = mutationMap.get(key);
					mutation.removedNodes.forEach(node => {
						let index = Array.from(mutation.target.childNodes).indexOf(node);
						if (index === -1) {
							// Node has already been removed, find its previous index
							const previousSibling = node.previousSibling;
							if (previousSibling) {
								const previousIndex = Array.from(mutation.target.childNodes).indexOf(previousSibling);
								index = previousIndex + 1;
							} else {
								index = 0; // Node was the first child
							}
						}

						if (node.nodeType === Node.TEXT_NODE) {
							groupedMutation.nodes.push({
								nodeType: node.nodeType,
								textContent: node.textContent,
								index,
								action: 0
							});
						} else {
							node.index = index;
							groupedMutation.nodes.push(node);
						}
					});

					mutation.addedNodes.forEach(node => {
						const index = Array.from(mutation.target.childNodes).indexOf(node);
						if (node.nodeType === Node.TEXT_NODE) {
							groupedMutation.nodes.push({
								nodeType: node.nodeType,
								textContent: node.textContent,
								index,
								action: 1
							});
						} else {
							node.index = index;
							this.convertRelativeURLs(node);
							groupedMutation.nodes.push(node);
						}
					});

					// Handle removed nodes
					// if (mutation.removedNodes.length > 0) {
					// 	const removeKey = key + "|remove";
					// 	if (!mutationMap.has(removeKey) || lastEventType === 'add') {
					// 		mutationMap.set(removeKey, {
					// 			target: mutation.target,
					// 			type: mutation.type,
					// 			attributeName: mutation.attributeName,
					// 			oldValue: mutation.oldValue,
					// 			removedNodes: [],
					// 			addedNodes: [],
					// 		});
					// 	}
					// 	const groupedMutation = mutationMap.get(removeKey);
					// 	mutation.removedNodes.forEach(node => {
					// 		let index = Array.from(mutation.target.childNodes).indexOf(node);
					// 		if (index === -1) {
					// 			// Node has already been removed, find its previous index
					// 			const previousSibling = node.previousSibling;
					// 			if (previousSibling) {
					// 				const previousIndex = Array.from(mutation.target.childNodes).indexOf(previousSibling);
					// 				index = previousIndex + 1;
					// 			} else {
					// 				index = 0; // Node was the first child
					// 			}
					// 		}

					// 		if (node.nodeType === Node.TEXT_NODE) {
					// 			groupedMutation.removedNodes.push({
					// 				nodeType: node.nodeType,
					// 				textContent: node.textContent,
					// 				index
					// 			});
					// 		} else {
					// 			node.index = index;
					// 			groupedMutation.removedNodes.push(node);
					// 		}
					// 	});
					// 	lastEventType = 'remove';
					// }
					
					// // Handle added nodes
					// if (mutation.addedNodes.length > 0) {
					// 	const addKey = key + "|add";
					// 	if (!mutationMap.has(addKey) || lastEventType === 'remove') {
					// 		mutationMap.set(addKey, {
					// 			target: mutation.target,
					// 			type: mutation.type,
					// 			attributeName: mutation.attributeName,
					// 			oldValue: mutation.oldValue,
					// 			removedNodes: [],
					// 			addedNodes: [],
					// 		});
					// 	}
					// 	const groupedMutation = mutationMap.get(addKey);
					// 	mutation.addedNodes.forEach(node => {
					// 		const index = Array.from(mutation.target.childNodes).indexOf(node);
					// 		if (node.nodeType === Node.TEXT_NODE) {
					// 			groupedMutation.addedNodes.push({
					// 				nodeType: node.nodeType,
					// 				textContent: node.textContent,
					// 				index
					// 			});
					// 		} else {
					// 			node.index = index;
					// 			this.convertRelativeURLs(node);
					// 			groupedMutation.addedNodes.push(node);
					// 		}
					// 	});
					// 	lastEventType = 'add';
					//}
				} else if (mutation.type === 'attributes' && mutation.attributeName !== 'easy-id') {
					// Handle attribute changes
					if (!mutationMap.has(key)) {
						mutationMap.set(key, {
							target: mutation.target,
							type: mutation.type,
							attributeName: mutation.attributeName,
							oldValue: mutation.oldValue,
							newValue: mutation.target.getAttribute(mutation.attributeName), // Capture new value
							nodes: []
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
							nodes: []
						});
					}
					const groupedMutation = mutationMap.get(key);
				}
			});
		
			mutationMap.forEach(groupedMutation => {
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