/// <reference path="../typings/tsd.d.ts" />
import {bootstrap, provide} from 'angular2/angular2';
import {ROUTER_DIRECTIVES, ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy, Route, Router} from 'angular2/router'
import {HTTP_PROVIDERS} from 'angular2/http'

import {Dispatcher} from './dispatcher/ChatAppDispatcher';
import {ChatApp} from './components/ChatApp'
import {MessageStore} from './stores/MessageStore'
import {ThreadStore} from './stores/ThreadStore'
import {UnreadThreadStore} from './stores/UnreadThreadStore'
import {ChatMessageActionCreators} from './actions/ChatMessageActionCreators'
import {ChatServerActionCreators} from './actions/ChatServerActionCreators'
import {ChatThreadActionCreators} from './actions/ChatThreadActionCreators'
import {ChatWebAPIUtils} from './utils/ChatWebAPIUtils'

const ROUTER_STRATEGY = provide(LocationStrategy, { useClass: HashLocationStrategy });

bootstrap(ChatApp, [
	ROUTER_PROVIDERS,
	HTTP_PROVIDERS,
	ROUTER_STRATEGY,
	Dispatcher,
	MessageStore,
	ThreadStore,
	UnreadThreadStore,
	ChatMessageActionCreators,
	ChatServerActionCreators,
	ChatThreadActionCreators,
	ChatWebAPIUtils
]);