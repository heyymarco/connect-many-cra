// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    GenericProps,
}                           from '@reusable-ui/components'

// internals:
import type {
    // react components:
    ElementWithDraggableProps,
}                           from './ElementWithDraggable'



// react components:
export interface ElementWithDroppableProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<GenericProps<TElement>,
            // droppable:
            |'onDragEnter' // already implemented internally
            |'onDragOver'  // already implemented internally
            |'onDragLeave' // already implemented internally
            |'onDrop'      // already implemented internally
            
            
            
            // children:
            |'children' // no nested children
        >,
        // draggable:
        Pick<ElementWithDraggableProps<TElement>,
            // draggable:
            |'dragDataType'
        >
{
    // identifiers:
    nodeId           : string|number
    
    
    
    // droppable:
    onDragEnter     ?: (event: React.DragEvent<TElement>, nodeId: string|number) => void
    onDragOver      ?: (event: React.DragEvent<TElement>, nodeId: string|number) => void
    onDragLeave     ?: (event: React.DragEvent<TElement>, nodeId: string|number) => void
    onDrop          ?: (event: React.DragEvent<TElement>, nodeId: string|number) => void
    
    
    
    // components:
    /**
     * Required.  
     *   
     * The underlying `<Element>` to be droppable.
     */
    elementComponent : React.ReactComponentElement<any, GenericProps<TElement>>
}
const ElementWithDroppable = <TElement extends Element = HTMLElement>(props: ElementWithDroppableProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // positions:
        nodeId,
        
        
        
        // draggable:
        dragDataType,
        
        
        
        // droppable:
        onDragEnter,
        onDragOver,
        onDragLeave,
        onDrop,
        
        
        
        // components:
        elementComponent,
    ...restGenericProps} = props;
    
    
    
    // states:
    const dragEnterCounter = useRef<number>(0);
    
    
    
    // droppable handlers:
    const handleDragEnter   = useEvent<React.DragEventHandler<TElement>>((event) => {
        // conditions:
        const isValidDragObject = event.dataTransfer.types.includes(dragDataType);
        if (!isValidDragObject) return; // unknown drag object => ignore
        
        
        
        // callback:
        dragEnterCounter.current++;
        if (dragEnterCounter.current === 1) onDragEnter?.(event, nodeId);
    });
    const handleDragOver    = useEvent<React.DragEventHandler<TElement>>((event) => {
        // conditions:
        const isValidDragObject = event.dataTransfer.types.includes(dragDataType);
        if (!isValidDragObject) return; // unknown drag object => ignore
        
        
        
        // callback:
        onDragOver?.(event, nodeId);
    });
    const handleDragLeave   = useEvent<React.DragEventHandler<TElement>>((event) => {
        // callback:
        if (dragEnterCounter.current >= 1) {
            dragEnterCounter.current--;
            if (dragEnterCounter.current === 0) onDragLeave?.(event, nodeId);
        } // if
    });
    const handleDrop        = useEvent<React.DragEventHandler<TElement>>((event) => {
        // conditions:
        const isValidDragObject = event.dataTransfer.types.includes(dragDataType);
        if (!isValidDragObject) return; // unknown drag object => ignore
        
        
        
        // events:
        event.preventDefault();
        event.stopPropagation(); // do not bubble event to the <parent>
        
        
        
        // callback:
        if (dragEnterCounter.current >= 1) {
            dragEnterCounter.current = 0;
            onDragLeave?.(event, nodeId);
        } // if
        onDrop?.(event, nodeId);
    });
    
    
    
    // jsx:
    /* <Element> */
    return React.cloneElement<GenericProps<TElement>>(elementComponent,
        // props:
        {
            // other props:
            ...restGenericProps,
            ...elementComponent.props, // overwrites restGenericProps (if any conflics)
            
            
            
            // droppable:
            onDragEnter  : handleDragEnter,
            onDragOver   : handleDragOver,
            onDragLeave  : handleDragLeave,
            onDrop       : handleDrop,
        },
    );
};
export {
    ElementWithDroppable,
    ElementWithDroppable as default,
}
