/**
 * Language configuration for JW Discord Bot
 *
 * Each language contains:
 * - code: ISO language code
 * - name: Language name
 * - jwOrg: JW.org URL path segment
 * - wol: Watchtower Online Library configuration (region and language params)
 * - newsPath: Path to news section on JW.org
 * - newsTitleKeyword: Keyword to replace in news titles (language-specific)
 * - strings: UI strings for bot responses
 */

/**
 * Embed colors used throughout the bot
 */
const EMBED_COLORS = {
    PRIMARY: '0x1D82B6',
    ERROR: '0xFF0000',
    SUCCESS: '0x00FF00'
};

const languages = {
    es: {
        code: 'es',
        name: 'Español',
        jwOrg: 'es',
        wol: {
            lang: 'es',
            region: 'r4',
            langParam: 'lp-s'
        },
        newsPath: 'noticias/testigos-de-jehova',
        newsTitleKeyword: 'COMUNICADOS',
        strings: {
            dailyText: 'Texto Diario',
            noTextForDate: 'No tengo el texto de ese día aún :c',
            consider: 'Consideremos:',
            search: 'Búsqueda',
            moreInfoAbout: 'Aquí puedes encontrar más info acerca de',
            specifyTopic: 'Tienes que especificar un tema',
            latestNews: 'Última noticia',
            readHere: 'Leer aquí:',
            newNewsRegistered: 'Se registró una nueva noticia exitosamente',
            couldNotGetText: 'No pude obtener el texto del día',
            invalidTimezone: 'La zona horaria ingresada no es válida',
            mentionValidUser: 'Menciona a un usuario válido',
            jwOnlineLibrary: 'JW Online Library',
            // Date command strings
            todayIs: 'Hoy es:',
            day: 'Día:',
            month: 'Mes:',
            year: 'Año:',
            time: 'Hora:',
            timezone: 'Zona horaria:',
            // Config command strings
            newsChannelSet: 'Canal de noticias configurado en',
            newsChannelRemoved: 'Canal de noticias removido',
            dailyScheduleSet: 'Texto diario programado en',
            dailyScheduleRemoved: 'Programación de texto diario removida',
            atHour: 'a las',
            specifyChannel: 'Por favor especifica un canal',
            invalidHour: 'Hora inválida. Usa un número entre 0 y 23',
            adminOnly: 'Este comando requiere permisos de administrador',
            currentConfig: 'Configuración actual',
            notConfigured: 'No configurado',
            // Error strings
            noNewsFound: 'No se encontraron noticias',
            commandError: 'Ocurrió un error al ejecutar este comando',
            // Language config strings
            language: 'Idioma',
            availableLanguages: 'Idiomas disponibles',
            invalidLanguage: 'Idioma inválido. Disponibles:',
            languageSet: 'Idioma configurado a',
            // Help command strings
            availableCommands: 'Lista de comandos disponibles',
            description: 'Descripción',
            usage: 'Uso'
        }
    },
    en: {
        code: 'en',
        name: 'English',
        jwOrg: 'en',
        wol: {
            lang: 'en',
            region: 'r1',
            langParam: 'lp-e'
        },
        newsPath: 'news/jw',
        newsTitleKeyword: 'NEWS',
        strings: {
            dailyText: 'Daily Text',
            noTextForDate: "I don't have the text for that day yet :c",
            consider: 'Let us consider:',
            search: 'Search',
            moreInfoAbout: 'Here you can find more info about',
            specifyTopic: 'You need to specify a topic',
            latestNews: 'Latest News',
            readHere: 'Read here:',
            newNewsRegistered: 'A new news item was registered successfully',
            couldNotGetText: "Couldn't get the daily text",
            invalidTimezone: 'The timezone entered is not valid',
            mentionValidUser: 'Mention a valid user',
            jwOnlineLibrary: 'JW Online Library',
            // Date command strings
            todayIs: 'Today is:',
            day: 'Day:',
            month: 'Month:',
            year: 'Year:',
            time: 'Time:',
            timezone: 'Timezone:',
            // Config command strings
            newsChannelSet: 'News channel set to',
            newsChannelRemoved: 'News channel removed',
            dailyScheduleSet: 'Daily text scheduled in',
            dailyScheduleRemoved: 'Daily text schedule removed',
            atHour: 'at',
            specifyChannel: 'Please specify a channel',
            invalidHour: 'Invalid hour. Use a number between 0 and 23',
            adminOnly: 'This command requires administrator permissions',
            currentConfig: 'Current configuration',
            notConfigured: 'Not configured',
            // Error strings
            noNewsFound: 'No news found',
            commandError: 'An error occurred while executing this command',
            // Language config strings
            language: 'Language',
            availableLanguages: 'Available Languages',
            invalidLanguage: 'Invalid language. Available:',
            languageSet: 'Language set to',
            // Help command strings
            availableCommands: 'Available Command List',
            description: 'Description',
            usage: 'Usage'
        }
    },
    pt: {
        code: 'pt',
        name: 'Português',
        jwOrg: 'pt',
        wol: {
            lang: 'pt',
            region: 'r5',
            langParam: 'lp-t'
        },
        newsPath: 'noticias/testemunhas-de-jeova',
        newsTitleKeyword: 'NOTÍCIAS',
        strings: {
            dailyText: 'Texto Diário',
            noTextForDate: 'Ainda não tenho o texto desse dia :c',
            consider: 'Consideremos:',
            search: 'Pesquisa',
            moreInfoAbout: 'Aqui você pode encontrar mais informações sobre',
            specifyTopic: 'Você precisa especificar um tema',
            latestNews: 'Última Notícia',
            readHere: 'Leia aqui:',
            newNewsRegistered: 'Uma nova notícia foi registrada com sucesso',
            couldNotGetText: 'Não consegui obter o texto do dia',
            invalidTimezone: 'O fuso horário inserido não é válido',
            mentionValidUser: 'Mencione um usuário válido',
            jwOnlineLibrary: 'JW Online Library',
            // Date command strings
            todayIs: 'Hoje é:',
            day: 'Dia:',
            month: 'Mês:',
            year: 'Ano:',
            time: 'Hora:',
            timezone: 'Fuso horário:',
            // Config command strings
            newsChannelSet: 'Canal de notícias configurado em',
            newsChannelRemoved: 'Canal de notícias removido',
            dailyScheduleSet: 'Texto diário agendado em',
            dailyScheduleRemoved: 'Agendamento de texto diário removido',
            atHour: 'às',
            specifyChannel: 'Por favor, especifique um canal',
            invalidHour: 'Hora inválida. Use um número entre 0 e 23',
            adminOnly: 'Este comando requer permissões de administrador',
            currentConfig: 'Configuração atual',
            notConfigured: 'Não configurado',
            // Error strings
            noNewsFound: 'Nenhuma notícia encontrada',
            commandError: 'Ocorreu um erro ao executar este comando',
            // Language config strings
            language: 'Idioma',
            availableLanguages: 'Idiomas disponíveis',
            invalidLanguage: 'Idioma inválido. Disponíveis:',
            languageSet: 'Idioma configurado para',
            // Help command strings
            availableCommands: 'Lista de comandos disponíveis',
            description: 'Descrição',
            usage: 'Uso'
        }
    }
};

