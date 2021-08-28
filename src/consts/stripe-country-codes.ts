import localCode from 'locale-code';

// Country codes obtained from: https://stripe.com/global
// Using the following script in the devtools:
//
//      JSON.stringify($('.open')
//          .toArray()
//          .map(el => (a = $(el).children('a')[0], {
//              code: a.href.slice(a.href.indexOf('=') + 1),
//              name: $(a).children('span')[1].innerText
//          })))
//
export const stripeCountryCodes: { code: string, name: string }[] = JSON.parse(
    '[{\"code\":\"AU\",\"name\":\"Australia\"},{\"code\":\"AT\",\"name\":\"Austria\"},{\"code\":\"BE\",\"name\":\"Belgium\"},{\"code\":\"BR\",\"name\":\"Brazil\"},{\"code\":\"BG\",\"name\":\"Bulgaria\"},{\"code\":\"CA\",\"name\":\"Canada\"},{\"code\":\"CY\",\"name\":\"Cyprus\"},{\"code\":\"CZ\",\"name\":\"Czech Republic\"},{\"code\":\"DK\",\"name\":\"Denmark\"},{\"code\":\"EE\",\"name\":\"Estonia\"},{\"code\":\"FI\",\"name\":\"Finland\"},{\"code\":\"FR\",\"name\":\"France\"},{\"code\":\"DE\",\"name\":\"Germany\"},{\"code\":\"GR\",\"name\":\"Greece\"},{\"code\":\"HK\",\"name\":\"Hong Kong\"},{\"code\":\"IN\",\"name\":\"India\"},{\"code\":\"IE\",\"name\":\"Ireland\"},{\"code\":\"IT\",\"name\":\"Italy\"},{\"code\":\"JP\",\"name\":\"Japan\"},{\"code\":\"LV\",\"name\":\"Latvia\"},{\"code\":\"LT\",\"name\":\"Lithuania\"},{\"code\":\"LU\",\"name\":\"Luxembourg\"},{\"code\":\"MY\",\"name\":\"Malaysia\"},{\"code\":\"MT\",\"name\":\"Malta\"},{\"code\":\"MX\",\"name\":\"Mexico\"},{\"code\":\"NL\",\"name\":\"Netherlands\"},{\"code\":\"NZ\",\"name\":\"New Zealand\"},{\"code\":\"NO\",\"name\":\"Norway\"},{\"code\":\"PL\",\"name\":\"Poland\"},{\"code\":\"PT\",\"name\":\"Portugal\"},{\"code\":\"RO\",\"name\":\"Romania\"},{\"code\":\"SG\",\"name\":\"Singapore\"},{\"code\":\"SK\",\"name\":\"Slovakia\"},{\"code\":\"SI\",\"name\":\"Slovenia\"},{\"code\":\"ES\",\"name\":\"Spain\"},{\"code\":\"SE\",\"name\":\"Sweden\"},{\"code\":\"CH\",\"name\":\"Switzerland\"},{\"code\":\"GB\",\"name\":\"United Kingdom\"},{\"code\":\"US\",\"name\":\"United States\"}]',
);
const preferredCountryCode = navigator.languages.map(name => localCode.getCountryCode(name)).find(s => s);

// Always sort country by name, but make sure the first element
// is the preferred country code (language of the web browser)
stripeCountryCodes.sort((a, b) => {
    if (a.code === preferredCountryCode) {
        return -1;
    }
    if (b.code === preferredCountryCode) {
        return 1;
    }
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
});