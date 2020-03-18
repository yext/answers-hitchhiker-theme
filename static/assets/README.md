Put images for your design under the `assets/images` directory and fonts under `assets/fonts`.

They can be referenced from SCSS via: `url(assets/images/foo.png);`

From JS via: `require('assets/images/foo.png');`

Remember when you use the image in JS to include BaseUrl, like so:
```
let exampleImage = document.createElement('img');
exampleImage.src = `${Yext.BaseUrl}${require('assets/images/foo.png')}`
document.body.appendChild(exampleImage);
```

From Soy via: `{$baseUrl}assets/images/foo.png`

The full path string 'assets/images/foo.png' must be present in order for
everything to work properly, it cannot be constructed dynamically.

For example if you have images based on the result of a multi-option custom field, you can't use the name of the field to construct the image. This example comes from stores.fye.com:

example.json:
```
{
  "customSchema": {
    "Store Services": {
      "choices": {
        "Free Wi-Fi": 5790,
        "Mix \u0026 Burn": 5789,
        "Sell Used Music \u0026 Movies": 5788
      },
      "id": 13813,
      "name": "Store Services",
      "type": "MULTI_OPTION"
    }
  }
}
```

fancy old way:
```
/**
 * StoreService
 * @param serviceText
 * @param baseUrl
 * @param? iconOnly
 * @param? banner
 */
{template .StoreService}
  <span class="StoreService">
    <span class="StoreService-icon">
      // used $serviceText which is value of the selected option, e.g. 'Free Wi-Fi' to construct image name
      <img src="{$baseUrl}assets/static/images/{$serviceText |slugify}{if $banner}-white{/if}.svg"
           class="icon"
           aria-hidden="true"
           alt="">
    </span>
    {sp}
    <span class="{if $iconOnly}sr-only{else}StoreService-text{/if}">
      {$serviceText}
    </span>
  </span>
{/template}
```

required (not fancy) new way:
```
/**
 * StoreService
 * @param serviceText
 * @param baseUrl
 * @param? iconOnly
 * @param? banner
 */
{template .StoreService}
  {let $servicesIcons: [
    'Free Wi-Fi' : [
      'white': 'assets/images/free-wi-fi-white.svg',
      'default': 'assets/images/free-wi-fi.svg'
    ],
    'Mix & Burn' : [
      'white': 'assets/images/mix-burn-white.svg',
      'default': 'assets/images/mix-burn.svg'
    ],
    'Sell Used Music & Movies' : [
      'white': 'assets/images/sell-used-music-movies-white.svg',
      'default': 'assets/images/sell-used-music-movies.svg'
    ]
  ]/}
  {let $colorKey}
    {if isNonnull($banner)}
      white
    {else}
      default
    {/if}
  {/let}
  <span class="StoreService">
    <span class="StoreService-icon">
      // publishing will start failing if they change the store services configuration
      <img src="{$baseUrl}{$servicesIcons[$serviceText][$colorKey]}"
           class="icon"
           aria-hidden="true"
           alt="">
    </span>
    {sp}
    <span class="{if $iconOnly}sr-only{else}StoreService-text{/if}">
      {$serviceText}
    </span>
  </span>
{/template}
```

Alternatively, if the images are SVGs, they can be combined into a single sprite file, e.g. store-services.svg and the individual sprites can be referenced by their id attribute using a #.  This will work in the new paradigm as so:

hashing-safe fancy old way
```
/**
 * StoreService
 * @param serviceText
 * @param baseUrl
 * @param? iconOnly
 * @param? banner
 */
{template .StoreService}
  <span class="StoreService">
    <span class="StoreService-icon">
      // used $serviceText which is value of the selected option, e.g. 'Free Wi-Fi' to construct image name
      <img src="{$baseUrl}assets/static/images/store-services.svg#{$serviceText |slugify}{if $banner}-white{/if}"
           class="icon"
           aria-hidden="true"
           alt="">
    </span>
    {sp}
    <span class="{if $iconOnly}sr-only{else}StoreService-text{/if}">
      {$serviceText}
    </span>
  </span>
{/template}
```
