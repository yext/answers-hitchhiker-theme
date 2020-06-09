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
    let _value;

    switch (answer.fieldType) {
      case "address":
        _value = Formatter.address({ address: answer.value });
        break;
      case "complex_url":
        _value = `<a href="${answer.value}">${answer.value}</a>`;
        break;
      case "decimal":
        _value = answer.value.toLocaleString();
        break;
      case "email":
        _value = answerValue
          .map(value => `<a href="mailto:${value}">${value}</a>`)
          .join(', ');
        break;
      case "hours":
        _value = Formatter.openStatus({ hours: answer.value });
        break;
      case "rich_text":
        _value = ANSWERS.formatRichText(answer.value);
        break;
      case "url":
        _value = `<a href="${answer.value}">${answer.value}</a>`;
        break;
      case "ios_app_url":
        _value = `<a href="${answer.value}">${answer.value}</a>`;
        break;
      case "android_app_url":
        _value = `<a href="${answer.value}">${answer.value}</a>`;
        break;
      case "facebook_url":
        _value = `<a href="${answer.value}">${answer.value}</a>`;
        break;
      case "instagram_handle":
        _value = `<a href="https://instagram.com/${answer.value}">@${answer.value}</a>`;
        break;
      case "twitter_handle":
        _value = `<a href="https://twitter.com/${answers.value}">@${answers.value}</a>`
        break;
    }

    // Optionally switch by field name
    // switch (answer.fieldApiName) {
    //   case "mainPhone": // The Field API name
    //     let nationalizedPhone = Formatter.nationalizedPhoneDisplay({mainPhone: answer.value});
    //     _value = `<a href="tel:${answer.value}">${nationalizedPhone}</a>`; // The formatting for the answer
    //     break;
    // }

    return {
      // iconName: '', // Icon that appears on the top left of the direct answer card
      // iconUrl: '', // URL for Icon that appears on the top left of the direct answer card
      entityName: answer.entityName, // Root of the breadcrumb in the card heading (entityName / fieldName)
      fieldName: answer.fieldName, // Folder of the breadcrumb (entityName / fieldName)
      value: _value || answer.value, // The value of the direct answer
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
}

ANSWERS.registerComponentType(allfields_standardComponent);
