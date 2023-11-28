'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
    useMemo,
    useId,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useScheduleTriggerEvent,
    
    
    
    // color options of UI:
    ThemeName,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    BasicProps,
    Basic,
    IndicatorProps,
    ControlProps,
    
    
    
    // simple-components:
    Button,
    
    
    
    // status-components:
    Popup,
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
import {
    ElementWithDraggable,
}                           from './ElementWithDraggable'
import {
    ElementWithDroppable,
}                           from './ElementWithDroppable'
import {
    Cable,
    CableProps,
}                           from './Cable'

// styles:
import {
    useConnectManyStyleSheet,
}                           from './styles/loader'



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
    leds          ?: LedGroup
}
export type ConnectionConfig = {
    [key in string] : ConnectionGroup
}
export interface Connection {
    sideA : string|number
    sideB : string|number
}
export interface ConnectManyProps
    extends
        // bases:
        BasicProps,
        
        // components:
        Pick<CableProps,
            // behaviors:
            |'precisionLevel'
            |'gravityStrength'
        >
{
    // configs:
    connections    : ConnectionConfig
    
    
    
    // values:
    value ?: Connection[]
    onValueChange ?: (newValue: Connection[]) => void
    
    
    
    // animations:
    magnetTransitionInterval ?: number
    
    
    
    // components:
    defaultNodeComponent ?: React.ReactComponentElement<any, ControlProps<Element>>
    defaultLedComponent  ?: React.ReactComponentElement<any, IndicatorProps<Element>>
    cableComponent       ?: React.ReactComponentElement<any, CableProps>
}
type CableDef = Connection & Pick<CableProps, 'headX'|'headY'|'tailX'|'tailY'>
export const ConnectMany = (props: ConnectManyProps): JSX.Element|null => {
    // styles:
    const styleSheet = useConnectManyStyleSheet();
    
    
    
    const {
        // configs:
        connections,
        
        
        
        // behaviors:
        precisionLevel,
        gravityStrength,
        
        
        
        // values:
        value,
        onValueChange,
        
        
        
        // animations:
        magnetTransitionInterval = 150, // ms
        
        
        
        // components:
        defaultNodeComponent = <Connector /> as React.ReactComponentElement<any, ControlProps<Element>>,
        defaultLedComponent  = <Led />       as React.ReactComponentElement<any, IndicatorProps<Element>>,
        cableComponent       = <Cable />     as React.ReactComponentElement<any, CableProps>,
    ...restBasicProps} = props;
    const allNodes = Object.values(connections).flatMap((group) => group.nodes);
    
    
    
    // refs:
    const [nodeRefs] = useState<Map<React.Key, Element|null>>(() => new Map<React.Key, Element|null>());
    const svgRef     = useRef<SVGSVGElement|null>(null);
    
    
    
    // states:
    const [cables          , setCables          ] = useState<CableDef[]>([]);
    const [selectedCableKey, setSelectedCableKey] = useState<string|null>(null);
    const selectedCable = useMemo((): CableDef|null => {
        if (!selectedCableKey) return null;
        return cables.find(({sideA, sideB}) => selectedCableKey === `${sideA}/${sideB}`) ?? null;
    }, [cables, selectedCableKey]);
    const selectedCablePos = useMemo((): { x: number, y: number }|null => {
        if (!selectedCable) return null;
        const { headX, headY, tailX, tailY } = selectedCable;
        return {
            x : ((headX ?? 0) + (tailX ?? 0)) / 2,
            y : ((headY ?? 0) + (tailY ?? 0)) / 2,
        };
    }, [selectedCable]);
    const lastSelectedCablePos = useRef<{ x: number, y: number }|null>(selectedCablePos);
    if (selectedCablePos) lastSelectedCablePos.current = selectedCablePos;
    
    
    
    // effects:
    const [validCables, setValidCables] = useState<(Connection & { elmA : Element, elmB: Element })[]>([]);
    const [draftCable , setDraftCable ] = useState<(Connection & { elmA : Element, elmB: Element|null, transition: number, lastX: number, lastY: number })|null>(null);
    
    // watchdog for value => validCables:
    useIsomorphicLayoutEffect(() => {
        // setups:
        const newValidCables   : typeof validCables = [];
        const oldInvalidCables : Connection[] = [];
        for (const val of (value ?? [])) {
            const {sideA, sideB} = val;
            const elmA = nodeRefs.get(sideA) ?? null;
            const elmB = nodeRefs.get(sideB) ?? null;
            
            if (elmA && elmB) {
                newValidCables.push({
                    sideA,
                    elmA,
                    
                    sideB,
                    elmB,
                });
            }
            else {
                oldInvalidCables.push(val);
            } // if
        } //
        setValidCables(newValidCables);
        
        
        
        // trigger onValueChange if there's some invalid cables:
        if (onValueChange && oldInvalidCables.length) {
            triggerValueChange((value ?? []).filter((val) => !oldInvalidCables.includes(val)));
        } // if
    }, [value]);
    
    // convert validCables & draftCable => cables:
    const refreshCables = useEvent((): void => {
        // conditions:
        const svgElm = svgRef.current;
        if (!svgElm) return;
        
        
        
        const newCables : typeof cables = [];
        const {left: svgLeft, top: svgTop } = svgElm.getBoundingClientRect();
        for (const cable of [...validCables, ...(draftCable ? [draftCable] : [])]) {
            const {sideA, elmA, sideB, elmB} = cable;
            
            const rectA = elmA.getBoundingClientRect();
            const rectB = elmB?.getBoundingClientRect();
            
            const headX =         (rectA.left - svgLeft) + (rectA.width  / 2);
            const headY =         (rectA.top  - svgTop ) + (rectA.height / 2);
            const tailX = rectB ? (rectB.left - svgLeft) + (rectB.width  / 2) : pointerPositionRef.current.x;
            const tailY = rectB ? (rectB.top  - svgTop ) + (rectB.height / 2) : pointerPositionRef.current.y;
            
            const isDraftCable = 'transition' in cable;
            if (isDraftCable && !!rectB) {
                cable.lastX = tailX;
                cable.lastY = tailY;
            } // if
            
            newCables.push({
                sideA,
                headX,
                headY,
                
                sideB : !isDraftCable ? sideB : '',
                tailX : !isDraftCable ? tailX : ((cable.lastX * cable.transition) + (pointerPositionRef.current.x * (1 - cable.transition))),
                tailY : !isDraftCable ? tailY : ((cable.lastY * cable.transition) + (pointerPositionRef.current.y * (1 - cable.transition))),
            });
        } // for
        setCables(newCables);
    });
    
    // watchdog for onResize => refreshCables():
    useIsomorphicLayoutEffect(() => {
        // conditions:
        const svgElm = svgRef.current;
        if (!svgElm) return;
        
        
        
        // setups:
        refreshCables();
        
        const resizeObserver = new ResizeObserver(refreshCables);
        resizeObserver.observe(svgElm, { box: 'content-box' });
        for (const uniqueElm of new Set<Element>(validCables.map(({elmA, elmB}) => [elmA, elmB]).flat())) {
            resizeObserver.observe(uniqueElm, { box: 'border-box' });
        } // for
        
        
        
        // cleanups:
        return () => {
            resizeObserver.disconnect();
        };
    }, [validCables, draftCable]);
    
    // draft cable magnetic transition:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (!draftCable) return; // no draft cable => ignore
        if (!!draftCable.elmB ? (draftCable.transition >= 1) : (draftCable.transition <= 0)) return; // magnetic transition done => ignore
        
        
        
        // handlers:
        const transitionSpeed = (!!draftCable.elmB ? +1 : -1) / magnetTransitionInterval;
        let previousTime : number|undefined = undefined;
        const handleAnimate : FrameRequestCallback = (currentTime) => {
            if (previousTime === undefined) {
                previousTime = currentTime;
                cancelAnimating = requestAnimationFrame(handleAnimate);
                return;
            } // if
            const deltaTime = currentTime - previousTime;
            previousTime = currentTime;
            
            const remainingTransition = !!draftCable.elmB ? (1 - draftCable.transition) : draftCable.transition;
            let deltaTransition = transitionSpeed * deltaTime;
            if (!!draftCable.elmB) {
                deltaTransition = Math.min(Math.max(0, deltaTransition), +remainingTransition);
            }
            else {
                deltaTransition = Math.max(Math.min(0, deltaTransition), -remainingTransition)
            } // if
            draftCable.transition += deltaTransition;
            
            
            
            if (Math.abs(remainingTransition) > 0.01) {
                cancelAnimating = requestAnimationFrame(handleAnimate);
            }
            else {
                draftCable.transition = !!draftCable.elmB ? 1 : 0;
            } // if
            
            
            
            setDraftCable({...draftCable});
        };
        
        
        
        // setups:
        let cancelAnimating = requestAnimationFrame(handleAnimate);
        
        
        
        // cleanups:
        return () => {
            cancelAnimationFrame(cancelAnimating);
        };
    }, [draftCable, magnetTransitionInterval]);
    
    // auto unselect selected_cable if deleted:
    useIsomorphicLayoutEffect(() => {
        if (!selectedCableKey) return;
        if (!selectedCable) setSelectedCableKey(null);
    }, [selectedCableKey, selectedCable]);
    
    
    
    // events:
    const scheduleTriggerEvent        = useScheduleTriggerEvent();
    const triggerValueChange          = useEvent((newValue: Connection[]): void => {
        if (onValueChange) scheduleTriggerEvent(() => { // runs the `onValueChange` event *next after* current macroTask completed
            onValueChange(newValue);
        });
    });
    
    
    
    // handlers:
    const [isDragging       , setIsDragging       ] = useState<string|number|false>(false);
    const [isDroppingAllowed, setIsDroppingAllowed] = useState<boolean>(true);
    const pointerPositionRef          = useRef<{x: number, y: number}>({x: 0, y: 0});
    
    const calculatePointerPosition    = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        const svgElm = svgRef.current;
        if (!svgElm) return;
        const viewportRect = svgElm.getBoundingClientRect();
        const style = getComputedStyle(svgElm);
        const borderLeftWidth = Number.parseInt(style.borderLeftWidth);
        const borderTopWidth  = Number.parseInt(style.borderTopWidth);
        const [relativeX, relativeY] = [event.clientX - viewportRect.left - borderLeftWidth, event.clientY - viewportRect.top - borderTopWidth];
        // if (relativeX < 0) return;
        // if (relativeY < 0) return;
        // const borderRightWidth = Number.parseInt(style.borderLeftWidth);
        // const borderBottomWidth  = Number.parseInt(style.borderTopWidth);
        // if (relativeX > (viewportRect.width  - borderLeftWidth - borderRightWidth )) return;
        // if (relativeY > (viewportRect.height - borderTopWidth  - borderBottomWidth)) return;
        pointerPositionRef.current = {x: relativeX, y: relativeY};
    });
    const getNodeFromPoint            = useEvent((clientX: number, clientY: number): { id: string|number, elm: Element }|null => {
        const selectedNodeElms = document.elementsFromPoint(clientX, clientY);
        if (!selectedNodeElms.length) return null;
        const selectedNode = Array.from(nodeRefs.entries()).find(([key, elm]) => !!elm && selectedNodeElms.includes(elm));
        if (!selectedNode) return null;
        const [id, elm] = selectedNode;
        if (!elm) return null;
        return { id: id as (string|number), elm };
    });
    
    const handleMouseDown             = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        // conditions:
        if (!!event.currentTarget.ariaDisabled && (event.currentTarget.ariaDisabled !== 'false')) return; // ignore if disabled
        
        
        
        calculatePointerPosition(event);
        
        
        
        const selectedNode = getNodeFromPoint(event.clientX, event.clientY);
        if (
            // has selection node:
            selectedNode
        ) {
            const startingNodeId = selectedNode.id;
            if (isDragging === false) setIsDragging(startingNodeId);
            
            
            
            if (
                // still within connection limit:
                ((): boolean => {
                    const connectionLimit = allNodes.find(({id}) => (id === startingNodeId))?.limit ?? Infinity;
                    if (connectionLimit === Infinity) return true;
                    const connectedCount = (value ?? []).filter(({sideA, sideB}) => (sideA === startingNodeId) || (sideB === startingNodeId)).length;
                    return (connectionLimit > connectedCount);
                })()
            ) {
                setDraftCable({
                    sideA      : selectedNode.id,
                    elmA       : selectedNode.elm,
                    
                    sideB      : '',
                    elmB       : null,
                    
                    transition : 0,
                    lastX      : 0,
                    lastY      : 0,
                });
            } // if
        } // if
    });
    const handleDragStart             = useEvent<React.DragEventHandler<HTMLElement>>((event) => {
        handleMouseDown(event);
    });
    
    const verifyIsDroppable           = useEvent((clientX: number, clientY: number): boolean => {
        if (!draftCable) return false;
        
        
        
        const selectedNode = getNodeFromPoint(clientX, clientY);
        if (
            // has selection node:
            selectedNode
            &&
            // not point to disabled node:
            !(!!selectedNode.elm.ariaDisabled && (selectedNode.elm.ariaDisabled !== 'false'))
            &&
            // not point to the node itself:
            ((draftCable.sideA !== selectedNode.id) && (draftCable.elmA !== selectedNode.elm))
        ) {
            const startingNodeId = draftCable.sideA
            const selectedNodeId = selectedNode.id;
            if (
                // not point to self group:
                ((): boolean => {
                    const nodeGroups = Object.values(connections).map((group) => group.nodes.map((node) => node.id));
                    const sideAGroup        = nodeGroups.find((nodeGroup) => nodeGroup.includes(startingNodeId));
                    const selectedNodeGroup = nodeGroups.find((nodeGroup) => nodeGroup.includes(selectedNodeId));
                    return (sideAGroup !== selectedNodeGroup);
                })()
                &&
                // not already having exact connection:
                ((): boolean => {
                    if (!value) return true; // passed
                    if (value.some(({sideA, sideB}) =>
                        ((startingNodeId === sideA) && (selectedNodeId === sideB))
                        ||
                        ((startingNodeId === sideB) && (selectedNodeId === sideA))
                    )) return false; // failed
                    return true; // passed
                })()
                &&
                // still within connection limit:
                ((): boolean => {
                    const connectionLimit = allNodes.find(({id}) => (id === selectedNodeId))?.limit ?? Infinity;
                    if (connectionLimit === Infinity) return true;
                    const connectedCount = (value ?? []).filter(({sideA, sideB}) => (sideA === selectedNodeId) || (sideB === selectedNodeId)).length;
                    return (connectionLimit > connectedCount);
                })()
            ) {
                if (
                    // not already previously magnetized:
                    ((draftCable.sideB !== selectedNodeId) && (draftCable.elmB !== selectedNode.elm))
                ) {
                    // magnetize:
                    setDraftCable({
                        ...draftCable,
                        
                        sideB      : selectedNodeId,
                        elmB       : selectedNode.elm,
                        
                        transition : 0, // restart attach transition from cursor to node
                    });
                } // if
                
                
                
                if (!isDroppingAllowed) setIsDroppingAllowed(true);
                return true;
            }
            else {
                if (isDroppingAllowed) setIsDroppingAllowed(false);
                return false;
            } // if
        }
        else {
            if ((draftCable.sideB !== '') || (draftCable.elmB !== null)) {
                setDraftCable({
                    ...draftCable,
                    
                    sideB      : '',
                    elmB       : null,
                });
            } // if
            
            
            
            if (isDroppingAllowed) setIsDroppingAllowed(false);
            return false;
        } // if
    });
    const handleMouseMove             = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        if (isDragging === false) return;
        calculatePointerPosition(event);
        
        
        
        if (draftCable) {
            verifyIsDroppable(event.clientX, event.clientY);
            requestAnimationFrame(refreshCables);
        } // if
    });
    const handleDragOverDocument      = useEvent<React.DragEventHandler<HTMLElement>>((event) => {
        handleMouseMove(event);
    });
    const handleDragOverNode          = useEvent<React.DragEventHandler<HTMLElement>>((event) => {
        if (!isDroppingAllowed) return;
        event.dataTransfer.dropEffect = 'move';
        event.preventDefault(); // prevents the default behavior to *disallow* for dropping here
    });
    
    const handleMouseUp               = useEvent<React.MouseEventHandler<HTMLElement>>(() => {
        if (isDragging !== false) setIsDragging(false);
        
        
        
        if (draftCable && draftCable.sideB && draftCable.elmB) {
            const newValidCable : typeof validCables[number] = {
                sideA : draftCable.sideA,
                elmA  : draftCable.elmA,
                
                sideB : draftCable.sideB,
                elmB  : draftCable.elmB,
            };
            setValidCables([
                ...validCables,
                newValidCable,
            ]);
            
            
            // trigger onValueChange of a new cable:
            if (onValueChange) {
                triggerValueChange([
                    ...(value ?? []),
                    
                    {
                        sideA : draftCable.sideA,
                        sideB : draftCable.sideB,
                    },
                ]);
            } // if
        } // if
        if (draftCable) setDraftCable(null);
    });
    const handleDragEnd               = useEvent<React.DragEventHandler<HTMLElement>>((event) => {
        handleMouseUp(event);
    });
    
    
    
    // identifiers:
    const editorId     = useId().toLowerCase();
    const dragDataType = `application/${editorId}`;
    
    
    
    // global events:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (!isDragging) return; // not in dragging mode => ignore
        
        
        
        // handlers:
        const handleGlobalDragOver = (event: DragEvent) => {
            handleDragOverDocument(event as any);
        };
        const handleGlobalDragEnd  = (event: DragEvent) => {
            handleDragEnd(event as any);
        };
        
        
        
        // setups:
        document.addEventListener('dragover', handleGlobalDragOver);
        document.addEventListener('dragend' , handleGlobalDragEnd );
        
        
        
        // cleanups:
        return () => {
            document.removeEventListener('dragover', handleGlobalDragOver);
            document.removeEventListener('dragend' , handleGlobalDragEnd );
        };
    }, [isDragging]);
    
    
    
    // jsx:
    return (
        <Basic
            // other props:
            {...restBasicProps}
            mainClass={styleSheet.connectMany}
            className={isDragging ? ' dragging' : undefined}
            
            
            
            // handlers:
            onMouseMove={handleMouseMove}
            // onDragOver={handleDragOver}
            
            onMouseUp={handleMouseUp}
            // onDragEnd={handleDragEnd}
        >
            {Object.entries(connections).map(([groupKey, {label: groupName, nodes, leds}], groupIndex) =>
                <div key={groupKey} className='group'>
                    {!!groupName && <div className='label'>{groupName}</div>}
                    <div className='nodes'>
                        {nodes.map(({id: nodeId, label, limit = Infinity, enabled = true, nodeComponent = defaultNodeComponent}, nodeIndex) => {
                            const isMutable = (
                                (limit === Infinity)
                                ||
                                ((): boolean => {
                                    const connectionLimit = (allNodes.find(({id}) => (id === nodeId))?.limit ?? Infinity);
                                    if (connectionLimit === Infinity) return true;
                                    const connectedCount = (value ?? []).filter(({sideA, sideB}) => (sideA === nodeId) || (sideB === nodeId)).length;
                                    return (connectionLimit > connectedCount);
                                })()
                            );
                            
                            
                            
                            // jsx:
                            if (!nodeRefs.has(nodeId)) nodeRefs.delete(nodeId);
                            return (
                                <ElementWithDraggable
                                    // identifiers:
                                    key={nodeId || nodeIndex}
                                    nodeId={nodeId}
                                    
                                    
                                    
                                    // draggable:
                                    draggable={enabled && isMutable}
                                    dragDataType={dragDataType}
                                    
                                    
                                    
                                    // components:
                                    elementComponent={
                                        <ElementWithDroppable
                                            // identifiers:
                                            nodeId={nodeId}
                                            
                                            
                                            
                                            // draggable:
                                            dragDataType={dragDataType}
                                            
                                            
                                            
                                            // components:
                                            elementComponent={
                                                <ChildWithRef
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
                                                                'aria-readonly' : nodeComponent.props['aria-readonly'] ?? !isMutable,
                                                                enabled : enabled,
                                                            },
                                                            
                                                            
                                                            
                                                            // children:
                                                            nodeComponent.props.children ?? label,
                                                        )
                                                    }
                                                />
                                            }
                                            
                                            
                                            
                                            // droppable:
                                            onDragOver={handleDragOverNode}
                                        />
                                    }
                                    
                                    
                                    
                                    // handlers:
                                    onMouseDown={handleMouseDown}
                                    onDragStart={handleDragStart}
                                    // onDragOver={(event) => console.log(event.clientX)}
                                />
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
            <svg
                // refs:
                ref={svgRef}
                
                
                
                // classes:
                className={`cables ${!!selectedCableKey ? 'hasSelection' : ''}`}
                
                
                
                // handlers:
                onClick={(event) => {
                    if (event.target !== event.currentTarget) return; // ignores bubbles from node(s)
                    setSelectedCableKey(null);
                }}
                onKeyDown={(event) => {
                    if (event?.code?.toLowerCase() !== 'escape') return;
                    setSelectedCableKey(null);
                }}
            >
                {cables.map((cable) => {
                    const {sideA, headX, headY, sideB, tailX, tailY} = cable;
                    
                    
                    
                    // jsx:
                    const cableKey = `${sideA}/${sideB}`;
                    return React.cloneElement(cableComponent,
                        // props:
                        {
                            // identifiers:
                            key : cableKey,
                            
                            
                            
                            // classes:
                            className : `${!sideB ? 'draft' : ''} ${(!!selectedCableKey && (selectedCableKey !== cableKey)) ? 'unselect' : ''}`,
                            
                            
                            
                            // positions:
                            headX,
                            headY,
                            tailX,
                            tailY,
                            
                            
                            
                            // behaviors:
                            precisionLevel,
                            gravityStrength,
                            
                            
                            
                            // handlers:
                            onClick : () => {
                                setSelectedCableKey(cableKey);
                            },
                        }
                    )
                })}
            </svg>
            <Popup
                // variants:
                size='sm'
                theme='warning'
                mild={true}
                
                
                
                // classes:
                className='menu'
                
                
                
                // styles:
                style={lastSelectedCablePos.current ? {
                    left : `${lastSelectedCablePos.current.x}px`,
                    top  : `${lastSelectedCablePos.current.y}px`,
                } : undefined}
                
                
                
                // states:
                expanded={!!selectedCableKey}
            >
                <Button size='sm' theme='danger' onClick={() => {
                    // conditions:
                    if (!value) return;
                    if (!selectedCable) return;
                    
                    
                    
                    // actions:
                    const foundIndex = value.findIndex((val) =>
                        ((val.sideA === selectedCable.sideA) && (val.sideB === selectedCable.sideB))
                        ||
                        ((val.sideA === selectedCable.sideB) && (val.sideB === selectedCable.sideA))
                    );
                    if (foundIndex < 0) return;
                    const clonedValue = value?.slice(0) ?? [];
                    clonedValue.splice(foundIndex, 1) // remove by index
                    triggerValueChange(clonedValue);
                }}>
                    Delete
                </Button>
                <Button size='sm' theme='secondary' onClick={() => setSelectedCableKey(null)}>
                    Cancel
                </Button>
            </Popup>
        </Basic>
    );
};
