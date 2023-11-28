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

// internal components:
import {
    ConnectManyClientProps,
}                           from '@/components/ConnectManyClient'
import type {
    HeaderProps,
}                           from './Header'
import type {
    IdentifierProps,
}                           from './Identifier'

// styles:
import {
    useFrontalViewStyleSheet,
}                           from './styles/loader'



// react components:
export interface FrontalViewProps extends Omit<BasicProps, 'children'> {
    // components:
    header     ?: React.ReactComponentElement<any, HeaderProps>
    identifier ?: React.ReactComponentElement<any, IdentifierProps>
    
    
    
    // children:
    children    : React.ReactComponentElement<any, ConnectManyClientProps>|Iterable<React.ReactComponentElement<any, ConnectManyClientProps>>
}
export const FrontalView = (props: FrontalViewProps) => {
    // styles:
    const styleSheet = useFrontalViewStyleSheet();
    
    
    
    const {
        // components:
        header,
        identifier,
        
        
        
        // children:
        children : panels,
    ...restBasicProps} = props;
    
    
    
    // jsx:
    return (
        <div
            className={styleSheet.frontalView}
        >
            <Basic
                // other props:
                {...restBasicProps}
                className='wrapper'
            >
                {!!header && React.cloneElement(header,
                    // props:
                    {
                        className : `header ${header.props.className}`,
                    },
                )}
                <div className='panels'>
                    {panels}
                </div>
                {!!identifier && React.cloneElement(identifier,
                    // props:
                    {
                        className : `identifier ${identifier.props.className}`,
                    },
                )}
            </Basic>
        </div>
    );
}
