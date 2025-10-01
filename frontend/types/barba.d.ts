declare module '@barba/core' {
  interface ITransitionData {
    current: {
      container: HTMLElement;
      namespace?: string;
      url: {
        href: string;
        path: string;
      };
    };
    next: {
      container: HTMLElement;
      namespace?: string;
      url: {
        href: string;
        path: string;
      };
    };
    trigger: string;
  }

  interface ITransition {
    name?: string;
    from?: string | object;
    to?: string | object;
    priority?: number;
    once?(data: ITransitionData): Promise<void> | void;
    beforeLeave?(data: ITransitionData): Promise<void> | void;
    leave?(data: ITransitionData): Promise<void> | void;
    afterLeave?(data: ITransitionData): Promise<void> | void;
    beforeEnter?(data: ITransitionData): Promise<void> | void;
    enter?(data: ITransitionData): Promise<void> | void;
    afterEnter?(data: ITransitionData): Promise<void> | void;
  }

  interface IBarba {
    init(options?: {
      transitions?: ITransition[];
      views?: any[];
      debug?: boolean;
      prevent?: (args: { el: HTMLElement; href: string }) => boolean;
    }): void;
    destroy(): void;
    go?(url: string, trigger?: string): Promise<void>;
  }

  export const barba: IBarba;
  export default barba;
}