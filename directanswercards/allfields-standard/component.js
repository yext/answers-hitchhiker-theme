{{> directanswercards/card_component componentName = 'allfields-standard' }}

class allfields_standardComponent extends BaseDirectAnswerCard['allfields-standard'] {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
  }

  /**
   * @param type the type of direct answer
   * @param answer the full answer returned from the API, corresponds to response.directAnswer.answer.
   * @param relatedItem profile of the related entity for the direct answer
   */
  dataForRender(type, answer, relatedItem) {
    let isArray = Array.isArray(answer.value);
    let value, arrayValue, regularValue, isRichText;

    switch (answer.fieldType) {
      case 'url':
      case 'complex_url':
      case 'ios_app_url':
      case 'android_app_url':
      case 'facebook_url':
        if (isArray) {
          arrayValue = answer.value.map((value) => ({
              url: value,
              label: value
            }
          ));
        } else {
          regularValue = {
            url: answer.value,
            label: answer.value
          };
        }
        value = isArray ? arrayValue : regularValue;
        break;
      case 'email':
        if (isArray) {
          arrayValue = answer.value.map((value) => ({
              url: `mailto:${value}`,
              label: value,
            }
          ));
        } else {
          regularValue = {
            url: `mailto:${answer.value}`,
            label: answer.value,
          };
        }
        value = isArray ? arrayValue : regularValue;
        break;
      case 'instagram_handle':
        if (isArray) {
          arrayValue = answer.value.map((value) => ({
              url: `https://instagram.com/${value}`,
              label: `@${value}`,
            }
          ));
        } else {
          regularValue = {
            url: `https://instagram.com/${answer.value}`,
            label: `@${answer.value}`,
          };
        }
        value = isArray ? arrayValue : regularValue;
        break;
      case 'twitter_handle':
        if (isArray) {
          arrayValue = answer.value.map((value) => ({
              url: `https://twitter.com/${value}`,
              label: `@${value}`,
            }
          ));
        } else {
          regularValue = {
            url: `https://twitter.com/${answer.value}`,
            label: `@${answer.value}`,
          };
        }
        value = isArray ? arrayValue : regularValue;
        break;
      case 'phone':
        if (isArray) {
          arrayValue = answer.value.map((value) => ({
              url: Formatter.phoneLink({mainPhone: value}),
              label: Formatter.nationalizedPhoneDisplay({mainPhone: value}),
            }
          ));
        } else {
          regularValue = {
            url: Formatter.phoneLink({mainPhone: answer.value}),
            label: Formatter.nationalizedPhoneDisplay({mainPhone: answer.value}),
          };
        }
        value = isArray ? arrayValue : regularValue;
        break;
      case 'address':
        if (isArray) {
          arrayValue = answer.value.map((value) => Formatter.address({address: value}));
        } else {
          regularValue = Formatter.address({address: answer.value});
        }
        value = isArray ? arrayValue : regularValue;
        break;
      case 'hours':
        if (isArray) {
          arrayValue = answer.value.map((value) => `<div>${Formatter.openStatus({hours: value})}</div>`);
        } else {
          regularValue = `<div>${Formatter.openStatus({hours: answer.value})}</div>`;
        }
        value = isArray ? arrayValue : regularValue;
        break;
      case 'decimal':
        if (isArray) {
          arrayValue = answer.value.map((value) => value.toLocaleString());
        } else {
          regularValue = answer.value.toLocaleString();
        }
        value = isArray ? arrayValue : regularValue;
        break;
      case 'rich_text':
        isRichText = true;
        if (isArray) {
          arrayValue = answer.value.map((value) => ANSWERS.formatRichText(value));
        } else {
          regularValue = ANSWERS.formatRichText(answer.value);
        }
        value = isArray ? arrayValue : regularValue;
        break;
      case 'single_line_text':
      case 'multi_line_text':
      default:
        value = answer.value;
        break;
    }

    // Optionally switch by field name
    // switch (answer.fieldApiName) {
    //   case 'mainPhone': // The Field API name
    //     if (isArray) {
    //       arrayValue = answer.value.map((value) => ({
    //           url: Formatter.phoneLink({mainPhone: value}),
    //           label: Formatter.nationalizedPhoneDisplay({mainPhone: value})
    //         }
    //       ));
    //     } else {
    //       regularValue = {
    //         url: Formatter.phoneLink({mainPhone: answer.value}),
    //         label: Formatter.nationalizedPhoneDisplay({mainPhone: answer.value})
    //       };
    //     }
    //     value = isArray ? arrayValue : regularValue;
    //     break;
    // }


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
      viewDetailsEventOptions: this.addDefaultEventOptions({
        ctaLabel: 'VIEW_DETAILS'
      }), // The event options for viewDetails click analytics
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
      isRichText: isRichText, // If the direct answer is sourced from a rich-text field
    };
  }

  /**
   * The template to render
   * @returns {string}
   * @override
   */
  static defaultTemplateName (config) {
    return 'directanswercards/allfields-standard';
  }
}

ANSWERS.registerTemplate(
  'directanswercards/allfields-standard',
  `{{{read 'directanswercards/allfields-standard/template' }}}`
);
ANSWERS.registerComponentType(allfields_standardComponent);
