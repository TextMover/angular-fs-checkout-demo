import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FastSpringService {
  private scriptIdMain = 'fsc-api';
  private scriptIdCheckout = 'fsc-api-second';

  public products = new BehaviorSubject<any[]>([]);
  public data = new BehaviorSubject<any>({});
  public isTestMode = new BehaviorSubject<boolean>(true);
  public storefront = new BehaviorSubject<string>('assignmentse.test.onfastspring.com/embedded-test');

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe(() => this.handleRouteChange());
  }

  toggleStorefront() {
    const newMode = !this.isTestMode.value;
    this.isTestMode.next(newMode);

    const newStorefront = newMode
      ? 'assignmentse.test.onfastspring.com/embedded-test'
      : localStorage.getItem('storefront') || 'assignmentse.test.onfastspring.com/embedded-test';

    this.storefront.next(newStorefront);  // ✅ Correct way to update BehaviorSubject

    console.log('Changed Storefront:', this.storefront.getValue());  // ✅ Use getValue()
  }


  private addScript(id: string, src: string, attributes: Record<string, string> = {}): HTMLScriptElement {
    let script = document.getElementById(id) as HTMLScriptElement;
    if (!script) {
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = id;
        script.src = src;

        // Apply provided attributes to the script element
        Object.keys(attributes).forEach(key => script.setAttribute(key, attributes[key]));

        // Ensure the storefront value is properly set
        script.dataset['storefront'] = this.storefront.getValue();

        document.body.appendChild(script);
    }
    return script;
}


  private removeScript(id: string) {
    const script = document.getElementById(id);
    if (script) script.remove();
  }

  private cleanupScripts() {
    if (window.fastspring?.builder) {
      window.fastspring.builder.reset();
    }
    this.removeScript(this.scriptIdMain);
    this.removeScript(this.scriptIdCheckout);
  }

  private loadCheckoutScript() {
    const checkoutScript = this.addScript(
      this.scriptIdCheckout,
      'https://sbl.onfastspring.com/sbl/0.9.5/fastspring-builder.min.js',
      { 'data-continuous': 'true' }
    );

    checkoutScript.onload = () => {
      console.log('Checkout script fully loaded');
      setTimeout(() => this.setOpacityToZero(), 1500);
    };

    checkoutScript.onerror = () => {
      console.error('Failed to load checkout script');
    };
  }

  private loadFastSpringScripts() {
    const mainScript = this.addScript(
      this.scriptIdMain,
      'https://sbl.onfastspring.com/sbl/0.9.5/fastspring-builder.min.js',
      {
        'data-continuous': 'true',
        'data-data-callback': 'fastSpringCallBack',
        'data-popup-webhook-received': 'dataPopupWebhookReceived'
      }
    );

    mainScript.onerror = () => {
      console.error('Failed to load main script');
    };

    if (this.router.url === '/checkout') {
      console.log('Adding checkout script');
      this.loadCheckoutScript();
    } else {
      console.log('Removing checkout script');
      this.removeScript(this.scriptIdCheckout);
    }
  }

  private setOpacityToZero() {
    const elements = document.querySelectorAll('#fsc-embedded-checkout-skeleton');
    elements.forEach(element => {
      if ((element as HTMLElement).style.opacity !== '0') {
        (element as HTMLElement).style.opacity = '0';
        (element as HTMLElement).style.transition = 'opacity 0.1s';
      }
    });
  }

  private handleRouteChange() {
    if (this.router.url === '/checkout') {
      this.loadCheckoutScript();
    } else {
      this.removeScript(this.scriptIdCheckout);
    }
  }

  initFastSpring() {
    // Set the FastSpring callback before loading scripts
    (window as any).fastSpringCallBack = (fastSpringData: any) => {
      this.data.next(fastSpringData);
      this.products.next(fastSpringData.groups?.flatMap((group: any) => group.items) || []);
      console.log('FastSpring Data:', fastSpringData);
    };

    this.loadFastSpringScripts();
  }
}
