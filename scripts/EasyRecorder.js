/**
 * Class representing the session recorder.
 * @class
 * @classdesc This class is used to record the user's website session.
 */
class EasyRecorder {
    /**
     * Initializes a new instance of the EasyRecorder class.
     */
    constructor() {
        this.startTime = Date.now();
		this.paused = true;
        this.recording = [];
		this.coreData = {
			st: null,
			sc: null,
			el: null
		};
		this.initial = true; // Whether the first chunk of the recording has been sent.
        this.idCounter = 0;
        this.idMap = new Map();
        this.baseURL = window.location.origin;
		this.chunkLoop = null;

		this.code = null; // The code for the current recording.
		this.sessionID = ""; // The session ID for the current recording.

        this.registerEvents();
    }

	/**
	 * Sets the session ID cookie to a random string.
	 */
	startSession() {
		const length = 20; 
		const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		for (let i = 0; i < length; i++) {
			this.sessionID += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		
		document.cookie = `ehm_ses=${this.sessionID}; path=/`;
	}

	/**
	 * Gets the session ID from the cookie.
	 * @returns {string} The session ID.
	 */
	get session() {
		const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(`ehm_ses=`)) {
                return cookie.substring(8);
            }
        }
        return null;
	}

	/**
	 * Starts a new recording.
	 * 
	 * @param {string} code - The code for the recording if using custom code recording strategy.
	 */
	static async start(code = null) {
		if (EHM.r.session === null) EHM.r.startSession();
		EHM.r.paused = true;
		EHM.r.init(code);
	}

	async init(code) {
		// On page load core data is automatically collected in the DOMContentLoaded event.
		const refreshCore = this.code !== null;

		if (code === null) {
			if (EHM.rs === "url") {
				this.code = window.location.pathname;
			} else if (EHM.rs === "url-query") {
				this.code = window.location.pathname + window.location.search;
			}
		} else {
			this.code = code;
		}

		if (refreshCore) await this.retrieveCore();
		this.recording = [];
		this.startTime = Date.now();
		this.startChunkLoop();
		this.paused = false;
	}

    /**
     * Retrieves the compressed recording data.
     * @returns {Promise<string>} A promise that resolves to the compressed recording data.
     */
    async data() {
        const data = JSON.stringify(this.recording.map(x => x.min));
        return EasyCompress.compress(data);
    }

	/**
	 * Sends the current chunk of recording data to the server on a loop.
	 */
	startChunkLoop() {
		clearInterval(this.chunkLoop);
		this.chunkLoop = setInterval(() => {
			if (!this.paused) this.sendChunk();
		}, EHM.ct * 1000);
	}

	/**
	 * Sends a chunk of recording data to the server.
	 */
	async sendChunk() {
		let data = {
			u: this.code,
			s: this.startTime,
			t: this.currentTime,
			d: await this.data(),
		}
		
		if (this.initial) data.c = this.coreData; // Only attach core data to the first chunk.

		const payload = await EasyCompress.compress(JSON.stringify(data));

		// Clear recording data before sending the chunk.
		this.recording = [];

		const url = new URL(EHM.api);
		url.searchParams.append("s", this.session);
		const response = await fetch(url.toString(), {
			method: "POST",
			mode: 'no-cors',
			body: payload
		});

		if (!response.ok) {
			console.error("Failed to send recording chunk.");
		} else {
			// Only set initial when the first chunk has sent successfully.
			this.initial = false;
		}
	}

    /**
     * Gets the current time elapsed since the start of the recording.
     * @returns {number} The elapsed time in milliseconds.
     */
    get currentTime() {
        return Date.now() - this.startTime;
    }

    /**
     * Retrieves and compresses all the stylesheets in the document.
     * @returns {Promise<string>} A promise that resolves to the compressed stylesheets data.
     */
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

    /**
     * Retrieves and compresses all the scripts in the document.
     * @returns {Promise<string>} A promise that resolves to the compressed scripts data.
     */
    async scripts() {
        let data = [];
        const ignoreElements = /EasyRecorder|EasyCompress|EasyEvent|ehmA|ehmB|ehmC|matomo|Matomo|gtag|clarity/;
        // Loop through both <head> (m=0) and <body> (m=1)
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

    /**
     * Retrieves and compresses the body's HTML elements, excluding scripts, styles, and links.
     * @returns {Promise<string>} A promise that resolves to the compressed HTML elements data.
     */
    async bodyElements() {
        // Assign an ID to the body even though we don't store it
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

    /**
     * Recursively assigns unique IDs to elements and their clones.
     * @param {Element} originalNode - The original DOM node.
     * @param {Element} clonedNode - The cloned DOM node.
     */
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

    /**
     * Converts relative URLs in the element's attributes to absolute URLs.
     * @param {Element} element - The DOM element to process.
     */
    convertRelativeURLs(element) {
        // Process <img> elements
        [...(element.tagName === "IMG" ? [element] : []), ...element.querySelectorAll('img')].forEach(img => {
            const src = img.getAttribute('src');
            if (src && !src.startsWith('http')) {
                img.setAttribute('src', new URL(src, this.baseURL).href);
            }
        });

        // Process <link> elements
        [...(element.tagName === "LINK" ? [element] : []), ...element.querySelectorAll('link')].forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http')) {
                link.setAttribute('href', new URL(href, this.baseURL).href);
            }
        });
    
        // Process <a> elements
        [...(element.tagName === "A" ? [element] : []), ...element.querySelectorAll('a')].forEach(a => {
            const href = a.getAttribute('href');
            if (href && !href.startsWith('http')) {
                a.setAttribute('href', new URL(href, this.baseURL).href);
            }
        });
    
        // Process <script> elements
        [...(element.tagName === "SCRIPT" ? [element] : []), ...element.querySelectorAll('script')].forEach(script => {
            const src = script.getAttribute('src');
            if (src && !src.startsWith('http')) {
                script.setAttribute('src', new URL(src, this.baseURL).href);
            }
        });
    
        // Process inline styles
        [...(element.hasAttribute("style") ? [element] : []), ...element.querySelectorAll('[style]')].forEach(el => {
            const style = el.getAttribute('style');
            if (style) {
                el.setAttribute('style', style.replace(/url\((?!['"]?(?:http|data):)['"]?([^'")]+)['"]?\)/g, (match, p1) => {
                    return `url(${new URL(p1, this.baseURL).href})`;
                }));
            }
        });
    
        // Process <style> elements
        [...(element.tagName === "STYLE" ? [element] : []), ...element.querySelectorAll('style')].forEach(style => {
            style.textContent = style.textContent.replace(/url\((?!['"]?(?:http|data):)['"]?([^'")]+)['"]?\)/g, (match, p1) => {
                return `url(${new URL(p1, this.baseURL).href})`;
            });
        });
    }

	/**
	 * Retrieves the core data for the recording.
	 */
	retrieveCore() {
		const promises = [this.styles(), this.scripts(), this.bodyElements()];

		return Promise.all(promises).then(data => {
			this.coreData.st = data[0];
			this.coreData.sc = data[1];
			this.coreData.el = data[2];

			return this.coreData;
		});
	}

    /**
     * Registers event listeners for various DOM events.
     */
    registerEvents() {
        document.addEventListener("DOMContentLoaded", () => {
            this.observeMutations();
			
			this.retrieveCore();
        });

        document.addEventListener("mousemove", this.mouseMoveEvent.bind(this));
        
        document.addEventListener("mousedown", this.mouseClickEvent.bind(this));
        document.addEventListener("mouseup", this.mouseClickEvent.bind(this));
        document.addEventListener("contextmenu", this.mouseClickEvent.bind(this));
        
        document.addEventListener("keydown", this.keyboardEvent.bind(this));
        document.addEventListener("keyup", this.keyboardEvent.bind(this));

        document.addEventListener("scroll", this.scrollEvent.bind(this));
    }

    /**
     * Handles mouse move events.
     * @param {MouseEvent} event - The mouse event object.
     */
    mouseMoveEvent(event) {
        if (this.paused) return;
		this.recording.push(new EasyMouseMoveEvent(this.currentTime, event.clientX, event.clientY));
    }

    /**
     * Handles mouse click events.
     * @param {MouseEvent} event - The mouse event object.
     */
    mouseClickEvent(event) {
		if (this.paused) return;
        this.recording.push(new EasyMouseClickEvent(
            this.currentTime,
            event.clientX,
            event.clientY,
            event.type == "mouseup" ? 1 : 0,
            event.type === "contextmenu" ? 2 : event.button,
            document.activeElement
        ));
    }

    /**
     * Handles keyboard events.
     * @param {KeyboardEvent} event - The keyboard event object.
     */
    keyboardEvent(event) {
		if (this.paused) return;
        this.recording.push(new EasyKeyboardEvent(
            this.currentTime,
            event.key,
            event.type === "keydown" ? 0 : 1,
            [event.ctrlKey, event.altKey, event.shiftKey, event.metaKey],
            document.activeElement
        ));
    }

    /**
     * Handles scroll events.
     * TODO: Need to differentiate between element scroll and window scroll.
     * @param {Event} event - The scroll event object.
     */
    scrollEvent(event) {
		if (this.paused) return;
        this.recording.push(new EasyScrollEvent(this.currentTime, window.scrollX, window.scrollY));
    }

    /**
     * Generates or retrieves a unique ID for a DOM element.
     * @param {Element} element - The DOM element.
     * @returns {number} The unique ID assigned to the element.
     */
    getUniqueID(element) {
        if (!this.idMap.has(element)) {
            this.idMap.set(element, this.idCounter++);
        }
        const uniqueID = this.idMap.get(element);
        return uniqueID;
    }

    /**
     * Observes mutations on the document body and records them.
     */
    observeMutations() {
        const observer = new MutationObserver(mutations => {
			if (this.paused) return;

            const mutationMap = new Map();
        
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

                    // Process removed nodes
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
                                action: 0 // Action 0 signifies removal
                            });
                        } else {
                            node.index = index;
                            node.action = 0; // Action 0 signifies removal
                            groupedMutation.nodes.push(node);
                        }
                    });

                    // Process added nodes
                    mutation.addedNodes.forEach(node => {
                        const index = Array.from(mutation.target.childNodes).indexOf(node);
                        if (node.nodeType === Node.TEXT_NODE) {
                            groupedMutation.nodes.push({
                                nodeType: node.nodeType,
                                textContent: node.textContent,
                                index,
                                action: 1 // Action 1 signifies addition
                            });
                        } else {
                            node.index = index;
                            node.action = 1; // Action 1 signifies addition
                            this.convertRelativeURLs(node);
                            groupedMutation.nodes.push(node);
                        }
                    });
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
                    // Handle other mutation types (e.g., characterData)
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
        
            // Process grouped mutations
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
