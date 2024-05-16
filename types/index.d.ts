
export type htmlTags = keyof HTMLElementTagNameMap
export type idString<id extends string = string> = `#${id}`;
export type classString<className extends string = string> = `.${className}`;
export type advSelectorString = `[${string}]`;
export type selectorString = idString | classString | advSelectorString | htmlTags | string;


type GenericInput<Data> = HTMLInputElement & { value: Data extends undefined ? any : Data }
type GenericSelect<Data> = HTMLSelectElement & { value: Data extends undefined ? any : Data }
type SelectedInputs<Data> = EventTarget & GenericInput<Data> & GenericSelect<Data>;
export type GenericEvent<Data = any> = MouseEvent & InputEvent & CustomEvent & { target: SelectedInputs<Data>, currentTarget: SelectedInputs<Data>, key: string };

export type TagEventMap<HTMLTagName extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap, Data = unknown> = {
  'mouseenter': MouseEvent & {
    target: Data extends undefined ? HTMLElementTagNameMap[HTMLTagName] : Omit<HTMLElementTagNameMap[HTMLTagName], 'value'> & { value: Data },
    currentTarget: Data extends undefined ? HTMLElementTagNameMap[HTMLTagName] : Omit<HTMLElementTagNameMap[HTMLTagName], 'value'> & { value: Data },
    key: string,
  }
  'click': MouseEvent & {
    target: Data extends undefined ? HTMLElementTagNameMap[HTMLTagName] : Omit<HTMLElementTagNameMap[HTMLTagName], 'value'> & { value: Data },
    currentTarget: Data extends undefined ? HTMLElementTagNameMap[HTMLTagName] : Omit<HTMLElementTagNameMap[HTMLTagName], 'value'> & { value: Data },
    key: string,
  }
  'input': InputEvent & {
    target: Data extends undefined ? HTMLElementTagNameMap[HTMLTagName] : Omit<HTMLElementTagNameMap[HTMLTagName], 'value'> & { value: Data },
    currentTarget: Data extends undefined ? HTMLElementTagNameMap[HTMLTagName] : Omit<HTMLElementTagNameMap[HTMLTagName], 'value'> & { value: Data },
    key: string,
  }
  'blur': InputEvent & {
    target: Data extends undefined ? HTMLElementTagNameMap[HTMLTagName] : Omit<HTMLElementTagNameMap[HTMLTagName], 'value'> & { value: Data },
    currentTarget: Data extends undefined ? HTMLElementTagNameMap[HTMLTagName] : Omit<HTMLElementTagNameMap[HTMLTagName], 'value'> & { value: Data },
    key: string,
  }
  'change': InputEvent & {
    target: Data extends undefined ? HTMLElementTagNameMap[HTMLTagName] : Omit<HTMLElementTagNameMap[HTMLTagName], 'value'> & { value: Data },
    currentTarget: Data extends undefined ? HTMLElementTagNameMap[HTMLTagName] : Omit<HTMLElementTagNameMap[HTMLTagName], 'value'> & { value: Data },
    key: string,
  }
  'keyup': KeyboardEvent & {
    target: Data extends undefined ? HTMLElementTagNameMap[HTMLTagName] : Omit<HTMLElementTagNameMap[HTMLTagName], 'value'> & { value: Data },
    currentTarget: Data extends undefined ? HTMLElementTagNameMap[HTMLTagName] : Omit<HTMLElementTagNameMap[HTMLTagName], 'value'> & { value: Data },
    key: string,
  }
  'keydown': KeyboardEvent & {
    target: Data extends undefined ? HTMLElementTagNameMap[HTMLTagName] : Omit<HTMLElementTagNameMap[HTMLTagName], 'value'> & { value: Data },
    currentTarget: Data extends undefined ? HTMLElementTagNameMap[HTMLTagName] : Omit<HTMLElementTagNameMap[HTMLTagName], 'value'> & { value: Data },
    key: string,
  },
  'submit': Event & {
    target: Data extends undefined ? HTMLElementTagNameMap[HTMLTagName] : Omit<HTMLElementTagNameMap[HTMLTagName], 'value'> & { value: Data },
    currentTarget: Data extends undefined ? HTMLElementTagNameMap[HTMLTagName] : Omit<HTMLElementTagNameMap[HTMLTagName], 'value'> & { value: Data },
    key: string,
  },
  'formdata': FormDataEvent & {
    target: Data extends undefined ? HTMLFormElement : Omit<HTMLFormElement, 'value'> & { value: Data },
    currentTarget: Data extends undefined ? HTMLFormElement : Omit<HTMLFormElement, 'value'> & { value: Data },
    key: string,
  },
  'focus': FocusEvent & {
    target: Data extends undefined ? HTMLElementTagNameMap[HTMLTagName] : Omit<HTMLElementTagNameMap[HTMLTagName], 'value'> & { value: Data },
    currentTarget: Data extends undefined ? HTMLElementTagNameMap[HTMLTagName] : Omit<HTMLElementTagNameMap[HTMLTagName], 'value'> & { value: Data },
    key: string,
  },
  'loadContent': CustomEvent & { detail: any },
  'ps-scroll-y': CustomEvent & { detail: any },
}

export type ElEvent<ElementName extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap, EventType extends keyof TagEventMap = keyof TagEventMap, Data = unknown> = TagEventMap<ElementName, Data>[EventType];
export type multiSelectString = classString | advSelectorString | htmlTags | `${htmlTags}${advSelectorString}` | `${htmlTags} ${htmlTags}`
