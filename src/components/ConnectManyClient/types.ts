// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // color options of UI:
    ThemeName,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    IndicatorProps,
    ControlProps,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// other libs:
import type Color           from 'color'                        // color utilities



export interface ConnectionNode {
    id             : string|number
    label         ?: React.ReactNode
    limit         ?: number
    enabled       ?: boolean
    nodeComponent ?: React.ReactComponentElement<any, ControlProps<Element>>
}
export interface LedNode {
    label         ?: React.ReactNode
    active        ?: boolean
    theme         ?: ThemeName
    ledComponent  ?: React.ReactComponentElement<any, IndicatorProps<Element>>
}
export interface LedGroup {
    placement     ?: 'start'|'end'
    items         ?: LedNode[]
}
export interface ConnectionGroup {
    label         ?: React.ReactNode
    nodes          : ConnectionNode[]
    gender        ?: string
    interestedTo  ?: string[]
    leds          ?: LedGroup
}
export type ConnectionConfig = {
    [key in string] : ConnectionGroup
}
export interface Connection {
    sideA  : string|number
    sideB  : string|number
    color ?: Color
}
