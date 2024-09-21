/**
 * Class representing the session replayer.
 * @class
 * @classdesc This class is used to replay the user's website session.
 */
class EasyReplayer {
    /**
     * Create an EasyReplayer instance.
     */
    constructor() {
        this.startTime = 0; // The time the replay started.
        this.replayTime = 0; // The time the replay is currently at.
        this.recording = [];
        this.currentEvent = 0; // The event currently being replayed.
        this.cursor = null;
        this.styles = null;
        this.idMap = new Map(); // Map of element IDs to DOM elements.
    }

    /**
     * Load the recording data and optionally start replaying.
     * @param {Object} options - The options for loading.
     * @param {string} [options.recording=null] - Compressed recording data.
     * @param {string} [options.styles=null] - Compressed styles data.
     * @param {string} [options.elements=null] - Compressed elements data.
     * @param {string} [options.scripts=null] - Compressed scripts data.
     * @param {boolean} [start=false] - Whether to start the replay after loading.
     * @returns {Promise<void>}
     */
    async load(options, start = false) {
        options = {
            recording: null,
            styles: null,
            elements: null,
            scripts: null,
            ...options
        };

        if (options.elements != null) await this.loadElements(options.elements);
        if (options.styles != null) await this.loadStyles(options.styles);
        if (options.scripts != null) await this.loadScripts(options.scripts);
        await this.loadRecording(options.recording);
        if (start) this.start();
    }

    /**
     * Load the compressed recording data.
     * @param {string} data - The compressed recording data.
     * @returns {Promise<this>}
     */
    async loadRecording(data) {
        const decodedData = await EasyDecompress.decompress(data);
        const raw = JSON.parse(decodedData);
        this.recording = this.parse(raw);
        return this;
    }

    /**
     * Load and apply the compressed styles.
     * @param {string} data - The compressed styles data.
     * @returns {Promise<this>}
     */
    async loadStyles(data) {
        const raw = await EasyDecompress.decompress(data);
        this.styles = new EasyStyles(JSON.parse(raw));
        return this;
    }

