'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    useFrontalViewStyleSheet,
}                           from './styles/loader'



// react components:
export interface HeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
    // data:
    logo        ?: React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
    title       ?: React.ReactNode
    description ?: React.ReactNode
    serial      ?: string
}
export const Header = (props: HeaderProps) => {
    // styles:
    const styleSheet = useFrontalViewStyleSheet();
    
    
    
    const {
        // data:
        logo,
        title,
        description,
        serial,
    } = props;
    
    
    
    // jsx:
    return (
        <div
            className={styleSheet.header}
        >
            {!!logo && React.cloneElement(logo,
                {
                    className : `logo ${logo?.props.className ?? ''}`,
                },
            )}
            {!!title && <h1 className='title'>{title}</h1>}
            <hr className='horz' />
            {!!description && <span className='description'>{description}</span>}
            {!!serial && <span className='serial'>{serial}</span>}
        </div>
    );
}
