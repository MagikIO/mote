# Mote

> So mote it be

A lightweight, TypeScript-first DOM manipulation library that provides a jQuery-like API for modern web applications. The name "mote" refers to small, self-contained, reusable pieces of code that can be composed to build larger applications.

[![Version](https://img.shields.io/npm/v/@magik_io/mote.svg)](https://www.npmjs.com/package/@magik_io/mote)
[![License](https://img.shields.io/npm/l/@magik_io/mote.svg)](https://github.com/MagikIO/mote/blob/main/LICENSE)

## Features

- **TypeScript-First**: Fully typed with generic support and strict mode options
- **Fluent API**: Chainable methods for expressive, readable code
- **Lightweight**: Zero dependencies, small footprint
- **Modern**: Built for ES6+ environments
- **Type-Safe Events**: Custom event typing with `TagEventMap`
- **Multiple Export Formats**: ESM, CommonJS, and TypeScript declarations
- **jQuery-like**: Familiar API for developers who know jQuery

## Installation

```bash
npm install @magik_io/mote
```

```bash
pnpm add @magik_io/mote
```

```bash
yarn add @magik_io/mote
```

## Quick Start

```typescript
import { Mote, El, All } from '@magik_io/mote';

// Create and append a new element
new Mote('div#container')
  .addClass('wrapper')
  .text('Hello World')
  .on('click', (e) => console.log(e))
  .appendTo('#app');

// Manipulate an existing element
new El('#myElement')
  .addClass('active')
  .html('<p>Updated content</p>')
  .on('click', () => console.log('Clicked!'));

// Work with multiple elements
new All('.items')
  .addClass('highlighted')
  .on('click', (e) => console.log('Item clicked:', e));
```

## Table of Contents

- [Core Classes](#core-classes)
  - [Mote - Element Creation](#mote---element-creation)
  - [El - Single Element Manipulation](#el---single-element-manipulation)
  - [All - Multiple Element Manipulation](#all---multiple-element-manipulation)
- [API Reference](#api-reference)
  - [Mote API](#mote-api)
  - [El API](#el-api)
  - [All API](#all-api)
- [Examples](#examples)
- [TypeScript Support](#typescript-support)
- [Contributing](#contributing)
- [License](#license)

## Core Classes

### Mote - Element Creation

The `Mote` class extends `El` and is used for creating new DOM elements and appending them to the document.

```typescript
import { Mote, mote } from '@magik_io/mote';

// Create element with id using tagName#id syntax
const container = new Mote('div#myContainer')
  .addClass('container')
  .appendTo('#app');

// Using factory function
mote('button#submitBtn', '#form', (id) => {
  // Nested creation with access to parent ID
  mote('span', id).text('Submit');
});
```

### El - Single Element Manipulation

The `El` class is for manipulating existing DOM elements.

```typescript
import { El, el } from '@magik_io/mote';

// Select and manipulate an element
const input = new El('#username')
  .addClass('form-control')
  .set({ placeholder: 'Enter username' })
  .on('input', (e) => console.log(e.target.value));

// Using factory function
el<'input'>('#email').val('user@example.com');
```

### All - Multiple Element Manipulation

The `All` class allows you to manipulate multiple elements at once.

```typescript
import { All, all } from '@magik_io/mote';

// Select and manipulate multiple elements
new All<'button'>('.btn')
  .addClass('btn-primary')
  .on('click', (e) => console.log('Button clicked'));

// Iterate over elements
all('.items').each((element, index) => {
  console.log(`Item ${index}:`, element);
});
```

## API Reference

### Mote API

#### Constructor

```typescript
new Mote<ElementName>(tagName: ElementName)
```

Creates a new element. Supports `tagName#id` syntax.

**Examples:**
```typescript
new Mote('div')                    // Creates a div
new Mote('div#container')          // Creates a div with id="container"
new Mote('button#submitBtn')       // Creates a button with id="submitBtn"
```

#### Append Methods

- **`appendTo(selector)`** - Append element to specified target
  ```typescript
  new Mote('div').appendTo('#app');
  new Mote('span').appendTo(document.body);
  ```

- **`appendToBody()`** - Append element to document.body
  ```typescript
  new Mote('div#modal').appendToBody();
  ```

- **`appendToHead()`** - Append element to document.head
  ```typescript
  new Mote('script').appendToHead();
  ```

- **`appendToRoot()`** - Append element to document.documentElement
  ```typescript
  new Mote('div').appendToRoot();
  ```

- **`appendWithin(callback)`** - Execute callback with element's ID
  ```typescript
  new Mote('div#parent').appendWithin((id) => {
    new Mote('span').text('Child').appendTo(id);
  });
  ```

#### Factory Function

```typescript
mote<ElementName>(tagName, appendTo, callback?)
```

**Example:**
```typescript
mote('div#container', '#app', (id) => {
  mote('h1', id).text('Title');
  mote('p', id).text('Content');
});
```

### El API

#### Constructor

```typescript
new El<ElementName, StrictTypes>(selector)
```

Accepts:
- CSS selector string
- HTML element
- Function returning element or selector

**Examples:**
```typescript
new El('#myElement')
new El(document.getElementById('myElement'))
new El(() => document.querySelector('.active'))
```

#### Selection & Navigation

- **`self()`** - Get the underlying HTML element
  ```typescript
  const element = new El('#myDiv').self();
  ```

- **`parent()`** - Get parent element
  ```typescript
  new El('#child').parent().addClass('parent-class');
  ```

- **`firstChild<E>()`** - Get first child element
  ```typescript
  const first = new El('#parent').firstChild<HTMLDivElement>();
  ```

- **`children()`** - Get all child nodes
  ```typescript
  const nodes = new El('#parent').children();
  ```

- **`find(selector)`** - Find elements within current element
  ```typescript
  const buttons = new El('#form').find('button');
  ```

#### Class Management

- **`addClass(className)`** - Add class(es)
  ```typescript
  el.addClass('active');
  el.addClass(['active', 'highlight']);
  el.addClass(() => 'dynamic-class');
  ```

- **`removeClass(className)`** - Remove class(es)
  ```typescript
  el.removeClass('active');
  el.removeClass(['active', 'highlight']);
  ```

- **`toggleClass(className)`** - Toggle class(es)
  ```typescript
  el.toggleClass('active');
  el.toggleClass(['active', 'visible']);
  ```

- **`hasClass(className)`** - Check if element has class
  ```typescript
  if (el.hasClass('active')) { /* ... */ }
  ```

#### Content Manipulation

- **`html(content)`** - Set inner HTML
  ```typescript
  el.html('<p>Hello World</p>');
  ```

- **`text(content)`** - Set text content
  ```typescript
  el.text('Hello World');
  el.text(123);
  el.text(true);
  ```

- **`textContent(content?)`** - Get or set text content
  ```typescript
  const text = el.textContent();
  el.textContent('New text');
  ```

- **`textChild(text)`** - Append text node as child
  ```typescript
  el.textChild('Additional text');
  ```

- **`empty()`** - Empty inner HTML
  ```typescript
  el.empty();
  ```

- **`clear()`** - Clear inner HTML (alias for empty)
  ```typescript
  el.clear();
  ```

#### Attributes

- **`set(attributes)`** - Set attributes
  ```typescript
  el.set({
    id: 'myId',
    'data-value': '123',
    disabled: true
  });
  ```

- **`unset(attributes)`** - Remove attributes
  ```typescript
  el.unset(['disabled', 'readonly']);
  el.unset('disabled');
  ```

- **`id(value?)`** - Get or set id
  ```typescript
  const id = el.id();
  el.id('newId');
  ```

- **`data(suffix)`** - Get data attribute
  ```typescript
  const value = el.data('user-id'); // Gets data-user-id
  ```

- **`dataset()`** - Get dataset object
  ```typescript
  const dataset = el.dataset();
  console.log(dataset.userId);
  ```

#### Form Elements

- **`val(value?)`** - Get or set value
  ```typescript
  const value = el.val();
  el.val('new value');
  el.val(123);
  ```

- **`check(boolean)`** - Check or uncheck input
  ```typescript
  el.check(true);
  el.check(false);
  ```

- **`checked()`** - Get checked state
  ```typescript
  if (el.checked()) { /* ... */ }
  ```

- **`type(type)`** - Set input type
  ```typescript
  el.type('password');
  ```

- **`name(name)`** - Set name attribute
  ```typescript
  el.name('username');
  ```

- **`input(type)`** - Set name to id and type
  ```typescript
  el.input('email'); // Sets name=id and type=email
  ```

- **`htmlFor(elementId)`** - Set label's for attribute
  ```typescript
  new El('label').htmlFor('myInput');
  ```

#### Images

- **`src(url)`** - Set image source
  ```typescript
  new El<'img'>('#myImage').src('/images/photo.jpg');
  ```

- **`alt(text)`** - Set image alt text
  ```typescript
  new El<'img'>('#myImage').alt('Photo description');
  ```

#### DOM Operations

- **`child(child, position?)`** - Append or prepend child
  ```typescript
  el.child('<span>Text</span>');
  el.child(document.createElement('div'), 'prepend');
  el.child('<p>First</p>', 'prepend');
  ```

- **`wrap(className)`** - Wrap element in div
  ```typescript
  el.wrap('wrapper');
  ```

- **`remove()`** - Remove element from DOM
  ```typescript
  el.remove();
  ```

- **`replaceWith(html)`** - Replace with HTML string
  ```typescript
  el.replaceWith('<div>New content</div>');
  ```

- **`replaceWithElement(tagName, id?)`** - Replace with new element
  ```typescript
  const newEl = el.replaceWithElement('div', 'newId');
  ```

#### Event Handling

- **`on(event, listener, options?)`** - Add event listener
  ```typescript
  el.on('click', (e) => console.log(e));
  el.on<{ userId: string }>('custom', (e) => {
    console.log(e.detail.userId);
  });
  ```

- **`once(event, listener)`** - Add one-time event listener
  ```typescript
  el.once('click', (e) => console.log('Clicked once'));
  ```

- **`off(event, listener, options?)`** - Remove event listener
  ```typescript
  el.off('click', myHandler);
  ```

- **`trigger(event, options?)`** - Trigger custom event
  ```typescript
  el.trigger('change');
  el.trigger('custom', { detail: { data: 'value' } });
  ```

- **`now(eventName, detail)`** - Dispatch custom event
  ```typescript
  el.now('dataUpdated', { userId: '123' });
  ```

- **`click()`** - Dispatch click event
  ```typescript
  el.click();
  ```

- **`triggerChange()`** - Trigger change event (select elements)
  ```typescript
  new El<'select'>('#mySelect').triggerChange();
  ```

- **`dispatchEvent(eventName)`** - Dispatch event
  ```typescript
  el.dispatchEvent('input');
  ```

#### Utilities

- **`if(expression)`** - Conditional chaining
  ```typescript
  el.if(condition)?.addClass('active');
  ```

- **`nestFrom(callback)`** - Execute callback with element id
  ```typescript
  el.nestFrom((id) => {
    new Mote('span').text('Child').appendTo(id);
  });
  ```

#### Factory Function

```typescript
el<ElementName, StrictTypes>(selector)
```

**Example:**
```typescript
const myEl = el<'div'>('#container');
```

### All API

#### Constructor

```typescript
new All<ElementType>(selector)
```

**Example:**
```typescript
new All<'button'>('.btn');
```

#### Iteration

- **`each(callback)`** - Iterate over elements
  ```typescript
  new All('.items').each((element, index) => {
    console.log(`Item ${index}:`, element.textContent);
  });
  ```

- **`log(treeView?)`** - Debug log elements
  ```typescript
  new All('.items').log();
  new All('.items').log(true); // Tree view
  ```

- **`self()`** - Get NodeList of elements
  ```typescript
  const elements = new All('.items').self();
  ```

#### Class Management

- **`addClass(className)`** - Add class to all elements
  ```typescript
  new All('.items').addClass('active');
  new All('.items').addClass(['active', 'highlight']);
  ```

- **`removeClass(className)`** - Remove class from all elements
  ```typescript
  new All('.items').removeClass('active');
  ```

- **`toggleClass(className)`** - Toggle class on all elements
  ```typescript
  new All('.items').toggleClass('visible');
  ```

#### Content & Attributes

- **`html(content)`** - Set inner HTML for all elements
  ```typescript
  new All('.items').html('<p>Same content</p>');
  ```

- **`text(content)`** - Set text content for all elements
  ```typescript
  new All('.items').text('Same text');
  ```

- **`textChild(text)`** - Append text node to all elements
  ```typescript
  new All('.items').textChild(' - updated');
  ```

- **`empty()`** / **`clear()`** - Empty all elements
  ```typescript
  new All('.items').empty();
  ```

- **`set(attributes)`** - Set attributes on all elements
  ```typescript
  new All('.items').set({ 'data-active': 'true' });
  ```

- **`unset(attributes)`** - Remove attributes from all elements
  ```typescript
  new All('.items').unset(['disabled', 'readonly']);
  ```

- **`attr(attribute, value)`** - Set attribute on all elements
  ```typescript
  new All('.items').attr('data-value', '123');
  ```

- **`data(name, value)`** - Set data attribute on all elements
  ```typescript
  new All('.items').data('userId', '123');
  ```

#### Form Elements

- **`val(value?)`** - Set value on all elements
  ```typescript
  new All<'input'>('.inputs').val('same value');
  ```

- **`type(type)`** - Set type on all elements
  ```typescript
  new All<'input'>('.inputs').type('text');
  ```

- **`name(name)`** - Set name on all elements
  ```typescript
  new All<'input'>('.inputs').name('fieldName');
  ```

- **`input(type)`** - Set name to id and type on all elements
  ```typescript
  new All<'input'>('.inputs').input('email');
  ```

- **`htmlFor(elementId)`** - Set htmlFor on all label elements
  ```typescript
  new All<'label'>('.labels').htmlFor('targetInput');
  ```

#### DOM Operations

- **`child(element, position?)`** - Append/prepend child to all elements
  ```typescript
  const span = document.createElement('span');
  new All('.items').child(span);
  new All('.items').child(span, 'prepend');
  ```

- **`wrap(className)`** - Wrap all elements in div
  ```typescript
  new All('.items').wrap('item-wrapper');
  ```

- **`remove()`** - Remove all elements from DOM
  ```typescript
  new All('.items').remove();
  ```

- **`replaceWith(html)`** - Replace all elements with HTML
  ```typescript
  new All('.items').replaceWith('<div>Replacement</div>');
  ```

- **`src(url)`** - Set src on all elements
  ```typescript
  new All<'img'>('.images').src('/images/placeholder.jpg');
  ```

#### Events

- **`on(event, listener, options?)`** - Add event listener to all elements
  ```typescript
  new All('.btns').on('click', (e) => console.log('Clicked'));
  ```

- **`once(event, listener, options?)`** - Add one-time listener to all elements
  ```typescript
  new All('.btns').once('click', (e) => console.log('First click'));
  ```

- **`off(event, listener)`** - Remove event listener from all elements
  ```typescript
  new All('.btns').off('click', myHandler);
  ```

- **`now(eventName, detail)`** - Dispatch custom event on all elements
  ```typescript
  new All('.items').now('refresh', { timestamp: Date.now() });
  ```

- **`click()`** - Dispatch click event on all elements
  ```typescript
  new All('.btns').click();
  ```

#### Factory Function

```typescript
all<ElementType>(selector)
```

**Example:**
```typescript
const buttons = all<'button'>('.btn');
```

## Examples

### Creating a Form

```typescript
import { mote } from '@magik_io/mote';

mote('form#loginForm', '#app', (formId) => {
  // Username field
  mote('div.form-group', formId, (groupId) => {
    mote('label', groupId).text('Username').htmlFor('username');
    mote('input#username', groupId)
      .addClass('form-control')
      .set({ type: 'text', placeholder: 'Enter username' });
  });

  // Password field
  mote('div.form-group', formId, (groupId) => {
    mote('label', groupId).text('Password').htmlFor('password');
    mote('input#password', groupId)
      .addClass('form-control')
      .set({ type: 'password', placeholder: 'Enter password' });
  });

  // Submit button
  mote('button#submitBtn', formId)
    .addClass('btn btn-primary')
    .text('Login')
    .on('click', async (e) => {
      e.preventDefault();
      const username = el<'input'>('#username').val();
      const password = el<'input'>('#password').val();
      console.log({ username, password });
    });
});
```

### Dynamic List

```typescript
import { Mote, All } from '@magik_io/mote';

const items = ['Apple', 'Banana', 'Cherry', 'Date'];

const list = new Mote('ul#fruitList')
  .addClass('list-unstyled')
  .appendTo('#app');

items.forEach((fruit, index) => {
  new Mote('li')
    .addClass('list-item')
    .text(fruit)
    .set({ 'data-index': index.toString() })
    .on('click', (e) => {
      new All('.list-item').removeClass('active');
      e.currentTarget.classList.add('active');
    })
    .appendTo('#fruitList');
});
```

### Modal Dialog

```typescript
import { Mote } from '@magik_io/mote';

function createModal(title: string, content: string) {
  const modal = new Mote('div#modal')
    .addClass('modal')
    .appendToBody();

  mote('div.modal-content', '#modal', (contentId) => {
    mote('div.modal-header', contentId, (headerId) => {
      mote('h2', headerId).text(title);
      mote('button.close', headerId)
        .text('×')
        .on('click', () => modal.remove());
    });

    mote('div.modal-body', contentId)
      .html(content);

    mote('div.modal-footer', contentId, (footerId) => {
      mote('button', footerId)
        .addClass('btn-primary')
        .text('Close')
        .on('click', () => modal.remove());
    });
  });

  return modal;
}

// Usage
createModal('Welcome', '<p>Welcome to our application!</p>');
```

### Event Delegation

```typescript
import { El, Mote } from '@magik_io/mote';

const container = new Mote('div#container')
  .appendToBody();

// Add event listener to container
new El('#container').on('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains('item')) {
    console.log('Item clicked:', target.textContent);
  }
});

// Dynamically add items
for (let i = 0; i < 10; i++) {
  new Mote('div')
    .addClass('item')
    .text(`Item ${i}`)
    .appendTo('#container');
}
```

### TypeScript Generic Types

```typescript
import { El, Mote } from '@magik_io/mote';

// Specify element type for better type safety
const input = new El<'input'>('#username');
const value = input.val(); // TypeScript knows this returns string

// Strict mode for type-safe event handlers
const button = new El<'button', true>('#submitBtn');
button.on('click', (e) => {
  // e is typed as MouseEvent specifically for button elements
  console.log(e.currentTarget.type);
});

// Create typed elements
const image = new Mote<'img'>('img#logo')
  .src('/logo.png')
  .alt('Company Logo')
  .appendTo('#header');

// Custom event data
interface UserData {
  userId: string;
  username: string;
}

new El('#userProfile').on<UserData>('userUpdated', (e) => {
  console.log(e.detail.userId, e.detail.username);
});
```

## TypeScript Support

Mote is built with TypeScript and provides comprehensive type definitions.

### Generic Parameters

```typescript
El<ElementName, StrictTypes>
Mote<ElementName, StrictMode>
All<ElementType>
```

### Type Definitions

The library exports several useful types:

```typescript
import type {
  htmlTags,           // Union of all HTML tag names
  htmlElements,       // Union of all HTML element types
  selectorString,     // CSS selector string
  idString,           // ID selector (#id)
  classString,        // Class selector (.class)
  GenericEvent,       // Generic event type with custom data
  TagEventMap,        // Event map for specific element types
} from '@magik_io/mote/types';
```

### Custom Elements

Extend Mote to support custom HTML elements:

```typescript
// In your types file
declare module '@magik_io/mote' {
  interface CustomHTMLElements {
    'my-component': HTMLElement;
    'custom-button': HTMLButtonElement;
  }
}

// Usage
new Mote<'my-component'>('my-component').appendTo('#app');
```

### Strict Type Mode

Enable strict typing for more precise type checking:

```typescript
// Without strict mode (default)
const el = new El<'button'>('#myBtn');
el.on('click', (e) => {
  // e is GenericEvent
});

// With strict mode
const strictEl = new El<'button', true>('#myBtn');
strictEl.on('click', (e) => {
  // e is MouseEvent from TagEventMap
  console.log(e.button); // Typed correctly
});
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run linter
pnpm lint

# Run tests
pnpm test

# Build library
pnpm build
```

## License

MIT © [Antonio B.](https://github.com/Abourass)

## Links

- [NPM Package](https://www.npmjs.com/package/@magik_io/mote)
- [GitHub Repository](https://github.com/MagikIO/mote)
- [Issue Tracker](https://github.com/MagikIO/mote/issues)

---

**So mote it be** ✨
