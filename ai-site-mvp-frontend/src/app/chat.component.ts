import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService, ChatMessage, CodeChange } from './ai.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container">
      <div class="chat-header">
        <h3>AI Assistant</h3>
        <button class="clear-btn" (click)="clearChat()" title="Clear conversation">
          🗑️
        </button>
      </div>
      
      <div class="chat-messages" #messagesContainer>
        <div 
          *ngFor="let message of messages" 
          class="message"
          [class.user-message]="message.type === 'user'"
          [class.assistant-message]="message.type === 'assistant'"
        >
          <div class="message-content">
            <div class="message-text">{{ message.content }}</div>
            
            <!-- Code changes display -->
            <div *ngIf="message.codeChanges && message.codeChanges.length > 0" class="code-changes">
              <div class="changes-header">Changes made:</div>
              <div *ngFor="let change of message.codeChanges" class="change-item">
                <span class="change-type" [class]="change.type">
                  {{ change.type === 'addition' ? '➕' : change.type === 'modification' ? '✏️' : '🗑️' }}
                </span>
                <span class="change-description">{{ change.description }}</span>
              </div>
            </div>
            
            <div class="message-time">
              {{ message.timestamp | date:'shortTime' }}
            </div>
          </div>
        </div>
        
        <div *ngIf="loading" class="message assistant-message">
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="chat-input">
        <textarea
          [(ngModel)]="userInput"
          (keydown.enter)="onEnterPress($event)"
          placeholder="Ask me to modify your code... (e.g., 'make the footer sticky', 'add a hero image')"
          rows="3"
          [disabled]="loading"
        ></textarea>
        <button 
          (click)="sendMessage()" 
          [disabled]="!userInput.trim() || loading"
          class="send-btn"
        >
          {{ loading ? 'Sending...' : 'Send' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      max-height: 100%;
    }

    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      max-height: 100%;
      flex: 1 1 0%;
      background: #f8f9fa;
      border-left: none;
      border-right: 1px solid #e9ecef;
    }

    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #fff;
      border-bottom: 1px solid #e9ecef;
    }

    .chat-header h3 {
      margin: 0;
      color: #333;
    }

    .clear-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .clear-btn:hover {
      background-color: #f1f3f4;
    }

    .chat-messages {
      flex: 1 1 0%;
      overflow-y: auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-height: 0;
      max-height: 100%;
    }

    .message {
      max-width: 85%;
    }

    .user-message {
      align-self: flex-end;
    }

    .assistant-message {
      align-self: flex-start;
    }

    .message-content {
      padding: 0.75rem 1rem;
      border-radius: 1rem;
      position: relative;
    }

    .user-message .message-content {
      background: #007bff;
      color: white;
      border-bottom-right-radius: 0.25rem;
    }

    .assistant-message .message-content {
      background: white;
      color: #333;
      border: 1px solid #e9ecef;
      border-bottom-left-radius: 0.25rem;
    }

    .message-text {
      margin-bottom: 0.5rem;
      line-height: 1.4;
    }

    .message-time {
      font-size: 0.75rem;
      opacity: 0.7;
      text-align: right;
    }

    .code-changes {
      margin-top: 0.75rem;
      padding: 0.5rem;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 0.5rem;
      border-left: 3px solid #28a745;
    }

    .changes-header {
      font-weight: 600;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      color: #28a745;
    }

    .change-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
      font-size: 0.875rem;
    }

    .change-type {
      font-size: 1rem;
    }

    .change-description {
      flex: 1;
    }

    .typing-indicator {
      display: flex;
      gap: 0.25rem;
      padding: 0.5rem;
    }

    .typing-indicator span {
      width: 8px;
      height: 8px;
      background: #999;
      border-radius: 50%;
      animation: typing 1.4s infinite ease-in-out;
    }

    .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
    .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes typing {
      0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
      40% { transform: scale(1); opacity: 1; }
    }

    .chat-input {
      padding: 1rem;
      background: white;
      border-top: 1px solid #e9ecef;
    }

    .chat-input textarea {
      width: 100%;
      border: 1px solid #e9ecef;
      border-radius: 0.5rem;
      padding: 0;
      resize: none;
      font-family: inherit;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .chat-input textarea:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .send-btn {
      width: 100%;
      background: #007bff;
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .send-btn:hover:not(:disabled) {
      background: #0056b3;
    }

    .send-btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }
  `]
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Output() codeUpdated = new EventEmitter<string>();
  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;
  
  messages: ChatMessage[] = [];
  userInput = '';
  loading = false;
  private subscription: Subscription;
  private previousMessageCount = 0;

  constructor(private aiService: AiService) {
    this.subscription = this.aiService.conversation$.subscribe(
      context => this.messages = context.messages
    );
  }

  ngOnInit() {
    // Add welcome message
    if (this.messages.length === 0) {
      this.aiService.addAssistantMessage(
        "Hello! I'm your AI assistant. I can help you modify your website code. Just tell me what changes you'd like to make!"
      );
    }
  }

  ngAfterViewChecked() {
    if (this.messagesContainer && this.messages.length !== this.previousMessageCount) {
      this.scrollToBottom();
      this.previousMessageCount = this.messages.length;
    }
  }

  private scrollToBottom() {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  sendMessage() {
    if (!this.userInput.trim() || this.loading) return;

    const message = this.userInput.trim();
    this.userInput = '';
    this.loading = true;

    // Get current code from parent component
    const currentCode = this.getCurrentCode();

    this.aiService.chat(message, currentCode).subscribe({
      next: (response) => {
        this.aiService.addAssistantMessage(
          response.response,
          response.codeChanges,
          response.updatedCode
        );
        this.loading = false;
        
        // Apply code changes if provided
        if (response.updatedCode) {
          this.applyCodeChanges(response.updatedCode);
        }
      },
      error: (error) => {
        this.aiService.addAssistantMessage(
          "Sorry, I encountered an error while processing your request. Please try again."
        );
        this.loading = false;
        console.error('Chat error:', error);
      }
    });
  }

  onEnterPress(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter' && !keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      this.sendMessage();
    }
  }

  clearChat() {
    this.aiService.clearConversation();
  }

  private getCurrentCode(): string {
    return this.aiService.getCurrentCode();
  }

  private applyCodeChanges(updatedCode: string) {
    this.aiService.setCurrentCode(updatedCode);
    // Emit an event to notify parent component of code changes
    this.codeUpdated.emit(updatedCode);
  }
} 