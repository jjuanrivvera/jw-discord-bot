/**
 * E2E tests for language system
 * Tests the full flow of language configuration and string retrieval
 */

describe('Language System E2E Tests', () => {
    const {
        languages,
        getLanguage,
        getString,
        getNewsRssUrl,
        getWolSearchUrl,
        getAvailableLanguages
    } = require('../../src/config/languages');

    describe('complete language coverage', () => {
        const allLanguages = getAvailableLanguages();

        allLanguages.forEach(langInfo => {
            describe(`${langInfo.name} (${langInfo.code})`, () => {
                const lang = getLanguage(langInfo.code);

                it('should have all required string keys', () => {
                    const requiredKeys = [
                        'dailyText',
                        'noTextForDate',
                        'consider',
                        'search',
                        'moreInfoAbout',
                        'specifyTopic',
                        'latestNews',
                        'readHere',
                        'newNewsRegistered',
                        'couldNotGetText',
                        'invalidTimezone',
                        'mentionValidUser',
                        'jwOnlineLibrary',
                        'todayIs',
                        'day',
                        'month',
                        'year',
                        'time',
                        'timezone',
                        'newsChannelSet',
                        'newsChannelRemoved',
                        'dailyScheduleSet',
                        'dailyScheduleRemoved',
                        'atHour',
                        'specifyChannel',
                        'invalidHour',
                        'adminOnly',
                        'currentConfig',
                        'notConfigured',
                        'noNewsFound',
                        'commandError',
                        'language',
                        'availableLanguages',
                        'invalidLanguage',
                        'languageSet',
                        'availableCommands',
                        'description',
                        'usage'
                    ];

                    requiredKeys.forEach(key => {
                        expect(lang.strings[key]).toBeDefined();
                        expect(typeof lang.strings[key]).toBe('string');
                        expect(lang.strings[key].length).toBeGreaterThan(0);
                    });
                });

                it('should generate valid RSS URL', () => {
                    const rssUrl = getNewsRssUrl(langInfo.code);
                    expect(rssUrl).toContain('https://www.jw.org');
                    expect(rssUrl).toContain('feed.xml');
                    expect(rssUrl).toContain(lang.jwOrg);
                });

                it('should generate valid WOL search URL', () => {
                    const wolUrl = getWolSearchUrl('test', langInfo.code);
                    expect(wolUrl).toContain('https://wol.jw.org');
                    expect(wolUrl).toContain('q=test');
                    expect(wolUrl).toContain(lang.wol.lang);
                    expect(wolUrl).toContain(lang.wol.region);
                    expect(wolUrl).toContain(lang.wol.langParam);
                });

                it('should have correct WOL configuration', () => {
                    expect(lang.wol.lang).toBeDefined();
                    expect(lang.wol.region).toMatch(/^r\d+$/);
                    expect(lang.wol.langParam).toMatch(/^lp-[a-z]$/);
                });
            });
        });
    });

    describe('getString fallback behavior', () => {
        it('should return string for valid key and language', () => {
            const esStr = getString('dailyText', 'es');
            const enStr = getString('dailyText', 'en');
            const ptStr = getString('dailyText', 'pt');

            expect(esStr).toBe('Texto Diario');
            expect(enStr).toBe('Daily Text');
            expect(ptStr).toBe('Texto Diário');
        });

        it('should return key itself for invalid key (graceful degradation)', () => {
            const result = getString('nonExistentKey12345', 'es');
            expect(result).toBe('nonExistentKey12345');
        });

        it('should use default language for invalid language code', () => {
            const result = getString('dailyText', 'invalid');
            // Should return the default language string
            expect(typeof result).toBe('string');
            expect(result.length).toBeGreaterThan(0);
        });
    });

    describe('WOL URL encoding', () => {
        const specialChars = [
            { char: '&', encoded: '%26' },
            { char: ' ', encoded: '%20' },
            { char: '+', encoded: '%2B' },
            { char: '?', encoded: '%3F' },
            { char: '=', encoded: '%3D' }
        ];

        specialChars.forEach(({ char, encoded }) => {
            it(`should encode "${char}" as "${encoded}"`, () => {
                const url = getWolSearchUrl(`test${char}query`, 'es');
                expect(url).toContain(encoded);
            });
        });

        it('should handle unicode characters', () => {
            const url = getWolSearchUrl('días', 'es');
            expect(url).toContain('d%C3%ADas');
        });

        it('should trim whitespace', () => {
            const url = getWolSearchUrl('  test  ', 'es');
            expect(url).toContain('q=test');
            expect(url).not.toContain('%20test');
        });
    });

    describe('language consistency', () => {
        it('all languages should have the same string keys', () => {
            const esKeys = Object.keys(languages.es.strings);
            const enKeys = Object.keys(languages.en.strings);
            const ptKeys = Object.keys(languages.pt.strings);

            expect(esKeys.sort()).toEqual(enKeys.sort());
            expect(enKeys.sort()).toEqual(ptKeys.sort());
        });

        it('string values should not be empty', () => {
            Object.values(languages).forEach(lang => {
                Object.entries(lang.strings).forEach(([key, value]) => {
                    expect(value.trim().length).toBeGreaterThan(0);
                });
            });
        });
    });
});
