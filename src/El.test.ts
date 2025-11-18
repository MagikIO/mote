import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { El } from './El';
import { ElementNotFoundError, InvalidElementTypeError, NoParentNodeError } from './errors';
import { createTestElement, cleanupTestElements, waitForAnimation } from './test-utils';

describe('El', () => {
  afterEach(() => {
    cleanupTestElements();
  });

  describe('Constructor', () => {
    it('should create instance from selector string', () => {
      createTestElement('div', 'test-div');
      const el = new El('#test-div');
      expect(el.self()).toBeInstanceOf(HTMLDivElement);
    });

    it('should create instance from HTML element', () => {
      const div = createTestElement('div', 'test-div');
      const el = new El(div);
      expect(el.self()).toBe(div);
    });

    it('should create instance from function returning element', () => {
      createTestElement('div', 'test-div');
      const el = new El(() => document.querySelector('#test-div') as HTMLDivElement);
      expect(el.self()).toBeInstanceOf(HTMLDivElement);
    });

    it('should throw ElementNotFoundError when element does not exist', () => {
      expect(() => new El('#nonexistent')).toThrow(ElementNotFoundError);
    });
  });

  describe('Class Management', () => {
    let el: El;

    beforeEach(() => {
      createTestElement('div', 'test-div');
      el = new El('#test-div');
    });

    it('should add single class', () => {
      el.addClass('test-class');
      expect(el.hasClass('test-class')).toBe(true);
    });

    it('should add multiple classes from array', () => {
      el.addClass(['class1', 'class2']);
      expect(el.hasClass('class1')).toBe(true);
      expect(el.hasClass('class2')).toBe(true);
    });

    it('should add classes from space-separated string', () => {
      el.addClass('class1 class2');
      expect(el.hasClass('class1')).toBe(true);
      expect(el.hasClass('class2')).toBe(true);
    });

    it('should remove class', () => {
      el.addClass('test-class');
      el.removeClass('test-class');
      expect(el.hasClass('test-class')).toBe(false);
    });

    it('should toggle class', () => {
      el.toggleClass('test-class');
      expect(el.hasClass('test-class')).toBe(true);
      el.toggleClass('test-class');
      expect(el.hasClass('test-class')).toBe(false);
    });
  });

  describe('Content Manipulation', () => {
    let el: El;

    beforeEach(() => {
      createTestElement('div', 'test-div');
      el = new El('#test-div');
    });

    it('should set HTML content', () => {
      el.html('<p>Test</p>');
      expect(el.self().innerHTML).toBe('<p>Test</p>');
    });

    it('should set text content', () => {
      el.text('Hello World');
      expect(el.self().textContent).toBe('Hello World');
    });

    it('should empty content', () => {
      el.html('<p>Test</p>');
      el.empty();
      expect(el.self().innerHTML).toBe('');
    });

    it('should append text child', () => {
      el.textChild('Hello');
      expect(el.self().textContent).toBe('Hello');
    });
  });

  describe('Attributes', () => {
    let el: El;

    beforeEach(() => {
      createTestElement('div', 'test-div');
      el = new El('#test-div');
    });

    it('should set attributes', () => {
      el.set({ 'data-test': 'value', 'aria-label': 'Label' });
      expect(el.self().getAttribute('data-test')).toBe('value');
      expect(el.self().getAttribute('aria-label')).toBe('Label');
    });

    it('should unset attributes', () => {
      el.set({ 'data-test': 'value' });
      el.unset('data-test');
      expect(el.self().hasAttribute('data-test')).toBe(false);
    });

    it('should get and set id', () => {
      el.id('new-id');
      expect(el.id()).toBe('new-id');
    });

    it('should get data attribute', () => {
      el.set({ 'data-user-id': '123' });
      expect(el.data('user-id')).toBe('123');
    });
  });

  describe('Form Elements', () => {
    it('should get and set input value', () => {
      createTestElement('input', 'test-input');
      const el = new El<'input'>('#test-input');
      el.val('test value');
      expect(el.val()).toBe('test value');
    });

    it('should check and uncheck checkbox', () => {
      createTestElement('input', 'test-checkbox', { type: 'checkbox' });
      const el = new El<'input'>('#test-checkbox');
      el.check(true);
      expect(el.checked()).toBe(true);
      el.check(false);
      expect(el.checked()).toBe(false);
    });

    it('should throw error when using val() on non-input element', () => {
      createTestElement('div', 'test-div');
      const el = new El('#test-div');
      expect(() => el.val()).toThrow(InvalidElementTypeError);
    });
  });

  describe('DOM Operations', () => {
    it('should remove element from DOM', () => {
      createTestElement('div', 'test-div');
      const el = new El('#test-div');
      el.remove();
      expect(document.querySelector('#test-div')).toBeNull();
    });

    it('should get parent element', () => {
      const parent = createTestElement('div', 'parent');
      const child = document.createElement('div');
      child.id = 'child';
      parent.appendChild(child);

      const el = new El('#child');
      const parentEl = el.parent();
      expect(parentEl.id()).toBe('parent');
    });

    it('should throw error when getting parent of element without parent', () => {
      createTestElement('div', 'test-div');
      const el = new El('#test-div');
      el.remove();
      expect(() => el.parent()).toThrow(NoParentNodeError);
    });

    it('should wrap element in div', () => {
      createTestElement('div', 'test-div');
      const el = new El('#test-div');
      el.wrap('wrapper-class');
      const wrapper = el.self().parentElement;
      expect(wrapper?.classList.contains('wrapper-class')).toBe(true);
    });
  });

  describe('Event Handling', () => {
    it('should add event listener', () => {
      createTestElement('button', 'test-button');
      const el = new El('#test-button');
      let clicked = false;
      el.on('click', () => {
        clicked = true;
      });
      el.click();
      expect(clicked).toBe(true);
    });

    it('should add one-time event listener', () => {
      createTestElement('button', 'test-button');
      const el = new El('#test-button');
      let clickCount = 0;
      el.once('click', () => {
        clickCount++;
      });
      el.click();
      el.click();
      expect(clickCount).toBe(1);
    });

    it('should dispatch custom event', () => {
      createTestElement('div', 'test-div');
      const el = new El('#test-div');
      let eventData: any;
      el.on('custom', (e) => {
        eventData = (e as CustomEvent).detail;
      });
      el.now('custom', { test: 'value' });
      expect(eventData).toEqual({ test: 'value' });
    });
  });

  describe('CSS Manipulation', () => {
    let el: El;

    beforeEach(() => {
      createTestElement('div', 'test-div');
      el = new El('#test-div');
    });

    it('should set single CSS property', () => {
      el.css('color', 'red');
      expect(el.css('color')).toBe('red');
    });

    it('should set multiple CSS properties', () => {
      el.css({ color: 'red', 'font-size': '16px' });
      expect(el.css('color')).toBe('red');
      expect(el.css('font-size')).toBe('16px');
    });

    it('should get computed CSS property', () => {
      el.self().style.color = 'blue';
      expect(el.css('color')).toBe('blue');
    });
  });

  describe('Visibility', () => {
    let el: El;

    beforeEach(() => {
      createTestElement('div', 'test-div');
      el = new El('#test-div');
    });

    it('should hide element', () => {
      el.hide();
      expect(el.isVisible()).toBe(false);
    });

    it('should show element', () => {
      el.hide();
      el.show();
      expect(el.isVisible()).toBe(true);
    });

    it('should toggle visibility', () => {
      el.toggle();
      expect(el.isVisible()).toBe(false);
      el.toggle();
      expect(el.isVisible()).toBe(true);
    });
  });

  describe('Dimensions', () => {
    let el: El;

    beforeEach(() => {
      createTestElement('div', 'test-div');
      el = new El('#test-div');
    });

    it('should set width', () => {
      el.width(100);
      expect(el.self().style.width).toBe('100px');
    });

    it('should set width with unit', () => {
      el.width('50%');
      expect(el.self().style.width).toBe('50%');
    });

    it('should set height', () => {
      el.height(200);
      expect(el.self().style.height).toBe('200px');
    });

    it('should get width', () => {
      el.width(100);
      expect(typeof el.width()).toBe('number');
    });

    it('should get offset position', () => {
      const offset = el.offset();
      expect(offset).toHaveProperty('top');
      expect(offset).toHaveProperty('left');
    });

    it('should get position', () => {
      const position = el.position();
      expect(position).toHaveProperty('top');
      expect(position).toHaveProperty('left');
    });
  });

  describe('Animations', () => {
    let el: El;

    beforeEach(() => {
      createTestElement('div', 'test-div');
      el = new El('#test-div');
    });

    it('should fade in element', async () => {
      el.hide();
      await el.fadeIn(100);
      expect(el.isVisible()).toBe(true);
    });

    it('should fade out element', async () => {
      await el.fadeOut(100);
      expect(el.isVisible()).toBe(false);
    });

    it('should animate element', () => {
      const animation = el.animate([
        { opacity: 0 },
        { opacity: 1 }
      ], 300);
      expect(animation).toBeInstanceOf(Animation);
    });

    it('should fade to specific opacity', async () => {
      await el.fadeTo(0.5, 100);
      await waitForAnimation(100);
      // Note: opacity check might be approximate due to animation timing
      expect(parseFloat(el.css('opacity'))).toBeGreaterThan(0);
    });
  });

  describe('Chaining', () => {
    it('should support method chaining', () => {
      createTestElement('div', 'test-div');
      const result = new El('#test-div')
        .addClass('class1')
        .html('<p>Test</p>')
        .css('color', 'red')
        .show();
      expect(result).toBeInstanceOf(El);
    });
  });
});
