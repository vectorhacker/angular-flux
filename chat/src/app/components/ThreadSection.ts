import {Component, CORE_DIRECTIVES} from 'angular2/angular2'
import {ThreadListItem} from './ThreadListItem'
import {ThreadStore} from '../stores/ThreadStore'
import {UnreadThreadStore} from '../stores/UnreadThreadStore'


// Illustrates use of input property attributes and data binding to them.
@Component({
  selector: 'ThreadSection',
  template: `
	  <div class="thread-section">
        <div class="thread-count">
          <span *ng-if="unreadCount !== 0">
            Unread threads: {{unreadCount}}
          </span>
        </div>
        <ul class="thread-list">
          <ThreadListItem *ng-for="#thread of threads"
            [key]="thread.id"
            [thread]="thread"
            [current-thread]="getCurrentThreadID()"></ThreadListItem>
          </ul>
      </div>
	`,
  directives: [ThreadListItem, CORE_DIRECTIVES]
})
export class ThreadSection {
  threads;
  currentThreadID: string = '';
  unreadCount = 0;
  
  getCurrentThreadID() {
    return this.currentThreadID;
  }

  // Include needed models
  constructor(private threadStore: ThreadStore, private unreadThreadStore: UnreadThreadStore) {
    // Start listening for changes on model
    this.threadStore.addChangeListener(this._onChange.bind(this));

    this.getInitialState();
  }

  getStateFromStores() {
    return {
      threads: this.threadStore.getAllChrono(),
      currentThreadID: this.threadStore.getCurrentID(),
      unreadCount: this.unreadThreadStore.getCount()
    };
  }
  
  getInitialState() {
    let state = this.getStateFromStores();
    this.setState(state);
  }

  ngOnDestroy() {
    this.threadStore.removeChangeListener(this._onChange.bind(this));
  }
  
  private setState(state) {
    this.threads = state.threads;
    this.currentThreadID = state.currentThreadID;
    this.unreadCount = state.unreadCount;
  }

  // Listen for changes on model
  private _onChange() {
    this.setState(this.getStateFromStores());
  }

}