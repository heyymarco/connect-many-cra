'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useMemo,
}                           from 'react'

// reusable-ui core:
import {
    // color options of UI:
    usesThemeable,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Basic,
    
    
    
    // simple-components:
    Button,
    
    
    
    // menu-components:
    DropdownButtonProps,
    DropdownButton,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// other libs:
import type Color           from 'color'                        // color utilities

// styles:
import {
    useConnectManyClientStyleSheet,
}                           from './styles/loader'



export interface ColorPickerProps extends Omit<DropdownButtonProps, 'value'|'children'> {
    // value:
    value         ?: Color
    onValueChange ?: (newValue: Color) => void
    
    valueOptions  ?: Color[]
}
export const ColorPicker = (props: ColorPickerProps): JSX.Element|null => {
    // styles:
    const styleSheet = useConnectManyClientStyleSheet();
    
    
    
    const {
        // value:
        value,
        onValueChange,
        
        valueOptions = [],
    ...restDropdownButtonProps} = props;
    
    
    
    // states:
    const [expanded, setExpanded] = useState<boolean>(false);
    
    
    
    // styles:
    const {themeableVars} = usesThemeable();
    const style = useMemo<React.CSSProperties>(() => {
        return {
            [
                themeableVars.backg
                .slice(4, -1) // fix: var(--customProp) => --customProp
            ] : value?.hexa(),
        };
    }, [value]);
    
    
    
    // jsx:
    return (
        <DropdownButton
            // other props:
            {...restDropdownButtonProps}
            
            
            
            // variants:
            theme='secondary'
            
            
            
            // states:
            expanded={expanded}
            onExpandedChange={({expanded}) => setExpanded(expanded)}
            
            
            
            // children:
            buttonChildren={
                <Basic style={style} />
            }
        >
            <Basic theme='secondary' className={styleSheet.colorPickerBody}>
                {valueOptions.map((valueOption, index) =>
                    <Button key={index} style={{
                        [
                            themeableVars.backg
                            .slice(4, -1) // fix: var(--customProp) => --customProp
                        ] : valueOption?.hexa(),
                    }} onClick={() => {
                        setExpanded(false);
                        onValueChange?.(valueOption);
                    }}/>
                )}
            </Basic>
        </DropdownButton>
    );
}