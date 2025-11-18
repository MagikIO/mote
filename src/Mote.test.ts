import { describe, it, expect, afterEach, vi, beforeAll } from 'vitest';
import { Mote } from './Mote';
import { ElementNotFoundError, InvalidSelectorError } from './errors';
import { cleanupTestElements, createTestElement } from './test-utils';

// Mock the animate API for jsdom
beforeAll(() => {
  HTMLElement.prototype.animate = vi.fn().mockImplementation(function(keyframes, options) {
    const animation = {
      finished: Promise.resolve(),
      cancel: vi.fn(),
      finish: vi.fn(),
      pause: vi.fn(),
      play: vi.fn(),
      reverse: vi.fn(),
      updatePlaybackRate: vi.fn(),
    };
    return animation as unknown as Animation;
  });
});

describe('Mote', () => {
  afterEach(() => {
    cleanupTestElements();
  });

  describe('Constructor', () => {
    it('should create element from tag name', () => {
      const mote = new Mote('div');
      expect(mote.self()).toBeInstanceOf(HTMLDivElement);
    });

    it('should create element with id using tagName#id syntax', () => {
      const mote = new Mote('div#myDiv');
      expect(mote.id()).toBe('myDiv');
    });

    it('should create different element types', () => {
      const div = new Mote('div');
      const span = new Mote('span');
      const button = new Mote('button');

      expect(div.self().tagName).toBe('DIV');
      expect(span.self().tagName).toBe('SPAN');
      expect(button.self().tagName).toBe('BUTTON');
    });

    it('should throw InvalidSelectorError when selector is not a string', () => {
      expect(() => new Mote(123 as any)).toThrow(InvalidSelectorError);
    });
  });

  describe('Append Methods', () => {
    it('should append to element by selector', () => {
      createTestElement('div', 'container');
      const mote = new Mote('div#child');
      mote.appendTo('#container');
      expect(document.querySelector('#container')?.querySelector('#child')).toBeTruthy();
    });

    it('should append to HTML element', () => {
      const container = createTestElement('div', 'container');
      const mote = new Mote('div#child');
      mote.appendTo(container);
      expect(container.querySelector('#child')).toBeTruthy();
    });

    it('should append to body', () => {
      const mote = new Mote('div#bodyChild');
      mote.appendToBody();
      expect(document.body.querySelector('#bodyChild')).toBeTruthy();
    });

    it('should append to head', () => {
      const mote = new Mote('script');
      mote.appendToHead();
      expect(document.head.querySelector('script')).toBeTruthy();
    });

    it('should append to document root', () => {
      const mote = new Mote('div#rootChild');
      mote.appendToRoot();
      expect(document.documentElement.querySelector('#rootChild')).toBeTruthy();
    });

    it('should throw ElementNotFoundError when target does not exist', () => {
      const mote = new Mote('div');
      expect(() => mote.appendTo('#nonexistent')).toThrow(ElementNotFoundError);
    });
  });

  describe('appendWithin', () => {
    it('should execute callback with element id', () => {
      const mote = new Mote('div#parent');
      mote.appendToBody();

      let callbackId: string | null = null;
      mote.appendWithin((id) => {
        callbackId = id;
      });

      expect(callbackId).toBe('#parent');
    });
  });

  describe('Inheritance from El', () => {
    it('should inherit all El methods', () => {
      createTestElement('div', 'container');
      const mote = new Mote('div#child')
        .addClass('test-class')
        .html('<p>Test</p>')
        .css('color', 'red')
        .appendTo('#container');

      expect(mote.hasClass('test-class')).toBe(true);
      expect(mote.self().innerHTML).toBe('<p>Test</p>');
      expect(mote.css('color')).toBe('rgb(255, 0, 0)');
    });

    it('should support method chaining', () => {
      createTestElement('div', 'container');
      const result = new Mote('div#test')
        .addClass('class1')
        .text('Hello')
        .css({ color: 'blue' })
        .appendTo('#container');

      expect(result).toBeInstanceOf(Mote);
      expect(result.hasClass('class1')).toBe(true);
      expect(result.self().textContent).toBe('Hello');
    });
  });

  describe('Element Creation Patterns', () => {
    it('should create nested elements', () => {
      createTestElement('div', 'app');
      const parent = new Mote('div#parent').appendTo('#app');

      new Mote('div#child1').appendTo('#parent');
      new Mote('div#child2').appendTo('#parent');

      expect(parent.self().children.length).toBe(2);
      expect(parent.self().querySelector('#child1')).toBeTruthy();
      expect(parent.self().querySelector('#child2')).toBeTruthy();
    });

    it('should create complex DOM structures', () => {
      createTestElement('div', 'app');

      const form = new Mote('form#loginForm')
        .appendTo('#app');

      new Mote('input#username')
        .set({ type: 'text', placeholder: 'Username' })
        .appendTo('#loginForm');

      new Mote('input#password')
        .set({ type: 'password', placeholder: 'Password' })
        .appendTo('#loginForm');

      new Mote('button#submit')
        .text('Login')
        .appendTo('#loginForm');

      expect(form.self().children.length).toBe(3);
      expect(document.querySelector('#username')).toBeTruthy();
      expect(document.querySelector('#password')).toBeTruthy();
      expect(document.querySelector('#submit')).toBeTruthy();
    });
  });
});
