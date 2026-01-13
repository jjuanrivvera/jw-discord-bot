/**
 * Unit tests for guild.model.js schema validation
 * These tests validate the schema structure without requiring a database
 */

describe('Guild Model Schema', () => {
    // Mock mongoose to test schema definition
    let mockSchema;
    let mockSchemaDefinition;

    beforeAll(() => {
        // Capture the schema definition when model is loaded
        jest.mock('../../../src/db/mongoose', () => {
            const schemaDef = {};
            return {
                Schema: jest.fn().mockImplementation((definition, options) => {
                    schemaDef.definition = definition;
                    schemaDef.options = options;
                    return {
                        index: jest.fn()
                    };
                }),
                model: jest.fn().mockReturnValue({}),
                _schemaDef: schemaDef
            };
        });

        // Clear cache and require fresh
        jest.resetModules();
        const mongoose = require('../../../src/db/mongoose');

        // Now load the model to capture schema
        require('../../../src/models/guild.model');

        mockSchemaDefinition = mongoose._schemaDef;
    });

    describe('schema fields', () => {
        it('should have id field', () => {
            expect(mockSchemaDefinition.definition).toHaveProperty('id');
        });

        it('should have name field', () => {
            expect(mockSchemaDefinition.definition).toHaveProperty('name');
        });

        it('should have newsNotificationChannelId field', () => {
            expect(mockSchemaDefinition.definition).toHaveProperty('newsNotificationChannelId');
        });

        it('should have prefix field', () => {
            expect(mockSchemaDefinition.definition).toHaveProperty('prefix');
        });

        it('should have language field', () => {
            expect(mockSchemaDefinition.definition).toHaveProperty('language');
        });
    });

    describe('id field', () => {
        it('should be type String', () => {
            expect(mockSchemaDefinition.definition.id.type).toBe(String);
        });

        it('should be required', () => {
            expect(mockSchemaDefinition.definition.id.required).toBe(true);
        });

        it('should be unique', () => {
            expect(mockSchemaDefinition.definition.id.unique).toBe(true);
        });

        it('should be indexed', () => {
            expect(mockSchemaDefinition.definition.id.index).toBe(true);
        });
    });

    describe('name field', () => {
        it('should be type String', () => {
            expect(mockSchemaDefinition.definition.name.type).toBe(String);
        });

        it('should be required', () => {
            expect(mockSchemaDefinition.definition.name.required).toBe(true);
        });
    });

    describe('newsNotificationChannelId field', () => {
        it('should be type String', () => {
            expect(mockSchemaDefinition.definition.newsNotificationChannelId.type).toBe(String);
        });

        it('should default to null', () => {
            expect(mockSchemaDefinition.definition.newsNotificationChannelId.default).toBe(null);
        });
    });

    describe('prefix field', () => {
        it('should be type String', () => {
            expect(mockSchemaDefinition.definition.prefix.type).toBe(String);
        });

        it('should default to null', () => {
            expect(mockSchemaDefinition.definition.prefix.default).toBe(null);
        });
    });

    describe('language field', () => {
        it('should be type String', () => {
            expect(mockSchemaDefinition.definition.language.type).toBe(String);
        });

        it('should have enum with valid values', () => {
            const enumValues = mockSchemaDefinition.definition.language.enum;
            expect(enumValues).toContain('es');
            expect(enumValues).toContain('en');
            expect(enumValues).toContain('pt');
            expect(enumValues).toContain(null);
        });

        it('should default to null', () => {
            expect(mockSchemaDefinition.definition.language.default).toBe(null);
        });
    });

    describe('schema options', () => {
        it('should enable timestamps', () => {
            expect(mockSchemaDefinition.options.timestamps).toBe(true);
        });
    });
});
