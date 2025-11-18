/**
 * Test utilities for Mote library tests
 */

/**
 * Create a test element and append it to the document body
 * @param tagName - The tag name of the element to create
 * @param id - The id for the element
 * @param attributes - Additional attributes to set
 * @returns The created element
 */
export function createTestElement<T extends keyof HTMLElementTagNameMap>(
  tagName: T,
  id?: string,
  attributes?: Record<string, string>
): HTMLElementTagNameMap[T] {
  const element = document.createElement(tagName);

  if (id) {
    element.id = id;
  }

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  document.body.appendChild(element);
  return element;
}

/**
 * Clean up all test elements from the document body
 */
export function cleanupTestElements() {
  document.body.innerHTML = '';
}

/**
 * Wait for an animation to complete
 * @param duration - Duration in milliseconds
 * @returns Promise that resolves after the duration
 */
export function waitForAnimation(duration: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, duration + 50));
}

/**
 * Get computed style property value
 * @param element - The element to get the style from
 * @param property - The CSS property name
 * @returns The computed property value
 */
export function getComputedProperty(element: HTMLElement, property: string): string {
  return window.getComputedStyle(element).getPropertyValue(property);
}
