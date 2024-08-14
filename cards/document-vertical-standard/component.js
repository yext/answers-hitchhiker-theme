{{> cards/card_component componentName='document-vertical-standard' }}

class document_vertical_standardCardComponent extends BaseCard['document-vertical-standard'] {
    constructor(config = {}, systemConfig = {}) {
        super(config, systemConfig);
    }

    /**
     * This returns an object that will be called `card`
     * in the template. Put all mapping logic here.
     *
     * @param profile profile of the entity in the card
     */
    dataForRender(profile) {
        const linkTarget = AnswersExperience.runtimeConfig.get('linkTarget') || '_top';

        return {
            title: profile.name, // The header text of the card
            // subtitle: '', // The sub-header text of the card
            url: profile.landingPageUrl, // If the card title is a clickable link, set URL here
            target: linkTarget, // If the title's URL should open in a new tab, etc.
            // image: '', // The URL of the image to display on the card
            // subtitle: '', // The sub-header text of the card
            details: profile.d_segment.text, // The text in the body of the card
            pageNumber: profile.d_segment.pageNumber, // If the result is from a file with page numbers, the page it was on
            score: profile.d_segment.score, // The score this segment received
            // If the card's details are longer than a certain character count, you can truncate the
            // text. A toggle will be supplied that can show or hide the truncated text.
            showMoreDetails: {
                showMoreLimit: 500, // Character count limit
                showMoreText: 'Show more', // Label when toggle will show truncated text
                showLessText: 'Show less' // Label when toggle will hide truncated text
            },
            feedback: false, // Shows thumbs up/down buttons to provide feedback on the result card
            feedbackTextOnSubmission: 'Thanks!', // Text to display after a thumbs up/down is clicked
            positiveFeedbackSrText: 'This answered my question', // Screen reader only text for thumbs-up
            negativeFeedbackSrText: 'This did not answer my question' // Screen reader only text for thumbs-down
        };
    }

    /**
     * The template to render
     * @returns {string}
     * @override
     */
    static defaultTemplateName (config) {
        return 'cards/document-vertical-standard';
    }
}

ANSWERS.registerTemplate(
    'cards/document-vertical-standard',
    {{{stringifyPartial (read 'cards/document-vertical-standard/template') }}}
);
ANSWERS.registerComponentType(document_vertical_standardCardComponent);
