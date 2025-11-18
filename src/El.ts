import type { idString, selectorString, GenericEvent, TagEventMap, htmlTags, htmlElements } from '../types/index.js';
import { ElementNotFoundError, InvalidElementTypeError, NoParentNodeError, InvalidReturnValueError } from './errors.js';

function isAElement(selector: string | Node | Element | htmlElements | (() => any)): selector is htmlElements {
  return (selector instanceof HTMLElement);
}

export class El<
  ElementName extends htmlTags = htmlTags,
  StrictTypes extends boolean = false
> {
  element: htmlElements<ElementName>;
  debug = false;

  /**
   * Create a new instance of El.
   * @param {selectorString} selector - The CSS selector for the HTML element.
   */
  constructor(selector: selectorString | htmlElements<ElementName> | (() => htmlElements<ElementName>) | (() => htmlTags) | (() => selectorString)) {
    if (isAElement(selector)) {
      this.element = selector as htmlElements<ElementName>;
      return;
    }

    if (typeof selector === 'function') {
      const t = selector();
      if (!t) throw new InvalidReturnValueError('an element or selector string');
      if (this.debug) console.log('Function returned', t);
      if (isAElement(t)) {
        this.element = t as htmlElements<ElementName>;
        return;
      }
      if (typeof t === 'string') {
        const element = document.querySelector(t) as htmlElements<ElementName>;
        if (!element) throw new ElementNotFoundError(t);

        this.element = element as htmlElements<ElementName>;
        return;
      }
    }


    const element = document.querySelector(selector as selectorString) as htmlElements<ElementName>;
    if (!element) throw new ElementNotFoundError(selector as string);

    this.element = element as htmlElements<ElementName>;
    return;
  }

  /**
  * Get the current HTML element.
  * @returns {htmlElements<ElementName>} The current HTML element.
  */
  self(): htmlElements<ElementName> {
    return this.element;
  }

  /**
   * Toggle a class or classes on the current HTML element.
   * @param {string | Array<string>} className - The class or classes to toggle.
   * @returns {this} The current instance for chaining.
   */
  toggleClass(className: string | Array<string>): this {
    if (typeof className === 'string' && className.includes(' ')) className = className.split(' ');

    if (!Array.isArray(className)) className = [className];
    className.forEach(c => this.element.classList.toggle(c));

    return this;
  }

  /**
  * Add a class or classes to the current HTML element.
  * @param {Array<string> | string | (() => string) | (() => Array<string>)} className - The class or classes to add.
  * @returns {this} The current instance for chaining.
  */
  addClass(className: Array<string> | string | (() => string) | (() => Array<string>)): this {
    if (typeof className === 'function') className = className();
    if (typeof className === 'string' && className.includes(' ')) className = className.split(' ');

    if (!Array.isArray(className)) className = [className];
    className.forEach((singleClass: string): void => this.element.classList.add(singleClass));

    return this;
  }

  /**
   * Remove a class or classes from the current HTML element.
   * @param {Array<string> | string | (() => string) | (() => Array<string>)} className - The class or classes to remove.
   * @returns {this} The current instance for chaining.
   */
  removeClass(className: Array<string> | string | (() => string) | (() => Array<string>)): this {
    if (typeof className === 'function') className = className();
    if (typeof className === 'string' && className.includes(' ')) className = className.split(' ');

    if (!Array.isArray(className)) className = [className];
    className.forEach((singleClass: string): void => this.element.classList.remove(singleClass));

    return this;
  }

  /**
   * Check if the current HTML element has a class.
   * @param {string} className - The class to check.
   * @returns {boolean} True if the element has the class, false otherwise.
   */
  hasClass(className: string): boolean {
    return this.element.classList.contains(className);
  }

  /**
  * Replace the current HTML element with a string.
  * @param {string} string - The string to replace the element with.
  * @returns {this} The current instance for chaining.
  */
  replaceWith(string: string): this {
    this.element.outerHTML = string;
    return this;
  }

  /**
   * Replace the current HTML element with a new element.
   * @template NewElement - The name of the new HTML element tag.
   * @param {NewElement} tagName - The tag name of the new element.
   * @param {string | undefined} idForNewElement - The id for the new element.
   * @returns {El<NewElement>} A new instance of El for the new element.
   */
  replaceWithElement<NewElement extends htmlTags = htmlTags>(tagName: NewElement, idForNewElement: string | undefined = undefined): El<NewElement> {
    const newEl = document.createElement<NewElement>(tagName);
    newEl.id = idForNewElement ?? this.element.id;
    if (!this.element?.parentNode) throw new NoParentNodeError('replace element', this.element.id);
    this.element.parentNode.replaceChild(newEl, this.element);
    return new El<NewElement>(`#${newEl.id}`);
  }

  /**
   * Set the inner HTML of the current HTML element.
   * @param {string} string - The new inner HTML.
   * @returns {this} The current instance for chaining.
   */
  html(string: string): this {
    this.element.innerHTML = string;
    return this;
  }

  /**
   * Empty the inner HTML of the current HTML element.
   * @returns {this} The current instance for chaining.
   */
  empty(): this {
    this.element.innerHTML = '';
    return this;
  }

  /**
  * Check or uncheck the current HTML element if it is an input element.
  * @param {boolean} trueOrFalse - Whether to check or uncheck the element.
  * @returns {this} The current instance for chaining.
  * @throws {TypeError} If the current HTML element is not an input element.
  */
  check(trueOrFalse: boolean): this {
    if (this.element instanceof HTMLInputElement) {
      this.element.checked = trueOrFalse;
      return this;
    }
    throw new InvalidElementTypeError('check', 'input', this.element.tagName.toLowerCase(), this.element.id);
  }

  /**
  * Get whether the current HTML element is checked if it is an input element.
  * @returns {boolean} Whether the element is checked.
  * @throws {TypeError} If the current HTML element is not an input element.
  */
  checked(): boolean {
    if (this.element instanceof HTMLInputElement) return this.element.checked;
    throw new InvalidElementTypeError('checked', 'input', this.element.tagName.toLowerCase(), this.element.id);
  }

  /**
   * Dispatch a click event on the current HTML element.
   * @returns {this} The current instance for chaining.
   */
  click(): this {
    this.element.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: false }),
    );
    return this;
  }

  /**
  * Return the current instance if the expression is true, otherwise return undefined, useful for chaining
  * @param {boolean} expression - The expression to evaluate.
  * @returns {this | undefined} The current instance if the expression is true, otherwise null.
  */
  if<Expression extends boolean = boolean>(expression: Expression): Expression extends true ? this : null {
    return (expression)
      ? (this as Expression extends true ? this : never)
      : (null as Expression extends true ? never : null);
  }

  /**
   * Wrap the current HTML element with a div.
   * @param {string} classForDiv - The class for the div.
   * @returns {this} The current instance for chaining.
   */
  wrap(classForDiv: string): this {
    const wrapper = document.createElement('div');
    wrapper.className = classForDiv;
    if (!this.element?.parentNode) throw new NoParentNodeError('wrap element', this.element.id);
    this.element.parentNode.insertBefore(wrapper, this.element);
    this.element.parentNode.removeChild(this.element);
    wrapper.appendChild(this.element);
    return this;
  }

  /**
   * Set the src attribute of the current HTML element if it is an image element.
   * @param {string} srcString - The new src.
   * @returns {this} The current instance for chaining.
   * @throws {TypeError} If the current HTML element is not an image element.
   */
  src(srcString: string): this {
    if (this.element instanceof HTMLImageElement) {
      this.element.src = srcString;
    } else {
      throw new InvalidElementTypeError('src', 'img', this.element.tagName.toLowerCase(), this.element.id);
    }
    return this;
  }

  /**
   * Set the alt attribute of the current HTML element if it is an image element.
   * @param {string} altString - The new alt.
   * @returns {this} The current instance for chaining.
   * @throws {TypeError} If the current HTML element is not an image element.
   */
  alt(altString: string): this {
    if (this.element instanceof HTMLImageElement) {
      this.element.alt = altString;
    } else {
      throw new InvalidElementTypeError('alt', 'img', this.element.tagName.toLowerCase(), this.element.id);
    }
    return this;
  }

  /**
   * Returns the parent element of the current HTML element.
   * @returns El<ElementName, StrictTypes>
   */
  parent<ElementTag extends htmlTags = htmlTags>(): El<ElementTag, true> {
    const parentElement = this.element.parentElement as HTMLDivElement
    if (!parentElement) throw new NoParentNodeError('get parent element', this.element.id);
    if (!parentElement.id) parentElement.id = `parent-${this.element.id}`;
    return new El<ElementTag, true>(`#${parentElement?.id}`);
  }

  /**
  * Remove the current HTML element from the DOM.
  * @returns {this} The current instance for chaining.
  */
  remove(): this {
    if (!this.element?.parentNode) throw new NoParentNodeError('remove element', this.element.id);
    this.element.parentNode.removeChild(this.element);
    return this;
  }

  /**
   * Clear the innerHTML of the current HTML element.
   * @returns {this} The current instance for chaining.
   */
  clear(): this {
    this.element.innerHTML = '';
    return this;
  }

  /**
   * Remove specified attributes from the current HTML element.
   * @param {Array<string> | string} properties - The attributes to remove.
   * @returns {this} The current instance for chaining.
   */
  unset(properties: Array<string> | string): this {
    if (typeof properties === 'string') properties = [properties];

    properties.forEach((key: string): void => {
      this.element.removeAttribute(key);
    });

    return this;
  }

  /**
   * Set specified attributes and their values for the current HTML element.
   * @param {Record<string, any>} setObj - The attributes and their values to set.
   * @returns {this} The current instance for chaining.
   */
  set(setObj: Record<string, string | number | boolean>): this {
    Object.entries(setObj).forEach(([key, value]: [string, string | number | boolean]): void => {
      if (!value) return;
      this.element.setAttribute(key, (typeof value === 'string') ? value : value.toString());
    });
    return this;
  }

  /**
   * Get the first child element of the current HTML element.
   * @returns {Element | undefined} The first child element, or undefined if there are no child elements.
   */
  firstChild<E extends HTMLElement = HTMLElement>(): E | undefined {
    return this.element.firstElementChild as E;
  }

  /**
   * Append or prepend a child element or HTML string to the current HTML element.
   * @param {HTMLElement | string} child - The child element or HTML string to append or prepend.
   * @param {'append' | 'prepend' | null} insertAt - Where to insert the child.
   * @returns {this} The current instance for chaining.
   */
  child(child: HTMLElement | string, insertAt: 'append' | 'prepend' | null = null): this {
    if (typeof child === 'string') {
      if (!insertAt || insertAt === 'append') {
        this.element.insertAdjacentHTML('beforeend', child);
      } else {
        this.element.insertAdjacentHTML('afterbegin', child);
      }
    } else {
      if (insertAt === 'append' || insertAt == null) { this.element.append(child); }
      if (insertAt === 'prepend') { this.element.prepend(child); }
    }
    return this;
  }

  /**
   * Get all child nodes of the current HTML element.
   * @returns {NodeListOf<ChildNode>} The child nodes.
   */
  children(): NodeListOf<ChildNode> {
    return this.element.childNodes;
  }

  /**
   * Set the text content of the current HTML element.
   * @param {string | number | boolean} txt - The text content to set.
   * @returns {this} The current instance for chaining.
   */
  text(txt: string | number | boolean | undefined): this {
    if (!txt) return this;

    this.element.textContent = txt.toString();
    return this;
  }

  /**
  * Set the text content of the current HTML element.
  * @param {string} content - The text content to set.
  * @returns {this} The current instance for chaining.
  */
  textContent(content: string): this;
  /**
   * Get the text content of the current HTML element.
   * @returns {string|undefined} The text content.
   */
  textContent(): string | undefined;
  /**
   * Set the text content of the current HTML element.
   * @param {string} content - The text content to set.
   * @returns {this|string|undefined} The current instance for chaining.
   */
  textContent<Txt extends string | undefined = undefined>(content?: Txt): Txt extends string ? this : string | undefined {
    if (!content) {
      return this.element.textContent as Txt extends string ? this : string | undefined;
    }
    this.element.textContent = content;
    return this as Txt extends string ? this : string | undefined;
  }

  /**
   * Append a text node as a child of the current HTML element.
   * @param {string} s - The text to append.
   * @returns {this} The current instance for chaining.
   */
  textChild(s: string): this {
    const textEl = document.createTextNode(s.toString());
    this.element.appendChild(textEl);
    return this;
  }

  /**
   * Set the type attribute of the current HTML element.
   * @param {string} T - The type attribute to set.
   * @returns {this} The current instance for chaining.
   */
  type(_type: string): this {
    if ('type' in this.element) this.element.setAttribute('type', _type);
    return this;
  }

  /**
   * Set the name attribute of the current HTML element.
   * @param {string} N - The name attribute to set.
   * @returns {this} The current instance for chaining.
   */
  name(_name: string): this {
    if ('name' in this.element) this.element.name = _name;
    return this;
  }

  /**
  * Set the type attribute of the current HTML element.
  * @param {string} type - The type attribute to set.
  * @returns {this} The current instance for chaining.
  */
  input(type: string): this {
    if ('name' in this.element) this.element.name = this.element.id;
    if ('type' in this.element) this.element.setAttribute('type', type);
    return this;
  }

  /**
   * Set the htmlFor attribute of the current HTML element.
   * @param {string} elementTheLabelIsFor - The id of the element the label is for.
   * @returns {this} The current instance for chaining.
   */
  htmlFor(elementTheLabelIsFor: string): this {
    if ('htmlFor' in this.element) this.element.setAttribute('for', elementTheLabelIsFor);
    return this;
  }


  /**
   * Get id attribute of the current HTML element.
   * @returns {string} The id value.
   */
  id(): string;
  /**
   * Set the id attribute of the current HTML element.
   * @param {string} idForEl - The id attribute to set.
   * @returns {this} The current instance for chaining or the id value.
   */
  id<ID extends string>(idForEl: ID): this;
  /**
   * Get the id attribute of the current HTML element.
   * @param {undefined} idForEl
   * @returns {string} The id value.
   */
  id<ID extends undefined>(idForEl: ID): string;
  /**
  * Set or retrieving the id attribute of the current HTML element.
  * @param {string | undefined} idForEl - The id attribute to set.
  * @returns {this | string} The current instance for chaining or the id value.
  */
  id<ID extends string | undefined = undefined>(idForEl?: ID): ID extends undefined ? string : this {
    if (!idForEl) return this.element.id as ID extends undefined ? string : never;

    this.element.id = idForEl;
    return this as ID extends undefined ? string : this;
  }

  /**
   * Get or set the value of the current HTML element.
   * @param {string} newVal - The new value to set.
   * @returns {this | string} The current instance for chaining or the value.
   */
  val<Value extends string | number | boolean | undefined = undefined>(newVal?: Value): Value extends undefined ? string : this {
    if (this.element instanceof HTMLInputElement
      || this.element instanceof HTMLSelectElement
      || this.element instanceof HTMLTextAreaElement
      || this.element instanceof HTMLOptionElement
      || this.element instanceof HTMLProgressElement) {
      // If we don't supply a value, return the current value
      if (newVal === undefined || newVal === null) return this.element.value as Value extends undefined ? string : never;

      // Convert the value to a string and set it
      this.element.value = (newVal instanceof Date)
        ? `${newVal.getFullYear()}-${newVal.getMonth() + 1}-${newVal.getDate()}` // Format date for date input
        : (typeof newVal === 'string')
          ? newVal
          : newVal.toString();

      // return this
      return this as Value extends undefined ? string : this;
    }
    throw new InvalidElementTypeError('val', 'input, select, textarea, or progress', this.element.tagName.toLowerCase(), this.element.id);
  }

  /**
   * Get the value of a data attribute of the current HTML element.
   * @param {string} dataSuffix - The suffix of the data attribute.
   * @returns {string | null} The value of the data attribute.
   */
  data(dataSuffix: string): string | null {
    return this.element.getAttribute(`data-${dataSuffix}`);
  }

  /**
   * Get the dataset of the current HTML element.
   * @returns {DOMStringMap} The dataset.
   */
  dataset(): DOMStringMap {
    return this.element.dataset;
  }

  /**
   * Add an event listener to the current HTML element.
   * @param {string} event - The event name to listen for.
   * @param {EventListenerOrEventListenerObject} listener - The event listener function or object.
   * @param {boolean | AddEventListenerOptions} options - The options for the event listener.
   * @returns {this} The current instance for chaining.
   */
  on<Data = undefined, EventType extends keyof TagEventMap = keyof TagEventMap>(
    event: EventType,
    listener: StrictTypes extends false
      ? (e: GenericEvent<Data>) => void | Promise<void>
      : (e: TagEventMap<ElementName, Data>[EventType]) => void | Promise<void>,
    options?: boolean | AddEventListenerOptions
  ): this {
    // @ts-ignore
    this.element.addEventListener(event, listener as unknown as EventListenerOrEventListenerObject, options);
    return this;
  }

  /**
  * Add an event listener to the current HTML element that will be triggered only once.
  * @param {string} eventName - The name of the event to listen for.
  * @param {(event: Event) => void | Promise<void>} eventHandler - The event handler function.
  * @returns {this} The current instance for chaining.
  */
  once(eventName: string, eventHandler: (event: Event) => void | Promise<void>) {
    // @ts-ignore
    this.element.addEventListener(eventName, eventHandler, { once: true });
    return this;
  }

  /**
  * Dispatch a custom event on the current HTML element.
  * @param {string} eventName - The name of the event to dispatch.
  * @param {any} detail - The event detail.
  * @returns {this} The current instance for chaining.
  */
  now(eventName: string, detail: any): this {
    this.element.dispatchEvent(new CustomEvent(eventName, {
      detail: detail,
    }));
    return this;
  }

  /**
   * Remove an event listener from the current HTML element.
   * @param {string} event - The event name to remove the listener from.
   * @param {EventListenerOrEventListenerObject} listener - The event listener function or object to remove.
   * @param {boolean | EventListenerOptions} options - The options for the event listener.
   * @returns {this} The current instance for chaining.
   */
  off(event: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): this {
    // @ts-ignore
    this.element.removeEventListener(event, listener, options);
    return this;
  }

  /**
   * Trigger an event on the current HTML element.
   * @param {string} event - The event name to trigger.
   * @param {CustomEventInit} options - The options for the custom event.
   * @returns {this} The current instance for chaining.
   */
  trigger(event: string, options?: CustomEventInit): this {
    this.element.dispatchEvent(new CustomEvent(event, options));
    return this;
  }

  /**
  * Trigger a change event on the current HTML element.
  * @returns {this} The current instance for chaining.
  */
  triggerChange(): this {
    if (this.element instanceof HTMLSelectElement) {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('change', true, true);
      this.element.dispatchEvent(event);
      return this;
    }
    throw new InvalidElementTypeError('triggerChange', 'select', this.element.tagName.toLowerCase(), this.element.id);
  }

  /**
  * Find all elements with the specified tag inside the current HTML element.
  * @param {string} tag - The tag name to search for.
  * @returns {NodeList} A NodeList containing all matching elements.
  */
  find(tag: string): NodeList {
    return this.element.querySelectorAll(tag);
  }

  /**
   * Dispatch a custom event on the current HTML element.
   * @param {string} eventName - The name of the event to dispatch.
   * @returns {this} The current instance for chaining.
   */
  dispatchEvent(eventName: string): this {
    this.element.dispatchEvent(new Event(eventName));
    return this;
  }

  /**
   * Execute a callback function with the current HTML element's id as the argument.
   * @param {(id: idString) => any} cb - The callback function to execute.
   * @returns {this} The current instance for chaining.
   */
  nestFrom(cb: (id: idString) => any): this {
    cb(`#${this.element.id}`);
    return this;
  }

  /**
   * Get a computed CSS property value.
   * @param {string} property - The CSS property name.
   * @returns {string} The computed CSS property value.
   */
  css(property: string): string;
  /**
   * Set a single CSS property.
   * @param {string} property - The CSS property name.
   * @param {string | number} value - The CSS property value.
   * @returns {this} The current instance for chaining.
   */
  css(property: string, value: string | number): this;
  /**
   * Set multiple CSS properties.
   * @param {Record<string, string | number>} properties - Object containing CSS properties and values.
   * @returns {this} The current instance for chaining.
   */
  css(properties: Record<string, string | number>): this;
  /**
   * Get or set CSS properties on the current HTML element.
   * @param {string | Record<string, string | number>} propertyOrProperties - The CSS property name or object of properties.
   * @param {string | number} value - The CSS property value (when setting a single property).
   * @returns {this | string} The current instance for chaining or the property value.
   */
  css(propertyOrProperties: string | Record<string, string | number>, value?: string | number): this | string {
    // Get single property
    if (typeof propertyOrProperties === 'string' && value === undefined) {
      return window.getComputedStyle(this.element).getPropertyValue(propertyOrProperties);
    }

    // Set single property
    if (typeof propertyOrProperties === 'string' && value !== undefined) {
      this.element.style.setProperty(propertyOrProperties, value.toString());
      return this;
    }

    // Set multiple properties
    if (typeof propertyOrProperties === 'object') {
      Object.entries(propertyOrProperties).forEach(([key, val]) => {
        this.element.style.setProperty(key, val.toString());
      });
      return this;
    }

    return this;
  }

  /**
   * Show the element by setting display to its default value.
   * @returns {this} The current instance for chaining.
   */
  show(): this {
    const display = this.element.style.display;
    if (display === 'none' || display === '') {
      this.element.style.display = '';
    }
    return this;
  }

  /**
   * Hide the element by setting display to none.
   * @returns {this} The current instance for chaining.
   */
  hide(): this {
    this.element.style.display = 'none';
    return this;
  }

  /**
   * Toggle the visibility of the element.
   * @returns {this} The current instance for chaining.
   */
  toggle(): this {
    const display = window.getComputedStyle(this.element).display;
    if (display === 'none') {
      this.show();
    } else {
      this.hide();
    }
    return this;
  }

  /**
   * Check if the element is visible.
   * @returns {boolean} True if the element is visible, false otherwise.
   */
  isVisible(): boolean {
    return window.getComputedStyle(this.element).display !== 'none';
  }

  /**
   * Get the width of the element.
   * @returns {number} The width in pixels.
   */
  width(): number;
  /**
   * Set the width of the element.
   * @param {number | string} value - The width value (number for pixels, or string with unit).
   * @returns {this} The current instance for chaining.
   */
  width(value: number | string): this;
  /**
   * Get or set the width of the element.
   * @param {number | string} value - The width value (optional).
   * @returns {number | this} The width in pixels or the current instance for chaining.
   */
  width(value?: number | string): number | this {
    if (value === undefined) {
      return this.element.getBoundingClientRect().width;
    }
    this.element.style.width = typeof value === 'number' ? `${value}px` : value;
    return this;
  }

  /**
   * Get the height of the element.
   * @returns {number} The height in pixels.
   */
  height(): number;
  /**
   * Set the height of the element.
   * @param {number | string} value - The height value (number for pixels, or string with unit).
   * @returns {this} The current instance for chaining.
   */
  height(value: number | string): this;
  /**
   * Get or set the height of the element.
   * @param {number | string} value - The height value (optional).
   * @returns {number | this} The height in pixels or the current instance for chaining.
   */
  height(value?: number | string): number | this {
    if (value === undefined) {
      return this.element.getBoundingClientRect().height;
    }
    this.element.style.height = typeof value === 'number' ? `${value}px` : value;
    return this;
  }

  /**
   * Get the offset position of the element relative to the document.
   * @returns {{top: number, left: number}} The offset position.
   */
  offset(): { top: number; left: number } {
    const rect = this.element.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    };
  }

  /**
   * Get the position of the element relative to its offset parent.
   * @returns {{top: number, left: number}} The position.
   */
  position(): { top: number; left: number } {
    return {
      top: this.element.offsetTop,
      left: this.element.offsetLeft,
    };
  }

  /**
   * Animate the element using the Web Animations API.
   * @param {Keyframe[] | PropertyIndexedKeyframes} keyframes - The animation keyframes.
   * @param {number | KeyframeAnimationOptions} options - The animation duration or options.
   * @returns {Animation} The Animation object.
   */
  animate(keyframes: Keyframe[] | PropertyIndexedKeyframes, options?: number | KeyframeAnimationOptions): Animation {
    return this.element.animate(keyframes, options);
  }

  /**
   * Fade in the element.
   * @param {number} duration - The animation duration in milliseconds (default: 300).
   * @returns {Promise<this>} A promise that resolves when the animation completes.
   */
  fadeIn(duration: number = 300): Promise<this> {
    this.element.style.display = '';
    const animation = this.element.animate(
      [
        { opacity: '0' },
        { opacity: '1' }
      ],
      {
        duration,
        easing: 'ease-in-out',
        fill: 'forwards'
      }
    );
    return animation.finished.then(() => this);
  }

  /**
   * Fade out the element.
   * @param {number} duration - The animation duration in milliseconds (default: 300).
   * @returns {Promise<this>} A promise that resolves when the animation completes.
   */
  fadeOut(duration: number = 300): Promise<this> {
    const animation = this.element.animate(
      [
        { opacity: '1' },
        { opacity: '0' }
      ],
      {
        duration,
        easing: 'ease-in-out',
        fill: 'forwards'
      }
    );
    return animation.finished.then(() => {
      this.element.style.display = 'none';
      return this;
    });
  }

  /**
   * Slide down the element (show with sliding animation).
   * @param {number} duration - The animation duration in milliseconds (default: 300).
   * @returns {Promise<this>} A promise that resolves when the animation completes.
   */
  slideDown(duration: number = 300): Promise<this> {
    // Get the target height
    this.element.style.display = '';
    this.element.style.overflow = 'hidden';
    const height = this.element.scrollHeight;

    // Set initial state
    this.element.style.height = '0px';

    const animation = this.element.animate(
      [
        { height: '0px', opacity: '0' },
        { height: `${height}px`, opacity: '1' }
      ],
      {
        duration,
        easing: 'ease-in-out',
        fill: 'forwards'
      }
    );

    return animation.finished.then(() => {
      this.element.style.height = '';
      this.element.style.overflow = '';
      return this;
    });
  }

  /**
   * Slide up the element (hide with sliding animation).
   * @param {number} duration - The animation duration in milliseconds (default: 300).
   * @returns {Promise<this>} A promise that resolves when the animation completes.
   */
  slideUp(duration: number = 300): Promise<this> {
    const height = this.element.scrollHeight;
    this.element.style.overflow = 'hidden';

    const animation = this.element.animate(
      [
        { height: `${height}px`, opacity: '1' },
        { height: '0px', opacity: '0' }
      ],
      {
        duration,
        easing: 'ease-in-out',
        fill: 'forwards'
      }
    );

    return animation.finished.then(() => {
      this.element.style.display = 'none';
      this.element.style.height = '';
      this.element.style.overflow = '';
      return this;
    });
  }

  /**
   * Fade the element to a specific opacity.
   * @param {number} opacity - The target opacity (0 to 1).
   * @param {number} duration - The animation duration in milliseconds (default: 300).
   * @returns {Promise<this>} A promise that resolves when the animation completes.
   */
  fadeTo(opacity: number, duration: number = 300): Promise<this> {
    const currentOpacity = window.getComputedStyle(this.element).opacity;

    const animation = this.element.animate(
      [
        { opacity: currentOpacity },
        { opacity: opacity.toString() }
      ],
      {
        duration,
        easing: 'ease-in-out',
        fill: 'forwards'
      }
    );

    return animation.finished.then(() => this);
  }
}

export function el<ElementName extends htmlTags = htmlTags, StrictTypes extends boolean = false>(selector: selectorString): El<ElementName, StrictTypes> {
  return new El<ElementName, StrictTypes>(selector);
}

export type toolsInterface<HTMLTagName extends htmlTags = htmlTags> = ReturnType<typeof el<HTMLTagName>>;

