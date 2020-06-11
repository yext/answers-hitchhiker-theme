{{> directanswercards/card_component componentName = 'allfields-standard' }}

class allfields_standardComponent extends BaseDirectAnswerCard['allfields-standard'] {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    this.setTemplate(`{{{read 'directanswercards/allfields-standard/template' }}}`);
  }

  /**
   * @param type the type of direct answer
   * @param answer the full answer returned from the API, corresponds to response.directAnswer.answer.
   * @param relatedItem profile of the related entity for the direct answer
   */
  dataForRender(type, answer, relatedItem) {
    let isArray = Array.isArray(answer.value);
    let value = isArray ? answer.value.map(this.formatAnswer) : this.formatAnswer(answer);

    return {
      // iconName: '', // Icon that appears on the top left of the direct answer card
      // iconUrl: '', // URL for Icon that appears on the top left of the direct answer card
      entityName: answer.entityName, // Root of the breadcrumb in the card heading (entityName / fieldName)
      fieldName: answer.fieldName, // Folder of the breadcrumb (entityName / fieldName)
      value: value || answer.value,
      // link: '', // Link for the text of the direct answer
      // linkEventOptions: this.addDefaultEventOptions(), // The event options for link click analytics
      viewDetailsText: 'View Details', // Text below the direct answer
      viewDetailsLink: relatedItem.data.website, // Link for the “view details” text
      viewDetailsEventOptions: this.addDefaultEventOptions(), // The event options for viewDetails click analytics
      linkTarget: '_top', // Target for all links in the direct answer
      // CTA: {
      //   label: '', // The CTA's label
      //   iconName: 'chevron', // The icon to use for the CTA
      //   url: '', // The URL a user will be directed to when clicking
      //   target: '_top', // Where the new URL will be opened
      //   eventType: 'CTA_CLICK', // Type of Analytics event fired when clicking the CTA
      //   eventOptions: this.addDefaultEventOptions() // The event options for CTA click analytics
      // },
      footerTextOnSubmission: 'Thank you for your feedback!', // Text to display in the footer when a thumbs up/down is clicked
      footerText: 'Was this the answer you were looking for?', // Text to display in the footer
      positiveFeedbackSrText: 'This answered my question', // Screen reader only text for thumbs-up
      negativeFeedbackSrText: 'This did not answer my question', // Screen reader only text for thumbs-down
    };
  }

  formatAnswer (answer) {
    switch (answer.fieldType) {
      case "url":
      case "complex_url":
      case "ios_app_url":
      case "android_app_url":
      case "facebook_url":
        return {
          url: answer.value,
          displayText: answer.value
        };
      case "email":
        return {
          url: answer.value,
          displayText: `mailto:${answer.value}`
        };
      case "instagram_handle":
        return {
          url: `https://instagram.com/${answer.value}`,
          displayText: `@${answer.value}`,
        };
      case "twitter_handle":
        return {
          url: `https://twitter.com/${answer.value}`,
          displayText: `@${answer.value}`,
        };
      case "phone":
        return {
          url: Formatter.phoneLink({mainPhone: answer.value}),
          displayText: Formatter.nationalizedPhoneDisplay({mainPhone: answer.value}),
        };
      case "address":
        return Formatter.address({address: answer.value});
      case "hours":
        return Formatter.openStatus({hours: answer.value});
      case "decimal":
        return answer.value.toLocaleString();
      case "rich_text":
        return ANSWERS.formatRichText(answer.value);
      case "single_line_text":
      case "multi_line_text":
        return answer.value;
    }

    // Optionally switch by field name
    switch (answer.fieldApiName) {
      case "mainPhone": // The Field API name
        return {
          url: Formatter.phoneLink({mainPhone: answer.value}),
          displayText: Formatter.nationalizedPhoneDisplay({mainPhone: answer.value})
        };
    }

    return answer.value;
  }
}

ANSWERS.registerComponentType(allfields_standardComponent);
