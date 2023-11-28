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
export const [conncs, conncValues, cssConncConfig] = cssConfig(() => {
    const bases = {
        // appearances:
        draggingOpacity       : 0.5                         as CssKnownProps['opacity'      ],
        
        
        
        // sizes:
        connectorInlineSizeSm : '2rem'                      as CssKnownProps['inlineSize'   ],
        connectorBlockSizeSm  : '2rem'                      as CssKnownProps['inlineSize'   ],
        connectorInlineSizeMd : '3rem'                      as CssKnownProps['inlineSize'   ],
        connectorBlockSizeMd  : '3rem'                      as CssKnownProps['inlineSize'   ],
        connectorInlineSizeLg : '4rem'                      as CssKnownProps['inlineSize'   ],
        connectorBlockSizeLg  : '4rem'                      as CssKnownProps['inlineSize'   ],
        
        
        
        // backgrounds:
        backdropBackground    : 'rgba(0,0,0, 0.5)'          as CssKnownProps['background'   ],
        
        
        
        // borders:
        cableWidthSm          : '0.3rem'                    as CssKnownProps['strokeWidth'  ],
        cableWidthMd          : '0.5rem'                    as CssKnownProps['strokeWidth'  ],
        cableWidthLg          : '0.6rem'                    as CssKnownProps['strokeWidth'  ],
        cableWidthHoverSm     : '0.4rem'                    as CssKnownProps['strokeWidth'  ],
        cableWidthHoverMd     : '0.6rem'                    as CssKnownProps['strokeWidth'  ],
        cableWidthHoverLg     : '0.7rem'                    as CssKnownProps['strokeWidth'  ],
        cableOpacityDragging  : 0.7                         as CssKnownProps['opacity'      ],
        cableOpacityBlur      : 0.3                         as CssKnownProps['opacity'      ],
        cableOverflow         : 'visible'                   as CssKnownProps['overflow'     ],
        
        
        
        // spacings:
        paddingInlineSm       : spacers.sm                  as CssKnownProps['paddingInline'],
        paddingBlockSm        : spacers.sm                  as CssKnownProps['paddingBlock' ],
        paddingInlineMd       : spacers.md                  as CssKnownProps['paddingInline'],
        paddingBlockMd        : spacers.md                  as CssKnownProps['paddingBlock' ],
        paddingInlineLg       : spacers.lg                  as CssKnownProps['paddingInline'],
        paddingBlockLg        : spacers.lg                  as CssKnownProps['paddingBlock' ],
        
        
        
        // typos:
        connectorFontSizeSm   : '1rem'                      as CssKnownProps['fontSize'     ],
        connectorFontSizeMd   : '2rem'                      as CssKnownProps['fontSize'     ],
        connectorFontSizeLg   : '3rem'                      as CssKnownProps['fontSize'     ],
    };
    
    
    
    const defaults = {
        // sizes:
        connectorInlineSize   : bases.connectorInlineSizeMd as CssKnownProps['inlineSize'   ],
        connectorBlockSize    : bases.connectorBlockSizeMd  as CssKnownProps['inlineSize'   ],
        
        
        
        // borders:
        cableWidth            : bases.cableWidthMd          as CssKnownProps['strokeWidth'  ],
        cableWidthHover       : bases.cableWidthHoverMd     as CssKnownProps['strokeWidth'  ],
        
        
        
        // spacings:
        paddingInline         : bases.paddingInlineMd       as CssKnownProps['paddingInline'],
        paddingBlock          : bases.paddingBlockMd        as CssKnownProps['paddingBlock' ],
        
        
        
        // typos:
        connectorFontSize     : bases.connectorFontSizeMd   as CssKnownProps['fontSize'     ],
    };
    
    
    
    return {
        ...bases,
        ...defaults,
    };
}, { prefix: 'connc' });
