/**
 * Minimised Data Key:
 * e: Event Type
 * t: Time (milliseconds)
 * x: X Coordinate
 * y: Y Coordinate
 * b: Button (0: Left, 1: Middle, 2: Right)
 * k: Key
 * p: Phase (0: Down, 1: Up)
 * m: [Modifiers] (0: Ctrl, 1: Alt, 2: Shift, 3: Meta)
 * f: Focused Element
 * c: Cursor Position (s: Start, e: End)
 * 
 * Event Types:
 * 0: Mouse Move
 * 1: Mouse Click
 * 2: Keyboard
 * 3: Scroll
 * 4: Mutation
 */

/**
 * Class representing a generic event.
 */
class EasyEvent {
    /**
     * Create an EasyEvent.
     * @param {string} event - The event type.
     * @param {number} time - The time in milliseconds.
     * @param {Element|string|null} [focusedElement=null] - The focused element or its selector.
     * @param {Object|null} [cursorPosition=null] - The cursor position.
     */
    constructor(event, time, focusedElement = null, cursorPosition = null) {
        this.event = event;
        this.time = time;
        this.focusedElement = focusedElement == null ? null : typeof focusedElement === "string" ? focusedElement : this.uniqueElementSelector(focusedElement);
        this.cursorPosition = cursorPosition ?? this.getCursorPosition(focusedElement);
    }

    /**
     * Create a selector string that can be used to uniquely identify the element.
     * @param {Element} element - The element to create a selector for.
     * @returns {string} Returns the unique element selector.
     */
    uniqueElementSelector(element) {
        if (element.id) {
            return `#${element.id}`;
        }
    
        let path = [];
        while (element && element.nodeType === Node.ELEMENT_NODE) {
            let selector = element.nodeName.toLowerCase();
            if (element.className) {
                selector += '.' + element.className.trim().split(/\s+/).join('.');
            } else {
                let sibling = element;
                let nth = 1;
                while (sibling = sibling.previousElementSibling) {
                    if (sibling.nodeName.toLowerCase() === selector) nth++;
                }
                selector += `:nth-of-type(${nth})`;
            }
            path.unshift(selector);
            element = element.parentNode;
        }
        return path.join(' > ');
    }

    /**
     * Get the cursor position within an input or textarea element.
     * @param {Element} element - The element to get the cursor position from.
     * @returns {Object|null} Returns the cursor position as an object or null if not an input or textarea.
     */
    getCursorPosition(element) {
        if (element && (element.tagName === "INPUT" || element.tagName === "TEXTAREA")) {
            return {
                start: element.selectionStart,
                end: element.selectionEnd
            };
        }
        return null;
    }

    /**
     * Outputs the object as a JSON object representation.
     * @returns {Object} Returns the event as a JSON object.
     */
    toJSON() {
        return {
            event: this.event,
            time: this.time,
            focusedElement: this.focusedElement,
            cursorPosition: this.cursorPosition
        }
    }

    /**
     * Minimises the contents for network transfer.
     * @returns {Object} Returns the compressed event.
     */
    get min() {
        let r = {
            e: this.event,
            t: this.time
        };

        if (this.focusedElement) r.f = this.focusedElement;
        if (this.cursorPosition) r.c = { s: this.cursorPosition.start, e: this.cursorPosition.end };

        return r;
    }
}

/**
 * Class representing a mouse move event.
 * @extends EasyEvent
 */
class EasyMouseMoveEvent extends EasyEvent {
    /**
     * Create a mouse move event.
     * @param {number} time - The time in milliseconds.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @param {Element|string|null} [focusedElement=null] - The focused element or its selector.
     * @param {Object|null} [cursorPosition=null] - The cursor position.
     */
    constructor(time, x, y, focusedElement = null, cursorPosition = null) {
        super("mouse", time, focusedElement, cursorPosition);
        this.x = x;
        this.y = y;
    }

    /**
     * Parse a minimized data object into an EasyMouseMoveEvent.
     * @param {Object} data - The minimized data object.
     * @returns {EasyMouseMoveEvent} The parsed EasyMouseMoveEvent instance.
     */
    static parse(data) {
        return new EasyMouseMoveEvent(data.t, data.x, data.y, data?.f ?? null, data.c ? { start: data.c.s, end: data.c.e } : null);
    }

    /**
     * Outputs the object as a JSON object representation.
     * @returns {Object} Returns the event as a JSON object.
     */
    toJSON() {
        return {
            ...super.toJSON(),
            x: this.x,
            y: this.y
        }
    }

    /**
     * Minimises the contents for network transfer.
     * @returns {Object} Returns the compressed event.
     */
    get min() {
        return {
            ...super.min,
            e: 0,
            x: this.x,
            y: this.y
        }
    }
}

/**
 * Class representing a mouse click event.
 * @extends EasyEvent
 */
