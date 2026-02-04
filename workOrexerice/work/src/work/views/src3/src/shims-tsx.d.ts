/*
 * @Description: do something
 * @Author: WendyGao
 * @Date: 2022-02-08 14:42:01
 * @LastEditors: WendyGao
 * @LastEditTime: 2022-02-23 16:58:51
 */
import log4js from 'log4js'
import { EventEmitter } from 'events'
import Vue, { VNode } from 'vue'
import store from './store'
import { StatusClient, ControlClient, UpdateClient, HardwareClient, AlgorithmClient } from '@/grpc/client'
import { _changeViewPage } from './util/index'
declare module 'vue/types/vue' {
    interface Vue {
        $statusClient: StatusClient
        $controlClient: ControlClient
        $updateClient: UpdateClient
        $hardwareClient: HardwareClient
        $algClient: AlgorithmClient
        $changeViewPage: typeof _changeViewPage
        $$store: typeof store
    }
}

declare global {
    namespace JSX {
        // tslint:disable no-empty-interface
        interface Element extends VNode {}
        // tslint:disable no-empty-interface
        interface ElementClass extends Vue {}
        interface IntrinsicElements {
            [elem: string]: any
        }
    }

    interface Window {
        logger: log4js.Logger
        events: EventEmitter
        _changeViewPage: typeof _changeViewPage
    }
}
