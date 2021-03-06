import {Injectable, EventEmitter} from 'angular2/angular2'
// Include other services
import {Dispatcher as ChatAppDispatcher} from '../dispatcher/ChatAppDispatcher'
import {ChatConstants} from '../constants/ChatConstants'
import {ChatMessageUtils} from '../utils/ChatMessageUtils'
import {ThreadStore} from './ThreadStore'

let ActionTypes = ChatConstants.ActionTypes;
let CHANGE_EVENT = 'change';

// Injectable store extends EventEmitter
@Injectable()
export class MessageStore extends EventEmitter<string> {

	private _messages = {};
	public dispatchToken;

	// Inject dispatcher and ThreadStore
	constructor(private chatAppDispatcher: ChatAppDispatcher,
		private threadStore: ThreadStore) {
		super()
		this._register();
	}

	// listen for dispatches
	private _onDispatch(action) {

		switch (action.type) {

			case ActionTypes.CLICK_THREAD:
				this.chatAppDispatcher.waitFor(
					[this.threadStore.dispatchToken],
					() => {
						this._markAllInThreadRead(this.threadStore.getCurrentID());
						this.emitChange();
					});

				break;

			case ActionTypes.CREATE_MESSAGE:
				{
					let message = ChatMessageUtils.getCreatedMessageData(
						action.text,
						action.currentThreadID
					);
					this._messages[message.id] = message;
					this.emitChange();
					break;
				}

			case ActionTypes.RECEIVE_MESSAGE:
				{
					let message = ChatMessageUtils.convertRawMessage(action.message, this.threadStore.getCurrentID());
					this._messages[message.id] = message;
					this.emitChange();
					break;
				}
			default:
			// do nothing
		}

	}

	// Register a callback to the dispatcher
	private _register() {
		this.dispatchToken = this.chatAppDispatcher.register(this._onDispatch.bind(this));
	}

	private _addMessages(rawMessages) {
		rawMessages.forEach((message) => {
			if (!this._messages[message.id]) {
				this._messages[message.id] = ChatMessageUtils.convertRawMessage(
					message,
					this.threadStore.getCurrentID()
				);
			}
		});
	}

	private _markAllInThreadRead(threadID) {
		for (var id in this._messages) {
			if (this._messages[id].threadID === threadID) {
				this._messages[id].isRead = true;
			}
		}
	}

	emitChange() {
		this.emit(CHANGE_EVENT);
	}

	get(id) {
		return this._messages[id];
	}

	getAll() {
		return this._messages;
	}
	/**
	 * @param {string} threadID
	 */
	getAllForThread(threadID) {
		var threadMessages = [];
		for (var id in this._messages) {
			if (this._messages[id].threadID === threadID) {
				threadMessages.push(this._messages[id]);
			}
		}
		threadMessages.sort(function(a, b) {
			if (a.date < b.date) {
				return -1;
			} else if (a.date > b.date) {
				return 1;
			}
			return 0;
		});
		return threadMessages;
	}

	getAllForCurrentThread() {
		return this.getAllForThread(this.threadStore.getCurrentID());
	}
}