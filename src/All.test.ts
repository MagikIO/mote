import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { All } from './All';
import { createTestElement, cleanupTestElements } from './test-utils';

describe('All', () => {
  afterEach(() => {
    cleanupTestElements();
  });

  describe('Constructor', () => {
    it('should create instance from selector string', () => {
      createTestElement('div', 'div1', { class: 'test-class' });
      createTestElement('div', 'div2', { class: 'test-class' });
      const all = new All('.test-class');
      expect(all.self().length).toBe(2);
    });
  });

  describe('Iteration', () => {
    beforeEach(() => {
      createTestElement('div', 'div1', { class: 'test-class' });
      createTestElement('div', 'div2', { class: 'test-class' });
      createTestElement('div', 'div3', { class: 'test-class' });
    });

    it('should iterate over elements with each()', () => {
      const all = new All('.test-class');
      const ids: string[] = [];
      all.each((element) => {
        ids.push(element.id);
      });
      expect(ids).toEqual(['div1', 'div2', 'div3']);
    });

    it('should provide index in each() callback', () => {
      const all = new All('.test-class');
      const indices: number[] = [];
      all.each((_, index) => {
        indices.push(index);
      });
      expect(indices).toEqual([0, 1, 2]);
    });
  });

  describe('Class Management', () => {
    beforeEach(() => {
      createTestElement('div', 'div1', { class: 'test-class' });
      createTestElement('div', 'div2', { class: 'test-class' });
    });

    it('should add class to all elements', () => {
      const all = new All('.test-class');
      all.addClass('new-class');
      all.each((element) => {
        expect(element.classList.contains('new-class')).toBe(true);
      });
    });

    it('should remove class from all elements', () => {
      const all = new All('.test-class');
      all.removeClass('test-class');
      all.each((element) => {
        expect(element.classList.contains('test-class')).toBe(false);
      });
    });

    it('should toggle class on all elements', () => {
      const all = new All('.test-class');
      all.toggleClass('toggled');
      all.each((element) => {
        expect(element.classList.contains('toggled')).toBe(true);
      });
    });
  });

  describe('Content Manipulation', () => {
    beforeEach(() => {
      createTestElement('div', 'div1', { class: 'test-class' });
      createTestElement('div', 'div2', { class: 'test-class' });
    });

    it('should set HTML on all elements', () => {
      const all = new All('.test-class');
      all.html('<p>Test</p>');
      all.each((element) => {
        expect(element.innerHTML).toBe('<p>Test</p>');
      });
    });

    it('should set text on all elements', () => {
      const all = new All('.test-class');
      all.text('Hello');
      all.each((element) => {
        expect(element.textContent).toBe('Hello');
      });
    });

    it('should empty all elements', () => {
      const all = new All('.test-class');
      all.html('<p>Test</p>');
      all.empty();
      all.each((element) => {
        expect(element.innerHTML).toBe('');
      });
    });
  });

  describe('Attributes', () => {
    beforeEach(() => {
      createTestElement('div', 'div1', { class: 'test-class' });
      createTestElement('div', 'div2', { class: 'test-class' });
    });

    it('should set attributes on all elements', () => {
      const all = new All('.test-class');
      all.set({ 'data-test': 'value' });
      all.each((element) => {
        expect(element.getAttribute('data-test')).toBe('value');
      });
    });

    it('should unset attributes on all elements', () => {
      const all = new All('.test-class');
      all.set({ 'data-test': 'value' });
      all.unset(['data-test']);
      all.each((element) => {
        expect(element.hasAttribute('data-test')).toBe(false);
      });
    });

    it('should set attr on all elements', () => {
      const all = new All('.test-class');
      all.attr('title', 'Test Title');
      all.each((element) => {
        expect(element.getAttribute('title')).toBe('Test Title');
      });
    });

    it('should set data attribute on all elements', () => {
      const all = new All('.test-class');
      all.data('userId', '123');
      all.each((element) => {
        expect(element.dataset.userId).toBe('123');
      });
    });
  });

  describe('Form Elements', () => {
    beforeEach(() => {
      createTestElement('input', 'input1', { class: 'test-input' });
      createTestElement('input', 'input2', { class: 'test-input' });
    });

    it('should set value on all inputs', () => {
      const all = new All<'input'>('.test-input');
      all.val('test value');
      all.each((element) => {
        expect((element as HTMLInputElement).value).toBe('test value');
      });
    });

    it('should set type on all inputs', () => {
      const all = new All<'input'>('.test-input');
      all.type('email');
      all.each((element) => {
        expect((element as HTMLInputElement).type).toBe('email');
      });
    });

    it('should set name on all inputs', () => {
      const all = new All<'input'>('.test-input');
      all.name('fieldName');
      all.each((element) => {
        expect((element as HTMLInputElement).name).toBe('fieldName');
      });
    });
  });

  describe('DOM Operations', () => {
    beforeEach(() => {
      createTestElement('div', 'div1', { class: 'test-class' });
      createTestElement('div', 'div2', { class: 'test-class' });
    });

    it('should remove all elements', () => {
      const all = new All('.test-class');
      all.remove();
      expect(document.querySelectorAll('.test-class').length).toBe(0);
    });

    it('should wrap all elements', () => {
      const all = new All('.test-class');
      all.wrap('wrapper');
      const elements = document.querySelectorAll('.test-class');
      elements.forEach((element) => {
        expect(element.parentElement?.classList.contains('wrapper')).toBe(true);
      });
    });
  });

  describe('Event Handling', () => {
    beforeEach(() => {
      createTestElement('button', 'btn1', { class: 'test-btn' });
      createTestElement('button', 'btn2', { class: 'test-btn' });
    });

    it('should add event listener to all elements', () => {
      const all = new All('.test-btn');
      let clickCount = 0;
      all.on('click', () => {
        clickCount++;
      });
      document.querySelectorAll('.test-btn').forEach((btn) => {
        (btn as HTMLButtonElement).click();
      });
      expect(clickCount).toBe(2);
    });

    it('should dispatch custom event on all elements', () => {
      const all = new All('.test-btn');
      let eventCount = 0;
      // @ts-expect-error -> Testing custom event
      all.on('custom', () => {
        eventCount++;
      });
      all.now('custom', {});
      expect(eventCount).toBe(2);
    });
  });

  describe('CSS Manipulation', () => {
    beforeEach(() => {
      createTestElement('div', 'div1', { class: 'test-class' });
      createTestElement('div', 'div2', { class: 'test-class' });
    });

    it('should set single CSS property on all elements', () => {
      const all = new All('.test-class');
      all.css('color', 'red');
      all.each((element) => {
        expect((element as HTMLElement).style.color).toBe('red');
      });
    });

    it('should set multiple CSS properties on all elements', () => {
      const all = new All('.test-class');
      all.css({ color: 'red', 'font-size': '16px' });
      all.each((element) => {
        expect((element as HTMLElement).style.color).toBe('red');
        expect((element as HTMLElement).style.fontSize).toBe('16px');
      });
    });
  });

  describe('Visibility', () => {
    beforeEach(() => {
      createTestElement('div', 'div1', { class: 'test-class' });
      createTestElement('div', 'div2', { class: 'test-class' });
    });

    it('should hide all elements', () => {
      const all = new All('.test-class');
      all.hide();
      all.each((element) => {
        expect((element as HTMLElement).style.display).toBe('none');
      });
    });

    it('should show all elements', () => {
      const all = new All('.test-class');
      all.hide();
      all.show();
      all.each((element) => {
        expect((element as HTMLElement).style.display).toBe('');
      });
    });

    it('should toggle visibility of all elements', () => {
      const all = new All('.test-class');
      all.toggle();
      all.each((element) => {
        expect((element as HTMLElement).style.display).toBe('none');
      });
    });
  });

  describe('Dimensions', () => {
    beforeEach(() => {
      createTestElement('div', 'div1', { class: 'test-class' });
      createTestElement('div', 'div2', { class: 'test-class' });
    });

    it('should set width on all elements', () => {
      const all = new All('.test-class');
      all.width(100);
      all.each((element) => {
        expect((element as HTMLElement).style.width).toBe('100px');
      });
    });

    it('should set height on all elements', () => {
      const all = new All('.test-class');
      all.height(200);
      all.each((element) => {
        expect((element as HTMLElement).style.height).toBe('200px');
      });
    });
  });

  describe('Animations', () => {
    beforeEach(() => {
      createTestElement('div', 'div1', { class: 'test-class' });
      createTestElement('div', 'div2', { class: 'test-class' });
    });

    it('should fade in all elements', async () => {
      const all = new All('.test-class');
      all.hide();
      await all.fadeIn(100);
      all.each((element) => {
        expect((element as HTMLElement).style.display).toBe('');
      });
    });

    it('should fade out all elements', async () => {
      const all = new All('.test-class');
      await all.fadeOut(100);
      all.each((element) => {
        expect((element as HTMLElement).style.display).toBe('none');
      });
    });
  });

  describe('Chaining', () => {
    it('should support method chaining', () => {
      createTestElement('div', 'div1', { class: 'test-class' });
      createTestElement('div', 'div2', { class: 'test-class' });
      const result = new All('.test-class')
        .addClass('new-class')
        .html('<p>Test</p>')
        .css('color', 'red')
        .show();
      expect(result).toBeInstanceOf(All);
    });
  });
});