/**
 * Validate and get default language from environment
 * Falls back to 'es' if invalid or not set
 */
const DEFAULT_LANG = (() => {
    const envLang = process.env.DEFAULT_LANG;
    if (envLang && !languages[envLang]) {
        console.warn(`[WARN] Invalid DEFAULT_LANG "${envLang}", falling back to "es". Available: ${Object.keys(languages).join(', ')}`);
        return 'es';
    }
    return envLang || 'es';
})();

/**
 * Get language configuration
 * @param {string} langCode - Language code (e.g., 'es', 'en', 'pt')
 * @returns {object} Language configuration object
 */
function getLanguage(langCode = DEFAULT_LANG) {
    return languages[langCode] || languages[DEFAULT_LANG];
}

/**
 * Get translated string
 * @param {string} key - String key
 * @param {string} langCode - Language code
 * @returns {string} Translated string, or key itself if translation missing (graceful degradation)
 */
function getString(key, langCode = DEFAULT_LANG) {
    const lang = getLanguage(langCode);
    return lang.strings[key] || key;
}

/**
 * Build JW.org news RSS URL
 * @param {string} langCode - Language code
 * @returns {string} RSS feed URL
 */
function getNewsRssUrl(langCode = DEFAULT_LANG) {
    const lang = getLanguage(langCode);
    return `https://www.jw.org/${lang.jwOrg}/${lang.newsPath}/rss/NewsSubsectionRSSFeed/feed.xml`;
}

/**
 * Build JW.org news page URL
 * @param {string} langCode - Language code
 * @returns {string} News page URL
 */
function getNewsPageUrl(langCode = DEFAULT_LANG) {
    const lang = getLanguage(langCode);
    return `https://www.jw.org/${lang.jwOrg}/${lang.newsPath}/#newsAlerts`;
}

/**
 * Get the news title keyword for replacement
 * @param {string} langCode - Language code
 * @returns {string} News title keyword (e.g., 'COMUNICADOS' for Spanish)
 */
function getNewsTitleKeyword(langCode = DEFAULT_LANG) {
    const lang = getLanguage(langCode);
    return lang.newsTitleKeyword;
}

/**
 * Build WOL search URL with proper encoding
 * @param {string} query - Search query
 * @param {string} langCode - Language code
 * @returns {string} Encoded WOL search URL
 * @throws {Error} If query is empty or invalid
 */
function getWolSearchUrl(query, langCode = DEFAULT_LANG) {
    if (!query || typeof query !== 'string') {
        throw new Error('Query parameter must be a non-empty string');
    }

    const lang = getLanguage(langCode);
    const encodedQuery = encodeURIComponent(query.trim());

    return `https://wol.jw.org/${lang.wol.lang}/wol/s/${lang.wol.region}/${lang.wol.langParam}?q=${encodedQuery}&p=par&r=occ`;
}

/**
 * Get list of available languages
 * @returns {Array} Array of language objects with code and name
 */
function getAvailableLanguages() {
    return Object.values(languages).map(lang => ({
        code: lang.code,
        name: lang.name
    }));
}

module.exports = {
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
};