class EasyMouseClickEvent extends EasyEvent {
    /**
     * Create a mouse click event.
     * @param {number} time - The time in milliseconds.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @param {number} phase - The phase (0: down, 1: up).
     * @param {number} button - The mouse button (0: left, 1: middle, 2: right).
     * @param {Element|string|null} [focusedElement=null] - The focused element or its selector.
     * @param {Object|null} [cursorPosition=null] - The cursor position.
     */
    constructor(time, x, y, phase, button, focusedElement = null, cursorPosition = null) {
        super("click", time, focusedElement, cursorPosition);
        this.x = x;
        this.y = y;
        this.phase = phase;
        this.button = button;
    }

    /**
     * Parse a minimized data object into an EasyMouseClickEvent.
     * @param {Object} data - The minimized data object.
     * @returns {EasyMouseClickEvent} The parsed EasyMouseClickEvent instance.
     */
    static parse(data) {
        return new EasyMouseClickEvent(data.t, data.x, data.y, data.p, data.b, data?.f ?? null, data.c ? { start: data.c.s, end: data.c.e } : null);
    }

    /**
     * Outputs the object as a JSON object representation.
     * @returns {Object} Returns the event as a JSON object.
     */
    toJSON() {
        return {
            ...super.toJSON(),
            x: this.x,
            y: this.y,
            phase: this.phase,
            button: this.button
        }
    }

    /**
     * Minimises the contents for network transfer.
     * @returns {Object} Returns the compressed event.
     */
    get min() {
        let r = {
            ...super.min,
            e: 1,
            x: this.x,
            y: this.y,
            p: this.phase,
            b: this.button
        };

        return r;
    }
}

/**
 * Class representing a keyboard event.
 * @extends EasyEvent
 */
class EasyKeyboardEvent extends EasyEvent {
    /**
     * Create a keyboard event.
     * @param {number} time - The time in milliseconds.
     * @param {string} key - The key pressed.
     * @param {number} phase - The phase (0: down, 1: up).
     * @param {Array<boolean>} mods - The modifiers array [Ctrl, Alt, Shift, Meta].
     * @param {Element|string|null} [focusedElement=null] - The focused element or its selector.
     * @param {Object|null} [cursorPosition=null] - The cursor position.
     */
    constructor(time, key, phase, mods, focusedElement = null, cursorPosition = null) {
        super("keyboard", time, focusedElement, cursorPosition);
        this.key = key;
        this.phase = phase;
        this.mods = this.parseMods(mods);
        this.focusedElement = focusedElement == null ? null : typeof focusedElement === "string" ? focusedElement : this.uniqueElementSelector(focusedElement);
        this.cursorPosition = cursorPosition ?? this.getCursorPosition(focusedElement);
    }

    /**
     * Parse modifiers into an array of modifier indices.
     * @param {Array<boolean>} mods - The modifiers array [Ctrl, Alt, Shift, Meta].
     * @returns {Array<number>} The array of active modifier indices.
     */
    parseMods(mods) {
        let r = [];
        if (mods[0]) r.push(0); // Ctrl
        if (mods[1]) r.push(1); // Alt
        if (mods[2]) r.push(2); // Shift
        if (mods[3]) r.push(3); // Meta
        return r;
    }

    /**
     * Parse a minimized data object into an EasyKeyboardEvent.
     * @param {Object} data - The minimized data object.
     * @returns {EasyKeyboardEvent} The parsed EasyKeyboardEvent instance.
     */
    static parse(data) {
        return new EasyKeyboardEvent(
            data.t,
            data.k,
            data.p,
            data?.m ? [data.m.includes(0), data.m.includes(1), data.m.includes(2), data.m.includes(3)] : [false, false, false, false],
            data?.f ?? null,
            data.c ? { start: data.c.s, end: data.c.e } : null
        );
    }

    /**
     * Outputs the object as a JSON object representation.
     * @returns {Object} Returns the event as a JSON object.
     */
    toJSON() {
        return {
            ...super.toJSON(),
            key: this.key,
            phase: this.phase,
            mods: this.mods,
            focusedElement: this.focusedElement,
            cursorPosition: this.cursorPosition
        }
    }

    /**
     * Minimises the contents for network transfer.
     * @returns {Object} Returns the compressed event.
     */
    get min() {
        let r = {
            ...super.min,
            e: 2,
            k: this.key,
            p: this.phase
        }

        if (this.focusedElement) r.f = this.focusedElement;
        if (this.mods.length) r.m = this.mods;
        if (this.cursorPosition) r.c = { s: this.cursorPosition.start, e: this.cursorPosition.end };

        return r;
    }
}

/**
 * Class representing a scroll event.
 * @extends EasyEvent
 */
class EasyScrollEvent extends EasyEvent {
    /**
     * Create a scroll event.
     * @param {number} time - The time in milliseconds.
     * @param {number} x - The x-coordinate of the scroll position.
     * @param {number} y - The y-coordinate of the scroll position.
     */
    constructor(time, x, y) {
        super("scroll", time);
        this.x = x;
        this.y = y;
    }

