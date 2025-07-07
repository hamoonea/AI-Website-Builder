import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { DiffUtil, DiffResult } from './utils/diff.util';
import { environment } from '../environments/environment';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  codeChanges?: CodeChange[];
}

export interface CodeChange {
  type: 'addition' | 'modification' | 'deletion';
  description: string;
  diff?: string;
}

export interface ConversationContext {
  messages: ChatMessage[];
  currentCode: string;
  conversationId: string;
}

@Injectable({ providedIn: 'root' })
export class AiService {
  private conversationSubject = new BehaviorSubject<ConversationContext>({
    messages: [],
    currentCode: '',
    conversationId: this.generateId()
  });

  conversation$ = this.conversationSubject.asObservable();

  constructor(private http: HttpClient) {}

  generate(prompt: string): Observable<{ html: string }> {
    return this.http.post<{ html: string }>(`${environment.apiUrl}/api/generate`, { prompt });
  }

  chat(message: string, currentCode: string): Observable<{ 
    response: string; 
    codeChanges: CodeChange[]; 
    updatedCode?: string;
  }> {
    const context = this.conversationSubject.value;
    
    // Add user message to conversation
    const userMessage: ChatMessage = {
      id: this.generateId(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    const updatedMessages = [...context.messages, userMessage];
    
    // Update conversation context
    this.conversationSubject.next({
      ...context,
      messages: updatedMessages,
      currentCode
    });

    // Send to API with conversation context and diff information
    const diffInfo = context.currentCode ? DiffUtil.diff(context.currentCode, currentCode) : [];
    const patch = context.currentCode ? DiffUtil.createPatch(context.currentCode, currentCode) : '';

    return this.http.post<{ 
      response: string; 
      codeChanges: CodeChange[]; 
      updatedCode?: string;
    }>(`${environment.apiUrl}/api/chat`, {
      message,
      currentCode,
      conversationHistory: context.messages.map(msg => ({
        role: msg.type,
        content: msg.content
      })),
      diffInfo: diffInfo.length > 0 ? {
        changes: diffInfo,
        patch: patch,
        summary: DiffUtil.generateChangeSummary(diffInfo)
      } : null
    });
  }

  addAssistantMessage(content: string, codeChanges?: CodeChange[], updatedCode?: string) {
    const context = this.conversationSubject.value;
    const assistantMessage: ChatMessage = {
      id: this.generateId(),
      type: 'assistant',
      content,
      timestamp: new Date(),
      codeChanges
    };

    this.conversationSubject.next({
      ...context,
      messages: [...context.messages, assistantMessage],
      currentCode: updatedCode || context.currentCode
    });
  }

  clearConversation() {
    this.conversationSubject.next({
      messages: [],
      currentCode: '',
      conversationId: this.generateId()
    });
  }

  setCurrentCode(code: string) {
    const context = this.conversationSubject.value;
    this.conversationSubject.next({
      ...context,
      currentCode: code
    });
  }

  getCurrentCode(): string {
    return this.conversationSubject.value.currentCode;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
