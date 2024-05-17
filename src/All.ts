import type { GenericEvent, TagEventMap, multiSelectString, htmlTags } from '../types/index.js';

export class All<E extends keyof HTMLElementTagNameMap = 'input'> {
  public elements: NodeListOf<HTMLElementTagNameMap[E]>;
  public debug = false;

  constructor(tempSelector: multiSelectString) {
    this.elements = document.querySelectorAll<HTMLElementTagNameMap[E]>(tempSelector);
  }

  public each<CoerceTo extends htmlTags = E>(callback: (element: HTMLElementTagNameMap[CoerceTo], index: number) => void) {
    this.elements.forEach((element, index) => {
      callback(element as unknown as HTMLElementTagNameMap[CoerceTo], index);
    });
    return this;
  }

  public log(formatToTreeView = false) {
    if (this.debug) {
      if (formatToTreeView) {
        console.log(this.elements);
      } else {
        console.log(Array.from(this.elements));
      }
    }
    return this;
  }

  public attr(attribute: string, value: string) {
    this.elements.forEach((element) => {
      element.setAttribute(attribute, value);
    });
    return this;
  }

  public data(dataName: string, value: string) {
    this.elements.forEach((element) => {
      element.dataset[dataName] = value;
    });
    return this;
  }

  public toggleClass(className: string) {
    this.elements.forEach((element) => {
      element.classList.toggle(className);
    });
    return this;
  }
  public addClass(className: Array<string> | string) {
    this.elements.forEach((element) => {
      if (Array.isArray(className)) {
        className.forEach((singleClass: string): void => element.classList.add(singleClass));
      } else {
        element.classList.add(className);
      }
    });
    return this;
  }
  public removeClass(className: string[] | string) {
    this.elements.forEach((element) => {
      if (Array.isArray(className)) {
        className.forEach((singleClass: string): void => element.classList.remove(singleClass));
      } else {
        element.classList.remove(className);
      }
    });
    return this;
  }
  public replaceWith(string: string) {
    this.elements.forEach((element) => {
      element.outerHTML = string;
    });
    return this;
  }
  public html(string: string) {
    this.elements.forEach((element) => {
      element.innerHTML = string;
    });
    return this;
  }
  public empty() {
    this.elements.forEach((element) => {
      element.innerHTML = '';
    });
    return this;
  }
  public click() {
    this.elements.forEach((element) => {
      element.dispatchEvent(
        new MouseEvent('click', { view: window, bubbles: true, cancelable: false }),
      );
    });
    return this;
  }
  public wrap(classForDiv: string) {
    this.elements.forEach((element) => {
      const wrapper: HTMLDivElement = document.createElement('div');
      wrapper.className = classForDiv;
      element.parentNode?.insertBefore(wrapper, element);
      element.parentNode?.removeChild(element);
      wrapper.appendChild(element);
    });
    return this;
  }
  public self() {
    return this.elements;
  }
  public src(srcString: string) {
    this.elements.forEach((element) => {
      const input = element as HTMLInputElement;
      input.src = srcString;
    });
    return this;
  }
  public remove() {
    this.elements.forEach((element) => {
      element.parentNode?.removeChild(element);
    });
    return this;
  }
  public clear() {
    this.elements.forEach((element) => {
      element.innerHTML = '';
    });
    return this;
  }
  public set(setObj: Record<string, string | number | boolean>) {
    this.elements.forEach((element) => {
      Object.keys(setObj).forEach((key: string): void => {
        element.setAttribute(key, setObj[key].toString());
      });
    });
    return this;
  }
  public unset(properties: Array<string>) {
    this.elements.forEach((element) => {
      properties.forEach((key: string): void => {
        element.removeAttribute(key);
      });
    });
    return this;
  }
  public child(HTMLElement: HTMLElement, insertAt: 'append' | 'prepend' | null = null) {
    this.elements.forEach((element) => {
      if (insertAt === 'append' || insertAt == null) { element.append(HTMLElement); }
      if (insertAt === 'prepend') { element.prepend(HTMLElement); }
    });
    return this;
  }
  public text(txt: any) {
    this.elements.forEach((element) => {
      element.textContent = txt.toString();
    });
    return this;
  }
  public textChild(string: string) {
    this.elements.forEach((element) => {
      const textEl: Text = document.createTextNode(string.toString());
      element.appendChild(textEl);
    });
    return this;
  }
  public type(type: string) {
    this.elements.forEach((element) => {
      (element as HTMLInputElement).type = type;
    });
    return this;
  }
  public name(name: string) {
    this.elements.forEach((element) => {
      (element as HTMLInputElement).name = name;
    });
    return this;
  }
  public input(type: string) {
    this.elements.forEach((element) => {
      (element as HTMLInputElement).name = element.id;
      (element as HTMLInputElement).type = type;
    });
    return this;
  }
  public htmlFor(elementTheLabelIsFor: string) {
    this.elements.forEach((element) => {
      (element as HTMLLabelElement).htmlFor = elementTheLabelIsFor;
    });
    return this;
  }
  public val<Value extends string | number | boolean = string | number | boolean>(newVal?: Value) {
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
  public on<Data = undefined, EventType extends keyof TagEventMap = keyof TagEventMap>(
    event: EventType,
    listener: (e: GenericEvent<Data>) => void | Promise<void>,
    options?: boolean | AddEventListenerOptions
  ): this {
    this.elements.forEach((element) => {
      (element as HTMLElement).addEventListener(event, listener as EventListener, options);
    });
    return this;
  }
  public once<Data = undefined, EventType extends keyof TagEventMap = keyof TagEventMap>(
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
  public off(eventName: string, eventHandler: (e: GenericEvent) => void | Promise<void>) {
    this.elements.forEach((element) => {
      (element as HTMLElement).removeEventListener(eventName, eventHandler as EventListener);
    });
    return this;
  }
  public now(eventName: string, detail: any) {
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
