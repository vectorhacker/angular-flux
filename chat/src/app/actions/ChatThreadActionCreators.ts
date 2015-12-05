import {Injectable} from 'angular2/angular2'
import {Dispatcher as ChatAppDispatcher} from '../dispatcher/ChatAppDispatcher'
import {ChatConstants} from '../constants/ChatConstants'

let ActionTypes = ChatConstants.ActionTypes;

@Injectable()
export class ChatThreadActionCreators {
	constructor(private chatAppDispatcher: ChatAppDispatcher) {

	}

	clickThread(threadID) {
		this.chatAppDispatcher.dispatch({
			type: ActionTypes.CLICK_THREAD,
			threadID: threadID
		});
	}
}