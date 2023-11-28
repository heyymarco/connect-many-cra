'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // simple-components:
    ButtonProps,
    Button,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// styles:
import {
    useFrontalViewStyleSheet,
}                           from './styles/loader'



// react components:
export interface ActionButtonProps extends ButtonProps { }
export const ActionButton = (props: ActionButtonProps) => {
    // styles:
    const styleSheet = useFrontalViewStyleSheet();
    
    
    
    // jsx:
    return (
        <Button
            // other props:
            {...props}
            mainClass={styleSheet.actionButton}
        />
    );
}
