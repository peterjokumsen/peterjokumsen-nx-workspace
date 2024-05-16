export interface IntroductionCallToAction {
  label: string;
  onClick: (e: Event) => void;
  type?: 'primary' | 'main' | 'accent' | 'danger';
}
