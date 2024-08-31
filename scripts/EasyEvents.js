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
 */


class EasyEvent {
	constructor(event, time, focusedElement = null, cursorPosition = null) {
		this.event = event;
		this.time = time;
		this.focusedElement = focusedElement == null ? null : typeof focusedElement === "string" ? focusedElement : this.uniqueElementSelector(focusedElement);
		this.cursorPosition = cursorPosition ?? this.getCursorPosition(focusedElement);
	}

	/**
	 * Create a selector string that can be used to uniquely identify the element.
	 * 
	 * @returns {String} Returns the unique element selector.
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
	 * 
	 * @param {Element} element The element to get the cursor position from.
	 * 
	 * @returns {Object} Returns the cursor position as an object or null if not an input or textarea.
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
	 * 
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
	 * 
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

class EasyMouseMoveEvent extends EasyEvent {
	constructor(time, x, y, focusedElement = null, cursorPosition = null) {
		super("mouse", time, focusedElement, cursorPosition);
		this.x = x;
		this.y = y;
	}

	static parse(data) {
		return new EasyMouseMoveEvent(data.t, data.x, data.y, data?.f ?? null, data.c ? { start: data.c.s, end: data.c.e } : null);
	}

	toJSON() {
		return {
			...super.toJSON(),
			x: this.x,
			y: this.y
		}
	}

	get min() {
		return {
			...super.min,
			e: 0,
			x: this.x,
			y: this.y
		}
	}
}

class EasyMouseClickEvent extends EasyEvent {
	constructor(time, x, y, phase, button, focusedElement = null, cursorPosition = null) {
		super("click", time, focusedElement, cursorPosition);
		this.x = x;
		this.y = y;
		this.phase = phase;
		this.button = button;
	}

	static parse(data) {
		return new EasyMouseClickEvent(data.t, data.x, data.y, data.p, data.b, data?.f ?? null, data.c ? { start: data.c.s, end: data.c.e } : null);
	}

	toJSON() {
		return {
			...super.toJSON(),
			x: this.x,
			y: this.y,
			phase: this.phase,
			button: this.button
		}
	}

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

class EasyKeyboardEvent extends EasyEvent {
	constructor(time, key, phase, mods, focusedElement = null, cursorPosition = null) {
		super("keyboard", time, focusedElement, cursorPosition);
		this.key = key;
		this.phase = phase;
		this.mods = this.parseMods(mods);
		this.focusedElement = focusedElement == null ? null : typeof focusedElement === "string" ? focusedElement : this.uniqueElementSelector(focusedElement);
		this.cursorPosition = cursorPosition ?? this.getCursorPosition(focusedElement);
	}

	parseMods(mods) {
		let r = [];
		if (mods[0]) r.push(0); // Ctrl
		if (mods[1]) r.push(1); // Alt
		if (mods[2]) r.push(2); // Shift
		if (mods[3]) r.push(3); // Meta
		return r;
	}

	static parse(data) {
		return new EasyKeyboardEvent(data.t, data.k, data.p, data?.m ? [data.m.includes(0), data.m.includes(1), data.m.includes(2), data.m.includes(3)] : [false, false, false, false], data?.f ?? null, data.c ? { start: data.c.s, end: data.c.e } : null);
	}

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

class EasyScrollEvent extends EasyEvent {
	constructor(time, x, y) {
		super("scroll", time);
		this.x = x;
		this.y = y;
	}

	static parse(data) {
		return new EasyScrollEvent(data.t, data.x, data.y);
	}

	toJSON() {
		return {
			...super.toJSON(),
			x: this.x,
			y: this.y
		}
	}

	get min() {
		return {
			...super.min,
			e: 3,
			x: this.x,
			y: this.y
		}
	}
}

class EasyMutationEvent extends EasyEvent {
	constructor(time, mutation, getUniqueID) {
		super("mutation", time);
		this.type = mutation.type;
		this.target = getUniqueID == null ? mutation.target : getUniqueID(mutation.target);
		this.addedNodes = getUniqueID == null ? mutation.addedNodes : Array.from(mutation.addedNodes).map(node => ({
			id: node.nodeType === Node.TEXT_NODE ? undefined : getUniqueID(node),
			index: node.index,
			html: node.outerHTML || node.textContent,
			text: node.nodeType === Node.TEXT_NODE ? true : undefined,
		}));
		this.removedNodes = getUniqueID == null ? mutation.removedNodes : Array.from(mutation.removedNodes).map(node => ({
			id: node.nodeType === Node.TEXT_NODE ? undefined : getUniqueID(node),
			index: node.index,
			html: node.outerHTML || node.textContent,
			text: node.nodeType === Node.TEXT_NODE ? true : undefined,
		}));
		this.attributeName = mutation.attributeName;
		this.newValue = mutation.newValue;
		this.oldValue = mutation.oldValue;
	}

	static parse(data) {
		const getUniqueID = null
		const mutation = {
			type: data.ty,
			target: data.ta,
			addedNodes: data.a.map(node => ({ id: node.i, index: node.ix, html: node.h, text: node.t })),
			removedNodes: data.r.map(node => ({ id: node.i, index: node.ix, html: node.h, text: node.t })),
			attributeName: data.at,
			newValue: data.n,
			oldValue: data.o
		};
		return new EasyMutationEvent(data.t, mutation, getUniqueID);
	}

	toJSON() {
		return {
			...super.toJSON(),
			type: this.type,
			target: this.target,
			addedNodes: this.addedNodes,
			removedNodes: this.removedNodes,
			attributeName: this.attributeName,
			newValue: this.newValue,
			oldValue: this.oldValue
		}
	}

	get min() {
		return {
			...super.min,
			e: 4,
			ty: this.type,
			ta: this.target,
			a: this.addedNodes.map(node => ({ i: node.id, ix: node.index, h: node.html, t: node.text })),
            r: this.removedNodes.map(node => ({ i: node.id, ix: node.index, h: node.html, t: node.text })),
			at: this.attributeName,
			n: this.newValue,
			o: this.oldValue
		}
	}
}