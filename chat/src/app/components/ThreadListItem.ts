import {Component, Input, CORE_DIRECTIVES} from 'angular2/angular2'
import {ChatThreadActionCreators} from '../actions/ChatThreadActionCreators'



@Component({
        selector: 'ThreadListItem',
        template: `
	<li
        [ng-class]="{
          'thread-list-item': true,
          'active': thread.id === currentThreadID
        }"
        (click)="_onClick()">
        <h5 className="thread-name">{{thread.name}}</h5>
        <div className="thread-time">
          {{thread.lastMessage.date.toLocaleTimeString()}}
        </div>
        <div className="thread-last-message">
          {{thread.lastMessage.text}}
        </div>
      </li>
	`,
        directives: [CORE_DIRECTIVES],
})
export class ThreadListItem {
        @Input() key;
        @Input() thread;
        @Input('current-thread') currentThreadId;
        
        private chatThreadActionCreators: ChatThreadActionCreators;

        constructor(chatThreadActionCreators: ChatThreadActionCreators) {
                this.chatThreadActionCreators = chatThreadActionCreators;
        }

        _onClick() {
                this.chatThreadActionCreators
                .clickThread(this.thread.id);
        }
}