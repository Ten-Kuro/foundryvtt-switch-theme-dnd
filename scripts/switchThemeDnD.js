/**
 * A single ToDo in our list of Todos.
 * @typedef {Object} ToDo
 * @property {string} id - A unique ID to identify this todo.
 * @property {string} label - The text of the todo.
 * @property {boolean} isDone - Marks whether the todo is done.
 * @property {string} userId - The user who owns this todo.
 */

const IndicatorMode = {
    DBZ: 0,
    GREEN: 1,
    DEFAULT: 2,
};

const themes = {
    [IndicatorMode.DBZ] : {
        css: "styles/dbztheme.css"
    },
    [IndicatorMode.GREEN] : {
        css: "styles/green.css"
    },
    [IndicatorMode.DEFAULT] : {
        css: "styles/style.css"
    },
}

const applyTheme = (state) => {
    const head = document.head;

    // Get the correct theme based on state
    const theme = themes[state] || themes[IndicatorMode.DEFAULT];
    const hrefToApply = theme.css;

    // Iterate through head children and replace only the theme CSS value part in href
    Array.from(head.children).some(child => {
        if (child.href) {
            // Iterate over each theme's CSS value
            for (const cssPath of Object.values(themes).map(t => t.css)) {
                if (child.href.includes(cssPath)) {
                    // Replace only the matched theme CSS part
                    child.href = child.href.replace(cssPath, hrefToApply);
                    return true; // Stop the loop after replacement
                }
            }
        }
        return false; // Continue loop if no replacement was made
    });
};

class SwitchTheme {
    static ID = 'switchThemeDnD';

   /**static TEMPLATES = {
        SWITCHTHEME: `modules/${this.ID}/templates/switchThemeDnD.hbs`
    };*/

    static SETTINGS = {
        ACTIVATE_THEMES: 'activate-themes',
        SELECT_SKIN: 'select-skin',
        OPTIONS: 'options',
    }

  /**
   * A small helper function which leverages developer mode flags to gate debug logs.
   * 
   * @param {boolean} force - forces the log even if the debug flag is not on
   * @param  {...any} args - what to log
   */

    log(force, ...args) {
        const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);

        if (shouldLog) {
            console.log(this.ID, '|', ...args);
        }
    }

    log(msg, ...args) {
        if (game && game.settings.get(this.ID, "verboseLogs")) {
            const color = "background: #6699ff; color: #000; font-size: larger;";
            console.debug(`%c SwitchTheme: ${msg}`, color, ...args);
        }
    }

    static initialize() {
        game.settings.register(this.ID, this.SETTINGS.SELECT_SKIN, {
            name: `SWITCH-THEME.settings.${this.SETTINGS.SELECT_SKIN}.Name`,
            hint: `SWITCH-THEME.settings.${this.SETTINGS.SELECT_SKIN}.Hint`,
            scope: "client",
            config: true,
            default: 2,
            type: Number,
			choices: {
				0: `SWITCH-THEME.settings.${this.SETTINGS.OPTIONS}.indicator.choices.0`,
				1: `SWITCH-THEME.settings.${this.SETTINGS.OPTIONS}.indicator.choices.1`,
                2: `SWITCH-THEME.settings.${this.SETTINGS.OPTIONS}.indicator.choices.2`
			},
			onChange: (value) => {
               applyTheme(Number(value));
            }
        });
        
        let state = Number(game.settings.get(this.ID, this.SETTINGS.SELECT_SKIN));
        applyTheme(Number(state));
    }
    
    
}

// Register our module's debug flag with developer mode's custom hook
Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(SwitchTheme.ID);
});

// Once the game has initialized, set up our module
Hooks.once('ready', () => {
    SwitchTheme.initialize();
});
