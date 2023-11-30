// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
    useState,
    useMemo,
    useId,
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useScheduleTriggerEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    ControlProps,
    
    
    
    // simple-components:
    Icon,
    Button,
    
    
    
    // status-components:
    Popup,
    Badge,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    CableProps,
    Cable,
}                           from '../Cable'
import {
    ColorPicker,
}                           from '../ColorPicker'

// types:
import type {
    ConnectionConfig,
    Connection,
}                           from '../types'

// other libs:
import type Color           from 'color'                        // color utilities

// styles:
import {
    useConnectManyClientStyleSheet,
}                           from '../styles/loader'



// hooks:

// types:
interface ConnectManyClientData {
    // refs:
    nodeRefs             : Map<React.Key, Element|null>
    
    
    
    // configs:
    connections          : ConnectionConfig
    
    
    
    // components:
    defaultNodeComponent : React.ReactComponentElement<any, ControlProps<Element>>
}

type CableDef = Connection & Pick<CableProps, 'headX'|'headY'|'tailX'|'tailY'>



// states:

//#region connectState

// contexts:
export interface ConnectState {
    // registrations:
    registerConnectManyClient : (clientData: ConnectManyClientData) => (() => void)
    
    
    
    // identifiers:
    connectDragDataType       : string
    
    
    
    // states:
    isDragging                : string|number|false
    isDroppingAllowed         : boolean
    
    
    
    // utilities:
    verifyIsDraggable         : (nodeId: string | number) => boolean
    
    
    
    // handlers:
    handleMouseDown           : React.MouseEventHandler<HTMLElement>
    handleTouchStart          : React.TouchEventHandler<HTMLElement>
    
    handleMouseMove           : React.MouseEventHandler<HTMLElement>
    handleTouchMove           : React.TouchEventHandler<HTMLElement>
    
    // handleDragEnd             : React.MouseEventHandler<HTMLElement>
    // handleTouchEnd            : React.TouchEventHandler<HTMLElement>
}

const ConnectStateContext = createContext<ConnectState>({
    // registrations:
    registerConnectManyClient : () => (() => {}),
    
    
    
    // identifiers:
    connectDragDataType       : '',
    
    
    
    // states:
    isDragging                : false,
    isDroppingAllowed         : false,
    
    
    
    // utilities:
    verifyIsDraggable         : () => false,
    
    
    
    // handlers:
    handleMouseDown           : () => {},
    handleTouchStart          : () => {},
    
    handleMouseMove           : () => {},
    handleTouchMove           : () => {},
    
    // handleDragEnd             : () => {},
    // handleTouchEnd            : () => {},
});
ConnectStateContext.displayName  = 'ConnectState';

export const useConnectState = (): ConnectState => {
    return useContext(ConnectStateContext);
}