    /**
     * Parse a minimized data object into an EasyScrollEvent.
     * @param {Object} data - The minimized data object.
     * @returns {EasyScrollEvent} The parsed EasyScrollEvent instance.
     */
    static parse(data) {
        return new EasyScrollEvent(data.t, data.x, data.y);
    }

    /**
     * Outputs the object as a JSON object representation.
     * @returns {Object} Returns the event as a JSON object.
     */
    toJSON() {
        return {
            ...super.toJSON(),
            x: this.x,
            y: this.y
        }
    }

    /**
     * Minimises the contents for network transfer.
     * @returns {Object} Returns the compressed event.
     */
    get min() {
        return {
            ...super.min,
            e: 3,
            x: this.x,
            y: this.y
        }
    }
}

/**
 * Class representing a mutation event.
 * @extends EasyEvent
 */
class EasyMutationEvent extends EasyEvent {
    /**
     * Create a mutation event.
     * @param {number} time - The time in milliseconds.
     * @param {Object} mutation - The mutation record.
     * @param {Function|null} getUniqueID - Function to get unique IDs for nodes.
     */
    constructor(time, mutation, getUniqueID) {
        super("mutation", time);
        this.type = mutation.type;
        this.target = getUniqueID == null ? mutation.target : getUniqueID(mutation.target);
        
        this.nodes = getUniqueID == null ? mutation.nodes : Array.from(mutation.nodes).map(node => {
            const processed = {};
            if (node.action === 0) { // Remove node (0)
                processed.action = 0;
                processed.index = node.index;
                processed.html = node.outerHTML || node.textContent;
                if (node.nodeType === Node.TEXT_NODE) {
                    processed.text = true;
                } else {
                    processed.id = getUniqueID(node);
                }
            } else { // Add node (1)
                processed.action = 1;
                if (node.nodeType === Node.TEXT_NODE) {
                    processed.index = node.index;
                    processed.html = node.textContent;
                    processed.text = true;
                } else {
                    const clone = node.cloneNode(true);
                    const uniqueID = getUniqueID(node);
                    clone.setAttribute("easy-id", uniqueID);
                    this.setUniqueIDsForChildren(node, clone, getUniqueID);
                    processed.id = uniqueID;
                    processed.index = node.index;
                    processed.html = clone.outerHTML;
                }
            }
            return processed;
        });
        this.attributeName = mutation.attributeName;
        this.newValue = mutation.newValue;
        this.oldValue = mutation.oldValue;
    }

    /**
     * Recursively set unique IDs for child nodes in a cloned node.
     * @param {Node} originalNode - The original node.
     * @param {Node} clonedNode - The cloned node.
     * @param {Function} getUniqueID - Function to get unique IDs.
     */
    setUniqueIDsForChildren(originalNode, clonedNode, getUniqueID) {
        if (!originalNode || !clonedNode || !getUniqueID) return;

        Array.from(originalNode.childNodes).forEach((childNode, index) => {
            if (childNode.nodeType === Node.ELEMENT_NODE) {
                const uniqueID = getUniqueID(childNode); // Get unique ID from the original child node
                const clonedChildNode = clonedNode.childNodes[index];
                clonedChildNode.setAttribute("easy-id", uniqueID);
                // Recursively set unique IDs for the child nodes of this child node
                this.setUniqueIDsForChildren(childNode, clonedChildNode, getUniqueID);
            }
        });
    }

    /**
     * Parse a minimized data object into an EasyMutationEvent.
     * @param {Object} data - The minimized data object.
     * @returns {EasyMutationEvent} The parsed EasyMutationEvent instance.
     */
    static parse(data) {
        const getUniqueID = null;
        const mutation = {
            type: data.ty,
            target: data.ta,
            nodes: data.m.map(node => {
                const processed = {};
                processed.action = node.a;
                processed.index = node.ix;
                processed.html = node.h;
                if (node.i) processed.id = node.i;
                if (node.t) processed.text = node.t;
                return processed;
            }),
            attributeName: data.at,
            newValue: data.n,
            oldValue: data.o
        };
        return new EasyMutationEvent(data.t, mutation, getUniqueID);
    }

    /**
     * Outputs the object as a JSON object representation.
     * @returns {Object} Returns the event as a JSON object.
     */
    toJSON() {
        return {
            ...super.toJSON(),
            type: this.type,
            target: this.target,
            nodes: this.nodes,
            attributeName: this.attributeName,
            newValue: this.newValue,
            oldValue: this.oldValue
        }
    }

    /**
     * Minimises the contents for network transfer.
     * @returns {Object} Returns the compressed event.
     */
    get min() {
        return {
            ...super.min,
            e: 4,
            ty: this.type,
            ta: this.target,
            m: this.nodes.map(node => {
                const processed = {};
                processed.a = node.action;
                processed.ix = node.index;
                processed.h = node.html;
                if (node.id) processed.i = node.id;
                if (node.text) processed.t = node.text;
                return processed;
            }),
            at: this.attributeName,
            n: this.newValue,
            o: this.oldValue
        }
    }
}
