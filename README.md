# Answers Hitchhiker Theme

A [Jambo](https://github.com/yext/jambo) theme for building and customizing Answers experiences.

Additonal resources for integrating Answers can be found at https://hitchhikers.yext.com/

Need help? Ask a question in the [Hitchhiker's Community](https://hitchhikers.yext.com/community/c/answers)

## Getting Started

### Prerequesites
- Jambo, a static site generator, which can be installed with `npm i jambo -g`
- An Answers experience configured on yext.com. This will provide the `experienceKey` and the `apiKey`.

### Creating an Answers site

Inside a new directory, initialize jambo with the theme:
```bash
npx jambo init --theme answers-hitchhiker-theme
```

Add a universal search page:
```bash
npx jambo page --name index --template universal-standard
```

Inside config/global_config.json, delete the "//" before "apiKey" and enter your `apiKey`. Do the same for the `experienceKey` inside config/locale_config.json.
You can find examples inside test-site/config.

Build the site:
```bash
npx jambo build && grunt webpack
```

Finally, serve the site:
```bash
npx serve public
```

The site should now be available at http://localhost:5000

## Custom Jambo Commands

This theme makes the following commands available when Jambo imports this theme.

#### Add Vertical Command
Creates a vertical page of an Answers experience

Example usage:
```bash
jambo vertical --name Locations --verticalKey locations --template vertical-standard
```

Run `jambo vertical --help` for more info

#### Add Card Command
Creates a new, custom card based on an existing card.

Example usage:
```bash
jambo card --name custom-location --templateCardFolder cards/location-standard
```

Run `jambo card --help` for more info

#### Add Direct Answer Card
Creates a new, custom direct answer card.

Example usage:
```bash
jambo directanswercard --name custom-directanswer --templateCardFolder directanswercards/documentsearch-standard
```

Run `jambo directanswercard --help` for more info