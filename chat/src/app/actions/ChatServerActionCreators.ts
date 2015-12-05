import {Injectable} from 'angular2/angular2'
import {Dispatcher as ChatAppDispatcher} from '../dispatcher/ChatAppDispatcher'
import {ChatConstants} from '../constants/ChatConstants'

let ActionTypes = ChatConstants.ActionTypes;

@Injectable()
export class ChatServerActionCreators {
	constructor(private chatAppDispatcher: ChatAppDispatcher) {

	}

	receiveMessage(message) {
		this.chatAppDispatcher.dispatch({
			type: ActionTypes.RECEIVE_MESSAGE,
			message
		});
	}
	
	reciveAllMessage(messages) {
		this.chatAppDispatcher.dispatch({
			type: ActionTypes.RECEIVE_MESSAGES,
			messages
		});
	}
}