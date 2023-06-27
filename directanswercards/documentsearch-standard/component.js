{{> directanswercards/card_component componentName = 'documentsearch-standard' }}

class documentsearch_standardComponent extends BaseDirectAnswerCard['documentsearch-standard'] {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
  }

  /**
   * @param type the type of direct answer
   * @param answer the full answer returned from the API, corresponds to response.directAnswer.answer.
   * @param relatedItem profile of the related entity for the direct answer
   * @param snippet the snippet for the document search direct answer
   */
  dataForRender(type, answer, relatedItem, snippet) {
    const relatedItemData = relatedItem.data || {};
    const linkTarget = AnswersExperience.runtimeConfig.get('linkTarget') || '_top';
    let snippetValue = '';
    if (answer.fieldType === "rich_text" && snippet) {
      snippetValue = ANSWERS.formatRichText(snippet.value, 'snippet', linkTarget);
    } else if (answer.fieldType == "html" && snippet) {
      snippetValue = snippet.value;
    } else if (snippet) {
      snippetValue = Formatter.highlightField(snippet.value, snippet.matchedSubstrings);
    }
    const viewDetailsUrl = relatedItemData.website || (relatedItemData.fieldValues && relatedItemData.fieldValues.landingPageUrl);

    return {
      value: answer.value,
      snippet: snippetValue, // Text snippet to include alongside the answer
      viewDetailsText: relatedItemData.fieldValues && relatedItemData.fieldValues.name, // Text below the direct answer and snippet
      viewDetailsLink: Formatter.getUrlWithTextHighlight(snippet, viewDetailsUrl), // Link for the "view details" text
      viewDetailsEventOptions: this.addDefaultEventOptions({
        ctaLabel: 'VIEW_DETAILS',
        fieldName: 'snippet'
      }), // The event options for viewDetails click analytics
      linkTarget: linkTarget, // Target for all links in the direct answer
      // CTA: {
      //   label: '', // The CTA's label
      //   iconName: 'chevron', // The icon to use for the CTA
      //   url: '', // The URL a user will be directed to when clicking
      //   target: linkTarget, // Where the new URL will be opened
      //   eventType: 'CTA_CLICK', // Type of Analytics event fired when clicking the CTA
      //   eventOptions: this.addDefaultEventOptions({ fieldName: 'snippet' }) // The event options for CTA click analytics
      // },
      feedbackTextOnSubmission: 'Thank you for your feedback!', // Text to display in the footer when a thumbs up/down is clicked
      feedbackText: 'Was this the answer you were looking for?', // Text to display in the footer
      positiveFeedbackSrText: 'This answered my question', // Screen reader only text for thumbs-up
      negativeFeedbackSrText: 'This did not answer my question', // Screen reader only text for thumbs-down
    };
  }

  /**
   * The template to render
   * @returns {string}
   * @override
   */
  static defaultTemplateName (config) {
    return 'directanswercards/documentsearch-standard';
  }
}

ANSWERS.registerTemplate(
  'directanswercards/documentsearch-standard',
  {{{stringifyPartial (read 'directanswercards/documentsearch-standard/template') }}}
);
ANSWERS.registerComponentType(documentsearch_standardComponent);
