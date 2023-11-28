'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useMemo,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    
    
    
    // color options of UI:
    usesThemeable,
    ThemeableProps,
    useThemeable,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import type {
    // base-components:
    GenericProps,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// other libs:
import * as d3 from 'd3'
import type Color           from 'color'                            // color utilities

// styles:
import {
    useConnectManyClientStyleSheet,
}                           from './styles/loader'



// types:
interface SimulatorState {
    index : number
    
    x     : number
    y     : number
    
    fx    : number
    fy    : number
    
    vx    : number
    vy    : number
}



// react components:
export interface CableProps
    extends
        // bases:
        GenericProps<SVGPathElement>,
        
        // variants:
        ThemeableProps
{
    // positions:
    headX ?: number
    headY ?: number
    tailX ?: number
    tailY ?: number
    
    
    
    // variants:
    color           ?: Color
    
    
    
    // behaviors:
    precisionLevel  ?: number
    gravityStrength ?: number
}
export const Cable = (props: CableProps): JSX.Element|null => {
    // styles:
    const styleSheet = useConnectManyClientStyleSheet();
    
    
    
    // variants:
    const themeableVariant = useThemeable(props);
    
    
    
    const {
        // variants:
        theme : _theme, // remove
        color,
        
        
        
        // positions:
        headX = 0,
        headY = 0,
        tailX = 10,
        tailY = 10,
        
        
        
        // behaviors:
        precisionLevel  = 5,
        gravityStrength = 1,
    ...restGenericProps} = props;
    
    
    
    // refs:
    const pathRef = useRef<SVGPathElement|null>(null);
    
    
    
    // effects:
    const simulatorStateRef  = useRef<SimulatorState[]|null>(null);
    const simulatorEngineRef = useRef<d3.Simulation<SimulatorState, undefined>|null>()
    useIsomorphicLayoutEffect(() => {
        // setups:
        const simulatorState = (
            new Array<null>(Math.max(1, precisionLevel))
            .fill(null)
            .map(() => ({} as SimulatorState))
        );
        
        // update head - middles - tail:
        const firstNodeState = simulatorState[0];
        const lastNodeState  = simulatorState[simulatorState.length - 1];
        
        firstNodeState.fx = headX;
        firstNodeState.fy = headY;
        lastNodeState.fx  = tailX;
        lastNodeState.fy  = tailY;
        
        for (let index = 0, max = simulatorState.length - 1; index <= max; index++) {
            const ratioIncrease = index / max;
            const ratioDecrease = 1 - ratioIncrease;
            
            simulatorState[index].x = (ratioDecrease * headX) + (ratioIncrease * tailX);
            simulatorState[index].y = (ratioDecrease * headY) + (ratioIncrease * tailY);
        } // for
        
        simulatorStateRef.current = simulatorState;
        
        const simulationNodeDrawer = (
            d3
            .line()
            .x((d: any) => d.x)
            .y((d: any) => d.y)
            .curve(d3.curveBasis)
        );
        
        const nodeLinks = (
            d3
            .pairs(simulatorState)
            .map(([source, target]) => ({ source, target }))
        );
        const simulatorEngine = (
            d3
            .forceSimulation(simulatorState)
            .force('gravity', d3.forceY(4000).strength(gravityStrength * 0.001)) // simulate gravity
            .force('collide', d3.forceCollide(20)) // simulate cable auto disentanglement (cable nodes will push each other away)
            .force('links'  , d3.forceLink(nodeLinks).strength(0.9)) // string the cables nodes together
            .on('tick', () => {
                const pathElm = pathRef.current;
                if (!pathElm) return;
                
                pathElm.setAttribute('d',
                    simulationNodeDrawer(simulatorState as any) ?? ''
                );
            }) // draw the path on each simulation tick
        );
        simulatorEngineRef.current = simulatorEngine;
        
        // measure distance between head & tail:
        const distance = Math.sqrt(
            Math.pow(lastNodeState.fx - firstNodeState.fx, 2) + Math.pow(lastNodeState.fy - firstNodeState.fy, 2)
        );
        (simulatorEngine.force('links') as any)?.distance?.(distance / precisionLevel);
        
        
        
        // cleanups:
        return () => {
            simulatorEngine.stop();
        };
    }, [precisionLevel]);
    
    const isInitialChange = useRef<boolean>(true);
    useIsomorphicLayoutEffect(() => {
        // ignore first update:
        if (isInitialChange.current) {
            isInitialChange.current = false;
            return;
        } // if
        
        const simulatorState = simulatorStateRef.current;
        if (!simulatorState) return;
        const simulatorEngine = simulatorEngineRef.current;
        if (!simulatorEngine) return;
        
        const firstNodeState = simulatorState[0];
        const lastNodeState  = simulatorState[simulatorState.length - 1];
        
        // update head & tail:
        firstNodeState.fx = headX;
        firstNodeState.fy = headY;
        lastNodeState.fx  = tailX;
        lastNodeState.fy  = tailY;
        
        // measure distance between head & tail:
        const distance = Math.sqrt(
            Math.pow(lastNodeState.fx - firstNodeState.fx, 2) + Math.pow(lastNodeState.fy - firstNodeState.fy, 2)
        );
        (simulatorEngine.force('links') as any)?.distance?.(distance / precisionLevel);
        
        // update simulator:
        simulatorEngine.alpha(1);
        simulatorEngine.restart();
    }, [headX, headY, tailX, tailY, precisionLevel]);
    
    useIsomorphicLayoutEffect(() => {
        const simulatorEngine = simulatorEngineRef.current;
        if (!simulatorEngine) return;
        
        // update simulator:
        simulatorEngine.force('gravity', d3.forceY(4000).strength(gravityStrength * 0.001)) // simulate gravity
        simulatorEngine.alpha(1);
        simulatorEngine.restart();
    }, [gravityStrength]);
    
    
    
    // styles:
    const style = useMemo<React.CSSProperties>(() => {
        const {themeableVars} = usesThemeable();
        return {
            [
                themeableVars.backg
                .slice(4, -1) // fix: var(--customProp) => --customProp
            ] : color?.hexa(),
        };
    }, [color]);
    
    
    
    // jsx:
    return (
        <path
            // other props:
            {...restGenericProps}
            
            
            
            // refs:
            ref={pathRef}
            
            
            
            // classes:
            className={`${styleSheet.cable} ${themeableVariant.class} ${props.className}`}
            
            
            
            // styles:
            style={style}
            
            
            
            // accessibilities:
            tabIndex={0}
        />
    );
}