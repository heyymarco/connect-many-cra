// cssfn:
import {
    // cssfn css specific types:
    CssKnownProps,
    
    
    
    // reads/writes css variables configuration:
    cssConfig,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component




// configs:
export const [fviews, fviewValues, cssFviewConfig] = cssConfig(() => {
    const bases = {
        // spacings:
        paddingInlineSm       : spacers.sm                  as CssKnownProps['paddingInline'],
        paddingBlockSm        : spacers.sm                  as CssKnownProps['paddingBlock' ],
        paddingInlineMd       : spacers.md                  as CssKnownProps['paddingInline'],
        paddingBlockMd        : spacers.md                  as CssKnownProps['paddingBlock' ],
        paddingInlineLg       : spacers.lg                  as CssKnownProps['paddingInline'],
        paddingBlockLg        : spacers.lg                  as CssKnownProps['paddingBlock' ],
    };
    
    
    
    const defaults = {
        // spacings:
        paddingInline         : bases.paddingInlineMd       as CssKnownProps['paddingInline'],
        paddingBlock          : bases.paddingBlockMd        as CssKnownProps['paddingBlock' ],
    };
    
    
    
    return {
        ...bases,
        ...defaults,
    };
}, { prefix: 'fviews' });
