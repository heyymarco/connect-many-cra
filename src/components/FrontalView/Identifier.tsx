'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // base-components:
    BasicProps,
    Basic,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// styles:
import {
    useFrontalViewStyleSheet,
}                           from './styles/loader'



// react components:
export interface IdentifierProps extends BasicProps {
    // data:
    title ?: React.ReactNode
    pid   ?: React.ReactNode
    ip    ?: string
    usb   ?: string
}
export const Identifier = (props: IdentifierProps) => {
    // styles:
    const styleSheet = useFrontalViewStyleSheet();
    
    
    
    const {
        // data:
        title,
        pid,
        ip,
        usb,
        
        
        
        // children:
        children : actions,
    ...restBasicProps} = props;
    
    
    
    // jsx:
    return (
        <Basic
            // other props:
            {...restBasicProps}
            mainClass={styleSheet.identifier}
        >
            {!!title && <h1 className='title'>{title}</h1>}
            {!!pid && <span className='pid'>PID: {pid}</span>}
            {!!actions && <div className='actions'>
                {actions}
            </div>}
            {!!ip && <span className='ip'>IP: {ip}</span>}
            {!!usb && <span className='usb'>USB: {usb}</span>}
        </Basic>
    );
}
