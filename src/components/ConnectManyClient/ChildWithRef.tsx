// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // a set of React node utility functions:
    isReusableUiComponent,
    
    
    
    // react helper hooks:
    useEvent,
    useMergeRefs,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import type {
    // base-components:
    GenericProps,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components



// react components:
export interface ChildWithRefProps
    extends
        // bases:
        Pick<GenericProps<Element>, 'outerRef'>,
        Pick<React.RefAttributes<Element>, 'ref'>
{
    // refs:
    childId   : React.Key
    childRefs : Map<React.Key, Element|null>
    
    
    
    // components:
    elementComponent : React.ReactElement<GenericProps<Element>|React.HTMLAttributes<HTMLElement>|React.SVGAttributes<SVGElement>>
}
export const ChildWithRef = (props: ChildWithRefProps): JSX.Element => {
    // rest props:
    const {
        // refs:
        childId,
        childRefs,
        
        
        
        // components:
        elementComponent,
    ...restComponentProps} = props;
    
    
    
    // verifies:
    const isReusableUiChildComponent : boolean = isReusableUiComponent<GenericProps<Element>>(elementComponent);
    
    
    
    // refs:
    const childOuterRefInternal = useEvent<React.RefCallback<Element>>((outerElm) => {
        childRefs.set(childId, outerElm);
    });
    const mergedChildOuterRef   = useMergeRefs(
        // preserves the original `outerRef` from `elementComponent`:
        (
            isReusableUiChildComponent
            ?
            (elementComponent.props as GenericProps<Element>).outerRef
            :
            (elementComponent.props as React.RefAttributes<Element>).ref
        ),
        
        
        
        // preserves the original `outerRef|ref` from `props`:
        (
            isReusableUiChildComponent
            ?
            (props as GenericProps<Element>).outerRef
            :
            (props as React.RefAttributes<Element>).ref
        ),
        
        
        
        childOuterRefInternal,
    );
    
    
    
    // jsx:
    return React.cloneElement<GenericProps<Element>|React.HTMLAttributes<HTMLElement>|React.SVGAttributes<SVGElement>>(elementComponent,
        // props:
        {
            // other props:
            ...restComponentProps,
            
            
            
            // refs:
            [isReusableUiChildComponent ? 'outerRef' : 'ref'] : mergedChildOuterRef,
        },
    );
};