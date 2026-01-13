/**
 * Unit tests for languages.js configuration
 */

const {
    languages,
    DEFAULT_LANG,
    EMBED_COLORS,
    getLanguage,
    getString,
    getNewsRssUrl,
    getNewsPageUrl,
    getNewsTitleKeyword,
    getWolSearchUrl,
    getAvailableLanguages
} = require('../../../src/config/languages');

describe('Languages Configuration', () => {
    describe('languages object', () => {
        it('should have Spanish, English, and Portuguese languages', () => {
            expect(languages).toHaveProperty('es');
            expect(languages).toHaveProperty('en');
            expect(languages).toHaveProperty('pt');
        });

        it('each language should have required properties', () => {
            const requiredProps = ['code', 'name', 'jwOrg', 'wol', 'newsPath', 'newsTitleKeyword', 'strings'];

            Object.values(languages).forEach(lang => {
                requiredProps.forEach(prop => {
                    expect(lang).toHaveProperty(prop);
                });
            });
        });

        it('each language should have WOL configuration', () => {
            Object.values(languages).forEach(lang => {
                expect(lang.wol).toHaveProperty('lang');
                expect(lang.wol).toHaveProperty('region');
                expect(lang.wol).toHaveProperty('langParam');
            });
        });

        it('each language should have all required strings', () => {
            const requiredStrings = [
                'dailyText',
                'noTextForDate',
                'consider',
                'search',
                'latestNews',
                'readHere',
                'adminOnly',
                'languageSet'
            ];

            Object.values(languages).forEach(lang => {
                requiredStrings.forEach(key => {
                    expect(lang.strings).toHaveProperty(key);
                    expect(typeof lang.strings[key]).toBe('string');
                });
            });
        });
    });

    describe('EMBED_COLORS', () => {
        it('should have PRIMARY, ERROR, and SUCCESS colors', () => {
            expect(EMBED_COLORS).toHaveProperty('PRIMARY');
            expect(EMBED_COLORS).toHaveProperty('ERROR');
            expect(EMBED_COLORS).toHaveProperty('SUCCESS');
        });

        it('colors should be valid hex strings', () => {
            Object.values(EMBED_COLORS).forEach(color => {
                expect(color).toMatch(/^0x[0-9A-Fa-f]{6}$/);
            });
        });
    });

    describe('DEFAULT_LANG', () => {
        it('should be a valid language code', () => {
            expect(['es', 'en', 'pt']).toContain(DEFAULT_LANG);
        });
    });

    describe('getLanguage', () => {
        it('should return Spanish config for "es"', () => {
            const lang = getLanguage('es');
            expect(lang.code).toBe('es');
            expect(lang.name).toBe('Español');
        });

        it('should return English config for "en"', () => {
            const lang = getLanguage('en');
            expect(lang.code).toBe('en');
            expect(lang.name).toBe('English');
        });

        it('should return Portuguese config for "pt"', () => {
            const lang = getLanguage('pt');
            expect(lang.code).toBe('pt');
            expect(lang.name).toBe('Português');
        });

        it('should return default language for invalid code', () => {
            const lang = getLanguage('invalid');
            expect(lang.code).toBe(DEFAULT_LANG);
        });

        it('should return default language when no code provided', () => {
            const lang = getLanguage();
            expect(lang.code).toBe(DEFAULT_LANG);
        });

        it('should return default language for null', () => {
            const lang = getLanguage(null);
            expect(lang.code).toBe(DEFAULT_LANG);
        });
    });

    describe('getString', () => {
        it('should return correct Spanish string', () => {
            const str = getString('dailyText', 'es');
            expect(str).toBe('Texto Diario');
        });

        it('should return correct English string', () => {
            const str = getString('dailyText', 'en');
            expect(str).toBe('Daily Text');
        });

        it('should return correct Portuguese string', () => {
            const str = getString('dailyText', 'pt');
            expect(str).toBe('Texto Diário');
        });

        it('should return key itself for missing string (graceful degradation)', () => {
            const str = getString('nonExistentKey', 'es');
            expect(str).toBe('nonExistentKey');
        });

        it('should use default language when lang code not provided', () => {
            const str = getString('dailyText');
            expect(str).toBe(languages[DEFAULT_LANG].strings.dailyText);
        });
    });

    describe('getNewsRssUrl', () => {
        it('should return correct Spanish RSS URL', () => {
            const url = getNewsRssUrl('es');
            expect(url).toContain('jw.org/es');
            expect(url).toContain('noticias/testigos-de-jehova');
            expect(url).toContain('feed.xml');
        });

        it('should return correct English RSS URL', () => {
            const url = getNewsRssUrl('en');
            expect(url).toContain('jw.org/en');
            expect(url).toContain('news/jw');
        });

        it('should return correct Portuguese RSS URL', () => {
            const url = getNewsRssUrl('pt');
            expect(url).toContain('jw.org/pt');
            expect(url).toContain('noticias/testemunhas-de-jeova');
        });

        it('should return default language URL when no lang provided', () => {
            const url = getNewsRssUrl();
            expect(url).toContain(`jw.org/${DEFAULT_LANG}`);
        });
    });

    describe('getNewsPageUrl', () => {
        it('should return correct page URL with hash', () => {
            const url = getNewsPageUrl('es');
            expect(url).toContain('jw.org/es');
            expect(url).toContain('#newsAlerts');
        });

        it('should handle different languages', () => {
            const urlEn = getNewsPageUrl('en');
            const urlPt = getNewsPageUrl('pt');

            expect(urlEn).toContain('/en/');
            expect(urlPt).toContain('/pt/');
        });
    });

    describe('getNewsTitleKeyword', () => {
        it('should return COMUNICADOS for Spanish', () => {
            const keyword = getNewsTitleKeyword('es');
            expect(keyword).toBe('COMUNICADOS');
        });

        it('should return NEWS for English', () => {
            const keyword = getNewsTitleKeyword('en');
            expect(keyword).toBe('NEWS');
        });

        it('should return NOTÍCIAS for Portuguese', () => {
            const keyword = getNewsTitleKeyword('pt');
            expect(keyword).toBe('NOTÍCIAS');
        });
    });

    describe('getWolSearchUrl', () => {
        it('should return correctly formatted URL with encoded query', () => {
            const url = getWolSearchUrl('amor', 'es');
            expect(url).toContain('wol.jw.org/es');
            expect(url).toContain('q=amor');
        });

        it('should properly encode special characters in query', () => {
            const url = getWolSearchUrl('amor & fe', 'es');
            expect(url).toContain('q=amor%20%26%20fe');
        });

        it('should use correct WOL parameters for each language', () => {
            const urlEs = getWolSearchUrl('test', 'es');
            const urlEn = getWolSearchUrl('test', 'en');
            const urlPt = getWolSearchUrl('test', 'pt');

            expect(urlEs).toContain('/r4/');
            expect(urlEs).toContain('lp-s');

            expect(urlEn).toContain('/r1/');
            expect(urlEn).toContain('lp-e');

            expect(urlPt).toContain('/r5/');
            expect(urlPt).toContain('lp-t');
        });

        it('should throw error for empty query', () => {
            expect(() => getWolSearchUrl('', 'es')).toThrow();
            expect(() => getWolSearchUrl(null, 'es')).toThrow();
            expect(() => getWolSearchUrl(undefined, 'es')).toThrow();
        });

        it('should trim whitespace from query', () => {
            const url = getWolSearchUrl('  amor  ', 'es');
            expect(url).toContain('q=amor');
            expect(url).not.toContain('%20amor');
        });
    });

    describe('getAvailableLanguages', () => {
        it('should return array of language objects', () => {
            const available = getAvailableLanguages();
            expect(Array.isArray(available)).toBe(true);
            expect(available.length).toBe(3);
        });

        it('should have code and name for each language', () => {
            const available = getAvailableLanguages();

            available.forEach(lang => {
                expect(lang).toHaveProperty('code');
                expect(lang).toHaveProperty('name');
                expect(typeof lang.code).toBe('string');
                expect(typeof lang.name).toBe('string');
            });
        });

        it('should include all supported languages', () => {
            const available = getAvailableLanguages();
            const codes = available.map(l => l.code);

            expect(codes).toContain('es');
            expect(codes).toContain('en');
            expect(codes).toContain('pt');
        });
    });
});