// react components:
export interface ConnectManyProviderProps
    extends
        // components:
        Pick<CableProps,
            // behaviors:
            |'precisionLevel'
            |'gravityStrength'
        >
{
    // values:
    value                    ?: Connection[]
    onValueChange            ?: (newValue: Connection[]) => void
    
    colorOptions             ?: Color[]
    defaultColor             ?: Color
    
    
    
    // animations:
    magnetTransitionInterval ?: number
    
    
    
    // components:
    cableComponent       ?: React.ReactComponentElement<any, CableProps>
}
const ConnectManyProvider = (props: React.PropsWithChildren<ConnectManyProviderProps>): JSX.Element|null => {
    // styles:
    const styleSheet = useConnectManyClientStyleSheet();
    
    
    
    // props:
    const {
        // behaviors:
        precisionLevel,
        gravityStrength,
        
        
        
        // values:
        value,
        onValueChange,
        
        colorOptions = [],
        defaultColor = undefined,
        
        
        
        // animations:
        magnetTransitionInterval = 150, // ms
        
        
        
        // components:
        cableComponent       = <Cable />     as React.ReactComponentElement<any, CableProps>,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // identifiers:
    const connectGroupId      = useId().toLowerCase();
    const connectDragDataType = `application/${connectGroupId}`;
    
    
    
    // states:
    const [clients          , setClients          ] = useState<ConnectManyClientData[]>([]);
    
    const [virtualCables    , setVirtualCables    ] = useState<(Connection & { elmA : Element, elmB: Element     , /*offsetXA: number, offsetYA: number, offsetXB: number, offsetYB: number,*/ })[]>([]);
    const [draftCable       , setDraftCable       ] = useState<(Connection & { elmA : Element, elmB: Element|null, /*offsetXA: number, offsetYA: number, offsetXB: number, offsetYB: number,*/ transition: number, lastX: number, lastY: number })|null>(null);
    
    const [isDragging       , setIsDragging       ] = useState<string|number|false>(false);
    const [isDroppingAllowed, setIsDroppingAllowed] = useState<boolean>(true);
    
    const [cables          , setCables            ] = useState<CableDef[]>([]);
    const [selectedCableKey, setSelectedCableKey  ] = useState<string|null>(null);
    const selectedCable = useMemo((): CableDef|null => {
        if (!selectedCableKey) return null;
        return cables.find(({sideA, sideB}) => selectedCableKey === `${sideA}/${sideB}`) ?? null;
    }, [cables, selectedCableKey]);
    const selectedCablePos = useMemo((): { left: string, top: string }|undefined => {
        if (!selectedCable) return undefined;
        const { headX, headY, tailX, tailY } = selectedCable;
        return {
            left : `${((headX ?? 0) + (tailX ?? 0)) / 2}px`,
            top  : `${((headY ?? 0) + (tailY ?? 0)) / 2}px`,
        };
    }, [selectedCable]);
    const lastSelectedCablePos = useRef<{ left: string, top: string }|undefined>(selectedCablePos);
    if (selectedCablePos) lastSelectedCablePos.current = selectedCablePos;
    
    const [draggingIconPos, setDraggingIconPos] = useState<{ left: string, top: string }|undefined>(undefined);
    
    
    
    // refs:
    const svgRef = useRef<SVGSVGElement|null>(null);
    
    
    
    // events:
    const scheduleTriggerEvent = useScheduleTriggerEvent();
    const triggerValueChange   = useEvent((newValue: Connection[]): void => {
        if (onValueChange) scheduleTriggerEvent(() => { // runs the `onValueChange` event *next after* current macroTask completed
            onValueChange(newValue);
        });
    });
    
    
    
    // effects:
    
    // watchdog for merging nodeRefs:
    const mergedNodeRefs   = useMemo(() => {
        return new Map<React.Key, Element|null>(
            clients
            .flatMap(({nodeRefs}) =>
                Array.from(nodeRefs.entries())
            )
        );
    }, [clients]);
    
    const mergedNodeGroups = useMemo(() => {
        return (
            clients
            .flatMap(({connections}) => Object.values(connections))
        );
    }, [clients]);
    
    const mergedNodes      = useMemo(() => {
        return (
            mergedNodeGroups
            .flatMap((group) => group.nodes)
        );
    }, [mergedNodeGroups]);
    
    // watchdog for value => virtualCables:
    useIsomorphicLayoutEffect(() => {
        // setups:
        const newVirtualCables   : typeof virtualCables = [];
        // // const oldInvalidCables : Connection[] = [];
        for (const val of (value ?? [])) {
            const {sideA, sideB, color} = val;
            const elmA = mergedNodeRefs.get(sideA) ?? null;
            const elmB = mergedNodeRefs.get(sideB) ?? null;
            
            if (elmA && elmB) {
                newVirtualCables.push({
                    sideA,
                    elmA,
                    
                    sideB,
                    elmB,
                    
                    color,
                });
            }
            // // else {
            // //     oldInvalidCables.push(val);
            // // } // if
        } //
        setVirtualCables(newVirtualCables);
        
        
        
        // // // trigger onValueChange if there's some invalid cables:
        // // if (onValueChange && oldInvalidCables.length) {
        // //     triggerValueChange((value ?? []).filter((val) => !oldInvalidCables.includes(val)));
        // // } // if
    }, [value, mergedNodeRefs]);
    
    // convert virtualCables & draftCable => cables:
    const refreshCables = useEvent((): void => {
        // conditions:
        const svgElm = svgRef.current;
        if (!svgElm) return;
        
        
        
        const newCables : typeof cables = [];
        const {left: svgLeft, top: svgTop } = svgElm.getBoundingClientRect();
        for (const cable of [...virtualCables, ...(draftCable ? [draftCable] : [])]) {
            const {sideA, elmA, sideB, elmB} = cable;
            
            const rectA = elmA.getBoundingClientRect();
            const rectB = elmB?.getBoundingClientRect();
            
            const sideANode = mergedNodes.find((node) => (node.id === sideA));
            const sideBNode = mergedNodes.find((node) => (node.id === sideB));
            
            const headX = (        (rectA.left - svgLeft) + (rectA.width  / 2)                               ) + (sideANode?.offsetX ?? 0);
            const headY = (        (rectA.top  - svgTop ) + (rectA.height / 2)                               ) + (sideANode?.offsetY ?? 0);
            const tailX = (rectB ? (rectB.left - svgLeft) + (rectB.width  / 2) : pointerPositionRef.current.x) + (sideBNode?.offsetX ?? 0);
            const tailY = (rectB ? (rectB.top  - svgTop ) + (rectB.height / 2) : pointerPositionRef.current.y) + (sideBNode?.offsetY ?? 0);
            
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
                
                color : cable.color,
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
        for (const uniqueElm of new Set<Element>(virtualCables.map(({elmA, elmB}) => [elmA, elmB]).flat())) {
            resizeObserver.observe(uniqueElm, { box: 'border-box' });
        } // for
        
        
        
        // cleanups:
        return () => {
            resizeObserver.disconnect();
        };
    }, [virtualCables, draftCable]);
    
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
    
    
    
    // registrations:
    const registerConnectManyClient   = useEvent((clientData: ConnectManyClientData): (() => void) => {
        // setups:
        setClients((current) => {
            return [...current, clientData];
        });
        
        
        
        // cleanups:
        return () => {
            setClients((current) => {
                const foundIndex = current.findIndex((client) => (client === clientData));
                if (foundIndex < 0) return current;
                
                const newClients = current.slice(0); // clone
                newClients.splice(foundIndex, 1) // remove by index
                return newClients;
            });
        };
    });
    
    
    
    
    // utilities:
    const pointerPositionRef       = useRef<{x: number, y: number}>({x: 0, y: 0});
    const calculatePointerPosition = useEvent((event: React.MouseEvent<HTMLElement> & Partial<React.TouchEvent<HTMLElement>>) => {
        const svgElm = svgRef.current;
        if (!svgElm) return;
        const viewportRect = svgElm.getBoundingClientRect();
        const style = getComputedStyle(svgElm);
        const borderLeftWidth = Number.parseInt(style.borderLeftWidth);
        const borderTopWidth  = Number.parseInt(style.borderTopWidth);
        const clientX = event.touches?.[0]?.clientX ?? event.clientX;
        const clientY = event.touches?.[0]?.clientY ?? event.clientY;
        const [relativeX, relativeY] = [clientX - viewportRect.left - borderLeftWidth, clientY - viewportRect.top - borderTopWidth];
        // if (relativeX < 0) return;
        // if (relativeY < 0) return;
        // const borderRightWidth = Number.parseInt(style.borderLeftWidth);
        // const borderBottomWidth  = Number.parseInt(style.borderTopWidth);
        // if (relativeX > (viewportRect.width  - borderLeftWidth - borderRightWidth )) return;
        // if (relativeY > (viewportRect.height - borderTopWidth  - borderBottomWidth)) return;
        pointerPositionRef.current = {x: relativeX, y: relativeY};
    });
    
    const getNodeFromPoint         = useEvent((clientX: number, clientY: number): { id: string|number, elm: Element }|null => {
        const selectedNodeElms = document.elementsFromPoint(clientX, clientY);
        if (!selectedNodeElms.length) return null;
        const selectedNode = Array.from(mergedNodeRefs.entries()).find(([key, elm]) => !!elm && selectedNodeElms.includes(elm));
        if (!selectedNode) return null;
        const [id, elm] = selectedNode;
        if (!elm) return null;
        return { id: id as (string|number), elm };
    });
    
    const verifyIsDraggable        = useEvent((nodeId: string|number): boolean => {
        const connectionLimit = mergedNodes.find(({id}) => (id === nodeId))?.limit ?? Infinity;
        if (connectionLimit === Infinity) return true;
        const connectedCount = (value ?? []).filter(({sideA, sideB}) => (sideA === nodeId) || (sideB === nodeId)).length;
        return (connectionLimit > connectedCount);
    });
    const verifyIsDroppable        = useEvent((clientX: number, clientY: number): boolean => {
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
            const startingNodeId = draftCable.sideA;
            const selectedNodeId = selectedNode.id;
            if (
                // gender & interested to are match:
                ((): boolean => {
                    const searchingNodeGroup = mergedNodeGroups.find(({nodes}) => nodes.map((node) => node.id).includes(startingNodeId));
                    const selectedNodeGroup  = mergedNodeGroups.find(({nodes}) => nodes.map((node) => node.id).includes(selectedNodeId));
                    return (
                        (!searchingNodeGroup?.interestedTo || (!!selectedNodeGroup?.gender && searchingNodeGroup.interestedTo.includes(selectedNodeGroup.gender)))
                        &&
                        (!selectedNodeGroup?.interestedTo  || (!!searchingNodeGroup?.gender && selectedNodeGroup.interestedTo.includes(searchingNodeGroup.gender)))
                    );
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
                verifyIsDraggable(selectedNodeId)
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
    const updateDraggingIconPos    = useEvent((event: MouseEvent) => {
        const newDraggingIconPos = !pointerPositionRef.current ? undefined : {
            left : `${pointerPositionRef.current.x}px`,
            top  : `${pointerPositionRef.current.y}px`,
        };
        setDraggingIconPos(newDraggingIconPos);
    });
    
    
    
    
    // handlers:
    const handleBackdropClick      = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        if (event.target !== event.currentTarget) return; // ignores bubbles from node(s)
        setSelectedCableKey(null);
    });
    const handleModalKeyDown       = useEvent<React.KeyboardEventHandler<Element>>((event) => {
        if (event?.code?.toLowerCase() !== 'escape') return;
        setSelectedCableKey(null);
    });
    
    const handleMouseDown          = useEvent((event: React.MouseEvent<HTMLElement> & Partial<React.TouchEvent<HTMLElement>>) => {
        // conditions:
        if (!!event.currentTarget.ariaDisabled && (event.currentTarget.ariaDisabled !== 'false')) return; // ignore if disabled
        
        
        
        calculatePointerPosition(event);
        updateDraggingIconPos(event as any);
        setIsDroppingAllowed(false); // reset
        
        
        
        const clientX = event.touches?.[0]?.clientX ?? event.clientX;
        const clientY = event.touches?.[0]?.clientY ?? event.clientY;
        const selectedNode = getNodeFromPoint(clientX, clientY);
        if (
            // has selection node:
            selectedNode
        ) {
            const startingNodeId = selectedNode.id;
            if (verifyIsDraggable(startingNodeId)) {
                if (isDragging === false) setIsDragging(startingNodeId);
                setDraftCable({
                    sideA      : selectedNode.id,
                    elmA       : selectedNode.elm,
                    
                    sideB      : '',
                    elmB       : null,
                    
                    transition : 0,
                    lastX      : 0,
                    lastY      : 0,
                    
                    color      : defaultColor ?? undefined, // use default color
                });
            } // if
        } // if
    });
    const handleTouchStart         = useEvent<React.TouchEventHandler<HTMLElement>>((event) => {
        handleMouseDown(event as any);
    });
    
    const handleMouseMove          = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        // conditions:
        if (!isDroppingAllowed) return;
        
        
        
        // if ('dataTransfer' in event) {
        //     event.dataTransfer.dropEffect = 'move';
        //     event.preventDefault(); // prevents the default behavior to *disallow* for dropping here
        // } // if
    });
    const handleTouchMove          = useEvent<React.TouchEventHandler<HTMLElement>>((event) => {
        handleMouseMove(event as any);
    });
    
    const handleDragEnd            = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        if (isDragging !== false) setIsDragging(false);
        
        
        
        if (draftCable && draftCable.sideB && draftCable.elmB) {
            const newVirtualCable : typeof virtualCables[number] = {
                sideA : draftCable.sideA,
                elmA  : draftCable.elmA,
                
                sideB : draftCable.sideB,
                elmB  : draftCable.elmB,
                
                color : draftCable.color,
            };
            setVirtualCables([
                ...virtualCables,
                newVirtualCable,
            ]);
            
            
            // trigger onValueChange of a new cable:
            if (onValueChange) {
                triggerValueChange([
                    ...(value ?? []),
                    
                    {
                        sideA : draftCable.sideA,
                        sideB : draftCable.sideB,
                        
                        color : draftCable.color,
                    },
                ]);
            } // if
        } // if
        if (draftCable) setDraftCable(null);
    });
    
    const handleDocumentMouseMove  = useEvent((event: MouseEvent & Partial<TouchEvent>) => {
        calculatePointerPosition(event as any);
        updateDraggingIconPos(event);
        
        
        
        if (draftCable) {
            const clientX = event.touches?.[0]?.clientX ?? event.clientX;
            const clientY = event.touches?.[0]?.clientY ?? event.clientY;
            verifyIsDroppable(clientX, clientY);
            requestAnimationFrame(refreshCables);
        } // if
    });
    const handleDocumentTouchMove  = useEvent((event: TouchEvent) => {
        handleDocumentMouseMove(event as any);
    });
    
    const handleDocumentMouseUp    = useEvent((event: MouseEvent & Partial<TouchEvent>) => {
        handleDragEnd(event as any);
    });
    const handleDocumentTouchEnd   = useEvent((event: TouchEvent) => {
        handleDocumentMouseUp(event as any);
    });
    
    
    
    // global handlers:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (isDragging === false) return; // not in dragging mode => ignore
        
        
        
        // setups:
        document.addEventListener('mousemove'  , handleDocumentMouseMove);
        document.addEventListener('touchmove'  , handleDocumentTouchMove);
        
        document.addEventListener('mouseup'    , handleDocumentMouseUp  );
        document.addEventListener('touchend'   , handleDocumentTouchEnd );
        document.addEventListener('touchcancel', handleDocumentTouchEnd );
        
        
        
        // cleanups:
        return () => {
            document.removeEventListener('mousemove'  , handleDocumentMouseMove);
            document.removeEventListener('touchmove'  , handleDocumentTouchMove);
            
            document.removeEventListener('mouseup'    , handleDocumentMouseUp  );
            document.removeEventListener('touchend'   , handleDocumentTouchEnd );
            document.removeEventListener('touchcancel', handleDocumentTouchEnd );
        };
    }, [isDragging]);
    
    
    
    // states:
    const connectState = useMemo<ConnectState>(() => ({
        // registrations:
        registerConnectManyClient,    // stable ref
        
        
        
        // identifiers:
        connectDragDataType,          // mutable value
        
        
        
        // states:
        isDragging,
        isDroppingAllowed,
        
        
        
        // utilities:
        verifyIsDraggable,            // stable ref
        
        
        
        // handlers:
        handleMouseDown,              // stable ref
        handleTouchStart,             // stable ref
        
        handleMouseMove,              // stable ref
        handleTouchMove,              // stable ref
        
        // handleDragEnd,                // stable ref
        // handleTouchEnd,               // stable ref
    }), [
        // registrations:
        // registerConnectManyClient, // stable ref
        
        
        
        // identifiers:
        connectDragDataType,
        
        
        
        // states:
        isDragging,
        isDroppingAllowed,
        
        
        
        // utilities:
        // verifyIsDraggable,         // stable ref
        
        
        
        // handlers:
        // handleMouseDown,           // stable ref
        // handleTouchStart,          // stable ref
        
        // handleMouseMove,           // stable ref
        // handleTouchMove,           // stable ref
        
        // // handleDragEnd,             // stable ref
        // // handleTouchEnd,            // stable ref
        
        
        
        virtualCables, // require to *refresh* isDraggable of <Connector>(s) in the <ConnectManyClient>
    ]);
    
    
    
    
    // jsx:
    return (
        <ConnectStateContext.Provider value={connectState}>
            {children}
            
            {!!isDragging && ((): JSX.Element|null => {
                const draggingNode      = mergedNodes.find((node) => (node.id === isDragging));
                const draggedNodeClient = !draggingNode ? undefined : clients.find((client) => Object.values(client.connections).find((connection) => connection.nodes.includes(draggingNode)));
                
                
                
                // jsx:
                if (!draggingNode) return null;
                if (!draggedNodeClient) return null;
                return (
                    <div
                        // classes:
                        className={styleSheet.draggingIcon}
                        
                        
                        
                        // styles:
                        style={draggingIconPos}
                    >
                        {React.cloneElement(draggingNode.nodeComponent ?? draggedNodeClient.defaultNodeComponent,
                            // props:
                            {
                                // classes:
                                className : 'icon',
                            },
                            
                            
                            
                            // children:
                            mergedNodes.find((node) => (node.id === isDragging))?.label
                        )}
                        <Badge
                            // variants:
                            size='sm'
                            theme={isDroppingAllowed ? 'success' : 'danger'}
                            mild={true}
                            badgeStyle='circle'
                            
                            
                            
                            // classes:
                            className='indicator'
                            
                            
                            
                            // states:
                            expanded={true}
                        >
                            <Icon
                                // appearances:
                                icon={isDroppingAllowed ? 'done_outline' : 'not_interested'}
                                
                                
                                
                                // variants:
                                theme='inherit'
                                mild={false}
                            />
                        </Badge>
                    </div>
                );
            })()}
            
            <div className={`${styleSheet.backdrop} ${!!selectedCable ? 'active' : ''} overlay`}
                // handlers:
                onClick={handleBackdropClick}
            />
            
            {!!selectedCable && ((): JSX.Element|null => {
                const sideANode       = mergedNodes.find((node) => (node.id === selectedCable.sideA));
                const sideBNode       = mergedNodes.find((node) => (node.id === selectedCable.sideB));
                const sideANodeClient = !sideANode ? undefined : clients.find((client) => Object.values(client.connections).find((connection) => connection.nodes.includes(sideANode)));
                const sideBNodeClient = !sideBNode ? undefined : clients.find((client) => Object.values(client.connections).find((connection) => connection.nodes.includes(sideBNode)));
                
                
                
                // jsx:
                if (!sideANode) return null;
                if (!sideBNode) return null;
                if (!sideANodeClient) return null;
                if (!sideBNodeClient) return null;
                return (
                    <>
                        {React.cloneElement(sideANode.nodeComponent ?? sideANodeClient.defaultNodeComponent,
                            // props:
                            {
                                // classes:
                                className : `${styleSheet.overlaySelectionNode} overlay`,
                                
                                
                                
                                // styles:
                                style     : {
                                    left : `${(selectedCable.headX ?? 0) - (sideANode.offsetX ?? 0)}px`,
                                    top  : `${(selectedCable.headY ?? 0) - (sideANode.offsetY ?? 0)}px`,
                                },
                            },
                            
                            
                            
                            // children:
                            sideANode.label
                        )}
                        {React.cloneElement(sideBNode.nodeComponent ?? sideBNodeClient.defaultNodeComponent,
                            // props:
                            {
                                // classes:
                                className : `${styleSheet.overlaySelectionNode} overlay`,
                                
                                
                                
                                // styles:
                                style     : {
                                    left : `${(selectedCable.tailX ?? 0) - (sideBNode.offsetX ?? 0)}px`,
                                    top  : `${(selectedCable.tailY ?? 0) - (sideBNode.offsetY ?? 0)}px`,
                                },
                            },
                            
                            
                            
                            // children:
                            sideBNode.label
                        )}
                    </>
                );
            })()}
            
            <svg
                // refs:
                ref={svgRef}
                
                
                
                // classes:
                className={`${styleSheet.cables} ${!!selectedCableKey ? 'hasSelection' : ''} ${isDragging ? ' dragging' : ''}`}
                
                
                
                // handlers:
                onKeyDown={handleModalKeyDown}
            >
                {cables.map((cable) => {
                    const {sideA, headX, headY, sideB, tailX, tailY, color} = cable;
                    
                    
                    
                    // jsx:
                    const cableKey = `${sideA}/${sideB}`;
                    return React.cloneElement(cableComponent,
                        // props:
                        {
                            // identifiers:
                            key : cableKey,
                            
                            
                            
                            // variants:
                            color,
                            
                            
                            
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
                className={`${styleSheet.menu} overlay`}
                
                
                
                // styles:
                style={lastSelectedCablePos.current}
                
                
                
                // states:
                expanded={!!selectedCable}
                
                
                
                // handlers:
                onKeyDown={handleModalKeyDown}
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
                <ColorPicker
                    // values:
                    value={selectedCable?.color}
                    onValueChange={(newColor) => {
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
                        clonedValue[foundIndex].color = newColor;
                        triggerValueChange(clonedValue);
                    }}
                    valueOptions={colorOptions}
                />
                <Button size='sm' theme='secondary' onClick={() => setSelectedCableKey(null)}>
                    Close
                </Button>
            </Popup>
        </ConnectStateContext.Provider>
    );
};
export {
    ConnectManyProvider,
    ConnectManyProvider as default,
}
//#endregion connectState
