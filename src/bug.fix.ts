import { config as cssfnConfig } from '@cssfn/cssfn-dom'
cssfnConfig.asyncRender = false; // we have a bug on our css engine while performing parallel processing, right now just turn of the parallel processing
