import {Injectable, EventEmitter} from 'angular2/angular2'
import {Dispatcher as ChatAppDispatcher} from '../dispatcher/ChatAppDispatcher'
import {ChatConstants} from '../constants/ChatConstants'
import {ChatMessageUtils} from '../utils/ChatMessageUtils'
import {ThreadStore} from './ThreadStore'
import {MessageStore} from './MessageStore'

let ActionTypes = ChatConstants.ActionTypes;
let CHANGE_EVENT = 'change';

// Injectable service
@Injectable()
export class UnreadThreadStore extends EventEmitter<string> {

	public dispatchToken: number;

	constructor(private chatAppDispatcher: ChatAppDispatcher, private threadStore: ThreadStore, private messageStore: MessageStore) {

		super()
		this._register();
	}

	private emitChange() {
		// this.emit(CHANGE_EVENT);
		this.emit(CHANGE_EVENT)
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

	getCount() {
		var threads = this.threadStore.getAll();
		var unreadCount = 0;
		for (var id in threads) {
			if (!threads[id].lastMessage.isRead) {
				unreadCount++;
			}
		}
		return unreadCount;
	}

	// Register with dispatcher
	private _register() {
		this.dispatchToken = this.chatAppDispatcher.register(this.onAction.bind(this));
	}

	// Listen for dispatch events
	private onAction(action) {
		this.chatAppDispatcher.waitFor([
			this.threadStore.dispatchToken,
			this.messageStore.dispatchToken
		], () => {
			switch (action.type) {

				case ActionTypes.RECEIVE_MESSAGES:
				case ActionTypes.RECEIVE_MESSAGE:
				case ActionTypes.CLICK_THREAD:
					this.emitChange();
					break;

				default:
				// do nothing
			}
		});


	}
} 