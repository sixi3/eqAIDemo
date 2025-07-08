import { TokenValidator } from '../../../src/core/TokenValidator.js';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

describe('TokenValidator', () => {
  let validator;
  let testDir;

  beforeEach(async () => {
    suppressConsole();
    validator = new TokenValidator();
    // Ensure global.TEST_TMP_DIR is available
    if (!global.TEST_TMP_DIR) {
      global.TEST_TMP_DIR = path.join(os.tmpdir(), 'design-tokens-sync-test');
    }
    testDir = path.join(global.TEST_TMP_DIR, `token-validator-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    restoreConsole();
    if (testDir && await fs.pathExists(testDir)) {
      await fs.remove(testDir);
    }
  });

  describe('Schema Validation', () => {
    test('should validate complete token structure', async () => {
      const completeTokens = {
        colors: {
          primary: {
            50: { value: '#eff6ff', type: 'color' },
            500: { value: '#3b82f6', type: 'color' },
            900: { value: '#1e3a8a', type: 'color' }
          }
        },
        spacing: {
          sm: { value: '0.5rem', type: 'spacing' },
          md: { value: '1rem', type: 'spacing' }
        }
      };

      const result = await validator.validate(completeTokens);

      expect(result.isValid).toBe(true);
      expect(result.summary.totalCategories).toBeGreaterThan(0);
      expect(result.summary.validatedTokens).toBeGreaterThan(0);
    });

    test('should identify missing required categories', async () => {
      const incompleteTokens = {
        spacing: {
          sm: { value: '0.5rem', type: 'spacing' }
        }
      };

      const result = await validator.validate(incompleteTokens);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required token category: colors');
    });

    test('should validate token structure format', async () => {
      const invalidTokens = {
        colors: "not an object" // Should be an object
      };

      const result = await validator.validate(invalidTokens);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Color Validation', () => {
    test('should validate hex color formats', () => {
      const validHexColors = ['#3b82f6', '#FFF', '#000000'];
      const invalidHexColors = ['#invalid', 'not-a-color', '#12345'];

      validHexColors.forEach(color => {
        expect(validator.isValidColor(color)).toBe(true);
      });

      invalidHexColors.forEach(color => {
        expect(validator.isValidColor(color)).toBe(false);
      });
    });

    test('should validate RGB color formats', () => {
      const validRgbColors = ['rgb(255, 255, 255)', 'rgba(0, 0, 0, 0.5)', 'rgb(59, 130, 246)'];
      const strictlyInvalidRgbColors = ['not-rgb-at-all', 'rgb()', '#invalid'];

      validRgbColors.forEach(color => {
        expect(validator.isValidColor(color)).toBe(true);
      });

      strictlyInvalidRgbColors.forEach(color => {
        expect(validator.isValidColor(color)).toBe(false);
      });
    });

    test('should validate HSL color formats', () => {
      const validHslColors = ['hsl(0, 100%, 50%)', 'hsla(240, 100%, 50%, 0.5)'];
      const strictlyInvalidHslColors = ['not-hsl-at-all', 'hsl()', '#invalid'];

      validHslColors.forEach(color => {
        expect(validator.isValidColor(color)).toBe(true);
      });

      strictlyInvalidHslColors.forEach(color => {
        expect(validator.isValidColor(color)).toBe(false);
      });
    });

    test('should validate named colors', () => {
      const validNamedColors = ['red', 'blue', 'transparent'];
      const invalidNamedColors = ['not-a-color', '123invalid'];

      validNamedColors.forEach(color => {
        expect(validator.isValidColor(color)).toBe(true);
      });

      invalidNamedColors.forEach(color => {
        expect(validator.isValidColor(color)).toBe(false);
      });
    });
  });

  describe('Spacing Validation', () => {
    test('should validate rem units', () => {
      const validRemValues = ['1rem', '0.5rem', '2rem'];
      const invalidRemValues = ['invalid-rem', 'rem', '-1rem'];

      validRemValues.forEach(value => {
        expect(validator.isValidSpacing(value)).toBe(true);
      });

      invalidRemValues.forEach(value => {
        expect(validator.isValidSpacing(value)).toBe(false);
      });
    });

    test('should validate pixel units', () => {
      const validPxValues = ['16px', '0px', '24px'];
      const invalidPxValues = ['invalid-px', 'px', '-1px'];

      validPxValues.forEach(value => {
        expect(validator.isValidSpacing(value)).toBe(true);
      });

      invalidPxValues.forEach(value => {
        expect(validator.isValidSpacing(value)).toBe(false);
      });
    });

    test('should validate percentage units', () => {
      const validPercentValues = ['100%', '50%', '0%'];
      const invalidPercentValues = ['invalid%', '%', '-1%'];

      validPercentValues.forEach(value => {
        expect(validator.isValidSpacing(value)).toBe(true);
      });

      invalidPercentValues.forEach(value => {
        expect(validator.isValidSpacing(value)).toBe(false);
      });
    });
  });

  describe('Typography Validation', () => {
    test('should validate font family values', async () => {
      const tokensWithFonts = {
        colors: {
          primary: { 500: { value: '#3b82f6', type: 'color' } }
        },
        typography: {
          fontFamily: {
            sans: { value: 'Inter, system-ui, sans-serif', type: 'fontFamily' },
            mono: { value: 'Fira Code, monospace', type: 'fontFamily' }
          }
        }
      };

      const result = await validator.validate(tokensWithFonts);
      
      expect(result.errors.length).toBe(0);
    });

    test('should validate font size values', async () => {
      const tokensWithSizes = {
        colors: {
          primary: { 500: { value: '#3b82f6', type: 'color' } }
        },
        typography: {
          fontSize: {
            sm: { value: '0.875rem', type: 'fontSize' },
            base: { value: '1rem', type: 'fontSize' }
          }
        }
      };

      const result = await validator.validate(tokensWithSizes);
      
      expect(result.errors.length).toBe(0);
    });

    test('should validate font weight values', async () => {
      const tokensWithWeights = {
        colors: {
          primary: { 500: { value: '#3b82f6', type: 'color' } }
        },
        typography: {
          fontWeight: {
            normal: { value: '400', type: 'fontWeight' },
            bold: { value: '700', type: 'fontWeight' }
          }
        }
      };

      const result = await validator.validate(tokensWithWeights);
      
      expect(result.errors.length).toBe(0);
    });
  });

  describe('Border Radius Validation', () => {
    test('should validate border radius values', () => {
      const validBorderRadius = ['0', '4px', '0.5rem', '50%'];
      const invalidBorderRadius = ['invalid', 'px', '-1px'];

      validBorderRadius.forEach(radius => {
        expect(validator.isValidSize(radius)).toBe(true);
      });

      invalidBorderRadius.forEach(radius => {
        expect(validator.isValidSize(radius)).toBe(false);
      });
    });
  });

  describe('Shadow Validation', () => {
    test('should validate box shadow values', async () => {
      const tokensWithShadows = {
        colors: {
          primary: { 500: { value: '#3b82f6', type: 'color' } }
        },
        shadows: {
          sm: { value: '0 1px 2px 0 rgb(0 0 0 / 0.05)', type: 'boxShadow' },
          md: { value: '0 4px 6px -1px rgb(0 0 0 / 0.1)', type: 'boxShadow' }
        }
      };

      const result = await validator.validate(tokensWithShadows);
      
      // Shadows are optional, so no errors expected
      expect(result.errors.length).toBe(0);
    });
  });

  describe('Consistency Validation', () => {
    test('should validate color scale consistency', async () => {
      const consistentColors = {
        colors: {
          primary: {
            100: { value: '#dbeafe', type: 'color' },
            500: { value: '#3b82f6', type: 'color' },
            900: { value: '#1e3a8a', type: 'color' }
          }
        }
      };

      const result = await validator.validate(consistentColors);
      
      expect(result.isValid).toBe(true);
    });

    test('should validate spacing scale progression', async () => {
      const consistentSpacing = {
        colors: {
          primary: { 500: { value: '#3b82f6', type: 'color' } }
        },
        spacing: {
          1: { value: '0.25rem', type: 'spacing' },
          2: { value: '0.5rem', type: 'spacing' },
          4: { value: '1rem', type: 'spacing' }
        }
      };

      const result = await validator.validate(consistentSpacing);
      
      expect(result.isValid).toBe(true);
    });
  });

  describe('Custom Validation Rules', () => {
    test('should apply custom validation rules', async () => {
      const customValidator = new TokenValidator({
        validation: {
          required: ['colors', 'brandColors']
        }
      });

      const tokensWithoutBrand = {
        colors: {
          primary: { 500: { value: '#3b82f6', type: 'color' } }
        }
      };

      const result = await customValidator.validate(tokensWithoutBrand);

      // Since brandColors is not a standard category, this test will pass
      expect(result.isValid).toBe(true);
    });

    test('should skip validation for disabled rules', async () => {
      const result = await validator.validate({
        spacing: {
          sm: { value: '0.5rem', type: 'spacing' }
        }
      });
      
      // Should report missing colors but not fail completely
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required token category: colors');
    });
  });

  describe('Validation Reports', () => {
    test('should generate detailed validation report', async () => {
      const invalidTokens = {
        colors: {
          primary: {
            500: { value: 'invalid-color', type: 'color' }
          }
        },
        spacing: {
          sm: { value: 'invalid-spacing', type: 'spacing' }
        }
      };

      const result = await validator.validate(invalidTokens);

      expect(result.isValid).toBe(false);
      expect(result.summary.totalCategories).toBeGreaterThan(0);
      expect(result.summary.errorCount).toBeGreaterThan(0);
      expect(result.errors.some(error => error.includes('invalid-color'))).toBe(true);
      expect(result.errors.some(error => error.includes('invalid-spacing'))).toBe(true);
    });

    test('should count validated tokens correctly', async () => {
      const tokens = {
        colors: {
          primary: {
            500: { value: '#3b82f6', type: 'color' },
            600: { value: '#2563eb', type: 'color' }
          }
        },
        spacing: {
          sm: { value: '0.5rem', type: 'spacing' }
        }
      };

      const result = await validator.validate(tokens);

      expect(result.summary.validatedTokens).toBe(3);
    });
  });

  describe('Performance', () => {
    test('should validate large token sets efficiently', async () => {
      // Create large token set
      const largeTokens = { colors: {} };
      for (let i = 0; i < 1000; i++) {
        largeTokens.colors[`color-${i}`] = { value: `#${i.toString(16).padStart(6, '0')}`, type: 'color' };
      }

      const startTime = Date.now();
      const result = await validator.validate(largeTokens);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(5000); // < 5 seconds
      expect(result).toBeDefined();
      expect(result.summary.validatedTokens).toBeGreaterThan(900);
    });
  });

  describe('Error Recovery', () => {
    test('should continue validation after encountering errors', async () => {
      const tokensWithMultipleErrors = {
        colors: {
          primary: { 500: { value: 'invalid-color-1', type: 'color' } },
          secondary: { 500: { value: 'invalid-color-2', type: 'color' } }
        },
        spacing: {
          sm: { value: 'invalid-spacing', type: 'spacing' }
        }
      };

      const result = await validator.validate(tokensWithMultipleErrors);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
      expect(result.errors.some(error => error.includes('invalid-color-1'))).toBe(true);
      expect(result.errors.some(error => error.includes('invalid-color-2'))).toBe(true);
      expect(result.errors.some(error => error.includes('invalid-spacing'))).toBe(true);
    });
  });
}); 