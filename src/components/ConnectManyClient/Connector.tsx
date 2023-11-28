'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // base-components:
    ControlProps,
    Control,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// styles:
import {
    useConnectManyClientStyleSheet,
}                           from './styles/loader'



// react components:
export interface ConnectorProps extends ControlProps {}
export const Connector = (props: ConnectorProps): JSX.Element|null => {
    // styles:
    const styleSheet = useConnectManyClientStyleSheet();
    
    
    
    // jsx:
    return (
        <Control
            // other props:
            {...props}
            
            
            
            // variants:
            size={props.size ?? 'sm'}
            mild={props.mild ?? false}
            
            
            
            // classes:
            mainClass={styleSheet.connector}
        />
    );
};
