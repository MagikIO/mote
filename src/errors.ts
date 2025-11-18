/**
 * Base error class for all Mote-related errors
 */
export class MoteError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'MoteError';
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    // @ts-expect-error -- Ignore captureStackTrace type issues
    if (Error.captureStackTrace) {
      // @ts-expect-error -- Ignore captureStackTrace type issues
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Thrown when an element cannot be found using the provided selector
 */
export class ElementNotFoundError extends MoteError {
  constructor(selector: string, suggestion?: string) {
    const message = suggestion
      ? `Element '${selector}' not found. Did you mean '${suggestion}'?`
      : `Element '${selector}' not found. Make sure the element exists in the DOM before trying to select it.`;
    super(message);
    this.name = 'ElementNotFoundError';
  }
}

/**
 * Thrown when an invalid selector is provided
 */
export class InvalidSelectorError extends MoteError {
  constructor(selector: unknown) {
    super(`Invalid selector provided: ${JSON.stringify(selector)}. Expected a string, HTML element, or function.`);
    this.name = 'InvalidSelectorError';
  }
}

/**
 * Thrown when a method is called on the wrong element type
 */
export class InvalidElementTypeError extends MoteError {
  constructor(method: string, expectedType: string, actualType: string, elementId?: string) {
    const idInfo = elementId ? ` (element id: '${elementId}')` : '';
    super(`Cannot call '${method}()' on '${actualType}' element${idInfo}. This method requires a '${expectedType}' element.`);
    this.name = 'InvalidElementTypeError';
  }
}

/**
 * Thrown when an element has no parent node but an operation requires one
 */
export class NoParentNodeError extends MoteError {
  constructor(operation: string, elementId?: string) {
    const idInfo = elementId ? ` (element id: '${elementId}')` : '';
    super(`Cannot ${operation}: element has no parent node${idInfo}. The element may have been removed from the DOM.`);
    this.name = 'NoParentNodeError';
  }
}

/**
 * Thrown when a function parameter doesn't return the expected value
 */
export class InvalidReturnValueError extends MoteError {
  constructor(expectedType: string) {
    super(`Function must return ${expectedType}`);
    this.name = 'InvalidReturnValueError';
  }
}
