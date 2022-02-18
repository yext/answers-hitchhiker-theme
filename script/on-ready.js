/* Code added here will be executed during the Answers onReady callback */
const context = (new URLSearchParams(window.location.search)).get('context');
const querySource = JSON.parse(context ?? '{}').querySource;
querySource && ANSWERS.setQuerySource(querySource);