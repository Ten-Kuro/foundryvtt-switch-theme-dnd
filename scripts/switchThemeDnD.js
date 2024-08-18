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
    DEFAULT: 1,
};

const IndicatorFonts = {
	DBZ: 0,
    DEFAULT: 1,
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
            default: 1,
            type: Number,
			choices: {
				0: `SWITCH-THEME.settings.${this.SETTINGS.OPTIONS}.indicator.choices.0`,
				1: `SWITCH-THEME.settings.${this.SETTINGS.OPTIONS}.indicator.choices.1`
			},
			onChange: (value) => {
				let state = Number(value);
				var head = document.getElementsByTagName('head')[0];
				var locationOrigin= document.location.origin;
				var hrefToApply = "css/style.css";
				
				switch(state){
					case IndicatorMode.DBZ:
							hrefToApply= "styles/dbzTheme.css";
                            document.documentElement.style.setProperty('--major-button-font-family','DragonBall');	
					  break;	    
					case IndicatorMode.DEFAULT:
							hrefToApply= "css/style.css";
							break;
					default:
					  console.log('Something went wrong [$value] does not exists in fonts choices (in theme)');
				}
			}
        });
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
