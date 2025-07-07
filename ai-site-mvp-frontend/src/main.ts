// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom }  from '@angular/core';
import { BrowserModule }       from '@angular/platform-browser';
import { FormsModule }         from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { AppComponent }        from './app/app.component';

// Monaco Editor worker config for Angular: use Blob loader with fully qualified absolute URL
(window as any).MonacoEnvironment = {
  getWorkerUrl: function (moduleId: string, label: string) {
    const base = window.location.origin + '/assets/monaco-editor/min/';
    const proxy = URL.createObjectURL(
      new Blob([
        `self.MonacoEnvironment = { baseUrl: '${base}' };
        importScripts('${base}vs/base/worker/workerMain.js');`
      ], { type: 'text/javascript' })
    );
    return proxy;
  }
};

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      FormsModule,
      HttpClientModule
    )
  ]
}).catch(err => console.error(err));
