{{> directanswercards/card_component componentName = 'documentsearch-standard' }}

class documentsearch_standardComponent extends BaseDirectAnswerCard['documentsearch-standard'] {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
  }

  onMount() {
    super.onMount();
    // this.snipToHeight(document.querySelector('.js-yxt-rtfValue'), 200);
  }

  snipToHeight(element, height) {
    if (!element) {
      console.log('no element. returning');
      return;
    }
    // We should proabably use element.childNodes instead so that we can also handle text nodes,
    // however we will need to handle those appropriately since we cannot set `display: none` on those.
    // Also we can't use offset height since that doesn't account for margin. We will need to update to
    // account for that as well
    if (element.children.length === 0 && element.offsetHeight > height) {
      element.style.display = 'none';
    }
    console.log(`executing snip with height ${height}`);
    const getTotalHeightOfElements = elements => {
      return elements.reduce((acc, ele) => {
        acc += ele.offsetHeight;
        return acc;
      }, 0);
    };
    const childrenWithinHeight = Array.prototype.reduce.call(element.children, (acc, child) => {
      if (getTotalHeightOfElements(acc) + child.offsetHeight <= height) {
        acc.push(child);
      }
      return acc;
    }, []);
    console.log('children within height: ');
    console.log(childrenWithinHeight);
    const childrenOutsideOfHeight = Array.prototype.slice.call(element.children, childrenWithinHeight.length);

    const firstChildOutsideOfHeight = childrenOutsideOfHeight.length > 0 && childrenOutsideOfHeight[0];
    const remainingChildrenOutsideOfHeight = Array.prototype.slice.call(childrenOutsideOfHeight, 1);

    console.log('first child out of height: ' + firstChildOutsideOfHeight);
    console.log('remaining children out of height: ');
    console.log(remainingChildrenOutsideOfHeight);

    Array.prototype.forEach.call(remainingChildrenOutsideOfHeight, child => {
      child.style.display = 'none';
    });

    const heightRemaining = height - getTotalHeightOfElements(childrenWithinHeight);
    if (childrenOutsideOfHeight.length > 0 && heightRemaining > 0) {
      this.snipToHeight(firstChildOutsideOfHeight, heightRemaining);
    }
  }

  /**
   * @param type the type of direct answer
   * @param answer the full answer returned from the API, corresponds to response.directAnswer.answer.
   * @param relatedItem profile of the related entity for the direct answer
   * @param snippet the snippet for the document search direct answer
   */
  dataForRender(type, answer, relatedItem, snippet) {
    const relatedItemData = relatedItem.data || {};
    let snippetValue = "";
    if (answer.fieldType == "rich_text" && snippet) {
      snippetValue = ANSWERS.formatRichText(snippet.value, 'snippet');
    } else if (snippet) {
      snippetValue = Formatter.highlightField(snippet.value, snippet.matchedSubstrings);
    }

    return {
      value: answer.value,
      snippet: snippetValue, // Text snippet to include alongside the answer
      viewDetailsText: relatedItemData.fieldValues && relatedItemData.fieldValues.name, // Text below the direct answer and snippet
      viewDetailsLink: relatedItemData.website || (relatedItemData.fieldValues && relatedItemData.fieldValues.landingPageUrl), // Link for the "view details" text
      viewDetailsEventOptions: this.addDefaultEventOptions({
        ctaLabel: 'VIEW_DETAILS',
        fieldName: 'snippet'
      }), // The event options for viewDetails click analytics
      linkTarget: '_top', // Target for all links in the direct answer
      // CTA: {
      //   label: '', // The CTA's label
      //   iconName: 'chevron', // The icon to use for the CTA
      //   url: '', // The URL a user will be directed to when clicking
      //   target: '_top', // Where the new URL will be opened
      //   eventType: 'CTA_CLICK', // Type of Analytics event fired when clicking the CTA
      //   eventOptions: this.addDefaultEventOptions({ fieldName: 'snippet' }) // The event options for CTA click analytics
      // },
      footerTextOnSubmission: 'Thank you for your feedback!', // Text to display in the footer when a thumbs up/down is clicked
      footerText: 'Was this the answer you were looking for?', // Text to display in the footer
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
