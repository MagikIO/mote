import type { GenericEvent, TagEventMap, multiSelectString, htmlTags } from '../types';

export class All<E extends keyof HTMLElementTagNameMap = 'input'> {
  elements: NodeListOf<HTMLElementTagNameMap[E]>;
  debug = false;

  constructor(tempSelector: multiSelectString) {
    this.elements = document.querySelectorAll<HTMLElementTagNameMap[E]>(tempSelector);
  }

  each<CoerceTo extends htmlTags = E>(callback: (element: HTMLElementTagNameMap[CoerceTo], index: number) => void) {
    this.elements.forEach((element, index) => {
      callback(element as unknown as HTMLElementTagNameMap[CoerceTo], index);
    });
    return this;
  }

  log(formatToTreeView = false) {
    if (this.debug) {
      if (formatToTreeView) {
        console.log(this.elements);
      } else {
        console.log(Array.from(this.elements));
      }
    }
    return this;
  }

  attr(attribute: string, value: string) {
    this.elements.forEach((element) => {
      element.setAttribute(attribute, value);
    });
    return this;
  }

  data(dataName: string, value: string) {
    this.elements.forEach((element) => {
      element.dataset[dataName] = value;
    });
    return this;
  }

  toggleClass(className: string) {
    this.elements.forEach((element) => {
      element.classList.toggle(className);
    });
    return this;
  }
  addClass(className: Array<string> | string) {
    this.elements.forEach((element) => {
      if (Array.isArray(className)) {
        className.forEach((singleClass: string): void => element.classList.add(singleClass));
      } else {
        element.classList.add(className);
      }
    });
    return this;
  }
  removeClass(className: string[] | string) {
    this.elements.forEach((element) => {
      if (Array.isArray(className)) {
        className.forEach((singleClass: string): void => element.classList.remove(singleClass));
      } else {
        element.classList.remove(className);
      }
    });
    return this;
  }
  replaceWith(string: string) {
    this.elements.forEach((element) => {
      element.outerHTML = string;
    });
    return this;
  }
  html(string: string) {
    this.elements.forEach((element) => {
      element.innerHTML = string;
    });
    return this;
  }
  empty() {
    this.elements.forEach((element) => {
      element.innerHTML = '';
    });
    return this;
  }
  click() {
    this.elements.forEach((element) => {
      element.dispatchEvent(
        new MouseEvent('click', { view: window, bubbles: true, cancelable: false }),
      );
    });
    return this;
  }
  wrap(classForDiv: string) {
    this.elements.forEach((element) => {
      const wrapper: HTMLDivElement = document.createElement('div');
      wrapper.className = classForDiv;
      element.parentNode?.insertBefore(wrapper, element);
      element.parentNode?.removeChild(element);
      wrapper.appendChild(element);
    });
    return this;
  }
  self() {
    return this.elements;
  }
  src(srcString: string) {
    this.elements.forEach((element) => {
      const input = element as HTMLInputElement;
      input.src = srcString;
    });
    return this;
  }
  remove() {
    this.elements.forEach((element) => {
      element.parentNode?.removeChild(element);
    });
    return this;
  }
  clear() {
    this.elements.forEach((element) => {
      element.innerHTML = '';
    });
    return this;
  }
  set(setObj: Record<string, string | number | boolean>) {
    this.elements.forEach((element) => {
      Object.keys(setObj).forEach((key: string): void => {
        element.setAttribute(key, setObj[key].toString());
      });
    });
    return this;
  }
  unset(properties: Array<string>) {
    this.elements.forEach((element) => {
      properties.forEach((key: string): void => {
        element.removeAttribute(key);
      });
    });
    return this;
  }
  child(HTMLElement: HTMLElement, insertAt: 'append' | 'prepend' | null = null) {
    this.elements.forEach((element) => {
      if (insertAt === 'append' || insertAt == null) { element.append(HTMLElement); }
      if (insertAt === 'prepend') { element.prepend(HTMLElement); }
    });
    return this;
  }
  text(txt: any) {
    this.elements.forEach((element) => {
      element.textContent = txt.toString();
    });
    return this;
  }
  textChild(string: string) {
    this.elements.forEach((element) => {
      const textEl: Text = document.createTextNode(string.toString());
      element.appendChild(textEl);
    });
    return this;
  }
  type(type: string) {
    this.elements.forEach((element) => {
      (element as HTMLInputElement).type = type;
    });
    return this;
  }
  name(name: string) {
    this.elements.forEach((element) => {
      (element as HTMLInputElement).name = name;
    });
    return this;
  }
  input(type: string) {
    this.elements.forEach((element) => {
      (element as HTMLInputElement).name = element.id;
      (element as HTMLInputElement).type = type;
    });
    return this;
  }
  htmlFor(elementTheLabelIsFor: string) {
    this.elements.forEach((element) => {
      (element as HTMLLabelElement).htmlFor = elementTheLabelIsFor;
    });
    return this;
  }
  val<Value extends string | number | boolean = string | number | boolean>(newVal?: Value) {
    this.elements.forEach((element) => {
      if (element instanceof HTMLInputElement
        || element instanceof HTMLSelectElement
        || element instanceof HTMLTextAreaElement
        || element instanceof HTMLOptionElement) {
        if (typeof newVal !== 'undefined') {
          element.value = newVal.toString();
        }
      }
    });
    return this;
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
    listener: (e: GenericEvent<Data>) => void | Promise<void>,
    options?: boolean | AddEventListenerOptions
  ): this {
    this.elements.forEach((element) => {
      (element as HTMLElement).addEventListener(event, listener as EventListener, options);
    });
    return this;
  }
  once<Data = undefined, EventType extends keyof TagEventMap = keyof TagEventMap>(
    event: EventType,
    listener: (e: GenericEvent<Data>) => void | Promise<void>,
    options?: AddEventListenerOptions
  ): this {
    this.elements.forEach((element) => {
      if (!options) (element as HTMLElement).addEventListener(event, listener as EventListener, { once: true });
      if (options) (element as HTMLElement).addEventListener(event, listener as EventListener, { ...options, once: true, });
    });
    return this;
  }
  off(eventName: string, eventHandler: (e: GenericEvent) => void | Promise<void>) {
    this.elements.forEach((element) => {
      (element as HTMLElement).removeEventListener(eventName, eventHandler as EventListener);
    });
    return this;
  }
  now(eventName: string, detail: any) {
    this.elements.forEach((element) => {
      element.dispatchEvent(new CustomEvent(eventName, {
        detail: detail,
      }));
    });
    return this;
  }
};

export function all<Elements extends htmlTags = 'input'>(tempSelector: multiSelectString) {
  return new All<Elements>(tempSelector);
}
