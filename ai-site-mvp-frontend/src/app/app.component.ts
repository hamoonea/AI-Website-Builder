// src/app/app.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule, NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor';
import { AiService } from './ai.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ChatComponent } from './chat.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MonacoEditorModule,
    ChatComponent
  ],
  providers: [
    {
      provide: NGX_MONACO_EDITOR_CONFIG,
      useValue: {
        baseUrl: 'assets',
        defaultOptions: { scrollBeyondLastLine: false },
        onMonacoLoad: () => {}
      }
    }
  ],
  template: `
    <div class="app-container">
      <!-- Header -->
      <header class="app-header">
        <h1>AI Site MVP</h1>
      </header>

      <!-- Main Content -->
      <div class="main-content" [class.with-chat]="html">
        <!-- Left Panel: Chat Sidebar (AI Assistant) -->
        <div class="chat-sidebar" *ngIf="html">
          <app-chat (codeUpdated)="onCodeUpdated($event)"></app-chat>
        </div>

        <!-- Right Panel: Code Generation -->
        <div class="generation-panel" [class.has-content]="html">
          <div *ngIf="!html" class="center-wrapper">
            <div class="generation-controls">
              <textarea 
                [(ngModel)]="prompt" 
                rows="3" 
                placeholder="Describe the website you want to create..."
                class="prompt-input"
              ></textarea>
              <div class="button-group">
                <button 
                  (click)="onGenerate()" 
                  [disabled]="loading"
                  class="generate-btn"
                >
                  {{ loading ? 'Generating...' : 'Generate Website' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Show editor and preview only after generation -->
          <div *ngIf="html">
            <div class="generation-controls">
              <textarea 
                [(ngModel)]="prompt" 
                rows="3" 
                placeholder="Describe the website you want to create..."
                class="prompt-input"
                style="display:none;"
              ></textarea>
              <div class="button-group" style="display:none;"></div>
            </div>
            <div class="editor-preview-container">
              <div class="editor-section">
                <h2>Code Editor</h2>
                <ngx-monaco-editor
                  [(ngModel)]="html"
                  [options]="editorOptions"
                  (ngModelChange)="onCodeChange($event)"
                  class="code-editor"
                ></ngx-monaco-editor>
              </div>
              <div class="preview-section">
                <h2>Live Preview</h2>
                <iframe
                  [srcdoc]="sanitizedHtml"
                  class="preview-frame"
                ></iframe>
              </div>
            </div>
            <div class="download-section">
              <button 
                (click)="download()" 
                class="download-btn"
              >
                Download HTML
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      min-height: 0;
      display: flex;
      flex-direction: column;
      background: #f8f9fa;
    }

    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: white;
      border-bottom: 1px solid #e9ecef;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .app-header h1 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
    }

    .main-content {
      flex: 1;
      display: flex;
      overflow: hidden;
      height: 100%;
      min-height: 0;
    }

    .main-content.with-chat {
      display: grid;
      grid-template-columns: 350px 1fr;
      height: 100%;
      min-height: 0;
    }

    .chat-sidebar {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      border-right: 1px solid #e9ecef;
      background: #f8f9fa;
      min-width: 300px;
      max-width: 400px;
      width: 100%;
      z-index: 2;
    }

    .generation-panel {
      display: flex;
      flex-direction: column;
      padding: 2rem;
      overflow-y: auto;
      justify-content: center;
      align-items: center;
      min-height: 0;
      flex: 1 1 0%;
      height: 100%;
      position: relative;
    }

    .generation-panel.has-content {
      justify-content: flex-start;
      align-items: stretch;
    }

    .center-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      min-height: 400px;
    }

    .generation-controls {
      margin-bottom: 2rem;
      width: 100%;
      max-width: 600px;
      text-align: center;
    }

    .prompt-input {
      width: 100%;
      border: 1px solid #e9ecef;
      border-radius: 0.5rem;
      padding: 1rem;
      font-family: inherit;
      font-size: 1rem;
      resize: vertical;
      margin-bottom: 1rem;
    }

    .prompt-input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .button-group {
      display: flex;
      gap: 1rem;
    }

    .generate-btn, .download-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .generate-btn {
      background: #28a745;
      color: white;
    }

    .generate-btn:hover:not(:disabled) {
      background: #218838;
    }

    .generate-btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .download-btn {
      background: #6c757d;
      color: white;
    }

    .download-btn:hover:not(:disabled) {
      background: #5a6268;
    }

    .download-btn:disabled {
      background: #adb5bd;
      cursor: not-allowed;
    }

    .editor-preview-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      flex: 1;
      min-height: 0;
    }

    .editor-section, .preview-section {
      display: flex;
      flex-direction: column;
    }

    .editor-section h2, .preview-section h2 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.25rem;
    }

    .code-editor {
      flex: 1;
      border: 1px solid #e9ecef;
      border-radius: 0.5rem;
      background: white;
      min-height: 500px;
    }

    .preview-frame {
      flex: 1;
      border: 1px solid #e9ecef;
      border-radius: 0.5rem;
      background: white;
      min-height: 500px;
    }

    .download-section {
      margin-top: 2rem;
      text-align: center;
    }

    @media (max-width: 1200px) {
      .main-content.with-chat {
        grid-template-columns: 1fr 300px;
      }
    }

    @media (max-width: 768px) {
      .main-content.with-chat {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr auto;
      }
      
      .editor-preview-container {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .app-header {
        padding: 1rem;
      }
      
      .generation-panel {
        padding: 1rem;
      }
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  prompt = '';
  html: string | null = null;
  loading = false;
  private subscription: Subscription;

  editorOptions = {
    theme: 'vs-light',
    language: 'html',
    automaticLayout: true
  };

  constructor(
    private ai: AiService, 
    private sanitizer: DomSanitizer
  ) {
    this.subscription = this.ai.conversation$.subscribe(context => {
      // Update the current code in the service when it changes in the editor
      if (this.html && context.currentCode !== this.html) {
        this.ai.setCurrentCode(this.html);
      }
    });
  }

  ngOnInit() {
    // Initialize with a sample prompt
    this.prompt = 'Create a modern landing page for a tech startup with a hero section, features, and contact form';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onGenerate() {
    if (!this.prompt.trim()) return;
    this.loading = true;
    this.ai.generate(this.prompt).subscribe({
      next: res => {
        this.html = res.html;
        this.ai.setCurrentCode(this.html);
        this.loading = false;
      },
      error: () => {
        alert('Error generating code');
        this.loading = false;
      }
    });
  }

  onCodeChange(newCode: string) {
    this.html = newCode;
    this.ai.setCurrentCode(newCode);
  }

  onCodeUpdated(updatedCode: string) {
    this.html = updatedCode;
  }

  get cleanedHtml(): string {
    if (!this.html) return '';
    // Remove code fences (```html ... ```)
    return this.html.replace(/```html\s*|```/g, '').trim();
  }

  get sanitizedHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.cleanedHtml);
  }

  download() {
    const blob = new Blob([this.cleanedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);
  }
}