    /**
     * Load and execute the compressed scripts.
     * @param {string} data - The compressed scripts data.
     * @returns {Promise<this>}
     */
    async loadScripts(data) {
        const raw = await EasyDecompress.decompress(data);
        const scripts = JSON.parse(raw);

        const promises = [];

        // First, load external scripts (those with a 'src' attribute)
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

        // Wait for all external scripts to load
        await Promise.all(promises);

        // Then, execute inline scripts
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

    /**
     * Load and append the compressed HTML elements to the document.
     * @param {string} data - The compressed elements data.
     * @returns {Promise<this>}
     */
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

    /**
     * Recursively register elements and store them in the idMap.
     * @param {Element} element - The element to register.
     */
    registerElements(element) {
        const id = element.getAttribute("easy-id");
        if (id !== null) this.idMap.set(id, element);

        Array.from(element.children).forEach(child => {
            this.registerElements(child);
        });
    }

    /**
     * Parse the raw events data into event objects.
     * @param {Array} raw - The raw events data.
     * @returns {Array} The parsed events.
     */
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
                default:
                    return null;
            }
        });
    }

    /**
     * Start the replay.
     */
    start() {
        if (this.cursor == null) this.cursor = new EasyCursor();

        this.triggerNextEvent(this.recording[this.currentEvent]);
    }

    /**
     * Schedule the next event to be replayed.
     * @param {EasyEvent} event - The event to replay.
     */
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

    /**
     * Replay an individual event.
     * @param {EasyEvent} event - The event to replay.
     */
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

    /**
     * Replay a mouse move event.
     * @param {EasyMouseMoveEvent} event - The mouse move event.
     */
    replayMouseMoveEvent(event) {
        this.cursor.setPosition(event.x, event.y);
        if (event.cursorPosition) this.cursor.setSelection(event);
    }

    /**
     * Replay a mouse click event.
     * @param {EasyMouseClickEvent} event - The mouse click event.
     */
    replayMouseClickEvent(event) {
        this.cursor.setPosition(event.x, event.y);
        this.cursor.setButton(event.button);
        this.cursor.click(event);
        if (event.button === 2) {
            // Simulate right-click hold for 200ms
            setTimeout(() => {
                this.cursor.setButton(-1);
            }, 200);
        } else if (event.phase) {
            // Mouse button released
            this.cursor.setButton(-1);
        } else {
            // Mouse button pressed
            this.cursor.setButton(event.button);
        }
        if (event.cursorPosition) this.cursor.setSelection(event);
    }

    /**
     * Replay a keyboard event.
     * @param {EasyKeyboardEvent} event - The keyboard event.
     */
    replayKeyboardEvent(event) {
        EasyKeyboard.typeKey(event);
    }

    /**
     * Replay a DOM mutation event.
     * @param {EasyMutationEvent} event - The mutation event.
     */
    replayMutationEvent(event) {
        const parser = new DOMParser();
        const target = this.idMap.get(String(event.target));
        if (!target) return;

        switch (event.type) {
            case 'childList':
                event.nodes.forEach(nodeData => {
                    if (nodeData.action === 0) { // Remove node
                        if (nodeData.text === true) {
                            // Remove text node at specified index
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
                    } else { // Add node
                        if (nodeData.text) {
                            let node = document.createTextNode(nodeData.html);
                            // Insert text node at the correct position
                            if (nodeData.index !== undefined && nodeData.index < target.childNodes.length) {
                                target.insertBefore(node, target.childNodes[nodeData.index]);
                            } else {
                                target.appendChild(node);
                            }
                        } else {
                            let node = parser.parseFromString(nodeData.html, 'text/html').body.firstChild;
                            this.idMap.set(String(nodeData.id), node);
                            // Insert node at the correct position
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

/**
 * Class representing the styles applied during replay.
 */
class EasyStyles {
    /**
     * Create an EasyStyles instance.
     * @param {Array<string>} data - The array of CSS styles.
     */
    constructor(data) {
        this.styles = [];
        for (let [index, style] of data.entries()) {
            this.styles[index] = document.createElement("style");
            this.styles[index].innerHTML = style;
            document.head.appendChild(this.styles[index]);
        }
    }
}

/**
 * Class representing the cursor used during replay.
 */
class EasyCursor {
    /**
     * Create an EasyCursor instance.
     */
    constructor() {
        this.element = document.createElement("div");
        this.element.classList.add("easy-replayer", "cursor");
        document.body.appendChild(this.element);
    }

    /**
     * Set the cursor position.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     */
    setPosition(x, y) {
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
    }

    /**
     * Set the cursor button state.
     * @param {number} button - The mouse button (-1: none, 0: left, 2: right).
     */
    setButton(button) {
        if (button === -1) {
            this.element.classList.remove("left", "right", "other");
        } else if (button === 0) {
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

    /**
     * Set the text selection range if applicable.
     * @param {EasyEvent} event - The event containing selection data.
     */
    setSelection(event) {
        const target = event.focusedElement ? document.querySelector(event.focusedElement) : document.body;
        if (target && target.setSelectionRange) {
            target.setSelectionRange(event.cursorPosition.start, event.cursorPosition.end);
        }
    }

    /**
     * Simulate a click event on the target element.
     * @param {EasyEvent} event - The event containing the target element.
     */
    click(event) {
        const target = event.focusedElement ? document.querySelector(event.focusedElement) : document.body;
        if (target && target !== document.body) {
            target.focus();
        } else {
            document.activeElement.blur();
        }
    }
}

/**
 * Class handling keyboard events during replay.
 * TODO: This needs to be fleshed out with more key command combination logic.
 */
class EasyKeyboard {
    /**
     * Simulate typing a key.
     * @param {EasyKeyboardEvent} event - The keyboard event to simulate.
     */
    static typeKey(event) {
        const target = event.focusedElement ? document.querySelector(event.focusedElement) : document.body;
        if (target && target !== document.body) {
            target.focus();
        } else {
            document.activeElement.blur();
        }

        // Dispatch a keyboard event; useful for canvas elements or custom handlers
        target.dispatchEvent(
            new KeyboardEvent(event.phase ? "keyup" : "keydown", {
                key: event.key,
                ctrlKey: event.mods.includes(0),
                altKey: event.mods.includes(1),
                shiftKey: event.mods.includes(2),
                metaKey: event.mods.includes(3),
            })
        );

        // If the target is an input or textarea, update its value
        if (
            (target.tagName === "INPUT" || target.tagName === "TEXTAREA") &&
            event.key.length === 1 &&
            event.phase === 0 && // Only on keydown
            !(event.mods.includes(0) || event.mods.includes(3)) // Ignore if Ctrl or Meta is pressed
        ) {
            if (event.cursorPosition) {
                target.value =
                    target.value.slice(0, event.cursorPosition.start) +
                    event.key +
                    target.value.slice(event.cursorPosition.end);
            } else {
                target.value += event.key;
            }
        }
    }
}
