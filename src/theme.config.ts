import '@reusable-ui/typos/effects'
import { defineTheme, colorValues, borderValues, borders } from '@reusable-ui/core'

// other libs:
import Color                from 'color'                // color utilities



// Themes:

const primaryCol = Color('#9FA742').lighten(0.8);
defineTheme('primary', primaryCol);

const goldCol = Color('#D19B3E');
defineTheme('gold', goldCol);
// @ts-ignore
colorValues.goldBold = goldCol.darken(1.2);

const cableCol = Color('#0083D0');
defineTheme('cable', cableCol);

const specialCol = Color('#FFD43F');
defineTheme('special', specialCol);

const leafCol = Color('#22974F');
defineTheme('leaf', leafCol);
// @ts-ignore
colorValues.leafBold = Color('#ffffff');

const mintCol = Color('#9FA741');
defineTheme('mint', mintCol);
// @ts-ignore
colorValues.mintBold = Color('#ffffff');

const purpleCol = Color('#6C3180');
defineTheme('purple', purpleCol);
// @ts-ignore
colorValues.purpleBold = Color('#ffffff');

const chocolateCol = Color('#752329');
defineTheme('chocolate', chocolateCol);
// @ts-ignore
colorValues.chocolateBold = Color('#ffffff');

const darkCol = Color('#000000');
defineTheme('dark', darkCol);
// @ts-ignore
colorValues.darkBold = Color('#000000');;

const altDarkCol = Color('#000000');
defineTheme('altDark', altDarkCol);
// @ts-ignore
colorValues.altDarkBold = Color('#3E7BAA');;

const greyCol = Color('#47474A');
defineTheme('grey', greyCol);
// @ts-ignore
colorValues.greyBold = greyCol.darken(0.5);

const darkBlueCol = Color('#030342');
defineTheme('darkBlue', darkBlueCol);
// @ts-ignore
colorValues.darkBlueBold = darkBlueCol.darken(0.5);



// Borders:

borderValues.defaultWidth = '4px';
borderValues.default = [[borders.style, borders.defaultWidth, borders.color]];

