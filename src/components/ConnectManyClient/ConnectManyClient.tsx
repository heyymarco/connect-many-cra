'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    BasicProps,
    Basic,
    IndicatorProps,
    ControlProps,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    Connector,
}                           from './Connector'
import {
    Led,
}                           from './Led'
import {
    ChildWithRef,
}                           from './ChildWithRef'

// types:
import type {
    ConnectionConfig,
}                           from './types'

// internals:
import {
    // states:
    useConnectState,
}                           from './states/connectState'

// styles:
import {
    useConnectManyClientStyleSheet,
}                           from './styles/loader'



export interface ConnectManyClientProps
    extends
        // bases:
        BasicProps
{
    // configs:
    connections    : ConnectionConfig
    
    
    
    // components:
    defaultNodeComponent ?: React.ReactComponentElement<any, ControlProps<Element>>
    defaultLedComponent  ?: React.ReactComponentElement<any, IndicatorProps<Element>>
}
export const ConnectManyClient = (props: ConnectManyClientProps): JSX.Element|null => {
    // styles:
    const styleSheet = useConnectManyClientStyleSheet();
    
    
    
    const {
        // configs:
        connections,
        
        
        
        // components:
        defaultNodeComponent = <Connector /> as React.ReactComponentElement<any, ControlProps<Element>>,
        defaultLedComponent  = <Led />       as React.ReactComponentElement<any, IndicatorProps<Element>>,
    ...restBasicProps} = props;
    
    
    
    // refs:
    const [nodeRefs] = useState<Map<React.Key, Element|null>>(() => new Map<React.Key, Element|null>());
    
    
    
    // states:
    const {
        // registrations:
        registerConnectManyClient,
        
        
        
        // states:
        isDragging,
        isDroppingAllowed,
        
        
        
        // utilities:
        verifyIsDraggable,
        
        
        
        // handlers:
        handleMouseDown,
        handleTouchStart,
        
        handleMouseMove,
        handleTouchMove,
    } = useConnectState();
    
    
    
    // effects:
    
    // register the existance of current <ConnectManyClient>:
    useIsomorphicLayoutEffect(() => {
        // setups:
        const unregisterConnectManyClient = registerConnectManyClient({
            // refs:
            nodeRefs,
            
            
            
            // configs:
            connections,
            
            
            
            // components:
            defaultNodeComponent,
        });
        
        
        
        // cleanups:
        return () => {
            unregisterConnectManyClient();
        };
    }, [nodeRefs, connections, defaultNodeComponent]);
    
    
    
    // jsx:
    return (
        <Basic
            // other props:
            {...restBasicProps}
            mainClass={styleSheet.connectManyClient}
        >
            {Object.entries(connections).map(([groupKey, {label: groupName, nodes, leds}], groupIndex) =>
                <div key={groupKey} className='group'>
                    {!!groupName && <div className='label'>{groupName}</div>}
                    <div className='nodes'>
                        {nodes.map(({id: nodeId, label, enabled = true, nodeComponent = defaultNodeComponent}, nodeIndex) => {
                            const isDraggable = verifyIsDraggable(nodeId);
                            
                            
                            
                            // jsx:
                            if (!nodeRefs.has(nodeId)) nodeRefs.delete(nodeId);
                            return (
                                <ChildWithRef
                                    // identifiers:
                                    key={nodeId || nodeIndex}
                                    
                                    
                                    
                                    // refs:
                                    childId={nodeId}
                                    childRefs={nodeRefs}
                                    
                                    
                                    
                                    // components:
                                    elementComponent={
                                        React.cloneElement(nodeComponent,
                                            // props:
                                            {
                                                // identifiers:
                                                key             : nodeId || nodeIndex,
                                                
                                                
                                                
                                                // classes:
                                                className : (
                                                    (isDragging !== nodeId)
                                                    ? ''
                                                    : (isDroppingAllowed ? 'dodrop' : 'nodrop')
                                                ),
                                                
                                                
                                                
                                                // accessibilities:
                                                'aria-readonly' : nodeComponent.props['aria-readonly'] ?? !isDraggable,
                                                enabled : enabled,
                                                
                                                
                                                
                                                // handlers:
                                                onMouseDown  : handleMouseDown,
                                                onTouchStart : handleTouchStart,
                                                
                                                onMouseMove  : handleMouseMove,
                                                onTouchMove  : handleTouchMove,
                                            },
                                            
                                            
                                            
                                            // children:
                                            nodeComponent.props.children ?? label,
                                        )
                                    }
                                />
                                // // <ElementWithDraggable
                                // //     // identifiers:
                                // //     key={nodeId || nodeIndex}
                                // //     nodeId={nodeId}
                                // //     
                                // //     
                                // //     
                                // //     // draggable:
                                // //     draggable={enabled && isDraggable}
                                // //     dragDataType={connectDragDataType}
                                // //     
                                // //     
                                // //     
                                // //     // components:
                                // //     elementComponent={
                                // //         <ElementWithDroppable
                                // //             // identifiers:
                                // //             nodeId={nodeId}
                                // //             
                                // //             
                                // //             
                                // //             // draggable:
                                // //             dragDataType={connectDragDataType}
                                // //             
                                // //             
                                // //             
                                // //             // components:
                                // //             elementComponent={
                                // //             }
                                // //             
                                // //             
                                // //             
                                // //             // droppable:
                                // //             onMouseMove={handleMouseMove}
                                // //             onTouchMove={handleTouchMove}
                                // //         />
                                // //     }
                                // //     
                                // //     
                                // //     
                                // //     // handlers:
                                // //     onMouseDown={handleMouseDown}
                                // //     onTouchStart={handleTouchStart}
                                // // />
                            );
                        })}
                    </div>
                    <div className={`leds plc-${leds?.placement ?? 'start'}`}>
                        {(leds?.items ?? []).map(({label, active, theme, ledComponent = defaultLedComponent}, itemIndex) =>
                            React.cloneElement(ledComponent,
                                // props:
                                {
                                    key    : itemIndex,
                                    active : ledComponent.props.active ?? active,
                                    theme  : ledComponent.props.theme  ?? theme,
                                },
                                
                                
                                
                                // children:
                                ledComponent.props.children ?? label,
                            )
                        )}
                    </div>
                </div>
            )}
        </Basic>
    );
};
