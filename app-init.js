renderHome();
const initialHash=location.hash.replace('#','');if(gameById(initialHash))openGame(initialHash);else history.replaceState(null,'','#home');
