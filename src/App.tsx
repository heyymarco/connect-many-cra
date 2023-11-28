import './App.css'

import { default as React, useState } from 'react'
import styles from './page.module.css'
import { ConnectManyProvider, ConnectManyClient, Connection, Cable, Connector } from './components/ConnectManyClient'
import { FrontalView, Header, Identifier, ActionButton } from './components/FrontalView'
import Color from 'color'



const colorOptions = [
    Color('#FF0101'),
    Color('#CC01AF'),
    Color('#BA01FF'),
    Color('#7409A5'),
    Color('#0101FF'),
    Color('#01AEAE'),
    Color('#017A01'),
    Color('#01FF01'),
    Color('#FFFF01'),
    Color('#FEB301'),
    Color('#FF7F01'),
    Color('#FF4701'),
];



function App() {
    const [cables, setCables] = useState<Connection[]>(() => [
        { sideA: 'inp-a1', sideB: 'out-c3' },
        { sideA: 'inp-b4', sideB: 'out-c1', color: Color('#01FF01') },
        { sideA: 'inp-c3', sideB: 'out-b4', color: Color('#FEB301') },
    ]);
    
    
    
    return (
        <main className='main'>
            <FrontalView theme='danger'
                header={
                    <Header
                        logo={<img src='/spongebob.svg' alt='spongebob' width={40} height={40} style={{borderRadius: '10rem'}} />}
                        title='CAEN'
                        description='Four Fold Programmable Logic Unit'
                        serial='DT1081'
                    />
                }
                identifier={
                    <Identifier theme='dark'
                        title='N1081B'
                        pid='13158'
                        ip='192.168.50.246'
                        usb='172.16.51.102'
                    >
                        <ActionButton theme='altDark' onClick={undefined}>VIEW</ActionButton>
                        <ActionButton theme='altDark' onClick={undefined}>CONFIGURE</ActionButton>
                        <ActionButton theme='altDark' onClick={undefined}>SETTINGS</ActionButton>
                    </Identifier>
                }
            >
                <ConnectManyProvider
                    // values:
                    value={cables}
                    onValueChange={setCables}
                    colorOptions={colorOptions}
                    defaultColor={colorOptions[5]}
                    
                    
                    
                    // components:
                    cableComponent={<Cable theme='cable' />}
                >
                    <ConnectManyClient
                        // variants:
                        size='md' // sm|md|lg
                        theme='chocolate'
                        // mild={true}
                        
                        
                        
                        // configs:
                        connections={{
                            inputs : {
                                // label : <>Inputs</>,
                                nodes        : [
                                    { id: 'inp-a1', label: '1' , limit: 1 },
                                    { id: 'inp-a2', label: '2' , limit: 1 },
                                    { id: 'inp-a3', label: '3' , limit: 1 },
                                    { id: 'inp-a4', label: '4' , limit: 1 },
                                    { id: 'inp-a5', label: '5' , limit: 1 },
                                    { id: 'inp-a6', label: '6' , limit: 1 },
                                ],
                                
                                gender       : 'inputs',
                                interestedTo : ['outputs'],
                                
                                leds         : {
                                    placement: 'start',
                                    items : [
                                        { label: 'NIM', active: true, theme: 'danger'  },
                                        { label: 'TTL', active: true, theme: 'success' },
                                    ],
                                },
                            },
                            outputs : {
                                // label : <>Outputs</>,
                                nodes        : [
                                    { id: 'out-a1', label: '1', limit: Infinity  },
                                    { id: 'out-a2', label: '2', limit: Infinity  },
                                    { id: 'out-a3', label: '3', limit: Infinity  },
                                    { id: 'out-a4', label: '4', limit: Infinity },
                                ],
                                
                                gender       : 'outputs',
                                interestedTo : ['inputs'],
                                
                                leds         : {
                                    placement: 'end',
                                    items : [
                                        { label: 'NIM', active: true, theme: 'warning' },
                                        { label: 'TTL', active: true, theme: 'success' },
                                    ],
                                },
                            },
                        }}
                        
                        
                        
                        // components:
                        defaultNodeComponent={<Connector theme='gold' />}
                    />
                    <ConnectManyClient
                        // variants:
                        size='md' // sm|md|lg
                        theme='leaf'
                        // mild={true}
                        
                        
                        
                        // configs:
                        connections={{
                            inputs : {
                                // label : <>Inputs</>,
                                nodes        : [
                                    { id: 'inp-b1', label: '1' , limit: 1 },
                                    { id: 'inp-b2', label: '2' , limit: 1 },
                                    { id: 'inp-b3', label: '3' , limit: 1 },
                                    { id: 'inp-b4', label: '4' , limit: 1 },
                                    { id: 'inp-b5', label: '5' , limit: 1 },
                                    { id: 'inp-b6', label: '6' , limit: 1 },
                                ],
                                
                                gender       : 'inputs',
                                interestedTo : ['outputs'],
                                
                                leds         : {
                                    placement: 'start',
                                    items : [
                                        { label: 'NIM', active: true, theme: 'danger'  },
                                        { label: 'TTL', active: true, theme: 'success' },
                                    ],
                                },
                            },
                            outputs : {
                                // label : <>Outputs</>,
                                nodes        : [
                                    { id: 'out-b1', label: '1', limit: Infinity  },
                                    { id: 'out-b2', label: '2', limit: Infinity  },
                                    { id: 'out-b3', label: '3', limit: Infinity  },
                                    { id: 'out-b4', label: '4', limit: Infinity },
                                ],
                                
                                gender       : 'outputs',
                                interestedTo : ['inputs'],
                                
                                leds         : {
                                    placement: 'end',
                                    items : [
                                        { label: 'NIM', active: true, theme: 'warning' },
                                        { label: 'TTL', active: true, theme: 'success' },
                                    ],
                                },
                            },
                        }}
                        
                        
                        
                        // components:
                        defaultNodeComponent={<Connector theme='gold' />}
                    />
                    <ConnectManyClient
                        // variants:
                        size='md' // sm|md|lg
                        theme='mint'
                        // mild={true}
                        
                        
                        
                        // configs:
                        connections={{
                            inputs : {
                                // label : <>Inputs</>,
                                nodes        : [
                                    { id: 'inp-c1', label: '1' , limit: 1 },
                                    { id: 'inp-c2', label: '2' , limit: 1 },
                                    { id: 'inp-c3', label: '3' , limit: 1 },
                                    { id: 'inp-c4', label: '4' , limit: 1 },
                                    { id: 'inp-c5', label: '5' , limit: 1 },
                                    { id: 'inp-c6', label: '6' , limit: 1 },
                                ],
                                
                                gender       : 'inputs',
                                interestedTo : ['outputs'],
                                
                                leds         : {
                                    placement: 'start',
                                    items : [
                                        { label: 'NIM', active: true, theme: 'danger'  },
                                        { label: 'TTL', active: true, theme: 'success' },
                                    ],
                                },
                            },
                            outputs : {
                                // label : <>Outputs</>,
                                nodes        : [
                                    { id: 'out-c1', label: '1', limit: Infinity  },
                                    { id: 'out-c2', label: '2', limit: Infinity  },
                                    { id: 'out-c3', label: '3', limit: Infinity  },
                                    { id: 'out-c4', label: '4', limit: Infinity },
                                ],
                                
                                gender       : 'outputs',
                                interestedTo : ['inputs'],
                                
                                leds         : {
                                    placement: 'end',
                                    items : [
                                        { label: 'NIM', active: true, theme: 'warning' },
                                        { label: 'TTL', active: true, theme: 'success' },
                                    ],
                                },
                            },
                        }}
                        
                        
                        
                        // components:
                        defaultNodeComponent={<Connector theme='gold' />}
                    />
                    <ConnectManyClient
                        // variants:
                        size='md' // sm|md|lg
                        theme='purple'
                        // mild={true}
                        
                        
                        
                        // configs:
                        connections={{
                            inputs : {
                                // label : <>Inputs</>,
                                nodes        : [
                                    { id: 'inp-d1', label: '1' , limit: 1 },
                                    { id: 'inp-d2', label: '2' , limit: 1 },
                                    { id: 'inp-d3', label: '3' , limit: 1 },
                                    { id: 'inp-d4', label: '4' , limit: 1 },
                                    { id: 'inp-d5', label: '5' , limit: 1 },
                                    { id: 'inp-d6', label: '6' , limit: 1 },
                                ],
                                
                                gender       : 'inputs',
                                interestedTo : ['outputs'],
                                
                                leds         : {
                                    placement: 'start',
                                    items : [
                                        { label: 'NIM', active: true, theme: 'danger'  },
                                        { label: 'TTL', active: true, theme: 'success' },
                                    ],
                                },
                            },
                            outputs : {
                                // label : <>Outputs</>,
                                nodes        : [
                                    { id: 'out-d1', label: '1', limit: Infinity  },
                                    { id: 'out-d2', label: '2', limit: Infinity  },
                                    { id: 'out-d3', label: '3', limit: Infinity  },
                                    { id: 'out-d4', label: '4', limit: Infinity },
                                ],
                                
                                gender       : 'outputs',
                                interestedTo : ['inputs'],
                                
                                leds         : {
                                    placement: 'end',
                                    items : [
                                        { label: 'NIM', active: true, theme: 'warning' },
                                        { label: 'TTL', active: true, theme: 'success' },
                                    ],
                                },
                            },
                        }}
                        
                        
                        
                        // components:
                        defaultNodeComponent={<Connector theme='gold' />}
                    />
                </ConnectManyProvider>
            </FrontalView>
        </main>
    );
}

export default App;
