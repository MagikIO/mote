import { ulid } from 'ulid'
import { El } from './El';
import type { selectorString, htmlTags } from '../types';

export type IDdElementName = `${htmlTags}#${string}`;
export type ExtractedID<T extends htmlTags | IDdElementName = htmlTags | IDdElementName> = T extends `${infer _}#${infer ID}` ? ID : never;
export type ExtractedElementName<T extends htmlTags | IDdElementName = htmlTags | IDdElementName> = T extends `${infer ElementName}#${string}` ? ElementName : T;

function isIDdElementName(selector: string): selector is IDdElementName {
  return (selector.includes('#') && selector.split('#').length === 2);
}

export const mote = <
  ElementName extends htmlTags | IDdElementName = htmlTags | IDdElementName,
  StrictMode extends boolean = true
>(tagName: ElementName, appendTo: selectorString, fromWithin?: (id: selectorString) => void | Promise<void>) => {
  const m = new Mote<ElementName, StrictMode>(tagName)
  const e = m.appendTo(appendTo);
  if (fromWithin) m.appendWithin(fromWithin);
  return e;
}

export class Mote<
  ElementName extends htmlTags | IDdElementName = htmlTags | IDdElementName,
  StrictMode extends boolean = true
> {
  public element;

  constructor(selector: ElementName) {
    const { id, tagName } = this.parseSelector(selector);
    this.element = document.createElement(tagName) as HTMLElementTagNameMap[ExtractedElementName<ElementName>];
    this.element.id = id;
  }

  protected parseSelector(selector: ElementName) {
    if (typeof selector !== 'string') {
      throw new Error(`[Mote] ~> |ERROR| Selector must be a string`, { cause: selector });
    }
    if (isIDdElementName(selector)) {
      return {
        id: selector.split('#')[1] as ExtractedID<ElementName>,
        tagName: selector.split('#')[0] as ExtractedElementName<ElementName>
      }
    }
    return { id: ulid(), tagName: selector }
  }

  public appendTo(selector: selectorString) {
    const target = document.querySelector(selector);
    if (!target) throw new Error(`[Mote] ~> ${this.element.tagName} |ERROR| Could not find element with selector ${selector}`);
    target.appendChild(this.element);
    return new El<ExtractedElementName<ElementName>, StrictMode>(`#${this.element.id}`);
  }

  public appendToBody() {
    document.body.appendChild(this.element);
    return new El<ExtractedElementName<ElementName>, StrictMode>(`#${this.element.id}`);
  }

  public appendToHead() {
    document.head.appendChild(this.element);
    return new El<ExtractedElementName<ElementName>, StrictMode>(`#${this.element.id}`);
  }

  public appendToRoot() {
    document.documentElement.appendChild(this.element);
    return new El<ExtractedElementName<ElementName>, StrictMode>(`#${this.element.id}`);
  }

  public appendWithin(cb: (targetID: selectorString) => void | Promise<void>) {
    Promise
      .resolve(cb(`#${this.element.id}`))
      .then((e) => {
        if (typeof e === 'undefined') return;
        console.debug(`[Mote:within] -> Nest detected a async cb that returned a value to it! This can't be right!`, e);
      }).catch((err) => {
        console.error(`[Mote:within] -> Error in async cb`, err);
      })
  }
}
