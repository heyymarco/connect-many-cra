'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // base-components:
    IndicatorProps,
    Indicator,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// styles:
import {
    useConnectManyStyleSheet,
}                           from './styles/loader'



// react components:
export interface LedProps extends IndicatorProps {}
export const Led = (props: LedProps): JSX.Element|null => {
    // styles:
    const styleSheet = useConnectManyStyleSheet();
    
    
    
    const {
        active,
        children,
    ...restIndicatorProps} = props;
    
    
    
    // jsx:
    return (
        <div className={styleSheet.led}>
            <span className='label'>
                {children}
            </span>
            <span className='indicator'>
                <Indicator
                    // other props:
                    {...restIndicatorProps}
                    
                    
                    
                    // variants:
                    size={props.size ?? 'sm'}
                    mild={props.mild ?? false}
                    
                    
                    
                    // states:
                    enabled={active}
                    
                    
                    
                    // classes:
                    className='led'
                />
            </span>
        </div>
    );
};
