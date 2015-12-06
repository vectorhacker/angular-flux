/// <reference path="../../typings/tsd.d.ts" />


import {Injectable, EventEmitter} from 'angular2/angular2'
import {Dispatcher as ChatAppDispatcher} from '../dispatcher/ChatAppDispatcher'
import {ChatConstants} from '../constants/ChatConstants'
import {ChatMessageUtils} from '../utils/ChatMessageUtils'

let ActionTypes = ChatConstants.ActionTypes;
let CHANGE_EVENT = 'change';

// Injectable service
@Injectable()
export class ThreadStore extends EventEmitter<string> {

	private _currentID = null;
	private _threads = {};
	public dispatchToken: number;

	// Inject dispatcher as a dependancy
	constructor(private chatAppDispatcher: ChatAppDispatcher) {
		super()
		this._register();
	}

	// Register to the dispatcher
	private _register() {
		this.dispatchToken = this
			.chatAppDispatcher
			.register(this._onAction.bind(this));
	}

	// Listen for dispatch events
	private _onAction(action) {

		switch (action.type) {

			case ActionTypes.CLICK_THREAD:
				this._currentID = action.threadID;
				this._threads[this._currentID].lastMessage.isRead = true;
				this.emitChange();
				break;

			case ActionTypes.RECEIVE_MESSAGES:
				this.init(action.messages);
				this.emitChange();
				break;

			case ActionTypes.RECEIVE_MESSAGE:
				{
					this.addMessage(action.message)
					this.emitChange()
					break;
				}

			default:
			// do nothing
		}

	}

	private addMessage(message) {
		var threadID = message.threadID;
		var thread = this._threads[threadID];
		if (thread && thread.lastMessage.timestamp > message.timestamp) {
			return;
		}
		this._threads[threadID] = {
			id: threadID,
			name: message.threadName,
			lastMessage: ChatMessageUtils.convertRawMessage(message, this._currentID)
		};
	}

	private init(rawMessages) {
		rawMessages.forEach(this.addMessage.bind(this));

		if (!this._currentID) {
			var allChrono = this.getAllChrono();
			this._currentID = allChrono[allChrono.length - 1].id;
		}

		this._threads[this._currentID].lastMessage.isRead = true;
	}

	private emitChange() {
		this.emit(CHANGE_EVENT);
	}

	// /**
	//  * @param {function} callback
	//  */
	// addChangeListener(callback) {
	// 	this.on(CHANGE_EVENT, callback);
	// }

	// /**
	//  * @param {function} callback
	//  */
	// removeChangeListener(callback) {
	// 	this.removeListener(CHANGE_EVENT, callback);
	// }

	/**
	 * @param {string} id
	 */
	get(id) {
		return this._threads[id];
	}

	getAll() {
		return this._threads;
	}

	getAllChrono() {
		var orderedThreads = [];
		for (var id in this._threads) {
			var thread = this._threads[id];
			orderedThreads.push(thread);
		}
		orderedThreads.sort(function(a, b) {
			if (a.lastMessage.date < b.lastMessage.date) {
				return -1;
			} else if (a.lastMessage.date > b.lastMessage.date) {
				return 1;
			}
			return 0;
		});
		return orderedThreads;
	}

	getCurrentID() {
		return this._currentID;
	}

	getCurrent() {
		return this.get(this.getCurrentID());
	}
}